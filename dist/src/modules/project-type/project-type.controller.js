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
exports.ProjectTypeController = void 0;
const common_1 = require("@nestjs/common");
const project_type_service_1 = require("./project-type.service");
const create_project_type_dto_1 = require("./dto/create-project-type.dto");
const update_project_type_dto_1 = require("./dto/update-project-type.dto");
const swagger_1 = require("@nestjs/swagger");
const common_types_1 = require("../../common-types/common-types");
const project_type_dto_1 = require("./dto/project-type.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const project_type_permissions_1 = require("./project-type.permissions");
const project_type_filters_dto_1 = require("./dto/project-type-filters.dto");
const moduleName = "project-type";
let ProjectTypeController = class ProjectTypeController {
    constructor(projectTypeService) {
        this.projectTypeService = projectTypeService;
    }
    async create(createDto) {
        try {
            let data = await this.projectTypeService.create(createDto);
            return { message: `${moduleName} created successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findPublished(filters, pagination) {
        try {
            let appliedFilters = this.projectTypeService.applyFilters(filters);
            appliedFilters = Object.assign(Object.assign({}, appliedFilters), { isPublished: true });
            let dt = await this.projectTypeService.findAllPublished(appliedFilters, pagination);
            let tCount = this.projectTypeService.countFaqs(appliedFilters);
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
    async findBySlug(findBySlugDto) {
        try {
            let data = await this.projectTypeService.findBySlug(findBySlugDto.slug);
            return { message: `${moduleName} fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAll(filters, pagination) {
        try {
            let appliedFilters = this.projectTypeService.applyFilters(filters);
            let dt = await this.projectTypeService.findAll(appliedFilters, pagination);
            let tCount = this.projectTypeService.countFaqs(appliedFilters);
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
            let data = await this.projectTypeService.findOne(params.id);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async update(params, updateDto) {
        try {
            let data = await this.projectTypeService.update(params.id, updateDto);
            return { message: `${moduleName}  updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async remove(params) {
        try {
            let data = await this.projectTypeService.remove(params.id);
            return { message: `${moduleName} deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(project_type_permissions_1.ProjectTypePermissionSet.CREATE),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: project_type_dto_1.ProjectTypeResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_project_type_dto_1.CreateProjectTypeDto]),
    __metadata("design:returntype", Promise)
], ProjectTypeController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: project_type_dto_1.ProjectTypeResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)('find-published'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [project_type_filters_dto_1.ProjectTypeFiltersDto,
        common_types_1.Pagination]),
    __metadata("design:returntype", Promise)
], ProjectTypeController.prototype, "findPublished", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: project_type_dto_1.ProjectTypeResponseObject, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)('find-by-slug/:slug'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.FindBySlugDto]),
    __metadata("design:returntype", Promise)
], ProjectTypeController.prototype, "findBySlug", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(project_type_permissions_1.ProjectTypePermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: project_type_dto_1.ProjectTypeResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [project_type_filters_dto_1.ProjectTypeFiltersDto,
        common_types_1.Pagination]),
    __metadata("design:returntype", Promise)
], ProjectTypeController.prototype, "findAll", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(project_type_permissions_1.ProjectTypePermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: project_type_dto_1.ProjectTypeResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], ProjectTypeController.prototype, "findOne", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(project_type_permissions_1.ProjectTypePermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: project_type_dto_1.ProjectTypeResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto,
        update_project_type_dto_1.UpdateProjectTypeDto]),
    __metadata("design:returntype", Promise)
], ProjectTypeController.prototype, "update", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(project_type_permissions_1.ProjectTypePermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: project_type_dto_1.ProjectTypeResponseObject, isArray: false, description: `Returns the deleted ${moduleName} object if found on the system` }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], ProjectTypeController.prototype, "remove", null);
ProjectTypeController = __decorate([
    (0, swagger_1.ApiTags)("project-type"),
    (0, common_1.Controller)('project-type'),
    __metadata("design:paramtypes", [project_type_service_1.ProjectTypeService])
], ProjectTypeController);
exports.ProjectTypeController = ProjectTypeController;
//# sourceMappingURL=project-type.controller.js.map