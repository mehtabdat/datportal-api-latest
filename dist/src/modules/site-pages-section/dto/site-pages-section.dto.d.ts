import { ResponseSuccess } from "src/common-types/common-types";
import { SitePagesSection } from "../entities/site-pages-section.entity";
export declare class SitePagesSectionResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: SitePagesSection;
}
export declare class SitePagesSectionResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: SitePagesSection;
}
