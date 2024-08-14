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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackController = void 0;
const common_1 = require("@nestjs/common");
const feedback_service_1 = require("./feedback.service");
const create_feedback_dto_1 = require("./dto/create-feedback.dto");
const swagger_1 = require("@nestjs/swagger");
const common_types_1 = require("../../common-types/common-types");
const feedback_dto_1 = require("./dto/feedback.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const feedback_permissions_1 = require("./feedback.permissions");
const feedback_filters_dto_1 = require("./dto/feedback-filters.dto");
const file_upload_utils_1 = require("../../helpers/file-upload.utils");
const platform_express_1 = require("@nestjs/platform-express");
const file_management_1 = require("../../helpers/file-management");
const feedback_sorting_dto_1 = require("./dto/feedback-sorting.dto");
const multerOptionsProtected = (0, file_upload_utils_1.getMulterOptions)({ destination: (0, feedback_dto_1.getDynamicUploadPath)(), fileTypes: 'images_and_pdf', limit: 10000000 });
const moduleName = "feedback";
let FeedbackController = class FeedbackController {
    constructor(feedbackService) {
        this.feedbackService = feedbackService;
    }
    async create(createDto, files, req) {
        try {
            createDto.addedById = req.user.userId;
            let data = await this.feedbackService.create(createDto, req.user);
            await this.feedbackService.handleFiles(data.id, files);
            (0, file_management_1.uploadFile)(files);
            let recordData = await this.feedbackService.findOne(data.id);
            return { message: `${moduleName} created successfully`, statusCode: 200, data: recordData };
        }
        catch (err) {
            (0, file_upload_utils_1.removeUploadedFiles)(files);
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAll(filters, sorting, pagination) {
        try {
            let appliedFilters = this.feedbackService.applyFilters(filters);
            let dt = await this.feedbackService.findAll(appliedFilters, pagination, sorting);
            let tCount = this.feedbackService.countRecords(appliedFilters);
            const [data, totalCount] = await Promise.all([dt, tCount]);
            let pageCount = Math.floor(totalCount / pagination.perPage) + ((totalCount % pagination.perPage) === 0 ? 0 : 1);
            return { message: `${moduleName} fetched Successfully`, statusCode: 200, data: data,
                meta: {
                    page: pagination.page,
                    perPage: pagination.perPage,
                    total: totalCount,
                    pageCount: pageCount
                }
            };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findOne(params) {
        try {
            let data = await this.feedbackService.findOne(params.id);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)("files", 10, multerOptionsProtected)),
    (0, swagger_1.ApiResponse)({ status: 200, type: feedback_dto_1.FeedbackResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_feedback_dto_1.CreateFeedbackDto,
        Array, Object]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "create", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(feedback_permissions_1.FeedbackPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: feedback_dto_1.FeedbackResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [feedback_filters_dto_1.FeedbackFiltersDto,
        feedback_sorting_dto_1.FeedbackSortingDto,
        common_types_1.Pagination]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "findAll", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(feedback_permissions_1.FeedbackPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: feedback_dto_1.FeedbackResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)('findOne/:id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "findOne", null);
FeedbackController = __decorate([
    (0, swagger_1.ApiTags)("feedback"),
    (0, common_1.Controller)('feedback'),
    __metadata("design:paramtypes", [feedback_service_1.FeedbackService])
], FeedbackController);
exports.FeedbackController = FeedbackController;
//# sourceMappingURL=feedback.controller.js.map