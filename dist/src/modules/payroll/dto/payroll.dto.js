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
exports.getDynamicUploadPath = exports.PayrollResponseArray = exports.PayrollResponseObject = void 0;
const swagger_1 = require("@nestjs/swagger");
const payroll_entity_1 = require("../entities/payroll.entity");
const constants_1 = require("../../../config/constants");
class PayrollResponseObject {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PayrollResponseObject.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PayrollResponseObject.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", payroll_entity_1.Payroll)
], PayrollResponseObject.prototype, "data", void 0);
exports.PayrollResponseObject = PayrollResponseObject;
class PayrollResponseArray {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PayrollResponseArray.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PayrollResponseArray.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true }),
    __metadata("design:type", payroll_entity_1.Payroll)
], PayrollResponseArray.prototype, "data", void 0);
exports.PayrollResponseArray = PayrollResponseArray;
function getDynamicUploadPath() {
    let basepath = "protected";
    let currentDate = new Date().toISOString().split('T')[0];
    return basepath + '/' + constants_1.ResourcesLocation.payroll + '/' + currentDate;
}
exports.getDynamicUploadPath = getDynamicUploadPath;
//# sourceMappingURL=payroll.dto.js.map