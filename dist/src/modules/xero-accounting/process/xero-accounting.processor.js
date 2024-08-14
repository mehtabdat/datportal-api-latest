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
Object.defineProperty(exports, "__esModule", { value: true });
exports.XeroProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const xero_accounting_processor_service_1 = require("./xero-accounting.processor.service");
const prisma_service_1 = require("../../../prisma.service");
const xero_process_config_1 = require("./xero.process.config");
let XeroProcessor = class XeroProcessor {
    constructor(xeroProcessorService, prisma) {
        this.xeroProcessorService = xeroProcessorService;
        this.prisma = prisma;
        this.logger = new common_1.Logger(this.constructor.name);
    }
    async syncClient(job) {
        var _a;
        let clientData = (_a = job.data) === null || _a === void 0 ? void 0 : _a.data;
        try {
            await this.xeroProcessorService.syncClient(clientData, clientData === null || clientData === void 0 ? void 0 : clientData.xeroTenantId);
        }
        catch (err) {
            this.logger.error("Some error while syncing client data", err);
        }
    }
    async syncInvoice(job) {
        var _a;
        let invoiceData = (_a = job.data) === null || _a === void 0 ? void 0 : _a.data;
        try {
            await this.xeroProcessorService.syncInvoice(invoiceData);
        }
        catch (err) {
            this.logger.error("Some error while syncing invoice data", err);
        }
    }
    async syncQuotation(job) {
        var _a;
        let quotationData = (_a = job.data) === null || _a === void 0 ? void 0 : _a.data;
        try {
            await this.xeroProcessorService.syncQuotation(quotationData);
        }
        catch (err) {
            this.logger.error("Some error while syncing quotation data", err);
        }
    }
    async updateQuotationStatus(job) {
        var _a;
        let quotationData = (_a = job.data) === null || _a === void 0 ? void 0 : _a.data;
        try {
            await this.xeroProcessorService.updateQuotationStatus(quotationData);
        }
        catch (err) {
            this.logger.error("Some error while updating quotation status", err);
        }
    }
    async updateInvoiceStatus(job) {
        var _a;
        let invoiceData = (_a = job.data) === null || _a === void 0 ? void 0 : _a.data;
        try {
            await this.xeroProcessorService.updateInvoiceStatus(invoiceData);
        }
        catch (err) {
            this.logger.error("Some error while updating invoice status", err);
        }
    }
    async syncProject(job) {
        var _a;
        let projectData = (_a = job.data) === null || _a === void 0 ? void 0 : _a.data;
        try {
            await this.xeroProcessorService.syncProject(projectData);
        }
        catch (err) {
            this.logger.error("Some error while updating project", err);
        }
    }
    globalHandler(job) {
        this.logger.error('No listners were provided, fall back to default', job.data);
    }
};
__decorate([
    (0, bull_1.Process)(xero_process_config_1.XeroProcessNames.syncClient),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], XeroProcessor.prototype, "syncClient", null);
__decorate([
    (0, bull_1.Process)(xero_process_config_1.XeroProcessNames.syncInvoice),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], XeroProcessor.prototype, "syncInvoice", null);
__decorate([
    (0, bull_1.Process)(xero_process_config_1.XeroProcessNames.syncQuotation),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], XeroProcessor.prototype, "syncQuotation", null);
__decorate([
    (0, bull_1.Process)(xero_process_config_1.XeroProcessNames.updateQuotationStatus),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], XeroProcessor.prototype, "updateQuotationStatus", null);
__decorate([
    (0, bull_1.Process)(xero_process_config_1.XeroProcessNames.updateInvoiceStatus),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], XeroProcessor.prototype, "updateInvoiceStatus", null);
__decorate([
    (0, bull_1.Process)(xero_process_config_1.XeroProcessNames.syncProject),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], XeroProcessor.prototype, "syncProject", null);
__decorate([
    (0, bull_1.Process)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], XeroProcessor.prototype, "globalHandler", null);
XeroProcessor = __decorate([
    (0, bull_1.Processor)('xero'),
    __metadata("design:paramtypes", [xero_accounting_processor_service_1.XeroProcessorService, prisma_service_1.PrismaService])
], XeroProcessor);
exports.XeroProcessor = XeroProcessor;
//# sourceMappingURL=xero-accounting.processor.js.map