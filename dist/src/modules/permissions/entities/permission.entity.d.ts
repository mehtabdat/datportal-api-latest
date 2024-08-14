import { ModulesVisibility, Permissions as PrismaPermission, Prisma } from "@prisma/client";
export declare class Permission implements Partial<PrismaPermission> {
    id: number;
    name: string | null;
    action: string;
    moduleId: number;
    visibility?: ModulesVisibility;
    condition: Prisma.JsonValue | null;
    url: string | null;
    description: string | null;
    icon: string;
    order: number;
    isMenuItem: boolean;
}
