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
exports.ProjectController = void 0;
const common_1 = require("@nestjs/common");
const project_service_1 = require("./project.service");
const create_project_dto_1 = require("./dto/create-project.dto");
const update_project_dto_1 = require("./dto/update-project.dto");
const swagger_1 = require("@nestjs/swagger");
const common_types_1 = require("../../common-types/common-types");
const project_dto_1 = require("./dto/project.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const project_permissions_1 = require("./project.permissions");
const project_filters_dto_1 = require("./dto/project-filters.dto");
const file_upload_utils_1 = require("../../helpers/file-upload.utils");
const platform_express_1 = require("@nestjs/platform-express");
const upload_files_dto_1 = require("./dto/upload-files.dto");
const file_management_1 = require("../../helpers/file-management");
const remove_project_member_dto_1 = require("./dto/remove-project-member.dto");
const update_project_member_dto_1 = require("./dto/update-project-member.dto");
const update_project_status_dto_1 = require("./dto/update-project-status.dto");
const project_resouces_filters_dto_1 = require("./dto/project-resouces-filters.dto");
const create_project_note_dto_1 = require("./dto/create-project-note.dto");
const hold_project_dto_1 = require("./dto/hold-project.dto");
const update_files_dto_1 = require("./dto/update-files.dto");
const project_authorization_service_1 = require("./project.authorization.service");
const project_note_pagination_dto_1 = require("./dto/project-note.pagination.dto");
const project_chat_filters_dto_1 = require("./dto/project-chat-filters.dto");
const share_files_to_client_dto_1 = require("./dto/share-files-to-client.dto");
const create_project_enable_state_dto_1 = require("./dto/create-project-enable-state.dto");
const multerOptionsProtected = (0, file_upload_utils_1.getMulterOptions)({ destination: (0, project_dto_1.getDynamicUploadPath)("organization"), fileTypes: 'all_files', limit: 100000000 });
const moduleName = "project";
let ProjectController = class ProjectController {
    constructor(projectService, authorizationService) {
        this.projectService = projectService;
        this.authorizationService = authorizationService;
    }
    async uploadPropertyFiles(uploadPropertyFiles, files, req) {
        try {
            let hasGlobalPermission = await this.authorizationService.findUserPermissionsAgainstSlugs(req.user, [project_permissions_1.ProjectPermissionSet.UPDATE_ANY_PROJECT, project_permissions_1.ProjectPermissionSet.REAL_ALL_PROJECT]);
            if (!(hasGlobalPermission.updateAnyProject || hasGlobalPermission.readAllProject)) {
                await this.authorizationService.checkIfUserAuthorizedForProject(req.user, uploadPropertyFiles.projectId);
            }
            if (files && files.length > 0) {
                let data = await this.projectService.handlePropertyFiles(uploadPropertyFiles, files, req.user);
                await (0, file_management_1.uploadFile)(files);
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
    async uploadConversationFiles(params, files, req) {
        try {
            let hasGlobalPermission = await this.authorizationService.findUserPermissionsAgainstSlugs(req.user, [project_permissions_1.ProjectPermissionSet.REAL_ALL_PROJECT]);
            if (!hasGlobalPermission.readAllProject) {
                await this.authorizationService.checkIfUserAuthorizedForProject(req.user, params.id);
            }
            if (files && files.length > 0) {
                let data = await this.projectService.handleConversationFiles(params.id, files, req.user);
                await (0, file_management_1.uploadFile)(files);
                return { message: `Files uploaded successfully`, statusCode: 200, data: data };
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
    async create(createDto, req) {
        try {
            throw {
                message: "You can no longer create project directly, it should be created from Approved Quotation",
                statusCode: 400
            };
            createDto.addedById = req.user.userId;
            let data = await this.projectService.create(createDto);
            return { message: `${moduleName} created successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findBySlug(findBySlugDto, req) {
        try {
            let hasGlobalPermission = await this.authorizationService.findUserPermissionsAgainstSlugs(req.user, [project_permissions_1.ProjectPermissionSet.REAL_ALL_PROJECT, project_permissions_1.ProjectPermissionSet.READ_FINANCE_REPORT]);
            if (!hasGlobalPermission.readAllProject) {
                await this.authorizationService.checkIfUserAuthorizedForProjectBySlug(req.user, findBySlugDto.slug);
            }
            let data = await this.projectService.findBySlug(findBySlugDto.slug);
            if (hasGlobalPermission.readFinanceReport) {
                let financeReport = await this.projectService.prepareFinanceReport(data.id, data.projectEstimate);
                data["FinanceReport"] = financeReport;
            }
            return { message: `${moduleName} fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAll(filters, req, pagination) {
        try {
            let hasGlobalPermission = await this.authorizationService.findUserPermissionsAgainstSlugs(req.user, [project_permissions_1.ProjectPermissionSet.REAL_ALL_PROJECT]);
            let appliedFilters = this.projectService.applyFilters(filters, req.user, hasGlobalPermission.readAllProject);
            let dt = await this.projectService.findAll(appliedFilters, pagination, filters);
            let tCount = this.projectService.countProject(appliedFilters);
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
    async getProjectForConversation(filters, req, pagination) {
        try {
            let hasGlobalPermission = await this.authorizationService.findUserPermissionsAgainstSlugs(req.user, [project_permissions_1.ProjectPermissionSet.REAL_ALL_PROJECT]);
            let appliedFilters = this.projectService.applyConversationFilter(filters, req.user, hasGlobalPermission.readAllProject);
            let dt = await this.projectService.getProjectForConversation(filters, pagination, req.user, hasGlobalPermission.readAllProject);
            let tCount = this.projectService.countProject(appliedFilters);
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
    async findProjectList(filters, req, pagination) {
        try {
            let appliedFilters = this.projectService.applyFilters(filters, req.user, true);
            let dt = await this.projectService.findProjectList(appliedFilters, pagination);
            let tCount = this.projectService.countProject(appliedFilters);
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
    async findOne(params, req) {
        try {
            let hasGlobalPermission = await this.authorizationService.findUserPermissionsAgainstSlugs(req.user, [project_permissions_1.ProjectPermissionSet.REAL_ALL_PROJECT]);
            if (!hasGlobalPermission.readAllProject) {
                await this.authorizationService.checkIfUserAuthorizedForProject(req.user, params.id);
            }
            let data = await this.projectService.findOne(params.id);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findMany(params, req) {
        try {
            let hasGlobalPermission = await this.authorizationService.findUserPermissionsAgainstSlugs(req.user, [project_permissions_1.ProjectPermissionSet.REAL_ALL_PROJECT]);
            if (!hasGlobalPermission.readAllProject) {
                await this.authorizationService.checkIfUserAuthorizedForProject(req.user, params.id);
            }
            let data = await this.projectService.findOne(params.id);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async shareFiles(shareFiles, req) {
        try {
            let hasGlobalPermission = await this.authorizationService.findUserPermissionsAgainstSlugs(req.user, [project_permissions_1.ProjectPermissionSet.REAL_ALL_PROJECT]);
            if (!hasGlobalPermission.readAllProject) {
                await this.authorizationService.checkIfUserAuthorizedForProject(req.user, shareFiles.projectId);
            }
            let data = await this.projectService.shareFilesToClient(shareFiles, req.user);
            return { message: shareFiles.shareInEmail ? "Files shared to client successfully" : "Files are marked as shared successfully", statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, (err.statusCode) ? err.statusCode : 404);
        }
    }
    async sharedFiles(params, req) {
        try {
            let hasGlobalPermission = await this.authorizationService.findUserPermissionsAgainstSlugs(req.user, [project_permissions_1.ProjectPermissionSet.REAL_ALL_PROJECT]);
            if (!hasGlobalPermission.readAllProject) {
                await this.authorizationService.checkIfUserAuthorizedForProject(req.user, params.id);
            }
            let data = await this.projectService.findSharedFiles(params.id);
            return { message: "Files fetched Successfully", statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, (err.statusCode) ? err.statusCode : 404);
        }
    }
    async update(params, updateDto, req) {
        try {
            let hasGlobalPermission = await this.authorizationService.findUserPermissionsAgainstSlugs(req.user, [project_permissions_1.ProjectPermissionSet.UPDATE_ANY_PROJECT]);
            if (!hasGlobalPermission.updateAnyProject) {
                await this.authorizationService.checkIfUserAuthorizedForProject(req.user, params.id);
            }
            updateDto["modifiedById"] = req.user.userId;
            let data = await this.projectService.update(params.id, updateDto);
            return { message: `${moduleName}  updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async updateFiles(params, updateDto, req) {
        try {
            await this.authorizationService.checkIfUserAuthorizedForProjectFile(req.user, params.id);
            updateDto["modifiedById"] = req.user.userId;
            let data = await this.projectService.updateFiles(params.id, updateDto);
            return { message: `File updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async holdProject(params, updateDto, req) {
        try {
            let hasGlobalPermission = await this.authorizationService.findUserPermissionsAgainstSlugs(req.user, [project_permissions_1.ProjectPermissionSet.UPDATE_ANY_PROJECT]);
            if (!hasGlobalPermission.updateAnyProject) {
                await this.authorizationService.checkIfUserAuthorizedForProject(req.user, params.id);
            }
            let data = await this.projectService.holdProject(params.id, updateDto, req.user);
            return { message: `Project is now on hold`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async unholdProject(params, updateDto, req) {
        try {
            let hasGlobalPermission = await this.authorizationService.findUserPermissionsAgainstSlugs(req.user, [project_permissions_1.ProjectPermissionSet.UPDATE_ANY_PROJECT]);
            if (!hasGlobalPermission.updateAnyProject) {
                await this.authorizationService.checkIfUserAuthorizedForProject(req.user, params.id);
            }
            let data = await this.projectService.unholdProject(params.id, updateDto, req.user);
            return { message: `Project is now active`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async removeProjectMembers(params, req) {
        try {
            let hasGlobalPermission = await this.authorizationService.findUserPermissionsAgainstSlugs(req.user, [project_permissions_1.ProjectPermissionSet.UPDATE_ANY_PROJECT]);
            if (!hasGlobalPermission.updateAnyProject) {
                await this.authorizationService.checkIfUserAuthorizedForProject(req.user, params.projectId);
            }
            let data = await this.projectService.removeProjectMember(params);
            return { message: `Project member has been removed from the project successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async removeProjectClient(params, req) {
        try {
            let hasGlobalPermission = await this.authorizationService.findUserPermissionsAgainstSlugs(req.user, [project_permissions_1.ProjectPermissionSet.UPDATE_ANY_PROJECT]);
            if (!hasGlobalPermission.updateAnyProject) {
                await this.authorizationService.checkIfUserAuthorizedForProject(req.user, params.projectId);
            }
            let data = await this.projectService.removeProjectClient(params);
            return { message: `Client has been removed from the project successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async removeProjectFiles(params, req) {
        try {
            let hasGlobalPermission = await this.authorizationService.findUserPermissionsAgainstSlugs(req.user, [project_permissions_1.ProjectPermissionSet.UPDATE_ANY_PROJECT]);
            if (!hasGlobalPermission.updateAnyProject) {
                await this.authorizationService.checkIfUserAuthorizedForProjectResources(req.user, params.id);
            }
            let data = await this.projectService.removeProjectFiles(params.id, req.user);
            return { message: `Project files has been removed from the project successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async updateProjectMembers(updateProjectMember, req) {
        try {
            let hasGlobalPermission = await this.authorizationService.findUserPermissionsAgainstSlugs(req.user, [project_permissions_1.ProjectPermissionSet.UPDATE_ANY_PROJECT]);
            if (!hasGlobalPermission.updateAnyProject) {
                await this.authorizationService.checkIfUserAuthorizedForProject(req.user, updateProjectMember.projectId);
            }
            let data = await this.projectService.updateProjectMember(updateProjectMember);
            return { message: `Project member has been updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async updateProjectStatus(updateProjectStatus, req) {
        try {
            let hasGlobalPermission = await this.authorizationService.findUserPermissionsAgainstSlugs(req.user, [project_permissions_1.ProjectPermissionSet.UPDATE_ANY_PROJECT]);
            if (!hasGlobalPermission.updateAnyProject) {
                await this.authorizationService.checkIfUserAuthorizedForProjectResources(req.user, updateProjectStatus.projectId);
            }
            let data = await this.projectService.updateProjectStatus(updateProjectStatus, req.user);
            return { message: `Project status has been updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async addProjectStates(params, CreateProjectEnableStateDto, req) {
        console.log('Received data:', CreateProjectEnableStateDto);
        try {
            let newStates = Array.isArray(CreateProjectEnableStateDto.projectStateIds)
                ? CreateProjectEnableStateDto.projectStateIds
                : [CreateProjectEnableStateDto.projectStateIds];
            console.log('Processed new states:', newStates);
            let projectEnableStates = await this.projectService.findProjectStatesByStateIds(params.id, newStates);
            let existingStates = projectEnableStates.map((ele) => ele.pstateId);
            let uniqueStates = newStates.filter((ele) => !existingStates.includes(ele));
            console.log('Unique states to insert:', uniqueStates);
            let data = await this.projectService.addProjectStates(params.id, uniqueStates);
            return { message: `Project states fetched successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            console.error('Error occurred:', err);
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async removeProjectStates(params, CreateProjectEnableStateDto, req) {
        try {
            const states = Array.isArray(CreateProjectEnableStateDto.projectStateIds)
                ? CreateProjectEnableStateDto.projectStateIds
                : [CreateProjectEnableStateDto.projectStateIds];
            const data = await this.projectService.removeProjectStatesByStateIds(params.id, states);
            return { message: `Project states deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findProjectFiles(filters, req, pagination) {
        try {
            let hasGlobalPermission = await this.authorizationService.findUserPermissionsAgainstSlugs(req.user, [project_permissions_1.ProjectPermissionSet.REAL_ALL_PROJECT]);
            if (!hasGlobalPermission.readAllProject) {
                await this.authorizationService.checkIfUserAuthorizedForProject(req.user, filters.projectId);
            }
            let appliedFilters = this.projectService.applyResourcesFilters(filters);
            let dt = await this.projectService.findAllResources(appliedFilters, pagination);
            let tCount = this.projectService.countProjectResources(appliedFilters);
            const [data, totalCount] = await Promise.all([dt, tCount]);
            let pageCount = Math.floor(totalCount / pagination.perPage) + ((totalCount % pagination.perPage) === 0 ? 0 : 1);
            return {
                message: `${moduleName} resources fetched Successfully`, statusCode: 200, data: data,
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
    async findProjectNotes(filters, req, pagination) {
        try {
            let hasGlobalPermission = await this.authorizationService.findUserPermissionsAgainstSlugs(req.user, [project_permissions_1.ProjectPermissionSet.REAL_ALL_PROJECT]);
            if (!hasGlobalPermission.readAllProject) {
                await this.authorizationService.checkIfUserAuthorizedForProject(req.user, filters.projectId);
            }
            let appliedFilters = this.projectService.applyNotesFilters(filters);
            let dt = await this.projectService.findProjectNotes(appliedFilters, pagination);
            this.projectService.readAllConversation(filters.projectId, req.user);
            let tCount = this.projectService.countProjectNotes(appliedFilters);
            const [data, totalCount] = await Promise.all([dt, tCount]);
            let pageCount = Math.floor(totalCount / pagination.perPage) + ((totalCount % pagination.perPage) === 0 ? 0 : 1);
            return {
                message: `${moduleName} notes fetched Successfully`, statusCode: 200, data: data,
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
    async createProjectNote(createDto, req) {
        try {
            let hasGlobalPermission = await this.authorizationService.findUserPermissionsAgainstSlugs(req.user, [project_permissions_1.ProjectPermissionSet.UPDATE_ANY_PROJECT, project_permissions_1.ProjectPermissionSet.REAL_ALL_PROJECT]);
            if (!(hasGlobalPermission.updateAnyProject || hasGlobalPermission.readAllProject)) {
                await this.authorizationService.checkIfUserAuthorizedForProject(req.user, createDto.projectId);
            }
            let data = await this.projectService.createProjectNote(createDto, req.user);
            return { message: `Message sent successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async removeProjectNote(params, req) {
        try {
            await this.authorizationService.checkIfUserAuthorizedForProjectNote(req.user, params.id);
            let data = await this.projectService.removeNote(params.id);
            return { message: `Message deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, (err.statusCode) ? err.statusCode : 404);
        }
    }
    async removeNoteMedia(params, req) {
        try {
            await this.authorizationService.checkIfUserAuthorizedForProjectNote(req.user, params.id);
            let data = await this.projectService.removeNoteMedia(params.id);
            return { message: `${moduleName} deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, (err.statusCode) ? err.statusCode : 404);
        }
    }
    async remove(params, req) {
        try {
            let hasGlobalPermission = await this.authorizationService.findUserPermissionsAgainstSlugs(req.user, [project_permissions_1.ProjectPermissionSet.DELETE_ANY_PROJECT]);
            if (!hasGlobalPermission.deleteAnyProject) {
                await this.authorizationService.checkIfUserAuthorizedForProject(req.user, params.id);
            }
            let data = await this.projectService.remove(params.id);
            return { message: `${moduleName} deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(project_permissions_1.ProjectPermissionSet.UPLOAD_PROJECT_FILES),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: `Upload property Files` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: project_dto_1.ProjectResponseObject, isArray: false, description: `Returns the uploaded files on success` }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files[]', 20, multerOptionsProtected)),
    (0, common_1.Post)("uploadProjectFiles"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [upload_files_dto_1.UploadProjectFiles,
        Array, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "uploadPropertyFiles", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(project_permissions_1.ProjectPermissionSet.READ),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: `Upload conversation Files` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: project_dto_1.ProjectResponseObject, isArray: false, description: `Returns the uploaded files on success` }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files[]', 20, multerOptionsProtected)),
    (0, common_1.Post)("uploadConversationFiles/:id"),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto,
        Array, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "uploadConversationFiles", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(project_permissions_1.ProjectPermissionSet.CREATE),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system`, deprecated: true, description: "You can no longer create project directly, it should be created from Approved Quotation" }),
    (0, swagger_1.ApiResponse)({ status: 200, type: project_dto_1.ProjectResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_project_dto_1.CreateProjectDto, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: project_dto_1.ProjectResponseObject, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)('find-by-slug/:slug'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.FindBySlugDto, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "findBySlug", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(project_permissions_1.ProjectPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: project_dto_1.ProjectResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [project_filters_dto_1.ProjectFiltersDto, Object, common_types_1.Pagination]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: project_dto_1.ProjectResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)('getProjectForConversation'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [project_chat_filters_dto_1.ProjectChatFiltersDto, Object, common_types_1.Pagination]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "getProjectForConversation", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: project_dto_1.ProjectResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)('project-list'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [project_filters_dto_1.ProjectFiltersDto, Object, common_types_1.Pagination]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "findProjectList", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(project_permissions_1.ProjectPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: project_dto_1.ProjectResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)('findOne/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "findOne", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(project_permissions_1.ProjectPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: project_dto_1.ProjectResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)('findEnableStates/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "findMany", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(project_permissions_1.ProjectPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: project_dto_1.ProjectResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Post)('shareFiles'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [share_files_to_client_dto_1.ShareFilesToClient, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "shareFiles", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(project_permissions_1.ProjectPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: project_dto_1.ProjectResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)('sharedFiles/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "sharedFiles", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(project_permissions_1.ProjectPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: project_dto_1.ProjectResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)('update/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto,
        update_project_dto_1.UpdateProjectDto, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "update", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(project_permissions_1.ProjectPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: project_dto_1.ProjectResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)('updateFiles/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto,
        update_files_dto_1.UpdateProjectFiles, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "updateFiles", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(project_permissions_1.ProjectPermissionSet.HOLD_UNHOLD_PROJECT),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Hold the project` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: project_dto_1.ProjectResponseObject, isArray: false, description: `SetHold to true` }),
    (0, common_1.Patch)('holdProject/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto,
        hold_project_dto_1.HoldProjectDto, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "holdProject", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(project_permissions_1.ProjectPermissionSet.HOLD_UNHOLD_PROJECT),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Resume project` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: project_dto_1.ProjectResponseObject, isArray: false, description: `SetHold to false` }),
    (0, common_1.Patch)('unholdProject/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto,
        hold_project_dto_1.UnholdProjectDto, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "unholdProject", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(project_permissions_1.ProjectPermissionSet.UPDATE_PROJECT_MEMBERS),
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: project_dto_1.ProjectResponseObject, isArray: false }),
    (0, common_1.Delete)('removeProjectMembers/:projectId/:userId'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [remove_project_member_dto_1.RemoveProjectMember, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "removeProjectMembers", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(project_permissions_1.ProjectPermissionSet.UPDATE_PROJECT_MEMBERS),
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: project_dto_1.ProjectResponseObject, isArray: false }),
    (0, common_1.Delete)('removeProjectClient/:projectId/:clientId'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [remove_project_member_dto_1.RemoveProjectClient, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "removeProjectClient", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(project_permissions_1.ProjectPermissionSet.DELETE_PROJECT_FILES),
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: project_dto_1.ProjectResponseObject, isArray: false }),
    (0, common_1.Delete)('removeProjectFiles/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "removeProjectFiles", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(project_permissions_1.ProjectPermissionSet.UPDATE_PROJECT_MEMBERS),
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: project_dto_1.ProjectResponseObject, isArray: false }),
    (0, common_1.Patch)('updateProjectMembers'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_project_member_dto_1.UpdateProjectMember, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "updateProjectMembers", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(project_permissions_1.ProjectPermissionSet.CHANGE_STATUS),
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: project_dto_1.ProjectResponseObject, isArray: false }),
    (0, common_1.Patch)('updateProjectStatus'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_project_status_dto_1.UpdateProjectStatus, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "updateProjectStatus", null);
__decorate([
    (0, common_1.Post)('addProjectStates/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto,
        create_project_enable_state_dto_1.CreateProjectEnableStateDto, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "addProjectStates", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Remove project states` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: project_dto_1.ProjectResponseObject, isArray: false, description: `Returns the states of the project` }),
    (0, common_1.Patch)('removeProjectStates/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto,
        create_project_enable_state_dto_1.CreateProjectEnableStateDto, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "removeProjectStates", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(project_permissions_1.ProjectPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} files from the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: project_dto_1.ProjectResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)('getProjectResources'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [project_resouces_filters_dto_1.ProjectResourcesFiltersDto, Object, common_types_1.Pagination]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "findProjectFiles", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(project_permissions_1.ProjectPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} notes from the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: project_dto_1.ProjectResponseArray, isArray: false, description: `Return a list of ${moduleName} notes available` }),
    (0, common_1.Get)('getProjectNotes'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [project_resouces_filters_dto_1.ProjectResourcesFiltersDto, Object, project_note_pagination_dto_1.ProjectNotePaginationDto]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "findProjectNotes", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(project_permissions_1.ProjectPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: project_dto_1.ProjectResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.Post)('addProjectNote'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_project_note_dto_1.CreateProjectNoteDto, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "createProjectNote", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: project_dto_1.ProjectResponseObject, isArray: false, description: `Returns the deleted ${moduleName} object if found on the system` }),
    (0, common_1.Delete)('removeNote/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "removeProjectNote", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: project_dto_1.ProjectResponseObject, isArray: false, description: `Returns the deleted ${moduleName} object if found on the system` }),
    (0, common_1.Delete)('removeNoteMedia/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "removeNoteMedia", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(project_permissions_1.ProjectPermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: project_dto_1.ProjectResponseObject, isArray: false, description: `Returns the deleted ${moduleName} object if found on the system` }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "remove", null);
ProjectController = __decorate([
    (0, swagger_1.ApiTags)("project"),
    (0, common_1.Controller)('project'),
    __metadata("design:paramtypes", [project_service_1.ProjectService, project_authorization_service_1.ProjectAuthorizationService])
], ProjectController);
exports.ProjectController = ProjectController;
//# sourceMappingURL=project.controller.js.map