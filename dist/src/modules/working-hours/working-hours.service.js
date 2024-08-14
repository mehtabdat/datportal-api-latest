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
var WorkingHoursService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkingHoursService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
const common_2 = require("../../helpers/common");
let WorkingHoursService = WorkingHoursService_1 = class WorkingHoursService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(WorkingHoursService_1.name);
    }
    create(createDto) {
        let hours = createDto.openingHours;
        hours.forEach((ele, index) => {
            if (ele.closed !== true) {
                const openDate = new Date(`2000-01-01T${ele.open}:00`);
                const closeDate = new Date(`2000-01-01T${ele.close}:00`);
                let totalHours = (0, common_2.calculateTotalHours)(openDate, closeDate);
                hours[index]['totalHours'] = totalHours;
            }
        });
        return this.prisma.workingHours.create({
            data: {
                title: createDto.title,
                hours: hours
            },
        })
            .catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    findAll(filters) {
        let records = this.prisma.workingHours.findMany({
            where: filters,
            orderBy: {
                id: 'desc'
            }
        });
        return records;
    }
    findOne(id) {
        return this.prisma.workingHours.findUnique({
            where: {
                id: id
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    update(id, updateDto) {
        let hours = updateDto.openingHours;
        if (hours && hours.length > 0) {
            hours.forEach((ele, index) => {
                if (ele.closed !== true) {
                    const openDate = new Date(`2000-01-01T${ele.open}:00`);
                    const closeDate = new Date(`2000-01-01T${ele.close}:00`);
                    let totalHours = (0, common_2.calculateTotalHours)(openDate, closeDate);
                    hours[index]['totalHours'] = totalHours;
                }
            });
        }
        return this.prisma.workingHours.update({
            data: {
                title: (updateDto.title) ? updateDto.title : undefined,
                hours: hours && hours.length > 0 ? hours : undefined
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
    remove(id) {
        return this.prisma.workingHours.delete({
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
WorkingHoursService = WorkingHoursService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WorkingHoursService);
exports.WorkingHoursService = WorkingHoursService;
//# sourceMappingURL=working-hours.service.js.map