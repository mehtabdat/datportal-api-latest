import { SitePages } from "@prisma/client";
export declare class SitePage implements Partial<SitePages> {
    id: number;
    slug: string;
    title: string;
    description: string | null;
    isPublished: boolean;
    isDeleted: boolean;
}
