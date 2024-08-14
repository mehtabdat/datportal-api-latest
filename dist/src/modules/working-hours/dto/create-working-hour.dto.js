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
exports.CreateWorkingHourDto = exports.OpeningHours = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const constants_1 = require("../../../config/constants");
const class_transformer_custom_decorator_1 = require("../../../helpers/class-transformer-custom-decorator");
class OpeningHours {
    constructor() {
        this.totalHours = 0;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ enum: constants_1.WeekDays }),
    (0, class_validator_1.IsNotEmpty)({ message: "Day must be provided" }),
    (0, class_validator_1.IsEnum)(constants_1.WeekDays),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], OpeningHours.prototype, "day", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OpeningHours.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OpeningHours.prototype, "open", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OpeningHours.prototype, "close", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please provide if it is closed or not" }),
    (0, class_transformer_custom_decorator_1.ParseBoolean)(),
    __metadata("design:type", Boolean)
], OpeningHours.prototype, "closed", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", Number)
], OpeningHours.prototype, "totalHours", void 0);
exports.OpeningHours = OpeningHours;
class CreateWorkingHourDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please enter a title" }),
    __metadata("design:type", String)
], CreateWorkingHourDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(7),
    (0, class_validator_1.ArrayMaxSize)(7),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => OpeningHours),
    __metadata("design:type", Array)
], CreateWorkingHourDto.prototype, "openingHours", void 0);
exports.CreateWorkingHourDto = CreateWorkingHourDto;
//# sourceMappingURL=create-working-hour.dto.js.map