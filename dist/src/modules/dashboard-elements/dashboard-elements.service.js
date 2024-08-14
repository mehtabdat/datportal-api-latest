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
var DashboardElementsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardElementsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
const constants_1 = require("../../config/constants");
let DashboardElementsService = DashboardElementsService_1 = class DashboardElementsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(DashboardElementsService_1.name);
    }
    create(createDto) {
        return this.prisma.dashboardElement.create({
            data: createDto,
        })
            .catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    findAll(filters) {
        let records = this.prisma.dashboardElement.findMany({
            where: filters,
            orderBy: {
                id: 'desc'
            }
        });
        return records;
    }
    findOne(id) {
        return this.prisma.dashboardElement.findUnique({
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
        return this.prisma.dashboardElement.findUnique({
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
        return this.prisma.dashboardElement.update({
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
        return this.prisma.dashboardElement.update({
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
            if (filters.isPublished) {
                condition = Object.assign(Object.assign({}, condition), { isPublished: filters.isPublished });
            }
        }
        return condition;
    }
    async findDashboardElementsOfUser(user) {
        let userRole = await this.prisma.role.findFirst({
            where: {
                UserRole: {
                    some: {
                        userId: user.userId
                    }
                },
                DashboardElements: {
                    some: {
                        DashboardElement: {
                            isDeleted: false,
                            isPublished: true
                        }
                    }
                }
            },
            orderBy: {
                level: 'asc'
            }
        });
        if (!userRole) {
            throw {
                message: "No Dashboard Element Found for the given user",
                statusCode: 200
            };
        }
        return this.prisma.roleDashboardElement.findMany({
            where: {
                roleId: userRole.id,
                DashboardElement: {
                    isDeleted: false,
                    isPublished: true
                }
            },
            include: {
                DashboardElement: {
                    select: {
                        slug: true
                    }
                }
            },
            orderBy: {
                order: 'asc'
            }
        });
    }
    applyProjectFilters(filters, user, hasGlobalPermission = false) {
        let condition = {
            isDeleted: false
        };
        if (hasGlobalPermission === false) {
            condition = Object.assign(Object.assign({}, condition), { ProjectMembers: {
                    some: {
                        userId: user.userId
                    }
                } });
        }
        if (Object.entries(filters).length > 0) {
            if (filters.isClosed || (filters === null || filters === void 0 ? void 0 : filters.isClosed) === false) {
                condition = Object.assign(Object.assign({}, condition), { isClosed: filters.isClosed });
            }
            if (filters.onHold) {
                condition = Object.assign(Object.assign({}, condition), { onHold: filters.onHold });
            }
            if (filters.fromDate) {
                condition = Object.assign(Object.assign({}, condition), { addedDate: {
                        gte: filters.fromDate
                    } });
            }
            if (filters.delayed) {
                condition = Object.assign(Object.assign({}, condition), { isClosed: false, endDate: {
                        lt: new Date()
                    } });
            }
            if (filters.projectStateId) {
                condition = Object.assign(Object.assign({}, condition), { projectStateId: filters.projectStateId });
            }
            if (filters.projectStateSlugs) {
                condition = Object.assign(Object.assign({}, condition), { ProjectState: {
                        slug: {
                            in: filters.projectStateSlugs
                        }
                    } });
            }
            if (filters.userIds) {
                if (hasGlobalPermission === false) {
                    if (condition.AND) {
                        if (Array.isArray(condition.AND)) {
                            condition.AND.push({
                                ProjectMembers: {
                                    some: {
                                        userId: user.userId
                                    }
                                }
                            });
                            condition.AND.push({
                                ProjectMembers: {
                                    some: {
                                        userId: {
                                            in: filters.userIds
                                        },
                                        projectRole: (filters.projectRole) ? filters.projectRole : undefined
                                    }
                                }
                            });
                        }
                        else {
                            condition.AND = [
                                condition.AND,
                                {
                                    ProjectMembers: {
                                        some: {
                                            userId: user.userId
                                        }
                                    }
                                },
                                {
                                    ProjectMembers: {
                                        some: {
                                            userId: {
                                                in: filters.userIds
                                            },
                                            projectRole: (filters.projectRole) ? filters.projectRole : undefined
                                        }
                                    }
                                }
                            ];
                        }
                    }
                    else {
                        condition = Object.assign(Object.assign({}, condition), { AND: [
                                {
                                    ProjectMembers: {
                                        some: {
                                            userId: user.userId
                                        }
                                    }
                                },
                                {
                                    ProjectMembers: {
                                        some: {
                                            userId: {
                                                in: filters.userIds
                                            },
                                            projectRole: (filters.projectRole) ? filters.projectRole : undefined
                                        }
                                    }
                                }
                            ] });
                    }
                }
                else {
                    condition = Object.assign(Object.assign({}, condition), { ProjectMembers: {
                            some: {
                                userId: {
                                    in: filters.userIds
                                },
                                projectRole: (filters.projectRole) ? filters.projectRole : undefined
                            },
                        } });
                }
            }
        }
        return condition;
    }
    findAllProjects(filters, rawFilters) {
        return this.prisma.project.findMany({
            where: filters,
            take: 8,
            select: {
                id: true,
                title: true,
                slug: true,
                startDate: true,
                endDate: true,
                priority: true,
                referenceNumber: true,
                comment: true,
                onHold: true,
                ProjectState: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        bgColor: true,
                        textColor: true
                    }
                },
                addedDate: true,
                ProjectType: {
                    select: {
                        title: true,
                        slug: true
                    }
                },
            },
            orderBy: (rawFilters && (rawFilters === null || rawFilters === void 0 ? void 0 : rawFilters.delayed)) ? {
                endDate: 'asc'
            } : {
                addedDate: 'desc'
            }
        });
    }
    findActiveQuotation() {
        return this.prisma.quotation.count({
            where: {
                isDeleted: false,
                status: constants_1.QuotationStatus.submitted
            }
        });
    }
    findActiveLeads() {
        return this.prisma.leads.count({
            where: {
                isDeleted: false,
                status: {
                    in: [constants_1.LeadsStatus.in_progress, constants_1.LeadsStatus.new]
                }
            }
        });
    }
    findActiveEnquiry(user, readAll = false) {
        let condition = {
            isDeleted: false,
            status: constants_1.EnquiryStatus.New
        };
        if (readAll !== true) {
            condition = Object.assign(Object.assign({}, condition), { assignedToId: user.userId });
        }
        return this.prisma.enquiry.count({
            where: condition
        });
    }
    findActiveInvoices() {
        return this.prisma.invoice.count({
            where: {
                isDeleted: false,
                status: {
                    in: [constants_1.InvoiceStatus.generated, constants_1.InvoiceStatus.sent]
                }
            }
        });
    }
    findActiveReimbursement(user, permissions) {
        let condition = {
            isDeleted: false
        };
        let statusCode = [];
        if (permissions.reimbursementHRApproval) {
            statusCode.push(constants_1.ReimbursementStatus.submitted);
        }
        if (permissions.reimbursementFinanceApproval) {
            statusCode.push(constants_1.ReimbursementStatus.approved);
            statusCode.push(constants_1.ReimbursementStatus.partially_approved);
        }
        condition = Object.assign(Object.assign({}, condition), { AND: {
                OR: [
                    {
                        requestById: user.userId,
                        status: {
                            notIn: [constants_1.ReimbursementStatus.paid_and_closed, constants_1.ReimbursementStatus.rejected, constants_1.ReimbursementStatus.withdrawn]
                        }
                    },
                    (statusCode.length > 0) ?
                        {
                            status: {
                                in: statusCode
                            }
                        } : undefined
                ]
            } });
        return this.prisma.reimbursement.count({
            where: condition
        });
    }
    findActiveCashAdvanceRequest(user, permissions) {
        let condition = {};
        let statusCode = [];
        if (permissions.cashAdvanceHRApproval) {
            statusCode.push(constants_1.CashAdvanceRequestStatus.submitted);
        }
        if (permissions.cashAdvanceFinanceApproval) {
            statusCode.push(constants_1.CashAdvanceRequestStatus.approved);
            statusCode.push(constants_1.CashAdvanceRequestStatus.partially_approved);
        }
        condition = Object.assign(Object.assign({}, condition), { AND: {
                OR: [
                    {
                        requestById: user.userId,
                        status: {
                            notIn: [constants_1.CashAdvanceRequestStatus.paid_and_closed, constants_1.CashAdvanceRequestStatus.rejected, constants_1.CashAdvanceRequestStatus.withdrawn]
                        }
                    },
                    (statusCode.length > 0) ?
                        {
                            status: {
                                in: statusCode
                            }
                        } : undefined
                ]
            } });
        return this.prisma.cashAdvanceRequest.count({
            where: condition
        });
    }
    findActiveLeaveRequest(user, permissions) {
        let condition = {};
        let statusCode = [];
        if (permissions.leaveRequestHRApproval) {
            statusCode.push(constants_1.LeaveRequestStatus.in_progress);
        }
        condition = Object.assign(Object.assign({}, condition), { AND: {
                OR: [
                    {
                        requestById: user.userId,
                        status: {
                            in: [constants_1.LeaveRequestStatus.in_progress, constants_1.LeaveRequestStatus.submitted, constants_1.LeaveRequestStatus.request_modification]
                        }
                    },
                    {
                        status: constants_1.LeaveRequestStatus.submitted,
                        RequestBy: {
                            managerId: user.userId
                        }
                    },
                    (statusCode.length > 0) ?
                        {
                            status: {
                                in: statusCode
                            }
                        } : undefined
                ]
            } });
        return this.prisma.leaveRequest.count({
            where: condition
        });
    }
    findPendingProject_dashboard(user, memberType) {
        return this.prisma.project.count({
            where: {
                isDeleted: false,
                isClosed: false,
                ProjectMembers: {
                    some: {
                        userId: user.userId,
                        projectRole: constants_1.ProjectRole[memberType]
                    }
                }
            }
        });
    }
    findPermitExpiring() {
        let after30Days = new Date();
        after30Days.setDate(after30Days.getDate() + 30);
        return this.prisma.permit.count({
            where: {
                isDeleted: false,
                expiryDate: {
                    lte: after30Days,
                    gte: new Date()
                },
            }
        });
    }
    findGovernmentFeesToCollect() {
        return this.prisma.transactions.count({
            where: {
                status: {
                    in: [constants_1.TransactionStatus.sent_to_client, constants_1.TransactionStatus.pending_payment]
                },
                authorityId: { not: null },
                isDeleted: false
            }
        });
    }
    findActiveEmployees() {
        return this.prisma.user.count({
            where: {
                status: constants_1.UserStatus.active,
                isDeleted: false
            }
        });
    }
};
DashboardElementsService = DashboardElementsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardElementsService);
exports.DashboardElementsService = DashboardElementsService;
//# sourceMappingURL=dashboard-elements.service.js.map