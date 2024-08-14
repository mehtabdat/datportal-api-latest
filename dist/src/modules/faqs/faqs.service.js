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
var FaqsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaqsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
const common_2 = require("../../helpers/common");
const file_upload_utils_1 = require("../../helpers/file-upload.utils");
let FaqsService = FaqsService_1 = class FaqsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(FaqsService_1.name);
    }
    create(createFaqDto) {
        return this.prisma.faqs.create({
            data: createFaqDto,
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
        let records = this.prisma.faqs.findMany({
            where: filters,
            skip: skip,
            take: take,
            orderBy: {
                id: 'desc'
            }
        });
        return records;
    }
    findAllPublished(filters, pagination) {
        let skip = (pagination.perPage * (pagination.page - 1));
        let take = pagination.perPage;
        return this.prisma.faqs.findMany({
            where: filters,
            include: {
                FaqsCategory: {
                    select: {
                        slug: true,
                        title: true,
                        description: true
                    }
                }
            },
            skip: skip,
            take: take,
            orderBy: {
                id: 'desc'
            }
        });
    }
    findOne(id) {
        return this.prisma.faqs.findUnique({
            where: {
                id: id
            },
            include: {
                FaqsCategory: {
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
    findBySlug(slug) {
        return this.prisma.faqs.findUnique({
            where: {
                slug: slug
            },
            include: {
                FaqsCategory: {
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
    update(id, updateFaqDto) {
        return this.prisma.faqs.update({
            data: updateFaqDto,
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
        return this.prisma.faqs.update({
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
            isDeleted: false
        };
        if (Object.entries(filters).length > 0) {
            if (filters.faqsCategoryId) {
                condition = Object.assign(Object.assign({}, condition), { faqsCategoryId: filters.faqsCategoryId });
            }
            if (filters.faqsCategorySlug) {
                condition = Object.assign(Object.assign({}, condition), { FaqsCategory: { slug: filters.faqsCategorySlug } });
            }
            if (filters.forAdminpanel || filters.forAdminpanel === false) {
                condition = Object.assign(Object.assign({}, condition), { forAdminpanel: filters.forAdminpanel });
            }
            if (filters.title) {
                condition = Object.assign(Object.assign({}, condition), { AND: {
                        OR: [
                            {
                                title: {
                                    contains: filters.title,
                                    mode: 'insensitive'
                                }
                            },
                            {
                                description: {
                                    contains: filters.title,
                                    mode: 'insensitive'
                                }
                            }
                        ]
                    } });
            }
        }
        return condition;
    }
    countFaqs(filters) {
        return this.prisma.faqs.count({
            where: filters
        });
    }
    async handleFaqImages(uploadImage, files, user) {
        if (uploadImage.faqId) {
            let faqData = await this.prisma.faqs.findUnique({
                where: {
                    id: uploadImage.faqId
                }
            });
            if (!faqData) {
                throw new common_1.NotFoundException({ message: "Faq not found", statusCode: 400 });
            }
        }
        let insertedIds = [];
        let insertData = files.map((ele, index) => {
            let uuid = (0, common_2.generateUUID)();
            insertedIds.push(uuid);
            let __t = {
                uuid: uuid,
                title: "Faq Image",
                file: ele.filename,
                fileType: ele.mimetype,
                path: (0, file_upload_utils_1.extractRelativePathFromFullPath)(ele.path),
                faqId: uploadImage.faqId ? uploadImage.faqId : null
            };
            return __t;
        });
        if (insertData.length > 0) {
            await this.prisma.faqsMedia.createMany({
                data: insertData
            }).catch((err) => {
                this.logger.error("Error on " + this.constructor.name + "Custom Error code: ERR437 \n Error code : " + err.code + " \n Error message : " + err.message);
                let errorResponse = { message: err.message, statusCode: 404, data: {} };
                throw errorResponse;
            });
            return this.prisma.faqsMedia.findMany({
                where: {
                    uuid: {
                        in: insertedIds
                    }
                },
                select: {
                    id: true,
                    uuid: true,
                    file: true,
                    faqId: true,
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
        let imageData = await this.prisma.faqsMedia.findUnique({ where: { id: id } });
        return this.prisma.faqsMedia.updateMany({
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
    getFaqsImages(faqId) {
        return this.prisma.faqsMedia.findMany({
            where: {
                faqId: faqId,
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
};
FaqsService = FaqsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FaqsService);
exports.FaqsService = FaqsService;
//# sourceMappingURL=faqs.service.js.map