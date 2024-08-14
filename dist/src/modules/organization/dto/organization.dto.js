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
exports.OrganizationDefaultAttributes = exports.getDynamicUploadPath = exports.OrganizationResponseArray = exports.OrganizationResponseObject = exports.organizationFileUploadPath = void 0;
const swagger_1 = require("@nestjs/swagger");
const organization_entity_1 = require("../entities/organization.entity");
const constants_1 = require("../../../config/constants");
exports.organizationFileUploadPath = 'public/organization';
class OrganizationResponseObject {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrganizationResponseObject.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrganizationResponseObject.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", organization_entity_1.Organization)
], OrganizationResponseObject.prototype, "data", void 0);
exports.OrganizationResponseObject = OrganizationResponseObject;
class OrganizationResponseArray {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrganizationResponseArray.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrganizationResponseArray.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true }),
    __metadata("design:type", organization_entity_1.Organization)
], OrganizationResponseArray.prototype, "data", void 0);
exports.OrganizationResponseArray = OrganizationResponseArray;
function getDynamicUploadPath(visibility) {
    let basepath = (visibility === "public") ? "public" : "protected";
    let currentDate = new Date().toISOString().split('T')[0];
    return basepath + '/' + constants_1.ResourcesLocation.organization + '/' + currentDate;
}
exports.getDynamicUploadPath = getDynamicUploadPath;
exports.OrganizationDefaultAttributes = {
    id: true,
    uuid: true,
    name: true,
    email: true,
    logo: true,
    phone: true,
    phoneCode: true
};
//# sourceMappingURL=organization.dto.js.map