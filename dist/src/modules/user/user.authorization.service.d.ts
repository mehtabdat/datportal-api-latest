import { AuthenticatedUser } from 'src/authentication/jwt-payload';
import { AuthorizationService } from 'src/authorization/authorization.service';
import { PrismaService } from 'src/prisma.service';
export declare class UserAuthorizationService extends AuthorizationService {
    protected readonly prisma: PrismaService;
    constructor(prisma: PrismaService);
    isAuthorizedForUser(recordId: number, user: AuthenticatedUser): Promise<boolean>;
    isAuthorizedForUserDocument(recordId: number, user: AuthenticatedUser): Promise<boolean>;
}
