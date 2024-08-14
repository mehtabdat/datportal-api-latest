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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectEnableStateController = void 0;
const common_1 = require("@nestjs/common");
const create_project_enable_state_dto_1 = require("./dto/create-project-enable-state.dto");
const project_enable_state_service_1 = require("./project-enable-state.service");
let ProjectEnableStateController = class ProjectEnableStateController {
    constructor(projectEnableStateService) {
        this.projectEnableStateService = projectEnableStateService;
    }
    async create(dto) {
        return await this.projectEnableStateService.create(dto);
    }
    async getByProject(projectId) {
        return this.projectEnableStateService.findByProjectId(projectId);
    }
};
__decorate([
    (0, common_1.Post)('updateProjectStates'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_project_enable_state_dto_1.CreateProjectEnableStateDto]),
    __metadata("design:returntype", Promise)
], ProjectEnableStateController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('by-project/:projectId'),
    __param(0, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectEnableStateController.prototype, "getByProject", null);
ProjectEnableStateController = __decorate([
    (0, common_1.Controller)('project-enable-states'),
    __metadata("design:paramtypes", [project_enable_state_service_1.ProjectEnableStateService])
], ProjectEnableStateController);
exports.ProjectEnableStateController = ProjectEnableStateController;
//# sourceMappingURL=project-enable-state.controller.js.map