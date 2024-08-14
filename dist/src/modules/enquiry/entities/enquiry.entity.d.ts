import { Enquiry as __Enquiry } from "@prisma/client";
export declare class Enquiry implements Partial<__Enquiry> {
    id: number;
    uuid: string;
    name: string;
    slug: string;
    email: string;
    phone: string;
    phoneCode: string;
    message: string;
    source: string;
    userAgent: string;
    userIP: string;
    reference: string;
    isDeleted: boolean;
}
