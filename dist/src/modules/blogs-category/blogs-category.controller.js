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
exports.BlogsCategoryController = void 0;
const common_1 = require("@nestjs/common");
const blogs_category_service_1 = require("./blogs-category.service");
const create_category_blog_dto_1 = require("./dto/create-category-blog.dto");
const update_category_blog_dto_1 = require("./dto/update-category-blog.dto");
const swagger_1 = require("@nestjs/swagger");
const common_types_1 = require("../../common-types/common-types");
const params_dto_1 = require("./dto/params.dto");
const blogs_category_dto_1 = require("./dto/blogs-category.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const blogs_category_permissions_1 = require("./blogs-category.permissions");
const file_upload_utils_1 = require("../../helpers/file-upload.utils");
const platform_express_1 = require("@nestjs/platform-express");
const file_management_1 = require("../../helpers/file-management");
const blogs_category_filter_dto_1 = require("./dto/blogs-category-filter.dto");
const blogs_category_pagination_dto_1 = require("./dto/blogs-category-pagination.dto");
const blogs_category_sorting_dto_1 = require("./dto/blogs-category-sorting.dto");
const authorization_service_1 = require("../../authorization/authorization.service");
const constants_1 = require("../../config/constants");
const public_metadata_1 = require("../../authentication/public-metadata");
const blog_category_status_dto_1 = require("./dto/blog-category-status.dto");
const system_logger_service_1 = require("../system-logs/system-logger.service");
const blog_category_publish_unpublish_dto_1 = require("./dto/blog-category-publish-unpublish.dto");
const multerOptions = (0, file_upload_utils_1.getMulterOptions)({ destination: blogs_category_dto_1.blogsFileUploadPath });
const moduleName = "blogs-category";
let BlogsCategoryController = class BlogsCategoryController {
    constructor(blogsCategoryService, authorizationService, systemLogger) {
        this.blogsCategoryService = blogsCategoryService;
        this.authorizationService = authorizationService;
        this.systemLogger = systemLogger;
    }
    async create(createBlogCategoryDto, file, req) {
        try {
            if (file) {
                createBlogCategoryDto.image = (0, file_upload_utils_1.extractRelativePathFromFullPath)(file.path);
            }
            createBlogCategoryDto["addedById"] = req.user.userId;
            let data = await this.blogsCategoryService.create(createBlogCategoryDto);
            (0, file_management_1.uploadFile)(file);
            this.systemLogger.logData({
                tableName: "BlogsCategory",
                field: 'id',
                value: data.id,
                actionType: 'CREATE',
                valueType: "number",
                user: req.user.userId,
                data: createBlogCategoryDto,
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
            let appliedFilters = this.blogsCategoryService.applyAdminFilters(filters);
            let dt = this.blogsCategoryService.findAll(appliedFilters, pagination, sorting);
            let tCount = this.blogsCategoryService.countBlogsCategory(appliedFilters);
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
            let appliedFilters = this.blogsCategoryService.applyPublicFilters(filters);
            let dt = await this.blogsCategoryService.findAllPublished(appliedFilters, pagination, sorting);
            let tCount = this.blogsCategoryService.countBlogsCategory(appliedFilters);
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
            let data = await this.blogsCategoryService.findOne(params.id);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findOneBySlug(params, pagination, req) {
        try {
            let dt = this.blogsCategoryService.findOneBySlug(params.slug, pagination);
            let tCount = this.blogsCategoryService.countBlogs({ BlogCategory: { slug: params.slug } });
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
    async update(params, updateBlogCategoryDto, file, req) {
        try {
            if (file) {
                updateBlogCategoryDto.image = (0, file_upload_utils_1.extractRelativePathFromFullPath)(file.path);
            }
            updateBlogCategoryDto["modifiedDate"] = new Date();
            updateBlogCategoryDto["modifiedById"] = req.user.userId;
            let data = await this.blogsCategoryService.update(params.id, updateBlogCategoryDto);
            (0, file_management_1.uploadFile)(file);
            this.systemLogger.logData({
                tableName: "BlogsCategory",
                field: 'id',
                value: params.id,
                actionType: 'UPDATE',
                valueType: "number",
                user: req.user.userId,
                data: updateBlogCategoryDto,
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
            let data = await this.blogsCategoryService.remove(params.id, req.user.userId);
            this.systemLogger.logData({
                tableName: "BlogsCategory",
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
    async updateBlogStatus(params, blogCategoryStatusDto, req) {
        try {
            let data = await this.blogsCategoryService.updateStatus(params.id, blogCategoryStatusDto.status);
            this.systemLogger.logData({
                tableName: "BlogsCategory",
                field: 'id',
                value: params.id,
                actionType: 'UPDATE',
                valueType: "number",
                user: req.user.userId,
                data: blogCategoryStatusDto,
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
            let data = await this.blogsCategoryService.updateStatus(params.id, constants_1.BlogsCategoryStatus['Verified & Published']);
            this.systemLogger.logData({
                tableName: "BlogsCategory",
                field: 'id',
                value: params.id,
                actionType: 'UPDATE',
                valueType: "number",
                user: req.user.userId,
                data: { status: constants_1.BlogsCategoryStatus['Verified & Published'] },
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
            let data = await this.blogsCategoryService.updateSEOData(params.id, seoData);
            this.systemLogger.logData({
                tableName: "BlogsCategory",
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
    async publishUnpublishBlogCategory(params, req, publishUnpublish) {
        try {
            let data = await this.blogsCategoryService.publishUnpublish(params.id, req.user.userId, publishUnpublish.status);
            this.systemLogger.logData({
                tableName: "BlogsCategory",
                field: 'id',
                value: params.id,
                actionType: 'UPDATE',
                valueType: "number",
                user: req.user.userId,
                data: { isPublished: false },
                endPoint: req.originalUrl,
                controllerName: this.constructor.name,
                message: "Blog Category updated successfully"
            });
            return { message: `${moduleName} ${publishUnpublish.status ? 'published' : 'unpublished'} successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(blogs_category_permissions_1.BlogsCategoryPermissionSet.CREATE),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: blogs_category_dto_1.BlogsCategoryResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', multerOptions)),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_blog_dto_1.CreateBlogCategoryDto, Object, Object]),
    __metadata("design:returntype", Promise)
], BlogsCategoryController.prototype, "create", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(blogs_category_permissions_1.BlogsCategoryPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName}(s) in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: blogs_category_dto_1.BlogsCategoryResponseArray, isArray: false, description: `Return a list of ${moduleName}(s) available` }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, blogs_category_filter_dto_1.BlogsCategoryFiltersDto,
        blogs_category_pagination_dto_1.BlogsCategoryPaginationDto,
        blogs_category_sorting_dto_1.BlogsCategorySortingDto]),
    __metadata("design:returntype", Promise)
], BlogsCategoryController.prototype, "findAll", null);
__decorate([
    (0, public_metadata_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName}(s) in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: blogs_category_dto_1.BlogsCategoryResponseArray, isArray: false, description: `Return a list of ${moduleName}(s) available` }),
    (0, common_1.Get)('find-published'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [blogs_category_filter_dto_1.BlogsCategoryPublicFiltersDto,
        blogs_category_pagination_dto_1.BlogsCategoryPaginationDto,
        blogs_category_sorting_dto_1.BlogsCategorySortingDto, Object]),
    __metadata("design:returntype", Promise)
], BlogsCategoryController.prototype, "findPublished", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(blogs_category_permissions_1.BlogsCategoryPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: blogs_category_dto_1.BlogsCategoryResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], BlogsCategoryController.prototype, "findOne", null);
__decorate([
    (0, public_metadata_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: blogs_category_dto_1.BlogsCategoryResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)('findOneBySlug/:slug'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.BlogsDetail,
        blogs_category_pagination_dto_1.BlogsCategoryPaginationDto, Object]),
    __metadata("design:returntype", Promise)
], BlogsCategoryController.prototype, "findOneBySlug", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(blogs_category_permissions_1.BlogsCategoryPermissionSet.UPDATE),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: blogs_category_dto_1.BlogsCategoryResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', multerOptions)),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto,
        update_category_blog_dto_1.UpdateBlogCategoryDto, Object, Object]),
    __metadata("design:returntype", Promise)
], BlogsCategoryController.prototype, "update", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(blogs_category_permissions_1.BlogsCategoryPermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: blogs_category_dto_1.BlogsCategoryResponseObject, isArray: false, description: `Returns the deleted ${moduleName} object if found on the system` }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], BlogsCategoryController.prototype, "remove", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(blogs_category_permissions_1.BlogsCategoryPermissionSet.CHANGE_STATUS),
    (0, swagger_1.ApiOperation)({ summary: `Change Blog Status` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: blogs_category_dto_1.BlogsCategoryResponseObject, isArray: false, description: `Returns the updated blog` }),
    (0, common_1.Patch)('changeStatus/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto,
        blog_category_status_dto_1.BlogCategoryStatusDto, Object]),
    __metadata("design:returntype", Promise)
], BlogsCategoryController.prototype, "updateBlogStatus", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(blogs_category_permissions_1.BlogsCategoryPermissionSet.VERIFY_AND_PUBLISH),
    (0, swagger_1.ApiOperation)({ summary: `Verify and Publish Blog` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: blogs_category_dto_1.BlogsCategoryResponseObject, isArray: false, description: `Returns the updated blog` }),
    (0, common_1.Patch)('verifyAndPublish/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], BlogsCategoryController.prototype, "verifyAndPublish", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(blogs_category_permissions_1.BlogsCategoryPermissionSet.UPDATE_SEO),
    (0, swagger_1.ApiOperation)({ summary: `Update blog SEO meta data` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: blogs_category_dto_1.BlogsCategoryResponseObject, isArray: false, description: `Returns the updated page` }),
    (0, common_1.Patch)('update-seo/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto,
        common_types_1.SEOData, Object]),
    __metadata("design:returntype", Promise)
], BlogsCategoryController.prototype, "updateSEO", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(blogs_category_permissions_1.BlogsCategoryPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Unpublish ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: blogs_category_dto_1.BlogsCategoryResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)('publish-unpublish/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto, Object, blog_category_publish_unpublish_dto_1.PublishUnpublish]),
    __metadata("design:returntype", Promise)
], BlogsCategoryController.prototype, "publishUnpublishBlogCategory", null);
BlogsCategoryController = __decorate([
    (0, swagger_1.ApiTags)("blogs-category"),
    (0, common_1.Controller)('blogs-category'),
    __metadata("design:paramtypes", [blogs_category_service_1.BlogsCategoryService, authorization_service_1.AuthorizationService, system_logger_service_1.SystemLogger])
], BlogsCategoryController);
exports.BlogsCategoryController = BlogsCategoryController;
//# sourceMappingURL=blogs-category.controller.js.map