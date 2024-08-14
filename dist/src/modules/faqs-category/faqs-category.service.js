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
var FaqsCategoryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaqsCategoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
let FaqsCategoryService = FaqsCategoryService_1 = class FaqsCategoryService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(FaqsCategoryService_1.name);
    }
    create(createFaqsCategoryDto) {
        return this.prisma.faqsCategory.create({
            data: createFaqsCategoryDto,
        })
            .catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    findAll(filters, pagination) {
        let skip = (pagination.perPage * (pagination.page - 1));
        let take = pagination.perPage;
        let records = this.prisma.faqsCategory.findMany({
            where: filters,
            include: {
                Parent: {
                    select: {
                        id: true,
                        slug: true,
                        title: true,
                        description: true
                    }
                }
            },
            take: take,
            skip: skip,
            orderBy: {
                id: 'desc'
            }
        });
        return records;
    }
    findAllPublished() {
        let records = this.prisma.faqsCategory.findMany({
            where: {
                isDeleted: false,
                isPublished: true,
                parentId: null
            },
            include: {
                ChildCategory: {
                    select: {
                        slug: true,
                        _count: {
                            select: {
                                Faqs: true
                            }
                        },
                        title: true,
                        description: true
                    }
                }
            },
            orderBy: {
                id: 'desc'
            }
        });
        return records;
    }
    findOne(id) {
        return this.prisma.faqsCategory.findUnique({
            where: {
                id: id
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    findBySlug(slug) {
        return this.prisma.faqsCategory.findUnique({
            where: {
                slug: slug
            },
            include: {
                Faqs: {
                    where: {
                        isDeleted: false,
                        isPublished: true
                    },
                    select: {
                        slug: true,
                        title: true,
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
    update(id, updateFaqsCategoryDto) {
        return this.prisma.faqsCategory.update({
            data: updateFaqsCategoryDto,
            where: {
                id: id
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    remove(id) {
        return this.prisma.faqsCategory.update({
            data: {
                isPublished: false,
                isDeleted: true
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
    applyFilters(filters) {
        let condition = {
            isDeleted: false,
        };
        if (Object.entries(filters).length > 0) {
            if (filters.isRoot) {
                condition = Object.assign(Object.assign({}, condition), { parentId: null });
            }
            if (filters.parentId) {
                condition = Object.assign(Object.assign({}, condition), { parentId: filters.parentId });
            }
            if (filters.forAdminpanel || filters.forAdminpanel === false) {
                condition = Object.assign(Object.assign({}, condition), { forAdminpanel: filters.forAdminpanel });
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
    countFaqsCategory(filters) {
        return this.prisma.faqsCategory.count({
            where: filters
        });
    }
};
FaqsCategoryService = FaqsCategoryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FaqsCategoryService);
exports.FaqsCategoryService = FaqsCategoryService;
//# sourceMappingURL=faqs-category.service.js.map