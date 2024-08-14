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
exports.AttendanceController = void 0;
const common_1 = require("@nestjs/common");
const attendance_service_1 = require("./attendance.service");
const create_attendance_dto_1 = require("./dto/create-attendance.dto");
const update_attendance_dto_1 = require("./dto/update-attendance.dto");
const swagger_1 = require("@nestjs/swagger");
const common_types_1 = require("../../common-types/common-types");
const attendance_dto_1 = require("./dto/attendance.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const attendance_permissions_1 = require("./attendance.permissions");
const attendance_filters_dto_1 = require("./dto/attendance-filters.dto");
const user_attendance_filters_dto_1 = require("./dto/user-attendance-filters.dto");
const attendance_sorting_dto_1 = require("./dto/attendance-sorting.dto");
const attendance_authorization_service_1 = require("./attendance.authorization.service");
const common_2 = require("../../helpers/common");
const generate_report_dto_1 = require("./dto/generate-report.dto");
const fs = require("fs");
const moduleName = "attendance";
let AttendanceController = class AttendanceController {
    constructor(attendanceService, authorizationService) {
        this.attendanceService = attendanceService;
        this.authorizationService = authorizationService;
    }
    async create(createDto, req) {
        try {
            let data = await this.attendanceService.create(createDto, req.user);
            return { message: `${moduleName} created successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async triggerBulkAttendanceCalculation() {
        try {
            let data = this.attendanceService.triggerBulkAttendanceCalculation();
            return { message: `Process started successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAll(filters, req, pagination) {
        try {
            let permissions = await this.authorizationService.findUserPermissionsAgainstSlugs(req.user, [attendance_permissions_1.AttendancePermissionSet.READ_ALL]);
            if (!permissions.readAllAttendance) {
                filters.userId = req.user.userId;
            }
            let appliedFilters = this.attendanceService.applyFilters(filters);
            let dt = await this.attendanceService.findAll(appliedFilters, pagination, { 'sortByField': 'addedDate', 'sortOrder': 'desc' });
            let tCount = this.attendanceService.countRecords(appliedFilters);
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
    async findUserAttendance(filters, sorting, req) {
        try {
            let permissions = await this.authorizationService.findUserPermissionsAgainstSlugs(req.user, [attendance_permissions_1.AttendancePermissionSet.READ_ALL]);
            if (!permissions.readAllAttendance) {
                filters.userId = req.user.userId;
            }
            let userData = await this.attendanceService.validateUser(filters.userId);
            let appliedFilters = this.attendanceService.applyFilters(filters);
            let publicHolidayFilters = this.attendanceService.applyFiltersPublicHolidays(filters);
            let leaveRequestFilters = this.attendanceService.leaveRequestFilters(filters);
            let __organizationData = this.attendanceService.findOrganization(userData.organizationId);
            let __publicHolidays = this.attendanceService.findPublicHolidays(publicHolidayFilters);
            let __approvedLeaveRequest = this.attendanceService.findApprovedLeaveRequest(leaveRequestFilters);
            let __userAttendance = this.attendanceService.findAll(appliedFilters, { page: 1, perPage: 32 }, sorting);
            const [publicHolidays, userAttendance, approvedLeaveRequest, organizationData] = await Promise.all([__publicHolidays, __userAttendance, __approvedLeaveRequest, __organizationData]);
            if (!organizationData.WorkingHours) {
                throw {
                    message: "No Working Hours Defined for the Company. Please assign working hour and try again",
                    statusCode: 400
                };
            }
            let attendanceData = this.attendanceService.prepareAttendance(userAttendance, publicHolidays, filters, organizationData.WorkingHours);
            return { message: `${moduleName} fetched Successfully`, statusCode: 200, data: {
                    publicHolidays: publicHolidays,
                    leaves: approvedLeaveRequest,
                    attendanceData: attendanceData,
                    workingHour: organizationData.WorkingHours
                },
            };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findUserAttendanceForPayroll(filters, sorting, req) {
        try {
            let permissions = await this.authorizationService.findUserPermissionsAgainstSlugs(req.user, [attendance_permissions_1.AttendancePermissionSet.READ_ALL]);
            if (!permissions.readAllAttendance) {
                filters.userId = req.user.userId;
            }
            if (!filters.fromDate || !filters.toDate || !filters.userId) {
                throw {
                    message: "fromDate, toDate or userId is missing",
                    statusCode: 400
                };
            }
            if (filters.fromDate > filters.toDate) {
                throw {
                    message: "fromDate cannot be greater than toDate",
                    statusCode: 400
                };
            }
            let daysDifference = Math.abs((0, common_2.getDifferenceInDays)(filters.fromDate, filters.toDate));
            if (daysDifference > 45) {
                throw {
                    message: "Days difference cannot be greater than 45 days",
                    statusCode: 400
                };
            }
            let userData = await this.attendanceService.validateUser(filters.userId);
            let appliedFilters = this.attendanceService.applyFilters(filters);
            let publicHolidayFilters = this.attendanceService.applyFiltersPublicHolidays(filters);
            let leaveRequestFilters = this.attendanceService.leaveRequestFilters(filters);
            let __publicHolidays = this.attendanceService.findPublicHolidays(publicHolidayFilters);
            let __organizationData = this.attendanceService.findOrganization(userData.organizationId);
            let __approvedLeaveRequest = this.attendanceService.findApprovedLeaveRequest(leaveRequestFilters);
            let __userAttendance = this.attendanceService.findAll(appliedFilters, { page: 1, perPage: 32 }, sorting);
            const [publicHolidays, userAttendance, approvedLeaveRequest, organizationData] = await Promise.all([__publicHolidays, __userAttendance, __approvedLeaveRequest, __organizationData]);
            if (!organizationData.WorkingHours) {
                throw {
                    message: "No Working Hours Defined for the Company of the User. Please assign working hour and try again",
                    statusCode: 400
                };
            }
            let attendanceData = this.attendanceService.prepareAttendanceFromD1ToD2(userAttendance, publicHolidays, filters, organizationData.WorkingHours);
            return { message: `${moduleName} fetched Successfully`, statusCode: 200, data: {
                    publicHolidays: publicHolidays,
                    leaves: approvedLeaveRequest,
                    attendanceData: attendanceData
                },
            };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async generateReport(reportDto, res) {
        try {
            let data = await this.attendanceService.generateReport(reportDto);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=${data.fileName}`);
            const fileStream = fs.createReadStream(data.filePath);
            fileStream.pipe(res);
            fileStream.on('end', () => {
                fs.unlinkSync(data.filePath);
            });
            return;
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findOne(params, req) {
        try {
            await this.authorizationService.isAuthorizedForAttendance(params.id, req.user);
            let data = await this.attendanceService.findOne(params.id);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async update(params, updateDto, req) {
        try {
            let data = await this.attendanceService.update(params.id, updateDto, req.user);
            return { message: `${moduleName}  updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async delete(params) {
        try {
            let data = await this.attendanceService.remove(params.id);
            return { message: `${moduleName}  deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(attendance_permissions_1.AttendancePermissionSet.CREATE),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: attendance_dto_1.AttendanceResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_attendance_dto_1.CreateAttendanceDto, Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "create", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(attendance_permissions_1.AttendancePermissionSet.READ_ALL),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: attendance_dto_1.AttendanceResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)('triggerBulkAttendanceCalculation'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "triggerBulkAttendanceCalculation", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(attendance_permissions_1.AttendancePermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: attendance_dto_1.AttendanceResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attendance_filters_dto_1.AttendanceFilters, Object, common_types_1.Pagination]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "findAll", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(attendance_permissions_1.AttendancePermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: attendance_dto_1.AttendanceResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)('getUserAttendance'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_attendance_filters_dto_1.UserAttendanceFilters,
        attendance_sorting_dto_1.AttendanceSortingDto, Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "findUserAttendance", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(attendance_permissions_1.AttendancePermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: attendance_dto_1.AttendanceResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)('findUserAttendanceForPayroll'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attendance_filters_dto_1.AttendanceFilters,
        attendance_sorting_dto_1.AttendanceSortingDto, Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "findUserAttendanceForPayroll", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(attendance_permissions_1.AttendancePermissionSet.GENERATE_REPORT),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: attendance_dto_1.AttendanceResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Post)('generateReport'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [generate_report_dto_1.GenerateAttendanceReport, Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "generateReport", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(attendance_permissions_1.AttendancePermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: attendance_dto_1.AttendanceResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "findOne", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(attendance_permissions_1.AttendancePermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: attendance_dto_1.AttendanceResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto,
        update_attendance_dto_1.UpdateAttendanceDto, Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "update", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(attendance_permissions_1.AttendancePermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: attendance_dto_1.AttendanceResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "delete", null);
AttendanceController = __decorate([
    (0, swagger_1.ApiTags)("attendance"),
    (0, common_1.Controller)('attendance'),
    __metadata("design:paramtypes", [attendance_service_1.AttendanceService, attendance_authorization_service_1.AttendanceAuthorizationService])
], AttendanceController);
exports.AttendanceController = AttendanceController;
//# sourceMappingURL=attendance.controller.js.map