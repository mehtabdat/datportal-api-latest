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
var EnquiryController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnquiryController = void 0;
const common_1 = require("@nestjs/common");
const enquiry_service_1 = require("./enquiry.service");
const create_enquiry_dto_1 = require("./dto/create-enquiry.dto");
const update_enquiry_dto_1 = require("./dto/update-enquiry.dto");
const swagger_1 = require("@nestjs/swagger");
const common_types_1 = require("../../common-types/common-types");
const enquiry_dto_1 = require("./dto/enquiry.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const enquiry_permissions_1 = require("./enquiry.permissions");
const enquiry_filters_dto_1 = require("./dto/enquiry-filters.dto");
const public_metadata_1 = require("../../authentication/public-metadata");
const enquiry_status_dto_1 = require("./dto/enquiry-status.dto");
const system_logger_service_1 = require("../system-logs/system-logger.service");
const helpers_1 = require("../../helpers/helpers");
const create_enquiry_note_dto_1 = require("./dto/create-enquiry-note.dto");
const assign_enquiry_dto_1 = require("./dto/assign-enquiry.dto");
const enquiry_authorization_service_1 = require("./enquiry.authorization.service");
const auto_create_lead_from_enquiry_dto_1 = require("./dto/auto-create-lead-from-enquiry.dto");
const platform_express_1 = require("@nestjs/platform-express");
const file_upload_utils_1 = require("../../helpers/file-upload.utils");
const upload_files_dto_1 = require("./dto/upload-files.dto");
const file_management_1 = require("../../helpers/file-management");
const constants_1 = require("../../config/constants");
const multerOptionsProtected = (0, file_upload_utils_1.getMulterOptions)({ destination: (0, enquiry_dto_1.getDynamicUploadPath)("organization"), fileTypes: 'all_files', limit: 10000000 });
const moduleName = "enquiry";
let EnquiryController = EnquiryController_1 = class EnquiryController {
    constructor(enquiryService, authorizationService, systemLogger) {
        this.enquiryService = enquiryService;
        this.authorizationService = authorizationService;
        this.systemLogger = systemLogger;
        this.logger = new common_1.Logger(EnquiryController_1.name);
    }
    async uploadPropertyDocuments(enquiryDocuments, files, req) {
        try {
            if (files && files.length > 0) {
                let data = await this.enquiryService.handleDocuments(enquiryDocuments, files, req.user);
                await (0, file_management_1.uploadFile)(files);
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
    async create(createLeadDto, req) {
        try {
            if (!createLeadDto.email && !createLeadDto.phone) {
                throw { message: "Either phone or email must be provided", statusCode: 400 };
            }
            createLeadDto['addedById'] = req.user.userId;
            let data = await this.enquiryService.create(createLeadDto);
            return { message: `Your request has been submitted successfully.`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, (err.statusCode) ? err.statusCode : 400);
        }
    }
    async createEnquiry(createLeadDto, req) {
        try {
            if (!createLeadDto.email && !createLeadDto.phone) {
                throw { message: "Either phone or email must be provided", statusCode: 400 };
            }
            let hasRequestedAlready = await this.enquiryService.checkIfAlreadyRequested(createLeadDto);
            let userAgent = req.headers["user-agent"];
            let clientIPAddress = (0, helpers_1.findClientIpAddress)(req);
            let requestType = await this.enquiryService.isFalseRequest(clientIPAddress, userAgent);
            createLeadDto["userAgent"] = userAgent;
            createLeadDto["userIP"] = clientIPAddress;
            if (requestType.canActivate !== true) {
                throw {
                    statusCode: 400,
                    message: requestType.message,
                    data: {
                        waitTime: requestType.waitTime
                    }
                };
            }
            if (hasRequestedAlready) {
                let logger = new common_1.Logger(EnquiryController_1.name);
                logger.error("From: " + this.constructor.name + " \n Error message : User has already submitted a request. \n User Request Data: " + JSON.stringify(createLeadDto));
                return {
                    message: "You have already made a request. Our representitive will be in touch with you within 24 hours. Thank You!",
                    statusCode: 200,
                    data: {
                        name: hasRequestedAlready.name,
                        email: hasRequestedAlready.email,
                        phone: hasRequestedAlready.phone,
                        phoneCode: hasRequestedAlready.phoneCode
                    }
                };
            }
            let data = await this.enquiryService.create(createLeadDto);
            return { message: `Your request has been submitted successfully.`, statusCode: 200, data: {} };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, (err.statusCode) ? err.statusCode : 400);
        }
    }
    async autoCreateUsingEnquiry(createLeadDto, req) {
        try {
            await this.authorizationService.isAuthorizedForEnquiry(createLeadDto.enquiryId, req.user);
            let data = await this.enquiryService.autoCreateLeadUsingEnquiry(createLeadDto, req.user);
            return { message: `Lead has been created using the enquiry data successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, (err.statusCode) ? err.statusCode : 400);
        }
    }
    async findAll(pagination, filters, req) {
        try {
            let permissions = await this.authorizationService.findUserPermissionsAgainstSlugs(req.user, [enquiry_permissions_1.EnquiryPermissionSet.READ_ALL]);
            let filtersApplied = this.enquiryService.applyFilters(filters, req.user, permissions.readAllEnquiry);
            let dt = this.enquiryService.findAll(pagination, filtersApplied);
            let tCount = this.enquiryService.countTotalRecord(filtersApplied);
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
                qualified: 0,
                unqualified: 0,
                hasConcerns: 0,
                spam: 0
            };
            let filters = {};
            let permissions = await this.authorizationService.findUserPermissionsAgainstSlugs(req.user, [enquiry_permissions_1.EnquiryPermissionSet.READ_ALL]);
            let allDataFilters = this.enquiryService.applyFilters(filters, req.user, permissions.readAllEnquiry);
            filters = { status: constants_1.EnquiryStatus.New };
            let activeDataFilters = this.enquiryService.applyFilters(filters, req.user, permissions.readAllEnquiry);
            filters = { status: constants_1.EnquiryStatus.Qualified };
            let qualifiedDataFilters = this.enquiryService.applyFilters(filters, req.user, permissions.readAllEnquiry);
            filters = { status: constants_1.EnquiryStatus.Unqualified };
            let unQualifiedDataFilters = this.enquiryService.applyFilters(filters, req.user, permissions.readAllEnquiry);
            filters = { status: constants_1.EnquiryStatus.New, hasConcerns: true };
            let hasConcernsDataFilters = this.enquiryService.applyFilters(filters, req.user, permissions.readAllEnquiry);
            filters = { status: constants_1.EnquiryStatus.Spam };
            let spamDataFilters = this.enquiryService.applyFilters(filters, req.user, permissions.readAllEnquiry);
            allPromises.push(this.enquiryService.countTotalRecord(allDataFilters).then(data => responseData.all = data).catch(err => { this.logger.error("Some error while counting all records"); }));
            allPromises.push(this.enquiryService.countTotalRecord(activeDataFilters).then(data => responseData.active = data).catch(err => { this.logger.error("Some error while counting all active records"); }));
            allPromises.push(this.enquiryService.countTotalRecord(qualifiedDataFilters).then(data => responseData.qualified = data).catch(err => { this.logger.error("Some error while counting all qualified records"); }));
            allPromises.push(this.enquiryService.countTotalRecord(unQualifiedDataFilters).then(data => responseData.unqualified = data).catch(err => { this.logger.error("Some error while counting all unqualified records"); }));
            allPromises.push(this.enquiryService.countTotalRecord(hasConcernsDataFilters).then(data => responseData.hasConcerns = data).catch(err => { this.logger.error("Some error while counting all records having converns"); }));
            allPromises.push(this.enquiryService.countTotalRecord(spamDataFilters).then(data => responseData.spam = data).catch(err => { this.logger.error("Some error while counting all spam records"); }));
            await Promise.all(allPromises);
            return {
                message: `${moduleName}(s) fetched Successfully`, statusCode: 200, data: responseData,
            };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findOne(params, req) {
        try {
            await this.authorizationService.isAuthorizedForEnquiry(params.id, req.user);
            let data = await this.enquiryService.findOne(params.id);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findDuplicateClient(params, req) {
        try {
            await this.authorizationService.isAuthorizedForEnquiry(params.id, req.user);
            let data = await this.enquiryService.findDuplicateClient(params.id);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async update(params, updateEnquiryDto, req) {
        try {
            await this.authorizationService.isAuthorizedForEnquiry(params.id, req.user);
            let data = await this.enquiryService.update(params.id, updateEnquiryDto);
            return { message: `${moduleName}  updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async markConcernAsResolved(params, req) {
        try {
            await this.authorizationService.isAuthorizedForEnquiryNote(params.id, req.user);
            let data = await this.enquiryService.markConcernAsResolved(params.id);
            return { message: `Concern has been marked as resolved successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async updateStatus(params, req, EnquiryStatusDto) {
        try {
            await this.authorizationService.isAuthorizedForEnquiry(params.id, req.user);
            EnquiryStatusDto["modifiedById"] = req.user.userId;
            EnquiryStatusDto["modifiedDate"] = new Date();
            let data = await this.enquiryService.updateStatus(params.id, EnquiryStatusDto);
            return { message: `${moduleName} deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findLogs(params, req, pagination) {
        try {
            await this.authorizationService.isAuthorizedForEnquiry(params.id, req.user);
            let data = await this.enquiryService.findOne(params.id);
            let filters = {
                OR: [
                    {
                        email: data.email,
                    },
                    {
                        phone: data.phone
                    }
                ],
                NOT: {
                    id: data.id
                }
            };
            let dt = await this.enquiryService.findAll(pagination, filters);
            let tCount = this.enquiryService.countTotalRecord(filters);
            const [logs, totalCount] = await Promise.all([dt, tCount]);
            let pageCount = Math.floor(totalCount / pagination.perPage) + ((totalCount % pagination.perPage) === 0 ? 0 : 1);
            return {
                message: `${moduleName}  fetched Successfully`, statusCode: 200, data: logs,
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
    async findNotes(params, req) {
        try {
            await this.authorizationService.isAuthorizedForEnquiry(params.id, req.user);
            let data = await this.enquiryService.findAllNotes(params.id);
            return { message: `${moduleName} notes  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async addNote(params, req, createNote) {
        try {
            await this.authorizationService.isAuthorizedForEnquiry(params.id, req.user);
            let data = await this.enquiryService.addNote(params.id, createNote, req.user);
            return { message: `Note added successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async removeNote(params, req) {
        try {
            await this.authorizationService.isAuthorizedForEnquiryNote(params.id, req.user);
            let data = await this.enquiryService.removeNote(params.id);
            return { message: `Note deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async removeDocument(params, req) {
        try {
            await this.authorizationService.isAuthorizedForEnquiryDocument(params.id, req.user);
            let data = await this.enquiryService.removeDocument(params.id);
            return { message: `Document deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async assignEnquiry(params, assignEnquiryDto, req) {
        try {
            await this.authorizationService.isAuthorizedForEnquiry(params.id, req.user);
            let data = await this.enquiryService.assignEnquiry(params.id, assignEnquiryDto, req.user);
            this.systemLogger.logData({
                tableName: "Enquiry",
                field: 'id',
                value: params.id,
                actionType: 'ASSIGN_ENQUIRY',
                valueType: "number",
                user: req.user.userId,
                data: assignEnquiryDto,
                endPoint: req.originalUrl,
                controllerName: this.constructor.name,
                message: "Enquiry Assigned"
            });
            return { data: data, statusCode: 200, message: "Enquiry Assigned Successfully" };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async removeEnquiry(params, req) {
        try {
            await this.authorizationService.isAuthorizedForEnquiry(params.id, req.user);
            let data = await this.enquiryService.removeEnquiry(params.id);
            return { message: `Enquiry deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(enquiry_permissions_1.EnquiryPermissionSet.CREATE),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: `Upload Enquiry Files` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: enquiry_dto_1.EnquiryResponseObject, isArray: false, description: `Returns the uploaded files on success` }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files[]', 20, multerOptionsProtected)),
    (0, common_1.Post)("uploadEnquiryDocuments"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [upload_files_dto_1.UploadEnquiryDocuments,
        Array, Object]),
    __metadata("design:returntype", Promise)
], EnquiryController.prototype, "uploadPropertyDocuments", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(enquiry_permissions_1.EnquiryPermissionSet.CREATE),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: enquiry_dto_1.EnquiryResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_enquiry_dto_1.CreateEnquiryDto, Object]),
    __metadata("design:returntype", Promise)
], EnquiryController.prototype, "create", null);
__decorate([
    (0, public_metadata_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: enquiry_dto_1.EnquiryResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_enquiry_dto_1.CreateEnquiryDto, Object]),
    __metadata("design:returntype", Promise)
], EnquiryController.prototype, "createEnquiry", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(enquiry_permissions_1.EnquiryPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Auto creates lead using the enquiry data` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: enquiry_dto_1.EnquiryResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.Post)('autoCreateLeadFromEnquiry'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auto_create_lead_from_enquiry_dto_1.AutoCreateLeadFromEnquiryDto, Object]),
    __metadata("design:returntype", Promise)
], EnquiryController.prototype, "autoCreateUsingEnquiry", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(enquiry_permissions_1.EnquiryPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName}(s) in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: enquiry_dto_1.EnquiryResponseArray, isArray: false, description: `Return a list of ${moduleName}(s) available` }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.Pagination,
        enquiry_filters_dto_1.EnquiryFiltersDto, Object]),
    __metadata("design:returntype", Promise)
], EnquiryController.prototype, "findAll", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(enquiry_permissions_1.EnquiryPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName}(s) in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: enquiry_dto_1.EnquiryResponseArray, isArray: false, description: `Return a list of ${moduleName}(s) available` }),
    (0, common_1.Get)('getCounts'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EnquiryController.prototype, "findCounts", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(enquiry_permissions_1.EnquiryPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: enquiry_dto_1.EnquiryResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)('find/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], EnquiryController.prototype, "findOne", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(enquiry_permissions_1.EnquiryPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: enquiry_dto_1.EnquiryResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)('findDuplicateClient/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], EnquiryController.prototype, "findDuplicateClient", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(enquiry_permissions_1.EnquiryPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: enquiry_dto_1.EnquiryResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)('update/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto,
        update_enquiry_dto_1.UpdateEnquiryDto, Object]),
    __metadata("design:returntype", Promise)
], EnquiryController.prototype, "update", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(enquiry_permissions_1.EnquiryPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: enquiry_dto_1.EnquiryResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)('markConcernAsResolved/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], EnquiryController.prototype, "markConcernAsResolved", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(enquiry_permissions_1.EnquiryPermissionSet.UPDATE_STATUS),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} status` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: enquiry_dto_1.EnquiryResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)('changeStatus/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object, enquiry_status_dto_1.EnquiryStatusDto]),
    __metadata("design:returntype", Promise)
], EnquiryController.prototype, "updateStatus", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(enquiry_permissions_1.EnquiryPermissionSet.READ_LOGS),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: enquiry_dto_1.EnquiryResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)('logs/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object, common_types_1.Pagination]),
    __metadata("design:returntype", Promise)
], EnquiryController.prototype, "findLogs", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(enquiry_permissions_1.EnquiryPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: enquiry_dto_1.EnquiryResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)('notes/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], EnquiryController.prototype, "findNotes", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(enquiry_permissions_1.EnquiryPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Add a note` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: enquiry_dto_1.EnquiryResponseObject, isArray: false, description: `Returns the added note` }),
    (0, common_1.Post)('addNote/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object, create_enquiry_note_dto_1.CreateEnquiryNoteDto]),
    __metadata("design:returntype", Promise)
], EnquiryController.prototype, "addNote", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(enquiry_permissions_1.EnquiryPermissionSet.DELETE_NOTE),
    (0, swagger_1.ApiOperation)({ summary: `Remove a note` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: enquiry_dto_1.EnquiryResponseObject, isArray: false, description: `Returns the removed note` }),
    (0, common_1.Delete)('removeNote/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], EnquiryController.prototype, "removeNote", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(enquiry_permissions_1.EnquiryPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Remove a note` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: enquiry_dto_1.EnquiryResponseObject, isArray: false, description: `Returns the removed note` }),
    (0, common_1.Delete)('removeDocument/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], EnquiryController.prototype, "removeDocument", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(enquiry_permissions_1.EnquiryPermissionSet.ASSIGN_ENQUIRY),
    (0, swagger_1.ApiOperation)({ summary: `Assign Leads to a User` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: enquiry_dto_1.EnquiryResponseObject, isArray: false, description: `Assign leads to a User` }),
    (0, common_1.Patch)('assignEnquiry/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto,
        assign_enquiry_dto_1.AssignEnquiryDto, Object]),
    __metadata("design:returntype", Promise)
], EnquiryController.prototype, "assignEnquiry", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(enquiry_permissions_1.EnquiryPermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: `Remove a enquiry` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: enquiry_dto_1.EnquiryResponseObject, isArray: false, description: `Returns the enquiry removed` }),
    (0, common_1.Delete)('remove/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], EnquiryController.prototype, "removeEnquiry", null);
EnquiryController = EnquiryController_1 = __decorate([
    (0, swagger_1.ApiTags)("enquiry"),
    (0, common_1.Controller)('enquiry'),
    __metadata("design:paramtypes", [enquiry_service_1.EnquiryService,
        enquiry_authorization_service_1.EnquiryAuthorizationService,
        system_logger_service_1.SystemLogger])
], EnquiryController);
exports.EnquiryController = EnquiryController;
//# sourceMappingURL=enquiry.controller.js.map