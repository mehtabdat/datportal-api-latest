import { ResponseSuccess } from "src/common-types/common-types";
import { Organization } from "../entities/organization.entity";
import { Prisma } from "@prisma/client";
export declare const organizationFileUploadPath = "public/organization";
export declare class OrganizationResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Organization;
}
export declare class OrganizationResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Organization;
}
export declare function getDynamicUploadPath(visibility: "public" | "protected" | "organization"): string;
export declare const OrganizationDefaultAttributes: Prisma.OrganizationSelect;
