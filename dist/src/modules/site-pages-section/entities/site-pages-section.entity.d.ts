import { PagesSection } from "@prisma/client";
export declare class SitePagesSection implements Partial<PagesSection> {
    id: number;
    slug: string;
    title: string;
    description: string | null;
    isPublished: boolean;
    isDeleted: boolean;
}
