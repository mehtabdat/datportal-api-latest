import { Prisma } from "@prisma/client";
export declare class AutoCreateProjectDto implements Prisma.ProjectUncheckedCreateInput {
    title: string;
    quoteId?: number;
    submissionById?: number;
    projectTypeId?: number;
    instructions?: string;
    startDate?: Date;
    endDate?: Date;
    xeroReference: string;
}
