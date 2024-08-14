import { JwtService } from '@nestjs/jwt';
import { AuthenticatedUser } from './jwt-payload';
export declare class TokenService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    verifyUserToken(token: string, ignoreExpiration?: boolean): Promise<AuthenticatedUser>;
    verifyUserSubscriptionToken(token: string, ignoreExpiration?: boolean): Promise<AuthenticatedUser>;
    generateUnsubscribeToken(userId: number): string;
}
