import { Client as __Client } from "@prisma/client";
export declare class Client implements Partial<__Client> {
    id: number;
    uuid: string;
    name: string;
    type: number;
    designation: string;
    phone: string;
    phoneCode: string;
    whatsapp: string;
    email: string;
    address: string;
    companyId: number;
    isDeleted: boolean;
}
