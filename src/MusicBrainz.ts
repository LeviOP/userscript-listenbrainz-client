// This isn't 100% accurate, just needed something to satisfy typescript
export interface MusicBrainzRelease {
    date:                  string;
    status:                string;
    "cover-art-archive":   CoverArtArchive;
    quality:               string;
    asin:                  null;
    media:                 Media[];
    "status-id":           string;
    id:                    string;
    title:                 string;
    packaging:             string;
    barcode:               string;
    "packaging-id":        string;
    disambiguation:        string;
    "release-events":      ReleaseEvent[];
    "text-representation": TextRepresentation;
    country:               string;
    "artist-credit":       ArtistCredit[];
}

export interface ArtistCredit {
    name:       string;
    artist:     Artist;
    joinphrase: string;
}

export interface Artist {
    disambiguation:      string;
    type:                string | null;
    "type-id":           null | string;
    "sort-name":         string;
    id:                  string;
    name:                string;
    "iso-3166-1-codes"?: string[];
}

export interface CoverArtArchive {
    front:    boolean;
    artwork:  boolean;
    count:    number;
    back:     boolean;
    darkened: boolean;
}

export interface Media {
    tracks:         Track[];
    title:          string;
    "format-id":    string;
    position:       number;
    "track-count":  number;
    "track-offset": number;
    format:         string;
}

export interface Track {
    recording:       Recording;
    length:          number;
    number:          string;
    position:        number;
    id:              string;
    title:           string;
    "artist-credit": ArtistCredit[];
}

export interface Recording {
    disambiguation:       string;
    "first-release-date": Date;
    id:                   string;
    "artist-credit":      ArtistCredit[];
    title:                string;
    length:               number;
    video:                boolean;
}

export interface ReleaseEvent {
    date: Date;
    area: Artist;
}

export interface TextRepresentation {
    script:   string;
    language: string;
}
