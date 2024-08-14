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
exports.CreateLeaveTypeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const class_transformer_custom_decorator_1 = require("../../../helpers/class-transformer-custom-decorator");
class CreateLeaveTypeDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please provide a valid title" }),
    __metadata("design:type", String)
], CreateLeaveTypeDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_custom_decorator_1.SlugifyString)(),
    __metadata("design:type", String)
], CreateLeaveTypeDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_custom_decorator_1.ParseBoolean)(),
    __metadata("design:type", Boolean)
], CreateLeaveTypeDto.prototype, "isPaid", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_custom_decorator_1.ParseBoolean)(),
    __metadata("design:type", Boolean)
], CreateLeaveTypeDto.prototype, "isPublished", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.isPaid),
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please enter how many leaves are paid in a month or year" }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateLeaveTypeDto.prototype, "threshold", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.isPaid),
    (0, swagger_1.ApiProperty)({ enum: client_1.ThresholdType }),
    (0, class_validator_1.IsNotEmpty)({ message: "Please choose if threshold is monthly or yearly" }),
    (0, class_validator_1.IsEnum)(client_1.ThresholdType),
    __metadata("design:type", String)
], CreateLeaveTypeDto.prototype, "thresholdType", void 0);
exports.CreateLeaveTypeDto = CreateLeaveTypeDto;
//# sourceMappingURL=create-leave-type.dto.js.map