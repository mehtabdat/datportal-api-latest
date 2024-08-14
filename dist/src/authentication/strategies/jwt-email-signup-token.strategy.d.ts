import { Request } from 'express';
import { AuthenticatedUserEmail } from '../jwt-payload';
declare const JwtEmailSignupTokenStrategy_base: new (...args: any[]) => any;
export declare class JwtEmailSignupTokenStrategy extends JwtEmailSignupTokenStrategy_base {
    constructor();
    validate(req: Request, payload: AuthenticatedUserEmail): Promise<{
        email: string;
        userAgent: string;
    }>;
}
export {};
