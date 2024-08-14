import { Prisma } from '@prisma/client';
import { Pagination } from 'src/common-types/common-types';
import { PrismaService } from 'src/prisma.service';
import { CreateProjectTypeDto } from './dto/create-project-type.dto';
import { UpdateProjectTypeDto } from './dto/update-project-type.dto';
import { ProjectTypeFiltersDto } from './dto/project-type-filters.dto';
export declare class ProjectTypeService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(createDto: CreateProjectTypeDto): Promise<{
        id: number;
        title: string;
        slug: string;
        isPublished: boolean;
        isDeleted: boolean;
        addedDate: Date;
    }>;
    findAll(filters: Prisma.ProjectTypeWhereInput, pagination: Pagination): Prisma.PrismaPromise<{
        id: number;
        title: string;
        slug: string;
        isPublished: boolean;
        isDeleted: boolean;
        addedDate: Date;
    }[]>;
    findAllPublished(filters: Prisma.ProjectTypeWhereInput, pagination: Pagination): Prisma.PrismaPromise<{
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
    update(id: number, updateDto: UpdateProjectTypeDto): Promise<{
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
    applyFilters(filters: ProjectTypeFiltersDto): Prisma.ProjectTypeWhereInput;
    countFaqs(filters: Prisma.ProjectTypeWhereInput): Prisma.PrismaPromise<number>;
}
