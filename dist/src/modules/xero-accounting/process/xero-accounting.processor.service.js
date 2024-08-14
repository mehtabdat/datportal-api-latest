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
var XeroProcessorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.XeroProcessorService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma.service");
const xero_accounting_service_1 = require("../xero-accounting.service");
const organization_dto_1 = require("../../organization/dto/organization.dto");
const client_dto_1 = require("../../client/dto/client.dto");
const leads_dto_1 = require("../../leads/dto/leads.dto");
let XeroProcessorService = XeroProcessorService_1 = class XeroProcessorService {
    constructor(prisma, xeroAccountingService) {
        this.prisma = prisma;
        this.xeroAccountingService = xeroAccountingService;
        this.logger = new common_1.Logger(XeroProcessorService_1.name);
    }
    async syncClient(client, xeroTenantId) {
        await this.xeroAccountingService.upsertContact(client, xeroTenantId);
    }
    async syncInvoice(invoice) {
        let invoiceData = await this.prisma.invoice.findUnique({
            where: {
                id: invoice.id
            },
            include: {
                Client: {
                    select: client_dto_1.ClientDefaultAttributes
                },
                Project: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        xeroReference: true,
                        SubmissionBy: {
                            select: organization_dto_1.OrganizationDefaultAttributes
                        },
                        Lead: {
                            select: leads_dto_1.LeadsDefaultAttributes
                        }
                    }
                }
            }
        });
        await this.xeroAccountingService.upsertInvoice(invoiceData);
    }
    async syncQuotation(quotation) {
        let quotationData = await this.prisma.quotation.findUnique({
            where: {
                id: quotation.id
            },
            include: {
                Lead: {
                    select: {
                        id: true,
                        Client: {
                            select: client_dto_1.ClientDefaultAttributes
                        },
                        SubmissionBy: {
                            select: organization_dto_1.OrganizationDefaultAttributes
                        }
                    }
                }
            }
        });
        await this.xeroAccountingService.upsertQuotation(quotationData);
    }
    async updateQuotationStatus(quotation) {
        await this.xeroAccountingService.updateQuotationStatus(quotation);
    }
    async updateInvoiceStatus(invoice) {
        await this.xeroAccountingService.updateInvoiceStatus(invoice);
    }
    async syncProject(project) {
        await this.xeroAccountingService.upsertProject(project);
    }
};
XeroProcessorService = XeroProcessorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, xero_accounting_service_1.XeroAccountingService])
], XeroProcessorService);
exports.XeroProcessorService = XeroProcessorService;
//# sourceMappingURL=xero-accounting.processor.service.js.map