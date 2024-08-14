import { Prisma, SMSType } from '@prisma/client';
export declare class CreateSmDto implements Prisma.SmsConfigurationCreateInput {
    title: string;
    slug: string;
    countryId: number;
    priority?: number;
    gateway?: string;
    appId?: string;
    appPassword?: string;
    senderId?: string;
    senderIdType?: SMSType;
    isPublished?: boolean;
    test?: boolean;
}
