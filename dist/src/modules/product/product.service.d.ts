import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(createDto: CreateProductDto): Promise<{
        id: number;
        xeroReference: string;
        productCode: string;
        title: string;
        description: string;
        quantity: number;
        unitPrice: number;
        accountId: number;
        taxRateId: number;
    }>;
    findAll(filters: Prisma.ProductWhereInput): Prisma.PrismaPromise<({
        TaxRate: {
            id: number;
            title: string;
            taxType: string;
            rate: number;
        };
        Account: {
            id: number;
            title: string;
            accountCode: string;
        };
    } & {
        id: number;
        xeroReference: string;
        productCode: string;
        title: string;
        description: string;
        quantity: number;
        unitPrice: number;
        accountId: number;
        taxRateId: number;
    })[]>;
    findOne(id: number): Promise<{
        TaxRate: {
            id: number;
            title: string;
            taxType: string;
            rate: number;
        };
        Account: {
            id: number;
            title: string;
            accountCode: string;
        };
    } & {
        id: number;
        xeroReference: string;
        productCode: string;
        title: string;
        description: string;
        quantity: number;
        unitPrice: number;
        accountId: number;
        taxRateId: number;
    }>;
    findBySlug(slug: string): Promise<{
        id: number;
        xeroReference: string;
        productCode: string;
        title: string;
        description: string;
        quantity: number;
        unitPrice: number;
        accountId: number;
        taxRateId: number;
    }>;
    update(id: number, updateDto: UpdateProductDto): Promise<{
        id: number;
        xeroReference: string;
        productCode: string;
        title: string;
        description: string;
        quantity: number;
        unitPrice: number;
        accountId: number;
        taxRateId: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        xeroReference: string;
        productCode: string;
        title: string;
        description: string;
        quantity: number;
        unitPrice: number;
        accountId: number;
        taxRateId: number;
    }>;
}
