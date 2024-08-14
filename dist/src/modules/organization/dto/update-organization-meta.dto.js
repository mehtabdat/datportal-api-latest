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
exports.DeleteOrganizationMetaByKeyDto = exports.DeleteOrganizationMetaDto = exports.UpdateOrganizationMetaDto = exports.OrganizationMeta = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const Organization_types_1 = require("../types/Organization.types");
class OrganizationMeta {
}
__decorate([
    (0, swagger_1.ApiProperty)({ enum: Organization_types_1.OrganizationMetaKeys }),
    (0, class_validator_1.IsNotEmpty)({ message: "Please select a key" }),
    (0, class_validator_1.IsEnum)(Organization_types_1.OrganizationMetaKeys),
    __metadata("design:type", Object)
], OrganizationMeta.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please enter a key value" }),
    __metadata("design:type", Object)
], OrganizationMeta.prototype, "value", void 0);
exports.OrganizationMeta = OrganizationMeta;
class UpdateOrganizationMetaDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: OrganizationMeta, isArray: true }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => OrganizationMeta),
    __metadata("design:type", Array)
], UpdateOrganizationMetaDto.prototype, "orgMeta", void 0);
exports.UpdateOrganizationMetaDto = UpdateOrganizationMetaDto;
class DeleteOrganizationMetaDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Organization Meta ID" }),
    (0, class_validator_1.IsNotEmpty)({ message: "Please provide the valid id" }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], DeleteOrganizationMetaDto.prototype, "id", void 0);
exports.DeleteOrganizationMetaDto = DeleteOrganizationMetaDto;
class DeleteOrganizationMetaByKeyDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ enum: Organization_types_1.OrganizationMetaKeys }),
    (0, class_validator_1.IsNotEmpty)({ message: "Please provide the valid id" }),
    (0, class_validator_1.IsEnum)(Organization_types_1.OrganizationMetaKeys),
    __metadata("design:type", Object)
], DeleteOrganizationMetaByKeyDto.prototype, "key", void 0);
exports.DeleteOrganizationMetaByKeyDto = DeleteOrganizationMetaByKeyDto;
//# sourceMappingURL=update-organization-meta.dto.js.map