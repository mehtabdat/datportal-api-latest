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
exports.BulkUploadFormatResponseArray = exports.BulkUploadFormatResponseObject = void 0;
const swagger_1 = require("@nestjs/swagger");
const bulk_upload_format_entity_1 = require("../entities/bulk-upload-format.entity");
class BulkUploadFormatResponseObject {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BulkUploadFormatResponseObject.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], BulkUploadFormatResponseObject.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", bulk_upload_format_entity_1.BulkUploadFormat)
], BulkUploadFormatResponseObject.prototype, "data", void 0);
exports.BulkUploadFormatResponseObject = BulkUploadFormatResponseObject;
class BulkUploadFormatResponseArray {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BulkUploadFormatResponseArray.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], BulkUploadFormatResponseArray.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true }),
    __metadata("design:type", bulk_upload_format_entity_1.BulkUploadFormat)
], BulkUploadFormatResponseArray.prototype, "data", void 0);
exports.BulkUploadFormatResponseArray = BulkUploadFormatResponseArray;
//# sourceMappingURL=bulk-upload-format.dto.js.map