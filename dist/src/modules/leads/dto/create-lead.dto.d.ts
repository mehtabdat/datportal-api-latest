import { Prisma } from "@prisma/client";
export declare class CreateLeadDto implements Prisma.LeadsUncheckedCreateInput {
    clientId?: number;
    enquiryId?: number;
    representativeId?: number;
    submissionById?: number;
    projectTypeId?: number;
    message?: string;
    addedById?: number;
    dueDateForSubmissions?: Date;
}
