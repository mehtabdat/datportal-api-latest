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
var CountryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
let CountryService = CountryService_1 = class CountryService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(CountryService_1.name);
    }
    create(createCountryDto) {
        return this.prisma.country.create({
            data: createCountryDto,
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    findAll(user) {
        let condition = { isDeleted: false };
        return this.prisma.country.findMany({
            where: condition,
            orderBy: {
                addedDate: 'desc'
            }
        });
    }
    findAllAvailableCountry() {
        let condition = { isDeleted: false };
        return this.prisma.country.findMany({
            where: condition,
            orderBy: {
                addedDate: 'desc'
            }
        });
    }
    findAvailableCountry() {
        return this.prisma.country.findMany({
            where: {
                isDeleted: false,
                isPublished: true,
            },
            orderBy: {
                addedDate: 'desc'
            }
        });
    }
    async findOne(id) {
        try {
            let data = await this.prisma.country.findUnique({
                where: {
                    id: id
                },
            });
            return data;
        }
        catch (err) {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        }
    }
    update(id, updateCountryDto) {
        return this.prisma.country.update({
            data: updateCountryDto,
            where: {
                id: id
            },
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    remove(id, metaData) {
        return this.prisma.country.update({
            data: Object.assign({ isPublished: false, isDeleted: true }, metaData),
            where: {
                id: id
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    updateResources(resouceId, fieldName, fieldValue) {
        return this.prisma.country.update({
            data: {
                [fieldName]: fieldValue
            },
            where: {
                id: resouceId
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
};
CountryService = CountryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CountryService);
exports.CountryService = CountryService;
//# sourceMappingURL=country.service.js.map