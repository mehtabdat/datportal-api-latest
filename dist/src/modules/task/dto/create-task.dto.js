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
exports.CreateTaskDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const constants_1 = require("../../../config/constants");
class CreateTaskDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)({ message: "Please enter valid project ID" }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateTaskDto.prototype, "projectId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please enter valid title" }),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: constants_1.Priority }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateTaskDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "instructions", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.type === constants_1.TaskType.normal),
    (0, swagger_1.ApiProperty)({ type: "date" }),
    (0, class_validator_1.IsNotEmpty)({ message: "Please enter task start date" }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Object)
], CreateTaskDto.prototype, "taskStartFrom", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.type === constants_1.TaskType.normal),
    (0, swagger_1.ApiProperty)({ type: "date" }),
    (0, class_validator_1.IsNotEmpty)({ message: "Please enter task end date" }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Object)
], CreateTaskDto.prototype, "taskEndOn", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Array)
], CreateTaskDto.prototype, "assignedTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: constants_1.TaskStatus }),
    (0, class_validator_1.IsOptional)({ message: "Please enter valid status" }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsEnum)(constants_1.TaskStatus),
    __metadata("design:type", Number)
], CreateTaskDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: constants_1.TaskType }),
    (0, class_validator_1.IsOptional)({ message: "Please enter valid status" }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsEnum)(constants_1.TaskType),
    __metadata("design:type", Number)
], CreateTaskDto.prototype, "type", void 0);
exports.CreateTaskDto = CreateTaskDto;
//# sourceMappingURL=create-task.dto.js.map