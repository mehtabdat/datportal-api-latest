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
exports.SavedSearchesController = void 0;
const common_1 = require("@nestjs/common");
const saved_searches_service_1 = require("./saved-searches.service");
const create_saved_search_dto_1 = require("./dto/create-saved-search.dto");
const swagger_1 = require("@nestjs/swagger");
const params_dto_1 = require("./dto/params.dto");
const saved_searches_dto_1 = require("./dto/saved-searches.dto");
const saved_searches_permissions_1 = require("./saved-searches.permissions");
const saved_searches_filters_dto_1 = require("./dto/saved-searches-filters.dto");
const saved_searches_pagination_dto_1 = require("./dto/saved-searches-pagination.dto");
const saved_searches_sorting_dto_1 = require("./dto/saved-searches-sorting.dto");
const authorization_service_1 = require("../../authorization/authorization.service");
const create_saved_search_admin_dto_1 = require("./dto/create-saved-search-admin.dto");
const saved_searches_admin_filters_dto_1 = require("./dto/saved-searches-admin-filters.dto");
const moduleName = "saved-searches";
let SavedSearchesController = class SavedSearchesController {
    constructor(savedSearchesService, authorizationService) {
        this.savedSearchesService = savedSearchesService;
        this.authorizationService = authorizationService;
    }
    async create(createAlertDto, req) {
        try {
            createAlertDto['userId'] = req.user.userId;
            let data = await this.savedSearchesService.create(createAlertDto);
            return { message: `${moduleName} created successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async createFilters(createAlertDto, req) {
        try {
            if (createAlertDto.visibility === 'global') {
                let hasPermission = await this.authorizationService.checkIfUserAuthorized(req.user, [saved_searches_permissions_1.SavedSearchesPermissionSet.CREATE_GLOBAL]);
                if (!hasPermission) {
                    throw { message: "You don't have enough permission to add global filters", statusCode: 403 };
                }
            }
            let data = await this.savedSearchesService.createAdminpanelFilters(createAlertDto, req.user);
            return { message: `${moduleName} created successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAllAdminpanel(req, filters, pagination, sorting) {
        try {
            let appliedFilters = this.savedSearchesService.applyAdminFilters(filters);
            appliedFilters = Object.assign(Object.assign({}, appliedFilters), { forAdminpanel: true, AND: {
                    OR: [
                        {
                            userId: req.user.userId,
                            visibility: 'self',
                        },
                        {
                            visibility: 'global'
                        }
                    ]
                } });
            let dt = this.savedSearchesService.findAll(appliedFilters, pagination, sorting);
            let tCount = this.savedSearchesService.countSavedSearches(appliedFilters);
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
    async findAll(req, filters, pagination, sorting) {
        try {
            let appliedFilters = this.savedSearchesService.applyFilters(filters);
            appliedFilters = Object.assign(Object.assign({}, appliedFilters), { userId: req.user.userId, visibility: 'self', forAdminpanel: false });
            let dt = this.savedSearchesService.findAll(appliedFilters, pagination, sorting);
            let tCount = this.savedSearchesService.countSavedSearches(appliedFilters);
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
    async findOne(params, req) {
        try {
            await this.authorizationService.checkIfUserAuthorizedForSavedSearches(req.user, params.id);
            let data = await this.savedSearchesService.findOne(params.id, req.user);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async removeAll(req) {
        try {
            let data = await this.savedSearchesService.removeAllSavedSearches(req.user.userId, false);
            return { message: `${moduleName} deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async removeAllAdminpanelFilters(req) {
        try {
            let data = await this.savedSearchesService.removeAllSavedSearches(req.user.userId, true);
            return { message: `${moduleName} deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async remove(params, req) {
        try {
            let savedSearch = await this.savedSearchesService.findOneById(params.id);
            if (savedSearch.visibility === 'global') {
                let hasPermission = await this.authorizationService.checkIfUserAuthorized(req.user, [saved_searches_permissions_1.SavedSearchesPermissionSet.DELETE_GLOBAL]);
                if (!hasPermission) {
                    throw { message: "You don't have enough permission to delete a global filter", statusCode: 403 };
                }
            }
            else if (savedSearch.visibility === 'organization') {
                let hasPermission = await this.authorizationService.checkIfUserAuthorized(req.user, [saved_searches_permissions_1.SavedSearchesPermissionSet.DELETE_ORGANIZATION]);
                if (!hasPermission) {
                    throw { message: "You don't have enough permission to delete a organization filter", statusCode: 403 };
                }
                await this.authorizationService.checkIfUserAuthorizedForSavedSearches(req.user, params.id);
            }
            else {
                await this.authorizationService.checkIfUserAuthorizedForSavedSearches(req.user, params.id);
            }
            let data = await this.savedSearchesService.remove(params.id);
            return { message: `${moduleName} deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: saved_searches_dto_1.SavedSearchesResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_saved_search_dto_1.CreateSavedSearchDto, Object]),
    __metadata("design:returntype", Promise)
], SavedSearchesController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: saved_searches_dto_1.SavedSearchesResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.Post)('admin'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_saved_search_admin_dto_1.CreateAdminSavedSearchDto, Object]),
    __metadata("design:returntype", Promise)
], SavedSearchesController.prototype, "createFilters", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName}(s) in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: saved_searches_dto_1.SavedSearchesResponseArray, isArray: false, description: `Return a list of ${moduleName}(s) available` }),
    (0, common_1.Get)('findAdminPanelFilters'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, saved_searches_admin_filters_dto_1.SavedSearchesAdminFiltersDto,
        saved_searches_pagination_dto_1.SavedSearchesPaginationDto,
        saved_searches_sorting_dto_1.SavedSearchesSortingDto]),
    __metadata("design:returntype", Promise)
], SavedSearchesController.prototype, "findAllAdminpanel", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName}(s) in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: saved_searches_dto_1.SavedSearchesResponseArray, isArray: false, description: `Return a list of ${moduleName}(s) available` }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, saved_searches_filters_dto_1.SavedSearchesFiltersDto,
        saved_searches_pagination_dto_1.SavedSearchesPaginationDto,
        saved_searches_sorting_dto_1.SavedSearchesSortingDto]),
    __metadata("design:returntype", Promise)
], SavedSearchesController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: saved_searches_dto_1.SavedSearchesResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], SavedSearchesController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: saved_searches_dto_1.SavedSearchesResponseObject, isArray: false, description: `Returns the deleted ${moduleName} object if found on the system` }),
    (0, common_1.Delete)('all'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SavedSearchesController.prototype, "removeAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: saved_searches_dto_1.SavedSearchesResponseObject, isArray: false, description: `Returns the deleted ${moduleName} object if found on the system` }),
    (0, common_1.Delete)('all-adminpanel-saved-searches'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SavedSearchesController.prototype, "removeAllAdminpanelFilters", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: saved_searches_dto_1.SavedSearchesResponseObject, isArray: false, description: `Returns the deleted ${moduleName} object if found on the system` }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], SavedSearchesController.prototype, "remove", null);
SavedSearchesController = __decorate([
    (0, swagger_1.ApiTags)("saved-searches"),
    (0, common_1.Controller)('saved-searches'),
    __metadata("design:paramtypes", [saved_searches_service_1.SavedSearchesService, authorization_service_1.AuthorizationService])
], SavedSearchesController);
exports.SavedSearchesController = SavedSearchesController;
//# sourceMappingURL=saved-searches.controller.js.map