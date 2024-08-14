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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuotationController = void 0;
const common_1 = require("@nestjs/common");
const quotation_service_1 = require("./quotation.service");
const create_quotation_dto_1 = require("./dto/create-quotation.dto");
const update_quotation_dto_1 = require("./dto/update-quotation.dto");
const swagger_1 = require("@nestjs/swagger");
const common_types_1 = require("../../common-types/common-types");
const quotation_dto_1 = require("./dto/quotation.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const quotation_permissions_1 = require("./quotation.permissions");
const quotation_filters_dto_1 = require("./dto/quotation-filters.dto");
const quotation_status_dto_1 = require("./dto/quotation-status.dto");
const platform_express_1 = require("@nestjs/platform-express");
const file_upload_utils_1 = require("../../helpers/file-upload.utils");
const file_management_1 = require("../../helpers/file-management");
const constants_1 = require("../../config/constants");
const public_metadata_1 = require("../../authentication/public-metadata");
const common_2 = require("../../helpers/common");
const auto_create_project_from_quote_dto_1 = require("./dto/auto-create-project-from-quote.dto");
const quotation_authorization_service_1 = require("./quotation.authorization.service");
const check_quote_number_duplicacy_dto_1 = require("./dto/check-quote-number-duplicacy.dto");
const create_unique_quote_number_dto_1 = require("./dto/create-unique-quote-number.dto");
const quick_update_dto_1 = require("./dto/quick-update.dto");
const multerOptionsProtected = (0, file_upload_utils_1.getMulterOptions)({ destination: (0, quotation_dto_1.getDynamicUploadPath)(), fileTypes: 'images_and_pdf', limit: 50000000 });
const moduleName = "quotation";
let QuotationController = class QuotationController {
    constructor(quotationService, authorizationService) {
        this.quotationService = quotationService;
        this.authorizationService = authorizationService;
    }
    async create(createDto, req, file) {
        try {
            if (!(createDto.clientId || createDto.leadId)) {
                throw {
                    message: "Please provide either Lead ID or Client Data",
                    statusCode: 400
                };
            }
            if (createDto.type === constants_1.QuotationType.manual && !file) {
                throw {
                    message: "You must upload a file if you want to submit manual quotation to client",
                    statusCode: 400
                };
            }
            if (file) {
                createDto.file = (0, file_upload_utils_1.extractRelativePathFromFullPath)(file.path);
            }
            let data = await this.quotationService.create(createDto, req.user);
            if (createDto.type === constants_1.QuotationType.auto) {
                data = await this.quotationService.generateQuotationPdf(data.id);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            await (0, file_management_1.uploadFile)(file);
            return { message: `Your request has been submitted successfully.`, statusCode: 200, data: data };
        }
        catch (err) {
            (0, file_upload_utils_1.removeUploadedFiles)(file);
            throw new common_1.HttpException(err.message, (err.statusCode) ? err.statusCode : 400);
        }
    }
    async findAll(pagination, filters, req) {
        try {
            let permissions = await this.authorizationService.findUserPermissionsAgainstSlugs(req.user, [quotation_permissions_1.QuotationPermissionSet.READ_ALL]);
            let filtersApplied = this.quotationService.applyFilters(filters, req.user, permissions.readAllQuotation);
            let dt = this.quotationService.findAll(pagination, filtersApplied);
            let tCount = this.quotationService.countTotalRecord(filtersApplied);
            const [data, totalCount] = await Promise.all([dt, tCount]);
            let pageCount = Math.floor(totalCount / pagination.perPage) + ((totalCount % pagination.perPage) === 0 ? 0 : 1);
            return { message: `${moduleName}(s) fetched Successfully`, statusCode: 200, data: data,
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
    async findOne(params, req) {
        try {
            let data = await this.quotationService.findOne(params.id);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async viewEmailQuotation(params, req) {
        var _a, _b;
        try {
            let quotation = await this.quotationService.findOne(params.id);
            if (!quotation) {
                throw {
                    message: "Quotation Not found",
                    statusCode: 404
                };
            }
            return Object.assign(Object.assign({}, constants_1.ejsTemplateDefaults), { hideFooter: true, emailTitle: "Quotation - " + quotation.quoteNumber, clientData: (_a = quotation.Lead) === null || _a === void 0 ? void 0 : _a.Client, lead: quotation.Lead, submissionBy: (_b = quotation.Lead) === null || _b === void 0 ? void 0 : _b.SubmissionBy, quotation: quotation });
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async viewNotificationTemplete(params, req) {
        var _a, _b;
        try {
            let quotation = await this.quotationService.findOne(params.id);
            if (!quotation) {
                throw {
                    message: "Quotation Not found",
                    statusCode: 404
                };
            }
            return Object.assign(Object.assign({}, constants_1.ejsTemplateDefaults), { hideFooter: false, emailTitle: "Quotation - " + quotation.quoteNumber, clientData: (_a = quotation.Lead) === null || _a === void 0 ? void 0 : _a.Client, lead: quotation.Lead, submissionBy: (_b = quotation.Lead) === null || _b === void 0 ? void 0 : _b.SubmissionBy });
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async viewQuotationPdf(req, params) {
        var _a, _b;
        try {
            let data = await this.quotationService.viewQuotationPdf(params.id);
            return { message: `PDF generated Successfully`, statusCode: 200, data: data,
                clientData: data.Lead.Client,
                projectType: (_a = data.Lead) === null || _a === void 0 ? void 0 : _a.ProjectType,
                quotation: data,
                submissionBy: (_b = data.Lead) === null || _b === void 0 ? void 0 : _b.SubmissionBy,
                taxData: (0, common_2.getTaxData)(data.QuotationMilestone),
                convertDate: common_2.convertDate,
                addDaysToDate: common_2.addDaysToDate,
                getEnumKeyByEnumValue: common_2.getEnumKeyByEnumValue,
                SupervisionPaymentSchedule: constants_1.SupervisionPaymentSchedule };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async update(params, updateQuotationDto, req, file) {
        try {
            updateQuotationDto["modifiedDate"] = new Date();
            updateQuotationDto["modifiedById"] = req.user.userId;
            if (file) {
                updateQuotationDto.file = (0, file_upload_utils_1.extractRelativePathFromFullPath)(file.path);
            }
            let data = await this.quotationService.update(params.id, updateQuotationDto, req.user);
            if (updateQuotationDto.type === constants_1.QuotationType.auto) {
                data = await this.quotationService.generateQuotationPdf(data.id);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            await (0, file_management_1.uploadFile)(file);
            return { message: `${moduleName}  updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            (0, file_upload_utils_1.removeUploadedFiles)(file);
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async completeMilestone(params, req) {
        try {
            let data = await this.quotationService.completeMilestone(params.id, req.user);
            return { message: `Milestone  updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async submitQuotation(params, req) {
        try {
            let data = await this.quotationService.submitQuotation(params.id, req.user);
            return { message: `${moduleName}  updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async updateStatus(params, req, quotationStatusDto) {
        try {
            quotationStatusDto["modifiedById"] = req.user.userId;
            quotationStatusDto["modifiedDate"] = new Date();
            let data = await this.quotationService.updateStatus(params.id, quotationStatusDto);
            return { message: `${moduleName} status updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async markAsSent(params, req) {
        try {
            let data = await this.quotationService.markAsSent(params.id, req.user);
            return { message: `Quotion has been marked as sent successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async removeEnquiry(params, req) {
        try {
            let data = await this.quotationService.removeQuotation(params.id, req.user);
            return { message: `Quotation deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async checkForDuplicacy(query) {
        try {
            let data = await this.quotationService.checkForDuplicacy(query);
            return { message: `Data fetched successfully`, statusCode: 200, data: {
                    isDuplicate: data
                } };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async prepareUniqueQuoteNumber(query) {
        try {
            let data = await this.quotationService.prepareUniqueQuoteNumber(query.leadId, query.revisionId);
            return { message: `Data fetched successfully`, statusCode: 200, data: {
                    quoteNumber: data
                } };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async autoCreate(createDto, req) {
        try {
            let recordData = await this.quotationService.findOne(createDto.quoteId);
            let data = await this.quotationService.autoCreateProjectFromApprovedQuotation(createDto, req.user);
            let message = "Quotation has been marked as approved successfully";
            if (recordData.projectId) {
                message += `. Quotation Reference ${recordData.quoteNumber} has been attatched to the existing project`;
            }
            else {
                message += ` and a new project has been created.  A notification has been sent to finance for the advance payment collection`;
            }
            return { message: message, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, (err.statusCode) ? err.statusCode : 400);
        }
    }
    async quickUpdate(params, quickUpdateQuotation, req) {
        try {
            let data = await this.quotationService.quickUpdate(params.id, quickUpdateQuotation, req.user);
            let message = "Quotation Updated Successfully";
            return { message: message, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, (err.statusCode) ? err.statusCode : 400);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(quotation_permissions_1.QuotationPermissionSet.CREATE),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', multerOptionsProtected)),
    (0, swagger_1.ApiResponse)({ status: 200, type: quotation_dto_1.QuotationResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_quotation_dto_1.CreateQuotationDto, Object, Object]),
    __metadata("design:returntype", Promise)
], QuotationController.prototype, "create", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(quotation_permissions_1.QuotationPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName}(s) in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: quotation_dto_1.QuotationResponseArray, isArray: false, description: `Return a list of ${moduleName}(s) available` }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.Pagination,
        quotation_filters_dto_1.QuotationFiltersDto, Object]),
    __metadata("design:returntype", Promise)
], QuotationController.prototype, "findAll", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(quotation_permissions_1.QuotationPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: quotation_dto_1.QuotationResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)('findOne/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], QuotationController.prototype, "findOne", null);
__decorate([
    (0, public_metadata_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: quotation_dto_1.QuotationResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)('templates/viewEmailQuotation/:id'),
    (0, common_1.Render)('email-templates/quotation'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], QuotationController.prototype, "viewEmailQuotation", null);
__decorate([
    (0, public_metadata_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: quotation_dto_1.QuotationResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)('templates/viewNotificationTemplete/:id'),
    (0, common_1.Render)('email-templates/quotation-approved-notification'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], QuotationController.prototype, "viewNotificationTemplete", null);
__decorate([
    (0, public_metadata_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: quotation_dto_1.QuotationResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)('templates/viewQuotationPdf/:id'),
    (0, common_1.Render)("pdf-templates/quotation.ejs"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, common_types_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], QuotationController.prototype, "viewQuotationPdf", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(quotation_permissions_1.QuotationPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: quotation_dto_1.QuotationResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.Patch)('updateOne/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto,
        update_quotation_dto_1.UpdateQuotationDto, Object, Object]),
    __metadata("design:returntype", Promise)
], QuotationController.prototype, "update", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(quotation_permissions_1.QuotationPermissionSet.COMPLETE_MILESTONE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: quotation_dto_1.QuotationResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)('completeMilestone/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], QuotationController.prototype, "completeMilestone", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(quotation_permissions_1.QuotationPermissionSet.SUBMIT_QUOTATION),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: quotation_dto_1.QuotationResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)('submitQuotation/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], QuotationController.prototype, "submitQuotation", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(quotation_permissions_1.QuotationPermissionSet.UPDATE_STATUS),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} status` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: quotation_dto_1.QuotationResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)('changeStatus/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object, quotation_status_dto_1.QuotationStatusDto]),
    __metadata("design:returntype", Promise)
], QuotationController.prototype, "updateStatus", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(quotation_permissions_1.QuotationPermissionSet.SUBMIT_QUOTATION),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: quotation_dto_1.QuotationResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)('markAsSent/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], QuotationController.prototype, "markAsSent", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(quotation_permissions_1.QuotationPermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: `Remove a Lead` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: quotation_dto_1.QuotationResponseObject, isArray: false, description: `Returns the lead removed` }),
    (0, common_1.Delete)('remove/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], QuotationController.prototype, "removeEnquiry", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Check for Duplicacy of Quote Number` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: quotation_dto_1.QuotationResponseObject, isArray: false, description: `Returns the lead removed` }),
    (0, common_1.Get)('checkForDuplicacy'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [check_quote_number_duplicacy_dto_1.CheckQuoteDuplicacyDto]),
    __metadata("design:returntype", Promise)
], QuotationController.prototype, "checkForDuplicacy", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Preapare a unique quote number` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: quotation_dto_1.QuotationResponseObject, isArray: false, description: `Returns the lead removed` }),
    (0, common_1.Get)('prepareUniqueQuoteNumber'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_unique_quote_number_dto_1.CreateUniqueQuoteNumberyDto]),
    __metadata("design:returntype", Promise)
], QuotationController.prototype, "prepareUniqueQuoteNumber", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(quotation_permissions_1.QuotationPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: quotation_dto_1.QuotationResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.Post)("autoCreateProjectFromApprovedQuotation"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auto_create_project_from_quote_dto_1.AutoCreateProjectDto, Object]),
    __metadata("design:returntype", Promise)
], QuotationController.prototype, "autoCreate", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(quotation_permissions_1.QuotationPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: quotation_dto_1.QuotationResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.Patch)("quickUpdate/:id"),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, quick_update_dto_1.QuickUpdateQuotation, Object]),
    __metadata("design:returntype", Promise)
], QuotationController.prototype, "quickUpdate", null);
QuotationController = __decorate([
    (0, swagger_1.ApiTags)("quotation"),
    (0, common_1.Controller)('quotation'),
    __metadata("design:paramtypes", [quotation_service_1.QuotationService,
        quotation_authorization_service_1.QuotationAuthorizationService])
], QuotationController);
exports.QuotationController = QuotationController;
//# sourceMappingURL=quotation.controller.js.map