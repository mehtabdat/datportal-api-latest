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
exports.UploadUserDocuments = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const user_types_1 = require("../types/user.types");
class UploadUserDocuments {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: "file", isArray: true }),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], UploadUserDocuments.prototype, "file", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true }),
    (0, class_validator_1.IsNotEmpty)({ message: "Please provide user Id" }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UploadUserDocuments.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UploadUserDocuments.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true, enum: user_types_1.UserDocumentsTypes }),
    (0, class_validator_1.IsNotEmpty)({ message: "Please provide document type" }),
    (0, class_validator_1.IsEnum)(user_types_1.UserDocumentsTypes),
    __metadata("design:type", String)
], UploadUserDocuments.prototype, "documentType", void 0);
exports.UploadUserDocuments = UploadUserDocuments;
//# sourceMappingURL=user-document.dto.js.map