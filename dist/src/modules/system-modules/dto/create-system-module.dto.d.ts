import { ModulesVisibility, Prisma } from '@prisma/client';
export declare class CreateSystemModuleDto implements Prisma.ModulesCreateInput {
    name: string;
    slug: string;
    url?: string;
    description?: string;
    visibility?: ModulesVisibility;
    icon?: string;
    order?: number;
    isMenuItem?: boolean;
}
