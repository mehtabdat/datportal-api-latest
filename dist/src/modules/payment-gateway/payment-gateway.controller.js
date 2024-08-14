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
exports.PaymentGatewayController = void 0;
const common_1 = require("@nestjs/common");
const payment_gateway_service_1 = require("./payment-gateway.service");
const create_payment_gateway_dto_1 = require("./dto/create-payment-gateway.dto");
const update_payment_gateway_dto_1 = require("./dto/update-payment-gateway.dto");
const payment_gateway_dto_1 = require("./dto/payment-gateway.dto");
const swagger_1 = require("@nestjs/swagger");
const params_dto_1 = require("./dto/params.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const payment_gateway_permissions_1 = require("./payment-gateway.permissions");
const moduleName = "payment-gateway";
let PaymentGatewayController = class PaymentGatewayController {
    constructor(paymentGatewayService) {
        this.paymentGatewayService = paymentGatewayService;
    }
    async create(createPaymentGatewayDto, req) {
        try {
            createPaymentGatewayDto['addedById'] = req.user.userId;
            let data = await this.paymentGatewayService.create(createPaymentGatewayDto);
            return { message: `${moduleName} created successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAll() {
        try {
            let data = await this.paymentGatewayService.findAll();
            return { message: `${moduleName} fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findOne(params) {
        try {
            let data = await this.paymentGatewayService.findOne(params.id);
            return { message: `${moduleName} fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async update(params, updatePaymentGatewayDto, req) {
        try {
            updatePaymentGatewayDto['modifiedDate'] = new Date();
            updatePaymentGatewayDto['modifiedById'] = req.user.userId;
            let data = await this.paymentGatewayService.update(params.id, updatePaymentGatewayDto);
            return { message: "Record updated successfully", statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async remove(params, req) {
        try {
            let updateRecord = {
                deletedById: req.user.userId,
                deletedDate: new Date()
            };
            let data = await this.paymentGatewayService.remove(params.id, updateRecord);
            return { message: `${moduleName} deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(payment_gateway_permissions_1.PaymentGatewayPermissionSet.CREATE),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: payment_gateway_dto_1.PaymentGatewayResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payment_gateway_dto_1.CreatePaymentGatewayDto, Object]),
    __metadata("design:returntype", Promise)
], PaymentGatewayController.prototype, "create", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(payment_gateway_permissions_1.PaymentGatewayPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: payment_gateway_dto_1.PaymentGatewayResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentGatewayController.prototype, "findAll", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(payment_gateway_permissions_1.PaymentGatewayPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: payment_gateway_dto_1.PaymentGatewayResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], PaymentGatewayController.prototype, "findOne", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(payment_gateway_permissions_1.PaymentGatewayPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: payment_gateway_dto_1.PaymentGatewayResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto, update_payment_gateway_dto_1.UpdatePaymentGatewayDto, Object]),
    __metadata("design:returntype", Promise)
], PaymentGatewayController.prototype, "update", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(payment_gateway_permissions_1.PaymentGatewayPermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: payment_gateway_dto_1.PaymentGatewayResponseObject, isArray: false, description: `Returns the deleted ${moduleName} object if found on the system` }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], PaymentGatewayController.prototype, "remove", null);
PaymentGatewayController = __decorate([
    (0, swagger_1.ApiTags)("payment-gateway"),
    (0, common_1.Controller)('payment-gateway'),
    __metadata("design:paramtypes", [payment_gateway_service_1.PaymentGatewayService])
], PaymentGatewayController);
exports.PaymentGatewayController = PaymentGatewayController;
//# sourceMappingURL=payment-gateway.controller.js.map