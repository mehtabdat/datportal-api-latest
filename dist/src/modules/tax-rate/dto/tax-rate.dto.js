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
exports.TaxRateResponseArray = exports.TaxRateResponseObject = void 0;
const swagger_1 = require("@nestjs/swagger");
const tax_rate_entity_1 = require("../entities/tax-rate.entity");
class TaxRateResponseObject {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TaxRateResponseObject.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TaxRateResponseObject.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", tax_rate_entity_1.TaxRate)
], TaxRateResponseObject.prototype, "data", void 0);
exports.TaxRateResponseObject = TaxRateResponseObject;
class TaxRateResponseArray {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TaxRateResponseArray.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TaxRateResponseArray.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true }),
    __metadata("design:type", tax_rate_entity_1.TaxRate)
], TaxRateResponseArray.prototype, "data", void 0);
exports.TaxRateResponseArray = TaxRateResponseArray;
//# sourceMappingURL=tax-rate.dto.js.map