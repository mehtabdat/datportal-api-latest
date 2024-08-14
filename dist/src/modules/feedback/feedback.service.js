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
var FeedbackService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
const user_dto_1 = require("../user/dto/user.dto");
const file_upload_utils_1 = require("../../helpers/file-upload.utils");
let FeedbackService = FeedbackService_1 = class FeedbackService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(FeedbackService_1.name);
    }
    create(createDto, user) {
        return this.prisma.feedback.create({
            data: createDto,
        })
            .catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    findAll(filters, pagination, sorting) {
        let skip = (pagination.perPage * (pagination.page - 1));
        let take = pagination.perPage;
        let __sorter = { [sorting.sortByField]: sorting.sortOrder };
        let records = this.prisma.feedback.findMany({
            where: filters,
            skip: skip,
            take: take,
            include: {
                AddedBy: {
                    select: user_dto_1.UserDefaultAttributes
                },
                Attatchments: true
            },
            orderBy: __sorter
        });
        return records;
    }
    findOne(id) {
        return this.prisma.feedback.findUnique({
            where: {
                id: id
            },
            include: {
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
    applyFilters(filters) {
        let condition = {};
        if (Object.entries(filters).length > 0) {
            if (filters.addedById) {
                condition = Object.assign(Object.assign({}, condition), { addedById: filters.addedById });
            }
        }
        return condition;
    }
    countRecords(filters) {
        return this.prisma.feedback.count({
            where: filters
        });
    }
    async handleFiles(feedbackId, files) {
        let insertData = [];
        files.forEach((ele, index) => {
            let newRecord = {
                file: (0, file_upload_utils_1.extractRelativePathFromFullPath)(ele.path),
                feedbackId: feedbackId
            };
            insertData.push(newRecord);
        });
        if (insertData.length > 0) {
            await this.prisma.feedbackFiles.createMany({
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
};
FeedbackService = FeedbackService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FeedbackService);
exports.FeedbackService = FeedbackService;
//# sourceMappingURL=feedback.service.js.map