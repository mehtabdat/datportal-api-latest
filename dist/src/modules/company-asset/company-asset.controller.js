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
exports.CompanyAssetController = void 0;
const common_1 = require("@nestjs/common");
const company_asset_service_1 = require("./company-asset.service");
const create_company_asset_dto_1 = require("./dto/create-company-asset.dto");
const update_company_asset_dto_1 = require("./dto/update-company-asset.dto");
const swagger_1 = require("@nestjs/swagger");
const common_types_1 = require("../../common-types/common-types");
const company_asset_dto_1 = require("./dto/company-asset.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const company_asset_permissions_1 = require("./company-asset.permissions");
const company_asset_filters_dto_1 = require("./dto/company-asset-filters.dto");
const allocate_asset_to_user_dto_1 = require("./dto/allocate-asset-to-user.dto");
const moduleName = "company-asset";
let CompanyAssetController = class CompanyAssetController {
    constructor(companyAssetService) {
        this.companyAssetService = companyAssetService;
    }
    async create(createDto) {
        try {
            let data = await this.companyAssetService.create(createDto);
            return { message: `${moduleName} created successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async allocateResource(createDto) {
        try {
            let data = await this.companyAssetService.allocateResource(createDto);
            return { message: `Resource has been allocated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findPublished(filters, pagination) {
        try {
            let appliedFilters = this.companyAssetService.applyFilters(filters);
            appliedFilters = Object.assign(Object.assign({}, appliedFilters), { isPublished: true });
            let dt = await this.companyAssetService.findAllPublished(appliedFilters, pagination);
            let tCount = this.companyAssetService.countRecords(appliedFilters);
            const [data, totalCount] = await Promise.all([dt, tCount]);
            let pageCount = Math.floor(totalCount / pagination.perPage) + ((totalCount % pagination.perPage) === 0 ? 0 : 1);
            return { message: `${moduleName} fetched Successfully`, statusCode: 200, data: data,
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
    async findCars() {
        try {
            let data = await this.companyAssetService.findCompanyCars();
            return { message: `Company cars fetched Successfully`, statusCode: 200, data: data, };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAll(filters, pagination) {
        try {
            let appliedFilters = this.companyAssetService.applyFilters(filters);
            let dt = await this.companyAssetService.findAll(appliedFilters, pagination);
            let tCount = this.companyAssetService.countRecords(appliedFilters);
            const [data, totalCount] = await Promise.all([dt, tCount]);
            let pageCount = Math.floor(totalCount / pagination.perPage) + ((totalCount % pagination.perPage) === 0 ? 0 : 1);
            return { message: `${moduleName} fetched Successfully`, statusCode: 200, data: data,
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
    async findOne(params) {
        try {
            let data = await this.companyAssetService.findOne(params.id);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async update(params, updateDto) {
        try {
            let data = await this.companyAssetService.update(params.id, updateDto);
            return { message: `${moduleName}  updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async revoke(params) {
        try {
            let data = await this.companyAssetService.revoke(params.id);
            return { message: `Resource has been revoked successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async remove(params) {
        try {
            let data = await this.companyAssetService.remove(params.id);
            return { message: `${moduleName} deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(company_asset_permissions_1.CompanyAssetPermissionSet.CREATE),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: company_asset_dto_1.CompanyAssetsResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_company_asset_dto_1.CreateCompanyAssetDto]),
    __metadata("design:returntype", Promise)
], CompanyAssetController.prototype, "create", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(company_asset_permissions_1.CompanyAssetPermissionSet.CREATE),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: company_asset_dto_1.CompanyAssetsResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.Post)('allocate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [allocate_asset_to_user_dto_1.AllocateAssetToUserDto]),
    __metadata("design:returntype", Promise)
], CompanyAssetController.prototype, "allocateResource", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: company_asset_dto_1.CompanyAssetsResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)('find-published'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [company_asset_filters_dto_1.CompanyAssetFiltersDto,
        common_types_1.Pagination]),
    __metadata("design:returntype", Promise)
], CompanyAssetController.prototype, "findPublished", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: company_asset_dto_1.CompanyAssetsResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)('findCompanyCars'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CompanyAssetController.prototype, "findCars", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(company_asset_permissions_1.CompanyAssetPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: company_asset_dto_1.CompanyAssetsResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [company_asset_filters_dto_1.CompanyAssetFiltersDto,
        common_types_1.Pagination]),
    __metadata("design:returntype", Promise)
], CompanyAssetController.prototype, "findAll", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(company_asset_permissions_1.CompanyAssetPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: company_asset_dto_1.CompanyAssetsResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], CompanyAssetController.prototype, "findOne", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(company_asset_permissions_1.CompanyAssetPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: company_asset_dto_1.CompanyAssetsResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto,
        update_company_asset_dto_1.UpdateCompanyAssetDto]),
    __metadata("design:returntype", Promise)
], CompanyAssetController.prototype, "update", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(company_asset_permissions_1.CompanyAssetPermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: company_asset_dto_1.CompanyAssetsResponseObject, isArray: false, description: `Returns the deleted ${moduleName} object if found on the system` }),
    (0, common_1.Delete)('revoke/:id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], CompanyAssetController.prototype, "revoke", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(company_asset_permissions_1.CompanyAssetPermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: company_asset_dto_1.CompanyAssetsResponseObject, isArray: false, description: `Returns the deleted ${moduleName} object if found on the system` }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], CompanyAssetController.prototype, "remove", null);
CompanyAssetController = __decorate([
    (0, swagger_1.ApiTags)("company-asset"),
    (0, common_1.Controller)('company-asset'),
    __metadata("design:paramtypes", [company_asset_service_1.CompanyAssetService])
], CompanyAssetController);
exports.CompanyAssetController = CompanyAssetController;
//# sourceMappingURL=company-asset.controller.js.map