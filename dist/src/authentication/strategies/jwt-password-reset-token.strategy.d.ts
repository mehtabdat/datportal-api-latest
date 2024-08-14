import { Request } from 'express';
import { AuthenticatedResetToken } from '../jwt-payload';
import { AuthService } from '../auth.service';
declare const JwtPasswordResetTokenStrategy_base: new (...args: any[]) => any;
export declare class JwtPasswordResetTokenStrategy extends JwtPasswordResetTokenStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(req: Request, payload: AuthenticatedResetToken): Promise<AuthenticatedResetToken>;
    getToken(req: Request): any;
}
export {};
