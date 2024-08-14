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
exports.LeaveRequestAdminAction = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const constants_1 = require("../../../config/constants");
const class_transformer_custom_decorator_1 = require("../../../helpers/class-transformer-custom-decorator");
class LeaveRequestAdminAction {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_custom_decorator_1.ParseBoolean)(),
    __metadata("design:type", Boolean)
], LeaveRequestAdminAction.prototype, "isPaid", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], LeaveRequestAdminAction.prototype, "comment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: [constants_1.LeaveRequestStatus.approved, constants_1.LeaveRequestStatus.rejected, constants_1.LeaveRequestStatus.request_modification] }),
    (0, class_validator_1.IsNotEmpty)({ message: "Please choose receipt action, whether it is approved or rejected" }),
    (0, class_validator_1.IsIn)([constants_1.LeaveRequestStatus.approved, constants_1.LeaveRequestStatus.rejected, constants_1.LeaveRequestStatus.request_modification], { message: "Please choose whether to approve or reject this request" }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], LeaveRequestAdminAction.prototype, "status", void 0);
exports.LeaveRequestAdminAction = LeaveRequestAdminAction;
//# sourceMappingURL=leave-request-admin-action.dto.js.map