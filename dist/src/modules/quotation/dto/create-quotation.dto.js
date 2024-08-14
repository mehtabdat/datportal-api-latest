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
exports.CreateQuotationDto = exports.QuotationMilestone = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const constants_1 = require("../../../config/constants");
const class_transformer_custom_decorator_1 = require("../../../helpers/class-transformer-custom-decorator");
class QuotationMilestone {
    constructor() {
        this.quantity = 1;
    }
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], QuotationMilestone.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], QuotationMilestone.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], QuotationMilestone.prototype, "accountId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], QuotationMilestone.prototype, "taxRateId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please provide milestone percentage" }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], QuotationMilestone.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], QuotationMilestone.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_custom_decorator_1.ParseBoolean)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], QuotationMilestone.prototype, "requirePayment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please provide milestone title" }),
    (0, class_transformer_1.Transform)(data => data.value.trim()),
    __metadata("design:type", String)
], QuotationMilestone.prototype, "title", void 0);
exports.QuotationMilestone = QuotationMilestone;
class CreateQuotationDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateQuotationDto.prototype, "leadId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please provide quote number" }),
    __metadata("design:type", String)
], CreateQuotationDto.prototype, "quoteNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateQuotationDto.prototype, "clientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateQuotationDto.prototype, "brandingThemeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateQuotationDto.prototype, "revisedQuotationReferenceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateQuotationDto.prototype, "submissionById", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateQuotationDto.prototype, "issueDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateQuotationDto.prototype, "expiryDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_custom_decorator_1.ParseBoolean)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateQuotationDto.prototype, "hasSupervision", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.ValidateIf)((obj) => obj.hasSupervision === true),
    (0, class_validator_1.IsNotEmpty)({ message: "Please provide supervision monthly charge" }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateQuotationDto.prototype, "supervisionMonthlyCharge", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: constants_1.SupervisionPaymentSchedule }),
    (0, class_validator_1.ValidateIf)((obj) => obj.hasSupervision === true),
    (0, class_validator_1.IsNotEmpty)({ message: "Please provide supervision payment schedule" }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsEnum)(constants_1.SupervisionPaymentSchedule),
    __metadata("design:type", Object)
], CreateQuotationDto.prototype, "supervisionPaymentSchedule", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please provide scope of work" }),
    (0, class_transformer_1.Transform)(data => data.value.trim()),
    __metadata("design:type", String)
], CreateQuotationDto.prototype, "scopeOfWork", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please provide payment terms" }),
    __metadata("design:type", String)
], CreateQuotationDto.prototype, "paymentTerms", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)({ message: "Please provide if there are any notes" }),
    __metadata("design:type", String)
], CreateQuotationDto.prototype, "note", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: "file" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], CreateQuotationDto.prototype, "file", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: constants_1.QuotationType }),
    (0, class_validator_1.IsNotEmpty)({ message: "Please provide valid data" }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsEnum)(constants_1.QuotationType),
    __metadata("design:type", Object)
], CreateQuotationDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: QuotationMilestone }),
    (0, class_validator_1.IsNotEmpty)({ message: "Please provide the receipts information" }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => QuotationMilestone),
    __metadata("design:type", Array)
], CreateQuotationDto.prototype, "milestone", void 0);
exports.CreateQuotationDto = CreateQuotationDto;
//# sourceMappingURL=create-quotation.dto.js.map