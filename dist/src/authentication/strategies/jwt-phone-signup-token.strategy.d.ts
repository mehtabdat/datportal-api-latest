import { Request } from 'express';
import { AuthenticatedUserPhone } from '../jwt-payload';
declare const JwtPhoneSignupTokenStrategy_base: new (...args: any[]) => any;
export declare class JwtPhoneSignupTokenStrategy extends JwtPhoneSignupTokenStrategy_base {
    constructor();
    validate(req: Request, payload: AuthenticatedUserPhone): Promise<{
        phone: string;
        phoneCode: string;
        userAgent: string;
    }>;
}
export {};
