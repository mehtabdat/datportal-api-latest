import { StaticPageSEO as __StaticPageSEO } from "@prisma/client";
export declare class StaticPageSeo implements __StaticPageSEO {
    id: number;
    seoTitle: string;
    seoDescription: string;
    image: string | null;
    countryId: number | null;
    sitePageId: number;
    organizationId: number | null;
    addedDate: Date;
    modifiedDate: Date | null;
    modifiedById: number;
    isDefault: number;
}
