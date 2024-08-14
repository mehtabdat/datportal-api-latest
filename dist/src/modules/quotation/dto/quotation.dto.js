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
exports.getDynamicUploadPath = exports.QuotationResponseArray = exports.QuotationResponseObject = void 0;
const swagger_1 = require("@nestjs/swagger");
const quotation_entity_1 = require("../entities/quotation.entity");
const constants_1 = require("../../../config/constants");
class QuotationResponseObject {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], QuotationResponseObject.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], QuotationResponseObject.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", quotation_entity_1.Quotation)
], QuotationResponseObject.prototype, "data", void 0);
exports.QuotationResponseObject = QuotationResponseObject;
class QuotationResponseArray {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], QuotationResponseArray.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], QuotationResponseArray.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true }),
    __metadata("design:type", quotation_entity_1.Quotation)
], QuotationResponseArray.prototype, "data", void 0);
exports.QuotationResponseArray = QuotationResponseArray;
function getDynamicUploadPath() {
    let basepath = "protected";
    let currentDate = new Date().toISOString().split('T')[0];
    return basepath + '/' + constants_1.ResourcesLocation.quotation + '/' + currentDate;
}
exports.getDynamicUploadPath = getDynamicUploadPath;
//# sourceMappingURL=quotation.dto.js.map