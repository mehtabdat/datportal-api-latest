import { ResponseSuccess } from "src/common-types/common-types";
import { SitePage } from "../entities/site-page.entity";
export declare class SitePageResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: SitePage;
}
export declare class SitePageResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: SitePage;
}
