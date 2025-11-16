import { describe, expect, it, mock } from "bun:test";

import {
    applyCachedValueToRequest,
    mapResponseToCacheValues,
} from "./mapping.ts";

const buildRequest = () => ({
    _responseCallback: mock(),
});

describe("utils/mapping", () => {
    describe("mapResponseToCacheValues", () => {
        it("strips numeric suffixes from variants", () => {
            expect(mapResponseToCacheValues("عبد/0|عبض/1")).toBe("عبد|عبض");
        });

        it("returns unchanged text when no suffix is present", () => {
            expect(mapResponseToCacheValues("yamli|cache")).toBe("yamli|cache");
        });
    });

    describe("applyCachedValueToRequest", () => {
        it("hydrates transliterate requests directly from cache", () => {
            const cache = {
                yamli: "يملی|ياملي",
            };
            const request = buildRequest();

            const result = applyCachedValueToRequest(
                "https://api.yamli.com/transliterate.ashx?word=yamli",
                cache,
                request,
            );

            expect(result).toBe(true);
            expect(request._responseCallback).toHaveBeenCalledTimes(1);
            const [[payload]] = request._responseCallback.mock.calls;
            const response = JSON.parse(payload as string);
            expect(response.r).toBe("يملی/0|ياملي/1");
            expect(response.w).toBe("yamli");
        });

        it("responds to checkin requests with a static payload", () => {
            const cache = {};
            const request = buildRequest();

            const result = applyCachedValueToRequest(
                "https://api.yamli.com/checkin.ashx?foo=bar",
                cache,
                request,
            );

            expect(result).toBe(true);
            expect(request._responseCallback).toHaveBeenCalledWith(
                '{"adInfo":{},"authorization":"authorized","options":{},"prefs":{},"serverBuild":"5515","showHint":true,"showPowered":true}',
            );
        });

        it("returns false when the request is not cacheable", () => {
            const cache = {};
            const request = buildRequest();

            const result = applyCachedValueToRequest(
                "https://yamli.com/other",
                cache,
                request,
            );

            expect(result).toBe(false);
            expect(request._responseCallback).not.toHaveBeenCalled();
        });
    });
});
