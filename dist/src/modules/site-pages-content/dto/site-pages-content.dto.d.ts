import { ResponseSuccess } from "src/common-types/common-types";
import { SitePagesContent } from "../entities/site-pages-content.entity";
export declare class SitePagesContentResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: SitePagesContent;
}
export declare class SitePagesContentResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: SitePagesContent;
}
export declare const sitePagesContentFileUploadPath = "public/site-pages-content";
