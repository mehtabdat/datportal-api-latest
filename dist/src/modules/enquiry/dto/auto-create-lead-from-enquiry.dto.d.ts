import { Prisma } from "@prisma/client";
import { ClientType } from "src/config/constants";
export declare class AutoCreateLeadFromEnquiryDto implements Prisma.LeadsUncheckedCreateInput {
    clientType: typeof ClientType[keyof typeof ClientType];
    projectTypeId: number;
    submissionById?: number;
    clientId: number;
    enquiryId: number;
    message: string;
    assignedToId: number;
    dueDateForSubmissions?: Date;
}
