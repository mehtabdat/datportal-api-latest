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
var UserAlertsSettingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAlertsSettingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
let UserAlertsSettingService = UserAlertsSettingService_1 = class UserAlertsSettingService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(UserAlertsSettingService_1.name);
    }
    createOrUpdate(createAndUpdateData, user) {
        return this.prisma.userAlertsSetting.upsert({
            where: {
                userId_alertsTypeId: {
                    alertsTypeId: createAndUpdateData.alertsTypeId,
                    userId: user.userId
                }
            },
            create: {
                mobile: createAndUpdateData.mobile,
                app: createAndUpdateData.app,
                desktop: createAndUpdateData.desktop,
                email: createAndUpdateData.email,
                userId: user.userId,
                alertsTypeId: createAndUpdateData.alertsTypeId
            },
            update: {
                mobile: createAndUpdateData.mobile,
                app: createAndUpdateData.app,
                desktop: createAndUpdateData.desktop,
                email: createAndUpdateData.email,
                modifiedDate: new Date()
            }
        }).catch(err => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    findOne(userAlertsTypeId, userId) {
        return this.prisma.userAlertsSetting.findUnique({
            where: {
                userId_alertsTypeId: {
                    alertsTypeId: userAlertsTypeId,
                    userId: userId
                }
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    findBySlug(userAlertsTypeSlug, userId) {
        return this.prisma.userAlertsSetting.findFirst({
            where: {
                userId: userId,
                AlertsType: {
                    slug: userAlertsTypeSlug
                }
            },
            include: {
                AlertsType: {
                    select: {
                        id: true,
                        slug: true,
                    }
                }
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    unsubscribeAll(user) {
        return this.prisma.userAlertsSetting.updateMany({
            where: {
                userId: user.userId
            },
            data: {
                email: false,
                desktop: false,
                app: false,
                mobile: false
            }
        });
    }
};
UserAlertsSettingService = UserAlertsSettingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserAlertsSettingService);
exports.UserAlertsSettingService = UserAlertsSettingService;
//# sourceMappingURL=user-alerts-setting.service.js.map