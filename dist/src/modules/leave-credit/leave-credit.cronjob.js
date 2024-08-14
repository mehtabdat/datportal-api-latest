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
var LeaveCreditCronJob_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveCreditCronJob = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const constants_1 = require("../../config/constants");
const prisma_service_1 = require("../../prisma.service");
const BluebirdPromise = require("bluebird");
let LeaveCreditCronJob = LeaveCreditCronJob_1 = class LeaveCreditCronJob {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(LeaveCreditCronJob_1.name);
    }
    async addLeaveCreditsReport() {
        this.logger.log("Called every month on 1st at 00:00AM to add leave credits");
        const rawQuery = `
        SELECT *
        FROM "User"
        WHERE 
        EXTRACT(MONTH FROM age(CURRENT_DATE, "dateOfJoining")) % 3 = 0
        AND "status" = ${constants_1.UserStatus.active}`;
        const allUsers = await this.prisma.$queryRawUnsafe(rawQuery);
        const MAX_CONCURRENT_OPERATIONS = 10;
        await BluebirdPromise.map(allUsers, async (ele) => {
            await this.prisma.leaveCredits.create({
                data: {
                    userId: ele.id,
                    daysCount: 30,
                    note: "Leave Credits Auto Added By System"
                }
            });
        }, { concurrency: MAX_CONCURRENT_OPERATIONS });
    }
};
__decorate([
    (0, schedule_1.Cron)('0 0 1 * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LeaveCreditCronJob.prototype, "addLeaveCreditsReport", null);
LeaveCreditCronJob = LeaveCreditCronJob_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LeaveCreditCronJob);
exports.LeaveCreditCronJob = LeaveCreditCronJob;
//# sourceMappingURL=leave-credit.cronjob.js.map