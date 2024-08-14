import { Prisma } from "@prisma/client";
export declare class CreateBlogDto implements Prisma.BlogsUncheckedCreateInput {
    slug: string;
    title: string;
    highlight?: string;
    description?: string;
    image?: string;
    imageAlt: string;
    category?: number;
    blogCategoryId?: number;
}
