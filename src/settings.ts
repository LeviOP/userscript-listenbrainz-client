import { GM_addStyle, GM_setValue } from "$";
import { YtTextInputFormFieldRenderer } from "./YouTube/YtTextInputFormFieldRenderer";
import { YtdMenuRenderer } from "./YouTube/YtdMenuRenderer";
import { getUserConfig } from "./config";

GM_addStyle(`
ytd-listenbrainz-test-renderer {
    padding: 0;
}
`);
const template = document.createElement("template");
template.innerHTML = `
<div id="header" style="display: flex; flex-direction: row; align-items: center;">
    <span style="display: flex; flex: 1; flex-direction: column; color: #f1f1f1; padding: 16px 24px; font-family: 'Roboto','Arial',sans-serif; font-size: 1.6rem; line-height: 2.2rem; font-weight: 400;">userscript-listenbrainz-client settings</span>
    <yt-icon-button id="close-button" on-tap="onTapClose" style="margin-right: 20px; color: var(--yt-spec-icon-inactive);">
        <yt-icon icon="close" class="style-scope ytd-add-to-playlist-renderer"></yt-icon>
    </yt-icon-button>
</div>
<div id="settings">
    <yt-text-input-form-field-renderer style="padding: 0 24px;" data="[[data.settings.token.textInputFormFieldRenderer]]" value="[[config.listenBrainzToken]]" id="setting-listenBrainzToken"></yt-text-input-form-field-renderer>
</div>
<div style="padding: 16px 24px; display: flex; flex-direction: row; justify-content: flex-end;">
    <ytd-button-renderer data="[[data.saveButton.buttonRenderer]]" on-tap="onTapSave"></ytd-button-renderer>
</div>
`;


Polymer({
    is: "ytd-listenbrainz-test-renderer",
    properties: {
        data: Object,
        config: Object
    },
    _template: template,
    listeners: {
        "yt-popup-opened": "onPopupOpened"
    },
    onTapClose(this: HTMLElement) {
        this.dispatchEvent(new CustomEvent("yt-action", {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: {
                actionName: "yt-close-popup-action",
                optionalAction: false,
                args: ["ytd-listenbrainz-test-renderer"],
                returnValue: []
            }
        }));
    },
    onTapSave(this: HTMLElement) {
        const listenBrainzToken = this.querySelector<YtTextInputFormFieldRenderer>("#setting-listenBrainzToken")?.value;
        GM_setValue("userConfig", {
            listenBrainzToken
        });
    },
    onPopupOpened() {
        const userConfig = getUserConfig();
        this.config = userConfig;
    }
});

window.addEventListener("yt-page-data-updated", (event) => {
    if (event.detail.pageType !== "watch") return;

    const watchFlexy = document.querySelector("ytd-watch-flexy");
    if (watchFlexy === null || !("data" in watchFlexy)) return;

    // eslint-disable-next-line
    const menuItems = (watchFlexy.data as any)?.contents?.twoColumnWatchNextResults?.results?.results?.contents?.[0]?.videoPrimaryInfoRenderer?.videoActions?.menuRenderer?.items;
    if (menuItems === undefined || !Array.isArray(menuItems)) return;

    // HACK: Manually checking if we've already added our menuItem, instead of actaully figuring out when new watch data is added.
    if (menuItems.some((item) => item?.menuServiceItemRenderer?.serviceEndpoint?.openPopupAction?.popup?.listenbrainzTestRenderer !== undefined)) return;

    menuItems.push({
        menuServiceItemRenderer: {
            icon: {
                iconType: "SETTINGS"
            },
            text: {
                runs: [{
                    text: "ListenBrainz"
                }]
            },
            serviceEndpoint: {
                openPopupAction: {
                    popup: {
                        listenbrainzTestRenderer: {
                            settings: {
                                token: {
                                    textInputFormFieldRenderer: {
                                        required: false,
                                        placeholderText: "Enter ListenBrainz token...",
                                        label: {
                                            runs: [{
                                                text: "ListenBrainz token"
                                            }]
                                        },
                                        hideCharCounter: true
                                    }
                                }
                            },
                            saveButton: {
                                buttonRenderer: {
                                    isDisabled: false,
                                    size: "SIZE_DEFAULT",
                                    style: "STYLE_PRIMARY",
                                    text: {
                                        runs: [{ text: "Save" }]
                                    }
                                }
                            }
                        }
                    },
                    popupType: "DIALOG"
                }
            }
        }
    });

    const menuRenderer = document.querySelector<YtdMenuRenderer>("#actions-inner > #menu > ytd-menu-renderer");
    if (menuRenderer === null) return;
    menuRenderer.resetFlexibleItems();
});
