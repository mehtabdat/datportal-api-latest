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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var BiometricsJobService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BiometricsJobService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
const user_dto_1 = require("../user/dto/user.dto");
const constants_1 = require("../../config/constants");
const common_2 = require("../../helpers/common");
const bull_1 = require("@nestjs/bull");
let BiometricsJobService = BiometricsJobService_1 = class BiometricsJobService {
    constructor(prisma, propertyQueue) {
        this.prisma = prisma;
        this.propertyQueue = propertyQueue;
        this.logger = new common_1.Logger(BiometricsJobService_1.name);
    }
    create(createDto) {
        return this.prisma.biometricsJob.create({
            data: createDto,
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
        let records = this.prisma.biometricsJob.findMany({
            where: filters,
            skip: skip,
            take: take,
            include: {
                _count: {
                    select: {
                        BiometricsChecks: true
                    }
                },
                AddedBy: {
                    select: user_dto_1.UserDefaultAttributes
                }
            },
            orderBy: {
                id: 'desc'
            }
        });
        return records;
    }
    findOne(id) {
        return this.prisma.biometricsJob.findUnique({
            where: {
                id: id,
                isDeleted: false
            },
            include: {
                _count: {
                    select: {
                        BiometricsChecks: true
                    }
                },
                AddedBy: {
                    select: user_dto_1.UserDefaultAttributes
                }
            },
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    update(id, updateDto) {
        return this.prisma.biometricsJob.update({
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
    applyFilters(filters) {
        let condition = {
            isDeleted: false
        };
        if (Object.entries(filters).length > 0) {
            if (filters.status) {
                condition = Object.assign(Object.assign({}, condition), { status: filters.status });
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
        return this.prisma.biometricsJob.count({
            where: filters
        });
    }
    async remove(jobId) {
        let recordData = await this.prisma.biometricsJob.findFirst({
            where: {
                id: jobId
            }
        });
        if (!(recordData.status === constants_1.BiometricsJobStatus.new || recordData.status === constants_1.BiometricsJobStatus.rollback)) {
            throw {
                message: "You can only delete the record if it is not processed",
                statusCode: 400
            };
        }
        return this.prisma.biometricsJob.update({
            where: {
                id: jobId
            },
            data: {
                isDeleted: true
            }
        });
    }
    async rollback(jobId, biometricsJobRollbackDto) {
        let recordData = await this.prisma.biometricsJob.findFirst({
            where: {
                id: jobId
            }
        });
        if (!(recordData.status === constants_1.BiometricsJobStatus.completed || recordData.status === constants_1.BiometricsJobStatus.failed)) {
            throw {
                message: `You can only rollback the record once the job has compled or failed. This job is currently in state:${(0, common_2.getEnumKeyByEnumValue)(constants_1.BiometricsJobStatus, recordData.status)}`,
                statusCode: 400
            };
        }
        let differenceInDays = Math.abs((0, common_2.getDifferenceInDays)(recordData.addedDate, new Date()));
        if (differenceInDays > 3) {
            throw {
                message: "You can only rollback last 3 days record",
                statusCode: 400
            };
        }
        await this.prisma.biometricsChecks.deleteMany({
            where: {
                biometricsJobId: recordData.id
            }
        });
        let updatedRecord = await this.prisma.biometricsJob.update({
            where: {
                id: recordData.id
            },
            data: {
                status: constants_1.BiometricsJobStatus.rollback
            },
            include: {
                _count: {
                    select: {
                        BiometricsChecks: true
                    }
                },
                AddedBy: {
                    select: user_dto_1.UserDefaultAttributes
                }
            },
        });
        return updatedRecord;
    }
    setIsProcessing(id) {
        return this.prisma.biometricsJob.update({
            where: {
                id: id
            },
            data: {
                status: constants_1.BiometricsJobStatus.processing
            }
        });
    }
    async bulkUploadBiometrics(jobId) {
        let job = await this.prisma.biometricsJob.findUnique({
            where: {
                id: jobId
            },
            include: {
                UploadFormat: true
            }
        });
        if (!job || !job.UploadFormat || !job.UploadFormat.format) {
            throw {
                message: "Cannot find a job or a data format",
                statusCode: 400
            };
        }
        if (job.status === constants_1.BiometricsJobStatus.completed) {
            throw {
                message: "This file has already been processed",
                statusCode: 200
            };
        }
        if (job.status === constants_1.BiometricsJobStatus.processing) {
            throw {
                message: "This file is currently under progress, please check back later",
                statusCode: 200
            };
        }
        let jobData = await this.propertyQueue.add('bulkUploadBiometrics', {
            message: "Start Bulk Upload Biometrics",
            data: {
                jobId: jobId
            }
        }, { removeOnComplete: true });
        return this.prisma.biometricsJob.update({
            where: {
                id: jobId
            },
            data: {
                status: constants_1.BiometricsJobStatus.processing,
                backgroundId: jobData.id.toString(),
                processeStartDate: new Date()
            }
        });
    }
    async stopUploadBiometrics(jobId) {
        let data = await this.prisma.biometricsJob.findFirst({
            where: {
                id: jobId
            }
        });
        if (!data) {
            throw {
                message: "Requested job not found",
                statusCode: 404
            };
        }
        if (data.status === constants_1.BiometricsJobStatus.processing) {
            let jobData = await this.propertyQueue.add('stopBulkUploadBiometrics', {
                message: "Stop Bulk Biometrics Upload",
                data: {
                    jobId: jobId
                }
            }, { removeOnComplete: true });
            return { message: "Stopping" };
        }
        else {
            throw {
                message: "Requested Job was never started. Job must be in a runnung state to stop.",
                statusCode: 400
            };
        }
    }
};
BiometricsJobService = BiometricsJobService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bull_1.InjectQueue)('bulk-upload-biometrics')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object])
], BiometricsJobService);
exports.BiometricsJobService = BiometricsJobService;
//# sourceMappingURL=biometrics-job.service.js.map