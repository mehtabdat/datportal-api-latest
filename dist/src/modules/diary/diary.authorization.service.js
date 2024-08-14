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
exports.DiaryAuthorizationService = void 0;
const common_1 = require("@nestjs/common");
const authorization_service_1 = require("../../authorization/authorization.service");
const constants_1 = require("../../config/constants");
const prisma_service_1 = require("../../prisma.service");
const diary_permissions_1 = require("./diary.permissions");
let DiaryAuthorizationService = class DiaryAuthorizationService extends authorization_service_1.AuthorizationService {
    constructor(prisma) {
        super(prisma);
        this.prisma = prisma;
    }
    async isAuthorizedForUser(recordId, user) {
        if (user.roles.slugs.includes(constants_1.SUPER_ADMIN)) {
            return true;
        }
        let permissions = await this.findUserPermissionsAgainstSlugs(user, [diary_permissions_1.DairyPermissionSet.READ]);
        if (permissions.readDairy) {
            return true;
        }
        let record = await this.prisma.user.findFirst({
            where: {
                id: recordId
            },
            select: {
                id: true,
                managerId: true
            }
        });
        if (record.id === user.userId || record.managerId === user.userId) {
            return true;
        }
        throw {
            message: "Forbidden resource",
            statusCode: 403
        };
    }
    async isAuthorizedForUserDocument(recordId, user) {
        if (user.roles.slugs.includes(constants_1.SUPER_ADMIN)) {
            return true;
        }
        let permissions = await this.findUserPermissionsAgainstSlugs(user, [diary_permissions_1.DairyPermissionSet.READ]);
        if (permissions.readDairy) {
            return true;
        }
        let record = await this.prisma.userDocument.findFirst({
            where: {
                id: recordId
            },
            select: {
                id: true,
                userId: true
            }
        });
        if (record.userId === user.userId) {
            return true;
        }
        throw {
            message: "Forbidden resource",
            statusCode: 403
        };
    }
};
DiaryAuthorizationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DiaryAuthorizationService);
exports.DiaryAuthorizationService = DiaryAuthorizationService;
//# sourceMappingURL=diary.authorization.service.js.map