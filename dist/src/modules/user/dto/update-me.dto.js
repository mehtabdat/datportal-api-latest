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
exports.UpdateMeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const class_validator_custom_decorators_1 = require("../../../helpers/class-validator-custom-decorators");
class UpdateMeDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Validate)(class_validator_custom_decorators_1.ValidateName, { message: "First name cannot contain special characters" }),
    (0, class_validator_1.MinLength)(4, { message: "Too short first name, First name must have at least 4 characters" }),
    (0, class_validator_1.MaxLength)(20, { message: "Too long last name, First name cannot be more than 20 characters" }),
    __metadata("design:type", String)
], UpdateMeDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Validate)(class_validator_custom_decorators_1.ValidateName, { message: "Last name cannot contain special characters" }),
    (0, class_validator_1.MinLength)(1, { message: "Too short last name, Last name must have at least 1 characters" }),
    (0, class_validator_1.MaxLength)(20, { message: "Too long last name, Last name cannot be more than 20 characters" }),
    __metadata("design:type", String)
], UpdateMeDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, type: "file" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], UpdateMeDto.prototype, "profile", void 0);
exports.UpdateMeDto = UpdateMeDto;
//# sourceMappingURL=update-me.dto.js.map