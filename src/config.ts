import { GM_getValue } from "$";

export interface UserConfig {
    listenBrainzToken?: string;
}

export function getUserConfig() {
    const data = GM_getValue("userConfig");
    const sanitized = sanitizeUserConfig(data);
    return sanitized;
}

export function sanitizeUserConfig(raw: unknown): UserConfig {
    const userConfig: UserConfig = {};

    if (typeof raw !== "object" || raw === null) return userConfig;

    if ("listenBrainzToken" in raw && typeof raw.listenBrainzToken === "string") userConfig.listenBrainzToken = raw.listenBrainzToken;

    return userConfig;
}
