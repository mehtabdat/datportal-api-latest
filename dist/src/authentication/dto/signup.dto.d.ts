import { Prisma } from "@prisma/client";
export declare class EmailSignupDto implements Partial<Prisma.UserUncheckedCreateInput> {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    phoneCode?: string;
    password: string;
}
export declare class PhoneSignupDto implements Partial<Prisma.UserUncheckedCreateInput> {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    phoneCode?: string;
    password: string;
}
export declare class LoginSignUpByPhone {
    phone: number;
    phoneCode: number;
}
