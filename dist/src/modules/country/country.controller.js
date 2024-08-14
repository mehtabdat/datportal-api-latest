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
exports.CountryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const country_service_1 = require("./country.service");
const country_dto_1 = require("./dto/country-dto");
const create_country_dto_1 = require("./dto/create-country.dto");
const params_dto_1 = require("./dto/params-dto");
const update_country_dto_1 = require("./dto/update-country.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const country_permissions_1 = require("./country.permissions");
const public_metadata_1 = require("../../authentication/public-metadata");
let CountryController = class CountryController {
    constructor(countryService) {
        this.countryService = countryService;
    }
    async create(createCountryDto, req) {
        try {
            let data = await this.countryService.create(createCountryDto);
            return { message: "Country data saved successfully", statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAll(req) {
        try {
            let data = await this.countryService.findAll(req.user);
            return { message: "Country fetched Successfully", statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAllAvailableCountry() {
        try {
            let data = await this.countryService.findAllAvailableCountry();
            return { message: "Country fetched Successfully", statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAvailableCountry() {
        try {
            let data = await this.countryService.findAvailableCountry();
            return { message: "Country fetched Successfully", statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async update(params, updateCountryDto, req) {
        try {
            updateCountryDto['modifiedDate'] = new Date();
            let data = await this.countryService.update(params.id, updateCountryDto);
            return { message: "Country updated successfully", statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async remove(params, req) {
        try {
            let metaData = {
                deletedDate: new Date()
            };
            let data = await this.countryService.remove(params.id, metaData);
            return { message: "Country deleted successfully", statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findOne(params) {
        try {
            let data = await this.countryService.findOne(params.id);
            return { message: "Country data Fetched Successfully", statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(country_permissions_1.CountryPermissionSet.CREATE),
    (0, swagger_1.ApiOperation)({ summary: 'Add a new country in the system' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: country_dto_1.CountryResponseObject, isArray: false, description: 'Returns the new record on success' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_country_dto_1.CreateCountryDto, Object]),
    __metadata("design:returntype", Promise)
], CountryController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Fetch all country data from the system' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: country_dto_1.CountryResponseArray, isArray: false, description: 'Returns the list of county in the system' }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CountryController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Fetch all country data from the system' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: country_dto_1.CountryResponseArray, isArray: false, description: 'Returns the list of county in the system' }),
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CountryController.prototype, "findAllAvailableCountry", null);
__decorate([
    (0, public_metadata_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Fetch all country data from the system' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: country_dto_1.CountryResponseArray, isArray: false, description: 'Returns the list of county in the system' }),
    (0, common_1.Get)('available-country'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CountryController.prototype, "findAvailableCountry", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(country_permissions_1.CountryPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: 'Update country', description: "Only the white listed fields are considered, other fields are striped out by default" }),
    (0, swagger_1.ApiResponse)({ status: 200, type: country_dto_1.CountryResponseObject, isArray: false, description: 'Returns the updated country object if found on the system' }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto, update_country_dto_1.UpdateCountryDto, Object]),
    __metadata("design:returntype", Promise)
], CountryController.prototype, "update", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(country_permissions_1.CountryPermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: 'Delete country' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: country_dto_1.CountryResponseObject, isArray: false, description: 'Returns the deleted country object if found on the system' }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], CountryController.prototype, "remove", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(country_permissions_1.CountryPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: 'Fetch country by id' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: country_dto_1.CountryResponseObject, isArray: false, description: 'Returns the country object if found on the system' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], CountryController.prototype, "findOne", null);
CountryController = __decorate([
    (0, swagger_1.ApiTags)("Country"),
    (0, common_1.Controller)('country'),
    __metadata("design:paramtypes", [country_service_1.CountryService])
], CountryController);
exports.CountryController = CountryController;
//# sourceMappingURL=country.controller.js.map