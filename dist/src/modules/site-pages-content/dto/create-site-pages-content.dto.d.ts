import { Prisma } from '@prisma/client';
export declare class CreateSitePagesContentDto implements Prisma.PagesContentUncheckedCreateInput {
    title: string;
    highlight?: string;
    description?: string;
    pageSectionId: number;
    countryId?: number;
    image?: string;
    imageAlt?: string;
    isDefault?: number;
    isPublished?: boolean;
}
