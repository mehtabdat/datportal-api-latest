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
exports.InvoiceStatusDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const constants_1 = require("../../../config/constants");
const class_transformer_custom_decorator_1 = require("../../../helpers/class-transformer-custom-decorator");
const InvoiceStatusAccepted = [constants_1.InvoiceStatus.sent, constants_1.InvoiceStatus.paid, constants_1.InvoiceStatus.canceled];
class InvoiceStatusDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ enum: InvoiceStatusAccepted }),
    (0, class_validator_1.IsNotEmpty)({ message: "Please choose a status" }),
    (0, class_validator_1.IsEnum)(InvoiceStatusAccepted),
    __metadata("design:type", Number)
], InvoiceStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_custom_decorator_1.ParseBoolean)(),
    __metadata("design:type", Boolean)
], InvoiceStatusDto.prototype, "resumeProject", void 0);
exports.InvoiceStatusDto = InvoiceStatusDto;
//# sourceMappingURL=invoice-status.dto.js.map