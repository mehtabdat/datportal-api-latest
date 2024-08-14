export type ResponseSuccess = {
    message: string | Array<object>;
    statusCode: number;
    data: any;
    meta?: {
        page: number;
        perPage: number;
        pageCount: number;
        total: number;
    };
};
export type PickByType<T, Value> = {
    [P in keyof T as T[P] extends Value | undefined ? P : never]: T[P];
};
export type OmitNever<T> = {
    [K in keyof T as T[K] extends never ? never : K]: T[K];
};
export type ResponseError = ResponseSuccess & {
    error?: string;
};
export declare class SEOData {
    seoTitle: string;
    seoDescription: string;
}
export declare class ManualAction {
    value: number;
    message: string;
}
export declare class Pagination {
    perPage: number;
    page: number;
}
export declare class ParamsDto {
    id: number;
}
export declare class FindBySlugDto {
    slug: string;
}
