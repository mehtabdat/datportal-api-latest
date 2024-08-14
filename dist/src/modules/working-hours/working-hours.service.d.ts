import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateWorkingHourDto } from './dto/create-working-hour.dto';
import { UpdateWorkingHourDto } from './dto/update-working-hour.dto';
export declare class WorkingHoursService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(createDto: CreateWorkingHourDto): Promise<{
        id: number;
        title: string;
        hours: Prisma.JsonValue;
        addedDate: Date;
    }>;
    findAll(filters: Prisma.WorkingHoursWhereInput): Prisma.PrismaPromise<{
        id: number;
        title: string;
        hours: Prisma.JsonValue;
        addedDate: Date;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        title: string;
        hours: Prisma.JsonValue;
        addedDate: Date;
    }>;
    update(id: number, updateDto: UpdateWorkingHourDto): Promise<{
        id: number;
        title: string;
        hours: Prisma.JsonValue;
        addedDate: Date;
    }>;
    remove(id: number): Promise<{
        id: number;
        title: string;
        hours: Prisma.JsonValue;
        addedDate: Date;
    }>;
}
