import { ProjectComponent as __ProjectComponent } from "@prisma/client";
export declare class ProjectComponent implements Partial<__ProjectComponent> {
    id: number;
    title: string;
    slug: string;
    isPublished: boolean;
    isDeleted: boolean;
    addedDate: Date;
}
