import { Prisma } from '@prisma/client';
import { Pagination } from 'src/common-types/common-types';
import { PrismaService } from 'src/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentFiltersDto } from './dto/department-filters.dto';
export declare class DepartmentService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(createDto: CreateDepartmentDto): Promise<{
        id: number;
        title: string;
        slug: string;
        isPublished: boolean;
        isDeleted: boolean;
        addedDate: Date;
    }>;
    findAll(filters: Prisma.DepartmentWhereInput, pagination: Pagination): Prisma.PrismaPromise<{
        id: number;
        title: string;
        slug: string;
        isPublished: boolean;
        isDeleted: boolean;
        addedDate: Date;
    }[]>;
    findAllPublished(filters: Prisma.DepartmentWhereInput, pagination: Pagination): Prisma.PrismaPromise<{
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
    update(id: number, updateDto: UpdateDepartmentDto): Promise<{
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
    applyFilters(filters: DepartmentFiltersDto): Prisma.DepartmentWhereInput;
    countFaqs(filters: Prisma.DepartmentWhereInput): Prisma.PrismaPromise<number>;
}
