import { DashboardElement as __DashboardELement } from "@prisma/client";
export declare class DashboardElement implements Partial<__DashboardELement> {
    id: number;
    title: string;
    slug: string;
    isPublished: boolean;
    isDeleted: boolean;
}
