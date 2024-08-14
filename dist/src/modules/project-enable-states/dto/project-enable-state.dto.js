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
exports.ProjectEnableStateResponseArray = exports.ProjectEnableStateResponseObject = void 0;
const swagger_1 = require("@nestjs/swagger");
const project_enable_state_entity_1 = require("../entities/project-enable-state.entity");
class ProjectEnableStateResponseObject {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProjectEnableStateResponseObject.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ProjectEnableStateResponseObject.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", project_enable_state_entity_1.ProjectEnableState)
], ProjectEnableStateResponseObject.prototype, "data", void 0);
exports.ProjectEnableStateResponseObject = ProjectEnableStateResponseObject;
class ProjectEnableStateResponseArray {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProjectEnableStateResponseArray.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ProjectEnableStateResponseArray.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true }),
    __metadata("design:type", project_enable_state_entity_1.ProjectEnableState)
], ProjectEnableStateResponseArray.prototype, "data", void 0);
exports.ProjectEnableStateResponseArray = ProjectEnableStateResponseArray;
//# sourceMappingURL=project-enable-state.dto.js.map