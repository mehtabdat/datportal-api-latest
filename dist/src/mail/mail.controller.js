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
exports.MailController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const authorization_decorator_1 = require("../authorization/authorization-decorator");
const mail_logs_filters_dto_1 = require("./dto/mail-logs-filters.dto");
const mail_logs_pagination_dto_1 = require("./dto/mail-logs-pagination.dto");
const mail_logs_sorting_dto_1 = require("./dto/mail-logs-sorting.dto");
const mail_permissions_1 = require("./mail.permissions");
const mail_service_1 = require("./mail.service");
let MailController = class MailController {
    constructor(mailService) {
        this.mailService = mailService;
    }
    async readMailSentLogs(filters, pagination, sorting) {
        try {
            let filtersApplied = this.mailService.applyFilters(filters);
            let dt = this.mailService.findMailSentLogs(pagination, sorting, filtersApplied);
            let tCount = this.mailService.countTotalRecord(filtersApplied);
            const [data, totalCount] = await Promise.all([dt, tCount]);
            let pageCount = Math.floor(totalCount / pagination.perPage) + ((totalCount % pagination.perPage) === 0 ? 0 : 1);
            return { message: `Mail logs fetched successfully`, statusCode: 200, data: data,
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
    (0, authorization_decorator_1.CheckPermissions)(mail_permissions_1.MailPermissionSet.READ_LOGS),
    (0, swagger_1.ApiOperation)({ summary: "Finds Mails Sent history" }),
    (0, common_1.Get)('readMailSentLogs'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mail_logs_filters_dto_1.MailLogsFiltersDto,
        mail_logs_pagination_dto_1.MailLogsPaginationDto,
        mail_logs_sorting_dto_1.MailLogsSortingDto]),
    __metadata("design:returntype", Promise)
], MailController.prototype, "readMailSentLogs", null);
MailController = __decorate([
    (0, common_1.Controller)('mail'),
    __metadata("design:paramtypes", [mail_service_1.MailService])
], MailController);
exports.MailController = MailController;
//# sourceMappingURL=mail.controller.js.map