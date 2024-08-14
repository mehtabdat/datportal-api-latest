import { AuthenticatedUser } from 'src/authentication/jwt-payload';
import { AuthorizationService } from 'src/authorization/authorization.service';
import { PrismaService } from 'src/prisma.service';
export declare class EnquiryAuthorizationService extends AuthorizationService {
    protected readonly prisma: PrismaService;
    constructor(prisma: PrismaService);
    isAuthorizedForEnquiry(recordId: number, user: AuthenticatedUser): Promise<boolean>;
    isAuthorizedForEnquiryNote(recordId: number, user: AuthenticatedUser): Promise<boolean>;
    isAuthorizedForEnquiryDocument(recordId: number, user: AuthenticatedUser): Promise<boolean>;
}
