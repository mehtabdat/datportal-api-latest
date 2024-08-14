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
exports.UploadProjectFiles = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const project_entity_1 = require("../entities/project.entity");
class UploadProjectFiles {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: "file" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], UploadProjectFiles.prototype, "files", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], UploadProjectFiles.prototype, "file", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true }),
    (0, class_validator_1.IsNotEmpty)({ message: "Please provide property Id" }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UploadProjectFiles.prototype, "projectId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true, enum: project_entity_1.ProjectDocumentsTypes }),
    (0, class_validator_1.IsNotEmpty)({ message: "Please provide document type" }),
    (0, class_validator_1.IsEnum)(project_entity_1.ProjectDocumentsTypes),
    __metadata("design:type", String)
], UploadProjectFiles.prototype, "documentType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UploadProjectFiles.prototype, "title", void 0);
exports.UploadProjectFiles = UploadProjectFiles;
//# sourceMappingURL=upload-files.dto.js.map