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
exports.AuthorizationService = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../config/constants");
const prisma_service_1 = require("../prisma.service");
let AuthorizationService = class AuthorizationService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async checkIfUserAuthorized(user, requiredPermissions) {
        const userRoles = user.roles;
        if (!userRoles)
            return false;
        if (userRoles.slugs.includes(constants_1.SUPER_ADMIN))
            return true;
        let data = await this.prisma.rolePermissions.findMany({
            where: {
                AND: [
                    {
                        roleId: {
                            in: user.roles.ids
                        }
                    },
                    {
                        Permission: {
                            action: {
                                in: requiredPermissions
                            }
                        }
                    }
                ]
            },
            select: {
                Permission: {
                    select: {
                        action: true
                    }
                }
            }
        });
        let foundSlugs = data.map((ele) => {
            return ele.Permission.action;
        });
        return requiredPermissions.every(function (ele) {
            if (!foundSlugs.includes(ele)) {
                return false;
            }
            ;
            return true;
        });
    }
    async checkIfUserAuthorizedForSavedSearches(user, savedSearchId) {
        if (user.roles.slugs.includes(constants_1.SUPER_ADMIN)) {
            return true;
        }
        let userAlert = await this.prisma.savedSearches.findFirst({
            where: {
                id: savedSearchId
            }
        });
        if (!userAlert) {
            throw {
                message: "User Alerts not found in the system.",
                statusCode: 404
            };
        }
        ;
        if (user.userId === userAlert.userId) {
            return true;
        }
        throw {
            message: "Forbidden resource",
            statusCode: 403
        };
    }
    async checkIfUserCanReadOrganzationResources(user, filePath) {
        if (user.roles.slugs.includes(constants_1.SUPER_ADMIN)) {
            return true;
        }
        let fileInfo = await this.prisma.fileManagement.findFirst({
            where: {
                path: filePath
            },
            select: {
                Project: {
                    select: {
                        clientId: true,
                        id: true,
                    }
                }
            }
        });
        if (!fileInfo || !fileInfo.Project.clientId) {
            throw {
                message: "Client not found in the system.",
                statusCode: 404
            };
        }
        ;
        let agency = fileInfo.Project;
        throw {
            message: "Forbidden resource",
            statusCode: 403
        };
    }
    async checkIfUserCanReadProjectResources(user, filePath) {
        if (user.roles.slugs.includes(constants_1.SUPER_ADMIN)) {
            return true;
        }
        let fileInfo = await this.prisma.fileManagement.findFirst({
            where: {
                path: filePath
            },
            select: {
                visibility: true,
                addedById: true,
                Project: {
                    select: {
                        id: true,
                        clientId: true,
                        addedById: true,
                        ProjectMembers: {
                            select: {
                                userId: true,
                                projectRole: true
                            }
                        },
                        ProjectClient: {
                            select: {
                                clientId: true
                            }
                        }
                    }
                }
            }
        });
        if (!fileInfo || !fileInfo.Project) {
            throw {
                message: "File not found in the system.",
                statusCode: 404
            };
        }
        ;
        if (fileInfo.addedById === user.userId || fileInfo.Project.addedById === user.userId) {
            return true;
        }
        let prj = fileInfo.Project;
        let userBelongsToProject = false;
        for (const t of prj.ProjectMembers) {
            if (t.userId === user.userId) {
                userBelongsToProject = true;
                break;
            }
        }
        if (userBelongsToProject) {
            return true;
        }
        throw {
            message: "Forbidden resource",
            statusCode: 403
        };
    }
    async checkIfUserCanReadTaskResources(user, filePath) {
        if (user.roles.slugs.includes(constants_1.SUPER_ADMIN)) {
            return true;
        }
        let fileInfo = await this.prisma.fileManagement.findFirst({
            where: {
                path: filePath
            },
            select: {
                visibility: true,
                addedById: true,
                Task: {
                    select: {
                        id: true,
                        addedById: true,
                        TaskMembers: {
                            select: {
                                userId: true,
                            }
                        }
                    }
                }
            }
        });
        if (!fileInfo || !fileInfo.Task) {
            throw {
                message: "File not found in the system.",
                statusCode: 404
            };
        }
        ;
        if (fileInfo.addedById === user.userId || fileInfo.Task.addedById === user.userId) {
            return true;
        }
        let prj = fileInfo.Task;
        let userBelongsToProject = false;
        for (const t of prj.TaskMembers) {
            if (t.userId === user.userId) {
                userBelongsToProject = true;
                break;
            }
        }
        if (userBelongsToProject) {
            return true;
        }
        throw {
            message: "Forbidden resource",
            statusCode: 403
        };
    }
    async checkIfUserAuthorizedForProjectResources(user, fileId) {
        if (user.roles.slugs.includes(constants_1.SUPER_ADMIN)) {
            return true;
        }
        let fileInfo = await this.prisma.fileManagement.findFirst({
            where: {
                id: fileId
            },
            select: {
                visibility: true,
                addedById: true,
                Project: {
                    select: {
                        id: true,
                        clientId: true,
                        addedById: true,
                        ProjectMembers: {
                            select: {
                                userId: true,
                                projectRole: true
                            }
                        }
                    }
                }
            }
        });
        if (!fileInfo || !fileInfo.Project) {
            throw {
                message: "File not found in the system.",
                statusCode: 404
            };
        }
        ;
        if (fileInfo.addedById === user.userId || fileInfo.Project.addedById === user.userId) {
            return true;
        }
        let prj = fileInfo.Project;
        let userBelongsToProject = false;
        for (const t of prj.ProjectMembers) {
            if (t.userId === user.userId) {
                userBelongsToProject = true;
                break;
            }
        }
        if (userBelongsToProject) {
            return true;
        }
        throw {
            message: "Forbidden resource",
            statusCode: 403
        };
    }
    async checkIfUserAuthorizedForTask(user, taskId, techSupportPermission) {
        if (user.roles.slugs.includes(constants_1.SUPER_ADMIN)) {
            return true;
        }
        let prj = await this.prisma.task.findFirst({
            where: {
                id: taskId,
                AND: {
                    OR: [
                        {
                            TaskMembers: {
                                some: {
                                    userId: user.userId
                                }
                            }
                        },
                        (techSupportPermission) ?
                            {
                                type: constants_1.TaskType.techSupport
                            } : undefined
                    ]
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
    async checkIfUserAuthorizedForTaskFile(user, taskFileId, techSupportPermission) {
        if (user.roles.slugs.includes(constants_1.SUPER_ADMIN)) {
            return true;
        }
        let prj = await this.prisma.fileManagement.findFirst({
            where: {
                id: taskFileId,
                Task: {
                    AND: {
                        OR: [
                            {
                                TaskMembers: {
                                    some: {
                                        userId: user.userId
                                    }
                                }
                            },
                            (techSupportPermission) ?
                                {
                                    type: constants_1.TaskType.techSupport
                                } : undefined
                        ]
                    }
                }
            },
        });
        if (prj) {
            return true;
        }
        throw {
            message: "Sorry you are not Authorized!",
            statusCode: 403
        };
    }
    async checkIfUserAuthorizedForProjectBySlug(user, slug) {
        if (user.roles.slugs.includes(constants_1.SUPER_ADMIN)) {
            return true;
        }
        let prj = await this.prisma.project.findFirst({
            where: {
                slug: slug,
                AND: {
                    OR: [
                        {
                            ProjectMembers: {
                                some: {
                                    userId: user.userId
                                }
                            }
                        },
                        {
                            addedById: user.userId
                        }
                    ]
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
    async findUserPermissionsAgainstSlugs(user, slugs) {
        const results = {};
        let __slugs = (Array.isArray(slugs) ? slugs : [slugs]);
        if (user.roles.slugs.includes(constants_1.SUPER_ADMIN)) {
            __slugs.map(function (ele) {
                results[ele] = true;
            });
            return results;
        }
        else {
            let dt = await this.prisma.rolePermissions.findMany({
                where: {
                    AND: [
                        {
                            roleId: {
                                in: user.roles.ids
                            }
                        },
                        {
                            Permission: {
                                action: {
                                    in: __slugs
                                }
                            }
                        }
                    ]
                },
                select: {
                    Permission: {
                        select: {
                            action: true
                        }
                    }
                }
            });
            let foundSlugs = dt.map((ele) => {
                return ele.Permission.action;
            });
            __slugs.map(function (ele) {
                results[ele] = foundSlugs.includes(ele);
            });
            return results;
        }
    }
};
AuthorizationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthorizationService);
exports.AuthorizationService = AuthorizationService;
//# sourceMappingURL=authorization.service.js.map