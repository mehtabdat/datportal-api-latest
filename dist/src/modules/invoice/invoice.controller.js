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
var InvoiceController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceController = void 0;
const common_1 = require("@nestjs/common");
const invoice_service_1 = require("./invoice.service");
const create_invoice_dto_1 = require("./dto/create-invoice.dto");
const update_invoice_dto_1 = require("./dto/update-invoice.dto");
const swagger_1 = require("@nestjs/swagger");
const common_types_1 = require("../../common-types/common-types");
const invoice_dto_1 = require("./dto/invoice.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const invoice_permissions_1 = require("./invoice.permissions");
const invoice_filters_dto_1 = require("./dto/invoice-filters.dto");
const invoice_status_dto_1 = require("./dto/invoice-status.dto");
const platform_express_1 = require("@nestjs/platform-express");
const file_upload_utils_1 = require("../../helpers/file-upload.utils");
const file_management_1 = require("../../helpers/file-management");
const constants_1 = require("../../config/constants");
const public_metadata_1 = require("../../authentication/public-metadata");
const common_2 = require("../../helpers/common");
const check_invoice_number_duplicacy_dto_1 = require("./dto/check-invoice-number-duplicacy.dto");
const quick_update_dto_1 = require("./dto/quick-update.dto");
const create_invoice_note_dto_1 = require("./dto/create-invoice-note.dto");
const create_unique_invoice_number_dto_1 = require("./dto/create-unique-invoice-number.dto");
const multerOptionsProtected = (0, file_upload_utils_1.getMulterOptions)({ destination: (0, invoice_dto_1.getDynamicUploadPath)(), fileTypes: 'images_and_pdf', limit: 10000000 });
const moduleName = "invoice";
let InvoiceController = InvoiceController_1 = class InvoiceController {
    constructor(invoiceService) {
        this.invoiceService = invoiceService;
        this.logger = new common_1.Logger(InvoiceController_1.name);
    }
    async create(createDto, req, file) {
        try {
            if (createDto.type === constants_1.InvoiceType.manual && !file) {
                throw {
                    message: "You must upload a file if you want to submit manual invoice to client",
                    statusCode: 400
                };
            }
            if (file) {
                createDto.file = (0, file_upload_utils_1.extractRelativePathFromFullPath)(file.path);
            }
            let data = await this.invoiceService.create(createDto, req.user);
            if (createDto.type === constants_1.InvoiceType.auto) {
                data = await this.invoiceService.generateInvoicePdf(data.id);
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
            let filtersApplied = this.invoiceService.applyFilters(filters);
            let dt = this.invoiceService.findAll(pagination, filtersApplied);
            let tCount = this.invoiceService.countTotalRecord(filtersApplied);
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
            let data = await this.invoiceService.findOne(params.id);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async viewInvoicePdf(req, params) {
        var _a;
        try {
            let data = await this.invoiceService.viewInvoicePdf(params.id);
            return { message: `PDF generated Successfully`, statusCode: 200, data: data,
                clientData: data === null || data === void 0 ? void 0 : data.Client,
                invoice: data,
                submissionBy: (_a = data === null || data === void 0 ? void 0 : data.Project) === null || _a === void 0 ? void 0 : _a.SubmissionBy,
                convertDate: common_2.convertDate,
                taxData: (0, common_2.getTaxData)(data === null || data === void 0 ? void 0 : data.InvoiceItems),
                addDaysToDate: common_2.addDaysToDate,
                getEnumKeyByEnumValue: common_2.getEnumKeyByEnumValue,
                SupervisionPaymentSchedule: constants_1.SupervisionPaymentSchedule };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async viewInvoiceEmailTemplate(params) {
        var _a;
        try {
            let invoice = await this.invoiceService.findOne(params.id);
            if (!invoice) {
                throw {
                    message: "Invoice Not found",
                    statusCode: 404
                };
            }
            return Object.assign(Object.assign({}, constants_1.ejsTemplateDefaults), { hideFooter: true, emailTitle: "invoice - " + invoice.invoiceNumber, clientData: invoice === null || invoice === void 0 ? void 0 : invoice.Client, project: invoice.Project, submissionBy: (_a = invoice === null || invoice === void 0 ? void 0 : invoice.Project) === null || _a === void 0 ? void 0 : _a.SubmissionBy, invoice: invoice });
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async update(params, updateDto, req, file) {
        try {
            updateDto["modifiedDate"] = new Date();
            updateDto["modifiedById"] = req.user.userId;
            if (file) {
                updateDto.file = (0, file_upload_utils_1.extractRelativePathFromFullPath)(file.path);
            }
            let data = await this.invoiceService.update(params.id, updateDto, req.user);
            if (updateDto.type === constants_1.InvoiceType.auto) {
                data = await this.invoiceService.generateInvoicePdf(data.id);
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
    async submitInvoice(params, req) {
        try {
            let data = await this.invoiceService.submitInvoice(params.id, req.user);
            return { message: `${moduleName}  updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async markAsSent(params, req) {
        try {
            let data = await this.invoiceService.submitInvoice(params.id, req.user);
            return { message: `Invoice has been marked as sent successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async updateStatus(params, req, InvoiceStatusDto) {
        try {
            InvoiceStatusDto["modifiedById"] = req.user.userId;
            InvoiceStatusDto["modifiedDate"] = new Date();
            let data = await this.invoiceService.updateStatus(params.id, InvoiceStatusDto, req.user);
            return { message: `${moduleName} status updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async checkForDuplicacy(query) {
        try {
            let data = await this.invoiceService.checkForDuplicacy(query);
            return { message: `Data fetched successfully`, statusCode: 200, data: {
                    isDuplicate: data
                } };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async prepareUniqueInvoiceNumber(createUniqueInvoiceNumberyDto) {
        try {
            let data = await this.invoiceService.prepareUniqueInvoiceNumber(createUniqueInvoiceNumberyDto.projectId);
            return { message: `Data fetched successfully`, statusCode: 200, data: {
                    invoiceNumber: data
                } };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async removeInvoice(params, req) {
        try {
            let data = await this.invoiceService.removeInvoice(params.id, req.user);
            return { message: `Lead deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async quickUpdate(params, quickUpdateInvoice, req) {
        try {
            let data = await this.invoiceService.quickUpdate(params.id, quickUpdateInvoice, req.user);
            let message = "Invoice Updated Successfully";
            return { message: message, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, (err.statusCode) ? err.statusCode : 400);
        }
    }
    async findNotes(params, req) {
        try {
            let data = await this.invoiceService.findAllNotes(params.id);
            return { message: `${moduleName} notes  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async addNote(params, req, createNote) {
        try {
            let data = await this.invoiceService.addNote(params.id, createNote, req.user);
            return { message: `Note added successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async removeNote(params, req) {
        try {
            let data = await this.invoiceService.removeNote(params.id);
            return { message: `Note deleted successfully`, statusCode: 200, data: data };
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
                paid: 0,
                draft: 0,
                canceled: 0,
                hasConcerns: 0
            };
            let filters = {};
            let allDataFilters = this.invoiceService.applyFilters(filters);
            filters = { __status: [constants_1.InvoiceStatus.generated, constants_1.InvoiceStatus.sent] };
            let activeDataFilters = this.invoiceService.applyFilters(filters);
            filters = { __status: [constants_1.InvoiceStatus.paid] };
            let paidDataFilters = this.invoiceService.applyFilters(filters);
            filters = { __status: [constants_1.InvoiceStatus.generated] };
            let draftDataFilters = this.invoiceService.applyFilters(filters);
            filters = { __status: [constants_1.InvoiceStatus.generated, constants_1.InvoiceStatus.sent], hasConcerns: true };
            let hasConcernsDataFilters = this.invoiceService.applyFilters(filters);
            filters = { __status: [constants_1.InvoiceStatus.canceled] };
            let canceledDataFilters = this.invoiceService.applyFilters(filters);
            allPromises.push(this.invoiceService.countTotalRecord(allDataFilters).then(data => responseData.all = data).catch(err => { this.logger.error("Some error while counting all records"); }));
            allPromises.push(this.invoiceService.countTotalRecord(activeDataFilters).then(data => responseData.active = data).catch(err => { this.logger.error("Some error while counting all active records"); }));
            allPromises.push(this.invoiceService.countTotalRecord(paidDataFilters).then(data => responseData.paid = data).catch(err => { this.logger.error("Some error while counting all paid records"); }));
            allPromises.push(this.invoiceService.countTotalRecord(hasConcernsDataFilters).then(data => responseData.hasConcerns = data).catch(err => { this.logger.error("Some error while counting all records having converns"); }));
            allPromises.push(this.invoiceService.countTotalRecord(draftDataFilters).then(data => responseData.draft = data).catch(err => { this.logger.error("Some error while counting all draft records"); }));
            allPromises.push(this.invoiceService.countTotalRecord(canceledDataFilters).then(data => responseData.canceled = data).catch(err => { this.logger.error("Some error while counting all canceled records"); }));
            await Promise.all(allPromises);
            return {
                message: `${moduleName}(s) fetched Successfully`, statusCode: 200, data: responseData,
            };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async markConcernAsResolved(params, req) {
        try {
            let data = await this.invoiceService.markConcernAsResolved(params.id);
            return { message: `Concern has been marked as resolved successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(invoice_permissions_1.InvoicePermissionSet.CREATE),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', multerOptionsProtected)),
    (0, swagger_1.ApiResponse)({ status: 200, type: invoice_dto_1.InvoiceResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_invoice_dto_1.CreateInvoiceDto, Object, Object]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "create", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(invoice_permissions_1.InvoicePermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName}(s) in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: invoice_dto_1.InvoiceResponseArray, isArray: false, description: `Return a list of ${moduleName}(s) available` }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.Pagination,
        invoice_filters_dto_1.InvoiceFiltersDto, Object]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "findAll", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(invoice_permissions_1.InvoicePermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: invoice_dto_1.InvoiceResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)('findOne/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "findOne", null);
__decorate([
    (0, public_metadata_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: invoice_dto_1.InvoiceResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)('templates/viewInvoicePdf/:id'),
    (0, common_1.Render)("pdf-templates/invoice.ejs"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, common_types_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "viewInvoicePdf", null);
__decorate([
    (0, public_metadata_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: invoice_dto_1.InvoiceResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)('templates/viewEmailInvoice/:id'),
    (0, common_1.Render)("email-templates/invoice"),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "viewInvoiceEmailTemplate", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(invoice_permissions_1.InvoicePermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: invoice_dto_1.InvoiceResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', multerOptionsProtected)),
    (0, common_1.Patch)('updateOne/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto,
        update_invoice_dto_1.UpdateInvoiceDto, Object, Object]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "update", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(invoice_permissions_1.InvoicePermissionSet.SUBMIT_INVOICE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: invoice_dto_1.InvoiceResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)('submitInvoice/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "submitInvoice", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(invoice_permissions_1.InvoicePermissionSet.SUBMIT_INVOICE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: invoice_dto_1.InvoiceResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)('markAsSent/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "markAsSent", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(invoice_permissions_1.InvoicePermissionSet.UPDATE_STATUS),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} status` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: invoice_dto_1.InvoiceResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)('changeStatus/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object, invoice_status_dto_1.InvoiceStatusDto]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "updateStatus", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Check for Duplicacy of Invoice Number` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: invoice_dto_1.InvoiceResponseObject, isArray: false, description: `Returns the lead removed` }),
    (0, common_1.Get)('checkForDuplicacy'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [check_invoice_number_duplicacy_dto_1.CheckInvoiceDuplicacyDto]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "checkForDuplicacy", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Preapare a unique invoice number` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: invoice_dto_1.InvoiceResponseObject, isArray: false, description: `Returns the lead removed` }),
    (0, common_1.Get)('prepareUniqueInvoiceNumber'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_unique_invoice_number_dto_1.CreateUniqueInvoiceNumberyDto]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "prepareUniqueInvoiceNumber", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(invoice_permissions_1.InvoicePermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: `Remove a Lead` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: invoice_dto_1.InvoiceResponseObject, isArray: false, description: `Returns the lead removed` }),
    (0, common_1.Delete)('remove/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "removeInvoice", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(invoice_permissions_1.InvoicePermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: invoice_dto_1.InvoiceResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.Patch)("quickUpdate/:id"),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, quick_update_dto_1.QuickUpdateInvoice, Object]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "quickUpdate", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(invoice_permissions_1.InvoicePermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: invoice_dto_1.FollowupResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)('notes/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "findNotes", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(invoice_permissions_1.InvoicePermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Add a note` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: invoice_dto_1.FollowupResponseObject, isArray: false, description: `Returns the added note` }),
    (0, common_1.Post)('addNote/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object, create_invoice_note_dto_1.CreateInvoiceNoteDto]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "addNote", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(invoice_permissions_1.InvoicePermissionSet.DELETE_NOTE),
    (0, swagger_1.ApiOperation)({ summary: `Remove a note` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: invoice_dto_1.FollowupResponseObject, isArray: false, description: `Returns the removed note` }),
    (0, common_1.Delete)('removeNote/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "removeNote", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(invoice_permissions_1.InvoicePermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName}(s) in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: invoice_dto_1.FollowupResponseObject, isArray: false, description: `Return a list of ${moduleName}(s) available` }),
    (0, common_1.Get)('getCounts'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "findCounts", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(invoice_permissions_1.InvoicePermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: invoice_dto_1.FollowupResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)('markConcernAsResolved/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "markConcernAsResolved", null);
InvoiceController = InvoiceController_1 = __decorate([
    (0, swagger_1.ApiTags)("invoice"),
    (0, common_1.Controller)('invoice'),
    __metadata("design:paramtypes", [invoice_service_1.InvoiceService])
], InvoiceController);
exports.InvoiceController = InvoiceController;
//# sourceMappingURL=invoice.controller.js.map