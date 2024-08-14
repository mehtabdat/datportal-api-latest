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
exports.getDynamicUploadPath = exports.FaqsResponseArray = exports.FaqsResponseObject = void 0;
const swagger_1 = require("@nestjs/swagger");
const faq_entity_1 = require("../entities/faq.entity");
class FaqsResponseObject {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], FaqsResponseObject.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], FaqsResponseObject.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", faq_entity_1.Faq)
], FaqsResponseObject.prototype, "data", void 0);
exports.FaqsResponseObject = FaqsResponseObject;
class FaqsResponseArray {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], FaqsResponseArray.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], FaqsResponseArray.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true }),
    __metadata("design:type", faq_entity_1.Faq)
], FaqsResponseArray.prototype, "data", void 0);
exports.FaqsResponseArray = FaqsResponseArray;
function getDynamicUploadPath() {
    let basepath = "public/faqs/";
    let currentDate = new Date().toISOString().split('T')[0];
    return basepath + currentDate;
}
exports.getDynamicUploadPath = getDynamicUploadPath;
//# sourceMappingURL=faqs.dto.js.map