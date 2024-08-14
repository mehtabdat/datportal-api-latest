import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateFaqsCategoryDto } from './dto/create-faqs-category.dto';
import { FaqsCategoryFiltersDto } from './dto/faqs-category-filter.dto';
import { FaqsCategoryPaginationDto } from './dto/faqs-category-pagination.dto';
import { UpdateFaqsCategoryDto } from './dto/update-faqs-category.dto';
export declare class FaqsCategoryService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(createFaqsCategoryDto: CreateFaqsCategoryDto): Promise<{
        id: number;
        slug: string;
        parentId: number;
        isPublished: boolean;
        isDeleted: boolean;
        forAdminpanel: boolean;
        title: string;
        description: string;
    }>;
    findAll(filters: Prisma.FaqsCategoryWhereInput, pagination: FaqsCategoryPaginationDto): Prisma.PrismaPromise<({
        Parent: {
            id: number;
            title: string;
            slug: string;
            description: string;
        };
    } & {
        id: number;
        slug: string;
        parentId: number;
        isPublished: boolean;
        isDeleted: boolean;
        forAdminpanel: boolean;
        title: string;
        description: string;
    })[]>;
    findAllPublished(): Prisma.PrismaPromise<({
        ChildCategory: {
            _count: {
                Faqs: number;
            };
            title: string;
            slug: string;
            description: string;
        }[];
    } & {
        id: number;
        slug: string;
        parentId: number;
        isPublished: boolean;
        isDeleted: boolean;
        forAdminpanel: boolean;
        title: string;
        description: string;
    })[]>;
    findOne(id: number): Promise<{
        id: number;
        slug: string;
        parentId: number;
        isPublished: boolean;
        isDeleted: boolean;
        forAdminpanel: boolean;
        title: string;
        description: string;
    }>;
    findBySlug(slug: string): Promise<{
        Faqs: {
            title: string;
            slug: string;
            description: string;
        }[];
    } & {
        id: number;
        slug: string;
        parentId: number;
        isPublished: boolean;
        isDeleted: boolean;
        forAdminpanel: boolean;
        title: string;
        description: string;
    }>;
    update(id: number, updateFaqsCategoryDto: UpdateFaqsCategoryDto): Promise<{
        id: number;
        slug: string;
        parentId: number;
        isPublished: boolean;
        isDeleted: boolean;
        forAdminpanel: boolean;
        title: string;
        description: string;
    }>;
    remove(id: number): Promise<{
        id: number;
        slug: string;
        parentId: number;
        isPublished: boolean;
        isDeleted: boolean;
        forAdminpanel: boolean;
        title: string;
        description: string;
    }>;
    applyFilters(filters: FaqsCategoryFiltersDto): Prisma.FaqsCategoryWhereInput;
    countFaqsCategory(filters: Prisma.FaqsCategoryWhereInput): Prisma.PrismaPromise<number>;
}
