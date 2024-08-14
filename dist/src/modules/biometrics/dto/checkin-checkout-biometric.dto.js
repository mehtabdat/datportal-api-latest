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
exports.CheckInCheckOutBiometricDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const class_transformer_custom_decorator_1 = require("../../../helpers/class-transformer-custom-decorator");
class CheckInCheckOutBiometricDto {
    constructor() {
        this.force = false;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.BiometricsChecksType }),
    (0, class_validator_1.IsNotEmpty)({ message: "Please select check in or out" }),
    (0, class_validator_1.IsEnum)(client_1.BiometricsChecksType),
    __metadata("design:type", String)
], CheckInCheckOutBiometricDto.prototype, "mode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please provide latitude" }),
    (0, class_validator_1.IsLatitude)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CheckInCheckOutBiometricDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_custom_decorator_1.ParseBoolean)(),
    __metadata("design:type", Boolean)
], CheckInCheckOutBiometricDto.prototype, "force", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please provide latitude" }),
    (0, class_validator_1.IsLongitude)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CheckInCheckOutBiometricDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: "file" }),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], CheckInCheckOutBiometricDto.prototype, "selfie", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", Date)
], CheckInCheckOutBiometricDto.prototype, "checkIn", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], CheckInCheckOutBiometricDto.prototype, "userAgent", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], CheckInCheckOutBiometricDto.prototype, "userIP", void 0);
exports.CheckInCheckOutBiometricDto = CheckInCheckOutBiometricDto;
//# sourceMappingURL=checkin-checkout-biometric.dto.js.map