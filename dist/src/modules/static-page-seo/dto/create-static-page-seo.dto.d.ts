import { Prisma } from "@prisma/client";
export declare class CreateStaticPageSeoDto implements Prisma.StaticPageSEOUncheckedCreateInput {
    seoTitle: string;
    seoDescription: string;
    image?: string;
    countryId?: number;
    sitePageId?: number;
}
