import { AuthTokens, TokenTypes } from "@prisma/client";
export declare class UserAuthTokensIssuedDto implements Partial<AuthTokens> {
    userId: number;
    organizationId: number;
    userAgent?: string;
    userIP?: string;
    tokenType?: TokenTypes;
    fromDate?: string;
    toDate?: string;
}
