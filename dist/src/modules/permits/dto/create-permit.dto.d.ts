/// <reference types="multer" />
import { Prisma } from "@prisma/client";
import { PermitClientStatus, PermitFinanceStatus } from "src/config/constants";
import { TypeFromEnumValues } from "src/helpers/common";
export declare class CreatePermitDto implements Prisma.PermitUncheckedCreateInput {
    title?: string;
    remarks?: string;
    projectId?: number;
    authorityId?: number;
    expiryDate?: Date;
    approvedDate?: Date;
    financeStatus: TypeFromEnumValues<typeof PermitFinanceStatus>;
    clientStatus: TypeFromEnumValues<typeof PermitClientStatus>;
    files: Array<Express.Multer.File>;
}
