import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateBulkUploadFormatDto } from './dto/create-bulk-upload-format.dto';
import { UpdateBulkUploadFormatDto } from './dto/update-bulk-upload-format.dto';
export declare class BulkUploadFormatService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(createBulkUploadFormatDto: CreateBulkUploadFormatDto): Promise<{
        id: number;
        title: string;
        format: Prisma.JsonValue;
        sample: Prisma.JsonValue;
        comment: string;
        addedDate: Date;
    }>;
    findAll(): Prisma.PrismaPromise<{
        id: number;
        title: string;
        format: Prisma.JsonValue;
        sample: Prisma.JsonValue;
        comment: string;
        addedDate: Date;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        title: string;
        format: Prisma.JsonValue;
        sample: Prisma.JsonValue;
        comment: string;
        addedDate: Date;
    }>;
    update(id: number, updateBulkUploadFormatDto: UpdateBulkUploadFormatDto): Promise<{
        id: number;
        title: string;
        format: Prisma.JsonValue;
        sample: Prisma.JsonValue;
        comment: string;
        addedDate: Date;
    }>;
    remove(id: number): Promise<{
        id: number;
        title: string;
        format: Prisma.JsonValue;
        sample: Prisma.JsonValue;
        comment: string;
        addedDate: Date;
    }>;
}
