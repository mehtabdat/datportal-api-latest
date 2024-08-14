import { ProjectType as __ProjectType } from "@prisma/client";
export declare class ProjectType implements Partial<__ProjectType> {
    id: number;
    title: string;
    slug: string;
    isPublished: boolean;
    isDeleted: boolean;
    addedDate: Date;
}
