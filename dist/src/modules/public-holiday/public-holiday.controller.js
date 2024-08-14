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
exports.PublicHolidayController = void 0;
const common_1 = require("@nestjs/common");
const public_holiday_service_1 = require("./public-holiday.service");
const create_public_holiday_dto_1 = require("./dto/create-public-holiday.dto");
const update_public_holiday_dto_1 = require("./dto/update-public-holiday.dto");
const swagger_1 = require("@nestjs/swagger");
const common_types_1 = require("../../common-types/common-types");
const public_holiday_dto_1 = require("./dto/public-holiday.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const public_holiday_permissions_1 = require("./public-holiday.permissions");
const public_holiday_filters_dto_1 = require("./dto/public-holiday-filters.dto");
const moduleName = "public-holiday";
let PublicHolidayController = class PublicHolidayController {
    constructor(publicHolidayService) {
        this.publicHolidayService = publicHolidayService;
    }
    async create(createDto, req) {
        try {
            let data = await this.publicHolidayService.create(createDto, req.user);
            return { message: `${moduleName} created successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAll(filters, pagination) {
        try {
            let appliedFilters = this.publicHolidayService.applyFilters(filters);
            let dt = await this.publicHolidayService.findAll(appliedFilters, pagination);
            let tCount = this.publicHolidayService.countRecords(appliedFilters);
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
            let data = await this.publicHolidayService.findOne(params.id);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async update(params, updateDto) {
        try {
            let data = await this.publicHolidayService.update(params.id, updateDto);
            return { message: `${moduleName}  updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async delete(params) {
        try {
            let data = await this.publicHolidayService.delete(params.id);
            return { message: `${moduleName}  deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(public_holiday_permissions_1.PublicHolidayPermissionSet.CREATE),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: public_holiday_dto_1.PublicHolidayResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_public_holiday_dto_1.CreatePublicHolidayDto, Object]),
    __metadata("design:returntype", Promise)
], PublicHolidayController.prototype, "create", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(public_holiday_permissions_1.PublicHolidayPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: public_holiday_dto_1.PublicHolidayResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [public_holiday_filters_dto_1.PublicHolidayFilters,
        common_types_1.Pagination]),
    __metadata("design:returntype", Promise)
], PublicHolidayController.prototype, "findAll", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(public_holiday_permissions_1.PublicHolidayPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: public_holiday_dto_1.PublicHolidayResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], PublicHolidayController.prototype, "findOne", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(public_holiday_permissions_1.PublicHolidayPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: public_holiday_dto_1.PublicHolidayResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto,
        update_public_holiday_dto_1.UpdatePublicHolidayDto]),
    __metadata("design:returntype", Promise)
], PublicHolidayController.prototype, "update", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(public_holiday_permissions_1.PublicHolidayPermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: public_holiday_dto_1.PublicHolidayResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], PublicHolidayController.prototype, "delete", null);
PublicHolidayController = __decorate([
    (0, swagger_1.ApiTags)("public-holiday"),
    (0, common_1.Controller)('public-holiday'),
    __metadata("design:paramtypes", [public_holiday_service_1.PublicHolidayService])
], PublicHolidayController);
exports.PublicHolidayController = PublicHolidayController;
//# sourceMappingURL=public-holiday.controller.js.map