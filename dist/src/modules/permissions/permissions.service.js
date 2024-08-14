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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var PermissionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsService = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../../config/constants");
const prisma_service_1 = require("../../prisma.service");
let PermissionsService = PermissionsService_1 = class PermissionsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(PermissionsService_1.name);
    }
    create(createPermissionDto) {
        const { moduleId } = createPermissionDto, rest = __rest(createPermissionDto, ["moduleId"]);
        return this.prisma.permissions.create({
            data: Object.assign(Object.assign({}, rest), { Module: {
                    connect: { id: moduleId }
                } })
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            const errorResponse = { message: err.message, statusCode: 404, data: {} };
            throw errorResponse;
        });
    }
    findAll() {
        let records = this.prisma.permissions.findMany({ orderBy: { id: 'desc' } });
        return records;
    }
    findOne(id) {
        return this.prisma.permissions.findUnique({
            where: {
                id: id
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 404, data: {} };
            throw errorResponse;
        });
    }
    update(id, updatePermissionDto) {
        const { moduleId } = updatePermissionDto, rest = __rest(updatePermissionDto, ["moduleId"]);
        return this.prisma.permissions.update({
            data: Object.assign(Object.assign({}, rest), { Module: {
                    connect: { id: moduleId }
                } }),
            where: { id }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            const errorResponse = { message: err.message, statusCode: 404, data: {} };
            throw errorResponse;
        });
    }
    remove(id) {
        return this.prisma.permissions.delete({
            where: {
                id: id
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 404, data: {} };
            throw errorResponse;
        });
    }
    async grantPrivilegesToRole(roleId, permissionsIds, user) {
        let insertData = [];
        let __permissionIds = await this.validatePermissionIds(permissionsIds, user);
        if (__permissionIds.length === 0) {
            throw { message: "Please provide a valid permission Ids", statusCode: 400 };
        }
        insertData = __permissionIds.map((ele) => { return { roleId: roleId, permissionsId: ele.id, addedById: user.userId }; });
        await this.prisma.role.findUnique({ where: { id: roleId } }).then(data => {
            if (!data) {
                throw { message: "Provided role is not found in the system", statusCode: 404 };
            }
        });
        let allPromises = insertData.map((ele) => {
            return this.prisma.rolePermissions.upsert({
                where: {
                    roleId_permissionsId: {
                        roleId: roleId,
                        permissionsId: ele.permissionsId
                    }
                },
                create: ele,
                update: {}
            }).catch((err) => {
                this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
                let errorResponse = { message: err.message, statusCode: 400, data: {} };
                throw errorResponse;
            });
        });
        return Promise.all(allPromises);
    }
    validatePermissionIds(permissionIds, user) {
        let condition = { id: {
                in: permissionIds
            } };
        if (!(user.roles.slugs.includes(constants_1.SUPER_ADMIN) || user.roles.slugs.includes(constants_1.SYSTEM_USERS))) {
            condition = Object.assign(Object.assign({}, condition), { visibility: 'organization' });
        }
        return this.prisma.permissions.findMany({
            where: condition
        });
    }
    async revokePrivilegesFromRole(roleId, permissionsIds, user) {
        let condition = {
            roleId: roleId,
            permissionsId: {
                in: permissionsIds
            }
        };
        return this.prisma.rolePermissions.deleteMany({
            where: condition,
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 404, data: {} };
            throw errorResponse;
        });
    }
    async getRolePermission(roleId) {
        return this.prisma.rolePermissions.findMany({
            where: {
                roleId: roleId
            },
            select: {
                id: true,
                Permission: {
                    select: {
                        action: true,
                        id: true
                    }
                }
            }
        });
    }
    async getRolePermissionByModuleId(roleId, moduleId) {
        return this.prisma.rolePermissions.findMany({
            where: {
                roleId: roleId,
                Permission: {
                    moduleId: moduleId
                }
            },
            select: {
                id: true,
                Permission: {
                    select: {
                        action: true,
                        id: true
                    }
                }
            }
        });
    }
};
PermissionsService = PermissionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PermissionsService);
exports.PermissionsService = PermissionsService;
//# sourceMappingURL=permissions.service.js.map