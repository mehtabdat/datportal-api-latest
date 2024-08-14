import { Prisma } from '@prisma/client';
import { AuthenticatedUser } from 'src/authentication/jwt-payload';
import { PrismaService } from 'src/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
export declare class PermissionsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(createPermissionDto: CreatePermissionDto): Promise<{
        id: number;
        name: string;
        action: string;
        icon: string;
        moduleId: number;
        visibility: import(".prisma/client").$Enums.ModulesVisibility;
        condition: Prisma.JsonValue;
        url: string;
        isMenuItem: boolean;
        order: number;
        description: string;
    }>;
    findAll(): Prisma.PrismaPromise<{
        id: number;
        name: string;
        action: string;
        icon: string;
        moduleId: number;
        visibility: import(".prisma/client").$Enums.ModulesVisibility;
        condition: Prisma.JsonValue;
        url: string;
        isMenuItem: boolean;
        order: number;
        description: string;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        action: string;
        icon: string;
        moduleId: number;
        visibility: import(".prisma/client").$Enums.ModulesVisibility;
        condition: Prisma.JsonValue;
        url: string;
        isMenuItem: boolean;
        order: number;
        description: string;
    }>;
    update(id: number, updatePermissionDto: UpdatePermissionDto): Promise<{
        id: number;
        name: string;
        action: string;
        icon: string;
        moduleId: number;
        visibility: import(".prisma/client").$Enums.ModulesVisibility;
        condition: Prisma.JsonValue;
        url: string;
        isMenuItem: boolean;
        order: number;
        description: string;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        action: string;
        icon: string;
        moduleId: number;
        visibility: import(".prisma/client").$Enums.ModulesVisibility;
        condition: Prisma.JsonValue;
        url: string;
        isMenuItem: boolean;
        order: number;
        description: string;
    }>;
    grantPrivilegesToRole(roleId: number, permissionsIds: Array<number>, user: AuthenticatedUser): Promise<{
        id: number;
        addedDate: Date;
        roleId: number;
        permissionsId: number;
        addedById: number;
    }[]>;
    validatePermissionIds(permissionIds: number[], user: AuthenticatedUser): Prisma.PrismaPromise<{
        id: number;
        name: string;
        action: string;
        icon: string;
        moduleId: number;
        visibility: import(".prisma/client").$Enums.ModulesVisibility;
        condition: Prisma.JsonValue;
        url: string;
        isMenuItem: boolean;
        order: number;
        description: string;
    }[]>;
    revokePrivilegesFromRole(roleId: number, permissionsIds: Array<number>, user: AuthenticatedUser): Promise<Prisma.BatchPayload>;
    getRolePermission(roleId: number): Promise<{
        id: number;
        Permission: {
            id: number;
            action: string;
        };
    }[]>;
    getRolePermissionByModuleId(roleId: number, moduleId: number): Promise<{
        id: number;
        Permission: {
            id: number;
            action: string;
        };
    }[]>;
}
