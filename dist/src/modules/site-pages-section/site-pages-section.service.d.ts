import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { SitePagesSectionFiltersDto } from './dto/site-pages-section-filters.dto';
import { CreateSitePagesSectionDto } from './dto/create-site-pages-section.dto';
import { UpdateSitePagesSectionDto } from './dto/update-site-pages-section.dto';
export declare class SitePagesSectionService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(createSitePagesSectionDto: CreateSitePagesSectionDto): Promise<{
        id: number;
        slug: string;
        title: string;
        description: string;
        hasMultipleItems: boolean;
        isPublished: boolean;
        isDeleted: boolean;
    }>;
    findAll(condition: Prisma.PagesSectionWhereInput): Prisma.PrismaPromise<({
        PagesContent: {
            id: number;
            isPublished: boolean;
            title: string;
        }[];
    } & {
        id: number;
        slug: string;
        title: string;
        description: string;
        hasMultipleItems: boolean;
        isPublished: boolean;
        isDeleted: boolean;
    })[]>;
    findOne(id: number): Promise<{
        id: number;
        slug: string;
        title: string;
        description: string;
        hasMultipleItems: boolean;
        isPublished: boolean;
        isDeleted: boolean;
    }>;
    update(id: number, updateSitePagesSectionDto: UpdateSitePagesSectionDto): Promise<{
        id: number;
        slug: string;
        title: string;
        description: string;
        hasMultipleItems: boolean;
        isPublished: boolean;
        isDeleted: boolean;
    }>;
    remove(id: number): Promise<{
        id: number;
        slug: string;
        title: string;
        description: string;
        hasMultipleItems: boolean;
        isPublished: boolean;
        isDeleted: boolean;
    }>;
    applyFilters(filters: SitePagesSectionFiltersDto): Prisma.PagesSectionWhereInput;
    findAllContentOfSection(sectionId: number): Prisma.GetPagesContentGroupByPayload<{
        by: "pageSectionId"[];
        where: {
            pageSectionId: number;
            isDeleted: false;
        };
        _count: {
            id: true;
        };
    }>;
}
