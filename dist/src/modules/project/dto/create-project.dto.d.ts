import { Prisma } from "@prisma/client";
export declare class CreateProjectDto implements Prisma.ProjectUncheckedCreateInput {
    title: string;
    clientId?: number;
    clientRepresentativeId?: number;
    projectInchargeId?: number[];
    supportEngineersId?: number[];
    clients?: number[];
    projectTypeId?: number;
    quoteNumber?: string;
    projectFilesLink?: string;
    xeroReference?: string;
    startDate?: string | Date;
    endDate?: string | Date;
    priority?: number;
    instructions?: string;
    submissionById?: number;
    addedById?: number;
    referenceNumber?: string;
}
