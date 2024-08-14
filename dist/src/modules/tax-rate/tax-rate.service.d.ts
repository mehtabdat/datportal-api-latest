import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateTaxRateDto } from './dto/create-tax-rate.dto';
import { UpdateTaxRateDto } from './dto/update-tax-rate.dto';
export declare class TaxRateService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(createDto: CreateTaxRateDto): Promise<{
        id: number;
        taxType: string;
        title: string;
        rate: number;
        xeroTenantId: string;
    }>;
    findAll(filters: Prisma.TaxRateWhereInput): Prisma.PrismaPromise<{
        id: number;
        taxType: string;
        title: string;
        rate: number;
        xeroTenantId: string;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        taxType: string;
        title: string;
        rate: number;
        xeroTenantId: string;
    }>;
    findBySlug(slug: string): Promise<{
        id: number;
        taxType: string;
        title: string;
        rate: number;
        xeroTenantId: string;
    }>;
    update(id: number, updateDto: UpdateTaxRateDto): Promise<{
        id: number;
        taxType: string;
        title: string;
        rate: number;
        xeroTenantId: string;
    }>;
    remove(id: number): Promise<{
        id: number;
        taxType: string;
        title: string;
        rate: number;
        xeroTenantId: string;
    }>;
    getLeadData(leadId: number): Prisma.Prisma__LeadsClient<{
        xeroTenantId: string;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
}
