import { AuthenticatedUser } from 'src/authentication/jwt-payload';
import { AuthorizationService } from 'src/authorization/authorization.service';
import { PrismaService } from 'src/prisma.service';
export declare class LeaveRequestAuthorizationService extends AuthorizationService {
    protected readonly prisma: PrismaService;
    constructor(prisma: PrismaService);
    isAuthorizedForLeaveRequest(recordId: number, user: AuthenticatedUser): Promise<boolean>;
    isAuthorizedForLeaveRequestToRead(recordId: number, user: AuthenticatedUser): Promise<boolean>;
    isUserProjectManager(recordId: number, user: AuthenticatedUser): Promise<boolean>;
}
