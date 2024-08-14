import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateSitePageDto } from './dto/create-site-page.dto';
import { SitePagesFiltersDto } from './dto/site-pages-filters.dto';
import { UpdateSitePageDto } from './dto/update-site-page.dto';
export declare class SitePagesService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(createSitePageDto: CreateSitePageDto): Promise<{
        id: number;
        slug: string;
        title: string;
        description: string;
        isPublished: boolean;
        isDeleted: boolean;
    }>;
    createOrUpdatePageSectionRelation(pageSectionIds: number[], pageId: number): Promise<any[]>;
    findAll(condition: Prisma.SitePagesWhereInput): Prisma.PrismaPromise<({
        PageSectionRelation: ({
            PageSection: {
                id: number;
                slug: string;
                title: string;
                description: string;
                hasMultipleItems: boolean;
                isPublished: boolean;
                isDeleted: boolean;
            };
        } & {
            id: number;
            sitePageId: number;
            pageSectionId: number;
        })[];
    } & {
        id: number;
        slug: string;
        title: string;
        description: string;
        isPublished: boolean;
        isDeleted: boolean;
    })[]>;
    findOne(id: number): Promise<{
        id: number;
        slug: string;
        title: string;
        description: string;
        isPublished: boolean;
        isDeleted: boolean;
    }>;
    update(id: number, updateSitePageDto: UpdateSitePageDto): Promise<{
        id: number;
        slug: string;
        title: string;
        description: string;
        isPublished: boolean;
        isDeleted: boolean;
    }>;
    remove(id: number): Promise<{
        id: number;
        slug: string;
        title: string;
        description: string;
        isPublished: boolean;
        isDeleted: boolean;
    }>;
    applyFilters(filters: SitePagesFiltersDto): Prisma.SitePagesWhereInput;
    validateSectionIds(sectionIds: number[]): Promise<number[]>;
    removeSectionFromPage(pageId: number, sectionId: number): Prisma.Prisma__PageSectionRelationClient<{
        id: number;
        sitePageId: number;
        pageSectionId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    removeMultipleSectionFromPage(pageId: number, sectionIds: number[]): Prisma.PrismaPromise<Prisma.BatchPayload>;
    findPageBySlug(slug: string): Prisma.Prisma__SitePagesClient<{
        id: number;
        slug: string;
        title: string;
        description: string;
        isPublished: boolean;
        isDeleted: boolean;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    findPageContent(pageId: number): Prisma.PrismaPromise<{
        PageSection: {
            title: string;
            slug: string;
            description: string;
            PagesContent: {
                title: string;
                description: string;
                image: string;
                imageAlt: string;
                highlight: string;
            }[];
        };
    }[]>;
    findPageSeo(pageId: number): Prisma.Prisma__StaticPageSEOClient<{
        seoTitle: string;
        seoDescription: string;
        image: string;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
}
