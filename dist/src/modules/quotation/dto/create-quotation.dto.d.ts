import { Prisma } from "@prisma/client";
import { QuotationType, SupervisionPaymentSchedule } from "src/config/constants";
import { TypeFromEnumValues } from "src/helpers/common";
export declare class QuotationMilestone implements Prisma.QuotationMilestoneUncheckedCreateInput {
    id: number;
    productId: number;
    accountId: number;
    taxRateId: number;
    amount?: number;
    quantity?: number;
    requirePayment?: boolean;
    title?: string;
}
export declare class CreateQuotationDto implements Prisma.QuotationUncheckedCreateInput {
    leadId: number;
    quoteNumber: string;
    clientId: number;
    brandingThemeId: number;
    revisedQuotationReferenceId: number;
    submissionById?: number;
    issueDate?: Date;
    expiryDate?: Date;
    hasSupervision?: boolean;
    supervisionMonthlyCharge?: number;
    supervisionPaymentSchedule?: TypeFromEnumValues<typeof SupervisionPaymentSchedule>;
    scopeOfWork?: string;
    paymentTerms?: string;
    note?: string;
    file?: string;
    type?: TypeFromEnumValues<typeof QuotationType>;
    milestone: Array<QuotationMilestone>;
}
