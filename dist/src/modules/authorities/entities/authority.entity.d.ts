import { Authorities } from "@prisma/client";
export declare class Authority implements Partial<Authorities> {
    id: number;
    title: string;
    slug: string;
    isPublished: boolean;
    isDeleted: boolean;
    addedDate: Date;
}
