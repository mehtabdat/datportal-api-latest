import { Prisma } from "@prisma/client";
export declare class CreatePaymentGatewayDto implements Prisma.PaymentGatewayUncheckedCreateInput {
    title: string;
    slug: string;
    gatewayURL?: string;
    gatewayPublicKey?: string;
    gatewayPrivateKey: string;
    isPublished?: boolean;
    test?: boolean;
    isDefault?: boolean;
    countryId?: number;
    storeId?: string;
}
