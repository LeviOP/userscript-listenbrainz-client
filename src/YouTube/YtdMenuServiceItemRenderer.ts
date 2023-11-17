import { Text } from "./common";

export interface YtdMenuServiceItemRenderer extends HTMLElement {
    data?: YtdMenuServiceItemRendererData;
}

export interface YtdMenuServiceItemRendererData {
    text?: Text;
}
