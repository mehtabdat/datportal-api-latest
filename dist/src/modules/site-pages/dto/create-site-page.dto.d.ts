import { Prisma } from '@prisma/client';
export declare class CreateSitePageDto implements Prisma.SitePagesUncheckedCreateInput {
    title: string;
    slug: string;
    description?: string;
    isPublished?: boolean;
    pageSectionIds?: number[];
}
