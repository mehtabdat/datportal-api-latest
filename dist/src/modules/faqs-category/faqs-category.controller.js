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
exports.FaqsCategoryController = void 0;
const common_1 = require("@nestjs/common");
const faqs_category_service_1 = require("./faqs-category.service");
const create_faqs_category_dto_1 = require("./dto/create-faqs-category.dto");
const update_faqs_category_dto_1 = require("./dto/update-faqs-category.dto");
const swagger_1 = require("@nestjs/swagger");
const params_dto_1 = require("./dto/params.dto");
const faqs_category_dto_1 = require("./dto/faqs-category.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const faqs_category_permissions_1 = require("./faqs-category.permissions");
const public_metadata_1 = require("../../authentication/public-metadata");
const faqs_category_filter_dto_1 = require("./dto/faqs-category-filter.dto");
const faqs_category_pagination_dto_1 = require("./dto/faqs-category-pagination.dto");
const moduleName = "Faqs category";
let FaqsCategoryController = class FaqsCategoryController {
    constructor(faqsCategoryService) {
        this.faqsCategoryService = faqsCategoryService;
    }
    async create(createFaqsCategoryDto) {
        try {
            let data = await this.faqsCategoryService.create(createFaqsCategoryDto);
            return { message: `${moduleName} created successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findPublished() {
        try {
            let data = await this.faqsCategoryService.findAllPublished();
            return { message: `${moduleName} fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findBySlug(findBySlugDto) {
        try {
            let data = await this.faqsCategoryService.findBySlug(findBySlugDto.slug);
            return { message: `${moduleName} fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAll(filters, pagination) {
        try {
            let appliedFilters = this.faqsCategoryService.applyFilters(filters);
            let dt = await this.faqsCategoryService.findAll(appliedFilters, pagination);
            let tCount = this.faqsCategoryService.countFaqsCategory(appliedFilters);
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
            let data = await this.faqsCategoryService.findOne(params.id);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async update(params, updateFaqsCategoryDto) {
        try {
            let data = await this.faqsCategoryService.update(params.id, updateFaqsCategoryDto);
            return { message: `${moduleName}  updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async remove(params) {
        try {
            let data = await this.faqsCategoryService.remove(params.id);
            return { message: `${moduleName} deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(faqs_category_permissions_1.FaqsCategoryPermissionSet.CREATE),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: faqs_category_dto_1.FaqsCategoryResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_faqs_category_dto_1.CreateFaqsCategoryDto]),
    __metadata("design:returntype", Promise)
], FaqsCategoryController.prototype, "create", null);
__decorate([
    (0, public_metadata_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: faqs_category_dto_1.FaqsCategoryResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)('find-published'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FaqsCategoryController.prototype, "findPublished", null);
__decorate([
    (0, public_metadata_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: faqs_category_dto_1.FaqsCategoryResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)('find-by-slug/:slug'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.FindBySlugDto]),
    __metadata("design:returntype", Promise)
], FaqsCategoryController.prototype, "findBySlug", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(faqs_category_permissions_1.FaqsCategoryPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: faqs_category_dto_1.FaqsCategoryResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [faqs_category_filter_dto_1.FaqsCategoryFiltersDto,
        faqs_category_pagination_dto_1.FaqsCategoryPaginationDto]),
    __metadata("design:returntype", Promise)
], FaqsCategoryController.prototype, "findAll", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(faqs_category_permissions_1.FaqsCategoryPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: faqs_category_dto_1.FaqsCategoryResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], FaqsCategoryController.prototype, "findOne", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(faqs_category_permissions_1.FaqsCategoryPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: faqs_category_dto_1.FaqsCategoryResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto,
        update_faqs_category_dto_1.UpdateFaqsCategoryDto]),
    __metadata("design:returntype", Promise)
], FaqsCategoryController.prototype, "update", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(faqs_category_permissions_1.FaqsCategoryPermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: faqs_category_dto_1.FaqsCategoryResponseObject, isArray: false, description: `Returns the deleted ${moduleName} object if found on the system` }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], FaqsCategoryController.prototype, "remove", null);
FaqsCategoryController = __decorate([
    (0, swagger_1.ApiTags)("faqs-category"),
    (0, common_1.Controller)('faqs-category'),
    __metadata("design:paramtypes", [faqs_category_service_1.FaqsCategoryService])
], FaqsCategoryController);
exports.FaqsCategoryController = FaqsCategoryController;
//# sourceMappingURL=faqs-category.controller.js.map