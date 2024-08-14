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
exports.BlogCategoryStatusDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const constants_1 = require("../../../config/constants");
class BlogCategoryStatusDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please provide the valid status" }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsEnum)(constants_1.BlogsCategoryStatus),
    (0, class_validator_1.IsNotIn)([constants_1.BlogsCategoryStatus["Verified & Published"]], { message: "Please use a different API to verify and Publish the Blogs" }),
    __metadata("design:type", Number)
], BlogCategoryStatusDto.prototype, "status", void 0);
exports.BlogCategoryStatusDto = BlogCategoryStatusDto;
//# sourceMappingURL=blog-category-status.dto.js.map