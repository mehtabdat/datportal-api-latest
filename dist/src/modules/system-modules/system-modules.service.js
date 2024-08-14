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
var SystemModulesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemModulesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
let SystemModulesService = SystemModulesService_1 = class SystemModulesService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(SystemModulesService_1.name);
    }
    create(createSystemModuleDto) {
        return this.prisma.modules.create({
            data: createSystemModuleDto
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 404, data: {} };
            throw errorResponse;
        });
    }
    findAll(filters, user) {
        let condition = {};
        let includes = {};
        if (filters.fetchPermissions) {
            includes = Object.assign(Object.assign({}, includes), { Permissions: true });
        }
        let records = this.prisma.modules.findMany({
            where: condition,
            include: includes,
            orderBy: { order: 'asc' }
        });
        return records;
    }
    findOne(id, user) {
        let condition = { id: id };
        let permissionCondition = {};
        return this.prisma.modules.findFirst({
            where: condition,
            include: {
                Permissions: {
                    where: permissionCondition,
                    include: {
                        RolePermissions: {
                            select: {
                                Role: {
                                    select: {
                                        title: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 404, data: {} };
            throw errorResponse;
        });
    }
    update(id, updateSystemModuleDto) {
        return this.prisma.modules.update({
            data: updateSystemModuleDto,
            where: {
                id: id
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 404, data: {} };
            throw errorResponse;
        });
    }
    remove(id) {
        return this.prisma.modules.delete({
            where: {
                id: id
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 404, data: {} };
            throw errorResponse;
        });
    }
};
SystemModulesService = SystemModulesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SystemModulesService);
exports.SystemModulesService = SystemModulesService;
//# sourceMappingURL=system-modules.service.js.map