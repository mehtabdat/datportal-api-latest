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
var NotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
const BluebirdPromise = require("bluebird");
const user_dto_1 = require("../user/dto/user.dto");
let NotificationService = NotificationService_1 = class NotificationService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(NotificationService_1.name);
    }
    async create(createNotificationDto) {
        const { userIds } = createNotificationDto, rest = __rest(createNotificationDto, ["userIds"]);
        let noti = await this.prisma.notification.create({
            data: Object.assign(Object.assign({}, rest), { mode: 'manual' })
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
        if (noti && createNotificationDto.type === 'user' && userIds) {
            await this.prisma.subscribers.createMany({
                data: userIds.map((ele) => {
                    return {
                        notificationId: noti.id,
                        userId: ele
                    };
                })
            });
        }
        return noti;
    }
    findAll(condition, pagination) {
        let recordData = this.prisma.notification.findMany({
            where: condition,
            orderBy: {
                id: 'desc'
            }
        });
        return recordData;
    }
    findAllAnnouncement(condition, pagination) {
        let recordData = this.prisma.notification.findMany({
            where: condition,
            include: {
                Department: {
                    select: user_dto_1.DepartmentDefaultAttributes
                },
                Subscribers: {
                    select: {
                        User: {
                            select: user_dto_1.UserDefaultAttributes
                        }
                    }
                }
            },
            orderBy: {
                addedDate: 'desc'
            }
        });
        return recordData;
    }
    remove(id) {
        return this.prisma.notification.delete({
            where: {
                id: id
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    async readNotification(id, user) {
        let notiData = await this.prisma.notification.findUnique({
            where: {
                id: id,
                AND: {
                    OR: [
                        {
                            Subscribers: {
                                some: {
                                    userId: user.userId
                                }
                            }
                        },
                        {
                            type: 'broadcast'
                        },
                        (user.department) ?
                            {
                                type: 'department',
                                departmentId: user.department.id
                            }
                            : undefined
                    ]
                }
            }
        });
        if (!notiData) {
            throw {
                message: "No Notification Found With Provided ID or You don't have permission to update this record",
                statusCode: 404
            };
        }
        return this.prisma.subscribers.upsert({
            where: {
                notificationId_userId: {
                    userId: user.userId,
                    notificationId: id
                }
            },
            create: {
                userId: user.userId,
                notificationId: id,
                read: true
            },
            update: {
                read: true
            }
        });
    }
    async readAllNotification(user) {
        let allRecords = await this.prisma.notification.findMany({
            where: {
                AND: {
                    OR: [
                        {
                            Subscribers: {
                                some: {
                                    userId: user.userId
                                }
                            }
                        },
                        {
                            type: 'broadcast'
                        },
                        (user.department) ?
                            {
                                type: 'department',
                                departmentId: user.department.id
                            }
                            : undefined
                    ]
                }
            }
        });
        if (!allRecords) {
            return true;
        }
        let updatedRecords = [];
        const MAX_CONCURRENT_OPERATIONS = 10;
        await BluebirdPromise.map(allRecords, async (ele) => {
            let dt = this.prisma.subscribers.upsert({
                where: {
                    notificationId_userId: {
                        userId: user.userId,
                        notificationId: ele.id
                    }
                },
                create: {
                    userId: user.userId,
                    notificationId: ele.id,
                    read: true
                },
                update: {
                    read: true
                }
            });
            updatedRecords.push(dt);
        }, { concurrency: MAX_CONCURRENT_OPERATIONS });
        await Promise.all(updatedRecords);
        return true;
    }
    applyFilters(filters, user) {
        let condition = {};
        if (Object.entries(filters).length > 0) {
            if (filters.showUnreadOnly === true) {
                condition = Object.assign(Object.assign({}, condition), { AND: {
                        OR: [
                            {
                                type: 'user',
                                Subscribers: {
                                    some: {
                                        userId: user.userId,
                                        read: false
                                    }
                                }
                            },
                            {
                                type: 'broadcast',
                                NOT: {
                                    Subscribers: {
                                        some: {
                                            userId: user.userId,
                                            read: true
                                        }
                                    }
                                }
                            },
                            (user.department) ?
                                {
                                    type: 'department',
                                    departmentId: user.department.id,
                                    NOT: {
                                        Subscribers: {
                                            some: {
                                                userId: user.userId,
                                                read: true
                                            }
                                        }
                                    }
                                }
                                : undefined
                        ]
                    } });
            }
            else {
                condition = Object.assign(Object.assign({}, condition), { AND: {
                        OR: [
                            {
                                Subscribers: {
                                    some: {
                                        userId: user.userId
                                    }
                                }
                            },
                            {
                                type: 'broadcast'
                            },
                            (user.department) ?
                                {
                                    type: 'department',
                                    departmentId: user.department.id
                                }
                                : undefined
                        ]
                    } });
            }
        }
        return condition;
    }
    applyAnnouncementFilters() {
        let condition = {
            mode: 'manual'
        };
        return condition;
    }
    countNotifications(filters) {
        return this.prisma.notification.count({
            where: filters
        });
    }
};
NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationService);
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map