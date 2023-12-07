import { Text } from "./common";

export interface YtdButtonRenderer extends HTMLElement {
    data?: YtdButtonRendererData;
}

export interface YtdButtonRendererData {
    isDisabled?: boolean;
    size?: Size;
    style?: Style;
    text?: Text;
}

export enum Size {
    DEFAULT = "SIZE_DEFAULT"
}

export enum Style {
    DEFAULT = "STYLE_DEFAULT",
    MONO_TONAL_OVERLAY = "STYLE_MONO_TONAL_OVERLAY",
    MONO_FILLED_OVERLAY = "STYLE_MONO_FILLED_OVERLAY",
    INACTIVE_OUTLINE = "STYLE_INACTIVE_OUTLINE",
    TEXT = "STYLE_TEXT",
    SUGGESTIVE = "STYLE_SUGGESTIVE",
    PRIMARY = "STYLE_PRIMARY"
}
