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
exports.CreateBlogDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const constants_1 = require("../../../config/constants");
const class_transformer_custom_decorator_1 = require("../../../helpers/class-transformer-custom-decorator");
class CreateBlogDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please provide the package slug" }),
    (0, class_transformer_custom_decorator_1.SlugifyString)(),
    __metadata("design:type", String)
], CreateBlogDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBlogDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBlogDto.prototype, "highlight", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBlogDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, type: "file" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], CreateBlogDto.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBlogDto.prototype, "imageAlt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: "number" }),
    (0, class_validator_1.IsNotEmpty)({ message: "Please provide the blog category" }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsEnum)(constants_1.BlogsCategory),
    __metadata("design:type", Number)
], CreateBlogDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: "number" }),
    (0, class_validator_1.IsNotEmpty)({ message: "Please provide the blog category" }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateBlogDto.prototype, "blogCategoryId", void 0);
exports.CreateBlogDto = CreateBlogDto;
//# sourceMappingURL=create-blog.dto.js.map