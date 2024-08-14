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
var SitePagesSectionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SitePagesSectionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
let SitePagesSectionService = SitePagesSectionService_1 = class SitePagesSectionService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(SitePagesSectionService_1.name);
    }
    create(createSitePagesSectionDto) {
        return this.prisma.pagesSection.create({
            data: createSitePagesSectionDto
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    findAll(condition) {
        let records = this.prisma.pagesSection.findMany({
            where: condition,
            orderBy: {
                id: 'desc'
            },
            include: {
                PagesContent: {
                    where: {
                        isDeleted: false
                    },
                    select: {
                        id: true,
                        isPublished: true,
                        title: true
                    }
                }
            }
        });
        return records;
    }
    findOne(id) {
        return this.prisma.pagesSection.findUnique({
            where: {
                id: id
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    update(id, updateSitePagesSectionDto) {
        return this.prisma.pagesSection.update({
            data: updateSitePagesSectionDto,
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
        return this.prisma.pagesSection.update({
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
        let condition = { isDeleted: false };
        if (Object.entries(filters).length > 0) {
            if (filters.title) {
                condition = Object.assign(Object.assign({}, condition), { title: {
                        contains: filters.title,
                        mode: 'insensitive'
                    } });
            }
            if (filters.slug) {
                condition = Object.assign(Object.assign({}, condition), { slug: filters.slug });
            }
        }
        return condition;
    }
    findAllContentOfSection(sectionId) {
        return this.prisma.pagesContent.groupBy({
            by: ['pageSectionId'],
            where: {
                pageSectionId: sectionId,
                isDeleted: false
            },
            _count: {
                id: true
            }
        });
    }
};
SitePagesSectionService = SitePagesSectionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SitePagesSectionService);
exports.SitePagesSectionService = SitePagesSectionService;
//# sourceMappingURL=site-pages-section.service.js.map