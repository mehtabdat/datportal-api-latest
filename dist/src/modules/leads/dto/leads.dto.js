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
exports.LeadsDefaultAttributes = exports.getDynamicUploadPath = exports.LeadsResponseArray = exports.LeadsResponseObject = void 0;
const swagger_1 = require("@nestjs/swagger");
const lead_entity_1 = require("../entities/lead.entity");
const client_1 = require("@prisma/client");
const constants_1 = require("../../../config/constants");
class LeadsResponseObject {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LeadsResponseObject.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], LeadsResponseObject.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", lead_entity_1.Lead)
], LeadsResponseObject.prototype, "data", void 0);
exports.LeadsResponseObject = LeadsResponseObject;
class LeadsResponseArray {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LeadsResponseArray.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], LeadsResponseArray.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true }),
    __metadata("design:type", lead_entity_1.Lead)
], LeadsResponseArray.prototype, "data", void 0);
exports.LeadsResponseArray = LeadsResponseArray;
function getDynamicUploadPath(visibility = client_1.FileVisibility.organization) {
    let basepath = (visibility === client_1.FileVisibility.public) ? "public" : "protected";
    let currentDate = new Date().toISOString().split('T')[0];
    return basepath + '/' + constants_1.ResourcesLocation.enquiry + '/' + currentDate;
}
exports.getDynamicUploadPath = getDynamicUploadPath;
exports.LeadsDefaultAttributes = {
    id: true,
    uuid: true,
    xeroTenantId: true,
    clientId: true
};
//# sourceMappingURL=leads.dto.js.map