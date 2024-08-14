"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectEnableStateModule = void 0;
const common_1 = require("@nestjs/common");
const project_enable_state_service_1 = require("./project-enable-state.service");
const project_enable_state_controller_1 = require("./project-enable-state.controller");
const typeorm_1 = require("@nestjs/typeorm");
const project_enable_state_entity_1 = require("./entities/project-enable-state.entity");
let ProjectEnableStateModule = class ProjectEnableStateModule {
};
ProjectEnableStateModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([project_enable_state_entity_1.ProjectEnableState])],
        controllers: [project_enable_state_controller_1.ProjectEnableStateController],
        providers: [project_enable_state_service_1.ProjectEnableStateService]
    })
], ProjectEnableStateModule);
exports.ProjectEnableStateModule = ProjectEnableStateModule;
//# sourceMappingURL=project-enable-state.module.js.map