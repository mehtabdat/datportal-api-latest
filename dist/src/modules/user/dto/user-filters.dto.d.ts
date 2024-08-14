import { User } from '@prisma/client';
export declare class UserFiltersDto implements Partial<User> {
    email?: string;
    phone?: string;
    status?: number;
    fromDate?: string;
    toDate?: string;
    isPublished?: boolean;
    name?: string;
    organizationId?: number;
    departmentId?: number;
    userType?: number;
    ids: number | Array<number>;
    roleIds: Array<number>;
    roleSlugs: Array<string>;
    departmentSlug: string;
}
