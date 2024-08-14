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
exports.FindBySlugDto = exports.ParamsDto = exports.Pagination = exports.ManualAction = exports.SEOData = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class SEOData {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please enter a meta title for a page" }),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Type)(() => String),
    (0, class_validator_1.MinLength)(10, { message: "SEO title must be greater than 10 characters" }),
    (0, class_validator_1.MaxLength)(100, { message: "SEO title must be not be greater than 100 characters" }),
    __metadata("design:type", String)
], SEOData.prototype, "seoTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please enter a meta description for a page" }),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Type)(() => String),
    (0, class_validator_1.MinLength)(10, { message: "SEO description must be greater than 10 characters" }),
    (0, class_validator_1.MaxLength)(250, { message: "SEO title must not be greater than 250 characters" }),
    __metadata("design:type", String)
], SEOData.prototype, "seoDescription", void 0);
exports.SEOData = SEOData;
class ManualAction {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please provide valid data" }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(-5),
    (0, class_validator_1.Max)(5),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], ManualAction.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Type)(() => String),
    __metadata("design:type", String)
], ManualAction.prototype, "message", void 0);
exports.ManualAction = ManualAction;
class Pagination {
    constructor() {
        this.perPage = 10;
        this.page = 1;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ default: 25, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Max)(500),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], Pagination.prototype, "perPage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 1, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], Pagination.prototype, "page", void 0);
exports.Pagination = Pagination;
class ParamsDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please provide the valid id" }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], ParamsDto.prototype, "id", void 0);
exports.ParamsDto = ParamsDto;
class FindBySlugDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please provide the valid slug" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FindBySlugDto.prototype, "slug", void 0);
exports.FindBySlugDto = FindBySlugDto;
//# sourceMappingURL=common-types.js.map