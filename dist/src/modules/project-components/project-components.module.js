"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectComponentsModule = void 0;
const common_1 = require("@nestjs/common");
const project_components_service_1 = require("./project-components.service");
const project_components_controller_1 = require("./project-components.controller");
let ProjectComponentsModule = class ProjectComponentsModule {
};
ProjectComponentsModule = __decorate([
    (0, common_1.Module)({
        controllers: [project_components_controller_1.ProjectComponentsController],
        providers: [project_components_service_1.ProjectComponentsService]
    })
], ProjectComponentsModule);
exports.ProjectComponentsModule = ProjectComponentsModule;
//# sourceMappingURL=project-components.module.js.map