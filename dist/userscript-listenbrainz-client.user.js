// ==UserScript==
// @name       userscript-listenbrainz-client
// @namespace  https://github.com/LeviOP
// @version    0.1.0
// @author     LeviOP
// @match      *://*.youtube.com/*
// @grant      GM_addValueChangeListener
// @grant      GM_getValue
// @grant      GM_info
// @grant      GM_setValue
// @grant      GM_xmlhttpRequest
// ==/UserScript==

(function () {
  'use strict';

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
  var IconType = /* @__PURE__ */ ((IconType2) => {
    IconType2["SEARCH"] = "SEARCH";
    IconType2["CLOSE"] = "CLOSE";
    IconType2["MICROPHONE_ON"] = "MICROPHONE_ON";
    IconType2["VIDEO_CALL"] = "VIDEO_CALL";
    IconType2["NOTIFICATIONS"] = "NOTIFICATIONS";
    IconType2["WHAT_TO_WATCH"] = "WHAT_TO_WATCH";
    IconType2["TAB_SHORTS"] = "TAB_SHORTS";
    IconType2["SUBSCRIPTIONS"] = "SUBSCRIPTIONS";
    IconType2["VIDEO_LIBRARY_WHITE"] = "VIDEO_LIBRARY_WHITE";
    IconType2["PLAY_ALL"] = "PLAY_ALL";
    IconType2["PLAYLIST_ADD"] = "PLAYLIST_ADD";
    IconType2["SHARE"] = "SHARE";
    IconType2["PLAY_ARROW"] = "PLAY_ARROW";
    IconType2["SHUFFLE"] = "SHUFFLE";
    IconType2["UP_ARROW"] = "UP_ARROW";
    IconType2["NOTIFICATIONS_NONE"] = "NOTIFICATIONS_NONE";
    IconType2["EXPAND_MORE"] = "EXPAND_MORE";
    IconType2["LIKE"] = "LIKE";
    IconType2["DISLIKE"] = "DISLIKE";
    IconType2["CHEVRON_LEFT"] = "CHEVRON_LEFT";
    IconType2["OFFLINE_DOWNLOAD"] = "OFFLINE_DOWNLOAD";
    IconType2["MORE_VERT"] = "MORE_VERT";
    IconType2["YOUTUBE_MUSIC_MONOCHROME"] = "YOUTUBE_MUSIC_MONOCHROME";
    IconType2["MY_VIDEOS"] = "MY_VIDEOS";
    IconType2["ACCOUNT_BOX"] = "ACCOUNT_BOX";
    IconType2["PRIVACY_UNLISTED"] = "PRIVACY_UNLISTED";
    IconType2["LOOP_ACTIVE"] = "LOOP_ACTIVE";
    IconType2["CONTENT_CUT"] = "CONTENT_CUT";
    IconType2["INFO"] = "INFO";
    IconType2["SWITCH_ACCOUNTS"] = "SWITCH_ACCOUNTS";
    IconType2["EXIT_TO_APP"] = "EXIT_TO_APP";
    IconType2["CREATOR_STUDIO"] = "CREATOR_STUDIO";
    IconType2["MONETIZATION_ON"] = "MONETIZATION_ON";
    IconType2["SHIELD_WITH_AVATAR"] = "SHIELD_WITH_AVATAR";
    IconType2["DARK_THEME"] = "DARK_THEME";
    IconType2["TRANSLATE"] = "TRANSLATE";
    IconType2["LANGUAGE"] = "LANGUAGE";
    IconType2["KEYBOARD"] = "KEYBOARD";
    IconType2["SETTINGS"] = "SETTINGS";
    IconType2["HELP"] = "HELP";
    IconType2["FEEDBACK"] = "FEEDBACK";
    return IconType2;
  })(IconType || {});
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
  function htmlToElement(html) {
    const template = document.createElement("template");
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
  }
  const settingshtml = `
    <div style="background: var(--yt-spec-brand-background-solid); margin: 0; padding: 0; overflow: auto;">
        <div style="display: flex; flex-direction: row; align-items: center;">
            <div style="color: #f1f1f1; padding: 16px 24px; font-family: 'Roboto','Arial',sans-serif; font-size: 1.6rem; line-height: 2.2rem; font-weight: 400; display: flex; flex: 1;">
                <span>userscript-listenbrainz-client settings</span>
            </div>
            <yt-icon-button style="margin-right: 20px; color: var(--yt-spec-icon-inactive);">
                <yt-icon icon="close" class="yt-icon"></yt-icon>
            </yt-icon-button>
        </div>
        <div>
            <yt-text-input-form-field-renderer style="padding: 0 24px;"></yt-text-input-form-field-renderer>
            <div style="padding: 16px 24px; display: flex; flex-direction: row; justify-content: flex-end;">
                <ytd-button-renderer></ytd-button-renderer>
            </div>
        </div>
    </div>
`;
  async function addSettings() {
    const menuRenderer = document.querySelector("#actions-inner > #menu > ytd-menu-renderer");
    if (menuRenderer === null)
      return;
    menuRenderer.data.items.push({
      menuServiceItemRenderer: {
        text: {
          runs: [{
            text: "ListenBrainz"
          }]
        },
        icon: {
          iconType: IconType.SETTINGS
        }
      }
    });
    menuRenderer.resetFlexibleItems();
    const popupRenderer = await popupOpened(menuRenderer);
    const listbox = popupRenderer.querySelector("tp-yt-paper-listbox");
    if (listbox === null)
      return;
    const itemRenderer = await findItemRenderer(listbox);
    const item = itemRenderer.querySelector("tp-yt-paper-item");
    if (item === null)
      return;
    const userConfig2 = getUserConfig();
    const settingsDialog = document.createElement("tp-yt-paper-dialog");
    settingsDialog.modern = true;
    const settingsPanel = htmlToElement(settingshtml);
    const closeButton = settingsPanel.querySelector("yt-icon-button");
    if (closeButton === null)
      return;
    closeButton.addEventListener("click", () => {
      settingsDialog.opened = false;
    });
    const lbTokenInputRenderer = settingsPanel.querySelector("yt-text-input-form-field-renderer");
    if (lbTokenInputRenderer === null)
      return;
    lbTokenInputRenderer.data = {
      required: false,
      placeholderText: "Enter ListenBrainz token...",
      label: {
        runs: [{
          text: "ListenBrainz token"
        }]
      },
      hideCharCounter: true
    };
    lbTokenInputRenderer.value = (userConfig2 == null ? void 0 : userConfig2.listenBrainzToken) ?? "";
    const saveButtonRenderer = settingsPanel.querySelector("ytd-button-renderer");
    if (saveButtonRenderer === null)
      return;
    saveButtonRenderer.data = {
      isDisabled: false,
      size: "SIZE_DEFAULT",
      style: "STYLE_PRIMARY",
      text: {
        runs: [{ text: "Save" }]
      }
    };
    saveButtonRenderer.addEventListener("click", () => {
      const listenBrainzToken2 = lbTokenInputRenderer.value;
      const config = {
        listenBrainzToken: listenBrainzToken2
      };
      _GM_setValue("userConfig", config);
    });
    const popupContainer = document.querySelector("ytd-popup-container");
    if (popupContainer === null)
      return;
    settingsDialog.appendChild(settingsPanel);
    popupContainer.appendChild(settingsDialog);
    item.addEventListener("click", () => {
      const backdrop = document.createElement("tp-yt-iron-overlay-backdrop");
      backdrop.style.zIndex = "2201";
      document.body.appendChild(backdrop);
      backdrop.opened = true;
      settingsDialog.opened = true;
      const closed = () => {
        settingsDialog.removeEventListener("iron-overlay-closed", closed);
        const config = getUserConfig();
        backdrop.opened = false;
        lbTokenInputRenderer.value = config.listenBrainzToken ?? "";
      };
      settingsDialog.addEventListener("iron-overlay-closed", closed);
    });
  }
  function popupOpened(menuRenderer) {
    return new Promise((resolve) => {
      const popupOpened2 = (e) => {
        resolve(e.detail);
        menuRenderer.removeEventListener("yt-popup-opened", popupOpened2);
      };
      menuRenderer.addEventListener("yt-popup-opened", popupOpened2);
    });
  }
  function findItemRenderer(listbox) {
    return new Promise((resolve) => {
      var _a;
      const itemRenderer = (_a = listbox.items) == null ? void 0 : _a.find((item) => {
        var _a2, _b;
        return ((_b = (_a2 = item.data) == null ? void 0 : _a2.text) == null ? void 0 : _b.runs[0].text) === "ListenBrainz";
      });
      if (itemRenderer !== void 0)
        return resolve(itemRenderer);
      const changed = () => {
        var _a2;
        const itemRenderer2 = (_a2 = listbox.items) == null ? void 0 : _a2.find((item) => {
          var _a3, _b;
          return ((_b = (_a3 = item.data) == null ? void 0 : _a3.text) == null ? void 0 : _b.runs[0].text) === "ListenBrainz";
        });
        if (itemRenderer2 === void 0)
          return;
        resolve(itemRenderer2);
        listbox.removeEventListener("items-changed", changed);
      };
      listbox.addEventListener("items-changed", changed);
    });
  }
  const ART_TRACK_REGEX = /Provided to YouTube by .*\n\n.*? · .*\n\n.*\n\n.*\n\n(Released on: .*\n\n)?((.*:.*\n)+\n)?Auto-generated by YouTube./;
  const YTINITIALDATA_REGEX = /var ytInitialData = (.+);/s;
  const YTINITIALDATA_STARTSWITH = "var ytInitialData = ";
  const YTMUSIC_BROWSE_REGEX = /initialData\.push\({path: '\\\/browse', params: JSON\.parse\('.*?'\), data: '(.*?)'/;
  const VIDEO_SELECTOR = ".html5-main-video";
  const userConfig = getUserConfig();
  let { listenBrainzToken } = userConfig;
  _GM_addValueChangeListener("userConfig", (_name, _oldValue, newValue) => {
    const newUserConfig = sanitizeUserConfig(newValue);
    ({ listenBrainzToken } = newUserConfig);
  });
  const YtdPlayerConstructor = window.customElements.get("ytd-player");
  let destroyCurrent;
  let initialPlayerResponse = false;
  let playerUpdated = false;
  window.addEventListener("yt-player-updated", (event) => {
    if (!(event.target instanceof YtdPlayerConstructor))
      return;
    if (event.target.context !== YtdPlayerContext.WATCH)
      return;
    if (!initialPlayerResponse)
      initialPlayerResponse = true;
    else
      playerUpdated = true;
    if (destroyCurrent)
      destroyCurrent();
    trackListening(event.target);
  });
  let pageTypeChanged = false;
  window.addEventListener("yt-page-type-changed", (e) => {
    pageTypeChanged = true;
    console.log("yt-page-type-changed", e);
  });
  window.addEventListener("yt-page-data-updated", (e) => {
    console.log("yt-page-data-updated", e);
    if (pageTypeChanged) {
      if (playerUpdated) {
        playerUpdated = false;
        pageTypeChanged = false;
      } else {
        pageTypeChanged = false;
        return;
      }
    }
    addSettings();
  });
  window.addEventListener("yt-navigate-start", (e) => {
    console.log("yt-navigate-start", e);
  });
  window.addEventListener("yt-navigate-finish", (e) => {
    console.log("yt-navigate-finish", e);
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
      artist_name: track["artist-credit"].reduce((p, c) => p + c.joinphrase + c.name, ""),
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