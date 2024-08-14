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
exports.systemModulesIconUploadPath = exports.SystemModuleResponseArray = exports.SystemModuleResponseObject = exports.SystemModuleDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const update_system_module_dto_1 = require("./update-system-module.dto");
class SystemModuleDto extends update_system_module_dto_1.UpdateSystemModuleDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SystemModuleDto.prototype, "id", void 0);
exports.SystemModuleDto = SystemModuleDto;
class SystemModuleResponseObject {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SystemModuleResponseObject.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SystemModuleResponseObject.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", SystemModuleDto)
], SystemModuleResponseObject.prototype, "data", void 0);
exports.SystemModuleResponseObject = SystemModuleResponseObject;
class SystemModuleResponseArray {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SystemModuleResponseArray.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SystemModuleResponseArray.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true }),
    __metadata("design:type", SystemModuleDto)
], SystemModuleResponseArray.prototype, "data", void 0);
exports.SystemModuleResponseArray = SystemModuleResponseArray;
exports.systemModulesIconUploadPath = '/public/modules/';
//# sourceMappingURL=system-modules.dto.js.map