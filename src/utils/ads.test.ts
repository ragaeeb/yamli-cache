import { describe, expect, it, mock } from "bun:test";

import type { YamliType } from "../types/private.ts";

import { disableAnalytics } from "./ads.ts";

describe("utils/ads", () => {
    it("replaces Yamli analytics hooks with no-op functions", () => {
        const reportSpy = mock(() => {
            throw new Error("should not be called");
        });

        const Yamli: YamliType = {
            global: {
                reportImpression: reportSpy,
                reportImpressionTime: reportSpy,
                reportTransliterationSelection: reportSpy,
                reportTyped: reportSpy,
            },
            I: {
                SXHRData: {
                    start: mock(),
                },
            },
        };

        disableAnalytics(Yamli);

        expect(typeof Yamli.global.reportImpression).toBe("function");
        expect(Yamli.global.reportImpression).toBe(Yamli.global.reportTyped);
        expect(Yamli.global.reportImpressionTime).toBe(
            Yamli.global.reportTransliterationSelection,
        );
        expect(() => Yamli.global.reportImpression()).not.toThrow();
    });
});
