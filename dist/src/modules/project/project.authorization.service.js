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
exports.ProjectAuthorizationService = void 0;
const common_1 = require("@nestjs/common");
const authorization_service_1 = require("../../authorization/authorization.service");
const constants_1 = require("../../config/constants");
const prisma_service_1 = require("../../prisma.service");
const project_permissions_1 = require("./project.permissions");
let ProjectAuthorizationService = class ProjectAuthorizationService extends authorization_service_1.AuthorizationService {
    constructor(prisma) {
        super(prisma);
        this.prisma = prisma;
    }
    async checkIfUserAuthorizedForProject(user, projectId) {
        if (user.roles.slugs.includes(constants_1.SUPER_ADMIN)) {
            return true;
        }
        let prj = await this.prisma.project.findFirst({
            where: {
                id: projectId,
                ProjectMembers: {
                    some: {
                        userId: user.userId
                    }
                }
            },
        });
        if (prj) {
            return true;
        }
        throw {
            message: "Forbidden resource",
            statusCode: 403
        };
    }
    async checkIfUserAuthorizedForProjectFile(user, fileId) {
        if (user.roles.slugs.includes(constants_1.SUPER_ADMIN)) {
            return true;
        }
        let hasGlobalPermission = await this.findUserPermissionsAgainstSlugs(user, [project_permissions_1.ProjectPermissionSet.UPDATE_ANY_PROJECT]);
        if (hasGlobalPermission.updateAnyProject)
            return true;
        let prj = await this.prisma.fileManagement.findFirst({
            where: {
                id: fileId,
                Project: {
                    ProjectMembers: {
                        some: {
                            userId: user.userId
                        }
                    }
                }
            },
        });
        if (prj) {
            return true;
        }
        throw {
            message: "Forbidden resource",
            statusCode: 403
        };
    }
    async checkIfUserAuthorizedForProjectNote(user, noteId) {
        if (user.roles.slugs.includes(constants_1.SUPER_ADMIN)) {
            return true;
        }
        let prj = await this.prisma.projectConversation.findFirst({
            where: {
                id: noteId,
                userId: user.userId
            },
        });
        if (prj) {
            return true;
        }
        throw {
            message: "Forbidden resource",
            statusCode: 403
        };
    }
    async checkIfUserAuthorizedForProjectNoteMedia(user, noteId) {
        if (user.roles.slugs.includes(constants_1.SUPER_ADMIN)) {
            return true;
        }
        let prj = await this.prisma.fileManagement.findFirst({
            where: {
                id: noteId,
                addedById: user.userId
            },
        });
        if (prj) {
            return true;
        }
        throw {
            message: "Forbidden resource",
            statusCode: 403
        };
    }
};
ProjectAuthorizationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProjectAuthorizationService);
exports.ProjectAuthorizationService = ProjectAuthorizationService;
//# sourceMappingURL=project.authorization.service.js.map