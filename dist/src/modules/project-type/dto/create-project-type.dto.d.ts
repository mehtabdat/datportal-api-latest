import { Prisma } from "@prisma/client";
export declare class CreateProjectTypeDto implements Prisma.ProjectTypeCreateInput {
    title: string;
    slug: string;
    isPublished: boolean;
}
