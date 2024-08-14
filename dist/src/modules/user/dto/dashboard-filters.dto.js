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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardFiltersDto = exports.DashboardDateRange = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var DashboardDateRange;
(function (DashboardDateRange) {
    DashboardDateRange[DashboardDateRange["7_days"] = 0] = "7_days";
    DashboardDateRange[DashboardDateRange["30_days"] = 1] = "30_days";
    DashboardDateRange[DashboardDateRange["60_days"] = 2] = "60_days";
    DashboardDateRange[DashboardDateRange["90_days"] = 3] = "90_days";
    DashboardDateRange[DashboardDateRange["180_days"] = 4] = "180_days";
    DashboardDateRange[DashboardDateRange["365_days"] = 5] = "365_days";
})(DashboardDateRange = exports.DashboardDateRange || (exports.DashboardDateRange = {}));
class DashboardFiltersDto {
    constructor() {
        this.range = '30_days';
    }
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: DashboardDateRange }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(DashboardDateRange),
    __metadata("design:type", Object)
], DashboardFiltersDto.prototype, "range", void 0);
exports.DashboardFiltersDto = DashboardFiltersDto;
//# sourceMappingURL=dashboard-filters.dto.js.map