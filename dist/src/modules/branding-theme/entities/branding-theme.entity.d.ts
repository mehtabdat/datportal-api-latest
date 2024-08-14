import { BrandingTheme as BrandingThemeModel } from "@prisma/client";
export declare class BrandingTheme implements BrandingThemeModel {
    id: number;
    title: string;
    paymentTerms: string;
}
