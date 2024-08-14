import { Auth } from 'googleapis';
export declare class GoogleAuthService {
    oauthClient: Auth.OAuth2Client;
    constructor();
    authenticate(token: string): Promise<{
        email: string;
        firstName: string;
        lastName: string;
        profile: string;
    }>;
}
