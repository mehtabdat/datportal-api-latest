import { Prisma } from '@prisma/client';
export declare class CreateFaqsCategoryDto implements Prisma.FaqsCategoryUncheckedCreateInput {
    title: string;
    description: string;
    slug: string;
    isPublished?: boolean;
    parentId?: number;
    forAdminpanel?: boolean;
}
