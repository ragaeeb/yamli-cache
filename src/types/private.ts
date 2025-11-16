export type YamliResponse = {
    r: string;
    w: string;
};

export type YamliRequest = {
    _responseCallback(value: string): void;
};

export interface YamliType {
    global: {
        reportImpression(): void;
        reportImpressionTime(): void;
        reportTransliterationSelection(): void;
        reportTyped(): void;
    };
    I: {
        SXHRData: {
            start(request: YamliRequest, url: string, b: unknown): void;
        };
    };
}
