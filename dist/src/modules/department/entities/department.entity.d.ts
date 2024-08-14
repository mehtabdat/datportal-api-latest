import { Department as __Department } from "@prisma/client";
export declare class Department implements Partial<__Department> {
    id: number;
    title: string;
    slug: string;
    isPublished: boolean;
    isDeleted: boolean;
    addedDate: Date;
}
