"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var BlogsCategoryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogsCategoryService = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../../config/constants");
const prisma_service_1 = require("../../prisma.service");
const blogs_category_sorting_dto_1 = require("./dto/blogs-category-sorting.dto");
let BlogsCategoryService = BlogsCategoryService_1 = class BlogsCategoryService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(BlogsCategoryService_1.name);
    }
    create(createBlogCategoryDto) {
        return this.prisma.blogsCategory.create({
            data: createBlogCategoryDto,
        })
            .catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    findAll(filters, pagination, sorting) {
        let skip = (pagination.perPage * (pagination.page - 1));
        let take = pagination.perPage;
        let __sorter = { [sorting.sortByField]: sorting.sortOrder };
        if (sorting.sortByField === blogs_category_sorting_dto_1.BlogsCategorySortableFields.title) {
            __sorter = { slug: sorting.sortOrder };
        }
        let records = this.prisma.blogsCategory.findMany({
            where: filters,
            take: take,
            skip: skip,
            orderBy: __sorter
        });
        return records;
    }
    findAllPublished(filters, pagination, sorting) {
        let skip = (pagination.perPage * (pagination.page - 1));
        let take = pagination.perPage;
        let __sorter = { [sorting.sortByField]: sorting.sortOrder };
        if (sorting.sortByField === blogs_category_sorting_dto_1.BlogsCategorySortableFields.title) {
            __sorter = { slug: sorting.sortOrder };
        }
        let records = this.prisma.blogsCategory.findMany({
            where: filters,
            select: {
                slug: true,
                image: true,
                imageAlt: true,
                addedDate: true,
                title: true,
                highlight: true
            },
            take: take,
            skip: skip,
            orderBy: __sorter
        });
        return records;
    }
    findOne(id) {
        return this.prisma.blogsCategory.findUnique({
            where: {
                id: id
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 404, data: {} };
            throw errorResponse;
        });
    }
    findOneBySlug(slug, pagination) {
        let skip = (pagination.perPage * (pagination.page - 1));
        let take = pagination.perPage;
        return this.prisma.blogsCategory.findFirst({
            where: {
                slug: slug,
                isDeleted: false,
                status: constants_1.BlogsCategoryStatus['Verified & Published']
            },
            include: {
                blogs: {
                    where: {
                        isDeleted: false,
                        status: constants_1.BlogsStatus['Verified & Published'],
                    },
                    select: {
                        slug: true,
                        image: true,
                        imageAlt: true,
                        addedDate: true,
                        title: true,
                        highlight: true
                    },
                    take: take,
                    skip: skip
                }
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 404, data: {} };
            throw errorResponse;
        });
    }
    update(id, updateBlogCategoryDto) {
        return this.prisma.blogsCategory.update({
            data: updateBlogCategoryDto,
            where: {
                id: id
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 404, data: {} };
            throw errorResponse;
        });
    }
    updateStatus(blogId, status) {
        return this.prisma.blogsCategory.update({
            where: {
                id: blogId
            },
            data: {
                status: status
            }
        });
    }
    remove(id, userId) {
        return this.prisma.blogsCategory.update({
            data: {
                isDeleted: true,
                deletedById: userId,
                deletedDate: new Date()
            },
            where: {
                id: id
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 404, data: {} };
            throw errorResponse;
        });
    }
    applyAdminFilters(filters) {
        let condition = { isDeleted: false };
        if (Object.entries(filters).length > 0) {
            if (filters.status) {
                condition = Object.assign(Object.assign({}, condition), { status: filters.status });
            }
            if (filters.title) {
                condition = Object.assign(Object.assign({}, condition), { title: {
                        contains: filters.title,
                        mode: 'insensitive'
                    } });
            }
        }
        return condition;
    }
    applyPublicFilters(filters) {
        let condition = {
            isDeleted: false,
            status: constants_1.BlogsCategoryStatus['Verified & Published']
        };
        if (Object.entries(filters).length > 0) {
            if (filters.title) {
                condition = Object.assign(Object.assign({}, condition), { title: {
                        contains: filters.title,
                        mode: 'insensitive'
                    } });
            }
        }
        return condition;
    }
    countBlogsCategory(filters) {
        return this.prisma.blogsCategory.count({
            where: filters
        });
    }
    countBlogs(filters) {
        return this.prisma.blogs.count({
            where: filters
        });
    }
    updateSEOData(blogId, seoData) {
        return this.prisma.blogsCategory.update({
            where: {
                id: blogId
            },
            data: seoData
        });
    }
    publishUnpublish(blogCategoryId, userId, status) {
        return this.prisma.blogsCategory.update({
            where: {
                id: blogCategoryId
            },
            data: {
                isPublished: status,
                modifiedDate: new Date(),
                modifiedById: userId
            }
        });
    }
};
BlogsCategoryService = BlogsCategoryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BlogsCategoryService);
exports.BlogsCategoryService = BlogsCategoryService;
//# sourceMappingURL=blogs-category.service.js.map