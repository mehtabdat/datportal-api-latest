import { PagesContent } from "@prisma/client";
export declare class SitePagesContent implements Partial<PagesContent> {
    id: number;
    pageSectionId: number;
    image: string | null;
    imageAlt: string | null;
    isDefault: number;
    addedDate: Date;
    addedById: number | null;
    countryId: number | null;
    modifiedDate: Date | null;
    modifiedById: number | null;
    isPublished: boolean;
    isDeleted: boolean;
}
