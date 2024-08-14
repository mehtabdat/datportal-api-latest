import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { SystemLogsFiltersDto } from './dto/system-logs-filters.dto';
import { SystemLogsPaginationDto } from './dto/system-logs-pagination.dto';
import { SystemLogsSortingDto } from './dto/system-logs-sorting.dto';
export declare class SystemLogsService {
    private prisma;
    constructor(prisma: PrismaService);
    findSystemLogs(pagination: SystemLogsPaginationDto, sorting: SystemLogsSortingDto, condition: Prisma.SystemLogsWhereInput): Prisma.PrismaPromise<({
        AddedBy: {
            id: number;
            email: string;
            uuid: string;
            firstName: string;
            lastName: string;
            profile: string;
        };
    } & {
        id: number;
        table: string;
        tableColumnKey: string;
        tableColumnValue: string;
        valueType: string;
        actionType: string;
        message: string;
        endPoint: string;
        controllerName: string;
        data: Prisma.JsonValue;
        addedDate: Date;
        addedById: number;
    })[]>;
    applyFilters(filters: SystemLogsFiltersDto): Prisma.SystemLogsWhereInput;
    countTotalRecord(condition: Prisma.SystemLogsWhereInput): Prisma.PrismaPromise<number>;
}
