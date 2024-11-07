import { beforeEach, describe, expect, it, mock } from 'bun:test';

import type { YamliType } from '../types/private';

import { disableAnalytics } from './ads.ts';

describe('ads', () => {
    let Yamli: YamliType;

    beforeEach(() => {
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
    });

    describe('disableAnalytics', () => {
        it('should replace all report functions with MockedFunction', () => {
            disableAnalytics(Yamli);
            expect(Yamli.global.reportImpression).toBeInstanceOf(Function);
            expect(Yamli.global.reportTyped).toBeInstanceOf(Function);
            expect(Yamli.global.reportTransliterationSelection).toBeInstanceOf(Function);
            expect(Yamli.global.reportImpressionTime).toBeInstanceOf(Function);
        });
    });
});
