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
var ProjectComponentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectComponentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
let ProjectComponentsService = ProjectComponentsService_1 = class ProjectComponentsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(ProjectComponentsService_1.name);
    }
    create(createDto) {
        return this.prisma.projectComponent.create({
            data: createDto,
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
        let records = this.prisma.projectComponent.findMany({
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
        return this.prisma.projectComponent.findMany({
            where: filters,
            skip: skip,
            take: take,
            orderBy: {
                id: 'desc'
            }
        });
    }
    findOne(id) {
        return this.prisma.projectComponent.findUnique({
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
        return this.prisma.projectComponent.findUnique({
            where: {
                slug: slug
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    update(id, updateDto) {
        return this.prisma.projectComponent.update({
            data: updateDto,
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
        return this.prisma.projectComponent.update({
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
            if (filters.slug) {
                condition = Object.assign(Object.assign({}, condition), { slug: filters.slug });
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
    countFaqs(filters) {
        return this.prisma.projectComponent.count({
            where: filters
        });
    }
};
ProjectComponentsService = ProjectComponentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProjectComponentsService);
exports.ProjectComponentsService = ProjectComponentsService;
//# sourceMappingURL=project-components.service.js.map