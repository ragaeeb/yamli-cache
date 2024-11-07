import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { promises as fs } from 'node:fs';
import path from 'node:path';

import type { YamliType } from './types/private.ts';
import type { YamliCache } from './types/public.ts';

import { initCache } from './index.ts';
import { CHECKIN_ENDPOINT, TRANSLITERATE_ENDPOINT } from './utils/constants.ts';

describe('index', () => {
    let Yamli: YamliType;
    let cache: YamliCache;

    beforeEach(async () => {
        Yamli = {
            global: {
                reportImpression: mock(),
                reportImpressionTime: mock(),
                reportTransliterationSelection: mock(),
                reportTyped: mock(),
            },
            I: {
                SXHRData: {
                    start: mock(),
                },
            },
        };

        cache = JSON.parse(await fs.readFile(path.join('mock', 'yamli.json'), 'utf-8'));
    });

    describe('initCache', () => {
        it('should respond with cached value', () => {
            const originalFunction = Yamli.I.SXHRData.start;

            initCache(Yamli, cache);
            const mockRequest = {
                _responseCallback: mock(),
            };

            Yamli.I.SXHRData.start(mockRequest, `http${TRANSLITERATE_ENDPOINT}word=3bd`, null);

            expect(mockRequest._responseCallback).toHaveBeenCalledTimes(1);
            expect(mockRequest._responseCallback).toHaveBeenCalledWith(
                `{"r":"عبد\\\\/0|عبض\\\\/1","serverBuild":"5515","staleClient":false,"w":"3bd"}`,
            );

            expect(originalFunction).not.toHaveBeenCalled();
        });

        it('should respond with checkin mock', () => {
            const originalFunction = Yamli.I.SXHRData.start;

            initCache(Yamli, cache);
            const mockRequest = {
                _responseCallback: mock(),
            };

            Yamli.I.SXHRData.start(mockRequest, `http${CHECKIN_ENDPOINT}`, null);

            expect(mockRequest._responseCallback).toHaveBeenCalledTimes(1);
            expect(mockRequest._responseCallback).toHaveBeenCalledWith(
                `{"adInfo":{},"authorization":"authorized","options":{},"prefs":{},"serverBuild":"5515","showHint":true,"showPowered":true}`,
            );

            expect(originalFunction).not.toHaveBeenCalled();
        });

        it('should cache the new word if it is alphanumeric', () => {
            const cacheRef = initCache(Yamli, cache);
            const mockRequest = {
                _responseCallback: mock(),
            };
            const originalMockRequest = { ...mockRequest };

            Yamli.I.SXHRData.start(mockRequest, `http${TRANSLITERATE_ENDPOINT}word=abusuhayla`, null);

            mockRequest._responseCallback(
                `{"r":"a\\/0|b\\/1","serverBuild":"5515","staleClient":false,"w":"abusuhayla"}`,
            );

            expect(cacheRef['abusuhayla']).toEqual('a|b');
            expect(originalMockRequest._responseCallback).toHaveBeenCalledTimes(1);
        });

        it('should not cache the new word if it is not alphanumeric', () => {
            const cacheRef = initCache(Yamli, cache);
            const mockRequest = {
                _responseCallback: mock(),
            };
            const originalMockRequest = { ...mockRequest };

            Yamli.I.SXHRData.start(mockRequest, `http${TRANSLITERATE_ENDPOINT}word=$$$`, null);

            mockRequest._responseCallback(`{"r":"a\\/0|b\\/1","serverBuild":"5515","staleClient":false,"w":"$$$"}`);

            expect(cacheRef['$$$']).toBeUndefined();
            expect(originalMockRequest._responseCallback).toHaveBeenCalledTimes(1);
        });
    });
});
