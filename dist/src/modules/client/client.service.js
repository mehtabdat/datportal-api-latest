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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ClientService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
const bull_1 = require("@nestjs/bull");
const xero_process_config_1 = require("../xero-accounting/process/xero.process.config");
let ClientService = ClientService_1 = class ClientService {
    constructor(prisma, xeroQueue) {
        this.prisma = prisma;
        this.xeroQueue = xeroQueue;
        this.logger = new common_1.Logger(ClientService_1.name);
    }
    async create(createDto) {
        let newClient = await this.prisma.client.create({
            data: createDto,
        })
            .catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
        return newClient;
    }
    findAll(filters, pagination) {
        let skip = (pagination.perPage * (pagination.page - 1));
        let take = pagination.perPage;
        let records = this.prisma.client.findMany({
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
        return this.prisma.client.findMany({
            where: filters,
            skip: skip,
            take: take,
            orderBy: {
                id: 'desc'
            }
        });
    }
    findOne(id) {
        return this.prisma.client.findUnique({
            where: {
                id: id
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    async update(id, updateDto) {
        let updatedData = await this.prisma.client.update({
            data: updateDto,
            where: {
                id: id
            },
            include: {
                ClientXeroConnection: true
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
        if (updatedData && updatedData.ClientXeroConnection.length > 0) {
            updatedData.ClientXeroConnection.forEach((ele) => {
                this.xeroQueue.add(xero_process_config_1.XeroProcessNames.syncClient, {
                    message: "Sync Client With Xero",
                    data: Object.assign(Object.assign({}, updatedData), { xeroTenantId: ele.xeroTenantId, xeroReference: ele.xeroReference })
                }, { removeOnComplete: true });
            });
        }
        return updatedData;
    }
    async remove(id) {
        let recordData = await this.prisma.client.update({
            data: {
                isDeleted: true
            },
            where: {
                id: id
            },
            include: {
                ClientXeroConnection: true
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
        if (recordData && recordData.ClientXeroConnection.length > 0) {
            recordData.ClientXeroConnection.forEach((ele) => {
                this.xeroQueue.add(xero_process_config_1.XeroProcessNames.syncClient, {
                    message: "Sync Client With Xero",
                    data: Object.assign(Object.assign({}, recordData), { xeroTenantId: ele.xeroTenantId, xeroReference: ele.xeroReference })
                }, { removeOnComplete: true });
            });
        }
        return recordData;
    }
    applyFilters(filters) {
        let condition = {
            isDeleted: false
        };
        if (Object.entries(filters).length > 0) {
            if (filters.ids) {
                let allIds = [];
                if (Array.isArray(filters.ids)) {
                    allIds = filters.ids;
                }
                else {
                    allIds = [filters.ids];
                }
                if (allIds.length > 0) {
                    condition = Object.assign(Object.assign({}, condition), { id: {
                            in: allIds
                        } });
                }
            }
            if (filters.name) {
                condition = Object.assign(Object.assign({}, condition), { name: {
                        contains: filters.name,
                        mode: 'insensitive'
                    } });
            }
            if (filters.email) {
                condition = Object.assign(Object.assign({}, condition), { email: {
                        contains: filters.email,
                        mode: 'insensitive'
                    } });
            }
            if (filters.phone) {
                condition = Object.assign(Object.assign({}, condition), { phone: {
                        contains: filters.phone
                    } });
            }
            if (filters.type) {
                condition = Object.assign(Object.assign({}, condition), { type: filters.type });
            }
        }
        return condition;
    }
    countRecords(filters) {
        return this.prisma.client.count({
            where: filters
        });
    }
};
ClientService = ClientService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bull_1.InjectQueue)('xero')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object])
], ClientService);
exports.ClientService = ClientService;
//# sourceMappingURL=client.service.js.map