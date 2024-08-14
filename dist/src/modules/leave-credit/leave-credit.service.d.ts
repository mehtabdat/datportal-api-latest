import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateLeaveCreditDto } from './dto/create-leave-credit.dto';
import { UpdateLeaveCreditDto } from './dto/update-leave-credit.dto';
export declare class LeaveCreditService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(createDto: CreateLeaveCreditDto): Promise<{
        id: number;
        userId: number;
        daysCount: number;
        note: string;
        isDeleted: boolean;
        entryType: number;
        addedDate: Date;
    }>;
    findAll(filters: Prisma.LeaveCreditsWhereInput): Prisma.PrismaPromise<{
        id: number;
        userId: number;
        daysCount: number;
        note: string;
        isDeleted: boolean;
        entryType: number;
        addedDate: Date;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        userId: number;
        daysCount: number;
        note: string;
        isDeleted: boolean;
        entryType: number;
        addedDate: Date;
    }>;
    update(id: number, updateDto: UpdateLeaveCreditDto): Promise<{
        id: number;
        userId: number;
        daysCount: number;
        note: string;
        isDeleted: boolean;
        entryType: number;
        addedDate: Date;
    }>;
    remove(id: number): Promise<{
        id: number;
        userId: number;
        daysCount: number;
        note: string;
        isDeleted: boolean;
        entryType: number;
        addedDate: Date;
    }>;
}
