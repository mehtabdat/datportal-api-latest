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
var CarReservationRequestService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarReservationRequestService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
const user_dto_1 = require("../user/dto/user.dto");
const file_upload_utils_1 = require("../../helpers/file-upload.utils");
const constants_1 = require("../../config/constants");
const common_2 = require("../../helpers/common");
let CarReservationRequestService = CarReservationRequestService_1 = class CarReservationRequestService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(CarReservationRequestService_1.name);
    }
    async create(createDto, user) {
        return this.prisma.carReservationRequest.create({
            data: {
                purpose: createDto.purpose,
                fromDate: new Date(createDto.fromDate),
                toDate: new Date(createDto.toDate),
                projectId: (createDto.projectId) ? createDto.projectId : undefined,
                requestById: user.userId,
                addedDate: new Date()
            },
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
        let records = this.prisma.carReservationRequest.findMany({
            where: filters,
            skip: skip,
            take: take,
            include: {
                _count: {
                    select: {
                        AdminActions: true,
                        Attachments: true
                    }
                },
                RequestBy: {
                    select: user_dto_1.UserDefaultAttributes
                },
                AdminActions: {
                    take: 1,
                    orderBy: {
                        addedDate: 'desc'
                    },
                    include: {
                        ActionBy: {
                            select: user_dto_1.UserDefaultAttributes
                        }
                    }
                }
            },
            orderBy: {
                id: 'desc'
            }
        });
        return records;
    }
    findOne(id) {
        return this.prisma.carReservationRequest.findUnique({
            where: {
                id: id
            },
            include: {
                RequestBy: {
                    select: user_dto_1.UserDefaultAttributes
                },
                AdminActions: {
                    include: {
                        Department: {
                            select: user_dto_1.DepartmentDefaultAttributes
                        },
                        ActionBy: {
                            select: user_dto_1.UserDefaultAttributes
                        }
                    }
                },
                Attachments: true
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    async hrUpdate(carReservationRequestId, carReservationRequestAdminAction, user) {
        let recordData = await this.prisma.carReservationRequest.findFirst({
            where: {
                id: carReservationRequestId
            },
            include: {
                AdminActions: true
            }
        });
        if (recordData.status !== constants_1.CarReservationRequestStatus.submitted) {
            throw {
                message: `This request has been already marked as ${(0, common_2.getEnumKeyByEnumValue)(constants_1.CarReservationRequestStatus, recordData.status)}`,
                statusCode: 400
            };
        }
        await this.prisma.adminAction.create({
            data: {
                Department: {
                    connect: {
                        slug: constants_1.Departments.hr
                    }
                },
                status: carReservationRequestAdminAction.status,
                comment: carReservationRequestAdminAction.comment,
                ActionBy: {
                    connect: {
                        id: user.userId
                    }
                },
                CarReservationRequest: {
                    connect: {
                        id: carReservationRequestId
                    }
                }
            }
        });
        let status = carReservationRequestAdminAction.status;
        await this.prisma.carReservationRequest.update({
            where: {
                id: carReservationRequestId
            },
            data: {
                status: status,
                companyCarId: carReservationRequestAdminAction.companyCarId
            }
        });
        return this.findOne(carReservationRequestId);
    }
    async withdraw(id) {
        let record = await this.prisma.carReservationRequest.findFirst({
            where: {
                id
            }
        });
        if (record.status === constants_1.CarReservationRequestStatus.rejected) {
            throw {
                message: "You cannot withdraw your request as the request is already" + (0, common_2.getEnumKeyByEnumValue)(constants_1.CarReservationRequestStatus, record.status),
                statuCode: 400
            };
        }
        return this.prisma.carReservationRequest.update({
            data: {
                status: constants_1.CarReservationRequestStatus.withdrawn
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
    async submitRequest(carReservationRequestId) {
        let record = await this.prisma.carReservationRequest.findFirst({
            where: {
                id: carReservationRequestId
            }
        });
        return this.prisma.carReservationRequest.update({
            data: {
                status: constants_1.CarReservationRequestStatus.submitted
            },
            where: {
                id: carReservationRequestId
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    applyFilters(filters, permissions) {
        let condition = {};
        if (Object.entries(filters).length > 0) {
            if (filters.userId) {
                condition = Object.assign(Object.assign({}, condition), { requestById: filters.userId });
            }
            if (filters.status) {
                condition = Object.assign(Object.assign({}, condition), { status: filters.status });
            }
            if (filters.fromDate && filters.toDate) {
                condition = Object.assign(Object.assign({}, condition), { AND: [
                        {
                            fromDate: {
                                gte: new Date(filters.fromDate + "T00:00:00")
                            }
                        },
                        {
                            fromDate: {
                                lte: new Date(filters.toDate + "T23:59:59")
                            }
                        }
                    ] });
            }
            else {
                if (filters.fromDate) {
                    condition = Object.assign(Object.assign({}, condition), { fromDate: { gte: new Date(filters.fromDate + "T00:00:00") } });
                }
                if (filters.toDate) {
                    condition = Object.assign(Object.assign({}, condition), { fromDate: { lte: new Date(filters.toDate + "T23:59:59") } });
                }
            }
        }
        if (filters.fetchOpenRequest && permissions && Object.entries(filters).length > 0) {
            let statusCode = [];
            if (permissions.carReservationRequestHRApproval) {
                statusCode.push(constants_1.CarReservationRequestStatus.submitted);
            }
            condition = Object.assign(Object.assign({}, condition), { status: {
                    in: statusCode
                } });
        }
        return condition;
    }
    countRecords(filters) {
        return this.prisma.carReservationRequest.count({
            where: filters
        });
    }
    async handleFiles(carReservationRequestId, files) {
        let insertData = [];
        files.forEach((ele, index) => {
            let newRecord = {
                title: ele.filename,
                mimeType: ele.mimetype,
                file: (0, file_upload_utils_1.extractRelativePathFromFullPath)(ele.path),
                carReservationRequestId: carReservationRequestId
            };
            insertData.push(newRecord);
        });
        if (insertData.length > 0) {
            await this.prisma.requestAttachment.createMany({
                data: insertData
            }).catch((err) => {
                this.logger.error("Error on " + this.constructor.name + "Custom Error code: ERR437 \n Error code : " + err.code + " \n Error message : " + err.message);
                let errorResponse = { message: err.message, statusCode: 404, data: {} };
                throw errorResponse;
            });
        }
        else {
            return [];
        }
    }
    async checkAvailability(checkCarAvailabilityDto) {
        let availableCars = await this.prisma.companyAsset.count({
            where: {
                id: (checkCarAvailabilityDto.companyCarId) ? checkCarAvailabilityDto.companyCarId : undefined,
                type: constants_1.CompanyAssetType.car,
                CarReservationRequest: {
                    none: {
                        status: constants_1.CarReservationRequestStatus.approved,
                        AND: [
                            {
                                fromDate: {
                                    lte: new Date(checkCarAvailabilityDto.toDate),
                                }
                            },
                            {
                                toDate: {
                                    gte: new Date(checkCarAvailabilityDto.fromDate)
                                }
                            }
                        ]
                    }
                }
            }
        });
        return availableCars !== 0;
    }
};
CarReservationRequestService = CarReservationRequestService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CarReservationRequestService);
exports.CarReservationRequestService = CarReservationRequestService;
//# sourceMappingURL=car-reservation-request.service.js.map