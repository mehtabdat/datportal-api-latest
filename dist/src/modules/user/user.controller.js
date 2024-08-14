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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const swagger_1 = require("@nestjs/swagger");
const params_dto_1 = require("./dto/params.dto");
const user_dto_1 = require("./dto/user.dto");
const platform_express_1 = require("@nestjs/platform-express");
const file_upload_utils_1 = require("../../helpers/file-upload.utils");
const user_role_dto_1 = require("./dto/user-role.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const user_permissions_1 = require("./user.permissions");
const file_management_1 = require("../../helpers/file-management");
const user_pagination_dto_1 = require("./dto/user-pagination.dto");
const user_sorting_dto_1 = require("./dto/user-sorting.dto");
const user_filters_dto_1 = require("./dto/user-filters.dto");
const constants_1 = require("../../config/constants");
const update_user_meta_dto_1 = require("./dto/update-user-meta.dto");
const update_me_dto_1 = require("./dto/update-me.dto");
const me_dto_1 = require("./dto/me.dto");
const auth_token_issued_dto_1 = require("./dto/auth-token-issued.dto");
const project_permissions_1 = require("../project/project.permissions");
const user_document_dto_1 = require("./dto/user-document.dto");
const user_document_update_dto_1 = require("./dto/user-document-update.dto");
const user_authorization_service_1 = require("./user.authorization.service");
const user_salary_dto_1 = require("./dto/user-salary.dto");
const multerOptions = (0, file_upload_utils_1.getMulterOptions)({ destination: (0, user_dto_1.getDynamicUploadPath)('public'), fileTypes: 'images_only', limit: 2000000 });
const multerOptionsProtected = (0, file_upload_utils_1.getMulterOptions)({ destination: (0, user_dto_1.getDynamicUploadPath)('organization'), fileTypes: 'images_only', limit: 2000000 });
const moduleName = "User(s)";
let UserController = class UserController {
    constructor(userService, authorizationService) {
        this.userService = userService;
        this.authorizationService = authorizationService;
    }
    async uploadUserDocuments(uploadDocuments, files, req) {
        try {
            await this.authorizationService.isAuthorizedForUser(uploadDocuments.userId, req.user);
            if (files && files.length > 0) {
                let data = await this.userService.handleUserDocuments(uploadDocuments, files, req.user);
                (0, file_management_1.uploadFile)(files);
                return { message: `Document uploaded successfully`, statusCode: 200, data: data };
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
    async updateUserDocument(updateDocuments, req) {
        try {
            await this.authorizationService.isAuthorizedForUserDocument(updateDocuments.documentId, req.user);
            let data = await this.userService.updateUserDocument(updateDocuments);
            return { message: `Document updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode = 400);
        }
    }
    async deleteUserDocument(params, req) {
        try {
            await this.authorizationService.isAuthorizedForUserDocument(params.id, req.user);
            let data = await this.userService.deleteUserDocument(params.id);
            return { message: `Document deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode = 400);
        }
    }
    async create(createUserDto, file, req) {
        try {
            if (file) {
                createUserDto.profile = (0, file_upload_utils_1.extractRelativePathFromFullPath)(file.path);
                createUserDto["isAvatar"] = false;
            }
            createUserDto['addedById'] = req.user.userId;
            let userAgent = req.headers["user-agent"];
            createUserDto["userSignupSource"] = constants_1.USER_SIGNUP_SOURCE_TYPES.organization,
                createUserDto["userSignupDeviceAgent"] = userAgent;
            let data = await this.userService.create(createUserDto);
            if (!file) {
                let profile = await this.userService.createUserAvatar(data.id, { username: data.firstName + " " + data.lastName, shouldFetch: false });
                if (profile) {
                    data.profile = profile;
                }
            }
            else {
                (0, file_management_1.uploadFile)(file);
            }
            return { message: `${moduleName} created successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            (0, file_upload_utils_1.removeUploadedFiles)(file);
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAll(pagination, sorting, filters, req) {
        try {
            let permissions = await this.authorizationService.findUserPermissionsAgainstSlugs(req.user, [user_permissions_1.UserPermissionSet.MANAGE_ALL]);
            let filtersApplied = this.userService.applyFilters(filters);
            let dt;
            if (permissions.manageAllUser) {
                dt = this.userService.findAll(pagination, sorting, filtersApplied);
            }
            else {
                dt = this.userService.findAllBasic(pagination, sorting, filtersApplied);
            }
            let tCount = this.userService.countTotalRecord(filtersApplied);
            const [data, totalCount] = await Promise.all([dt, tCount]);
            let pageCount = Math.floor(totalCount / pagination.perPage) + ((totalCount % pagination.perPage) === 0 ? 0 : 1);
            return {
                message: `${moduleName} fetched Successfully`, statusCode: 200, data: data,
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
    async findUserLoginHistory(pagination, filters, req) {
        try {
            let filtersApplied = this.userService.applyFiltersAuthTokensIssued(filters);
            let dt = this.userService.findAllAuthTokensIssued(pagination, filtersApplied);
            let tCount = this.userService.countTotalAuthToken(filtersApplied);
            const [data, totalCount] = await Promise.all([dt, tCount]);
            let pageCount = Math.floor(totalCount / pagination.perPage) + ((totalCount % pagination.perPage) === 0 ? 0 : 1);
            return {
                message: `${moduleName} fetched Successfully`, statusCode: 200, data: data,
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
    async findUserByToken(req, meDto) {
        try {
            let user = req.user;
            let data = await this.userService.findLoggedInUserDetails(user.userEmail);
            if (meDto.roles) {
                let userRoles = await this.userService.findUserRoles(user.userId);
                const userRoleIds = userRoles.map((key) => key.Role.id);
                const userRoleSlugs = userRoles.map((key) => key.Role.slug);
                data["roles"] = { ids: userRoleIds, slugs: userRoleSlugs };
            }
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findUserMenuList(req) {
        try {
            let user = req.user;
            let data = await this.userService.findLoggedInUserMenu(user);
            return { message: `User menu fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findUserPermissions(req, slugs) {
        try {
            let user = req.user;
            let data = await this.userService.findUserPermissionsAgainstSlugs(user, slugs);
            return { message: `User menu fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async updateMe(updateUserDto, file, req) {
        try {
            if (file) {
                updateUserDto.profile = (0, file_upload_utils_1.extractRelativePathFromFullPath)(file.path);
                updateUserDto["isAvatar"] = false;
            }
            updateUserDto["modifiedDate"] = new Date();
            updateUserDto["modifiedById"] = req.user.userId;
            let data = await this.userService.update(req.user.userId, updateUserDto);
            (0, file_management_1.uploadFile)(file);
            return { message: `${moduleName}  updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            (0, file_upload_utils_1.removeUploadedFiles)(file);
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async update(params, updateUserDto, file, req) {
        try {
            await this.authorizationService.isAuthorizedForUser(params.id, req.user);
            if (file) {
                updateUserDto.profile = (0, file_upload_utils_1.extractRelativePathFromFullPath)(file.path);
                updateUserDto["isAvatar"] = false;
            }
            updateUserDto["modifiedDate"] = new Date();
            updateUserDto["modifiedById"] = req.user.userId;
            let data = await this.userService.update(params.id, updateUserDto);
            (0, file_management_1.uploadFile)(file);
            return { message: `${moduleName}  updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            (0, file_upload_utils_1.removeUploadedFiles)(file);
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async remove(params, req) {
        try {
            let data = await this.userService.remove(params.id, req.user);
            return { message: `${moduleName} deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async addRole(params, userRoleDto, req) {
        try {
            let newRoles = [];
            if (Array.isArray(userRoleDto.roleIds)) {
                newRoles = userRoleDto.roleIds;
            }
            else {
                newRoles = [userRoleDto.roleIds];
            }
            let userRoles = await this.userService.findUserRolesByRoleIds(params.id, newRoles);
            let existingRoles = userRoles.map((ele) => ele.roleId);
            let uniqueRoles = [];
            newRoles.map((ele) => {
                if (!existingRoles.includes(ele)) {
                    uniqueRoles.push(ele);
                }
            });
            let data = await this.userService.addUserRole(params.id, uniqueRoles);
            return { message: `User roles fetched successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async removeUserRole(params, userRoleDto, req) {
        try {
            let roles = [];
            if (Array.isArray(userRoleDto.roleIds)) {
                roles = userRoleDto.roleIds;
            }
            else {
                roles = [userRoleDto.roleIds];
            }
            let data = await this.userService.removeUserRolesByRoleIds(params.id, roles);
            return { message: `User roles deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async updateUserMeta(req, params, updateUserMetaDto) {
        try {
            await this.authorizationService.isAuthorizedForUser(params.id, req.user);
            let data = await this.userService.updateUserMeta(params.id, updateUserMetaDto);
            return { message: `User meta data updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async deleteOrgMeta(req, params, deleteUserMetaDto) {
        try {
            await this.authorizationService.isAuthorizedForUser(params.id, req.user);
            let data = await this.userService.deleteUserMeta(deleteUserMetaDto.id);
            return { message: `User meta data deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async updateSalary(req, params, userSalaryDto) {
        try {
            await this.authorizationService.isAuthorizedForUser(params.id, req.user);
            let data = await this.userService.updateSalary(params.id, userSalaryDto);
            return { message: `Salary updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async deleteOrgMetaByKey(req, params, deleteUserMetaByKeyDto) {
        try {
            await this.authorizationService.isAuthorizedForUser(params.id, req.user);
            let data = await this.userService.deleteUserMetaByKey(params.id, deleteUserMetaByKeyDto.key);
            return { message: `User meta data deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAllocatedResource(params, req) {
        try {
            await this.authorizationService.isAuthorizedForUser(params.id, req.user);
            let data = await this.userService.findAllocatedResource(params.id);
            return { message: `Allocated resources of user fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findDashboardElements(req) {
        try {
            let data = await this.userService.findDashboardElements(req.user);
            return { message: `Dashboard elements for user fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findOne(params, req) {
        try {
            await this.authorizationService.isAuthorizedForUser(params.id, req.user);
            let data = await this.userService.findOne(params.id);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(project_permissions_1.ProjectPermissionSet.UPDATE),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: `Upload property Files` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: user_dto_1.UserResponseObject, isArray: false, description: `Returns the uploaded files on success` }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('file', 20, multerOptionsProtected)),
    (0, common_1.Post)("uploadUserDocuments"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_document_dto_1.UploadUserDocuments,
        Array, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "uploadUserDocuments", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(project_permissions_1.ProjectPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Update property Files` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: user_dto_1.UserResponseObject, isArray: false, description: `Returns the uploaded files on success` }),
    (0, common_1.Patch)("updateUserDocument"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_document_update_dto_1.UpdateUserDocuments, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUserDocument", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(project_permissions_1.ProjectPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Delete user document` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: user_dto_1.UserResponseObject, isArray: false }),
    (0, common_1.Delete)("deleteUserDocument/:id"),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUserDocument", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(user_permissions_1.UserPermissionSet.CREATE),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: user_dto_1.UserResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profile', multerOptions)),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(user_permissions_1.UserPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: user_dto_1.UserResponseArray, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_pagination_dto_1.UserPaginationDto,
        user_sorting_dto_1.UserSortingDto,
        user_filters_dto_1.UserFiltersDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAll", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(user_permissions_1.UserPermissionSet.READ_AUTH_TOKENS_ISSUED),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: user_dto_1.UserResponseArray, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)('findAuthTokensIssued'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_pagination_dto_1.UserPaginationDto,
        auth_token_issued_dto_1.UserAuthTokensIssuedDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findUserLoginHistory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Fetch logged in user data using access token` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: user_dto_1.UserResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, me_dto_1.MeDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findUserByToken", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Fetch logged in user menu list` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: user_dto_1.UserResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)('user-menu'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findUserMenuList", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Check if the user has permission for the provided slug` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: user_dto_1.UserResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)('check-user-permissions'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('slugs')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findUserPermissions", null);
__decorate([
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: user_dto_1.UserResponseObject, isArray: false, description: 'Returns the updated record object if found on the system' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profile', multerOptions)),
    (0, common_1.Patch)('update-me'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_me_dto_1.UpdateMeDto, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateMe", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(user_permissions_1.UserPermissionSet.UPDATE),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: user_dto_1.UserResponseObject, isArray: false, description: 'Returns the updated record object if found on the system' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profile', multerOptions)),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto, update_user_dto_1.UpdateUserDto, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(user_permissions_1.UserPermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: user_dto_1.UserResponseObject, isArray: false, description: `Returns the deleted ${moduleName} object if found on the system` }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "remove", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(user_permissions_1.UserPermissionSet.ADD_USER_ROLE),
    (0, swagger_1.ApiOperation)({ summary: `Add user roles` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: user_dto_1.UserResponseObject, isArray: false, description: `Returns the roles of the user` }),
    (0, common_1.Post)('addUserRole/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto,
        user_role_dto_1.UserRoleDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addRole", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(user_permissions_1.UserPermissionSet.ADD_USER_ROLE),
    (0, swagger_1.ApiOperation)({ summary: `Remove user roles` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: user_dto_1.UserResponseObject, isArray: false, description: `Returns the roles of the user` }),
    (0, common_1.Patch)('removeUserRole/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto,
        user_role_dto_1.UserRoleDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "removeUserRole", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(user_permissions_1.UserPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Updates and returns the updated user meta data` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: user_dto_1.UserResponseObject, isArray: false, description: `Returns the updated user meta data` }),
    (0, common_1.Patch)('update-meta/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, params_dto_1.ParamsDto,
        update_user_meta_dto_1.UpdateUserMetaDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUserMeta", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(user_permissions_1.UserPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Updates and returns the updated user meta data` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: user_dto_1.UserResponseObject, isArray: false, description: `Returns the updated user meta data` }),
    (0, common_1.Patch)('delete-meta/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, params_dto_1.ParamsDto,
        update_user_meta_dto_1.DeleteUserMetaDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteOrgMeta", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(user_permissions_1.UserPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Updates and returns the updated user meta data` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: user_dto_1.UserResponseObject, isArray: false, description: `Returns the updated user meta data` }),
    (0, common_1.Patch)('updateSalary/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, params_dto_1.ParamsDto,
        user_salary_dto_1.UserSalaryDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateSalary", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(user_permissions_1.UserPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Updates and returns the updated user meta data` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: user_dto_1.UserResponseObject, isArray: false, description: `Returns the updated user meta data` }),
    (0, common_1.Patch)('delete-meta-by-key/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, params_dto_1.ParamsDto,
        update_user_meta_dto_1.DeleteUserMetaByKeyDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteOrgMetaByKey", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(user_permissions_1.UserPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: user_dto_1.UserResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)('findAllocatedResource/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAllocatedResource", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: user_dto_1.UserResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)('getMyDashboardElements'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findDashboardElements", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(user_permissions_1.UserPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: user_dto_1.UserResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findOne", null);
UserController = __decorate([
    (0, swagger_1.ApiTags)("Users"),
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        user_authorization_service_1.UserAuthorizationService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map