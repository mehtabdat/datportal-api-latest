/// <reference types="multer" />
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { FaqsFiltersDto } from './dto/faqs-filter.dto';
import { FaqsPaginationDto } from './dto/faqs-pagination.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { UploadFaqImage } from './dto/upload-image.dto';
import { AuthenticatedUser } from 'src/authentication/jwt-payload';
export declare class FaqsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(createFaqDto: CreateFaqDto): Promise<{
        id: number;
        slug: string;
        faqsCategoryId: number;
        forAdminpanel: boolean;
        isPublished: boolean;
        isDeleted: boolean;
        title: string;
        description: string;
    }>;
    findAll(filters: Prisma.FaqsWhereInput, pagination: FaqsPaginationDto): Prisma.PrismaPromise<{
        id: number;
        slug: string;
        faqsCategoryId: number;
        forAdminpanel: boolean;
        isPublished: boolean;
        isDeleted: boolean;
        title: string;
        description: string;
    }[]>;
    findAllPublished(filters: Prisma.FaqsWhereInput, pagination: FaqsPaginationDto): Prisma.PrismaPromise<({
        FaqsCategory: {
            title: string;
            slug: string;
            description: string;
        };
    } & {
        id: number;
        slug: string;
        faqsCategoryId: number;
        forAdminpanel: boolean;
        isPublished: boolean;
        isDeleted: boolean;
        title: string;
        description: string;
    })[]>;
    findOne(id: number): Promise<{
        FaqsCategory: {
            title: string;
            slug: string;
            description: string;
        };
    } & {
        id: number;
        slug: string;
        faqsCategoryId: number;
        forAdminpanel: boolean;
        isPublished: boolean;
        isDeleted: boolean;
        title: string;
        description: string;
    }>;
    findBySlug(slug: string): Promise<{
        FaqsCategory: {
            title: string;
            slug: string;
            description: string;
        };
    } & {
        id: number;
        slug: string;
        faqsCategoryId: number;
        forAdminpanel: boolean;
        isPublished: boolean;
        isDeleted: boolean;
        title: string;
        description: string;
    }>;
    update(id: number, updateFaqDto: UpdateFaqDto): Promise<{
        id: number;
        slug: string;
        faqsCategoryId: number;
        forAdminpanel: boolean;
        isPublished: boolean;
        isDeleted: boolean;
        title: string;
        description: string;
    }>;
    remove(id: number): Promise<{
        id: number;
        slug: string;
        faqsCategoryId: number;
        forAdminpanel: boolean;
        isPublished: boolean;
        isDeleted: boolean;
        title: string;
        description: string;
    }>;
    applyFilters(filters: FaqsFiltersDto): Prisma.FaqsWhereInput;
    countFaqs(filters: Prisma.FaqsWhereInput): Prisma.PrismaPromise<number>;
    handleFaqImages(uploadImage: UploadFaqImage, files: Array<Express.Multer.File>, user: AuthenticatedUser): Promise<{}>;
    removeFiles(id: number, user: AuthenticatedUser): Promise<Prisma.BatchPayload>;
    getFaqsImages(faqId: number): Prisma.PrismaPromise<{
        id: number;
        title: string;
        file: string;
        path: string;
        fileType: string;
    }[]>;
}
