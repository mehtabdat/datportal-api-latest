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
var LeadsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadsController = void 0;
const common_1 = require("@nestjs/common");
const leads_service_1 = require("./leads.service");
const create_lead_dto_1 = require("./dto/create-lead.dto");
const update_lead_dto_1 = require("./dto/update-lead.dto");
const swagger_1 = require("@nestjs/swagger");
const params_dto_1 = require("./dto/params.dto");
const leads_dto_1 = require("./dto/leads.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const leads_permissions_1 = require("./leads.permissions");
const lead_pagination_dto_1 = require("./dto/lead-pagination.dto");
const lead_sorting_dto_1 = require("./dto/lead-sorting.dto");
const lead_filters_dto_1 = require("./dto/lead-filters.dto");
const lead_status_dto_1 = require("./dto/lead-status.dto");
const system_logger_service_1 = require("../system-logs/system-logger.service");
const assign_leads_dto_1 = require("./dto/assign-leads.dto");
const create_load_note_dto_1 = require("./dto/create-load-note.dto");
const leads_authorization_service_1 = require("./leads.authorization.service");
const platform_express_1 = require("@nestjs/platform-express");
const file_upload_utils_1 = require("../../helpers/file-upload.utils");
const upload_files_dto_1 = require("./dto/upload-files.dto");
const file_management_1 = require("../../helpers/file-management");
const constants_1 = require("../../config/constants");
const common_2 = require("../../helpers/common");
const multerOptionsProtected = (0, file_upload_utils_1.getMulterOptions)({ destination: (0, leads_dto_1.getDynamicUploadPath)("organization"), fileTypes: 'all_files', limit: 50000000 });
const moduleName = "leads";
let LeadsController = LeadsController_1 = class LeadsController {
    constructor(leadsService, authorizationService, systemLogger) {
        this.leadsService = leadsService;
        this.authorizationService = authorizationService;
        this.systemLogger = systemLogger;
        this.logger = new common_1.Logger(LeadsController_1.name);
    }
    async uploadPropertyDocuments(uploadDocuments, files, req) {
        try {
            if (files && files.length > 0) {
                let data = await this.leadsService.handleDocuments(uploadDocuments, files, req.user);
                await (0, file_management_1.uploadFile)(files);
                await (0, common_2.sleep)(1500);
                return { message: `Documents uploaded successfully`, statusCode: 200, data: data };
            }
            else {
                throw Error("No files to upload");
            }
        }
        catch (err) {
            (0, file_upload_utils_1.removeUploadedFiles)(files);
            throw new common_1.HttpException(err.message, err.statusCode = 400);
        }
    }
    async create(createLeadDto) {
        try {
            let data = await this.leadsService.create(createLeadDto);
            return { message: `Your request has been submitted successfully.`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, (err.statusCode) ? err.statusCode : 400);
        }
    }
    async findAll(pagination, sorting, filters, req) {
        try {
            let permissions = await this.authorizationService.findUserPermissionsAgainstSlugs(req.user, [leads_permissions_1.LeadsPermissionSet.READ_ALL]);
            let filtersApplied = this.leadsService.applyFilters(filters, req.user, permissions.readAllLeads);
            let dt = this.leadsService.findAll(pagination, sorting, filtersApplied);
            let tCount = this.leadsService.countTotalRecord(filtersApplied);
            const [data, totalCount] = await Promise.all([dt, tCount]);
            let pageCount = Math.floor(totalCount / pagination.perPage) + ((totalCount % pagination.perPage) === 0 ? 0 : 1);
            return {
                message: `${moduleName}(s) fetched Successfully`, statusCode: 200, data: data,
                meta: {
                    page: pagination.page,
                    perPage: pagination.perPage,
                    total: totalCount,
                    pageCount: pageCount
                }
            };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findCounts(req) {
        try {
            let allPromises = [];
            let responseData = {
                all: 0,
                active: 0,
                confirmed: 0,
                completed: 0,
                unqualified: 0,
                hasConcerns: 0
            };
            let filters = {};
            let permissions = await this.authorizationService.findUserPermissionsAgainstSlugs(req.user, [leads_permissions_1.LeadsPermissionSet.READ_ALL]);
            let allDataFilters = this.leadsService.applyFilters(filters, req.user, permissions.readAllLeads);
            filters = { __status: [constants_1.LeadsStatus.new, constants_1.LeadsStatus.in_progress] };
            let activeDataFilters = this.leadsService.applyFilters(filters, req.user, permissions.readAllLeads);
            filters = { __status: [constants_1.LeadsStatus.confirmed] };
            let confirmedDataFilters = this.leadsService.applyFilters(filters, req.user, permissions.readAllLeads);
            filters = { __status: [constants_1.LeadsStatus.canceled, constants_1.LeadsStatus.invalid_request, constants_1.LeadsStatus.unqualified, constants_1.LeadsStatus.spam] };
            let unQualifiedDataFilters = this.leadsService.applyFilters(filters, req.user, permissions.readAllLeads);
            filters = { __status: [constants_1.LeadsStatus.new, constants_1.LeadsStatus.in_progress], hasConcerns: true };
            let hasConcernsDataFilters = this.leadsService.applyFilters(filters, req.user, permissions.readAllLeads);
            filters = { fetchCompleted: true };
            let completedDataFilters = this.leadsService.applyFilters(filters, req.user, permissions.readAllLeads);
            allPromises.push(this.leadsService.countTotalRecord(allDataFilters).then(data => responseData.all = data).catch(err => { this.logger.error("Some error while counting all records"); }));
            allPromises.push(this.leadsService.countTotalRecord(activeDataFilters).then(data => responseData.active = data).catch(err => { this.logger.error("Some error while counting all active records"); }));
            allPromises.push(this.leadsService.countTotalRecord(confirmedDataFilters).then(data => responseData.confirmed = data).catch(err => { this.logger.error("Some error while counting all confirmed records"); }));
            allPromises.push(this.leadsService.countTotalRecord(unQualifiedDataFilters).then(data => responseData.unqualified = data).catch(err => { this.logger.error("Some error while counting all unqualified records"); }));
            allPromises.push(this.leadsService.countTotalRecord(hasConcernsDataFilters).then(data => responseData.hasConcerns = data).catch(err => { this.logger.error("Some error while counting all records having converns"); }));
            allPromises.push(this.leadsService.countTotalRecord(completedDataFilters).then(data => responseData.completed = data).catch(err => { this.logger.error("Some error while counting all completed records"); }));
            await Promise.all(allPromises);
            return {
                message: `${moduleName}(s) fetched Successfully`, statusCode: 200, data: responseData,
            };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async updateStatus(params, req, leadsStatusDto) {
        try {
            await this.authorizationService.isAuthorizedForLeads(params.id, req.user);
            leadsStatusDto["modifiedById"] = req.user.userId;
            leadsStatusDto["modifiedDate"] = new Date();
            let data = await this.leadsService.updateStatus(params.id, leadsStatusDto);
            return { message: `${moduleName} status updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async assignLead(params, assignLeadsDto, req) {
        try {
            await this.authorizationService.isAuthorizedForLeads(params.id, req.user);
            let data = await this.leadsService.assignLeads(params.id, assignLeadsDto, req.user);
            this.systemLogger.logData({
                tableName: "Leads",
                field: 'id',
                value: params.id,
                actionType: 'ASSIGN_LEADS',
                valueType: "number",
                user: req.user.userId,
                data: assignLeadsDto,
                endPoint: req.originalUrl,
                controllerName: this.constructor.name,
                message: "Leads Assigned"
            });
            return { data: data, statusCode: 200, message: "Leads Assigned Successfully" };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async addNote(params, req, createLeadNoteDto) {
        try {
            await this.authorizationService.isAuthorizedForLeads(params.id, req.user);
            let data = await this.leadsService.addNote(params.id, createLeadNoteDto, req.user);
            return { message: `Note added successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async removeNote(params, req) {
        try {
            await this.authorizationService.isAuthorizedForLeadsNote(params.id, req.user);
            let data = await this.leadsService.removeNote(params.id);
            return { message: `Note deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async removeDocument(params, req) {
        try {
            await this.authorizationService.isAuthorizedForLeadsDocument(params.id, req.user);
            let data = await this.leadsService.removeDocument(params.id);
            return { message: `Document deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findNotes(params, req) {
        try {
            await this.authorizationService.isAuthorizedForLeads(params.id, req.user);
            let data = await this.leadsService.findAllNotes(params.id);
            return { message: `${moduleName} notes  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async markConcernAsResolved(params, req) {
        try {
            await this.authorizationService.isAuthorizedForLeadsNote(params.id, req.user);
            let data = await this.leadsService.markConcernAsResolved(params.id);
            return { message: `Concern has been marked as resolved successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async removeEnquiry(params, req) {
        try {
            await this.authorizationService.isAuthorizedForLeads(params.id, req.user);
            let data = await this.leadsService.removeLead(params.id);
            return { message: `Lead deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findOne(params, req) {
        try {
            await this.authorizationService.isAuthorizedForLeads(params.id, req.user);
            let data = await this.leadsService.findOne(params.id);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async update(params, updateLeadDto, req) {
        try {
            await this.authorizationService.isAuthorizedForLeads(params.id, req.user);
            updateLeadDto["modifiedDate"] = new Date();
            updateLeadDto["modifiedById"] = req.user.userId;
            let data = await this.leadsService.update(params.id, updateLeadDto);
            return { message: `${moduleName}  updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(leads_permissions_1.LeadsPermissionSet.CREATE),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: `Upload Leads Files` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: leads_dto_1.LeadsResponseObject, isArray: false, description: `Returns the uploaded files on success` }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files[]', 20, multerOptionsProtected)),
    (0, common_1.Post)("uploadLeadsDocuments"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [upload_files_dto_1.UploadLeadDocuments,
        Array, Object]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "uploadPropertyDocuments", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(leads_permissions_1.LeadsPermissionSet.CREATE),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: leads_dto_1.LeadsResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_lead_dto_1.CreateLeadDto]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "create", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(leads_permissions_1.LeadsPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName}(s) in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: leads_dto_1.LeadsResponseArray, isArray: false, description: `Return a list of ${moduleName}(s) available` }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [lead_pagination_dto_1.LeadsPaginationDto,
        lead_sorting_dto_1.LeadsSortingDto,
        lead_filters_dto_1.LeadsFiltersDto, Object]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "findAll", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(leads_permissions_1.LeadsPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName}(s) in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: leads_dto_1.LeadsResponseArray, isArray: false, description: `Return a list of ${moduleName}(s) available` }),
    (0, common_1.Get)('getCounts'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "findCounts", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(leads_permissions_1.LeadsPermissionSet.UPDATE_STATUS),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} status` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: leads_dto_1.LeadsResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)('changeStatus/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto, Object, lead_status_dto_1.LeadsStatusDto]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "updateStatus", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(leads_permissions_1.LeadsPermissionSet.ASSIGN_LEADS),
    (0, swagger_1.ApiOperation)({ summary: `Assign Leads to a User` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: leads_dto_1.LeadsResponseObject, isArray: false, description: `Assign leads to a User` }),
    (0, common_1.Patch)('assignLead/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto,
        assign_leads_dto_1.AssignLeadsDto, Object]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "assignLead", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(leads_permissions_1.LeadsPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Add a note to the lead` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: leads_dto_1.LeadsResponseObject, isArray: false, description: `Returns the added note` }),
    (0, common_1.Post)('addNote/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto, Object, create_load_note_dto_1.CreateLeadNoteDto]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "addNote", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(leads_permissions_1.LeadsPermissionSet.DELETE_NOTE),
    (0, swagger_1.ApiOperation)({ summary: `Remove a note` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: leads_dto_1.LeadsResponseObject, isArray: false, description: `Returns the removed note` }),
    (0, common_1.Delete)('removeNote/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "removeNote", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(leads_permissions_1.LeadsPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Remove a note` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: leads_dto_1.LeadsResponseObject, isArray: false, description: `Returns the removed note` }),
    (0, common_1.Delete)('removeDocument/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "removeDocument", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(leads_permissions_1.LeadsPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: leads_dto_1.LeadsResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)('notes/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "findNotes", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(leads_permissions_1.LeadsPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} ` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: leads_dto_1.LeadsResponseObject }),
    (0, common_1.Patch)('markConcernAsResolved/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "markConcernAsResolved", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(leads_permissions_1.LeadsPermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: `Remove a Lead` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: leads_dto_1.LeadsResponseObject, isArray: false, description: `Returns the lead removed` }),
    (0, common_1.Delete)('remove/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "removeEnquiry", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(leads_permissions_1.LeadsPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: leads_dto_1.LeadsResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "findOne", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(leads_permissions_1.LeadsPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: leads_dto_1.LeadsResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto,
        update_lead_dto_1.UpdateLeadDto, Object]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "update", null);
LeadsController = LeadsController_1 = __decorate([
    (0, swagger_1.ApiTags)("leads"),
    (0, common_1.Controller)('leads'),
    __metadata("design:paramtypes", [leads_service_1.LeadsService,
        leads_authorization_service_1.LeadsAuthorizationService,
        system_logger_service_1.SystemLogger])
], LeadsController);
exports.LeadsController = LeadsController;
//# sourceMappingURL=leads.controller.js.map