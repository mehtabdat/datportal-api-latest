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
exports.SystemLogsController = void 0;
const common_1 = require("@nestjs/common");
const system_logs_service_1 = require("./system-logs.service");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const system_logs_permissions_1 = require("./system-logs.permissions");
const swagger_1 = require("@nestjs/swagger");
const system_logs_filters_dto_1 = require("./dto/system-logs-filters.dto");
const system_logs_pagination_dto_1 = require("./dto/system-logs-pagination.dto");
const system_logs_sorting_dto_1 = require("./dto/system-logs-sorting.dto");
let SystemLogsController = class SystemLogsController {
    constructor(systemLogsService) {
        this.systemLogsService = systemLogsService;
    }
    async readSystemLogs(filters, pagination, sorting) {
        try {
            let filtersApplied = this.systemLogsService.applyFilters(filters);
            let dt = this.systemLogsService.findSystemLogs(pagination, sorting, filtersApplied);
            let tCount = this.systemLogsService.countTotalRecord(filtersApplied);
            const [data, totalCount] = await Promise.all([dt, tCount]);
            let pageCount = Math.floor(totalCount / pagination.perPage) + ((totalCount % pagination.perPage) === 0 ? 0 : 1);
            return { message: `System logs fetched successfully`, statusCode: 200, data: data,
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
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(system_logs_permissions_1.SystemLogsPermissionSet.READ_LOGS),
    (0, swagger_1.ApiOperation)({ summary: "Finds Systems  history" }),
    (0, common_1.Get)('readSystemLogs'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [system_logs_filters_dto_1.SystemLogsFiltersDto,
        system_logs_pagination_dto_1.SystemLogsPaginationDto,
        system_logs_sorting_dto_1.SystemLogsSortingDto]),
    __metadata("design:returntype", Promise)
], SystemLogsController.prototype, "readSystemLogs", null);
SystemLogsController = __decorate([
    (0, common_1.Controller)('system-logs'),
    __metadata("design:paramtypes", [system_logs_service_1.SystemLogsService])
], SystemLogsController);
exports.SystemLogsController = SystemLogsController;
//# sourceMappingURL=system-logs.controller.js.map