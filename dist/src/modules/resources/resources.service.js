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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourcesService = void 0;
const common_1 = require("@nestjs/common");
const authorization_service_1 = require("../../authorization/authorization.service");
const constants_1 = require("../../config/constants");
const prisma_service_1 = require("../../prisma.service");
const reimbursement_permissions_1 = require("../reimbursement/reimbursement.permissions");
const car_reservation_request_permissions_1 = require("../car-reservation/car-reservation-request.permissions");
const cash_advance_permissions_1 = require("../cash-advance/cash-advance.permissions");
const leave_request_permissions_1 = require("../leave-request/leave-request.permissions");
const biometrics_job_permissions_1 = require("../biometrics-job/biometrics-job.permissions");
const invoice_permissions_1 = require("../invoice/invoice.permissions");
const organization_permissions_1 = require("../organization/organization.permissions");
const quotation_permissions_1 = require("../quotation/quotation.permissions");
const project_permissions_1 = require("../project/project.permissions");
const task_permissions_1 = require("../task/task.permissions");
const user_permissions_1 = require("../user/user.permissions");
const leads_permissions_1 = require("../leads/leads.permissions");
const enquiry_permissions_1 = require("../enquiry/enquiry.permissions");
const transactions_permissions_1 = require("../transactions/transactions.permissions");
let ResourcesService = class ResourcesService extends authorization_service_1.AuthorizationService {
    constructor(prisma) {
        super(prisma);
        this.prisma = prisma;
    }
    async checkResourcePermission(user, key, resourceType) {
        switch (resourceType) {
            case 'car-reservation-request': return this.carReservationRequestFilePermission(user, key);
            case "biometrics-bulk-upload":
                return this.biometricsBulkUploadFilePermission(user, key);
                ;
            case "cash-advance":
                return this.cashAdvanceRequestFilePermission(user, key);
                ;
            case "invoice":
                return this.invoiceFilePermission(user, key);
                ;
            case "leave-request":
                return this.leaveRequestFilePermission(user, key);
                ;
            case "organization":
                return this.organizationFilePermission(user, key);
                ;
            case "projects":
                return this.projectsFilePermission(user, key);
                ;
            case "quotation":
                return this.quotationtFilePermission(user, key);
                ;
            case "reimbursements":
                return this.reimbursementFilePermission(user, key);
                ;
            case "task":
                return this.taskFilePermission(user, key);
                ;
            case "user":
                return this.userFilePermission(user, key);
                ;
            case "enquiry": return this.enquiryFilePermission(user, key);
            case "permits": return this.projectsFilePermission(user, key);
            case "transaction": return this.transactionFilePermission(user, key);
            case 'selfie': return true;
            case 'payroll': return true;
            default: throw {
                message: "Could not determine resource type.",
                statusCode: 400
            };
        }
    }
    async carReservationRequestFilePermission(user, filePath) {
        if (user.roles.slugs.includes(constants_1.SUPER_ADMIN)) {
            return true;
        }
        let permissions = await this.findUserPermissionsAgainstSlugs(user, [car_reservation_request_permissions_1.CarReservationRequestPermissionSet.HR_APPROVAL]);
        if (permissions.carReservationRequestHRApproval)
            return true;
        let record = await this.prisma.carReservationRequest.findFirst({
            where: {
                Attachments: { some: { file: filePath } },
                requestById: user.userId
            },
            select: { id: true }
        });
        if (record)
            return true;
        throw {
            message: "Forbidden resource",
            statusCode: 403
        };
    }
    async biometricsBulkUploadFilePermission(user, filePath) {
        if (user.roles.slugs.includes(constants_1.SUPER_ADMIN)) {
            return true;
        }
        let permissions = await this.findUserPermissionsAgainstSlugs(user, [biometrics_job_permissions_1.BiometricsJobPermissionSet.READ]);
        if (permissions.readBiometricsJob) {
            return true;
        }
        throw {
            message: "Forbidden resource",
            statusCode: 403
        };
    }
    async cashAdvanceRequestFilePermission(user, filePath) {
        if (user.roles.slugs.includes(constants_1.SUPER_ADMIN)) {
            return true;
        }
        let permissions = await this.findUserPermissionsAgainstSlugs(user, [cash_advance_permissions_1.CashAdvancePermissionSet.HR_APPROVAL, cash_advance_permissions_1.CashAdvancePermissionSet.FINANCE_APPROVAL]);
        if (permissions.cashAdvanceFinanceApproval || permissions.cashAdvanceHRApproval) {
            return true;
        }
        let record = await this.prisma.cashAdvanceRequest.findFirst({
            where: {
                Attachments: { some: { file: filePath } },
                requestById: user.userId
            },
            select: { id: true }
        });
        if (record) {
            return true;
        }
        throw {
            message: "Forbidden resource",
            statusCode: 403
        };
    }
    async invoiceFilePermission(user, filePath) {
        if (user.roles.slugs.includes(constants_1.SUPER_ADMIN)) {
            return true;
        }
        let permissions = await this.findUserPermissionsAgainstSlugs(user, [invoice_permissions_1.InvoicePermissionSet.READ]);
        if (permissions.readInvoice) {
            return true;
        }
        throw {
            message: "Forbidden resource",
            statusCode: 403
        };
    }
    async transactionFilePermission(user, filePath) {
        if (user.roles.slugs.includes(constants_1.SUPER_ADMIN)) {
            return true;
        }
        let permissions = await this.findUserPermissionsAgainstSlugs(user, [transactions_permissions_1.TransactionPermissionSet.READ]);
        if (permissions.readTransaction) {
            return true;
        }
        throw {
            message: "Forbidden resource",
            statusCode: 403
        };
    }
    async leaveRequestFilePermission(user, filePath) {
        var _a;
        if (user.roles.slugs.includes(constants_1.SUPER_ADMIN)) {
            return true;
        }
        let permissions = await this.findUserPermissionsAgainstSlugs(user, [leave_request_permissions_1.LeaveRequestPermissionSet.HR_APPROVAL]);
        if (permissions.leaveRequestHRApproval) {
            return true;
        }
        let record = await this.prisma.leaveRequest.findFirst({
            where: {
                Attachments: {
                    some: {
                        file: filePath
                    }
                }
            },
            select: {
                requestById: true,
                RequestBy: {
                    select: {
                        id: true,
                        managerId: true
                    }
                }
            }
        });
        if (!record) {
            throw {
                message: "Record Not Found",
                statusCode: 404
            };
        }
        if (record.requestById === user.userId)
            return true;
        if (user.userId === ((_a = record.RequestBy) === null || _a === void 0 ? void 0 : _a.managerId)) {
            return true;
        }
        throw {
            message: "Forbidden resource",
            statusCode: 403
        };
    }
    async organizationFilePermission(user, filePath) {
        if (user.roles.slugs.includes(constants_1.SUPER_ADMIN)) {
            return true;
        }
        let permissions = await this.findUserPermissionsAgainstSlugs(user, [organization_permissions_1.OrganizationPermissionSet.READ]);
        if (permissions.readOrganization) {
            return true;
        }
        throw {
            message: "Forbidden resource",
            statusCode: 403
        };
    }
    async projectsFilePermission(user, filePath) {
        if (user.roles.slugs.includes(constants_1.SUPER_ADMIN)) {
            return true;
        }
        let permissions = await this.findUserPermissionsAgainstSlugs(user, [project_permissions_1.ProjectPermissionSet.REAL_ALL_PROJECT]);
        if (permissions.readAllProject) {
            return true;
        }
        let record = await this.prisma.project.findFirst({
            where: {
                Resources: { some: { path: {
                            equals: filePath,
                            mode: 'insensitive'
                        } } },
                AND: {
                    OR: [
                        { ProjectMembers: { some: { userId: user.userId } } },
                        { addedById: user.userId }
                    ]
                }
            },
            select: { id: true }
        });
        if (record)
            return true;
        throw {
            message: "Forbidden resource",
            statusCode: 403
        };
    }
    async quotationtFilePermission(user, filePath) {
        if (user.roles.slugs.includes(constants_1.SUPER_ADMIN)) {
            return true;
        }
        let permissions = await this.findUserPermissionsAgainstSlugs(user, [quotation_permissions_1.QuotationPermissionSet.READ]);
        if (permissions.readQuotation)
            return true;
        throw {
            message: "Forbidden resource",
            statusCode: 403
        };
    }
    async reimbursementFilePermission(user, filePath) {
        if (user.roles.slugs.includes(constants_1.SUPER_ADMIN)) {
            return true;
        }
        let permissions = await this.findUserPermissionsAgainstSlugs(user, [reimbursement_permissions_1.ReimbursementPermissionSet.FINANCE_APPROVAL, reimbursement_permissions_1.ReimbursementPermissionSet.HR_APPROVAL]);
        if (permissions.reimbursementFinanceApproval || permissions.reimbursementHRApproval) {
            return true;
        }
        let record = await this.prisma.reimbursement.findFirst({
            where: {
                ReimbursementReceipt: { some: { file: filePath } },
                requestById: user.userId
            },
            select: { id: true }
        });
        if (record)
            return true;
        throw {
            message: "Forbidden resource",
            statusCode: 403
        };
    }
    async taskFilePermission(user, filePath) {
        if (user.roles.slugs.includes(constants_1.SUPER_ADMIN)) {
            return true;
        }
        let permissions = await this.findUserPermissionsAgainstSlugs(user, [task_permissions_1.TaskPermissionSet.READ_ALL_TASK, task_permissions_1.TaskPermissionSet.TECH_SUPPORT]);
        if (permissions.readAllTask) {
            return true;
        }
        if (permissions.manageTechSupportTask) {
            let record = await this.prisma.task.findFirst({
                where: {
                    type: constants_1.TaskType.techSupport,
                    Resources: { some: { path: {
                                equals: filePath,
                                mode: 'insensitive'
                            } } }
                },
                select: { id: true }
            });
            if (record)
                return true;
        }
        let record = await this.prisma.task.findFirst({
            where: {
                Resources: { some: { path: {
                            equals: filePath,
                            mode: 'insensitive'
                        } } },
                AND: {
                    OR: [
                        { TaskMembers: { some: { userId: user.userId } } },
                        { addedById: user.userId }
                    ]
                }
            },
            select: { id: true }
        });
        if (record)
            return true;
        throw {
            message: "Forbidden resource",
            statusCode: 403
        };
    }
    async userFilePermission(user, filePath) {
        if (user.roles.slugs.includes(constants_1.SUPER_ADMIN)) {
            return true;
        }
        let permissions = await this.findUserPermissionsAgainstSlugs(user, [user_permissions_1.UserPermissionSet.MANAGE_ALL]);
        if (permissions.manageAllUser) {
            return true;
        }
        let record = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { id: user.userId },
                    { managerId: user.userId }
                ]
            },
            select: { id: true }
        });
        if (record)
            return true;
        throw {
            message: "Forbidden resource",
            statusCode: 403
        };
    }
    async enquiryFilePermission(user, filePath) {
        if (user.roles.slugs.includes(constants_1.SUPER_ADMIN)) {
            return true;
        }
        let permissions = await this.findUserPermissionsAgainstSlugs(user, [project_permissions_1.ProjectPermissionSet.READ, leads_permissions_1.LeadsPermissionSet.READ, enquiry_permissions_1.EnquiryPermissionSet.READ]);
        if (permissions.readProject || permissions.readEnquiry || permissions.readLeads) {
            return true;
        }
        throw {
            message: "Forbidden resource",
            statusCode: 403
        };
    }
};
ResourcesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ResourcesService);
exports.ResourcesService = ResourcesService;
//# sourceMappingURL=resources.service.js.map