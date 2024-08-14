import { Prisma } from "@prisma/client";
export declare class CreateProjectComponentDto implements Prisma.ProjectComponentCreateInput {
    title: string;
    slug: string;
}
