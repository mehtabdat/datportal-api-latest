import { Prisma } from '@prisma/client';
export declare class CreateOrganizationDto implements Prisma.OrganizationUncheckedCreateInput {
    name: string;
    description?: string;
    organizationCode?: string;
    email: string;
    phone: string;
    whatsapp?: string;
    taxRegistrationNumber?: string;
    phoneCode: string;
    type: number;
    parentId: number;
    address?: string;
    locationMap?: string;
    logo?: string;
    digitalStamp?: string;
    isPublished?: boolean;
    bankAccountNumber?: string;
    bankIBAN?: string;
    bankName?: string;
    bankSwiftCode?: string;
    bankAccountHolderName?: string;
    workingHoursId?: number;
}
