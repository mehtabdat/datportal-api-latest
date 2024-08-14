import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateLeaveTypeDto } from './dto/create-leave-type.dto';
import { UpdateLeaveTypeDto } from './dto/update-leave-type.dto';
import { LeaveTypeFilters } from './dto/leave-type-filters.dto';
export declare class LeaveTypeService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(createDto: CreateLeaveTypeDto): Promise<{
        id: number;
        title: string;
        slug: string;
        isPaid: boolean;
        threshold: number;
        thresholdType: import(".prisma/client").$Enums.ThresholdType;
        addedDate: Date;
        isDeleted: boolean;
        isPublished: boolean;
    }>;
    findAll(filters: Prisma.LeaveTypeWhereInput): Prisma.PrismaPromise<{
        id: number;
        title: string;
        slug: string;
        isPaid: boolean;
        threshold: number;
        thresholdType: import(".prisma/client").$Enums.ThresholdType;
        addedDate: Date;
        isDeleted: boolean;
        isPublished: boolean;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        title: string;
        slug: string;
        isPaid: boolean;
        threshold: number;
        thresholdType: import(".prisma/client").$Enums.ThresholdType;
        addedDate: Date;
        isDeleted: boolean;
        isPublished: boolean;
    }>;
    findBySlug(slug: string): Promise<{
        id: number;
        title: string;
        slug: string;
        isPaid: boolean;
        threshold: number;
        thresholdType: import(".prisma/client").$Enums.ThresholdType;
        addedDate: Date;
        isDeleted: boolean;
        isPublished: boolean;
    }>;
    update(id: number, updateDto: UpdateLeaveTypeDto): Promise<{
        id: number;
        title: string;
        slug: string;
        isPaid: boolean;
        threshold: number;
        thresholdType: import(".prisma/client").$Enums.ThresholdType;
        addedDate: Date;
        isDeleted: boolean;
        isPublished: boolean;
    }>;
    remove(id: number): Promise<{
        id: number;
        title: string;
        slug: string;
        isPaid: boolean;
        threshold: number;
        thresholdType: import(".prisma/client").$Enums.ThresholdType;
        addedDate: Date;
        isDeleted: boolean;
        isPublished: boolean;
    }>;
    applyFilters(filters: LeaveTypeFilters): Prisma.LeaveTypeWhereInput;
}
