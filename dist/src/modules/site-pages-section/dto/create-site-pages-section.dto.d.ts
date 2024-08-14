import { Prisma } from "@prisma/client";
export declare class CreateSitePagesSectionDto implements Prisma.PagesSectionCreateInput {
    title: string;
    slug: string;
    description?: string;
    isPublished?: boolean;
}
