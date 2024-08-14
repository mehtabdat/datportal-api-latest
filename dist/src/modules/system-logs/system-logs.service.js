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
exports.SystemLogsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
let SystemLogsService = class SystemLogsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findSystemLogs(pagination, sorting, condition) {
        let skip = (pagination.perPage * (pagination.page - 1));
        let take = pagination.perPage;
        let __sorter = { [sorting.sortByField]: sorting.sortOrder };
        return this.prisma.systemLogs.findMany({
            where: condition,
            include: {
                AddedBy: {
                    select: {
                        id: true,
                        uuid: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        profile: true
                    }
                },
            },
            skip: skip,
            take: take,
            orderBy: __sorter,
        });
    }
    applyFilters(filters) {
        let condition = {};
        if (Object.entries(filters).length > 0) {
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
            if (filters.table) {
                condition = Object.assign(Object.assign({}, condition), { table: filters.table });
            }
            if (filters.tableColumnKey) {
                condition = Object.assign(Object.assign({}, condition), { tableColumnKey: {
                        contains: filters.tableColumnKey,
                        mode: 'insensitive'
                    } });
            }
            if (filters.tableColumnValue) {
                condition = Object.assign(Object.assign({}, condition), { tableColumnValue: {
                        contains: filters.tableColumnValue,
                        mode: 'insensitive'
                    } });
            }
            if (filters.addedById) {
                condition = Object.assign(Object.assign({}, condition), { addedById: filters.addedById });
            }
        }
        return condition;
    }
    countTotalRecord(condition) {
        return this.prisma.systemLogs.count({
            where: condition
        });
    }
};
SystemLogsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SystemLogsService);
exports.SystemLogsService = SystemLogsService;
//# sourceMappingURL=system-logs.service.js.map