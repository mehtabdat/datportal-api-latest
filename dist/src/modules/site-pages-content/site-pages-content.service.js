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
var SitePagesContentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SitePagesContentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
let SitePagesContentService = SitePagesContentService_1 = class SitePagesContentService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(SitePagesContentService_1.name);
    }
    create(createSitePagesContentDto) {
        return this.prisma.pagesContent.create({
            data: createSitePagesContentDto,
        })
            .catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    findAll() {
        let records = this.prisma.pagesContent.findMany({
            where: {
                isDeleted: false
            },
            orderBy: {
                id: 'desc'
            }
        });
        return records;
    }
    findAllByPageSection(sectionId) {
        let records = this.prisma.pagesSection.findFirst({
            where: {
                isDeleted: false,
                id: sectionId
            },
            include: {
                PagesContent: {
                    where: {
                        isDeleted: false,
                    },
                    orderBy: {
                        id: 'desc'
                    }
                }
            }
        });
        return records;
    }
    findOne(id) {
        return this.prisma.pagesContent.findUnique({
            where: {
                id: id
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    update(id, updateSitePagesContentDto) {
        return this.prisma.pagesContent.update({
            data: updateSitePagesContentDto,
            where: {
                id: id
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    getSectionData(sectionId) {
        return this.prisma.pagesSection.findUnique({
            where: {
                id: sectionId
            }
        });
    }
    checkIfSectionHasContentForCountry(sectionId) {
        return this.prisma.pagesContent.findFirst({
            where: {
                pageSectionId: sectionId,
                isDeleted: false
            }
        });
    }
    remove(id) {
        return this.prisma.pagesContent.update({
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
};
SitePagesContentService = SitePagesContentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SitePagesContentService);
exports.SitePagesContentService = SitePagesContentService;
//# sourceMappingURL=site-pages-content.service.js.map