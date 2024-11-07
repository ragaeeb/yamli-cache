import type { YamliType } from '../types/private';

const MockedFunction = () => {};

/**
 * Disables analytics reporting.
 * @param param0 The Yamli object.
 */
export const disableAnalytics = ({ global }: YamliType): void => {
    global.reportImpression = MockedFunction;
    global.reportTyped = MockedFunction;
    global.reportTransliterationSelection = MockedFunction;
    global.reportImpressionTime = MockedFunction;
};
