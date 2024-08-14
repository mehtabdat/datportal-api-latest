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
exports.TaxRateController = void 0;
const common_1 = require("@nestjs/common");
const tax_rate_service_1 = require("./tax-rate.service");
const create_tax_rate_dto_1 = require("./dto/create-tax-rate.dto");
const update_tax_rate_dto_1 = require("./dto/update-tax-rate.dto");
const swagger_1 = require("@nestjs/swagger");
const common_types_1 = require("../../common-types/common-types");
const tax_rate_dto_1 = require("./dto/tax-rate.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const tax_rate_permissions_1 = require("./tax-rate.permissions");
const tax_rate_filters_dto_1 = require("./dto/tax-rate.filters.dto");
const moduleName = "tax-rate";
let TaxRateController = class TaxRateController {
    constructor(taxRateService) {
        this.taxRateService = taxRateService;
    }
    async create(createDto) {
        try {
            let data = await this.taxRateService.create(createDto);
            return { message: `${moduleName} created successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findBySlug(findBySlugDto) {
        try {
            let data = await this.taxRateService.findBySlug(findBySlugDto.slug);
            return { message: `${moduleName} fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAll(filters) {
        try {
            let condition = {};
            if (filters.tenantId) {
                condition = Object.assign(Object.assign({}, condition), { xeroTenantId: filters.tenantId });
            }
            if (filters.leadId) {
                let leadData = await this.taxRateService.getLeadData(filters.leadId);
                if (leadData && leadData.xeroTenantId) {
                    condition = Object.assign(Object.assign({}, condition), { xeroTenantId: leadData.xeroTenantId });
                }
            }
            let data = await this.taxRateService.findAll(condition);
            return { message: `${moduleName} fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findOne(params) {
        try {
            let data = await this.taxRateService.findOne(params.id);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async update(params, updateDto) {
        try {
            let data = await this.taxRateService.update(params.id, updateDto);
            return { message: `${moduleName}  updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async remove(params) {
        try {
            let data = await this.taxRateService.remove(params.id);
            return { message: `${moduleName} deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(tax_rate_permissions_1.TaxRatePermissionSet.CREATE),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: tax_rate_dto_1.TaxRateResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tax_rate_dto_1.CreateTaxRateDto]),
    __metadata("design:returntype", Promise)
], TaxRateController.prototype, "create", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(tax_rate_permissions_1.TaxRatePermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: tax_rate_dto_1.TaxRateResponseObject, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)('find-by-tax-code/:slug'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.FindBySlugDto]),
    __metadata("design:returntype", Promise)
], TaxRateController.prototype, "findBySlug", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(tax_rate_permissions_1.TaxRatePermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: tax_rate_dto_1.TaxRateResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tax_rate_filters_dto_1.TaxRateFiltersDto]),
    __metadata("design:returntype", Promise)
], TaxRateController.prototype, "findAll", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(tax_rate_permissions_1.TaxRatePermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: tax_rate_dto_1.TaxRateResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], TaxRateController.prototype, "findOne", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(tax_rate_permissions_1.TaxRatePermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: tax_rate_dto_1.TaxRateResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto,
        update_tax_rate_dto_1.UpdateTaxRateDto]),
    __metadata("design:returntype", Promise)
], TaxRateController.prototype, "update", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(tax_rate_permissions_1.TaxRatePermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: tax_rate_dto_1.TaxRateResponseObject, isArray: false, description: `Returns the deleted ${moduleName} object if found on the system` }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], TaxRateController.prototype, "remove", null);
TaxRateController = __decorate([
    (0, swagger_1.ApiTags)("tax-rate"),
    (0, common_1.Controller)('tax-rate'),
    __metadata("design:paramtypes", [tax_rate_service_1.TaxRateService])
], TaxRateController);
exports.TaxRateController = TaxRateController;
//# sourceMappingURL=tax-rate.controller.js.map