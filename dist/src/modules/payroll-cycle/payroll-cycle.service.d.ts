import { PayrollCycle, Prisma } from '@prisma/client';
import { Pagination } from 'src/common-types/common-types';
import { PrismaService } from 'src/prisma.service';
import { CreatePayrollCycleDto } from './dto/create-payroll-cycle.dto';
import { UpdatePayrollCycleDto } from './dto/update-payroll-cycle.dto';
import { Queue } from 'bull';
export declare class PayrollCycleService {
    private prisma;
    private payrollQueue;
    private readonly logger;
    constructor(prisma: PrismaService, payrollQueue: Queue);
    validateDates(createDto: CreatePayrollCycleDto): Promise<void>;
    create(createDto: CreatePayrollCycleDto): Promise<{
        id: number;
        fromDate: Date;
        toDate: Date;
        addedDate: Date;
        processed: boolean;
        processing: boolean;
        failed: number;
        failedReport: Prisma.JsonValue;
        processedDate: Date;
        success: number;
    }>;
    findAll(filters: Prisma.PayrollCycleWhereInput, pagination: Pagination): Prisma.PrismaPromise<{
        id: number;
        fromDate: Date;
        toDate: Date;
        addedDate: Date;
        processed: boolean;
        processing: boolean;
        failed: number;
        failedReport: Prisma.JsonValue;
        processedDate: Date;
        success: number;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        fromDate: Date;
        toDate: Date;
        addedDate: Date;
        processed: boolean;
        processing: boolean;
        failed: number;
        failedReport: Prisma.JsonValue;
        processedDate: Date;
        success: number;
    }>;
    update(id: number, updateDto: UpdatePayrollCycleDto): Promise<{
        id: number;
        fromDate: Date;
        toDate: Date;
        addedDate: Date;
        processed: boolean;
        processing: boolean;
        failed: number;
        failedReport: Prisma.JsonValue;
        processedDate: Date;
        success: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        fromDate: Date;
        toDate: Date;
        addedDate: Date;
        processed: boolean;
        processing: boolean;
        failed: number;
        failedReport: Prisma.JsonValue;
        processedDate: Date;
        success: number;
    }>;
    countRecords(filters: Prisma.PayrollCycleWhereInput): Prisma.PrismaPromise<number>;
    preparePayrollReportOfProvidedCycle(payrollCycle: PayrollCycle): Promise<void>;
}
