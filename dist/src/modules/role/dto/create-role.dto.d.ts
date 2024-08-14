import { Prisma } from '@prisma/client';
export declare class CreateRoleDto implements Prisma.RoleUncheckedCreateInput {
    title: string;
    slug: string;
    level?: number;
    description?: string;
    isPublished?: boolean;
    organizationId?: number;
    copyRoleId?: number;
}
