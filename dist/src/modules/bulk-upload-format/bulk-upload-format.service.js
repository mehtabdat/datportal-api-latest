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
var BulkUploadFormatService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkUploadFormatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
let BulkUploadFormatService = BulkUploadFormatService_1 = class BulkUploadFormatService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(BulkUploadFormatService_1.name);
    }
    create(createBulkUploadFormatDto) {
        return this.prisma.bulkUploadFormat.create({
            data: createBulkUploadFormatDto
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 404, data: {} };
            throw errorResponse;
        });
    }
    findAll() {
        let records = this.prisma.bulkUploadFormat.findMany({
            orderBy: { addedDate: 'desc' }
        });
        return records;
    }
    findOne(id) {
        return this.prisma.bulkUploadFormat.findUnique({
            where: {
                id: id
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 404, data: {} };
            throw errorResponse;
        });
    }
    update(id, updateBulkUploadFormatDto) {
        return this.prisma.bulkUploadFormat.update({
            data: updateBulkUploadFormatDto,
            where: {
                id: id
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 404, data: {} };
            throw errorResponse;
        });
    }
    remove(id) {
        return this.prisma.bulkUploadFormat.delete({
            where: {
                id: id
            },
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 404, data: {} };
            throw errorResponse;
        });
    }
};
BulkUploadFormatService = BulkUploadFormatService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BulkUploadFormatService);
exports.BulkUploadFormatService = BulkUploadFormatService;
//# sourceMappingURL=bulk-upload-format.service.js.map