import type { YamliRequest } from "../types/private.ts";
import type { YamliCache } from "../types/public.ts";

import {
    CHECKIN_ENDPOINT,
    DEFAULT_SERVER_BUILD,
    TRANSLITERATE_ENDPOINT,
} from "./constants.ts";

const DEFAULT_CHECKIN_RESPONSE = {
    adInfo: {},
    authorization: "authorized",
    options: {},
    prefs: {},
    serverBuild: DEFAULT_SERVER_BUILD,
    showHint: true,
    showPowered: true,
};

const mapCacheValuesToResponse = (key: string, values: string): string => {
    return JSON.stringify({
        r: values
            .split("|")
            .map((variant, index) => `${variant}/${index}`)
            .join("|"),
        serverBuild: DEFAULT_SERVER_BUILD,
        staleClient: false,
        w: key,
    });
};

/**
 * Normalizes Yamli API responses into cache-friendly strings by stripping trailing indices.
 *
 * @param response - The raw Yamli response string where variants contain numeric suffixes.
 * @returns The normalized cache representation without the trailing numeric metadata.
 */
export const mapResponseToCacheValues = (response: string): string => {
    return response
        .split("|")
        .map((variant) => variant.replace(/\/\d+$/, ""))
        .join("|");
};

/**
 * Applies cached responses to Yamli requests and short-circuits network traffic when possible.
 *
 * @param url - The outgoing request URL.
 * @param cache - The cache keyed by the original transliterated word.
 * @param a - The Yamli request payload that exposes the response callback.
 * @returns Whether the request was fulfilled by the cache.
 */
export const applyCachedValueToRequest = (
    url: string,
    cache: YamliCache,
    a: YamliRequest,
): boolean => {
    if (url.includes(TRANSLITERATE_ENDPOINT)) {
        const word = new URL(url).searchParams.get("word") as string;

        if (cache[word]) {
            a._responseCallback(mapCacheValuesToResponse(word, cache[word]));
            return true;
        }
    }

    if (url.includes(CHECKIN_ENDPOINT)) {
        a._responseCallback(JSON.stringify(DEFAULT_CHECKIN_RESPONSE));
        return true;
    }

    return false;
};
