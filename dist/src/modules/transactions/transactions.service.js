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
var TransactionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../../config/constants");
const prisma_service_1 = require("../../prisma.service");
const user_dto_1 = require("../user/dto/user.dto");
const project_dto_1 = require("../project/dto/project.dto");
const client_dto_1 = require("../client/dto/client.dto");
const authority_dto_1 = require("../authorities/dto/authority.dto");
let TransactionsService = TransactionsService_1 = class TransactionsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(TransactionsService_1.name);
    }
    async create(createDto, user) {
        let projectData = await this.prisma.project.findUniqueOrThrow({
            where: {
                id: createDto.projectId
            },
            select: {
                id: true,
                clientId: true
            }
        });
        return this.prisma.transactions.create({
            data: Object.assign(Object.assign({}, createDto), { clientId: projectData.clientId, addedById: user.userId, recordType: constants_1.TransactionRecordType.government_fees })
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    findAll(pagination, sorting, condition) {
        let skip = (pagination.perPage * (pagination.page - 1));
        let take = pagination.perPage;
        let __sorter = { [sorting.sortByField]: sorting.sortOrder };
        let records = this.prisma.transactions.findMany({
            where: condition,
            include: {
                Project: {
                    select: project_dto_1.ProjectDefaultAttributes
                },
                Client: {
                    select: client_dto_1.ClientDefaultAttributes
                },
                AddedBy: {
                    select: user_dto_1.UserDefaultAttributes
                },
                Authority: {
                    select: authority_dto_1.AuthorityDefaultAttributes
                },
                AssignedTo: {
                    select: user_dto_1.UserDefaultAttributes
                },
                Invoice: {
                    select: {
                        id: true,
                        status: true,
                        invoiceNumber: true
                    }
                }
            },
            skip: skip,
            take: take,
            orderBy: __sorter,
        });
        return records;
    }
    findOne(id) {
        return this.prisma.transactions.findFirst({
            where: {
                id: id
            },
            include: {
                Project: {
                    select: project_dto_1.ProjectDefaultAttributes
                },
                Client: {
                    select: client_dto_1.ClientDefaultAttributes
                },
                AddedBy: {
                    select: user_dto_1.UserDefaultAttributes
                },
                Authority: {
                    select: authority_dto_1.AuthorityDefaultAttributes
                },
                AssignedTo: {
                    select: user_dto_1.UserDefaultAttributes
                },
                Invoice: {
                    select: {
                        id: true,
                        status: true,
                        invoiceNumber: true
                    }
                }
            },
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    update(id, updateTransactionDto) {
        return this.prisma.transactions.update({
            data: updateTransactionDto,
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
            if (filters.__status) {
                condition = Object.assign(Object.assign({}, condition), { status: {
                        in: filters.__status
                    } });
            }
            if (filters.onlyGovernmentFees) {
                condition = Object.assign(Object.assign({}, condition), { recordType: constants_1.TransactionRecordType.government_fees });
            }
            if (filters.onlyInvoicePayments) {
                condition = Object.assign(Object.assign({}, condition), { recordType: constants_1.TransactionRecordType.invoice_transaction });
            }
            if (filters.transactionReference) {
                condition = Object.assign(Object.assign({}, condition), { transactionReference: {
                        contains: filters.transactionReference
                    } });
            }
            if (filters.projectId) {
                condition = Object.assign(Object.assign({}, condition), { projectId: filters.projectId });
            }
            if (filters.clientId) {
                condition = Object.assign(Object.assign({}, condition), { clientId: filters.clientId });
            }
            if (filters.authorityId) {
                condition = Object.assign(Object.assign({}, condition), { authorityId: filters.authorityId });
            }
            if (filters.fromDate && filters.toDate) {
                condition = Object.assign(Object.assign({}, condition), { AND: [
                        {
                            transactionDate: {
                                gte: new Date(filters.fromDate + "T00:00:00")
                            }
                        },
                        {
                            transactionDate: {
                                lte: new Date(filters.toDate + "T23:59:59")
                            }
                        }
                    ] });
            }
            else {
                if (filters.fromDate) {
                    condition = Object.assign(Object.assign({}, condition), { transactionDate: { gte: new Date(filters.fromDate + "T00:00:00") } });
                }
                if (filters.toDate) {
                    condition = Object.assign(Object.assign({}, condition), { transactionDate: { lte: new Date(filters.toDate + "T23:59:59") } });
                }
            }
        }
        return condition;
    }
    countTotalRecord(condition) {
        return this.prisma.transactions.count({
            where: condition
        });
    }
    remove(id) {
        return this.prisma.transactions.update({
            data: {
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
    assignTransaction(transactionId, asignPropertyDto, user) {
        return this.prisma.transactions.update({
            where: {
                id: transactionId,
            },
            data: {
                assignedToId: asignPropertyDto.assignedToId,
            }
        });
    }
};
TransactionsService = TransactionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransactionsService);
exports.TransactionsService = TransactionsService;
//# sourceMappingURL=transactions.service.js.map