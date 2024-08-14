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
exports.DiaryController = void 0;
const common_1 = require("@nestjs/common");
const diary_service_1 = require("./diary.service");
const create_diary_dto_1 = require("./dto/create-diary.dto");
const update_diary_dto_1 = require("./dto/update-diary.dto");
const swagger_1 = require("@nestjs/swagger");
const common_types_1 = require("../../common-types/common-types");
const diary_dto_1 = require("./dto/diary.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const diary_permissions_1 = require("./diary.permissions");
const diary_filters_dto_1 = require("./dto/diary-filters.dto");
const common_2 = require("../../helpers/common");
const moduleName = "diary";
let DiaryController = class DiaryController {
    constructor(diaryService) {
        this.diaryService = diaryService;
    }
    async create(createDto, req) {
        try {
            createDto.userId = req.user.userId;
            let data = await this.diaryService.create(createDto);
            return { message: `${moduleName} created successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAll(filters, pagination) {
        try {
            let appliedFilters = this.diaryService.applyFilters(filters);
            let dt = await this.diaryService.findAll(appliedFilters, pagination);
            let tCount = this.diaryService.countRecords(appliedFilters);
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
    async findDiaryReport(filters, pagination, req) {
        try {
            let appliedFilters = this.diaryService.applyFilters(filters);
            let employees = await this.diaryService.findEmployeesUnderUser(req.user);
            let dt = await this.diaryService.findUserReport(appliedFilters, pagination, employees);
            let tCount = this.diaryService.countRecords(appliedFilters);
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
    async findDiaryReportOfUser(filters, pagination, req, params) {
        try {
            if (filters.fromDate && filters.toDate) {
                let days = (0, common_2.getDifferenceInDays)(filters.fromDate, filters.toDate);
                if (days > 30) {
                    throw {
                        message: "You can get report of max 30 days, please use proper pagination",
                        statusCode: 400
                    };
                }
            }
            let appliedFilters = this.diaryService.applyFilters(filters);
            let dt = await this.diaryService.findUserReportByUserId(params.id, appliedFilters);
            let tCount = this.diaryService.countRecords(appliedFilters);
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
            let data = await this.diaryService.findOne(params.id);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async update(params, updateDto) {
        try {
            let data = await this.diaryService.update(params.id, updateDto);
            return { message: `${moduleName}  updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async remove(params) {
        try {
            let data = await this.diaryService.remove(params.id);
            return { message: `${moduleName} deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(diary_permissions_1.DairyPermissionSet.CREATE),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: diary_dto_1.DiaryResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_diary_dto_1.CreateDiaryDto, Object]),
    __metadata("design:returntype", Promise)
], DiaryController.prototype, "create", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(diary_permissions_1.DairyPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: diary_dto_1.DiaryResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [diary_filters_dto_1.DiaryFilters,
        common_types_1.Pagination]),
    __metadata("design:returntype", Promise)
], DiaryController.prototype, "findAll", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(diary_permissions_1.DairyPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: diary_dto_1.DiaryResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)('getReport'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [diary_filters_dto_1.DiaryFilters,
        common_types_1.Pagination, Object]),
    __metadata("design:returntype", Promise)
], DiaryController.prototype, "findDiaryReport", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(diary_permissions_1.DairyPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: diary_dto_1.DiaryResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)('getReport/:id'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [diary_filters_dto_1.DiaryFilters,
        common_types_1.Pagination, Object, common_types_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], DiaryController.prototype, "findDiaryReportOfUser", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(diary_permissions_1.DairyPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: diary_dto_1.DiaryResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], DiaryController.prototype, "findOne", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(diary_permissions_1.DairyPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: diary_dto_1.DiaryResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto,
        update_diary_dto_1.UpdateDiaryDto]),
    __metadata("design:returntype", Promise)
], DiaryController.prototype, "update", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(diary_permissions_1.DairyPermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: diary_dto_1.DiaryResponseObject, isArray: false, description: `Returns the deleted ${moduleName} object if found on the system` }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], DiaryController.prototype, "remove", null);
DiaryController = __decorate([
    (0, swagger_1.ApiTags)("diary"),
    (0, common_1.Controller)('diary'),
    __metadata("design:paramtypes", [diary_service_1.DiaryService])
], DiaryController);
exports.DiaryController = DiaryController;
//# sourceMappingURL=diary.controller.js.map