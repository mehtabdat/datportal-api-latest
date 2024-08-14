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
exports.CreateAdminSavedSearchDto = void 0;
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const class_transformer_custom_decorator_1 = require("../../../helpers/class-transformer-custom-decorator");
const project_filters_dto_1 = require("../../project/dto/project-filters.dto");
class CreateAdminSavedSearchDto {
    constructor() {
        this.visibility = 'self';
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please enter a title" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAdminSavedSearchDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAdminSavedSearchDto.prototype, "icon", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.SavedSearchesVisibility }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.SavedSearchesVisibility),
    __metadata("design:type", String)
], CreateAdminSavedSearchDto.prototype, "visibility", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: project_filters_dto_1.ProjectFiltersDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => project_filters_dto_1.ProjectFiltersDto),
    (0, class_transformer_custom_decorator_1.ParseJson)(),
    __metadata("design:type", project_filters_dto_1.ProjectFiltersDto)
], CreateAdminSavedSearchDto.prototype, "savedSearchesFilters", void 0);
exports.CreateAdminSavedSearchDto = CreateAdminSavedSearchDto;
//# sourceMappingURL=create-saved-search-admin.dto.js.map