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
exports.UserAttendanceFilters = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const constants_1 = require("../../../config/constants");
class UserAttendanceFilters {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please select year" }),
    (0, class_validator_1.Min)(2000),
    (0, class_validator_1.Max)(new Date().getFullYear()),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UserAttendanceFilters.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please select month" }),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(11),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UserAttendanceFilters.prototype, "month", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: constants_1.AttendanceEntryType }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsEnum)(constants_1.AttendanceEntryType),
    __metadata("design:type", Object)
], UserAttendanceFilters.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please select user to view the attendance" }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UserAttendanceFilters.prototype, "userId", void 0);
exports.UserAttendanceFilters = UserAttendanceFilters;
//# sourceMappingURL=user-attendance-filters.dto.js.map