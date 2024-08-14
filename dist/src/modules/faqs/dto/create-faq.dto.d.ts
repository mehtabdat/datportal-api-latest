import { Prisma } from '@prisma/client';
export declare class CreateFaqDto implements Prisma.FaqsUncheckedCreateInput {
    faqsCategoryId: number;
    slug: string;
    isPublished?: boolean;
    forAdminpanel?: boolean;
    title: string;
    description: string;
}
