import type {
    YamliRequest,
    YamliResponse,
    YamliType,
} from "./types/private.ts";
import type { YamliCache } from "./types/public.ts";

import { disableAnalytics } from "./utils/ads.ts";
import { ALPHANUMERIC_REGEX } from "./utils/constants.ts";
import {
    applyCachedValueToRequest,
    mapResponseToCacheValues,
} from "./utils/mapping.ts";

/**
 * Initializes and configures a cache for Yamli requests to intercept and store responses.
 *
 * This function overrides Yamli's request start function to check if a response is cached.
 * If a cached response is available, it is applied immediately, avoiding redundant remote requests.
 * If not cached, the original request function is invoked, and responses are processed to store new data in the cache.
 *
 * @param {YamliType} Yamli - The main Yamli object, containing request functions and configurations.
 * @param {YamliCache} [initialValue={}] - The initial cache values, if any, to preload into the cache.
 *
 * @returns {YamliCache} - The initialized and populated cache object, containing word keys with their mapped variants.
 *
 * @example
 * const Yamli = { ... }; // Assume Yamli is a configured object with necessary properties
 * const initialCache = { hello: ["مرحبا", "هلا"] };
 * const cache = initCache(Yamli, initialCache);
 * // cache now contains initial values and intercepts future requests to populate more data.
 */
export const initCache = (
    Yamli: YamliType,
    initialValue: YamliCache = {},
): YamliCache => {
    const originalFunction = Yamli.I.SXHRData.start;
    const cache: YamliCache = { ...initialValue };

    Yamli.I.SXHRData.start = (a: YamliRequest, url: string, b: unknown) => {
        if (applyCachedValueToRequest(url, cache, a)) {
            return;
        }

        originalFunction.call(Yamli.I.SXHRData, a, url, b);

        const originalResponseCallback = a._responseCallback;
        a._responseCallback = (response: string) => {
            try {
                const result = JSON.parse(response) as YamliResponse;

                if (result.w && ALPHANUMERIC_REGEX.test(result.w)) {
                    cache[result.w] = mapResponseToCacheValues(result.r);
                }
            } catch (_error: unknown) {
                // ignore
            }

            originalResponseCallback.call(a, response);
        };
    };

    return cache;
};

export { disableAnalytics };

export type { YamliCache, YamliType };
