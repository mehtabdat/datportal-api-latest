import { ModulesVisibility, Prisma } from '@prisma/client';
export declare class CreatePermissionDto implements Prisma.PermissionsCreateInput {
    name: string;
    action: string;
    moduleId: number;
    condition?: Prisma.InputJsonObject;
    url?: string;
    description?: string;
    icon?: string;
    order?: number;
    isMenuItem?: boolean;
    visibility?: ModulesVisibility;
    Module: Prisma.ModulesCreateNestedOneWithoutPermissionsInput;
}
