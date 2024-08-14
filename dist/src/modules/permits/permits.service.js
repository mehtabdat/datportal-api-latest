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
var PermitsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermitsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma.service");
const project_entity_1 = require("../project/entities/project.entity");
const file_upload_utils_1 = require("../../helpers/file-upload.utils");
const constants_1 = require("../../config/constants");
const project_dto_1 = require("../project/dto/project.dto");
const user_dto_1 = require("../user/dto/user.dto");
const client_dto_1 = require("../client/dto/client.dto");
const authority_dto_1 = require("../authorities/dto/authority.dto");
let PermitsService = PermitsService_1 = class PermitsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(PermitsService_1.name);
    }
    create(createDto) {
        return this.prisma.permit.create({
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
        let records = this.prisma.permit.findMany({
            where: filters,
            include: {
                _count: {
                    select: {
                        Resources: {
                            where: {
                                isDeleted: false
                            }
                        }
                    }
                },
                Project: {
                    select: project_dto_1.ProjectDefaultAttributes
                },
                AddedBy: {
                    select: user_dto_1.UserDefaultAttributes
                },
                Client: {
                    select: client_dto_1.ClientDefaultAttributes
                },
                Authority: {
                    select: authority_dto_1.AuthorityDefaultAttributes
                }
            },
            skip: skip,
            take: take,
            orderBy: {
                id: 'desc'
            }
        });
        return records;
    }
    findOne(id) {
        return this.prisma.permit.findUnique({
            where: {
                id: id
            },
            include: {
                Resources: {
                    where: {
                        isDeleted: false
                    }
                },
                Project: {
                    select: project_dto_1.ProjectDefaultAttributes
                },
                AddedBy: {
                    select: user_dto_1.UserDefaultAttributes
                },
                Client: {
                    select: client_dto_1.ClientDefaultAttributes
                },
                Authority: {
                    select: authority_dto_1.AuthorityDefaultAttributes
                }
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    update(id, updateDto) {
        return this.prisma.permit.update({
            data: updateDto,
            where: {
                id: id
            },
            include: {
                Resources: {
                    where: {
                        isDefault: false
                    }
                }
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    remove(id) {
        return this.prisma.permit.update({
            data: {
                isDeleted: true,
                Resources: {
                    updateMany: {
                        where: {
                            permitId: id
                        },
                        data: {
                            isDeleted: true
                        }
                    }
                }
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
        if (Object.entries(filters).length > 0) {
            if (filters.financeStatus) {
                condition = Object.assign(Object.assign({}, condition), { financeStatus: filters.financeStatus });
            }
            if (filters.clientStatus) {
                condition = Object.assign(Object.assign({}, condition), { clientStatus: filters.clientStatus });
            }
            if (filters.projectId) {
                condition = Object.assign(Object.assign({}, condition), { projectId: filters.projectId });
            }
            if (filters.clientId) {
                condition = Object.assign(Object.assign({}, condition), { clientId: filters.clientId });
            }
            if (filters.authorityId) {
                condition = Object.assign(Object.assign({}, condition), { authorityId: filters.authorityId });
            }
            if (filters.onlyActive) {
                let today = new Date();
                today.setHours(0, 0, 0, 0);
                condition = Object.assign(Object.assign({}, condition), { expiryDate: {
                        gte: today,
                    }, approvedDate: {
                        lte: today
                    } });
            }
            if (filters.onlyExpired) {
                let today = new Date();
                today.setHours(0, 0, 0, 0);
                condition = Object.assign(Object.assign({}, condition), { expiryDate: {
                        lt: today,
                    } });
            }
            if (filters.fromDate && filters.toDate) {
                condition = Object.assign(Object.assign({}, condition), { AND: [
                        {
                            expiryDate: {
                                gte: new Date(filters.fromDate + "T00:00:00")
                            }
                        },
                        {
                            expiryDate: {
                                lte: new Date(filters.toDate + "T23:59:59")
                            }
                        }
                    ] });
            }
            else {
                if (filters.fromDate) {
                    condition = Object.assign(Object.assign({}, condition), { expiryDate: { gte: new Date(filters.fromDate + "T00:00:00") } });
                }
                if (filters.toDate) {
                    condition = Object.assign(Object.assign({}, condition), { expiryDate: { lte: new Date(filters.toDate + "T23:59:59") } });
                }
            }
        }
        return condition;
    }
    async handleDocuments(permit, files, user) {
        if (!permit) {
            throw new common_1.NotFoundException({ message: "Permit with the provided id not Found", statusCode: 400 });
        }
        let insertData = files.map((ele, index) => {
            let newRecord = {
                documentType: project_entity_1.ProjectDocumentsTypes.permit,
                title: permit.title,
                name: ele.originalname,
                file: ele.filename,
                fileType: ele.mimetype,
                path: (0, file_upload_utils_1.extractRelativePathFromFullPath)(ele.path),
                isTemp: false,
                status: constants_1.FileStatus.Verified,
                addedById: user.userId,
                visibility: client_1.FileVisibility.organization,
                projectId: permit.projectId,
                permitId: permit.id,
                fileSize: ele.size / 1024
            };
            return newRecord;
        });
        if (insertData.length > 0) {
            return this.prisma.fileManagement.createMany({
                data: insertData
            }).catch((err) => {
                this.logger.error("Error on " + this.constructor.name + "Custom Error code: ERR437 \n Error code : " + err.code + " \n Error message : " + err.message);
                let errorResponse = { message: err.message, statusCode: 404, data: {} };
                throw errorResponse;
            });
        }
    }
    async markAllPermitAsSent(permit, user) {
        let allRecords = [];
        let lastBatch = await this.prisma.fileshareLogs.aggregate({
            _max: {
                batchNumber: true
            }
        });
        let newBatch = (lastBatch && lastBatch._max.batchNumber) ? lastBatch._max.batchNumber + 1 : 1;
        for (const ele of permit.Resources) {
            let isExisting = await this.prisma.fileshareLogs.findFirst({
                where: {
                    clientId: permit.clientId,
                    projectId: ele.projectId,
                    fileId: ele.id,
                }
            });
            if (!isExisting) {
                let t = {
                    clientId: permit.clientId,
                    projectId: ele.projectId,
                    fileId: ele.id,
                    addedDate: new Date(),
                    sharedById: user.userId,
                    batchNumber: newBatch
                };
                allRecords.push(t);
            }
        }
        await this.prisma.fileshareLogs.createMany({
            data: allRecords
        });
    }
    countRecords(filters) {
        return this.prisma.permit.count({
            where: filters
        });
    }
};
PermitsService = PermitsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PermitsService);
exports.PermitsService = PermitsService;
//# sourceMappingURL=permits.service.js.map