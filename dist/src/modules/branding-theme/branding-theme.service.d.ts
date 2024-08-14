import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateBrandingThemeDto } from './dto/create-branding-theme.dto';
import { UpdateBrandingThemeDto } from './dto/update-branding-theme.dto';
export declare class BrandingThemeService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(createDto: CreateBrandingThemeDto): Promise<{
        id: number;
        title: string;
        paymentTerms: string;
    }>;
    findAll(filters: Prisma.BrandingThemeWhereInput): Prisma.PrismaPromise<{
        id: number;
        title: string;
        paymentTerms: string;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        title: string;
        paymentTerms: string;
    }>;
    update(id: number, updateDto: UpdateBrandingThemeDto): Promise<{
        id: number;
        title: string;
        paymentTerms: string;
    }>;
    remove(id: number): Promise<{
        id: number;
        title: string;
        paymentTerms: string;
    }>;
}
