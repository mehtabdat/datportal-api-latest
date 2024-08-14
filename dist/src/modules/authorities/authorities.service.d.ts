import { Prisma } from '@prisma/client';
import { Pagination } from 'src/common-types/common-types';
import { PrismaService } from 'src/prisma.service';
import { CreateAuthorityDto } from './dto/create-authority.dto';
import { UpdateAuthorityDto } from './dto/update-authority.dto';
import { AuthorityFiltersDto } from './dto/authority-filters.dto';
export declare class AuthoritiesService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(createDto: CreateAuthorityDto): Promise<{
        id: number;
        title: string;
        slug: string;
        isPublished: boolean;
        isDeleted: boolean;
        addedDate: Date;
    }>;
    findAll(filters: Prisma.AuthoritiesWhereInput, pagination: Pagination): Prisma.PrismaPromise<{
        id: number;
        title: string;
        slug: string;
        isPublished: boolean;
        isDeleted: boolean;
        addedDate: Date;
    }[]>;
    findAllPublished(filters: Prisma.AuthoritiesWhereInput, pagination: Pagination): Prisma.PrismaPromise<{
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
    update(id: number, updateDto: UpdateAuthorityDto): Promise<{
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
    applyFilters(filters: AuthorityFiltersDto): Prisma.AuthoritiesWhereInput;
    countFaqs(filters: Prisma.AuthoritiesWhereInput): Prisma.PrismaPromise<number>;
}
