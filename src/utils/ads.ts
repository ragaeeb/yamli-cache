import type { YamliType } from '../types/private';

const MockedFunction = () => {};

export const disableAnalytics = ({ global }: YamliType): void => {
    global.reportImpression = MockedFunction;
    global.reportTyped = MockedFunction;
    global.reportTransliterationSelection = MockedFunction;
    global.reportImpressionTime = MockedFunction;
};
