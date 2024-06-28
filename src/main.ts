import { GM_addValueChangeListener, GM_info, GM_xmlhttpRequest } from "$";
import { Listen, ListenType, TrackMetadata } from "./ListenBrainz";
import { MusicBrainzRelease, Track } from "./MusicBrainz";
import { YtdPlayer, YtdPlayerContext } from "./YouTube/YtdPlayer";
import { PanelIdentifier, WatchNextData } from "./YouTube/WatchNextData";
import { YtMusicBrowse } from "./YtMusicBrowse";
import { getUserConfig, sanitizeUserConfig } from "./config";
import "./settings";

const ART_TRACK_REGEX = /Provided to YouTube by .*\n\n.*? · .*\n\n.*\n\n.*\n\n(Released on: .*\n\n)?((.*:.*\n)+\n)?Auto-generated by YouTube./;
const YTINITIALDATA_REGEX = /var ytInitialData = (.+);/s;
const YTINITIALDATA_STARTSWITH = "var ytInitialData = ";
const YTMUSIC_BROWSE_REGEX = /initialData\.push\({path: '\\\/browse', params: JSON\.parse\('.*?'\), data: '(.*?)'/;
const VIDEO_SELECTOR = "ytd-player[context=\"WEB_PLAYER_CONTEXT_CONFIG_ID_KEVLAR_WATCH\"] > #container > #movie_player > div > video";

const userConfig = getUserConfig();
let { listenBrainzToken } = userConfig;
GM_addValueChangeListener("userConfig", (_name, _oldValue, newValue) => {
    const newUserConfig = sanitizeUserConfig(newValue);
    ({ listenBrainzToken } = newUserConfig);
});

const YtdPlayerConstructor = window.customElements.get("ytd-player");

// Function that destroys the current listeneing tracker.
let destroyCurrent: () => void | undefined;

// "yt-player-updated" is fired by a player when a new video is loaded. CustomEvent with player as detail.
window.addEventListener("yt-player-updated", (event) => {
    console.log("yt-player-updated", event);
    if (!(event.target instanceof YtdPlayerConstructor)) return;
    // If the player is not the main player, we don't care.
    if (event.target.context !== YtdPlayerContext.WATCH) return;

    // If the listening tracker is currently tracking, destory it in preparation for new video.
    if (destroyCurrent) destroyCurrent();
    // Start tracking new video.
    trackListening(event.target);
});

// Tracks the state of a video
async function trackListening(ytdPlayer: YtdPlayer) {
    // Get the video element
    const video = document.querySelector<HTMLVideoElement>(VIDEO_SELECTOR);
    if (video === null) return;

    // MusicBrainz metadata for the current track. Updated when metadata is avaliable.
    let metadata: TrackMetadata | null = null;

    // HTMLVideoElement.seeking isn't as accurate as the seeking and seeked
    // events, for some reason, so we use a variable instead.
    let seeking = false;
    // Previous video timestamp.
    let previousTime = 0;
    // The amount of the time that the current video has been played for.
    let timeListened = 0;
    // Whether the listen has been submitted for the current playthrough of the video.
    let submitted = false;

    // Handler for video timeupdate event
    const onTimeupdate = () => {
        const { currentTime } = video;
        // If the user is seeking (scrubbing through the video, or navigating
        // through the video in any way that isn't just watching it), we don't
        // want to count the time that they seeked as time they've listened.
        if (seeking) previousTime = currentTime;
        // Increment the time listened by the difference between the current
        // time and the time last time timeupdated was called.
        timeListened += currentTime - previousTime;
        // Set previousTime to currentTime for the next time timeupdate is called
        previousTime = currentTime;
        // If the time we've listened is over the duration of the video, we're
        // clear to start counting for another listen again.
        if (timeListened >= video.duration) {
            timeListened = 0;
            submitted = false;
        }
        // If we haven't yet submitted the listen, and the time we've listened
        // for is enough to cound as a listen, submit the listen!
        if (!submitted && (timeListened >= 4 * 60 || timeListened >= video.duration / 2)) {
            console.log("scrobbling!!!");
            submitted = true;
            // If for some reason the metadata still hasn't been found and the
            // listener hasn't been destroyed, don't submit anything.
            if (metadata === null) return;
            const listen: Listen = {
                listen_type: ListenType.Single,
                payload: [{
                    // Listened time should be the time the user started
                    // listeneing to the track. I don't want to keep track of
                    // when the user starts listening, so we're doing this for
                    // now.
                    listened_at: Math.floor(Date.now() / 1000 - timeListened).toString(),
                    track_metadata: metadata
                }]
            };
            submitListen(listen);
        }
    };

    // Events for seeking and seeked are more accurent than HTMLVideoElement.seeking
    // for some reason, so we make a handler and variables to track instead.
    const onSeeking = () => seeking = true;
    const onSeeked = () => seeking = false;

    // Adding all of our event listeners.
    video.addEventListener("seeking", onSeeking);
    video.addEventListener("timeupdate", onTimeupdate);
    video.addEventListener("seeked", onSeeked);

    // Function that "destroys" the current video listeneing tracker by
    // removing the event listeners.
    const destory = () => {
        video.removeEventListener("seeking", onSeeking);
        video.removeEventListener("timeupdate", onTimeupdate);
        video.removeEventListener("seeked", onSeeked);
    };

    // Assign the destroy function to a global variable. This ensures that if
    // yt-player-updated is emitted before the metadata for the current track
    // is fetched, it won't destory the listener for that new video.
    destroyCurrent = destory;

    const result = await findYouTubeMusicPlaylist(ytdPlayer);
    if (result === null) return destory();
    const [playlistId, index, videoUrl] = result;
    console.log("playlistId:", playlistId, "\nindex:", index);

    const mbReleaseId = await findMbRelease("https://music.youtube.com/playlist?list=" + playlistId);
    console.log("mbReleaseId", mbReleaseId);
    if (mbReleaseId === null) return destory();

    const mbRelease = await getMbRelease(mbReleaseId);
    console.log("mbRelease:", mbRelease);
    if (mbRelease === null) return destory();

    const tracks = mbRelease.media.reduce<Track[]>((p, c) => [...p, ...c.tracks], []);
    const track = tracks[index];
    console.log("track:", track);
    if (track === undefined) return destory();


    // Wait until new video is loaded, and has a duration that we can include in the metadata.
    await videoDurationReady(video);

    metadata = {
        track_name: track.title,
        artist_name: track["artist-credit"].reduce((p, c) => p + c.name + c.joinphrase, ""),
        release_name: mbRelease.title,
        additional_info: {
            artist_mbids: track["artist-credit"].map((a) => a.artist.id),
            release_mbid: mbRelease.id,
            recording_mbid: track.recording.id,
            tracknumber: index,
            submission_client: "Levi's Userscript ListenBrainz client",
            submission_client_version: GM_info.script.version,
            music_service: "youtube.com",
            origin_url: videoUrl,
            duration_ms: Math.round(video.duration * 1000)
        }
    };

    console.log(metadata);
}

function videoDurationReady(video: HTMLVideoElement): Promise<void> {
    return new Promise((resolve) => {
        if (!isNaN(video.duration)) return resolve();
        const onDurationChange = () => {
            resolve();
            video.removeEventListener("durationchange", onDurationChange);
        };
        video.addEventListener("durationchange", onDurationChange);
    });
}

function isArtTrack(description: string): boolean {
    return ART_TRACK_REGEX.test(description);
}

function fetchPage(url: string): Promise<Document | null> {
    return new Promise((resolve) => {
        GM_xmlhttpRequest({
            url,
            responseType: "document",
            onload: ({ response }) => resolve(response),
            onerror: () => resolve(null)
        });
    });
}

function getYtInitialData(document: Document): WatchNextData | null {
    const scripts = document.querySelectorAll("script");
    const script = Array.from(scripts).find((script) => script.textContent?.startsWith(YTINITIALDATA_STARTSWITH));
    if (script === undefined) return null;

    const matches = script.textContent!.match(YTINITIALDATA_REGEX);
    if (matches === null) return null;

    try {
        const ytInitialData: WatchNextData = JSON.parse(matches[1]);
        return ytInitialData;
    } catch (e) {
        return null;
    }
}

function getDescription(watchNextData: WatchNextData): string | null {
    if (watchNextData.engagementPanels === undefined) return null;
    const descriptionPanel = watchNextData.engagementPanels.find((panel) => panel.engagementPanelSectionListRenderer.panelIdentifier === PanelIdentifier.EngagementPanelStructuredDescription);
    if (descriptionPanel === undefined) return null;

    const renderer = descriptionPanel.engagementPanelSectionListRenderer.content.structuredDescriptionContentRenderer!.items.find((item) => "expandableVideoDescriptionBodyRenderer" in item);
    if (renderer === undefined) return null;

    const description = renderer.expandableVideoDescriptionBodyRenderer!.attributedDescriptionBodyText.content;
    return description;
}

function getTrackPlaylistId(watchNextData: WatchNextData): string | null {
    if (watchNextData.engagementPanels === undefined) return null;
    const descriptionPanel = watchNextData.engagementPanels.find((panel) => panel.engagementPanelSectionListRenderer.panelIdentifier === PanelIdentifier.EngagementPanelStructuredDescription);
    if (descriptionPanel === undefined) return null;

    const renderer = descriptionPanel.engagementPanelSectionListRenderer.content.structuredDescriptionContentRenderer!.items.find((item) => "horizontalCardListRenderer" in item);
    if (renderer === undefined) return null;

    const id = renderer.horizontalCardListRenderer!.cards[0].videoAttributeViewModel!.secondarySubtitle.commandRuns![0].onTap.innertubeCommand.watchPlaylistEndpoint.playlistId;
    return id;
}

function getArtTrackPlaylistId(document: Document): string | null {
    const scripts = document.querySelectorAll("script");
    const script = Array.from(scripts).find((script) => script.textContent?.startsWith("try {const initialData = [];"));
    if (script === undefined) return null;

    const js = script.textContent!;
    const matches = js.match(YTMUSIC_BROWSE_REGEX);
    if (matches === null) return null;

    const escapedRawJSON = matches[1];
    let rawJSON;
    try {
        rawJSON = JSON.parse(`"${escapedRawJSON.replaceAll("\\x", "\\u00")}"`); //replace \x with \u00, which is valid json
    } catch (e) {
        return null;
    }
    let ytMusicBrowse: YtMusicBrowse;
    try {
        ytMusicBrowse = JSON.parse(rawJSON);
    } catch (e) {
        return null;
    }

    let url;
    try {
        url = new URL(ytMusicBrowse.microformat.microformatDataRenderer.urlCanonical);
    } catch (e) {
        return null;
    }
    const id = url.searchParams.get("list");
    return id;
}

function getTracks(ytInitialData: WatchNextData): string[] | null {
    const contents = ytInitialData.contents;
    if (contents.twoColumnBrowseResultsRenderer === undefined) return null;
    const videoRenderers = contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer!.contents[0].itemSectionRenderer.contents[0].playlistVideoListRenderer.contents;
    const tracks = videoRenderers.map((renderer) => renderer.playlistVideoRenderer.videoId);
    return tracks;
}

const videoCache: Record<string, string> = {};
const playlistCache: Record<string, string[]> = {};

async function findYouTubeMusicPlaylist(ytdPlayer: YtdPlayer): Promise<[string, number, string] | null> {
    const player = ytdPlayer.player_;
    if (player === undefined) return null;

    const videoId = player.getVideoData().video_id;
    const videoUrl = player.getVideoUrl();

    if (videoId in videoCache) {
        const playlistId = videoCache[videoId];
        const playlist = playlistCache[playlistId];
        console.log("Cached playlist:", playlistId, playlist);
        const index = playlist.indexOf(videoId);
        return [playlistId, index, videoUrl];
    }

    const { watchNextData } = ytdPlayer;
    if (watchNextData === undefined) return null;

    const description = getDescription(watchNextData);
    if (description === null) return null;

    if (!isArtTrack(description)) return null;

    const ytMusicMusicVideoPlaylistId = getTrackPlaylistId(watchNextData);
    if (ytMusicMusicVideoPlaylistId === null) return null;
    console.log(ytMusicMusicVideoPlaylistId);

    const ytMusicPage = await fetchPage("https://music.youtube.com/playlist?list=" + ytMusicMusicVideoPlaylistId);
    if (ytMusicPage === null) return null;

    const ytMusicArtTrackPlaylistId = getArtTrackPlaylistId(ytMusicPage);
    if (ytMusicArtTrackPlaylistId === null) return null;
    console.log(ytMusicArtTrackPlaylistId);

    const artTrackPlaylistPage = await fetchPage("https://www.youtube.com/playlist?list=" + ytMusicArtTrackPlaylistId);
    if (artTrackPlaylistPage === null) return null;

    const playlistYtInitialData = getYtInitialData(artTrackPlaylistPage);
    if (playlistYtInitialData === null) return null;
    console.log(playlistYtInitialData);

    const tracks = getTracks(playlistYtInitialData);
    if (tracks === null) return null;
    console.log(tracks);

    tracks.forEach((id) => videoCache[id] = ytMusicArtTrackPlaylistId);
    playlistCache[ytMusicArtTrackPlaylistId] = tracks;

    const index = tracks.indexOf(videoId);
    return [ytMusicArtTrackPlaylistId, index, videoUrl];
}

const mbRelaseIdCache: Record<string, string> = {};
const mbReleaseCache: Record<string, MusicBrainzRelease> = {};

async function findMbRelease(playlistUrl: string): Promise<string | null> {
    return new Promise((resolve) => {
        if (playlistUrl in mbRelaseIdCache) return resolve(mbRelaseIdCache[playlistUrl]);
        const params = new URLSearchParams({
            fmt: "json",
            resource: playlistUrl,
            inc: "release-rels"
        });
        console.log("https://musicbrainz.org/ws/2/url/?" + params.toString());
        GM_xmlhttpRequest({
            url: "https://musicbrainz.org/ws/2/url/?" + params.toString(),
            responseType: "json",
            onload: ({ response }) => {
                if ("error" in response) return resolve(null);
                const { relations } = response;
                if (!Array.isArray(relations)) return resolve(null);
                if (relations.length === 0) return resolve(null);
                const id: string = relations[0].release!.id;
                resolve(id);
                mbRelaseIdCache[playlistUrl] = id;
            },
            onerror: () => resolve(null)
        });
    });
}

async function getMbRelease(id: string): Promise<MusicBrainzRelease | null> {
    return new Promise((resolve) => {
        if (id in mbReleaseCache) return resolve(mbReleaseCache[id]);
        const params = new URLSearchParams({
            fmt: "json",
            inc: "recordings+artist-credits"
        });
        GM_xmlhttpRequest({
            url: `https://musicbrainz.org/ws/2/release/${id}?${params.toString()}`,
            responseType: "json",
            onload: ({ response }) => {
                if ("error" in response) return resolve(null);
                resolve(response);
                mbReleaseCache[id] = response;
            },
            onerror: () => resolve(null)
        });
    });
}

function submitListen(listen: Listen) {
    if (listenBrainzToken === undefined) return console.log("Didn't submit listen because the listenbrainz token wasn't present");
    console.log("Submitting listen:", listen);
    GM_xmlhttpRequest({
        url: "https://api.listenbrainz.org/1/submit-listens",
        method: "POST",
        headers: {
            "Authorization": `Token ${listenBrainzToken}`,
            "Content-Type": "application/json"
        },
        responseType: "json",
        data: JSON.stringify(listen),
        onload: (response) => {
            console.log(response.status, response.response);
        },
        onerror: console.log
    });
}
