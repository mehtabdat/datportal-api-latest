import { Prisma } from "@prisma/client";
import { InvoiceType } from "src/config/constants";
import { TypeFromEnumValues } from "src/helpers/common";
export declare class InvoiceItem implements Partial<Prisma.InvoiceItemUncheckedCreateInput> {
    id: number;
    title?: string;
    quantity?: number;
    amount?: number;
    productId: number;
    accountId: number;
    taxRateId: number;
}
export declare class CreateInvoiceDto implements Prisma.InvoiceUncheckedCreateInput {
    title?: string;
    invoiceNumber: string;
    projectId?: number;
    quotationId?: number;
    type?: TypeFromEnumValues<typeof InvoiceType>;
    invoiceItems: Array<InvoiceItem>;
    file?: string;
    milestoneIds: number | Array<number>;
    hasSupervisionCharge?: boolean;
    issueDate?: Date;
    expiryDate?: Date;
}
