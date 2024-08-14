import { Prisma } from "@prisma/client";
export declare class CreateBlogCategoryDto implements Prisma.BlogsCategoryCreateInput {
    slug: string;
    image?: string;
    imageAlt: string;
    title: string;
    highlight?: string;
    description?: string;
}
