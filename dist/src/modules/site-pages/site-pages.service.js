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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var SitePagesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SitePagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
let SitePagesService = SitePagesService_1 = class SitePagesService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(SitePagesService_1.name);
    }
    async create(createSitePageDto) {
        const { pageSectionIds } = createSitePageDto, rest = __rest(createSitePageDto, ["pageSectionIds"]);
        let sitePage = await this.prisma.sitePages.create({
            data: rest
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
        if (sitePage && pageSectionIds && pageSectionIds.length > 0) {
            await this.createOrUpdatePageSectionRelation(pageSectionIds, sitePage.id);
        }
        return sitePage;
    }
    async createOrUpdatePageSectionRelation(pageSectionIds, pageId) {
        let allPromises = [];
        let sectionIds = await this.validateSectionIds(pageSectionIds);
        for (const ele of sectionIds) {
            let t = this.prisma.pageSectionRelation.upsert({
                where: {
                    sitePageId_pageSectionId: {
                        sitePageId: pageId,
                        pageSectionId: ele
                    }
                },
                create: { sitePageId: pageId, pageSectionId: ele },
                update: {}
            }).catch((err) => {
                this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
                let __infoText = "";
                if (pageSectionIds.length > 1) {
                    __infoText = ". Data might have partially updated";
                }
                let errorResponse = { message: err.message + __infoText, statusCode: 400, data: {} };
                throw errorResponse;
            });
            allPromises.push(t);
        }
        return await Promise.all(allPromises);
    }
    findAll(condition) {
        let records = this.prisma.sitePages.findMany({
            where: condition,
            orderBy: {
                id: 'desc'
            },
            include: {
                PageSectionRelation: {
                    where: {
                        PageSection: {
                            isDeleted: false
                        }
                    },
                    include: {
                        PageSection: true,
                    }
                }
            }
        });
        return records;
    }
    findOne(id) {
        return this.prisma.sitePages.findUnique({
            where: {
                id: id
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    async update(id, updateSitePageDto) {
        const { pageSectionIds } = updateSitePageDto, rest = __rest(updateSitePageDto, ["pageSectionIds"]);
        let sitePage = this.prisma.sitePages.update({
            data: rest,
            where: {
                id: id
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
        if (sitePage && pageSectionIds && pageSectionIds.length > 0) {
            await this.createOrUpdatePageSectionRelation(pageSectionIds, id);
        }
        return sitePage;
    }
    remove(id) {
        return this.prisma.sitePages.update({
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
        }
        return condition;
    }
    async validateSectionIds(sectionIds) {
        let pageSectionIds = await this.prisma.pagesSection.findMany({
            where: {
                id: {
                    in: sectionIds
                }
            }
        });
        let ids = pageSectionIds.map((ele) => ele.id);
        return ids;
    }
    removeSectionFromPage(pageId, sectionId) {
        return this.prisma.pageSectionRelation.delete({
            where: {
                sitePageId_pageSectionId: {
                    sitePageId: pageId,
                    pageSectionId: sectionId
                }
            }
        });
    }
    removeMultipleSectionFromPage(pageId, sectionIds) {
        return this.prisma.pageSectionRelation.deleteMany({
            where: {
                sitePageId: pageId,
                pageSectionId: {
                    in: sectionIds
                }
            }
        });
    }
    findPageBySlug(slug) {
        return this.prisma.sitePages.findFirst({
            where: {
                isDeleted: false,
                isPublished: true,
                slug: slug
            }
        });
    }
    findPageContent(pageId) {
        return this.prisma.pageSectionRelation.findMany({
            where: {
                sitePageId: pageId
            },
            select: {
                PageSection: {
                    select: {
                        slug: true,
                        title: true,
                        description: true,
                        PagesContent: {
                            where: {
                                isPublished: true,
                                isDeleted: false
                            },
                            orderBy: {
                                isDefault: 'asc'
                            },
                            select: {
                                image: true,
                                imageAlt: true,
                                title: true,
                                highlight: true,
                                description: true
                            }
                        }
                    }
                }
            }
        });
    }
    findPageSeo(pageId) {
        return this.prisma.staticPageSEO.findFirst({
            where: {
                OR: [
                    {
                        sitePageId: pageId,
                    },
                    {
                        isDefault: 1
                    }
                ]
            },
            select: {
                seoTitle: true,
                seoDescription: true,
                image: true
            },
            orderBy: {
                isDefault: 'asc'
            }
        });
    }
};
SitePagesService = SitePagesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SitePagesService);
exports.SitePagesService = SitePagesService;
//# sourceMappingURL=site-pages.service.js.map