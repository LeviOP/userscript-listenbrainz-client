import { Text } from "./common";

export interface YtdButtonRenderer extends HTMLElement {
    data?: YtdButtonRendererData;
}

export interface YtdButtonRendererData {
    isDisabled?: boolean;
    size?: string;
    style?: string;
    text?: Text;
}
