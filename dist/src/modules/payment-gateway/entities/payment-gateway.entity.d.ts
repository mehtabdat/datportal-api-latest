import { PaymentGateway as PrismaPaymentGateway } from "@prisma/client";
export declare class PaymentGateway implements Partial<PrismaPaymentGateway> {
    id: number;
    title: string;
    slug: string;
    gatewayURL: string | null;
    gatewayPublicKey: string | null;
    gatewayPrivateKey: string;
    isPublished: boolean;
    isDeleted: boolean;
    addedDate: Date;
    addedById: number | null;
    modifiedDate: Date | null;
    modifiedById: number | null;
    deletedDate: Date | null;
    deletedById: number | null;
}
