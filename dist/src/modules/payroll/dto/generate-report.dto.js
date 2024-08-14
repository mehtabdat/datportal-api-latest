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
exports.GeneratePayrollReport = exports.PayrollReportType = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
var PayrollReportType;
(function (PayrollReportType) {
    PayrollReportType["all"] = "all";
    PayrollReportType["users"] = "users";
    PayrollReportType["department"] = "department";
    PayrollReportType["organization"] = "organization";
})(PayrollReportType = exports.PayrollReportType || (exports.PayrollReportType = {}));
class GeneratePayrollReport {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please choose payroll cycle" }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], GeneratePayrollReport.prototype, "payrollCycleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: PayrollReportType }),
    (0, class_validator_1.IsNotEmpty)({ message: "Please choose report type" }),
    (0, class_validator_1.IsEnum)(PayrollReportType),
    __metadata("design:type", String)
], GeneratePayrollReport.prototype, "reportType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.ValidateIf)((ele) => ele.reportType === PayrollReportType.users),
    (0, class_validator_1.IsNotEmpty)({ message: "Please select some user" }),
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Array)
], GeneratePayrollReport.prototype, "userIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.ValidateIf)((ele) => ele.reportType === PayrollReportType.department),
    (0, class_validator_1.IsNotEmpty)({ message: "Please select department" }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], GeneratePayrollReport.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.ValidateIf)((ele) => ele.reportType === PayrollReportType.organization),
    (0, class_validator_1.IsNotEmpty)({ message: "Please choose organization" }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], GeneratePayrollReport.prototype, "organizationId", void 0);
exports.GeneratePayrollReport = GeneratePayrollReport;
//# sourceMappingURL=generate-report.dto.js.map