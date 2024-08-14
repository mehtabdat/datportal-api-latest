import { BlogsCategory as PrismaBlogsCategory } from "@prisma/client";
export declare class BlogCategory implements Partial<PrismaBlogsCategory> {
    id: number;
    category: number;
    slug: string;
    status: number;
    image: string | null;
    imageAlt: string | null;
    isDeleted: boolean;
    countryId: number | null;
    addedDate: Date;
    modifiedDate: Date | null;
    deletedDate: Date | null;
    addedById: number | null;
    modifiedById: number | null;
    deletedById: number | null;
}
