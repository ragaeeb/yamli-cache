import { beforeEach, describe, expect, it, mock } from 'bun:test';

import type { YamliRequest } from '../types/private.ts';

import { CHECKIN_ENDPOINT, TRANSLITERATE_ENDPOINT } from './constants.ts';
import { applyCachedValueToRequest, mapResponseToCacheValues } from './mapping.ts';

describe('mapping', () => {
    describe('mapResponseToCacheValues', () => {
        it('should replace all report functions with MockedFunction', () => {
            const cacheValues = mapResponseToCacheValues('a/0|b/1|c/1|d/1|e/1');
            expect(cacheValues).toEqual('a|b|c|d|e');
        });
    });

    describe('applyCachedValueToRequest', () => {
        let mockRequest: YamliRequest;

        beforeEach(() => {
            mockRequest = {
                _responseCallback: mock(),
            };
        });

        it('should apply cached transliterate response if endpoint matches', () => {
            const result = applyCachedValueToRequest(
                `https${TRANSLITERATE_ENDPOINT}word=example`,
                { example: ['a', 'b'].join('|') },
                mockRequest,
            );
            expect(result).toBe(true);
            expect(mockRequest._responseCallback).toHaveBeenCalledTimes(1);
            expect(mockRequest._responseCallback).toHaveBeenCalledWith(
                JSON.stringify({
                    r: 'a\\/0|b\\/1',
                    serverBuild: '5515',
                    staleClient: false,
                    w: 'example',
                }),
            );
        });

        it('should be a no-op if there is no cache hit', () => {
            const result = applyCachedValueToRequest(`https${TRANSLITERATE_ENDPOINT}word=example`, {}, mockRequest);
            expect(result).toBe(false);
            expect(mockRequest._responseCallback).not.toHaveBeenCalled();
        });

        it('should apply default check-in response if endpoint matches', () => {
            const url = `https${CHECKIN_ENDPOINT}`;
            const result = applyCachedValueToRequest(url, {}, mockRequest);
            expect(result).toBe(true);
            expect(mockRequest._responseCallback).toHaveBeenCalledWith(
                `{"adInfo":{},"authorization":"authorized","options":{},"prefs":{},"serverBuild":"5515","showHint":true,"showPowered":true}`,
            );
        });

        it('should return false if no endpoint matches', () => {
            const url = 'https://example.com';
            const result = applyCachedValueToRequest(url, {}, mockRequest);
            expect(result).toBe(false);
            expect(mockRequest._responseCallback).not.toHaveBeenCalled();
        });
    });
});
