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
exports.ProjectEnableStateService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const project_enable_state_entity_1 = require("../project-enable-states/entities/project-enable-state.entity");
const prisma_service_1 = require("../../prisma.service");
let ProjectEnableStateService = class ProjectEnableStateService {
    constructor(projectEnableStateRepository, prisma) {
        this.projectEnableStateRepository = projectEnableStateRepository;
        this.prisma = prisma;
    }
    async create(dto) {
        const projectEnableState = new project_enable_state_entity_1.ProjectEnableState();
        projectEnableState.pId = dto.pId;
        projectEnableState.pstateId = dto.pstateId;
        projectEnableState.isPublished = dto.isPublished;
        projectEnableState.isDeleted = dto.isDeleted;
        projectEnableState.projectId = dto.projectId;
        return await this.projectEnableStateRepository.save(projectEnableState);
    }
    async findByProjectId(projectId) {
        return this.prisma.projectEnableStates.findMany({
            where: { pId: Number(projectId) },
        });
    }
};
ProjectEnableStateService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(project_enable_state_entity_1.ProjectEnableState)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        prisma_service_1.PrismaService])
], ProjectEnableStateService);
exports.ProjectEnableStateService = ProjectEnableStateService;
//# sourceMappingURL=project-enable-state.service.js.map