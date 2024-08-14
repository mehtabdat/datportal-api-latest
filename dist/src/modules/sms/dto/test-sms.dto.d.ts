import { SMSType } from '@prisma/client';
export declare class TestSMSDto {
    phoneCode: string;
    phone: string;
    message: string;
    smsType: SMSType;
}
