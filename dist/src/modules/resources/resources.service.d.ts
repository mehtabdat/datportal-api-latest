import { AuthenticatedUser } from 'src/authentication/jwt-payload';
import { AuthorizationService } from 'src/authorization/authorization.service';
import { ResourcesLocation } from 'src/config/constants';
import { PrismaService } from 'src/prisma.service';
export declare class ResourcesService extends AuthorizationService {
    protected readonly prisma: PrismaService;
    constructor(prisma: PrismaService);
    checkResourcePermission(user: AuthenticatedUser, key: string, resourceType: keyof typeof ResourcesLocation): Promise<boolean>;
    private carReservationRequestFilePermission;
    private biometricsBulkUploadFilePermission;
    private cashAdvanceRequestFilePermission;
    private invoiceFilePermission;
    private transactionFilePermission;
    private leaveRequestFilePermission;
    private organizationFilePermission;
    private projectsFilePermission;
    private quotationtFilePermission;
    private reimbursementFilePermission;
    private taskFilePermission;
    private userFilePermission;
    private enquiryFilePermission;
}
