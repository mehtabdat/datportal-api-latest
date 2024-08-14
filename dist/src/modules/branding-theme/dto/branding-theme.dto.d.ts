import { ResponseSuccess } from "src/common-types/common-types";
import { BrandingTheme } from "../entities/branding-theme.entity";
export declare class BrandingThemeResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: BrandingTheme;
}
export declare class BrandingThemeResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: BrandingTheme;
}
