import { Enquiry } from "@prisma/client";
import { EnquirySource } from "src/config/constants";
export declare class CreateEnquiryDto implements Partial<Enquiry> {
    name: string;
    slug: string;
    email?: string;
    source: keyof typeof EnquirySource;
    phoneCode?: string;
    projectTypeId?: number;
    phone?: string;
    message?: string;
}
