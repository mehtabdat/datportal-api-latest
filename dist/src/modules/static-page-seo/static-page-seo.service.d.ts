import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { StaticPageSEOPaginationDto } from './dto/static-page-seo.pagination.dto';
import { CreateStaticPageSeoDto } from './dto/create-static-page-seo.dto';
import { UpdateStaticPageSeoDto } from './dto/update-static-page-seo.dto';
import { StaticPageSEOFiltersDto } from './dto/static-page-seo-filters.dto';
export declare class StaticPageSeoService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(createStaticPageSeoDto: CreateStaticPageSeoDto): Promise<{
        id: number;
        seoTitle: string;
        seoDescription: string;
        image: string;
        isDefault: number;
        sitePageId: number;
        addedDate: Date;
        modifiedDate: Date;
        modifiedById: number;
    }>;
    findAll(condition: Prisma.StaticPageSEOWhereInput, pagination: StaticPageSEOPaginationDto): Prisma.PrismaPromise<{
        id: number;
        seoTitle: string;
        seoDescription: string;
        image: string;
        isDefault: number;
        sitePageId: number;
        addedDate: Date;
        modifiedDate: Date;
        modifiedById: number;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        seoTitle: string;
        seoDescription: string;
        image: string;
        isDefault: number;
        sitePageId: number;
        addedDate: Date;
        modifiedDate: Date;
        modifiedById: number;
    }>;
    findOneByPageSlug(slug: string): Promise<{
        id: number;
        seoTitle: string;
        seoDescription: string;
        image: string;
        isDefault: number;
        sitePageId: number;
        addedDate: Date;
        modifiedDate: Date;
        modifiedById: number;
    }>;
    update(id: number, updateStaticPageSeoDto: UpdateStaticPageSeoDto): Promise<{
        id: number;
        seoTitle: string;
        seoDescription: string;
        image: string;
        isDefault: number;
        sitePageId: number;
        addedDate: Date;
        modifiedDate: Date;
        modifiedById: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        seoTitle: string;
        seoDescription: string;
        image: string;
        isDefault: number;
        sitePageId: number;
        addedDate: Date;
        modifiedDate: Date;
        modifiedById: number;
    }>;
    countStaticPageSEO(filters: Prisma.StaticPageSEOWhereInput): Prisma.PrismaPromise<number>;
    makeDefault(staticPageSEOId: number): Promise<{
        id: number;
        seoTitle: string;
        seoDescription: string;
        image: string;
        isDefault: number;
        sitePageId: number;
        addedDate: Date;
        modifiedDate: Date;
        modifiedById: number;
    }>;
    applyFilters(filters: StaticPageSEOFiltersDto): Prisma.StaticPageSEOWhereInput;
}
