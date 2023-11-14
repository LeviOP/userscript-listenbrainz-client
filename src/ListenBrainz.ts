export interface Listen {
    listen_type: ListenType;
    payload: Payload[];
}

// Use cosnt enum since we don't really need the other types
export const enum ListenType {
    Single = "single",
    PlayingNow = "playing_now",
    Import = "import"
}

export interface Payload {
    listened_at: string;
    track_metadata: TrackMetadata;
}

export interface TrackMetadata {
    additional_info?: AdditionalInfo;
    artist_name: string;
    track_name: string;
    release_name?: string;
}

export interface AdditionalInfo {
    artist_mbids?: string[];
    release_group_mbid?: string;
    release_mbid?: string;
    recording_mbid?: string;
    track_mbid?: string;
    work_mbids?: string[];
    tracknumber?: number;
    isrc?: string;
    spotify_id?: string;
    tags?: string[];
    media_player?: string;
    media_player_version?: string;
    submission_client?: string;
    submission_client_version?: string;
    music_service?: string;
    music_service_name?: string;
    origin_url?: string;
    duration_ms?: number;
    duration?: number;
}
