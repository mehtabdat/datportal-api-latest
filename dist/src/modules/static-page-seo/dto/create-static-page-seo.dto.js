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
exports.CreateStaticPageSeoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class CreateStaticPageSeoDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please enter SEO Title" }),
    __metadata("design:type", String)
], CreateStaticPageSeoDto.prototype, "seoTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please enter SEO description" }),
    __metadata("design:type", String)
], CreateStaticPageSeoDto.prototype, "seoDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, type: "file" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], CreateStaticPageSeoDto.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please choose a country" }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateStaticPageSeoDto.prototype, "countryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please choose a country" }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateStaticPageSeoDto.prototype, "sitePageId", void 0);
exports.CreateStaticPageSeoDto = CreateStaticPageSeoDto;
//# sourceMappingURL=create-static-page-seo.dto.js.map