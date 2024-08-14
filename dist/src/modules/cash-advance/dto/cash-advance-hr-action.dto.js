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
exports.CashAdvanceHrAction = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const constants_1 = require("../../../config/constants");
const AcceptedStatus = [constants_1.CashAdvanceRequestStatus.approved, constants_1.CashAdvanceRequestStatus.rejected, constants_1.CashAdvanceRequestStatus.partially_approved];
class CashAdvanceHrAction {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CashAdvanceHrAction.prototype, "comment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: AcceptedStatus }),
    (0, class_validator_1.IsNotEmpty)({ message: "Please choose receipt action, whether it is approved or rejected" }),
    (0, class_validator_1.IsEnum)(AcceptedStatus),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CashAdvanceHrAction.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please provide a valid amount in AED" }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CashAdvanceHrAction.prototype, "approvedAmount", void 0);
exports.CashAdvanceHrAction = CashAdvanceHrAction;
//# sourceMappingURL=cash-advance-hr-action.dto.js.map