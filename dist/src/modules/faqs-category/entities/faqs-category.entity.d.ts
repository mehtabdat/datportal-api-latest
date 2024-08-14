import { FaqsCategory as PrismaFaqsCategory } from "@prisma/client";
export declare class FaqsCategory implements Partial<PrismaFaqsCategory> {
    slug?: string;
    isDeleted?: boolean;
    isPublished?: boolean;
    language?: string;
    title?: string;
    description?: string;
}
