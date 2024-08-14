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
exports.BlogsController = void 0;
const common_1 = require("@nestjs/common");
const blogs_service_1 = require("./blogs.service");
const create_blog_dto_1 = require("./dto/create-blog.dto");
const update_blog_dto_1 = require("./dto/update-blog.dto");
const swagger_1 = require("@nestjs/swagger");
const common_types_1 = require("../../common-types/common-types");
const params_dto_1 = require("./dto/params.dto");
const blogs_dto_1 = require("./dto/blogs.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const blogs_permissions_1 = require("./blogs-permissions");
const file_upload_utils_1 = require("../../helpers/file-upload.utils");
const platform_express_1 = require("@nestjs/platform-express");
const file_management_1 = require("../../helpers/file-management");
const blogs_filter_dto_1 = require("./dto/blogs-filter.dto");
const blogs_pagination_dto_1 = require("./dto/blogs-pagination.dto");
const blogs_sorting_dto_1 = require("./dto/blogs-sorting.dto");
const authorization_service_1 = require("../../authorization/authorization.service");
const constants_1 = require("../../config/constants");
const public_metadata_1 = require("../../authentication/public-metadata");
const blog_status_dto_1 = require("./dto/blog-status.dto");
const system_logger_service_1 = require("../system-logs/system-logger.service");
const upload_image_dto_1 = require("./dto/upload-image.dto");
const multerOptions = (0, file_upload_utils_1.getMulterOptions)({ destination: blogs_dto_1.blogsFileUploadPath });
const moduleName = "blogs";
let BlogsController = class BlogsController {
    constructor(blogsService, authorizationService, systemLogger) {
        this.blogsService = blogsService;
        this.authorizationService = authorizationService;
        this.systemLogger = systemLogger;
    }
    async uploadBlogImages(uploadBlogImage, files, req) {
        try {
            if (files && files.length > 0) {
                await this.blogsService.checkImagesThreshold(uploadBlogImage.blogId);
                let data = await this.blogsService.handleBlogImages(uploadBlogImage, files, req.user);
                (0, file_management_1.uploadFile)(files);
                return { message: `Images uploaded successfully`, statusCode: 200, data: data };
            }
            else {
                throw Error("No files to upload");
            }
        }
        catch (err) {
            (0, file_upload_utils_1.removeUploadedFiles)(files);
            throw new common_1.HttpException(err.message, err.statusCode = 400);
        }
    }
    async create(createBlogDto, file, req) {
        try {
            if (file) {
                createBlogDto.image = (0, file_upload_utils_1.extractRelativePathFromFullPath)(file.path);
            }
            createBlogDto["addedById"] = req.user.userId;
            let data = await this.blogsService.create(createBlogDto);
            (0, file_management_1.uploadFile)(file);
            this.systemLogger.logData({
                tableName: "Blogs",
                field: 'id',
                value: data.id,
                actionType: 'CREATE',
                valueType: "number",
                user: req.user.userId,
                data: createBlogDto,
                endPoint: req.originalUrl,
                controllerName: this.constructor.name,
                message: "Create Blog"
            });
            return { message: `${moduleName} created successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            (0, file_upload_utils_1.removeUploadedFiles)(file);
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAll(req, filters, pagination, sorting) {
        try {
            let appliedFilters = this.blogsService.applyAdminFilters(filters);
            let dt = this.blogsService.findAll(appliedFilters, pagination, sorting);
            let tCount = this.blogsService.countBlogs(appliedFilters);
            const [data, totalCount] = await Promise.all([dt, tCount]);
            let pageCount = Math.floor(totalCount / pagination.perPage) + ((totalCount % pagination.perPage) === 0 ? 0 : 1);
            return {
                message: `${moduleName}(s) fetched Successfully`, statusCode: 200, data: data,
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
    async findPublished(filters, pagination, sorting, req) {
        try {
            let appliedFilters = this.blogsService.applyPublicFilters(filters);
            let dt = await this.blogsService.findAllPublished(appliedFilters, pagination, sorting);
            let tCount = this.blogsService.countBlogs(appliedFilters);
            const [data, totalCount] = await Promise.all([dt, tCount]);
            let pageCount = Math.floor(totalCount / pagination.perPage) + ((totalCount % pagination.perPage) === 0 ? 0 : 1);
            return {
                message: `${moduleName}(s) fetched Successfully`, statusCode: 200, data: data,
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
            let data = await this.blogsService.findOne(params.id);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findOneBySlug(params) {
        try {
            let data = await this.blogsService.findOneBySlug(params.slug);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async update(params, updateBlogDto, file, req) {
        try {
            if (file) {
                updateBlogDto.image = (0, file_upload_utils_1.extractRelativePathFromFullPath)(file.path);
            }
            updateBlogDto["modifiedDate"] = new Date();
            updateBlogDto["modifiedById"] = req.user.userId;
            let data = await this.blogsService.update(params.id, updateBlogDto);
            (0, file_management_1.uploadFile)(file);
            this.systemLogger.logData({
                tableName: "Blogs",
                field: 'id',
                value: params.id,
                actionType: 'UPDATE',
                valueType: "number",
                user: req.user.userId,
                data: updateBlogDto,
                endPoint: req.originalUrl,
                controllerName: this.constructor.name,
                message: "Update Blog"
            });
            return { message: `${moduleName}  updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            (0, file_upload_utils_1.removeUploadedFiles)(file);
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async remove(params, req) {
        try {
            let data = await this.blogsService.remove(params.id, req.user.userId);
            this.systemLogger.logData({
                tableName: "Blogs",
                field: 'id',
                value: params.id,
                actionType: 'DELETE',
                valueType: "number",
                user: req.user.userId,
                data: {},
                endPoint: req.originalUrl,
                controllerName: this.constructor.name,
                message: "Delete Blog"
            });
            return { message: `${moduleName} deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async updateBlogStatus(params, blogStatusDto, req) {
        try {
            let data = await this.blogsService.updateStatus(params.id, blogStatusDto.status);
            this.systemLogger.logData({
                tableName: "Blogs",
                field: 'id',
                value: params.id,
                actionType: 'UPDATE',
                valueType: "number",
                user: req.user.userId,
                data: blogStatusDto,
                endPoint: req.originalUrl,
                controllerName: this.constructor.name,
                message: "Blog Change Status"
            });
            return { message: `Blog status updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async verifyAndPublish(params, req) {
        try {
            let data = await this.blogsService.updateStatus(params.id, constants_1.BlogsStatus['Verified & Published']);
            this.systemLogger.logData({
                tableName: "Blogs",
                field: 'id',
                value: params.id,
                actionType: 'UPDATE',
                valueType: "number",
                user: req.user.userId,
                data: { status: constants_1.BlogsStatus['Verified & Published'] },
                endPoint: req.originalUrl,
                controllerName: this.constructor.name,
                message: "Verify and Publish Blog"
            });
            return { message: `Blog status updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async updateSEO(params, seoData, req) {
        try {
            let data = await this.blogsService.updateSEOData(params.id, seoData);
            this.systemLogger.logData({
                tableName: "Blogs",
                field: 'id',
                value: params.id,
                actionType: 'UPDATE',
                valueType: "number",
                user: req.user.userId,
                data: seoData,
                endPoint: req.originalUrl,
                controllerName: this.constructor.name,
                message: "Blog SEO Updates"
            });
            return { message: `Blog SEO records updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async removeImages(params, req) {
        try {
            let data = await this.blogsService.removeFiles(params.id, req.user);
            this.systemLogger.logData({
                tableName: "BlogImages",
                field: 'id',
                value: params.id,
                actionType: 'DELETE',
                valueType: "number",
                user: req.user.userId,
                data: {},
                endPoint: req.originalUrl,
                controllerName: this.constructor.name,
                message: "Delete a Blog Image"
            });
            return { message: `${moduleName} image deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async getBlogImages(params, req) {
        try {
            let data = await this.blogsService.getBlogImages(params.id);
            return { message: `${moduleName} image deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(blogs_permissions_1.BlogsPermissionSet.UPDATE),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: `Upload Blog images` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: blogs_dto_1.BlogsResponseObject, isArray: false, description: `Returns the uploaded images on success` }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('file', 20, multerOptions)),
    (0, common_1.Post)("uploadImages"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [upload_image_dto_1.UploadBlogImage,
        Array, Object]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "uploadBlogImages", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(blogs_permissions_1.BlogsPermissionSet.CREATE),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: blogs_dto_1.BlogsResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', multerOptions)),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_blog_dto_1.CreateBlogDto, Object, Object]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "create", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(blogs_permissions_1.BlogsPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName}(s) in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: blogs_dto_1.BlogsResponseArray, isArray: false, description: `Return a list of ${moduleName}(s) available` }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, blogs_filter_dto_1.BlogsFiltersDto,
        blogs_pagination_dto_1.BlogsPaginationDto,
        blogs_sorting_dto_1.BlogsSortingDto]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "findAll", null);
__decorate([
    (0, public_metadata_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName}(s) in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: blogs_dto_1.BlogsResponseArray, isArray: false, description: `Return a list of ${moduleName}(s) available` }),
    (0, common_1.Get)('find-published'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [blogs_filter_dto_1.BlogsPublicFiltersDto,
        blogs_pagination_dto_1.BlogsPaginationDto,
        blogs_sorting_dto_1.BlogsSortingDto, Object]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "findPublished", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(blogs_permissions_1.BlogsPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: blogs_dto_1.BlogsResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "findOne", null);
__decorate([
    (0, public_metadata_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: blogs_dto_1.BlogsResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)('findOneBySlug/:slug'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.BlogsDetail]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "findOneBySlug", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(blogs_permissions_1.BlogsPermissionSet.UPDATE),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: blogs_dto_1.BlogsResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', multerOptions)),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto,
        update_blog_dto_1.UpdateBlogDto, Object, Object]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "update", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(blogs_permissions_1.BlogsPermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: blogs_dto_1.BlogsResponseObject, isArray: false, description: `Returns the deleted ${moduleName} object if found on the system` }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "remove", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(blogs_permissions_1.BlogsPermissionSet.CHANGE_STATUS),
    (0, swagger_1.ApiOperation)({ summary: `Change Blog Status` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: blogs_dto_1.BlogsResponseObject, isArray: false, description: `Returns the updated blog` }),
    (0, common_1.Post)('changeStatus/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto,
        blog_status_dto_1.BlogStatusDto, Object]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "updateBlogStatus", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(blogs_permissions_1.BlogsPermissionSet.VERIFY_AND_PUBLISH),
    (0, swagger_1.ApiOperation)({ summary: `Verify and Publish Blog` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: blogs_dto_1.BlogsResponseObject, isArray: false, description: `Returns the updated blog` }),
    (0, common_1.Post)('verifyAndPublish/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "verifyAndPublish", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(blogs_permissions_1.BlogsPermissionSet.UPDATE_SEO),
    (0, swagger_1.ApiOperation)({ summary: `Update blog SEO meta data` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: blogs_dto_1.BlogsResponseObject, isArray: false, description: `Returns the updated page` }),
    (0, common_1.Post)('update-seo/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto,
        common_types_1.SEOData, Object]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "updateSEO", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(blogs_permissions_1.BlogsPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Delete Blog images` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: blogs_dto_1.BlogsResponseObject, isArray: false, description: `Returns the deleted Blog image object if found on the system` }),
    (0, common_1.Delete)('removeImages/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "removeImages", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(blogs_permissions_1.BlogsPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Get Blog Images` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: blogs_dto_1.BlogsResponseObject, isArray: false, description: `Returns the blog image` }),
    (0, common_1.Get)('getBlogImages/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "getBlogImages", null);
BlogsController = __decorate([
    (0, swagger_1.ApiTags)("blogs"),
    (0, common_1.Controller)('blogs'),
    __metadata("design:paramtypes", [blogs_service_1.BlogsService, authorization_service_1.AuthorizationService, system_logger_service_1.SystemLogger])
], BlogsController);
exports.BlogsController = BlogsController;
//# sourceMappingURL=blogs.controller.js.map