import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
export declare class AccountService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(createDto: CreateAccountDto): Promise<{
        id: number;
        accountCode: string;
        xeroReference: string;
        title: string;
        xeroType: string;
        description: string;
        bankAccountNumber: string;
        showInExpenseClaims: boolean;
        xeroTenantId: string;
    }>;
    findAll(filters: Prisma.AccountWhereInput): Prisma.PrismaPromise<{
        id: number;
        accountCode: string;
        xeroReference: string;
        title: string;
        xeroType: string;
        description: string;
        bankAccountNumber: string;
        showInExpenseClaims: boolean;
        xeroTenantId: string;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        accountCode: string;
        xeroReference: string;
        title: string;
        xeroType: string;
        description: string;
        bankAccountNumber: string;
        showInExpenseClaims: boolean;
        xeroTenantId: string;
    }>;
    findBySlug(slug: string): Promise<{
        id: number;
        accountCode: string;
        xeroReference: string;
        title: string;
        xeroType: string;
        description: string;
        bankAccountNumber: string;
        showInExpenseClaims: boolean;
        xeroTenantId: string;
    }>;
    update(id: number, updateDto: UpdateAccountDto): Promise<{
        id: number;
        accountCode: string;
        xeroReference: string;
        title: string;
        xeroType: string;
        description: string;
        bankAccountNumber: string;
        showInExpenseClaims: boolean;
        xeroTenantId: string;
    }>;
    remove(id: number): Promise<{
        id: number;
        accountCode: string;
        xeroReference: string;
        title: string;
        xeroType: string;
        description: string;
        bankAccountNumber: string;
        showInExpenseClaims: boolean;
        xeroTenantId: string;
    }>;
    getLeadData(leadId: number): Prisma.Prisma__LeadsClient<{
        xeroTenantId: string;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
}
