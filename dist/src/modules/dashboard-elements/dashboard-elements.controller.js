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
var DashboardElementsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardElementsController = void 0;
const common_1 = require("@nestjs/common");
const dashboard_elements_service_1 = require("./dashboard-elements.service");
const create_dashboard_element_dto_1 = require("./dto/create-dashboard-element.dto");
const update_dashboard_element_dto_1 = require("./dto/update-dashboard-element.dto");
const swagger_1 = require("@nestjs/swagger");
const common_types_1 = require("../../common-types/common-types");
const dashboard_element_dto_1 = require("./dto/dashboard-element.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const dashboard_elements_permissions_1 = require("./dashboard-elements.permissions");
const dashboard_element_filters_dto_1 = require("./dto/dashboard-element-filters.dto");
const dashboard_elements_authorization_service_1 = require("./dashboard-elements.authorization.service");
const project_permissions_1 = require("../project/project.permissions");
const constants_1 = require("../../config/constants");
const reimbursement_permissions_1 = require("../reimbursement/reimbursement.permissions");
const cash_advance_permissions_1 = require("../cash-advance/cash-advance.permissions");
const leave_request_permissions_1 = require("../leave-request/leave-request.permissions");
const enquiry_permissions_1 = require("../enquiry/enquiry.permissions");
const moduleName = "dashboard-elements";
let DashboardElementsController = DashboardElementsController_1 = class DashboardElementsController {
    constructor(dashboardElementsService, authorizationService) {
        this.dashboardElementsService = dashboardElementsService;
        this.authorizationService = authorizationService;
        this.logger = new common_1.Logger(DashboardElementsController_1.name);
    }
    async create(createDto) {
        try {
            let data = await this.dashboardElementsService.create(createDto);
            return { message: `${moduleName} created successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findPublished(filters) {
        try {
            let appliedFilters = this.dashboardElementsService.applyFilters(filters);
            appliedFilters = Object.assign(Object.assign({}, appliedFilters), { isPublished: true });
            let data = await this.dashboardElementsService.findAll(appliedFilters);
            return { message: `${moduleName} fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async getDashboardContent(req) {
        try {
            let data = await this.dashboardElementsService.findDashboardElementsOfUser(req.user);
            let elementSlugs = data.map((ele) => ele.DashboardElement.slug);
            let permissionsRequired = [];
            elementSlugs.forEach((ele) => {
                let permission = dashboard_element_dto_1.DashboardElementsSet[ele];
                if (permission && !permissionsRequired.includes(permission)) {
                    permissionsRequired.push(permission);
                }
            });
            let allPromises = [];
            let responseData = {};
            let userPermissions = await this.authorizationService.findUserPermissionsAgainstSlugs(req.user, [...permissionsRequired, project_permissions_1.ProjectPermissionSet.REAL_ALL_PROJECT, reimbursement_permissions_1.ReimbursementPermissionSet.FINANCE_APPROVAL, reimbursement_permissions_1.ReimbursementPermissionSet.HR_APPROVAL, cash_advance_permissions_1.CashAdvancePermissionSet.FINANCE_APPROVAL, cash_advance_permissions_1.CashAdvancePermissionSet.HR_APPROVAL, leave_request_permissions_1.LeaveRequestPermissionSet.HR_APPROVAL, enquiry_permissions_1.EnquiryPermissionSet.READ_ALL]);
            if (userPermissions.readProject) {
                if (elementSlugs.includes(dashboard_element_dto_1.DashboardElementSlugs.active_projects)) {
                    let activeProjectFilters = { isClosed: false };
                    let appliedFilters = this.dashboardElementsService.applyProjectFilters(activeProjectFilters, req.user, userPermissions.readAllProject);
                    allPromises.push(this.dashboardElementsService.findAllProjects(appliedFilters).then((data) => {
                        responseData.active_projects = {
                            fetchFromAPI: false,
                            data: data
                        };
                    }).catch(err => {
                        this.logger.log("Some error while fetching Active Projects", err === null || err === void 0 ? void 0 : err.message);
                    }));
                }
                if (elementSlugs.includes(dashboard_element_dto_1.DashboardElementSlugs.delayed_projects)) {
                    let activeProjectFilters = { isClosed: false, delayed: true };
                    let appliedFilters = this.dashboardElementsService.applyProjectFilters(activeProjectFilters, req.user, userPermissions.readAllProject);
                    allPromises.push(this.dashboardElementsService.findAllProjects(appliedFilters, activeProjectFilters).then((data) => {
                        responseData.delayed_projects = {
                            fetchFromAPI: false,
                            data: data
                        };
                    }).catch(err => {
                        this.logger.log("Some error while fetching Delayed Projects", err === null || err === void 0 ? void 0 : err.message);
                    }));
                }
                if (elementSlugs.includes(dashboard_element_dto_1.DashboardElementSlugs.new_project)) {
                    let _7daysAgo = new Date();
                    _7daysAgo.setDate(_7daysAgo.getDate() - 7);
                    let activeProjectFilters = { isClosed: false, fromDate: _7daysAgo, projectStateSlugs: [constants_1.KnownProjectStatus.new] };
                    let appliedFilters = this.dashboardElementsService.applyProjectFilters(activeProjectFilters, req.user, userPermissions.readAllProject);
                    allPromises.push(this.dashboardElementsService.findAllProjects(appliedFilters, activeProjectFilters).then((data) => {
                        responseData.new_project = {
                            fetchFromAPI: false,
                            data: data
                        };
                    }).catch(err => {
                        this.logger.log("Some error while fetching New Projects", err === null || err === void 0 ? void 0 : err.message);
                    }));
                }
                if (elementSlugs.includes(dashboard_element_dto_1.DashboardElementSlugs.ready_for_submission)) {
                    let activeProjectFilters = { isClosed: false, projectStateSlugs: [constants_1.KnownProjectStatus.ready_for_submission] };
                    let appliedFilters = this.dashboardElementsService.applyProjectFilters(activeProjectFilters, req.user, userPermissions.readAllProject);
                    allPromises.push(this.dashboardElementsService.findAllProjects(appliedFilters, activeProjectFilters).then((data) => {
                        responseData.ready_for_submission = {
                            fetchFromAPI: false,
                            data: data
                        };
                    }).catch(err => {
                        this.logger.log("Some error while fetching Ready for Submission Projects", err === null || err === void 0 ? void 0 : err.message);
                    }));
                }
                if (elementSlugs.includes(dashboard_element_dto_1.DashboardElementSlugs.on_hold_projects)) {
                    let activeProjectFilters = { isClosed: false, onHold: true };
                    let appliedFilters = this.dashboardElementsService.applyProjectFilters(activeProjectFilters, req.user, userPermissions.readAllProject);
                    allPromises.push(this.dashboardElementsService.findAllProjects(appliedFilters, activeProjectFilters).then((data) => {
                        responseData.on_hold_projects = {
                            fetchFromAPI: false,
                            data: data
                        };
                    }).catch(err => {
                        this.logger.log("Some error while fetching Ready for Submission Projects", err === null || err === void 0 ? void 0 : err.message);
                    }));
                }
                if (elementSlugs.includes(dashboard_element_dto_1.DashboardElementSlugs.closed_projects)) {
                    let activeProjectFilters = { isClosed: true };
                    let appliedFilters = this.dashboardElementsService.applyProjectFilters(activeProjectFilters, req.user, userPermissions.readAllProject);
                    allPromises.push(this.dashboardElementsService.findAllProjects(appliedFilters, activeProjectFilters).then((data) => {
                        responseData.closed_projects = {
                            fetchFromAPI: false,
                            data: data
                        };
                    }).catch(err => {
                        this.logger.log("Some error while fetching Ready for Submission Projects", err === null || err === void 0 ? void 0 : err.message);
                    }));
                }
                if (elementSlugs.includes(dashboard_element_dto_1.DashboardElementSlugs.approved_projects)) {
                    let activeProjectFilters = { isClosed: false, projectStateSlugs: [constants_1.KnownProjectStatus.approved] };
                    let appliedFilters = this.dashboardElementsService.applyProjectFilters(activeProjectFilters, req.user, userPermissions.readAllProject);
                    allPromises.push(this.dashboardElementsService.findAllProjects(appliedFilters, activeProjectFilters).then((data) => {
                        responseData.approved_projects = {
                            fetchFromAPI: false,
                            data: data
                        };
                    }).catch(err => {
                        this.logger.log("Some error while fetching Approved Projects", err === null || err === void 0 ? void 0 : err.message);
                    }));
                }
                if (elementSlugs.includes(dashboard_element_dto_1.DashboardElementSlugs.pending_project_as_support_engineer)) {
                    allPromises.push(this.dashboardElementsService.findPendingProject_dashboard(req.user, 'supportEngineers').then((data) => {
                        responseData.pending_project_as_support_engineer = {
                            fetchFromAPI: false,
                            data: data
                        };
                    }).catch(err => {
                        this.logger.log("Some error while fetching Pending Project as Support Enginner", err === null || err === void 0 ? void 0 : err.message);
                    }));
                }
                if (elementSlugs.includes(dashboard_element_dto_1.DashboardElementSlugs.pending_project_as_project_incharge)) {
                    allPromises.push(this.dashboardElementsService.findPendingProject_dashboard(req.user, 'projectIncharge').then((data) => {
                        responseData.pending_project_as_project_incharge = {
                            fetchFromAPI: false,
                            data: data
                        };
                    }).catch(err => {
                        this.logger.log("Some error while fetching Pending Project as Project Incharge", err === null || err === void 0 ? void 0 : err.message);
                    }));
                }
            }
            if (elementSlugs.includes(dashboard_element_dto_1.DashboardElementSlugs.all_tasks)) {
                responseData.all_tasks = {
                    fetchFromAPI: true,
                    data: null
                };
            }
            if (elementSlugs.includes(dashboard_element_dto_1.DashboardElementSlugs.notification)) {
                responseData.notification = {
                    fetchFromAPI: true,
                    data: null
                };
            }
            if (elementSlugs.includes(dashboard_element_dto_1.DashboardElementSlugs.active_quotations)) {
                if (userPermissions.readQuotation) {
                    allPromises.push(this.dashboardElementsService.findActiveQuotation().then((data) => {
                        responseData.active_quotations = {
                            fetchFromAPI: false,
                            data: data
                        };
                    }).catch(err => {
                        this.logger.log("Some error while fetching Active Quotations", err === null || err === void 0 ? void 0 : err.message);
                    }));
                }
            }
            if (elementSlugs.includes(dashboard_element_dto_1.DashboardElementSlugs.permits_expiring)) {
                if (userPermissions.readPermit) {
                    allPromises.push(this.dashboardElementsService.findPermitExpiring().then((data) => {
                        responseData.permits_expiring = {
                            fetchFromAPI: false,
                            data: data
                        };
                    }).catch(err => {
                        this.logger.log("Some error while fetching Expiring Permits", err === null || err === void 0 ? void 0 : err.message);
                    }));
                }
            }
            if (elementSlugs.includes(dashboard_element_dto_1.DashboardElementSlugs.active_employees)) {
                if (userPermissions.readUser) {
                    allPromises.push(this.dashboardElementsService.findActiveEmployees().then((data) => {
                        responseData.active_employees = {
                            fetchFromAPI: false,
                            data: data
                        };
                    }).catch(err => {
                        this.logger.log("Some error while fetching Active Employees", err === null || err === void 0 ? void 0 : err.message);
                    }));
                }
            }
            if (elementSlugs.includes(dashboard_element_dto_1.DashboardElementSlugs.government_fees_to_collect)) {
                if (userPermissions.readTransaction) {
                    allPromises.push(this.dashboardElementsService.findGovernmentFeesToCollect().then((data) => {
                        responseData.government_fees_to_collect = {
                            fetchFromAPI: false,
                            data: data
                        };
                    }).catch(err => {
                        this.logger.log("Some error while fetching Government Fees To Collect", err === null || err === void 0 ? void 0 : err.message);
                    }));
                }
            }
            if (elementSlugs.includes(dashboard_element_dto_1.DashboardElementSlugs.pending_invoices)) {
                if (userPermissions.readInvoice) {
                    allPromises.push(this.dashboardElementsService.findActiveInvoices().then((data) => {
                        responseData.pending_invoices = {
                            fetchFromAPI: false,
                            data: data
                        };
                    }).catch(err => {
                        this.logger.log("Some error while fetching Pending Invoices", err === null || err === void 0 ? void 0 : err.message);
                    }));
                }
            }
            if (elementSlugs.includes(dashboard_element_dto_1.DashboardElementSlugs.active_leads)) {
                if (userPermissions.readLeads) {
                    allPromises.push(this.dashboardElementsService.findActiveLeads().then((data) => {
                        responseData.active_leads = {
                            fetchFromAPI: false,
                            data: data
                        };
                    }).catch(err => {
                        this.logger.log("Some error while fetching Active Leads", err === null || err === void 0 ? void 0 : err.message);
                    }));
                }
            }
            if (elementSlugs.includes(dashboard_element_dto_1.DashboardElementSlugs.active_enquiries)) {
                if (userPermissions.readEnquiry) {
                    allPromises.push(this.dashboardElementsService.findActiveEnquiry(req.user, userPermissions.readAllEnquiry).then((data) => {
                        responseData.active_enquiries = {
                            fetchFromAPI: false,
                            data: data
                        };
                    }).catch(err => {
                        this.logger.log("Some error while fetching Active Enquiries", err === null || err === void 0 ? void 0 : err.message);
                    }));
                }
            }
            if (elementSlugs.includes(dashboard_element_dto_1.DashboardElementSlugs.active_reimbursement)) {
                allPromises.push(this.dashboardElementsService.findActiveReimbursement(req.user, { reimbursementHRApproval: userPermissions.reimbursementHRApproval, reimbursementFinanceApproval: userPermissions.reimbursementFinanceApproval }).then((data) => {
                    responseData.active_reimbursement = {
                        fetchFromAPI: false,
                        data: data
                    };
                }).catch(err => {
                    this.logger.log("Some error while fetching Active Reimbursements", err === null || err === void 0 ? void 0 : err.message);
                }));
            }
            if (elementSlugs.includes(dashboard_element_dto_1.DashboardElementSlugs.active_cash_advance_request)) {
                allPromises.push(this.dashboardElementsService.findActiveCashAdvanceRequest(req.user, { cashAdvanceHRApproval: userPermissions.cashAdvanceHRApproval, cashAdvanceFinanceApproval: userPermissions.cashAdvanceFinanceApproval }).then((data) => {
                    responseData.active_cash_advance_request = {
                        fetchFromAPI: false,
                        data: data
                    };
                }).catch(err => {
                    this.logger.log("Some error while fetching Active Reimbursements", err === null || err === void 0 ? void 0 : err.message);
                }));
            }
            if (elementSlugs.includes(dashboard_element_dto_1.DashboardElementSlugs.active_leave_request)) {
                allPromises.push(this.dashboardElementsService.findActiveLeaveRequest(req.user, { leaveRequestHRApproval: userPermissions.leaveRequestHRApproval }).then((data) => {
                    responseData.active_leave_request = {
                        fetchFromAPI: false,
                        data: data
                    };
                }).catch(err => {
                    this.logger.log("Some error while fetching Active Reimbursements", err === null || err === void 0 ? void 0 : err.message);
                }));
            }
            await Promise.all(allPromises);
            return { message: `Dashboard content fetched Successfully`, statusCode: 200, data: {
                    elements: elementSlugs,
                    content: responseData
                } };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAll(filters) {
        try {
            let appliedFilters = this.dashboardElementsService.applyFilters(filters);
            let data = await this.dashboardElementsService.findAll(appliedFilters);
            return { message: `${moduleName} fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async update(params, updateDto) {
        try {
            let data = await this.dashboardElementsService.update(params.id, updateDto);
            return { message: `${moduleName}  updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async remove(params) {
        try {
            let data = await this.dashboardElementsService.remove(params.id);
            return { message: `${moduleName} deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findOne(params) {
        try {
            let data = await this.dashboardElementsService.findOne(params.id);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(dashboard_elements_permissions_1.DashboardElementPermissionSet.CREATE),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dashboard_element_dto_1.DashboardElementResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_dashboard_element_dto_1.CreateDashboardElementDto]),
    __metadata("design:returntype", Promise)
], DashboardElementsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dashboard_element_dto_1.DashboardElementResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)('find-published'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dashboard_element_filters_dto_1.DashboardElementFilters]),
    __metadata("design:returntype", Promise)
], DashboardElementsController.prototype, "findPublished", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dashboard_element_dto_1.DashboardElementResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)('get-dashboard-content'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardElementsController.prototype, "getDashboardContent", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(dashboard_elements_permissions_1.DashboardElementPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dashboard_element_dto_1.DashboardElementResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dashboard_element_filters_dto_1.DashboardElementFilters]),
    __metadata("design:returntype", Promise)
], DashboardElementsController.prototype, "findAll", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(dashboard_elements_permissions_1.DashboardElementPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dashboard_element_dto_1.DashboardElementResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto,
        update_dashboard_element_dto_1.UpdateDashboardElementDto]),
    __metadata("design:returntype", Promise)
], DashboardElementsController.prototype, "update", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(dashboard_elements_permissions_1.DashboardElementPermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dashboard_element_dto_1.DashboardElementResponseObject, isArray: false, description: `Returns the deleted ${moduleName} object if found on the system` }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], DashboardElementsController.prototype, "remove", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(dashboard_elements_permissions_1.DashboardElementPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dashboard_element_dto_1.DashboardElementResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], DashboardElementsController.prototype, "findOne", null);
DashboardElementsController = DashboardElementsController_1 = __decorate([
    (0, swagger_1.ApiTags)("dashboard-elements"),
    (0, common_1.Controller)('dashboard-elements'),
    __metadata("design:paramtypes", [dashboard_elements_service_1.DashboardElementsService, dashboard_elements_authorization_service_1.DashboardAuthorizationService])
], DashboardElementsController);
exports.DashboardElementsController = DashboardElementsController;
//# sourceMappingURL=dashboard-elements.controller.js.map