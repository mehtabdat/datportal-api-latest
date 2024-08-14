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
exports.ResourcesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const public_metadata_1 = require("../../authentication/public-metadata");
const token_service_1 = require("../../authentication/token.service");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const authorization_service_1 = require("../../authorization/authorization.service");
const file_management_1 = require("../../helpers/file-management");
const jwt_token_dto_1 = require("./dto/jwt-token.dto");
const resources_permissions_1 = require("./resources.permissions");
const resources_service_1 = require("./resources.service");
const fs_1 = require("fs");
const sitemap_dto_1 = require("./dto/sitemap.dto");
const constants_1 = require("../../config/constants");
let ResourcesController = class ResourcesController {
    constructor(resourcesService, authorizationService, tokenService) {
        this.resourcesService = resourcesService;
        this.authorizationService = authorizationService;
        this.tokenService = tokenService;
    }
    async fetchResources(res, params, jwtToken, req) {
        try {
            const key = params[0];
            if (!key) {
                return res.status(400).json({ msg: "Key not found", statusCode: 404 });
            }
            const fileLocationParts = key.split('/');
            const accessType = fileLocationParts[0];
            const resourceType = fileLocationParts[1];
            let skipPermissionCheck = false;
            if (accessType === "public") {
                skipPermissionCheck = true;
            }
            else {
                if (!constants_1.ResourcesLocation[resourceType]) {
                    throw {
                        message: "Unknown resource type",
                        statusCode: 400
                    };
                }
            }
            if (!skipPermissionCheck) {
                if (jwtToken.authKey) {
                    try {
                        const payload = await this.tokenService.verifyUserToken(jwtToken.authKey, true);
                        req.user = payload;
                    }
                    catch (err) {
                        throw { message: err.message, statusCode: 401 };
                    }
                }
                else {
                    return res.status(403).json({ msg: "Forbidden resource", statusCode: 403 });
                }
                if (!req.user) {
                    return res.status(403).json({ msg: "Forbidden resource", statusCode: 403 });
                }
                await this.resourcesService.checkResourcePermission(req.user, key, resourceType);
            }
            if (jwtToken.download) {
                res.setHeader('Content-Disposition', `attachment; filename=${fileLocationParts[fileLocationParts.length - 1]}`);
            }
            const readStream = (0, file_management_1.getFileStream)(key);
            if (!readStream) {
                return res.status(400).json({ message: "Could not read file", statusCode: 400 });
            }
            let responseSent = false;
            readStream.on('error', error => {
                console.log("Error while streaming file", error === null || error === void 0 ? void 0 : error.message);
                if (!responseSent) {
                    responseSent = true;
                    let response = { message: "File not found", statusCode: 400, data: {} };
                    return res.status(400).json(response);
                }
            });
            readStream.on('end', () => {
                if (!responseSent) {
                    responseSent = true;
                }
            });
            return readStream.pipe(res);
        }
        catch (err) {
            let logger = new common_1.Logger("ResourceFetchAppModule");
            logger.error("Some error while reading file", err);
            let response = { message: err.message ? err.message : "File not found", statusCode: err.statusCode ? err.statusCode : 400, data: {} };
            return res.status((err.statusCode ? err.statusCode : 400)).json(response);
        }
    }
    async fetchProjectResources(res, params, jwtToken, req) {
        try {
            if (jwtToken.authKey) {
                try {
                    const payload = await this.tokenService.verifyUserToken(jwtToken.authKey, false);
                    req.user = payload;
                }
                catch (err) {
                    throw { message: err.message, statusCode: 401 };
                }
            }
            else {
                res.status(403).json({ msg: "Forbidden resource", statusCode: 403 });
                return;
            }
            if (!req.user) {
                res.status(403).json({ msg: "Forbidden resource", statusCode: 403 });
                return;
            }
            const key = params[0];
            if (!key) {
                res.status(400).json({ msg: "Key not found", statusCode: 404 });
                return;
            }
            await this.authorizationService.checkIfUserCanReadProjectResources(req.user, key);
            const readStream = (0, file_management_1.getFileStream)(key);
            readStream.on('error', error => {
                let response = { message: "File not found", statusCode: 400, data: {} };
                res.status(400).json(response);
            });
            readStream.pipe(res);
        }
        catch (err) {
            let logger = new common_1.Logger("ResourceFetchAppModule");
            logger.error("Some error while reading file", err);
            let response = { message: err.message ? err.message : "File not found", statusCode: err.statusCode ? err.statusCode : 400, data: {} };
            res.status(400).json(response);
        }
    }
    async fetchTaskResources(res, params, jwtToken, req) {
        try {
            if (jwtToken.authKey) {
                try {
                    const payload = await this.tokenService.verifyUserToken(jwtToken.authKey, false);
                    req.user = payload;
                }
                catch (err) {
                    throw { message: err.message, statusCode: 401 };
                }
            }
            else {
                res.status(403).json({ msg: "Forbidden resource", statusCode: 403 });
                return;
            }
            if (!req.user) {
                res.status(403).json({ msg: "Forbidden resource", statusCode: 403 });
                return;
            }
            const key = params[0];
            if (!key) {
                res.status(400).json({ msg: "Key not found", statusCode: 404 });
                return;
            }
            await this.authorizationService.checkIfUserCanReadTaskResources(req.user, key);
            const readStream = (0, file_management_1.getFileStream)(key);
            readStream.on('error', error => {
                let response = { message: "File not found", statusCode: 400, data: {} };
                res.status(400).json(response);
            });
            readStream.pipe(res);
        }
        catch (err) {
            let logger = new common_1.Logger("ResourceFetchAppModule");
            logger.error("Some error while reading file", err);
            let response = { message: err.message ? err.message : "File not found", statusCode: err.statusCode ? err.statusCode : 400, data: {} };
            res.status(400).json(response);
        }
    }
    async fetchOrganizationResources(res, params, jwtToken, req) {
        try {
            if (jwtToken.authKey) {
                try {
                    const payload = await this.tokenService.verifyUserToken(jwtToken.authKey, false);
                    req.user = payload;
                }
                catch (err) {
                    throw { message: err.message, statusCode: 401 };
                }
            }
            else {
                res.status(403).json({ msg: "Forbidden resource", statusCode: 403 });
                return;
            }
            if (!req.user) {
                res.status(403).json({ msg: "Forbidden resource", statusCode: 403 });
                return;
            }
            const key = params[0];
            if (!key) {
                res.status(400).json({ msg: "Key not found", statusCode: 404 });
                return;
            }
            await this.authorizationService.checkIfUserCanReadOrganzationResources(req.user, key);
            const readStream = (0, file_management_1.getFileStream)(key);
            readStream.on('error', error => {
                let response = { message: "File not found", statusCode: 400, data: {} };
                res.status(400).json(response);
            });
            readStream.pipe(res);
        }
        catch (err) {
            let logger = new common_1.Logger("ResourceFetchAppModule");
            logger.error("Some error while reading file", err);
            let response = { message: err.message ? err.message : "File not found", statusCode: err.statusCode ? err.statusCode : 400, data: {} };
            res.status(400).json(response);
        }
    }
    async readSitemapFile() {
        try {
            let filePath = "/var/www/html/yallahproperty.com/sitemap.xml";
            let sitemap;
            try {
                sitemap = (0, fs_1.readFileSync)(filePath, { encoding: 'utf-8' });
            }
            catch (err) {
                console.log("Error while reading sitemap", err.message);
            }
            return { message: `Read sitemap.xml file`, statusCode: 200, data: sitemap };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async updateSitemapFile(sitemapDto) {
        try {
            let filePath = "/var/www/html/yallahproperty.com/sitemap.xml";
            try {
                (0, fs_1.writeFileSync)(filePath, sitemapDto.data);
            }
            catch (err) {
                console.log("Error while writing sitemap", err.message);
            }
            return { message: `Sitemap file updated successfully`, statusCode: 200, data: {} };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, public_metadata_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: "Fetch All Files" }),
    (0, common_1.Get)('all/*'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, jwt_token_dto_1.JwtToken, Object]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "fetchResources", null);
__decorate([
    (0, public_metadata_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: "This API is deprecated. Please use all/* API insted", deprecated: true }),
    (0, common_1.Get)('project-resources/*'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, jwt_token_dto_1.JwtToken, Object]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "fetchProjectResources", null);
__decorate([
    (0, public_metadata_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: "This API is deprecated. Please use all/* API insted", deprecated: true }),
    (0, common_1.Get)('task-resources/*'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, jwt_token_dto_1.JwtToken, Object]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "fetchTaskResources", null);
__decorate([
    (0, public_metadata_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: "This API is deprecated. Please use all/* API insted", deprecated: true }),
    (0, common_1.Get)('organization-resources/*'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, jwt_token_dto_1.JwtToken, Object]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "fetchOrganizationResources", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(resources_permissions_1.ResourcesPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Read sitemap.xml file` }),
    (0, swagger_1.ApiResponse)({ status: 200, isArray: false, description: `Read sitemap.xml file` }),
    (0, common_1.Get)('read-sitemap'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "readSitemapFile", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(resources_permissions_1.ResourcesPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Read sitemap.xml file` }),
    (0, swagger_1.ApiResponse)({ status: 200, isArray: false, description: `Read sitemap.xml file` }),
    (0, common_1.Patch)('update-sitemap'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sitemap_dto_1.SitemapDto]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "updateSitemapFile", null);
ResourcesController = __decorate([
    (0, swagger_1.ApiTags)("resources"),
    (0, common_1.Controller)('resources'),
    __metadata("design:paramtypes", [resources_service_1.ResourcesService,
        authorization_service_1.AuthorizationService,
        token_service_1.TokenService])
], ResourcesController);
exports.ResourcesController = ResourcesController;
//# sourceMappingURL=resources.controller.js.map