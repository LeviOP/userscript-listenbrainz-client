// ==UserScript==
// @name       userscript-listenbrainz-client
// @namespace  https://github.com/LeviOP
// @version    0.2.0
// @author     LeviOP
// @match      *://*.youtube.com/*
// @grant      GM_addStyle
// @grant      GM_addValueChangeListener
// @grant      GM_getValue
// @grant      GM_info
// @grant      GM_setValue
// @grant      GM_xmlhttpRequest
// ==/UserScript==

(function () {
  'use strict';

  var _GM_addStyle = /* @__PURE__ */ (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  var _GM_addValueChangeListener = /* @__PURE__ */ (() => typeof GM_addValueChangeListener != "undefined" ? GM_addValueChangeListener : void 0)();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_info = /* @__PURE__ */ (() => typeof GM_info != "undefined" ? GM_info : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  var ListenType = /* @__PURE__ */ ((ListenType2) => {
    ListenType2["Single"] = "single";
    ListenType2["PlayingNow"] = "playing_now";
    ListenType2["Import"] = "import";
    return ListenType2;
  })(ListenType || {});
  var YtdPlayerContext = /* @__PURE__ */ ((YtdPlayerContext2) => {
    YtdPlayerContext2["WATCH"] = "WEB_PLAYER_CONTEXT_CONFIG_ID_KEVLAR_WATCH";
    YtdPlayerContext2["CHANNEL_TRAILER"] = "WEB_PLAYER_CONTEXT_CONFIG_ID_KEVLAR_CHANNEL_TRAILER";
    YtdPlayerContext2["PLAYLIST_OVERVIEW"] = "WEB_PLAYER_CONTEXT_CONFIG_ID_KEVLAR_PLAYLIST_OVERVIEW";
    YtdPlayerContext2["VERTICAL_LANDING_PAGE_PROM"] = "WEB_PLAYER_CONTEXT_CONFIG_ID_KEVLAR_VERTICAL_LANDING_PAGE_PROM";
    YtdPlayerContext2["SHORTS"] = "WEB_PLAYER_CONTEXT_CONFIG_ID_KEVLAR_SHORTS";
    YtdPlayerContext2["SPONSORSHIPS_OFFER"] = "WEB_PLAYER_CONTEXT_CONFIG_ID_KEVLAR_SPONSORSHIPS_OFFER";
    YtdPlayerContext2["INLINE_PREVIEW"] = "WEB_PLAYER_CONTEXT_CONFIG_ID_KEVLAR_INLINE_PREVIEW";
    YtdPlayerContext2["HANDLES_CLAIMING"] = "WEB_PLAYER_CONTEXT_CONFIG_ID_HANDLES_CLAIMING";
    return YtdPlayerContext2;
  })(YtdPlayerContext || {});
  var PanelIdentifier = /* @__PURE__ */ ((PanelIdentifier2) => {
    PanelIdentifier2["CommentItemSection"] = "comment-item-section";
    PanelIdentifier2["EngagementPanelAds"] = "engagement-panel-ads";
    PanelIdentifier2["EngagementPanelClipCreate"] = "engagement-panel-clip-create";
    PanelIdentifier2["EngagementPanelClipView"] = "engagement-panel-clip-view";
    PanelIdentifier2["EngagementPanelCommentsSection"] = "engagement-panel-comments-section";
    PanelIdentifier2["EngagementPanelMacroMarkersDescriptionChapters"] = "engagement-panel-macro-markers-description-chapters";
    PanelIdentifier2["EngagementPanelMacroMarkersProblemWalkthroughs"] = "engagement-panel-macro-markers-problem-walkthroughs";
    PanelIdentifier2["EngagementPanelSearchableTranscript"] = "engagement-panel-searchable-transcript";
    PanelIdentifier2["EngagementPanelStructuredDescription"] = "engagement-panel-structured-description";
    return PanelIdentifier2;
  })(PanelIdentifier || {});
  function getUserConfig() {
    const data = _GM_getValue("userConfig");
    const sanitized = sanitizeUserConfig(data);
    return sanitized;
  }
  function sanitizeUserConfig(raw) {
    const userConfig2 = {};
    if (typeof raw !== "object" || raw === null)
      return userConfig2;
    if ("listenBrainzToken" in raw && typeof raw.listenBrainzToken === "string")
      userConfig2.listenBrainzToken = raw.listenBrainzToken;
    return userConfig2;
  }
  _GM_addStyle(`
ytd-listenbrainz-test-renderer {
    padding: 0;
}
`);
  const template = document.createElement("template");
  template.innerHTML = `
<div id="header" style="display: flex; flex-direction: row; align-items: center;">
    <span style="display: flex; flex: 1; flex-direction: column; color: #f1f1f1; padding: 16px 24px; font-family: 'Roboto','Arial',sans-serif; font-size: 1.6rem; line-height: 2.2rem; font-weight: 400;">userscript-listenbrainz-client settings</span>
    <yt-icon-button id="close-button" on-tap="onTapClose" style="margin-right: 20px; color: var(--yt-spec-icon-inactive);">
        <yt-icon icon="close" class="style-scope ytd-add-to-playlist-renderer"></yt-icon>
    </yt-icon-button>
</div>
<div id="settings">
    <yt-text-input-form-field-renderer style="padding: 0 24px;" data="[[data.settings.token.textInputFormFieldRenderer]]" value="[[config.listenBrainzToken]]" id="setting-listenBrainzToken"></yt-text-input-form-field-renderer>
</div>
<div style="padding: 16px 24px; display: flex; flex-direction: row; justify-content: flex-end;">
    <ytd-button-renderer data="[[data.saveButton.buttonRenderer]]" on-tap="onTapSave"></ytd-button-renderer>
</div>
`;
  Polymer({
    is: "ytd-listenbrainz-test-renderer",
    properties: {
      data: Object,
      config: Object
    },
    _template: template,
    listeners: {
      "yt-popup-opened": "onPopupOpened"
    },
    onTapClose() {
      this.dispatchEvent(new CustomEvent("yt-action", {
        bubbles: true,
        cancelable: false,
        composed: true,
        detail: {
          actionName: "yt-close-popup-action",
          optionalAction: false,
          args: ["ytd-listenbrainz-test-renderer"],
          returnValue: []
        }
      }));
    },
    onTapSave() {
      var _a;
      const listenBrainzToken2 = (_a = this.querySelector("#setting-listenBrainzToken")) == null ? void 0 : _a.value;
      _GM_setValue("userConfig", {
        listenBrainzToken: listenBrainzToken2
      });
    },
    onPopupOpened() {
      const userConfig2 = getUserConfig();
      this.config = userConfig2;
    }
  });
  window.addEventListener("yt-page-data-updated", (event) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
    if (event.detail.pageType !== "watch")
      return;
    const watchFlexy = document.querySelector("ytd-watch-flexy");
    if (watchFlexy === null || !("data" in watchFlexy))
      return;
    const menuItems = (_j = (_i = (_h = (_g = (_f = (_e = (_d = (_c = (_b = (_a = watchFlexy.data) == null ? void 0 : _a.contents) == null ? void 0 : _b.twoColumnWatchNextResults) == null ? void 0 : _c.results) == null ? void 0 : _d.results) == null ? void 0 : _e.contents) == null ? void 0 : _f[0]) == null ? void 0 : _g.videoPrimaryInfoRenderer) == null ? void 0 : _h.videoActions) == null ? void 0 : _i.menuRenderer) == null ? void 0 : _j.items;
    if (menuItems === void 0 || !Array.isArray(menuItems))
      return;
    if (menuItems.some((item) => {
      var _a2, _b2, _c2, _d2;
      return ((_d2 = (_c2 = (_b2 = (_a2 = item == null ? void 0 : item.menuServiceItemRenderer) == null ? void 0 : _a2.serviceEndpoint) == null ? void 0 : _b2.openPopupAction) == null ? void 0 : _c2.popup) == null ? void 0 : _d2.listenbrainzTestRenderer) !== void 0;
    }))
      return;
    menuItems.push({
      menuServiceItemRenderer: {
        icon: {
          iconType: "SETTINGS"
        },
        text: {
          runs: [{
            text: "ListenBrainz"
          }]
        },
        serviceEndpoint: {
          openPopupAction: {
            popup: {
              listenbrainzTestRenderer: {
                settings: {
                  token: {
                    textInputFormFieldRenderer: {
                      required: false,
                      placeholderText: "Enter ListenBrainz token...",
                      label: {
                        runs: [{
                          text: "ListenBrainz token"
                        }]
                      },
                      hideCharCounter: true
                    }
                  }
                },
                saveButton: {
                  buttonRenderer: {
                    isDisabled: false,
                    size: "SIZE_DEFAULT",
                    style: "STYLE_PRIMARY",
                    text: {
                      runs: [{ text: "Save" }]
                    }
                  }
                }
              }
            },
            popupType: "DIALOG"
          }
        }
      }
    });
    const menuRenderer = document.querySelector("#actions-inner > #menu > ytd-menu-renderer");
    if (menuRenderer === null)
      return;
    menuRenderer.resetFlexibleItems();
  });
  const ART_TRACK_REGEX = /Provided to YouTube by .*\n\n.*? · .*\n\n.*\n\n.*\n\n(Released on: .*\n\n)?((.*:.*\n)+\n)?Auto-generated by YouTube./;
  const YTINITIALDATA_REGEX = /var ytInitialData = (.+);/s;
  const YTINITIALDATA_STARTSWITH = "var ytInitialData = ";
  const YTMUSIC_BROWSE_REGEX = /initialData\.push\({path: '\\\/browse', params: JSON\.parse\('.*?'\), data: '(.*?)'/;
  const VIDEO_SELECTOR = 'ytd-player[context="WEB_PLAYER_CONTEXT_CONFIG_ID_KEVLAR_WATCH"] > #container > #movie_player > div > video';
  const userConfig = getUserConfig();
  let { listenBrainzToken } = userConfig;
  _GM_addValueChangeListener("userConfig", (_name, _oldValue, newValue) => {
    const newUserConfig = sanitizeUserConfig(newValue);
    ({ listenBrainzToken } = newUserConfig);
  });
  const YtdPlayerConstructor = window.customElements.get("ytd-player");
  let destroyCurrent;
  window.addEventListener("yt-player-updated", (event) => {
    console.log("yt-player-updated", event);
    if (!(event.target instanceof YtdPlayerConstructor))
      return;
    if (event.target.context !== YtdPlayerContext.WATCH)
      return;
    if (destroyCurrent)
      destroyCurrent();
    trackListening(event.target);
  });
  async function trackListening(ytdPlayer) {
    const video = document.querySelector(VIDEO_SELECTOR);
    if (video === null)
      return;
    let metadata = null;
    let seeking = false;
    let previousTime = 0;
    let timeListened = 0;
    let submitted = false;
    const onTimeupdate = () => {
      const { currentTime } = video;
      if (seeking)
        previousTime = currentTime;
      timeListened += currentTime - previousTime;
      previousTime = currentTime;
      if (timeListened >= video.duration) {
        timeListened = 0;
        submitted = false;
      }
      if (!submitted && (timeListened >= 4 * 60 || timeListened >= video.duration / 2)) {
        console.log("scrobbling!!!");
        submitted = true;
        if (metadata === null)
          return;
        const listen = {
          listen_type: ListenType.Single,
          payload: [{
            // Listened time should be the time the user started
            // listeneing to the track. I don't want to keep track of
            // when the user starts listening, so we're doing this for
            // now.
            listened_at: Math.floor(Date.now() / 1e3 - timeListened).toString(),
            track_metadata: metadata
          }]
        };
        submitListen(listen);
      }
    };
    const onSeeking = () => seeking = true;
    const onSeeked = () => seeking = false;
    video.addEventListener("seeking", onSeeking);
    video.addEventListener("timeupdate", onTimeupdate);
    video.addEventListener("seeked", onSeeked);
    const destory = () => {
      video.removeEventListener("seeking", onSeeking);
      video.removeEventListener("timeupdate", onTimeupdate);
      video.removeEventListener("seeked", onSeeked);
    };
    destroyCurrent = destory;
    const result = await findYouTubeMusicPlaylist(ytdPlayer);
    if (result === null)
      return destory();
    const [playlistId, index, videoUrl] = result;
    console.log("playlistId:", playlistId, "\nindex:", index);
    const mbReleaseId = await findMbRelease("https://music.youtube.com/playlist?list=" + playlistId);
    console.log("mbReleaseId", mbReleaseId);
    if (mbReleaseId === null)
      return destory();
    const mbRelease = await getMbRelease(mbReleaseId);
    console.log("mbRelease:", mbRelease);
    if (mbRelease === null)
      return destory();
    const tracks = mbRelease.media.reduce((p, c) => [...p, ...c.tracks], []);
    const track = tracks[index];
    console.log("track:", track);
    if (track === void 0)
      return destory();
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
        submission_client_version: _GM_info.script.version,
        music_service: "youtube.com",
        origin_url: videoUrl,
        duration_ms: Math.round(video.duration * 1e3)
      }
    };
    console.log(metadata);
  }
  function videoDurationReady(video) {
    return new Promise((resolve) => {
      if (!isNaN(video.duration))
        return resolve();
      const onDurationChange = () => {
        resolve();
        video.removeEventListener("durationchange", onDurationChange);
      };
      video.addEventListener("durationchange", onDurationChange);
    });
  }
  function isArtTrack(description) {
    return ART_TRACK_REGEX.test(description);
  }
  function fetchPage(url) {
    return new Promise((resolve) => {
      _GM_xmlhttpRequest({
        url,
        responseType: "document",
        onload: ({ response }) => resolve(response),
        onerror: () => resolve(null)
      });
    });
  }
  function getYtInitialData(document2) {
    const scripts = document2.querySelectorAll("script");
    const script = Array.from(scripts).find((script2) => {
      var _a;
      return (_a = script2.textContent) == null ? void 0 : _a.startsWith(YTINITIALDATA_STARTSWITH);
    });
    if (script === void 0)
      return null;
    const matches = script.textContent.match(YTINITIALDATA_REGEX);
    if (matches === null)
      return null;
    try {
      const ytInitialData = JSON.parse(matches[1]);
      return ytInitialData;
    } catch (e) {
      return null;
    }
  }
  function getDescription(watchNextData) {
    if (watchNextData.engagementPanels === void 0)
      return null;
    const descriptionPanel = watchNextData.engagementPanels.find((panel) => panel.engagementPanelSectionListRenderer.panelIdentifier === PanelIdentifier.EngagementPanelStructuredDescription);
    if (descriptionPanel === void 0)
      return null;
    const renderer = descriptionPanel.engagementPanelSectionListRenderer.content.structuredDescriptionContentRenderer.items.find((item) => "expandableVideoDescriptionBodyRenderer" in item);
    if (renderer === void 0)
      return null;
    const description = renderer.expandableVideoDescriptionBodyRenderer.attributedDescriptionBodyText.content;
    return description;
  }
  function getTrackPlaylistId(watchNextData) {
    if (watchNextData.engagementPanels === void 0)
      return null;
    const descriptionPanel = watchNextData.engagementPanels.find((panel) => panel.engagementPanelSectionListRenderer.panelIdentifier === PanelIdentifier.EngagementPanelStructuredDescription);
    if (descriptionPanel === void 0)
      return null;
    const renderer = descriptionPanel.engagementPanelSectionListRenderer.content.structuredDescriptionContentRenderer.items.find((item) => "horizontalCardListRenderer" in item);
    if (renderer === void 0)
      return null;
    const id = renderer.horizontalCardListRenderer.cards[0].videoAttributeViewModel.secondarySubtitle.commandRuns[0].onTap.innertubeCommand.watchPlaylistEndpoint.playlistId;
    return id;
  }
  function getArtTrackPlaylistId(document2) {
    const scripts = document2.querySelectorAll("script");
    const script = Array.from(scripts).find((script2) => {
      var _a;
      return (_a = script2.textContent) == null ? void 0 : _a.startsWith("try {const initialData = [];");
    });
    if (script === void 0)
      return null;
    const js = script.textContent;
    const matches = js.match(YTMUSIC_BROWSE_REGEX);
    if (matches === null)
      return null;
    const escapedRawJSON = matches[1];
    let rawJSON;
    try {
      rawJSON = JSON.parse(`"${escapedRawJSON.replaceAll("\\x", "\\u00")}"`);
    } catch (e) {
      return null;
    }
    let ytMusicBrowse;
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
  function getTracks(ytInitialData) {
    const contents = ytInitialData.contents;
    if (contents.twoColumnBrowseResultsRenderer === void 0)
      return null;
    const videoRenderers = contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].playlistVideoListRenderer.contents;
    const tracks = videoRenderers.map((renderer) => renderer.playlistVideoRenderer.videoId);
    return tracks;
  }
  const videoCache = {};
  const playlistCache = {};
  async function findYouTubeMusicPlaylist(ytdPlayer) {
    const player = ytdPlayer.player_;
    if (player === void 0)
      return null;
    const videoId = player.getVideoData().video_id;
    const videoUrl = player.getVideoUrl();
    if (videoId in videoCache) {
      const playlistId = videoCache[videoId];
      const playlist = playlistCache[playlistId];
      console.log("Cached playlist:", playlistId, playlist);
      const index2 = playlist.indexOf(videoId);
      return [playlistId, index2, videoUrl];
    }
    const { watchNextData } = ytdPlayer;
    if (watchNextData === void 0)
      return null;
    const description = getDescription(watchNextData);
    if (description === null)
      return null;
    if (!isArtTrack(description))
      return null;
    const ytMusicMusicVideoPlaylistId = getTrackPlaylistId(watchNextData);
    if (ytMusicMusicVideoPlaylistId === null)
      return null;
    console.log(ytMusicMusicVideoPlaylistId);
    const ytMusicPage = await fetchPage("https://music.youtube.com/playlist?list=" + ytMusicMusicVideoPlaylistId);
    if (ytMusicPage === null)
      return null;
    const ytMusicArtTrackPlaylistId = getArtTrackPlaylistId(ytMusicPage);
    if (ytMusicArtTrackPlaylistId === null)
      return null;
    console.log(ytMusicArtTrackPlaylistId);
    const artTrackPlaylistPage = await fetchPage("https://www.youtube.com/playlist?list=" + ytMusicArtTrackPlaylistId);
    if (artTrackPlaylistPage === null)
      return null;
    const playlistYtInitialData = getYtInitialData(artTrackPlaylistPage);
    if (playlistYtInitialData === null)
      return null;
    console.log(playlistYtInitialData);
    const tracks = getTracks(playlistYtInitialData);
    if (tracks === null)
      return null;
    console.log(tracks);
    tracks.forEach((id) => videoCache[id] = ytMusicArtTrackPlaylistId);
    playlistCache[ytMusicArtTrackPlaylistId] = tracks;
    const index = tracks.indexOf(videoId);
    return [ytMusicArtTrackPlaylistId, index, videoUrl];
  }
  const mbRelaseIdCache = {};
  const mbReleaseCache = {};
  async function findMbRelease(playlistUrl) {
    return new Promise((resolve) => {
      if (playlistUrl in mbRelaseIdCache)
        return resolve(mbRelaseIdCache[playlistUrl]);
      const params = new URLSearchParams({
        fmt: "json",
        resource: playlistUrl,
        inc: "release-rels"
      });
      console.log("https://musicbrainz.org/ws/2/url/?" + params.toString());
      _GM_xmlhttpRequest({
        url: "https://musicbrainz.org/ws/2/url/?" + params.toString(),
        responseType: "json",
        onload: ({ response }) => {
          if ("error" in response)
            return resolve(null);
          const { relations } = response;
          if (!Array.isArray(relations))
            return resolve(null);
          if (relations.length === 0)
            return resolve(null);
          const id = relations[0].release.id;
          resolve(id);
          mbRelaseIdCache[playlistUrl] = id;
        },
        onerror: () => resolve(null)
      });
    });
  }
  async function getMbRelease(id) {
    return new Promise((resolve) => {
      if (id in mbReleaseCache)
        return resolve(mbReleaseCache[id]);
      const params = new URLSearchParams({
        fmt: "json",
        inc: "recordings+artist-credits"
      });
      _GM_xmlhttpRequest({
        url: `https://musicbrainz.org/ws/2/release/${id}?${params.toString()}`,
        responseType: "json",
        onload: ({ response }) => {
          if ("error" in response)
            return resolve(null);
          resolve(response);
          mbReleaseCache[id] = response;
        },
        onerror: () => resolve(null)
      });
    });
  }
  function submitListen(listen) {
    if (listenBrainzToken === void 0)
      return console.log("Didn't submit listen because the listenbrainz token wasn't present");
    console.log("Submitting listen:", listen);
    _GM_xmlhttpRequest({
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

})();