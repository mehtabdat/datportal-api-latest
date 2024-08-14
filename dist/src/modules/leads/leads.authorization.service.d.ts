import { AuthenticatedUser } from 'src/authentication/jwt-payload';
import { AuthorizationService } from 'src/authorization/authorization.service';
import { PrismaService } from 'src/prisma.service';
export declare class LeadsAuthorizationService extends AuthorizationService {
    protected readonly prisma: PrismaService;
    constructor(prisma: PrismaService);
    isAuthorizedForLeads(recordId: number, user: AuthenticatedUser): Promise<boolean>;
    isAuthorizedForLeadsNote(recordId: number, user: AuthenticatedUser): Promise<boolean>;
    isAuthorizedForLeadsDocument(recordId: number, user: AuthenticatedUser): Promise<boolean>;
}
