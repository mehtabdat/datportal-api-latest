import { Organization as PrismaOrganization } from "@prisma/client";
export declare class Organization implements Partial<PrismaOrganization> {
    id: number;
    uuid: string;
    email: string | null;
    phone: string | null;
    phoneCode: string | null;
    address: string | null;
    locationMap: string | null;
    description: string | null;
    logo: string | null;
    countryId: number;
    status: number;
    addedDate: Date;
    modifiedDate: Date | null;
    deletedDate: Date | null;
    isDeleted: boolean;
    isPublished: boolean;
    addedBy: number | null;
    modifiedBy: number | null;
    deletedBy: number | null;
}
