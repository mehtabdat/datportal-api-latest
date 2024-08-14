import { Prisma } from '@prisma/client';
import { AuthenticatedUser } from 'src/authentication/jwt-payload';
import { PrismaService } from 'src/prisma.service';
import { CreateSystemModuleDto } from './dto/create-system-module.dto';
import { SystemModuleFilters } from './dto/system-modules.filters';
import { UpdateSystemModuleDto } from './dto/update-system-module.dto';
export declare class SystemModulesService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(createSystemModuleDto: CreateSystemModuleDto): Promise<{
        id: number;
        name: string;
        slug: string;
        icon: string;
        isMenuItem: boolean;
        visibility: import(".prisma/client").$Enums.ModulesVisibility;
        order: number;
        url: string;
        description: string;
    }>;
    findAll(filters: SystemModuleFilters, user: AuthenticatedUser): Prisma.PrismaPromise<({
        _count: {
            Permissions: number;
        };
        Permissions: {
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
        }[];
    } & {
        id: number;
        name: string;
        slug: string;
        icon: string;
        isMenuItem: boolean;
        visibility: import(".prisma/client").$Enums.ModulesVisibility;
        order: number;
        url: string;
        description: string;
    })[]>;
    findOne(id: number, user: AuthenticatedUser): Promise<{
        Permissions: ({
            RolePermissions: {
                Role: {
                    title: string;
                };
            }[];
        } & {
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
        })[];
    } & {
        id: number;
        name: string;
        slug: string;
        icon: string;
        isMenuItem: boolean;
        visibility: import(".prisma/client").$Enums.ModulesVisibility;
        order: number;
        url: string;
        description: string;
    }>;
    update(id: number, updateSystemModuleDto: UpdateSystemModuleDto): Promise<{
        id: number;
        name: string;
        slug: string;
        icon: string;
        isMenuItem: boolean;
        visibility: import(".prisma/client").$Enums.ModulesVisibility;
        order: number;
        url: string;
        description: string;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        slug: string;
        icon: string;
        isMenuItem: boolean;
        visibility: import(".prisma/client").$Enums.ModulesVisibility;
        order: number;
        url: string;
        description: string;
    }>;
}
