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
var PublicHolidayService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicHolidayService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
const user_dto_1 = require("../user/dto/user.dto");
const common_2 = require("../../helpers/common");
let PublicHolidayService = PublicHolidayService_1 = class PublicHolidayService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(PublicHolidayService_1.name);
    }
    create(createDto, user) {
        const { title, dates } = createDto;
        let insertData = dates.map((ele) => {
            return {
                title: title,
                date: new Date(ele),
                addedDate: new Date(),
                addedById: user.userId
            };
        });
        return this.prisma.publicHoliday.createMany({
            data: insertData,
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
        let records = this.prisma.publicHoliday.findMany({
            where: filters,
            skip: skip,
            take: take,
            include: {
                AddedBy: {
                    select: user_dto_1.UserDefaultAttributes
                },
            },
            orderBy: {
                id: 'desc'
            }
        });
        return records;
    }
    findOne(id) {
        return this.prisma.publicHoliday.findUnique({
            where: {
                id: id
            },
            include: {
                AddedBy: {
                    select: user_dto_1.UserDefaultAttributes
                },
            },
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    update(id, updateDto) {
        const { title } = updateDto;
        if (title) {
            return this.prisma.publicHoliday.update({
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
        else {
            return this.findOne(id);
        }
    }
    applyFilters(filters) {
        let condition = {};
        if (Object.entries(filters).length > 0) {
            if (filters.fromDate && filters.toDate) {
                condition = Object.assign(Object.assign({}, condition), { AND: [
                        {
                            date: {
                                gte: new Date(filters.fromDate + "T00:00:00")
                            }
                        },
                        {
                            date: {
                                lte: new Date(filters.toDate + "T23:59:59")
                            }
                        }
                    ] });
            }
            else {
                if (filters.fromDate) {
                    condition = Object.assign(Object.assign({}, condition), { date: { gte: new Date(filters.fromDate + "T00:00:00") } });
                }
                if (filters.toDate) {
                    condition = Object.assign(Object.assign({}, condition), { date: { lte: new Date(filters.toDate + "T23:59:59") } });
                }
            }
        }
        return condition;
    }
    countRecords(filters) {
        return this.prisma.publicHoliday.count({
            where: filters
        });
    }
    async delete(recordId) {
        let recordData = await this.prisma.publicHoliday.findFirst({
            where: {
                id: recordId
            }
        });
        let today = new Date();
        let difference = Math.abs((0, common_2.getDifferenceInDays)(recordData.date, today));
        if (difference > 60) {
            throw {
                message: "You cannot delete a record that is older than 60 days",
                statusCode: 400
            };
        }
        return this.prisma.publicHoliday.delete({
            where: {
                id: recordId
            }
        });
    }
};
PublicHolidayService = PublicHolidayService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PublicHolidayService);
exports.PublicHolidayService = PublicHolidayService;
//# sourceMappingURL=public-holiday.service.js.map