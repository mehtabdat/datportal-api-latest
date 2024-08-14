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
exports.TaskSortingDto = exports.TaskSortableFields = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
var TaskSortableFields;
(function (TaskSortableFields) {
    TaskSortableFields["addedDate"] = "addedDate";
    TaskSortableFields["priority"] = "priority";
    TaskSortableFields["order"] = "order";
    TaskSortableFields["taskEndOn"] = "taskEndOn";
})(TaskSortableFields = exports.TaskSortableFields || (exports.TaskSortableFields = {}));
class TaskSortingDto {
    constructor() {
        this.sortByField = TaskSortableFields.order;
        this.sortOrder = client_1.Prisma.SortOrder.desc;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ enum: TaskSortableFields, default: TaskSortableFields.order, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(TaskSortableFields),
    (0, class_transformer_1.Type)(() => String),
    __metadata("design:type", String)
], TaskSortingDto.prototype, "sortByField", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: client_1.Prisma.SortOrder.asc, required: false, enum: client_1.Prisma.SortOrder }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.Prisma.SortOrder),
    (0, class_transformer_1.Type)(() => String),
    __metadata("design:type", String)
], TaskSortingDto.prototype, "sortOrder", void 0);
exports.TaskSortingDto = TaskSortingDto;
//# sourceMappingURL=task-sorting.dto.js.map