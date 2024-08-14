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
var StaticPageSeoService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticPageSeoService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
let StaticPageSeoService = StaticPageSeoService_1 = class StaticPageSeoService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(StaticPageSeoService_1.name);
    }
    create(createStaticPageSeoDto) {
        return this.prisma.staticPageSEO.create({
            data: createStaticPageSeoDto
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    findAll(condition, pagination) {
        let skip = (pagination.perPage * (pagination.page - 1));
        let take = pagination.perPage;
        return this.prisma.staticPageSEO.findMany({
            where: condition,
            orderBy: {
                addedDate: 'desc'
            },
            skip: skip,
            take: take
        });
    }
    async findOne(id) {
        try {
            let data = await this.prisma.staticPageSEO.findUnique({
                where: {
                    id: id
                }
            });
            return data;
        }
        catch (err) {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        }
    }
    async findOneByPageSlug(slug) {
        try {
            let data = await this.prisma.staticPageSEO.findFirst({
                where: {
                    OR: [
                        {
                            SitePage: {
                                slug: slug
                            },
                        }
                    ]
                },
                orderBy: {
                    isDefault: 'asc'
                }
            });
            return data;
        }
        catch (err) {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        }
    }
    update(id, updateStaticPageSeoDto) {
        return this.prisma.staticPageSEO.update({
            data: updateStaticPageSeoDto,
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
        return this.prisma.staticPageSEO.delete({
            where: {
                id: id
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    countStaticPageSEO(filters) {
        return this.prisma.staticPageSEO.count({
            where: filters
        });
    }
    async makeDefault(staticPageSEOId) {
        let data = await this.prisma.staticPageSEO.update({
            data: {
                isDefault: 1
            },
            where: {
                id: staticPageSEOId
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
        await this.prisma.staticPageSEO.updateMany({
            where: {
                NOT: {
                    id: data.id
                }
            },
            data: {
                isDefault: 0
            }
        });
        return data;
    }
    applyFilters(filters) {
        let condition = {};
        if (Object.entries(filters).length > 0) {
            if (filters.sitePageId) {
                condition = Object.assign(Object.assign({}, condition), { sitePageId: filters.sitePageId });
            }
        }
        return condition;
    }
};
StaticPageSeoService = StaticPageSeoService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StaticPageSeoService);
exports.StaticPageSeoService = StaticPageSeoService;
//# sourceMappingURL=static-page-seo.service.js.map