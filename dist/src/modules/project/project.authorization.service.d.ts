import { AuthenticatedUser } from 'src/authentication/jwt-payload';
import { AuthorizationService } from 'src/authorization/authorization.service';
import { PrismaService } from 'src/prisma.service';
export declare class ProjectAuthorizationService extends AuthorizationService {
    protected readonly prisma: PrismaService;
    constructor(prisma: PrismaService);
    checkIfUserAuthorizedForProject(user: AuthenticatedUser, projectId: number): Promise<boolean>;
    checkIfUserAuthorizedForProjectFile(user: AuthenticatedUser, fileId: number): Promise<boolean>;
    checkIfUserAuthorizedForProjectNote(user: AuthenticatedUser, noteId: number): Promise<boolean>;
    checkIfUserAuthorizedForProjectNoteMedia(user: AuthenticatedUser, noteId: number): Promise<boolean>;
}
