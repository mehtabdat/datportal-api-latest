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
var CashAdvanceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashAdvanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
const user_dto_1 = require("../user/dto/user.dto");
const file_upload_utils_1 = require("../../helpers/file-upload.utils");
const constants_1 = require("../../config/constants");
const common_2 = require("../../helpers/common");
let CashAdvanceService = CashAdvanceService_1 = class CashAdvanceService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(CashAdvanceService_1.name);
    }
    create(createDto, user) {
        return this.prisma.cashAdvanceRequest.create({
            data: {
                purpose: createDto.purpose,
                requestAmount: createDto.requestAmount,
                requestById: user.userId,
                addedDate: new Date()
            },
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
        let records = this.prisma.cashAdvanceRequest.findMany({
            where: filters,
            skip: skip,
            take: take,
            include: {
                _count: {
                    select: {
                        AdminActions: true,
                        Attachments: true
                    }
                },
                RequestBy: {
                    select: user_dto_1.UserDefaultAttributes
                },
                AdminActions: {
                    take: 1,
                    orderBy: {
                        addedDate: 'desc'
                    },
                    include: {
                        ActionBy: {
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
    findOne(id) {
        return this.prisma.cashAdvanceRequest.findUnique({
            where: {
                id: id
            },
            include: {
                RequestBy: {
                    select: user_dto_1.UserDefaultAttributes
                },
                AdminActions: {
                    include: {
                        Department: {
                            select: user_dto_1.DepartmentDefaultAttributes
                        },
                        ActionBy: {
                            select: user_dto_1.UserDefaultAttributes
                        }
                    }
                },
                Installments: true,
                Attachments: true
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    async hrUpdate(cashAdvanceRequestId, cashAdvanceHrAction, user) {
        let recordData = await this.prisma.cashAdvanceRequest.findFirst({
            where: {
                id: cashAdvanceRequestId
            },
            include: {
                AdminActions: true
            }
        });
        if (recordData.status === constants_1.CashAdvanceRequestStatus.withdrawn) {
            throw {
                message: `This request is already withdrawn by the Employee. No further action required`,
                statusCode: 400
            };
        }
        else if (recordData.status === constants_1.CashAdvanceRequestStatus.rejected || recordData.status === constants_1.CashAdvanceRequestStatus.approved || recordData.status === constants_1.CashAdvanceRequestStatus.partially_approved) {
            throw {
                message: `This request is already marked as ${(0, common_2.getEnumKeyByEnumValue)(constants_1.CashAdvanceRequestStatus, recordData.status)}.`,
                statusCode: 400
            };
        }
        else if (recordData.status === constants_1.CashAdvanceRequestStatus.paid_and_closed) {
            throw {
                message: `This request is already fulfilled by finance. You cannot make any further actions.`,
                statusCode: 400
            };
        }
        let allUpdatedRecord = [];
        let status = cashAdvanceHrAction.status;
        if (cashAdvanceHrAction.status === constants_1.CashAdvanceRequestStatus.rejected) {
            status = constants_1.CashAdvanceRequestStatus.rejected;
        }
        else if (recordData.requestAmount === cashAdvanceHrAction.approvedAmount) {
            status = constants_1.CashAdvanceRequestStatus.approved;
        }
        else {
            status = constants_1.CashAdvanceRequestStatus.partially_approved;
        }
        let r = this.prisma.cashAdvanceRequest.update({
            where: {
                id: cashAdvanceRequestId
            },
            data: {
                status: status,
                approvedAmount: cashAdvanceHrAction.approvedAmount
            }
        });
        allUpdatedRecord.push(r);
        let actionData = this.prisma.adminAction.create({
            data: {
                status: status,
                comment: cashAdvanceHrAction.comment,
                Department: {
                    connect: {
                        slug: constants_1.Departments.hr
                    }
                },
                ActionBy: {
                    connect: {
                        id: user.userId
                    }
                },
                CashAdvanceRequest: {
                    connect: {
                        id: cashAdvanceRequestId
                    }
                },
                addedDate: new Date()
            }
        });
        allUpdatedRecord.push(actionData);
        await Promise.all(allUpdatedRecord);
        return this.findOne(cashAdvanceRequestId);
    }
    async financeUpdate(cashAdvanceRequestId, cashAdvanceFinanceAction, user) {
        let recordData = await this.prisma.cashAdvanceRequest.findUniqueOrThrow({
            where: {
                id: cashAdvanceRequestId
            }
        });
        if (recordData.status === constants_1.CashAdvanceRequestStatus.rejected) {
            throw {
                message: "This request has been rejected already, you cannot make any further actions",
                statusCode: 400
            };
        }
        else if (recordData.status === constants_1.CashAdvanceRequestStatus.paid_and_closed) {
            throw {
                message: "This request has been paid and closed already, you cannot make any further actions",
                statusCode: 400
            };
        }
        else if (!(recordData.status === constants_1.CashAdvanceRequestStatus.approved || recordData.status === constants_1.CashAdvanceRequestStatus.partially_approved)) {
            throw {
                message: "This request has not been aproved by HR yet. You can approve/reject only after HR approval",
                statusCode: 400
            };
        }
        let installmentAmount = Number((recordData.approvedAmount / cashAdvanceFinanceAction.numberOfInstallments).toFixed(4));
        let t = this.prisma.cashAdvanceRequest.update({
            where: {
                id: cashAdvanceRequestId
            },
            data: {
                status: cashAdvanceFinanceAction.status,
                numberOfInstallments: cashAdvanceFinanceAction.numberOfInstallments,
                installmentAmount: installmentAmount
            }
        });
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        if (currentDate.getDate() > 15) {
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
        currentDate.setDate(1);
        let installmentData = [];
        for (let i = 0; i < cashAdvanceFinanceAction.numberOfInstallments; i++) {
            const installmentDate = new Date(currentDate);
            installmentDate.setMonth(currentDate.getMonth() + i);
            let eachInstallment = {
                cashAdvanceRequestId: cashAdvanceRequestId,
                amount: installmentAmount,
                isPaid: false,
                monthYear: installmentDate
            };
            installmentData.push(eachInstallment);
        }
        await this.prisma.cashAdvanceInstallment.createMany({
            data: installmentData
        });
        let financeAction = this.prisma.adminAction.create({
            data: {
                status: (cashAdvanceFinanceAction.status === constants_1.CashAdvanceRequestStatus.paid_and_closed) ? constants_1.ActionStatus.Approved : constants_1.ActionStatus.Rejected,
                comment: cashAdvanceFinanceAction.comment,
                Department: {
                    connect: {
                        slug: constants_1.Departments.finance
                    }
                },
                ActionBy: {
                    connect: {
                        id: user.userId
                    }
                },
                CashAdvanceRequest: {
                    connect: {
                        id: cashAdvanceRequestId
                    }
                },
                addedDate: new Date()
            }
        });
        await Promise.all([t, financeAction]);
        return this.findOne(cashAdvanceRequestId);
    }
    async withdraw(id) {
        let record = await this.prisma.cashAdvanceRequest.findFirst({
            where: {
                id
            }
        });
        if (record.status == constants_1.CashAdvanceRequestStatus.paid_and_closed || record.status === constants_1.CashAdvanceRequestStatus.rejected) {
            throw {
                message: "You cannot withdraw your request as the request is already" + (0, common_2.getEnumKeyByEnumValue)(constants_1.CashAdvanceRequestStatus, record.status),
                statuCode: 400
            };
        }
        return this.prisma.cashAdvanceRequest.update({
            data: {
                status: constants_1.CashAdvanceRequestStatus.withdrawn
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
    applyFilters(filters, permissions) {
        let condition = {};
        if (Object.entries(filters).length > 0) {
            if (filters.userId) {
                condition = Object.assign(Object.assign({}, condition), { requestById: filters.userId });
            }
            if (filters.status) {
                condition = Object.assign(Object.assign({}, condition), { status: filters.status });
            }
            if (filters.fromDate && filters.toDate) {
                condition = Object.assign(Object.assign({}, condition), { AND: [
                        {
                            addedDate: {
                                gte: new Date(filters.fromDate + "T00:00:00")
                            }
                        },
                        {
                            addedDate: {
                                lte: new Date(filters.toDate + "T23:59:59")
                            }
                        }
                    ] });
            }
            else {
                if (filters.fromDate) {
                    condition = Object.assign(Object.assign({}, condition), { addedDate: { gte: new Date(filters.fromDate + "T00:00:00") } });
                }
                if (filters.toDate) {
                    condition = Object.assign(Object.assign({}, condition), { addedDate: { lte: new Date(filters.toDate + "T23:59:59") } });
                }
            }
        }
        if (filters.fetchOpenRequest && permissions && Object.entries(filters).length > 0) {
            let statusCode = [];
            if (permissions.cashAdvanceHRApproval) {
                statusCode.push(constants_1.CashAdvanceRequestStatus.submitted);
            }
            if (permissions.cashAdvanceFinanceApproval) {
                statusCode.push(constants_1.CashAdvanceRequestStatus.approved);
                statusCode.push(constants_1.CashAdvanceRequestStatus.partially_approved);
            }
            condition = Object.assign(Object.assign({}, condition), { status: {
                    in: statusCode
                } });
        }
        return condition;
    }
    countRecords(filters) {
        return this.prisma.cashAdvanceRequest.count({
            where: filters
        });
    }
    async handleFiles(cashAdvanceRequestId, files) {
        let insertData = [];
        files.forEach((ele, index) => {
            let newRecord = {
                title: ele.filename,
                mimeType: ele.mimetype,
                file: (0, file_upload_utils_1.extractRelativePathFromFullPath)(ele.path),
                cashAdvanceRequestId: cashAdvanceRequestId
            };
            insertData.push(newRecord);
        });
        if (insertData.length > 0) {
            await this.prisma.requestAttachment.createMany({
                data: insertData
            }).catch((err) => {
                this.logger.error("Error on " + this.constructor.name + "Custom Error code: ERR437 \n Error code : " + err.code + " \n Error message : " + err.message);
                let errorResponse = { message: err.message, statusCode: 404, data: {} };
                throw errorResponse;
            });
        }
        else {
            return [];
        }
    }
    async markAsPaid(installmentPaidDto) {
        let recordData = await this.prisma.cashAdvanceInstallment.findUniqueOrThrow({
            where: {
                id: installmentPaidDto.installmentId
            }
        });
        if (recordData.isPaid) {
            throw {
                message: "This installment has been paid already",
                statusCode: 200
            };
        }
        return this.prisma.cashAdvanceInstallment.update({
            where: {
                id: installmentPaidDto.installmentId,
                cashAdvanceRequestId: installmentPaidDto.cashAdvanceId
            },
            data: {
                isPaid: true,
                paidDate: installmentPaidDto.paidDate
            }
        });
    }
};
CashAdvanceService = CashAdvanceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CashAdvanceService);
exports.CashAdvanceService = CashAdvanceService;
//# sourceMappingURL=cash-advance.service.js.map