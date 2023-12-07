import { TpYtIronOverlayBackdrop } from "./YouTube/TpYtIronOverlayBackdrop";
import { TpYtPaperDialog } from "./YouTube/TpYtPaperDialog";
import { TpYtPaperListbox } from "./YouTube/TpYtPaperListbox";
import { YtTextInputFormFieldRenderer } from "./YouTube/YtTextInputFormFieldRenderer";
import { YtdButtonRenderer } from "./YouTube/YtdButtonRenderer";
import { YtdMenuPopupRenderer } from "./YouTube/YtdMenuPopupRenderer";
import { YtdMenuRenderer } from "./YouTube/YtdMenuRenderer";
import { YtdMenuServiceItemRenderer } from "./YouTube/YtdMenuServiceItemRenderer";
import { Player, YtdPlayer } from "./YouTube/YtdPlayer";

declare global {
    interface CustomElementRegistry {
        get<K extends keyof CustomElementTagNameMap>(tagName: K): CustomElementConstructor<CustomElementTagNameMap[K]>;
    }
    interface GlobalEventHandlersEventMap {
        "yt-popup-opened": CustomEvent<YtdMenuPopupRenderer>;
        "yt-player-updated": CustomEvent<Player>;
        "yt-page-data-updated": CustomEvent<{ pageType: string }>
    }
    interface HTMLElementTagNameMap extends CustomElementTagNameMap {}
}

interface CustomElementConstructor<K> {
    prototype: K;
    new(): K;
}

interface CustomElementTagNameMap {
    "ytd-player": YtdPlayer;
    "ytd-menu-renderer": YtdMenuRenderer;
    "tp-yt-paper-listbox": TpYtPaperListbox;
    "ytd-menu-service-item-renderer": YtdMenuServiceItemRenderer;
    "tp-yt-paper-dialog": TpYtPaperDialog;
    "yt-text-input-form-field-renderer": YtTextInputFormFieldRenderer;
    "ytd-button-renderer": YtdButtonRenderer;
    "tp-yt-iron-overlay-backdrop": TpYtIronOverlayBackdrop;
}
