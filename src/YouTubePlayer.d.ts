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

declare global {
    interface WindowEventMap {
        "yt-player-updated": CustomEvent<Player>
    }
}

export {};
