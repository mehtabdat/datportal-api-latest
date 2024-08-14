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
exports.getDynamicUploadPath = exports.PermitResponseArray = exports.PermitResponseObject = void 0;
const swagger_1 = require("@nestjs/swagger");
const permit_entity_1 = require("../entities/permit.entity");
const client_1 = require("@prisma/client");
const constants_1 = require("../../../config/constants");
class PermitResponseObject {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PermitResponseObject.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PermitResponseObject.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", permit_entity_1.Permit)
], PermitResponseObject.prototype, "data", void 0);
exports.PermitResponseObject = PermitResponseObject;
class PermitResponseArray {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PermitResponseArray.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PermitResponseArray.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true }),
    __metadata("design:type", permit_entity_1.Permit)
], PermitResponseArray.prototype, "data", void 0);
exports.PermitResponseArray = PermitResponseArray;
function getDynamicUploadPath(visibility = client_1.FileVisibility.organization) {
    let basepath = (visibility === client_1.FileVisibility.public) ? "public" : "protected";
    let currentDate = new Date().toISOString().split('T')[0];
    return basepath + '/' + constants_1.ResourcesLocation.permits + '/' + currentDate;
}
exports.getDynamicUploadPath = getDynamicUploadPath;
//# sourceMappingURL=permit.dto.js.map