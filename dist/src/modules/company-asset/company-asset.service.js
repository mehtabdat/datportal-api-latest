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
var CompanyAssetService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyAssetService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
const constants_1 = require("../../config/constants");
const user_dto_1 = require("../user/dto/user.dto");
let CompanyAssetService = CompanyAssetService_1 = class CompanyAssetService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(CompanyAssetService_1.name);
    }
    create(createDto) {
        return this.prisma.companyAsset.create({
            data: createDto,
        })
            .catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    allocateResource(createDto) {
        return this.prisma.assetAllocation.create({
            data: createDto
        });
    }
    findAll(filters, pagination) {
        let skip = (pagination.perPage * (pagination.page - 1));
        let take = pagination.perPage;
        let records = this.prisma.companyAsset.findMany({
            where: filters,
            skip: skip,
            take: take,
            include: {
                AssetAllocation: {
                    include: {
                        User: {
                            select: user_dto_1.UserDefaultAttributes
                        }
                    }
                }
            },
            orderBy: {
                id: 'desc'
            }
        });
        return records;
    }
    findCompanyCars() {
        return this.prisma.companyAsset.findMany({
            where: {
                type: constants_1.CompanyAssetType.car,
                isDeleted: false,
                NOT: {
                    AssetAllocation: {
                        none: {}
                    }
                }
            }
        });
    }
    findAllPublished(filters, pagination) {
        let skip = (pagination.perPage * (pagination.page - 1));
        let take = pagination.perPage;
        return this.prisma.companyAsset.findMany({
            where: filters,
            skip: skip,
            take: take,
            orderBy: {
                id: 'desc'
            }
        });
    }
    findOne(id) {
        return this.prisma.companyAsset.findUnique({
            where: {
                id: id
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    update(id, updateDto) {
        return this.prisma.companyAsset.update({
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
        return this.prisma.companyAsset.update({
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
    revoke(id) {
        return this.prisma.assetAllocation.delete({
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
            if (filters.code) {
                condition = Object.assign(Object.assign({}, condition), { code: {
                        contains: filters.code,
                        mode: 'insensitive'
                    } });
            }
            if (filters.assetName) {
                condition = Object.assign(Object.assign({}, condition), { assetName: {
                        contains: filters.assetName,
                        mode: 'insensitive'
                    } });
            }
            if (filters.type) {
                condition = Object.assign(Object.assign({}, condition), { type: filters.type });
            }
        }
        return condition;
    }
    countRecords(filters) {
        return this.prisma.companyAsset.count({
            where: filters
        });
    }
};
CompanyAssetService = CompanyAssetService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CompanyAssetService);
exports.CompanyAssetService = CompanyAssetService;
//# sourceMappingURL=company-asset.service.js.map