import { Prisma } from '@prisma/client';
import { Pagination } from 'src/common-types/common-types';
import { PrismaService } from 'src/prisma.service';
import { CreateProjectComponentDto } from './dto/create-project-component.dto';
import { UpdateProjectComponentDto } from './dto/update-project-component.dto';
import { ProjectComponentFiltersDto } from './dto/project-component-filters.dto';
export declare class ProjectComponentsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(createDto: CreateProjectComponentDto): Promise<{
        id: number;
        title: string;
        slug: string;
        isPublished: boolean;
        isDeleted: boolean;
        addedDate: Date;
    }>;
    findAll(filters: Prisma.ProjectComponentWhereInput, pagination: Pagination): Prisma.PrismaPromise<{
        id: number;
        title: string;
        slug: string;
        isPublished: boolean;
        isDeleted: boolean;
        addedDate: Date;
    }[]>;
    findAllPublished(filters: Prisma.ProjectComponentWhereInput, pagination: Pagination): Prisma.PrismaPromise<{
        id: number;
        title: string;
        slug: string;
        isPublished: boolean;
        isDeleted: boolean;
        addedDate: Date;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        title: string;
        slug: string;
        isPublished: boolean;
        isDeleted: boolean;
        addedDate: Date;
    }>;
    findBySlug(slug: string): Promise<{
        id: number;
        title: string;
        slug: string;
        isPublished: boolean;
        isDeleted: boolean;
        addedDate: Date;
    }>;
    update(id: number, updateDto: UpdateProjectComponentDto): Promise<{
        id: number;
        title: string;
        slug: string;
        isPublished: boolean;
        isDeleted: boolean;
        addedDate: Date;
    }>;
    remove(id: number): Promise<{
        id: number;
        title: string;
        slug: string;
        isPublished: boolean;
        isDeleted: boolean;
        addedDate: Date;
    }>;
    applyFilters(filters: ProjectComponentFiltersDto): Prisma.ProjectComponentWhereInput;
    countFaqs(filters: Prisma.ProjectComponentWhereInput): Prisma.PrismaPromise<number>;
}
