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
var BiometricsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BiometricsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
const user_dto_1 = require("../user/dto/user.dto");
const constants_1 = require("../../config/constants");
const common_2 = require("../../helpers/common");
const coordinates_service_1 = require("./coordinates.service");
let BiometricsService = BiometricsService_1 = class BiometricsService {
    constructor(prisma, coordinatesService) {
        this.prisma = prisma;
        this.coordinatesService = coordinatesService;
        this.logger = new common_1.Logger(BiometricsService_1.name);
    }
    create(createDto, user) {
        let daysDifference = Math.abs((0, common_2.getDifferenceInDays)(new Date(), createDto.checkIn));
        if (daysDifference > 31) {
            throw {
                message: "You cannot add check in data older than 31 days",
                statusCode: 404
            };
        }
        if (createDto.checkIn > new Date()) {
            throw {
                message: "You cannot add biometrics data for future dates",
                statusCode: 404
            };
        }
        return this.prisma.biometricsChecks.create({
            data: Object.assign(Object.assign({}, createDto), { type: constants_1.BiometricsEntryType.manual, addedById: (user.userEmail === constants_1.TEST_EMAIL) ? undefined : user.userId, addedDate: new Date() }),
        })
            .catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    findAll(filters, pagination) {
        let skip = (pagination.perPage * (pagination.page - 1));
        let take = pagination.perPage;
        let records = this.prisma.biometricsChecks.findMany({
            where: filters,
            skip: skip,
            take: take,
            include: {
                AddedBy: {
                    select: user_dto_1.UserDefaultAttributes
                },
                ModifiedBy: {
                    select: user_dto_1.UserDefaultAttributes
                },
                User: {
                    select: user_dto_1.UserDefaultAttributes
                }
            },
            orderBy: {
                id: 'desc'
            }
        });
        return records;
    }
    findAllPublished(filters, pagination) {
        let skip = (pagination.perPage * (pagination.page - 1));
        let take = pagination.perPage;
        return this.prisma.biometricsChecks.findMany({
            where: filters,
            skip: skip,
            take: take,
            orderBy: {
                id: 'desc'
            }
        });
    }
    findOne(id) {
        return this.prisma.biometricsChecks.findUnique({
            where: {
                id: id
            },
            include: {
                AddedBy: {
                    select: user_dto_1.UserDefaultAttributes
                },
                User: {
                    select: user_dto_1.UserDefaultAttributes
                }
            },
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    update(id, updateDto, user) {
        if (updateDto.checkIn) {
            let daysDifference = Math.abs((0, common_2.getDifferenceInDays)(new Date(), updateDto.checkIn));
            if (daysDifference > 31) {
                throw {
                    message: "You cannot add check in data older than 31 days",
                    statusCode: 404
                };
            }
            if (updateDto.checkIn > new Date()) {
                throw {
                    message: "You cannot add biometrics data for future dates",
                    statusCode: 404
                };
            }
        }
        return this.prisma.biometricsChecks.update({
            data: Object.assign(Object.assign({}, updateDto), { isProcessed: false, modifiedById: (user.userEmail === constants_1.TEST_EMAIL) ? undefined : user.userId, modifiedDate: (user.userEmail === constants_1.TEST_EMAIL) ? undefined : new Date() }),
            where: {
                id: id
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    applyFilters(filters) {
        let condition = {};
        if (Object.entries(filters).length > 0) {
            if (filters.type) {
                condition = Object.assign(Object.assign({}, condition), { type: filters.type });
            }
            if (filters.userId) {
                condition = Object.assign(Object.assign({}, condition), { userId: filters.userId });
            }
            if (filters.organizationId) {
                condition = Object.assign(Object.assign({}, condition), { User: {
                        organizationId: filters.organizationId
                    } });
            }
            if (filters.mode) {
                condition = Object.assign(Object.assign({}, condition), { mode: filters.mode });
            }
            if (filters.fromDate && filters.toDate) {
                condition = Object.assign(Object.assign({}, condition), { AND: [
                        {
                            checkIn: {
                                gte: new Date(filters.fromDate + "T00:00:00")
                            }
                        },
                        {
                            checkIn: {
                                lte: new Date(filters.toDate + "T23:59:59")
                            }
                        }
                    ] });
            }
            else {
                if (filters.fromDate) {
                    condition = Object.assign(Object.assign({}, condition), { checkIn: { gte: new Date(filters.fromDate + "T00:00:00") } });
                }
                if (filters.toDate) {
                    condition = Object.assign(Object.assign({}, condition), { checkIn: { lte: new Date(filters.toDate + "T23:59:59") } });
                }
            }
        }
        return condition;
    }
    countRecords(filters) {
        return this.prisma.biometricsChecks.count({
            where: filters
        });
    }
    checkInCheckOut(createDto, user) {
        return this.prisma.biometricsChecks.create({
            data: {
                mode: createDto.mode,
                type: (createDto.force) ? constants_1.BiometricsEntryType.force : constants_1.BiometricsEntryType.auto,
                checkIn: createDto.checkIn,
                latitude: createDto.latitude,
                longitude: createDto.longitude,
                selfie: createDto.selfie,
                userAgent: createDto.userAgent,
                userIP: createDto.userIP,
                userId: user.userId,
                addedDate: new Date(),
            }
        });
    }
    async validateCheckInCheckOut(createDto, user) {
        let mode = createDto.mode;
        let userData = await this.prisma.user.findUniqueOrThrow({
            where: {
                id: user.userId
            },
            select: {
                enableRemoteCheckin: true
            }
        });
        if (!userData.enableRemoteCheckin) {
            if (!createDto.force) {
                let validProximity = this.coordinatesService.validateProximity(createDto.latitude, createDto.longitude);
                if (!validProximity) {
                    throw {
                        message: "You are not near by office location. If you are near try moving to adjust your location and try again",
                        statusCode: 400
                    };
                }
            }
        }
        if (mode === 'out') {
            let dt = new Date(createDto.checkIn);
            dt.setHours(0, 0, 0, 0);
            let checkInData = await this.prisma.biometricsChecks.findFirst({
                where: {
                    checkIn: {
                        gte: dt
                    },
                    mode: 'in'
                }
            });
            if (!checkInData) {
                throw {
                    message: "You haven't check in today. You should check in first in order to check out later",
                    statusCode: 400
                };
            }
        }
        else {
            let dt = new Date(createDto.checkIn);
            dt.setHours(0, 0, 0, 0);
        }
    }
    async getTodayCheckInCheckOut(userId) {
        let response = {
            checkIn: null,
            checkOut: null
        };
        const { dayStart, dayEnd } = (0, common_2.getDayRange)(new Date());
        const checkIn = await this.prisma.biometricsChecks.findFirst({
            where: {
                userId: userId,
                mode: 'in',
                AND: [
                    { checkIn: { gte: dayStart } },
                    { checkIn: { lte: dayEnd } }
                ]
            },
            orderBy: { checkIn: 'asc' }
        });
        if (checkIn && checkIn.id) {
            response.checkIn = checkIn;
            const checkOut = await this.prisma.biometricsChecks.findFirst({
                where: {
                    userId: userId,
                    mode: 'out',
                    NOT: {
                        id: checkIn.id
                    },
                    AND: [
                        { checkIn: { gte: dayStart } },
                        { checkIn: { lte: dayEnd } }
                    ]
                },
                orderBy: { checkIn: 'desc' }
            });
            if (checkOut && checkOut.id) {
                response.checkOut = checkOut;
            }
        }
        return response;
    }
    delete(id) {
        return this.prisma.biometricsChecks.delete({
            where: {
                id: id
            }
        });
    }
};
BiometricsService = BiometricsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, coordinates_service_1.CoordinatesService])
], BiometricsService);
exports.BiometricsService = BiometricsService;
//# sourceMappingURL=biometrics.service.js.map