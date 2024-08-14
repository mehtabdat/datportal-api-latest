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
var AlertsTypeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertsTypeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
let AlertsTypeService = AlertsTypeService_1 = class AlertsTypeService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(AlertsTypeService_1.name);
    }
    create(createAlertsTypeDto) {
        return this.prisma.alertsType.create({
            data: createAlertsTypeDto,
        })
            .catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    findAll() {
        let records = this.prisma.alertsType.findMany({
            where: {
                isDeleted: false
            },
            orderBy: {
                id: 'desc'
            }
        });
        return records;
    }
    findAllPublished(user) {
        return this.prisma.alertsType.findMany({
            where: {
                isDeleted: false,
                isPublished: true,
            },
            include: {
                UserAlertsSetting: {
                    where: {
                        userId: user.userId
                    }
                }
            },
            orderBy: {
                id: 'desc'
            }
        });
    }
    findOne(id) {
        return this.prisma.alertsType.findUnique({
            where: {
                id: id
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    findBySlug(slug, user) {
        return this.prisma.alertsType.findUnique({
            where: {
                slug: slug
            },
            include: {
                UserAlertsSetting: {
                    where: {
                        userId: user.userId
                    }
                }
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    update(id, updateAlertsTypeDto) {
        return this.prisma.alertsType.update({
            data: updateAlertsTypeDto,
            where: {
                id: id
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    remove(id) {
        return this.prisma.alertsType.update({
            data: {
                isPublished: false,
                isDeleted: true
            },
            where: {
                id: id
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
};
AlertsTypeService = AlertsTypeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AlertsTypeService);
exports.AlertsTypeService = AlertsTypeService;
//# sourceMappingURL=alerts-type.service.js.map