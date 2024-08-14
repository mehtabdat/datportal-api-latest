import { Faqs } from '@prisma/client';
export declare class FaqsFiltersDto implements Partial<Faqs> {
    title?: string;
    faqsCategoryId?: number;
    faqsCategorySlug?: string;
    forAdminpanel?: boolean;
}
