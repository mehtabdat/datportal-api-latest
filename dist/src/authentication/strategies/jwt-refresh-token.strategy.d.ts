import { Request } from 'express';
import { AuthService } from '../auth.service';
import { AuthenticatedUser } from '../jwt-payload';
declare const JwtRefreshTokenStrategy_base: new (...args: any[]) => any;
export declare class JwtRefreshTokenStrategy extends JwtRefreshTokenStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(req: Request, payload: AuthenticatedUser): Promise<AuthenticatedUser>;
    getToken(req: Request): any;
}
export {};
