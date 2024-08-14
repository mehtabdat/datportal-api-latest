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
var LeaveRequestService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveRequestService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
const user_dto_1 = require("../user/dto/user.dto");
const file_upload_utils_1 = require("../../helpers/file-upload.utils");
const constants_1 = require("../../config/constants");
const common_2 = require("../../helpers/common");
let LeaveRequestService = LeaveRequestService_1 = class LeaveRequestService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(LeaveRequestService_1.name);
    }
    async create(createDto, user) {
        let leaveType = await this.prisma.leaveType.findUniqueOrThrow({
            where: {
                id: createDto.leaveTypeId
            }
        });
        let totalDays = Math.abs((0, common_2.getDifferenceInDays)(createDto.leaveFrom, createDto.leaveTo));
        return this.prisma.leaveRequest.create({
            data: {
                purpose: createDto.purpose,
                leaveFrom: new Date(createDto.leaveFrom),
                leaveTo: new Date(createDto.leaveTo),
                leaveTypeId: createDto.leaveTypeId,
                requestById: user.userId,
                isPaid: leaveType.isPaid,
                totalDays: totalDays,
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
        let records = this.prisma.leaveRequest.findMany({
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
                LeaveType: {
                    select: {
                        id: true,
                        title: true,
                        slug: true
                    }
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
        return this.prisma.leaveRequest.findUnique({
            where: {
                id: id
            },
            include: {
                LeaveType: {
                    select: {
                        id: true,
                        title: true,
                        slug: true
                    }
                },
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
                Attachments: true
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    async projectManagerAction(leaveRequestId, leaveRequestAdminAction, user) {
        var _a, _b;
        let recordData = await this.prisma.leaveRequest.findFirst({
            where: {
                id: leaveRequestId
            },
            include: {
                AdminActions: true
            }
        });
        if (recordData.status === constants_1.LeaveRequestStatus.new) {
            throw {
                message: "Employee has not submitted the request yet",
                statusCode: 400
            };
        }
        if (recordData.status !== constants_1.LeaveRequestStatus.submitted) {
            if (recordData.AdminActions && recordData.AdminActions.length > 0) {
                let otherDept = await this.prisma.adminAction.count({
                    where: {
                        leaveRequestId: leaveRequestId,
                        actionById: {
                            not: user.userId
                        },
                        departmentId: {
                            not: (_a = user.department) === null || _a === void 0 ? void 0 : _a.id
                        }
                    }
                });
                if (otherDept > 0) {
                    throw {
                        message: `This request is already marked as ${(0, common_2.getEnumKeyByEnumValue)(constants_1.LeaveRequestStatus, recordData.status)}. You cannot make any further changes.`,
                        statusCode: 400
                    };
                }
            }
        }
        await this.prisma.adminAction.create({
            data: {
                departmentId: (_b = user.department) === null || _b === void 0 ? void 0 : _b.id,
                status: leaveRequestAdminAction.status,
                comment: leaveRequestAdminAction.comment,
                actionById: user.userId,
                leaveRequestId: leaveRequestId
            }
        });
        let status = (leaveRequestAdminAction.status === constants_1.LeaveRequestStatus.approved) ? constants_1.LeaveRequestStatus.in_progress : leaveRequestAdminAction.status;
        await this.prisma.leaveRequest.update({
            where: {
                id: leaveRequestId
            },
            data: {
                status: status
            }
        });
        return this.findOne(leaveRequestId);
    }
    async hrUpdate(leaveRequestId, leaveRequestAdminAction, user) {
        let recordData = await this.prisma.leaveRequest.findFirst({
            where: {
                id: leaveRequestId
            },
            include: {
                AdminActions: true
            }
        });
        if (recordData.status !== constants_1.LeaveRequestStatus.in_progress) {
            throw {
                message: "This request has to be approved by project manager before you make any action",
                statusCode: 400
            };
        }
        await this.prisma.adminAction.create({
            data: {
                Department: {
                    connect: {
                        id: user.department.id
                    }
                },
                status: leaveRequestAdminAction.status,
                comment: leaveRequestAdminAction.comment,
                ActionBy: {
                    connect: {
                        id: user.userId
                    }
                },
                LeaveRequest: {
                    connect: {
                        id: leaveRequestId
                    }
                }
            }
        });
        let status = leaveRequestAdminAction.status;
        await this.prisma.leaveRequest.update({
            where: {
                id: leaveRequestId
            },
            data: {
                status: status,
                isPaid: (leaveRequestAdminAction.isPaid) ? leaveRequestAdminAction.isPaid : undefined
            }
        });
        return this.findOne(leaveRequestId);
    }
    async withdraw(id) {
        let record = await this.prisma.leaveRequest.findFirst({
            where: {
                id
            }
        });
        if (record.status === constants_1.LeaveRequestStatus.rejected) {
            throw {
                message: "You cannot withdraw your request as the request is already" + (0, common_2.getEnumKeyByEnumValue)(constants_1.LeaveRequestStatus, record.status),
                statuCode: 400
            };
        }
        return this.prisma.leaveRequest.update({
            data: {
                status: constants_1.LeaveRequestStatus.withdrawn
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
    async submitRequest(leaveRequestId) {
        let record = await this.prisma.leaveRequest.findFirst({
            where: {
                id: leaveRequestId
            }
        });
        if (!(record.status === constants_1.LeaveRequestStatus.new || record.status === constants_1.LeaveRequestStatus.request_modification)) {
            throw {
                message: "You have already submitted your request",
                statuCode: 400
            };
        }
        return this.prisma.leaveRequest.update({
            data: {
                status: constants_1.LeaveRequestStatus.submitted
            },
            where: {
                id: leaveRequestId
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    applyFilters(filters, user, permissions) {
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
                            leaveFrom: {
                                gte: new Date(filters.fromDate + "T00:00:00")
                            }
                        },
                        {
                            leaveFrom: {
                                lte: new Date(filters.toDate + "T23:59:59")
                            }
                        }
                    ] });
            }
            else {
                if (filters.fromDate) {
                    condition = Object.assign(Object.assign({}, condition), { leaveFrom: { gte: new Date(filters.fromDate + "T00:00:00") } });
                }
                if (filters.toDate) {
                    condition = Object.assign(Object.assign({}, condition), { leaveFrom: { lte: new Date(filters.toDate + "T23:59:59") } });
                }
            }
        }
        if (filters.fetchOpenRequest && permissions && Object.entries(filters).length > 0) {
            let statusCode = [];
            if (permissions.leaveRequestHRApproval) {
                statusCode.push(constants_1.LeaveRequestStatus.in_progress);
            }
            condition = Object.assign(Object.assign({}, condition), { AND: {
                    OR: [
                        {
                            status: {
                                in: statusCode
                            }
                        },
                        {
                            status: constants_1.LeaveRequestStatus.submitted,
                            RequestBy: {
                                managerId: user.userId
                            }
                        }
                    ]
                } });
        }
        else {
            if (!(permissions === null || permissions === void 0 ? void 0 : permissions.leaveRequestHRApproval)) {
                condition = Object.assign(Object.assign({}, condition), { AND: {
                        OR: [
                            {
                                RequestBy: {
                                    managerId: user.userId
                                }
                            },
                            {
                                RequestBy: {
                                    id: user.userId
                                }
                            }
                        ]
                    } });
            }
        }
        return condition;
    }
    countRecords(filters) {
        return this.prisma.leaveRequest.count({
            where: filters
        });
    }
    async handleFiles(leaveRequestId, files) {
        let insertData = [];
        files.forEach((ele, index) => {
            let newRecord = {
                title: ele.filename,
                mimeType: ele.mimetype,
                file: (0, file_upload_utils_1.extractRelativePathFromFullPath)(ele.path),
                leaveRequestId: leaveRequestId
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
    async getLeaveInfo(leaveRequestInfoDto, user) {
        let leaveTypeData = await this.prisma.leaveType.findUniqueOrThrow({
            where: {
                id: leaveRequestInfoDto.leaveTypeId
            }
        });
        if (leaveTypeData.slug === constants_1.LeaveType['annual-leave']) {
        }
    }
    async findLeavesReport(userId) {
        let paidLeaves = await this.prisma.leaveRequest.aggregate({
            _sum: {
                totalDays: true
            },
            where: {
                status: constants_1.LeaveRequestStatus.approved,
                isPaid: true,
                requestById: userId
            }
        });
        let unpaidLeaves = await this.prisma.leaveRequest.aggregate({
            _sum: {
                totalDays: true
            },
            where: {
                status: constants_1.LeaveRequestStatus.approved,
                isPaid: false,
                requestById: userId
            }
        });
        let totalLeaveCredits = await this.prisma.leaveCredits.aggregate({
            where: {
                userId: userId,
                isDeleted: false
            },
            _sum: {
                daysCount: true
            }
        });
        return {
            paidLeaves: paidLeaves._sum.totalDays,
            unpaidLeaves: unpaidLeaves._sum.totalDays,
            totalLeaveCredits: totalLeaveCredits._sum.daysCount,
            remainingLeaves: totalLeaveCredits._sum.daysCount - paidLeaves._sum.totalDays
        };
    }
};
LeaveRequestService = LeaveRequestService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LeaveRequestService);
exports.LeaveRequestService = LeaveRequestService;
//# sourceMappingURL=leave-request.service.js.map