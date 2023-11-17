import { WatchNextData } from "./WatchNextData";

export interface YtdPlayer extends HTMLElement {
    context?: YtdPlayerContext;
    disableTouchGestures?: boolean;
    playerId?: string;
    watchNextData?: WatchNextData;
    player_?: Player;
}

export enum YtdPlayerContext {
    WATCH = "WEB_PLAYER_CONTEXT_CONFIG_ID_KEVLAR_WATCH",
    CHANNEL_TRAILER = "WEB_PLAYER_CONTEXT_CONFIG_ID_KEVLAR_CHANNEL_TRAILER",
    PLAYLIST_OVERVIEW = "WEB_PLAYER_CONTEXT_CONFIG_ID_KEVLAR_PLAYLIST_OVERVIEW",
    VERTICAL_LANDING_PAGE_PROM = "WEB_PLAYER_CONTEXT_CONFIG_ID_KEVLAR_VERTICAL_LANDING_PAGE_PROM",
    SHORTS = "WEB_PLAYER_CONTEXT_CONFIG_ID_KEVLAR_SHORTS",
    SPONSORSHIPS_OFFER = "WEB_PLAYER_CONTEXT_CONFIG_ID_KEVLAR_SPONSORSHIPS_OFFER",
    INLINE_PREVIEW = "WEB_PLAYER_CONTEXT_CONFIG_ID_KEVLAR_INLINE_PREVIEW",
    HANDLES_CLAIMING = "WEB_PLAYER_CONTEXT_CONFIG_ID_HANDLES_CLAIMING"
}

export interface Player {
    getVideoData(): VideoData;
    getVideoUrl(): string;
}

interface VideoData {
    video_id:                              string;
    author:                                string;
    title:                                 string;
    isPlayable:                            boolean;
    errorCode:                             null;
    video_quality:                         string;
    video_quality_features:                unknown[];
    backgroundable:                        boolean;
    eventId:                               string;
    cpn:                                   string;
    isLive:                                boolean;
    isWindowedLive:                        boolean;
    isManifestless:                        boolean;
    allowLiveDvr:                          boolean;
    isListed:                              boolean;
    isMultiChannelAudio:                   boolean;
    hasProgressBarBoundaries:              boolean;
    isPremiere:                            boolean;
    itct:                                  string;
    progressBarStartPositionUtcTimeMillis: null;
    progressBarEndPositionUtcTimeMillis:   null;
    paidContentOverlayDurationMs:          number;
}
