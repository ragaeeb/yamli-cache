import type { YamliRequest, YamliResponse, YamliType } from './types/private.ts';
import type { YamliCache } from './types/public.ts';

import { ALPHANUMERIC_REGEX } from './utils/constants.ts';
import { applyCachedValueToRequest, mapResponseToCacheValues } from './utils/mapping.ts';

export const initCache = (Yamli: YamliType, initialValue: YamliCache = {}): YamliCache => {
    const originalFunction = Yamli.I.SXHRData.start;
    const cache: YamliCache = { ...initialValue };

    Yamli.I.SXHRData.start = (a: YamliRequest, url: string, b: any) => {
        if (applyCachedValueToRequest(url, cache, a)) {
            return;
        }

        originalFunction.call(Yamli.I.SXHRData, a, url, b);

        const originalResponseCallback = a._responseCallback;
        a._responseCallback = (response: any) => {
            try {
                const result = JSON.parse(response) as YamliResponse;

                if (result.w && ALPHANUMERIC_REGEX.test(result.w)) {
                    cache[result.w] = mapResponseToCacheValues(result.r);
                }
            } catch (err: any) {
                // ignore
            }

            originalResponseCallback.call(a, response);
        };
    };

    return cache;
};
