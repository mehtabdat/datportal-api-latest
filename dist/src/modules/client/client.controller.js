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
exports.ClientController = void 0;
const common_1 = require("@nestjs/common");
const client_service_1 = require("./client.service");
const create_client_dto_1 = require("./dto/create-client.dto");
const update_client_dto_1 = require("./dto/update-client.dto");
const swagger_1 = require("@nestjs/swagger");
const common_types_1 = require("../../common-types/common-types");
const client_dto_1 = require("./dto/client.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const client_permissions_1 = require("./client.permissions");
const client_filters_dto_1 = require("./dto/client-filters.dto");
const moduleName = "client";
let ClientController = class ClientController {
    constructor(clientService) {
        this.clientService = clientService;
    }
    async create(createDto) {
        try {
            let data = await this.clientService.create(createDto);
            return { message: `${moduleName} created successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findPublished(filters, pagination) {
        try {
            let appliedFilters = this.clientService.applyFilters(filters);
            appliedFilters = Object.assign({}, appliedFilters);
            let dt = await this.clientService.findAllPublished(appliedFilters, pagination);
            let tCount = this.clientService.countRecords(appliedFilters);
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
    async findAll(filters, pagination) {
        try {
            let appliedFilters = this.clientService.applyFilters(filters);
            let dt = await this.clientService.findAll(appliedFilters, pagination);
            let tCount = this.clientService.countRecords(appliedFilters);
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
            let data = await this.clientService.findOne(params.id);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async update(params, updateDto) {
        try {
            let data = await this.clientService.update(params.id, updateDto);
            return { message: `${moduleName}  updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async remove(params) {
        try {
            let data = await this.clientService.remove(params.id);
            return { message: `${moduleName} deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(client_permissions_1.ClientPermissionSet.CREATE),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: client_dto_1.ClientResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_client_dto_1.CreateClientDto]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: client_dto_1.ClientResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)('find-published'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [client_filters_dto_1.ClientFiltersDto,
        common_types_1.Pagination]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "findPublished", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(client_permissions_1.ClientPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: client_dto_1.ClientResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [client_filters_dto_1.ClientFiltersDto,
        common_types_1.Pagination]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "findAll", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(client_permissions_1.ClientPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: client_dto_1.ClientResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "findOne", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(client_permissions_1.ClientPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: client_dto_1.ClientResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto,
        update_client_dto_1.UpdateClientDto]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "update", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(client_permissions_1.ClientPermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: client_dto_1.ClientResponseObject, isArray: false, description: `Returns the deleted ${moduleName} object if found on the system` }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "remove", null);
ClientController = __decorate([
    (0, swagger_1.ApiTags)("client"),
    (0, common_1.Controller)('client'),
    __metadata("design:paramtypes", [client_service_1.ClientService])
], ClientController);
exports.ClientController = ClientController;
//# sourceMappingURL=client.controller.js.map