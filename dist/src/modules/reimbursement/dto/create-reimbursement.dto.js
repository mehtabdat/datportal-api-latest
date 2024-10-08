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
exports.CreateReimbursementDto = exports.ReimbursementReceipts = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class ReimbursementReceipts {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: "file", isArray: true }),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], ReimbursementReceipts.prototype, "file", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please write a receipt title" }),
    __metadata("design:type", String)
], ReimbursementReceipts.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true }),
    (0, class_validator_1.IsNotEmpty)({ message: "Please write a amount you want to claim from the receipt" }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], ReimbursementReceipts.prototype, "claimedAmount", void 0);
exports.ReimbursementReceipts = ReimbursementReceipts;
class CreateReimbursementDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please write a purpose" }),
    __metadata("design:type", String)
], CreateReimbursementDto.prototype, "purpose", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: ReimbursementReceipts }),
    (0, class_validator_1.IsNotEmpty)({ message: "Please provide the receipts information" }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ReimbursementReceipts),
    __metadata("design:type", Array)
], CreateReimbursementDto.prototype, "reimbursementReceipts", void 0);
exports.CreateReimbursementDto = CreateReimbursementDto;
//# sourceMappingURL=create-reimbursement.dto.js.map