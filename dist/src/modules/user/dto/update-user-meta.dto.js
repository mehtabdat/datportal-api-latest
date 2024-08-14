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
exports.DeleteUserMetaByKeyDto = exports.DeleteUserMetaDto = exports.UpdateUserMetaDto = exports.UserMeta = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const user_types_1 = require("../types/user.types");
class UserMeta {
}
__decorate([
    (0, swagger_1.ApiProperty)({ enum: user_types_1.UserMetaKeys }),
    (0, class_validator_1.IsNotEmpty)({ message: "Please select a key" }),
    (0, class_validator_1.IsEnum)(user_types_1.UserMetaKeys),
    __metadata("design:type", Object)
], UserMeta.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please enter a key value" }),
    __metadata("design:type", Object)
], UserMeta.prototype, "value", void 0);
exports.UserMeta = UserMeta;
class UpdateUserMetaDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: UserMeta, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => UserMeta),
    __metadata("design:type", Array)
], UpdateUserMetaDto.prototype, "userMeta", void 0);
exports.UpdateUserMetaDto = UpdateUserMetaDto;
class DeleteUserMetaDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User Meta ID" }),
    (0, class_validator_1.IsNotEmpty)({ message: "Please provide the valid id" }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], DeleteUserMetaDto.prototype, "id", void 0);
exports.DeleteUserMetaDto = DeleteUserMetaDto;
class DeleteUserMetaByKeyDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ enum: user_types_1.UserMetaKeys }),
    (0, class_validator_1.IsNotEmpty)({ message: "Please provide the valid id" }),
    (0, class_validator_1.IsEnum)(user_types_1.UserMetaKeys),
    __metadata("design:type", Object)
], DeleteUserMetaByKeyDto.prototype, "key", void 0);
exports.DeleteUserMetaByKeyDto = DeleteUserMetaByKeyDto;
//# sourceMappingURL=update-user-meta.dto.js.map