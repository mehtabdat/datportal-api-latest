import { AuthenticatedUser } from 'src/authentication/jwt-payload';
import { PrismaService } from 'src/prisma.service';
export declare class AuthorizationService {
    protected readonly prisma: PrismaService;
    constructor(prisma: PrismaService);
    checkIfUserAuthorized(user: AuthenticatedUser, requiredPermissions: string[]): Promise<boolean>;
    checkIfUserAuthorizedForSavedSearches(user: AuthenticatedUser, savedSearchId: number): Promise<boolean>;
    checkIfUserCanReadOrganzationResources(user: AuthenticatedUser, filePath: string): Promise<boolean>;
    checkIfUserCanReadProjectResources(user: AuthenticatedUser, filePath: string): Promise<boolean>;
    checkIfUserCanReadTaskResources(user: AuthenticatedUser, filePath: string): Promise<boolean>;
    checkIfUserAuthorizedForProjectResources(user: AuthenticatedUser, fileId: number): Promise<boolean>;
    checkIfUserAuthorizedForTask(user: AuthenticatedUser, taskId: number, techSupportPermission?: boolean): Promise<boolean>;
    checkIfUserAuthorizedForTaskFile(user: AuthenticatedUser, taskFileId: number, techSupportPermission?: boolean): Promise<boolean>;
    checkIfUserAuthorizedForProjectBySlug(user: AuthenticatedUser, slug: string): Promise<boolean>;
    findUserPermissionsAgainstSlugs<PERMISSION_SLUGS extends string[]>(user: AuthenticatedUser, slugs: PERMISSION_SLUGS): Promise<Partial<{
        [K in PERMISSION_SLUGS[number]]: boolean;
    }>>;
}
