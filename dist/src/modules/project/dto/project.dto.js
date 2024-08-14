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
exports.ProjectDefaultAttributes = exports.ProjectImagesResponseObject = exports.ProjectResponseArray = exports.ProjectResponseObject = exports.getDynamicUploadPath = exports.ProjectImages = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const project_entity_1 = require("../entities/project.entity");
const constants_1 = require("../../../config/constants");
class ProjectImages {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ProjectImages.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProjectImages.prototype, "uuid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProjectImages.prototype, "file", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProjectImages.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ProjectImages.prototype, "isTemp", void 0);
exports.ProjectImages = ProjectImages;
function getDynamicUploadPath(visibility = client_1.FileVisibility.organization) {
    let basepath = (visibility === client_1.FileVisibility.public) ? "public" : "protected";
    let currentDate = new Date().toISOString().split('T')[0];
    return basepath + '/' + constants_1.ResourcesLocation.projects + '/' + currentDate;
}
exports.getDynamicUploadPath = getDynamicUploadPath;
class ProjectResponseObject {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProjectResponseObject.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ProjectResponseObject.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", project_entity_1.Project)
], ProjectResponseObject.prototype, "data", void 0);
exports.ProjectResponseObject = ProjectResponseObject;
class ProjectResponseArray {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProjectResponseArray.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ProjectResponseArray.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true }),
    __metadata("design:type", project_entity_1.Project)
], ProjectResponseArray.prototype, "data", void 0);
exports.ProjectResponseArray = ProjectResponseArray;
class ProjectImagesResponseObject {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProjectImagesResponseObject.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ProjectImagesResponseObject.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", ProjectImages)
], ProjectImagesResponseObject.prototype, "data", void 0);
exports.ProjectImagesResponseObject = ProjectImagesResponseObject;
exports.ProjectDefaultAttributes = {
    id: true,
    slug: true,
    title: true,
    referenceNumber: true
};
//# sourceMappingURL=project.dto.js.map