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
exports.CarReservationRequestController = void 0;
const common_1 = require("@nestjs/common");
const create_car_reservation_dto_1 = require("./dto/create-car-reservation.dto");
const swagger_1 = require("@nestjs/swagger");
const common_types_1 = require("../../common-types/common-types");
const car_reservation_request_dto_1 = require("./dto/car-reservation-request.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const car_reservation_request_permissions_1 = require("./car-reservation-request.permissions");
const car_reservation_request_filters_dto_1 = require("./dto/car-reservation-request-filters.dto");
const file_upload_utils_1 = require("../../helpers/file-upload.utils");
const platform_express_1 = require("@nestjs/platform-express");
const file_management_1 = require("../../helpers/file-management");
const car_reservation_request_admin_action_dto_1 = require("./dto/car-reservation-request-admin-action.dto");
const car_reservation_request_authorization_service_1 = require("./car-reservation-request.authorization.service");
const car_reservation_request_service_1 = require("./car-reservation-request.service");
const check_car_availability_dto_1 = require("./dto/check-car-availability.dto");
const constants_1 = require("../../config/constants");
const multerOptionsProtected = (0, file_upload_utils_1.getMulterOptions)({ destination: (0, car_reservation_request_dto_1.getDynamicUploadPath)(), fileTypes: 'images_and_pdf', limit: 10000000 });
const moduleName = "car-reservation-request";
let CarReservationRequestController = class CarReservationRequestController {
    constructor(carReservationRequestService, carReservationRequestAuthorizationService) {
        this.carReservationRequestService = carReservationRequestService;
        this.carReservationRequestAuthorizationService = carReservationRequestAuthorizationService;
    }
    async create(createDto, files, req) {
        try {
            let data = await this.carReservationRequestService.create(createDto, req.user);
            await this.carReservationRequestService.handleFiles(data.id, files);
            (0, file_management_1.uploadFile)(files);
            let recordData = await this.carReservationRequestService.findOne(data.id);
            return { message: `${moduleName} created successfully`, statusCode: 200, data: recordData };
        }
        catch (err) {
            (0, file_upload_utils_1.removeUploadedFiles)(files);
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAll(filters, req, pagination) {
        try {
            let permissions = await this.carReservationRequestAuthorizationService.findUserPermissionsAgainstSlugs(req.user, [car_reservation_request_permissions_1.CarReservationRequestPermissionSet.HR_APPROVAL]);
            if (!permissions.carReservationRequestHRApproval) {
                filters.userId = req.user.userId;
            }
            let appliedFilters = this.carReservationRequestService.applyFilters(filters, permissions);
            let dt = await this.carReservationRequestService.findAll(appliedFilters, pagination);
            let tCount = this.carReservationRequestService.countRecords(appliedFilters);
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
    async readOwnRequest(filters, req, pagination) {
        try {
            filters.userId = req.user.userId;
            let appliedFilters = this.carReservationRequestService.applyFilters(filters);
            let dt = await this.carReservationRequestService.findAll(appliedFilters, pagination);
            let tCount = this.carReservationRequestService.countRecords(appliedFilters);
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
    async findOne(params, req) {
        try {
            let permissions = await this.carReservationRequestAuthorizationService.findUserPermissionsAgainstSlugs(req.user, [car_reservation_request_permissions_1.CarReservationRequestPermissionSet.HR_APPROVAL]);
            if (!permissions.carReservationRequestHRApproval) {
                await this.carReservationRequestAuthorizationService.isAuthorizedForCarReservation(params.id, req.user);
            }
            let data = await this.carReservationRequestService.findOne(params.id);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async withdraw(params, req) {
        try {
            await this.carReservationRequestAuthorizationService.isAuthorizedForCarReservation(params.id, req.user);
            let data = await this.carReservationRequestService.withdraw(params.id);
            return { message: `Your request has been withdrawn successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async submitRequest(params, req) {
        try {
            await this.carReservationRequestAuthorizationService.isAuthorizedForCarReservation(params.id, req.user);
            let data = await this.carReservationRequestService.submitRequest(params.id);
            return { message: `Your request has been withdrawn successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async hrAction(params, CarReservationRequestAdminAction, req) {
        try {
            if (CarReservationRequestAdminAction.status === constants_1.CarReservationRequestStatus.approved) {
                let requestData = await this.carReservationRequestService.findOne(params.id);
                let isAvailable = await this.carReservationRequestService.checkAvailability({ fromDate: requestData.fromDate, toDate: requestData.toDate, companyCarId: CarReservationRequestAdminAction.companyCarId });
                if (!isAvailable) {
                    throw {
                        message: "This car is no longer available in the requested date",
                        statusCode: 400
                    };
                }
            }
            let data = await this.carReservationRequestService.hrUpdate(params.id, CarReservationRequestAdminAction, req.user);
            return { message: `Your action has been saved successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async checkAvailability(checkCarAvailabilityDto, req) {
        try {
            let data = await this.carReservationRequestService.checkAvailability(checkCarAvailabilityDto);
            return { message: `Car Availability fetched successfully`, statusCode: 200, data: {
                    isAvailable: data
                } };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(car_reservation_request_permissions_1.CarReservationRequestPermissionSet.CREATE),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)("files[]", 10, multerOptionsProtected)),
    (0, swagger_1.ApiResponse)({ status: 200, type: car_reservation_request_dto_1.CarReservationResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_car_reservation_dto_1.CreateCarReservationRequestDto,
        Array, Object]),
    __metadata("design:returntype", Promise)
], CarReservationRequestController.prototype, "create", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(car_reservation_request_permissions_1.CarReservationRequestPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: car_reservation_request_dto_1.CarReservationResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [car_reservation_request_filters_dto_1.CarReservationRequestFiltersDto, Object, common_types_1.Pagination]),
    __metadata("design:returntype", Promise)
], CarReservationRequestController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: car_reservation_request_dto_1.CarReservationResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)('own'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [car_reservation_request_filters_dto_1.CarReservationRequestFiltersDto, Object, common_types_1.Pagination]),
    __metadata("design:returntype", Promise)
], CarReservationRequestController.prototype, "readOwnRequest", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(car_reservation_request_permissions_1.CarReservationRequestPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: car_reservation_request_dto_1.CarReservationResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)('findOne/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], CarReservationRequestController.prototype, "findOne", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(car_reservation_request_permissions_1.CarReservationRequestPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Withdraw cash advance request` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: car_reservation_request_dto_1.CarReservationResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)('withdraw/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], CarReservationRequestController.prototype, "withdraw", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(car_reservation_request_permissions_1.CarReservationRequestPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Withdraw cash advance request` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: car_reservation_request_dto_1.CarReservationResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)('submitRequest/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], CarReservationRequestController.prototype, "submitRequest", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(car_reservation_request_permissions_1.CarReservationRequestPermissionSet.HR_APPROVAL),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `HR Action on cash advance request` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: car_reservation_request_dto_1.CarReservationResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)('hrAction/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto,
        car_reservation_request_admin_action_dto_1.CarReservationRequestAdminAction, Object]),
    __metadata("design:returntype", Promise)
], CarReservationRequestController.prototype, "hrAction", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `HR Action on cash advance request` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: car_reservation_request_dto_1.CarReservationResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)('checkAvailability'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [check_car_availability_dto_1.CheckCarAvailabilityDto, Object]),
    __metadata("design:returntype", Promise)
], CarReservationRequestController.prototype, "checkAvailability", null);
CarReservationRequestController = __decorate([
    (0, swagger_1.ApiTags)("car-reservation-request"),
    (0, common_1.Controller)('car-reservation-request'),
    __metadata("design:paramtypes", [car_reservation_request_service_1.CarReservationRequestService, car_reservation_request_authorization_service_1.CarReservationAuthorizationService])
], CarReservationRequestController);
exports.CarReservationRequestController = CarReservationRequestController;
//# sourceMappingURL=car-reservation-request.controller.js.map