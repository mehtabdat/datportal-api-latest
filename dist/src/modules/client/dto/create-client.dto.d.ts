import { Prisma } from '@prisma/client';
import { ClientType } from 'src/config/constants';
export declare class CreateClientDto implements Prisma.ClientUncheckedCreateInput {
    name: string;
    email: string;
    phone: string;
    whatsapp?: string;
    phoneCode: string;
    type: typeof ClientType[keyof typeof ClientType];
    companyId: number;
    address?: string;
    taxRegistrationNumber?: string;
}
