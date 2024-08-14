import { Prisma } from "@prisma/client";
export declare class CreateProjectStateDto implements Prisma.ProjectStateCreateInput {
    title: string;
    slug: string;
    bgColor: string;
    textColor: string;
    shouldCloseProject?: boolean;
    order?: number;
}
