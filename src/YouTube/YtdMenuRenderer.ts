import { Text } from "./common";

export interface YtdMenuRenderer extends HTMLElement {
    data: YtdMenuRendererData;
    resetFlexibleItems: () => void;
}

export interface YtdMenuRendererData {
    items: Item[];
}

export type Item<K extends keyof ItemInterfaceNameMap = keyof ItemInterfaceNameMap> = {
  [Key in K]: ItemInterfaceNameMap[Key];
};

interface ItemInterfaceNameMap {
    menuServiceItemRenderer: MenuServiceItemRenderer;
}

export interface MenuServiceItemRenderer {
    text?: Text;
    icon?: Icon;
}

export interface Icon {
    iconType: IconType;
}

// Not exhaustive
export enum IconType {
    SEARCH = "SEARCH",
    CLOSE = "CLOSE",
    MICROPHONE_ON = "MICROPHONE_ON",
    VIDEO_CALL = "VIDEO_CALL",
    NOTIFICATIONS = "NOTIFICATIONS",
    WHAT_TO_WATCH = "WHAT_TO_WATCH",
    TAB_SHORTS = "TAB_SHORTS",
    SUBSCRIPTIONS = "SUBSCRIPTIONS",
    VIDEO_LIBRARY_WHITE = "VIDEO_LIBRARY_WHITE",
    PLAY_ALL = "PLAY_ALL",
    PLAYLIST_ADD = "PLAYLIST_ADD",
    SHARE = "SHARE",
    PLAY_ARROW = "PLAY_ARROW",
    SHUFFLE = "SHUFFLE",
    UP_ARROW = "UP_ARROW",
    NOTIFICATIONS_NONE = "NOTIFICATIONS_NONE",
    EXPAND_MORE = "EXPAND_MORE",
    LIKE = "LIKE",
    DISLIKE = "DISLIKE",
    CHEVRON_LEFT = "CHEVRON_LEFT",
    OFFLINE_DOWNLOAD = "OFFLINE_DOWNLOAD",
    MORE_VERT = "MORE_VERT",
    YOUTUBE_MUSIC_MONOCHROME = "YOUTUBE_MUSIC_MONOCHROME",
    MY_VIDEOS = "MY_VIDEOS",
    ACCOUNT_BOX = "ACCOUNT_BOX",
    PRIVACY_UNLISTED = "PRIVACY_UNLISTED",
    LOOP_ACTIVE = "LOOP_ACTIVE",
    CONTENT_CUT = "CONTENT_CUT",
    INFO = "INFO",
    SWITCH_ACCOUNTS = "SWITCH_ACCOUNTS",
    EXIT_TO_APP = "EXIT_TO_APP",
    CREATOR_STUDIO = "CREATOR_STUDIO",
    MONETIZATION_ON = "MONETIZATION_ON",
    SHIELD_WITH_AVATAR = "SHIELD_WITH_AVATAR",
    DARK_THEME = "DARK_THEME",
    TRANSLATE = "TRANSLATE",
    LANGUAGE = "LANGUAGE",
    KEYBOARD = "KEYBOARD",
    SETTINGS = "SETTINGS",
    HELP = "HELP",
    FEEDBACK = "FEEDBACK",
}
