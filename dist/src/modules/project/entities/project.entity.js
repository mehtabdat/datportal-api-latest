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
exports.ProjectDocumentsTypes = exports.Project = void 0;
const swagger_1 = require("@nestjs/swagger");
class Project {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], Project.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Project.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Project.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], Project.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], Project.prototype, "submissionById", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], Project.prototype, "clientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], Project.prototype, "projectTypeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Project.prototype, "referenceNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Project.prototype, "itemListforApproval", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Project.prototype, "instructions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Project.prototype, "scopeOfWork", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Project.prototype, "projectFilesLink", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], Project.prototype, "components", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], Project.prototype, "authorities", void 0);
exports.Project = Project;
var ProjectDocumentsTypes;
(function (ProjectDocumentsTypes) {
    ProjectDocumentsTypes["drawings"] = "drawings";
    ProjectDocumentsTypes["Requirement Documents"] = "requirement_documents";
    ProjectDocumentsTypes["Structural Drawings"] = "structural_drawings";
    ProjectDocumentsTypes["Interior Design"] = "interior_design";
    ProjectDocumentsTypes["Invoice"] = "invoice";
    ProjectDocumentsTypes["Government Document"] = "government_document";
    ProjectDocumentsTypes["permit"] = "permit";
    ProjectDocumentsTypes["other"] = "other";
})(ProjectDocumentsTypes = exports.ProjectDocumentsTypes || (exports.ProjectDocumentsTypes = {}));
//# sourceMappingURL=project.entity.js.map