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
exports.getDynamicUploadPath = exports.BiometricsResponseArray = exports.BiometricsResponseObject = void 0;
const swagger_1 = require("@nestjs/swagger");
const biometric_entity_1 = require("../entities/biometric.entity");
const constants_1 = require("../../../config/constants");
class BiometricsResponseObject {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BiometricsResponseObject.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], BiometricsResponseObject.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", biometric_entity_1.Biometric)
], BiometricsResponseObject.prototype, "data", void 0);
exports.BiometricsResponseObject = BiometricsResponseObject;
class BiometricsResponseArray {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BiometricsResponseArray.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], BiometricsResponseArray.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true }),
    __metadata("design:type", biometric_entity_1.Biometric)
], BiometricsResponseArray.prototype, "data", void 0);
exports.BiometricsResponseArray = BiometricsResponseArray;
function getDynamicUploadPath(visibility) {
    let basepath = (visibility === "public") ? "public" : "protected";
    let currentDate = new Date().toISOString().split('T')[0];
    return basepath + '/' + constants_1.ResourcesLocation.selfie + '/' + currentDate;
}
exports.getDynamicUploadPath = getDynamicUploadPath;
//# sourceMappingURL=biometrics.dto.js.map