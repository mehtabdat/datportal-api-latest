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
exports.ProjectComponentsController = void 0;
const common_1 = require("@nestjs/common");
const project_components_service_1 = require("./project-components.service");
const create_project_component_dto_1 = require("./dto/create-project-component.dto");
const update_project_component_dto_1 = require("./dto/update-project-component.dto");
const swagger_1 = require("@nestjs/swagger");
const common_types_1 = require("../../common-types/common-types");
const project_component_dto_1 = require("./dto/project-component.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const project_component_permissions_1 = require("./project-component.permissions");
const project_component_filters_dto_1 = require("./dto/project-component-filters.dto");
const moduleName = "project-components";
let ProjectComponentsController = class ProjectComponentsController {
    constructor(projectComponentsService) {
        this.projectComponentsService = projectComponentsService;
    }
    async create(createDto) {
        try {
            let data = await this.projectComponentsService.create(createDto);
            return { message: `${moduleName} created successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findPublished(filters, pagination) {
        try {
            let appliedFilters = this.projectComponentsService.applyFilters(filters);
            appliedFilters = Object.assign(Object.assign({}, appliedFilters), { isPublished: true });
            let dt = await this.projectComponentsService.findAllPublished(appliedFilters, pagination);
            let tCount = this.projectComponentsService.countFaqs(appliedFilters);
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
            let data = await this.projectComponentsService.findBySlug(findBySlugDto.slug);
            return { message: `${moduleName} fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAll(filters, pagination) {
        try {
            let appliedFilters = this.projectComponentsService.applyFilters(filters);
            let dt = await this.projectComponentsService.findAll(appliedFilters, pagination);
            let tCount = this.projectComponentsService.countFaqs(appliedFilters);
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
            let data = await this.projectComponentsService.findOne(params.id);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async update(params, updateDto) {
        try {
            let data = await this.projectComponentsService.update(params.id, updateDto);
            return { message: `${moduleName}  updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async remove(params) {
        try {
            let data = await this.projectComponentsService.remove(params.id);
            return { message: `${moduleName} deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(project_component_permissions_1.ProjectComponentPermissionSet.CREATE),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: project_component_dto_1.ProjectComponentResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_project_component_dto_1.CreateProjectComponentDto]),
    __metadata("design:returntype", Promise)
], ProjectComponentsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: project_component_dto_1.ProjectComponentResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)('find-published'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [project_component_filters_dto_1.ProjectComponentFiltersDto,
        common_types_1.Pagination]),
    __metadata("design:returntype", Promise)
], ProjectComponentsController.prototype, "findPublished", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: project_component_dto_1.ProjectComponentResponseObject, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)('find-by-slug/:slug'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.FindBySlugDto]),
    __metadata("design:returntype", Promise)
], ProjectComponentsController.prototype, "findBySlug", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(project_component_permissions_1.ProjectComponentPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: project_component_dto_1.ProjectComponentResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [project_component_filters_dto_1.ProjectComponentFiltersDto,
        common_types_1.Pagination]),
    __metadata("design:returntype", Promise)
], ProjectComponentsController.prototype, "findAll", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(project_component_permissions_1.ProjectComponentPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: project_component_dto_1.ProjectComponentResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], ProjectComponentsController.prototype, "findOne", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(project_component_permissions_1.ProjectComponentPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: project_component_dto_1.ProjectComponentResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto,
        update_project_component_dto_1.UpdateProjectComponentDto]),
    __metadata("design:returntype", Promise)
], ProjectComponentsController.prototype, "update", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(project_component_permissions_1.ProjectComponentPermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: project_component_dto_1.ProjectComponentResponseObject, isArray: false, description: `Returns the deleted ${moduleName} object if found on the system` }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], ProjectComponentsController.prototype, "remove", null);
ProjectComponentsController = __decorate([
    (0, swagger_1.ApiTags)("project-components"),
    (0, common_1.Controller)('project-components'),
    __metadata("design:paramtypes", [project_components_service_1.ProjectComponentsService])
], ProjectComponentsController);
exports.ProjectComponentsController = ProjectComponentsController;
//# sourceMappingURL=project-components.controller.js.map