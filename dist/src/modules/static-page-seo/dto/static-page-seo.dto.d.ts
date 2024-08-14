import { StaticPageSeo } from "../entities/static-page-seo.entity";
import { ResponseSuccess } from "src/common-types/common-types";
export declare const StaticPageSEOFileUploadPath = "/public/static-page-seo/";
export declare class StaticPageSEOResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: StaticPageSeo;
}
export declare class StaticPageSEOResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: StaticPageSeo;
}
