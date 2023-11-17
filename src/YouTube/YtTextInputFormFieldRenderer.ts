import { Text } from "./common";

export interface YtTextInputFormFieldRenderer extends HTMLElement {
    data: YtTextInputFormFieldRendererData;
    value: string;
}

export interface YtTextInputFormFieldRendererData {
    required?: boolean;
    placeholderText?: string;
    label?: Text;
    hideCharCounter?: boolean;
}
