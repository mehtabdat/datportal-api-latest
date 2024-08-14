import { Prisma } from '@prisma/client';
import { AuthenticatedUser } from 'src/authentication/jwt-payload';
import { PrismaService } from 'src/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleFiltersDto } from './dto/role-filters.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleDashboardElements } from './dto/role-dashboard-elements.dto';
export declare class RoleService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(createRoleDto: CreateRoleDto, user: AuthenticatedUser): Promise<{
        id: number;
        title: string;
        slug: string;
        description: string;
        addedDate: Date;
        modifiedDate: Date;
        deletedDate: Date;
        isDeleted: boolean;
        isPublished: boolean;
        addedById: number;
        deletedById: number;
        modifiedById: number;
        level: number;
    }>;
    copyAllPermissionsFromRole(copyFromId: number, copyToId: number, copiedBy: number): Promise<Prisma.BatchPayload>;
    findAll(condition: Prisma.RoleWhereInput, filters: RoleFiltersDto): Prisma.PrismaPromise<({
        DashboardElements: ({
            DashboardElement: {
                id: number;
                title: string;
                slug: string;
                isPublished: boolean;
                isDeleted: boolean;
            };
        } & {
            roleId: number;
            dashboardElementId: number;
            order: number;
        })[];
    } & {
        id: number;
        title: string;
        slug: string;
        description: string;
        addedDate: Date;
        modifiedDate: Date;
        deletedDate: Date;
        isDeleted: boolean;
        isPublished: boolean;
        addedById: number;
        deletedById: number;
        modifiedById: number;
        level: number;
    })[]>;
    findOne(id: number): Promise<{
        id: number;
        title: string;
        slug: string;
        description: string;
        addedDate: Date;
        modifiedDate: Date;
        deletedDate: Date;
        isDeleted: boolean;
        isPublished: boolean;
        addedById: number;
        deletedById: number;
        modifiedById: number;
        level: number;
    }>;
    update(id: number, updateRoleDto: UpdateRoleDto): Promise<{
        id: number;
        title: string;
        slug: string;
        description: string;
        addedDate: Date;
        modifiedDate: Date;
        deletedDate: Date;
        isDeleted: boolean;
        isPublished: boolean;
        addedById: number;
        deletedById: number;
        modifiedById: number;
        level: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        title: string;
        slug: string;
        description: string;
        addedDate: Date;
        modifiedDate: Date;
        deletedDate: Date;
        isDeleted: boolean;
        isPublished: boolean;
        addedById: number;
        deletedById: number;
        modifiedById: number;
        level: number;
    }>;
    applyFilters(filters: RoleFiltersDto, user: AuthenticatedUser): Prisma.RoleWhereInput;
    addDashboardElement(roleId: number, roleDashboardElements: RoleDashboardElements): Promise<any[]>;
    removeDashboardElement(roleId: number, roleDashboardElements: RoleDashboardElements): Prisma.PrismaPromise<Prisma.BatchPayload>;
}
