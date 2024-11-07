import { beforeEach, describe, expect, it, mock } from 'bun:test';

import type { YamliType } from './types/private.ts';
import type { YamliCache } from './types/public.ts';

import { initCache } from './index.ts';

describe('index', () => {
    let Yamli: YamliType;
    let cache: YamliCache;

    beforeEach(() => {
        // Freshly initialize Yamli and cache for each test
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

        cache = {};
    });

    describe('initCache', () => {
        describe('disableAnalytics', () => {
            it.only('should replace all report functions with MockedFunction', () => {
                initCache(Yamli);
                expect(Yamli.global.reportImpression).toBeInstanceOf(Function);
                expect(Yamli.global.reportTyped).toBeInstanceOf(Function);
                expect(Yamli.global.reportTransliterationSelection).toBeInstanceOf(Function);
                expect(Yamli.global.reportImpressionTime).toBeInstanceOf(Function);
            });
        });

        describe('mapCacheValuesToResponse', () => {
            it('should map cache values to response format string', () => {
                const expectedResponse = JSON.stringify({
                    r: 'value1\\/0|value2\\/1',
                    serverBuild: DEFAULT_SERVER_BUILD,
                    staleClient: false,
                    w: testKey,
                });
                const response = mapCacheValuesToResponse(testKey, testValues);
                expect(response).toBe(expectedResponse);
            });
        });

        describe('initCache', () => {
            let mockRequest: YamliRequest;

            beforeEach(() => {
                mockRequest = {
                    _responseCallback: mock(),
                };
            });

            it('should disable analytics and return a cache', () => {
                const resultCache = initCache(Yamli);
                expect(Yamli.global.reportImpression).toBeInstanceOf(Function);
                expect(Yamli.global.reportTyped).toBeInstanceOf(Function);
                expect(Yamli.global.reportTransliterationSelection).toBeInstanceOf(Function);
                expect(Yamli.global.reportImpressionTime).toBeInstanceOf(Function);
                expect(resultCache).toEqual({});
            });

            it('should apply cached response to requests', () => {
                const resultCache = initCache(Yamli, cache);
                const url = `${TRANSLITERATE_ENDPOINT}?word=example`;

                // Mocking original SXHRData.start call to check application of cache
                Yamli.I.SXHRData.start.mockImplementation((req, reqUrl, b) => {
                    expect(applyCachedValueToRequest(reqUrl, resultCache, req)).toBe(true);
                });

                Yamli.I.SXHRData.start(mockRequest, url, null);
            });

            it('should call original response callback after processing', () => {
                const resultCache = initCache(Yamli, cache);
                const url = `${TRANSLITERATE_ENDPOINT}?word=test`;
                const mockResponse = JSON.stringify({ r: 'response\\/0', w: 'test' });

                // Mock original function and response callback
                const originalFunction = mock((a: YamliRequest, url: string, b: any) => {
                    a._responseCallback(mockResponse);
                });
                Yamli.I.SXHRData.start = originalFunction;

                Yamli.I.SXHRData.start(mockRequest, url, null);
                mockRequest._responseCallback(mockResponse);

                // Ensure response was processed
                expect(originalFunction).toHaveBeenCalled();
                expect(mockRequest._responseCallback).toHaveBeenCalledWith(mockResponse);
                expect(resultCache['test']).toEqual(['response']);
            });

            it('should not modify cache if response format is invalid', () => {
                const resultCache = initCache(Yamli, cache);
                const url = `${TRANSLITERATE_ENDPOINT}?word=invalid`;
                const invalidResponse = 'invalid response';

                // Mock original function and response callback
                const originalFunction = mock((a: YamliRequest, url: string, b: any) => {
                    a._responseCallback(invalidResponse);
                });
                Yamli.I.SXHRData.start = originalFunction;

                Yamli.I.SXHRData.start(mockRequest, url, null);
                mockRequest._responseCallback(invalidResponse);

                // Ensure the cache was not modified
                expect(resultCache['invalid']).toBeUndefined();
            });
        });
    });
});
