import { Faqs as PrismaFaqs } from "@prisma/client";
export declare class Faq implements Partial<PrismaFaqs> {
    slug?: string;
    isDeleted?: boolean;
    isPublished?: boolean;
    title?: string;
    description?: string;
}
