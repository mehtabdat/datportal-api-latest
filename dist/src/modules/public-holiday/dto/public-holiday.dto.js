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
exports.PublicHolidayResponseArray = exports.PublicHolidayResponseObject = void 0;
const swagger_1 = require("@nestjs/swagger");
const public_holiday_entity_1 = require("../entities/public-holiday.entity");
class PublicHolidayResponseObject {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PublicHolidayResponseObject.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PublicHolidayResponseObject.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", public_holiday_entity_1.PublicHoliday)
], PublicHolidayResponseObject.prototype, "data", void 0);
exports.PublicHolidayResponseObject = PublicHolidayResponseObject;
class PublicHolidayResponseArray {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PublicHolidayResponseArray.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PublicHolidayResponseArray.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true }),
    __metadata("design:type", public_holiday_entity_1.PublicHoliday)
], PublicHolidayResponseArray.prototype, "data", void 0);
exports.PublicHolidayResponseArray = PublicHolidayResponseArray;
//# sourceMappingURL=public-holiday.dto.js.map