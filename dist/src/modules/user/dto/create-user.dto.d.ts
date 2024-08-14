import { Prisma } from '@prisma/client';
export declare class CreateUserDto implements Prisma.UserUncheckedCreateInput {
    firstName: string;
    designation: string;
    lastName: string;
    email: string;
    phoneCode: string;
    phone: string;
    whatsapp: string;
    organizationId: number;
    dataAccessRestrictedTo: number[];
    departmentId: number;
    password: string;
    address?: string;
    preferences?: string;
    profile?: string;
    isPublished?: boolean;
    enableRemoteCheckin?: boolean;
    status?: number;
    managerId?: number;
    remainingAnnualLeaves?: number;
    dateOfJoining: Date;
    lastWorkingDate: Date;
}
