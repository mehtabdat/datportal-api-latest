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
exports.XeroAccountingController = void 0;
const common_1 = require("@nestjs/common");
const xero_accounting_service_1 = require("./xero-accounting.service");
const swagger_1 = require("@nestjs/swagger");
const public_metadata_1 = require("../../authentication/public-metadata");
const xero_quote_filters_dto_1 = require("./dto/xero-quote-filters.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const quotation_permissions_1 = require("../quotation/quotation.permissions");
const xero_accounting_pwemissions_1 = require("./xero-accounting.pwemissions");
const account_permissions_1 = require("../account/account.permissions");
const product_permissions_1 = require("../product/product.permissions");
const tax_rate_permissions_1 = require("../tax-rate/tax-rate.permissions");
const moduleName = "xero-accounting";
let XeroAccountingController = class XeroAccountingController {
    constructor(xeroAccountingService) {
        this.xeroAccountingService = xeroAccountingService;
    }
    async findAll(req) {
        try {
            let data = await this.xeroAccountingService.getAccessToken();
            return {
                message: `${moduleName} fetched Successfully`, statusCode: 200, data: {
                    consentUrl: data
                }
            };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async authenticate(req) {
        try {
            let data = await this.xeroAccountingService.authenticate(req.body.callbackUrl);
            return { message: `${moduleName} fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async logout() {
        try {
            let data = await this.xeroAccountingService.logoutFromXero();
            return { message: `Logged out from xero successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async checkLoginStatus() {
        try {
            let data = await this.xeroAccountingService.checkLoginStatus();
            return { message: `${moduleName} fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async getQuotes(req, xeroQuoteFiltersDto) {
        var _a, _b, _c;
        try {
            let xeroQuoteResponse = await this.xeroAccountingService.getQuotes(xeroQuoteFiltersDto);
            let data;
            if (xeroQuoteResponse && xeroQuoteResponse.body && ((_a = xeroQuoteResponse.body) === null || _a === void 0 ? void 0 : _a.quotes) && ((_b = xeroQuoteResponse.body) === null || _b === void 0 ? void 0 : _b.quotes.length) > 0) {
                data = await this.xeroAccountingService.prepareQuotationFromXeroQuote((_c = xeroQuoteResponse.body) === null || _c === void 0 ? void 0 : _c.quotes, xeroQuoteFiltersDto);
                return { message: `Quotes fetched Successfully`, statusCode: 200, data: data };
            }
            else {
                throw { message: `No Quote Data Found`, statusCode: 404, data: null };
            }
        }
        catch (err) {
            throw new common_1.HttpException({ message: err === null || err === void 0 ? void 0 : err.message, statusCode: (err.statusCode) ? err === null || err === void 0 ? void 0 : err.statusCode : 400, data: err === null || err === void 0 ? void 0 : err.data }, err.statusCode);
        }
    }
    async syncAccounts() {
        try {
            console.log("I am syncing data");
            let data = await this.xeroAccountingService.syncAllTenantsAccounts();
            return { message: `Accounts Synced Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException({ message: err === null || err === void 0 ? void 0 : err.message, statusCode: (err.statusCode) ? err === null || err === void 0 ? void 0 : err.statusCode : 400, data: err === null || err === void 0 ? void 0 : err.data }, err.statusCode);
        }
    }
    async syncProducts() {
        try {
            let data = await this.xeroAccountingService.syncAllTenantsProducts();
            return { message: `Products Sysnced Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException({ message: err === null || err === void 0 ? void 0 : err.message, statusCode: (err.statusCode) ? err === null || err === void 0 ? void 0 : err.statusCode : 400, data: err === null || err === void 0 ? void 0 : err.data }, err.statusCode);
        }
    }
    async syncTaxRates() {
        try {
            let data = await this.xeroAccountingService.syncAllTenantsTaxRates();
            return { message: `Tax Rates Synced Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException({ message: err === null || err === void 0 ? void 0 : err.message, statusCode: (err.statusCode) ? err === null || err === void 0 ? void 0 : err.statusCode : 400, data: err === null || err === void 0 ? void 0 : err.data }, err.statusCode);
        }
    }
    async getBrandingThemes(req) {
        try {
            let data = await this.xeroAccountingService.getBrandingThemes();
            return { message: `${moduleName} fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async getTenants() {
        try {
            let data = await this.xeroAccountingService.getTanants();
            return { message: `Tenants fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async webhooks(req, signature) {
        try {
            let data = req.body;
            let isSame = this.xeroAccountingService.validateWebhook(signature, data);
            if (isSame) {
                this.xeroAccountingService.handleWebhook(JSON.parse(data));
                return true;
            }
            else {
                throw { message: `Signature not matched`, statusCode: 401 };
            }
        }
        catch (err) {
            console.log("Webhook Error while validating request", err.message);
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(xero_accounting_pwemissions_1.XeroAccountingPermissionSet.LOGIN),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, common_1.Get)('getConsentUrl'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], XeroAccountingController.prototype, "findAll", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(xero_accounting_pwemissions_1.XeroAccountingPermissionSet.LOGIN),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, common_1.Post)('authenticate'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], XeroAccountingController.prototype, "authenticate", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(xero_accounting_pwemissions_1.XeroAccountingPermissionSet.LOGOUT),
    (0, swagger_1.ApiOperation)({ summary: `Logout from XERO` }),
    (0, common_1.Post)('logout'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], XeroAccountingController.prototype, "logout", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, common_1.Post)('checkLoginStatus'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], XeroAccountingController.prototype, "checkLoginStatus", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(quotation_permissions_1.QuotationPermissionSet.CREATE),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, common_1.Post)('getQuotes'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, xero_quote_filters_dto_1.XeroQuoteFiltersDto]),
    __metadata("design:returntype", Promise)
], XeroAccountingController.prototype, "getQuotes", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(account_permissions_1.AccountPermissionSet.CREATE),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, common_1.Patch)('syncAccounts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], XeroAccountingController.prototype, "syncAccounts", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(product_permissions_1.ProductPermissionSet.CREATE),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, common_1.Patch)('syncProducts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], XeroAccountingController.prototype, "syncProducts", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(tax_rate_permissions_1.TaxRatePermissionSet.CREATE),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, common_1.Patch)('syncTaxRates'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], XeroAccountingController.prototype, "syncTaxRates", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, common_1.Post)('getBrandingThemes'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], XeroAccountingController.prototype, "getBrandingThemes", null);
__decorate([
    (0, common_1.Get)("getTenants"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], XeroAccountingController.prototype, "getTenants", null);
__decorate([
    (0, public_metadata_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, common_1.Post)('webhook'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Headers)('x-xero-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], XeroAccountingController.prototype, "webhooks", null);
XeroAccountingController = __decorate([
    (0, common_1.Controller)('xero'),
    __metadata("design:paramtypes", [xero_accounting_service_1.XeroAccountingService])
], XeroAccountingController);
exports.XeroAccountingController = XeroAccountingController;
//# sourceMappingURL=xero-accounting.controller.js.map