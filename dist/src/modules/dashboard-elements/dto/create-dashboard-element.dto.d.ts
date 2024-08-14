import { Prisma } from "@prisma/client";
export declare class CreateDashboardElementDto implements Prisma.DashboardElementUncheckedCreateInput {
    title: string;
    slug: string;
    isPublished?: boolean;
}
