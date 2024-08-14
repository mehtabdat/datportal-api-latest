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
var ReimbursementService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReimbursementService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
const user_dto_1 = require("../user/dto/user.dto");
const file_upload_utils_1 = require("../../helpers/file-upload.utils");
const constants_1 = require("../../config/constants");
const common_2 = require("../../helpers/common");
let ReimbursementService = ReimbursementService_1 = class ReimbursementService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(ReimbursementService_1.name);
    }
    create(createDto, user) {
        let totalAmount = 0;
        createDto.reimbursementReceipts.forEach((ele) => {
            totalAmount += ele.claimedAmount;
        });
        return this.prisma.reimbursement.create({
            data: {
                purpose: createDto.purpose,
                claimedAmount: totalAmount,
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
        let records = this.prisma.reimbursement.findMany({
            where: filters,
            skip: skip,
            take: take,
            include: {
                _count: {
                    select: {
                        AdminActions: true,
                        ReimbursementReceipt: true
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
        return this.prisma.reimbursement.findUnique({
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
                ReimbursementReceipt: true
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    async hrUpdate(reimbursementId, reimbursementHrAction, user) {
        let allReceipts = await this.prisma.reimbursement.findFirst({
            where: {
                id: reimbursementId
            },
            include: {
                ReimbursementReceipt: true,
                AdminActions: true
            }
        });
        if (allReceipts.status !== constants_1.ReimbursementStatus.submitted) {
            if (allReceipts.AdminActions && allReceipts.AdminActions.length > 0) {
                let otherDept = await this.prisma.adminAction.count({
                    where: {
                        reimbursementId: reimbursementId,
                        actionById: {
                            not: user.userId
                        },
                        Department: {
                            NOT: {
                                slug: constants_1.Departments.hr
                            }
                        }
                    }
                });
                if (otherDept > 0) {
                    throw {
                        message: `This reimbursement is already marked as ${(0, common_2.getEnumKeyByEnumValue)(constants_1.ReimbursementStatus, allReceipts.status)}. You cannot make any further changes.`,
                        statusCode: 400
                    };
                }
            }
            throw {
                message: `This reimbursement has been marked as ${(0, common_2.getEnumKeyByEnumValue)(constants_1.ReimbursementStatus, allReceipts.status)} by HR department already. If you want to make any changes on your action, kindly reset and continue.`,
                statusCode: 400
            };
        }
        let allProvidedReceitsId = reimbursementHrAction.reimbursementReceipts.map((ele) => ele.receiptId);
        let receiptData = await this.prisma.reimbursementReceipt.count({
            where: {
                id: {
                    in: allProvidedReceitsId
                },
                reimbursementId: reimbursementId
            }
        });
        if (receiptData !== allReceipts.ReimbursementReceipt.length) {
            throw {
                message: "Partial information Provided. Please provide all receipt action to make the changes",
                statusCode: 400
            };
        }
        let allUpdatedRecord = [];
        let totalAmount = 0;
        reimbursementHrAction.reimbursementReceipts.forEach((ele) => {
            let current = allReceipts.ReimbursementReceipt.find((rect) => ele.receiptId === rect.id);
            if (!current) {
                return;
            }
            let status = ele.status;
            let approvedAmount = ele.approvedAmount;
            if (status === constants_1.ReimbursementStatus.approved || status === constants_1.ReimbursementStatus.partially_approved) {
                totalAmount += ele.approvedAmount;
                if (ele.approvedAmount !== current.claimedAmount) {
                    status = constants_1.ReimbursementStatus.partially_approved;
                }
            }
            else {
                approvedAmount = 0;
            }
            let t = this.prisma.reimbursementReceipt.update({
                where: {
                    id: ele.receiptId,
                    reimbursementId: reimbursementId
                },
                data: {
                    status: status,
                    approvedAmount: approvedAmount,
                    comment: ele.comment,
                    addedDate: new Date(),
                }
            });
            allUpdatedRecord.push(t);
        });
        let reimStatus;
        if (totalAmount === 0) {
            reimStatus = constants_1.ReimbursementStatus.rejected;
        }
        else if (totalAmount === allReceipts.claimedAmount) {
            reimStatus = constants_1.ReimbursementStatus.approved;
        }
        else {
            reimStatus = constants_1.ReimbursementStatus.partially_approved;
        }
        let r = this.prisma.reimbursement.update({
            where: {
                id: reimbursementId
            },
            data: {
                status: reimStatus,
                approvedAmount: totalAmount
            }
        });
        allUpdatedRecord.push(r);
        let actionData = this.prisma.adminAction.create({
            data: {
                Department: {
                    connect: {
                        slug: constants_1.Departments.hr
                    }
                },
                status: reimStatus,
                ActionBy: {
                    connect: {
                        id: user.userId
                    }
                },
                comment: reimbursementHrAction.comment,
                Reimbursement: {
                    connect: {
                        id: reimbursementId
                    }
                },
                addedDate: new Date()
            }
        });
        allUpdatedRecord.push(actionData);
        await Promise.all(allUpdatedRecord);
        return this.findOne(reimbursementId);
    }
    async financeUpdate(reimbursementId, reimbursementAction, user) {
        let recordData = await this.prisma.reimbursement.findUniqueOrThrow({
            where: {
                id: reimbursementId
            }
        });
        if (recordData.status === constants_1.ReimbursementStatus.rejected) {
            throw {
                message: "This reimbursement has been rejected already, you cannot make any further actions",
                statusCode: 400
            };
        }
        else if (recordData.status === constants_1.ReimbursementStatus.paid_and_closed) {
            throw {
                message: "This reimbursement has been paid and closed already, you cannot make any further actions",
                statusCode: 400
            };
        }
        else if (!(recordData.status === constants_1.ReimbursementStatus.approved || recordData.status === constants_1.ReimbursementStatus.partially_approved)) {
            throw {
                message: "This reimbursement has not been aproved by HR yet. You can approve/reject only after HR approval",
                statusCode: 400
            };
        }
        await this.prisma.adminAction.create({
            data: {
                Department: {
                    connect: {
                        slug: constants_1.Departments.finance
                    }
                },
                status: (reimbursementAction.status === constants_1.ReimbursementStatus.paid_and_closed) ? constants_1.ActionStatus.Approved : constants_1.ActionStatus.Rejected,
                ActionBy: {
                    connect: {
                        id: user.userId
                    }
                },
                Reimbursement: {
                    connect: {
                        id: reimbursementId
                    }
                },
                comment: reimbursementAction.comment,
                addedDate: new Date()
            }
        });
        let updatedRecord = await this.prisma.reimbursement.update({
            where: {
                id: reimbursementId
            },
            include: {
                AdminActions: {
                    include: {
                        ActionBy: {
                            select: user_dto_1.UserDefaultAttributes
                        }
                    }
                },
                ReimbursementReceipt: true
            },
            data: {
                status: reimbursementAction.status
            }
        });
        return updatedRecord;
    }
    async withdraw(id) {
        let record = await this.prisma.reimbursement.findFirst({
            where: {
                id
            }
        });
        if (record.status == constants_1.ReimbursementStatus.paid_and_closed || record.status === constants_1.ReimbursementStatus.rejected) {
            throw {
                message: "You cannot withdraw your request as the reimbursement is already" + (0, common_2.getEnumKeyByEnumValue)(constants_1.ReimbursementStatus, record.status),
                statuCode: 400
            };
        }
        return this.prisma.reimbursement.update({
            data: {
                status: constants_1.ReimbursementStatus.withdrawn
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
    remove(id) {
        return this.prisma.reimbursement.update({
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
    applyFilters(filters, permissions) {
        let condition = {
            isDeleted: false
        };
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
            if (permissions.reimbursementHRApproval) {
                statusCode.push(constants_1.ReimbursementStatus.submitted);
            }
            if (permissions.reimbursementFinanceApproval) {
                statusCode.push(constants_1.ReimbursementStatus.approved);
                statusCode.push(constants_1.ReimbursementStatus.partially_approved);
            }
            condition = Object.assign(Object.assign({}, condition), { status: {
                    in: statusCode
                } });
        }
        return condition;
    }
    countRecords(filters) {
        return this.prisma.reimbursement.count({
            where: filters
        });
    }
    async handleFiles(reimbursementId, reimbursementReceipts, files, user) {
        let insertData = [];
        reimbursementReceipts.forEach((ele, index) => {
            var _a, _b;
            if (!files['reimbursementReceipts[' + index + "][file]"]) {
                return;
            }
            let newRecord = {
                title: reimbursementReceipts[index].title,
                claimedAmount: reimbursementReceipts[index].claimedAmount,
                mimeType: (_a = files['reimbursementReceipts[' + index + "][file]"][0]) === null || _a === void 0 ? void 0 : _a.mimetype,
                file: (0, file_upload_utils_1.extractRelativePathFromFullPath)((_b = files['reimbursementReceipts[' + index + "][file]"][0]) === null || _b === void 0 ? void 0 : _b.path),
                status: constants_1.ActionStatus['New / No Action Yet'],
                reimbursementId: reimbursementId
            };
            insertData.push(newRecord);
        });
        if (insertData.length > 0) {
            await this.prisma.reimbursementReceipt.createMany({
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
};
ReimbursementService = ReimbursementService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReimbursementService);
exports.ReimbursementService = ReimbursementService;
//# sourceMappingURL=reimbursement.service.js.map