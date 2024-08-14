import { Invoice } from "@prisma/client";
import { InvoiceStatus } from "src/config/constants";
import { TypeFromEnumValues } from "src/helpers/common";
export declare class InvoiceFiltersDto implements Partial<Invoice> {
    projectId?: number;
    clientId?: number;
    id?: number;
    invoiceNumber?: string;
    projectTypeId?: number;
    __status?: TypeFromEnumValues<typeof InvoiceStatus>[];
    fromDate?: string;
    toDate?: string;
    hasConcerns?: boolean;
}
