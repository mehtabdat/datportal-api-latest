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
var BlogsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogsService = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../../config/constants");
const common_2 = require("../../helpers/common");
const file_upload_utils_1 = require("../../helpers/file-upload.utils");
const prisma_service_1 = require("../../prisma.service");
const blogs_sorting_dto_1 = require("./dto/blogs-sorting.dto");
let BlogsService = BlogsService_1 = class BlogsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(BlogsService_1.name);
    }
    create(createBlogDto) {
        return this.prisma.blogs.create({
            data: createBlogDto,
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
        if (sorting.sortByField === blogs_sorting_dto_1.BlogsSortableFields.title) {
            __sorter = { slug: sorting.sortOrder };
        }
        let records = this.prisma.blogs.findMany({
            where: filters,
            include: {
                BlogCategory: {
                    select: {
                        slug: true,
                        id: true,
                        title: true,
                        highlight: true
                    }
                }
            },
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
        if (sorting.sortByField === blogs_sorting_dto_1.BlogsSortableFields.title) {
            __sorter = { slug: sorting.sortOrder };
        }
        let records = this.prisma.blogs.findMany({
            where: filters,
            select: {
                slug: true,
                image: true,
                imageAlt: true,
                addedDate: true,
                category: true,
                title: true,
                highlight: true,
                BlogCategory: {
                    select: {
                        slug: true,
                        title: true,
                        highlight: true
                    }
                }
            },
            take: take,
            skip: skip,
            orderBy: __sorter
        });
        return records;
    }
    findOne(id) {
        return this.prisma.blogs.findUnique({
            where: {
                id: id
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    findOneBySlug(slug) {
        return this.prisma.blogs.findFirst({
            where: {
                slug: slug,
                isDeleted: false,
                status: constants_1.BlogsStatus['Verified & Published']
            },
            include: {
                BlogCategory: {
                    select: {
                        slug: true,
                        title: true,
                        highlight: true,
                        description: true
                    }
                }
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    update(id, updateBlogDto) {
        return this.prisma.blogs.update({
            data: updateBlogDto,
            where: {
                id: id
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    updateStatus(blogId, status) {
        return this.prisma.blogs.update({
            where: {
                id: blogId
            },
            data: {
                status: status
            }
        });
    }
    remove(id, userId) {
        return this.prisma.blogs.update({
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
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    applyAdminFilters(filters) {
        let condition = { isDeleted: false };
        if (Object.entries(filters).length > 0) {
            if (filters.category) {
                condition = Object.assign(Object.assign({}, condition), { category: filters.category });
            }
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
            status: constants_1.BlogsStatus['Verified & Published']
        };
        if (Object.entries(filters).length > 0) {
            if (filters.category) {
                condition = Object.assign(Object.assign({}, condition), { category: filters.category });
            }
            if (filters.excludeId) {
                condition = Object.assign(Object.assign({}, condition), { id: {
                        not: filters.excludeId
                    } });
            }
            if (filters.blogCategorySlug) {
                condition = Object.assign(Object.assign({}, condition), { BlogCategory: { slug: filters.blogCategorySlug } });
            }
            if (filters.blogCategoryId) {
                condition = Object.assign(Object.assign({}, condition), { blogCategoryId: filters.blogCategoryId });
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
    countBlogs(filters) {
        return this.prisma.blogs.count({
            where: filters
        });
    }
    updateSEOData(blogId, seoData) {
        return this.prisma.blogs.update({
            where: {
                id: blogId
            },
            data: seoData
        });
    }
    async handleBlogImages(uploadPropertyImage, files, user) {
        if (uploadPropertyImage.blogId) {
            let blogs = await this.prisma.blogs.findUnique({
                where: {
                    id: uploadPropertyImage.blogId
                }
            });
            if (!blogs) {
                throw new common_1.NotFoundException({ message: "Blog not found", statusCode: 400 });
            }
        }
        let insertedIds = [];
        let insertData = files.map((ele, index) => {
            let uuid = (0, common_2.generateUUID)();
            insertedIds.push(uuid);
            let __t = {
                uuid: uuid,
                title: "Blog Image",
                file: ele.filename,
                fileType: ele.mimetype,
                path: (0, file_upload_utils_1.extractRelativePathFromFullPath)(ele.path),
                blogId: uploadPropertyImage.blogId ? uploadPropertyImage.blogId : null
            };
            return __t;
        });
        if (insertData.length > 0) {
            await this.prisma.blogImages.createMany({
                data: insertData
            }).catch((err) => {
                this.logger.error("Error on " + this.constructor.name + "Custom Error code: ERR437 \n Error code : " + err.code + " \n Error message : " + err.message);
                let errorResponse = { message: err.message, statusCode: 404, data: {} };
                throw errorResponse;
            });
            return this.prisma.blogImages.findMany({
                where: {
                    uuid: {
                        in: insertedIds
                    }
                },
                select: {
                    id: true,
                    uuid: true,
                    file: true,
                    blogId: true,
                    path: true
                }
            }).catch((err) => {
                this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
                let errorResponse = { message: err.message, statusCode: 404, data: {} };
                throw errorResponse;
            });
        }
        else {
            return {};
        }
    }
    async removeFiles(id, user) {
        let imageData = await this.prisma.blogImages.findUnique({ where: { id: id } });
        return this.prisma.blogImages.updateMany({
            where: {
                id: id
            },
            data: {
                isDeleted: true,
                isPublished: false
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + "\n Custom Error code: ERR396 \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 404, data: {} };
            throw errorResponse;
        });
    }
    getBlogImages(blogId) {
        return this.prisma.blogImages.findMany({
            where: {
                blogId: blogId,
                isDeleted: false,
                isPublished: true,
            },
            select: {
                id: true,
                title: true,
                file: true,
                fileType: true,
                path: true
            }
        });
    }
    async checkImagesThreshold(blogId) {
        let totalImages = await this.prisma.blogImages.count({
            where: {
                blogId: blogId,
                isDeleted: false,
                isPublished: true
            }
        });
        if (totalImages >= constants_1.ImagesThresholdForBlogs) {
            throw {
                message: "Images threshold reached, one blog can contain at max " + constants_1.ImagesThresholdForBlogs + " images per blog",
                statusCode: 400
            };
        }
    }
};
BlogsService = BlogsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BlogsService);
exports.BlogsService = BlogsService;
//# sourceMappingURL=blogs.service.js.map