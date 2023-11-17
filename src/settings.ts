import { GM_setValue } from "$";
import { TpYtPaperListbox } from "./YouTube/TpYtPaperListbox";
import { YtdMenuPopupRenderer } from "./YouTube/YtdMenuPopupRenderer";
import { IconType, YtdMenuRenderer } from "./YouTube/YtdMenuRenderer";
import { YtdMenuServiceItemRenderer } from "./YouTube/YtdMenuServiceItemRenderer";
import { UserConfig, getUserConfig } from "./config";

function htmlToElement(html: string) {
    const template = document.createElement("template");
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild as HTMLElement;
}

const settingshtml = `
    <div style="background: var(--yt-spec-brand-background-solid); margin: 0; padding: 0; overflow: auto;">
        <div style="display: flex; flex-direction: row; align-items: center;">
            <div style="color: #f1f1f1; padding: 16px 24px; font-family: 'Roboto','Arial',sans-serif; font-size: 1.6rem; line-height: 2.2rem; font-weight: 400; display: flex; flex: 1;">
                <span>userscript-listenbrainz-client settings</span>
            </div>
            <yt-icon-button style="margin-right: 20px; color: var(--yt-spec-icon-inactive);">
                <yt-icon icon="close" class="yt-icon"></yt-icon>
            </yt-icon-button>
        </div>
        <div>
            <yt-text-input-form-field-renderer style="padding: 0 24px;"></yt-text-input-form-field-renderer>
            <div style="padding: 16px 24px; display: flex; flex-direction: row; justify-content: flex-end;">
                <ytd-button-renderer></ytd-button-renderer>
            </div>
        </div>
    </div>
`;

export async function addSettings() {
    const menuRenderer = document.querySelector<YtdMenuRenderer>("#actions-inner > #menu > ytd-menu-renderer");
    if (menuRenderer === null) return;
    menuRenderer.data.items.push({
        menuServiceItemRenderer: {
            text: {
                runs: [{
                    text: "ListenBrainz"
                }]
            },
            icon: {
                iconType: IconType.SETTINGS
            }
        }
    });

    menuRenderer.resetFlexibleItems();

    const popupRenderer = await popupOpened(menuRenderer);

    const listbox = popupRenderer.querySelector("tp-yt-paper-listbox");
    if (listbox === null) return;

    const itemRenderer = await findItemRenderer(listbox);

    const item = itemRenderer.querySelector<HTMLElement>("tp-yt-paper-item");
    if (item === null) return;

    const userConfig = getUserConfig();

    const settingsDialog = document.createElement("tp-yt-paper-dialog");
    settingsDialog.modern = true;

    const settingsPanel = htmlToElement(settingshtml);
    const closeButton = settingsPanel.querySelector<HTMLElement>("yt-icon-button");
    if (closeButton === null) return;
    closeButton.addEventListener("click", () => {
        settingsDialog.opened = false;
    });

    const lbTokenInputRenderer = settingsPanel.querySelector("yt-text-input-form-field-renderer");
    if (lbTokenInputRenderer === null) return;
    lbTokenInputRenderer.data = {
        required: false,
        placeholderText: "Enter ListenBrainz token...",
        label: {
            runs: [{
                text: "ListenBrainz token"
            }]
        },
        hideCharCounter: true
    };
    lbTokenInputRenderer.value = userConfig?.listenBrainzToken ?? "";

    const saveButtonRenderer = settingsPanel.querySelector("ytd-button-renderer");
    if (saveButtonRenderer === null) return;
    saveButtonRenderer.data = {
        isDisabled: false,
        size: "SIZE_DEFAULT",
        style: "STYLE_PRIMARY",
        text: {
            runs: [{ text: "Save" }]
        }
    };

    saveButtonRenderer.addEventListener("click", () => {
        const listenBrainzToken = lbTokenInputRenderer.value;
        const config: UserConfig = {
            listenBrainzToken
        };
        GM_setValue("userConfig", config);
    });

    const popupContainer = document.querySelector("ytd-popup-container");
    if (popupContainer === null) return;

    settingsDialog.appendChild(settingsPanel);
    popupContainer.appendChild(settingsDialog);

    item.addEventListener("click", () => {
        const backdrop = document.createElement("tp-yt-iron-overlay-backdrop");
        backdrop.style.zIndex = "2201";
        document.body.appendChild(backdrop);
        backdrop.opened = true;
        settingsDialog.opened = true;

        const closed = () => {
            settingsDialog.removeEventListener("iron-overlay-closed", closed);

            const config = getUserConfig();
            backdrop.opened = false;
            lbTokenInputRenderer.value = config.listenBrainzToken ?? "";
        };
        settingsDialog.addEventListener("iron-overlay-closed", closed);
    });
}

function popupOpened(menuRenderer: YtdMenuRenderer): Promise<YtdMenuPopupRenderer> {
    return new Promise((resolve) => {
        const popupOpened = (e: CustomEvent<YtdMenuPopupRenderer>) => {
            resolve(e.detail);
            menuRenderer.removeEventListener("yt-popup-opened", popupOpened);
        };
        menuRenderer.addEventListener("yt-popup-opened", popupOpened);

    });
}

function findItemRenderer(listbox: TpYtPaperListbox): Promise<YtdMenuServiceItemRenderer> {
    return new Promise((resolve) => {
        const itemRenderer = listbox.items?.find((item) => item.data?.text?.runs[0].text === "ListenBrainz");
        if (itemRenderer !== undefined) return resolve(itemRenderer);
        const changed = () => {
            const itemRenderer = listbox.items?.find((item) => item.data?.text?.runs[0].text === "ListenBrainz");
            if (itemRenderer === undefined) return;
            resolve(itemRenderer);
            listbox.removeEventListener("items-changed", changed);
        };
        listbox.addEventListener("items-changed", changed);
    });
}
