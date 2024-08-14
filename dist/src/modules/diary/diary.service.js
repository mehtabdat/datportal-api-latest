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
var DiaryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiaryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
const project_dto_1 = require("../project/dto/project.dto");
let DiaryService = DiaryService_1 = class DiaryService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(DiaryService_1.name);
    }
    create(createDto) {
        return this.prisma.dailyRoutine.create({
            data: createDto,
        })
            .catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    async findAll(filters, pagination) {
        let skip = (pagination.perPage * (pagination.page - 1));
        let take = pagination.perPage;
        let records = await this.prisma.dailyRoutine.findMany({
            where: filters,
            skip: skip,
            take: take,
            include: {
                Project: {
                    select: project_dto_1.ProjectDefaultAttributes
                },
                TaskType: {
                    select: {
                        id: true,
                        title: true,
                        slug: true
                    }
                },
                User: {
                    select: {
                        id: true,
                        uuid: true,
                        firstName: true,
                        lastName: true,
                        profile: true,
                        email: true
                    }
                }
            },
            orderBy: {
                addedDate: 'desc'
            }
        });
        return records;
    }
    findOne(id) {
        return this.prisma.dailyRoutine.findUnique({
            where: {
                id: id
            },
            include: {
                Project: {
                    select: project_dto_1.ProjectDefaultAttributes
                },
                TaskType: {
                    select: {
                        id: true,
                        title: true,
                        slug: true
                    }
                },
                User: {
                    select: {
                        id: true,
                        uuid: true,
                        firstName: true,
                        lastName: true,
                        profile: true,
                        email: true
                    }
                }
            },
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    update(id, updateDto) {
        return this.prisma.dailyRoutine.update({
            data: updateDto,
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
        return this.prisma.dailyRoutine.update({
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
    applyFilters(filters) {
        let condition = {
            isDeleted: false
        };
        if ((filters === null || filters === void 0 ? void 0 : filters.fromDate) && (filters === null || filters === void 0 ? void 0 : filters.toDate)) {
            let st = new Date(filters.fromDate);
            let en = new Date(filters.toDate);
            let diff = st.valueOf() - en.valueOf();
            let differenceInDays = Math.abs(diff / (24 * 60 * 60 * 1000));
            if (differenceInDays > 30) {
                en.setDate(en.getDate() - 30);
                filters.fromDate = en.toISOString().split('T')[0];
            }
        }
        else if ((filters === null || filters === void 0 ? void 0 : filters.fromDate) && !filters.toDate) {
            let en = new Date(filters.fromDate);
            en.setDate(en.getDate() + 30);
            filters.toDate = en.toISOString().split('T')[0];
        }
        else if (!(filters === null || filters === void 0 ? void 0 : filters.fromDate) && filters.toDate) {
            let en = new Date(filters.toDate);
            en.setDate(en.getDate() - 30);
            filters.fromDate = en.toISOString().split('T')[0];
        }
        else {
            let yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            filters.toDate = yesterday.toISOString().split('T')[0];
            let en = new Date();
            en.setDate(en.getDate() - 30);
            filters.fromDate = en.toISOString().split('T')[0];
        }
        if (Object.entries(filters).length > 0) {
            if (filters.projectId) {
                condition = Object.assign(Object.assign({}, condition), { projectId: filters.projectId });
            }
            if (filters.fromDate && filters.toDate) {
                condition = Object.assign(Object.assign({}, condition), { AND: [
                        {
                            addedDate: {
                                gte: new Date(filters.fromDate + "T00:00:00")
                            }
                        },
                        {
                            addedDate: {
                                lte: new Date(filters.toDate + "T23:59:59")
                            }
                        }
                    ] });
            }
            else {
                if (filters.fromDate) {
                    condition = Object.assign(Object.assign({}, condition), { addedDate: { gte: new Date(filters.fromDate + "T00:00:00") } });
                }
                if (filters.toDate) {
                    condition = Object.assign(Object.assign({}, condition), { addedDate: { lte: new Date(filters.toDate + "T23:59:59") } });
                }
            }
        }
        return condition;
    }
    countRecords(filters) {
        return this.prisma.dailyRoutine.count({
            where: filters
        });
    }
    async findEmployeesUnderUser(user) {
        const userId = user.userId;
        const depth = 4;
        const query = `
    WITH RECURSIVE EmployeeCTE AS (
      SELECT "id", "firstName", "lastName", "managerId", 1 AS depth
      FROM "User"
      WHERE "id" = ${userId}
      UNION ALL
      SELECT u."id", u."firstName", u."lastName", u."managerId", cte.depth + 1
      FROM "User" AS u
      INNER JOIN EmployeeCTE AS cte ON u."managerId" = cte.id
      WHERE cte.depth < ${depth}
    )
    SELECT * FROM EmployeeCTE WHERE "id" != ${userId};
  `;
        const employees = await this.prisma.$queryRawUnsafe(query);
        return employees;
    }
    findUserReport1(users) {
        let userIds = users.map((ele) => ele.id);
        return this.prisma.dailyRoutine.groupBy({
            by: ["userId", "addedDate"],
            where: {
                userId: {
                    in: userIds
                }
            }
        });
    }
    async findUserReport(filters, pagination, users) {
        let skip = (pagination.perPage * (pagination.page - 1));
        let take = pagination.perPage;
        let userIds = users.map((ele) => ele.id);
        let records = await this.prisma.user.findMany({
            where: {
                id: {
                    in: userIds
                }
            },
            select: {
                id: true,
                uuid: true,
                firstName: true,
                lastName: true,
                profile: true,
                email: true,
                DailyRoutine: {
                    where: filters,
                    skip: skip,
                    take: take,
                    include: {
                        Project: {
                            select: project_dto_1.ProjectDefaultAttributes
                        },
                        TaskType: {
                            select: {
                                id: true,
                                title: true,
                                slug: true
                            }
                        },
                    },
                    orderBy: {
                        addedDate: 'desc'
                    }
                }
            }
        });
        return records;
    }
    async findUserReportByUserId(userId, filters) {
        const userData = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                uuid: true,
                firstName: true,
                lastName: true,
                profile: true,
                email: true,
                DailyRoutine: {
                    where: filters,
                    select: {
                        addedDate: true,
                        remarks: true,
                        noOfHours: true,
                        Project: {
                            select: project_dto_1.ProjectDefaultAttributes
                        },
                        TaskType: {
                            select: {
                                id: true,
                                title: true,
                                slug: true
                            }
                        },
                    }
                }
            }
        });
        if (!userData) {
            console.log('User not found.');
            return;
        }
        let totalHoursWorked = await this.prisma.dailyRoutine.aggregate({
            where: {
                userId: userData.id,
                isDeleted: false,
            },
            _sum: {
                noOfHours: true
            }
        });
        const dailyRoutinesByDate = new Map();
        userData.DailyRoutine.forEach((routine) => {
            const date = routine.addedDate.toISOString().slice(0, 10);
            if (!dailyRoutinesByDate.has(date)) {
                dailyRoutinesByDate.set(date, []);
            }
            dailyRoutinesByDate.get(date).push(Object.assign({}, routine));
        });
        const response = Object.assign(Object.assign({}, userData), { totalHours: totalHoursWorked._sum.noOfHours, dailyRoutine: Array.from(dailyRoutinesByDate).map(([date, routines]) => ({
                date,
                routines,
            })) });
        return response;
    }
};
DiaryService = DiaryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DiaryService);
exports.DiaryService = DiaryService;
//# sourceMappingURL=diary.service.js.map