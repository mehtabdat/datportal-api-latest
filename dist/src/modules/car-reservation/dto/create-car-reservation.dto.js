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
exports.CreateCarReservationRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const class_validator_custom_decorators_1 = require("../../../helpers/class-validator-custom-decorators");
class CreateCarReservationRequestDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please provide when you want book comapny car" }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_custom_decorators_1.IsDateGreaterThanToday)(),
    __metadata("design:type", Object)
], CreateCarReservationRequestDto.prototype, "fromDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please provide upto when you will be taking a car" }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_custom_decorators_1.IsDateGreaterThan)('fromDate', { message: "To date must be greater than From Date" }),
    __metadata("design:type", Object)
], CreateCarReservationRequestDto.prototype, "toDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please write your purpose" }),
    __metadata("design:type", String)
], CreateCarReservationRequestDto.prototype, "purpose", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateCarReservationRequestDto.prototype, "projectId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, type: "file", isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", Object)
], CreateCarReservationRequestDto.prototype, "files", void 0);
exports.CreateCarReservationRequestDto = CreateCarReservationRequestDto;
//# sourceMappingURL=create-car-reservation.dto.js.map