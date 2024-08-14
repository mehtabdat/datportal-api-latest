/// <reference types="node" />
/// <reference types="node/http" />
/// <reference types="got/dist/source/core/utils/timed-out" />
import { PrismaService } from 'src/prisma.service';
import { Contacts, Invoice as Xero_Invoice, Invoices, Quote, Quotes, QuoteStatusCodes, Account, TaxRate, Item } from 'xero-node';
import { RedisService } from '../redis/redis.service';
import { XeroQuoteFiltersDto } from './dto/xero-quote-filters.dto';
import { Client, Invoice as PrismaInvoice, Quotation, Project, Invoice, Leads, Organization } from '@prisma/client';
import { WebhookEventPayload, WehbookEventType, XeroEnventCategory } from './dto/xero-accounting';
import { InvoiceStatus, QuotationStatus } from 'src/config/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class XeroAccountingService {
    private readonly prisma;
    private readonly redisService;
    private readonly eventEmitter;
    private readonly logger;
    private readonly client_id;
    private readonly client_secret;
    private redirectUrl;
    private accessToken;
    private readonly XERO_WEBHOOK_KEY;
    private readonly scopes;
    private xero;
    allProcessed: {
        resourceId: string;
        type: keyof typeof XeroEnventCategory;
    }[];
    constructor(prisma: PrismaService, redisService: RedisService, eventEmitter: EventEmitter2);
    private saveRefreshToken;
    private getDefaultTenantId;
    private deleteRefreshToken;
    private getRefreshToken;
    logoutFromXero(): Promise<boolean>;
    getTanants(): Promise<any[]>;
    private validateAccessToken;
    private refreshXeroToken;
    getAccessToken(): Promise<string>;
    validateWebhook(webhookKey: string, webhookData: any): boolean;
    authenticate(url: string): Promise<"Authentication successful" | "Something went wrong">;
    resetProcessedData(resourceId: string, type: keyof typeof XeroEnventCategory): void;
    updateInvoiceStatus(invoice: Invoice): Promise<{
        response: import("http").IncomingMessage;
        body: Invoices;
    }>;
    updateQuotationStatus(quotation: Quotation): Promise<{
        response: import("http").IncomingMessage;
        body: Quotes;
    }>;
    upsertProject(project: Project): Promise<void>;
    upsertQuotation(quotation: Quotation & {
        Lead: Partial<Leads> & {
            SubmissionBy: Partial<Organization>;
        };
    }): Promise<{
        response: import("http").IncomingMessage;
        body: Quotes;
    }>;
    upsertInvoice(invoice: PrismaInvoice & {
        Project: Partial<Project> & {
            Lead: Partial<Leads>;
        };
    }): Promise<{
        response: import("http").IncomingMessage;
        body: Invoices;
    }>;
    matchLocalQuoteStatusToXero(status: number): QuoteStatusCodes;
    matchXeroQuoteStatusToLocalQuoteStatus(status: number): QuotationStatus;
    matchLocalInvoiceStatusToXero(status: number): Xero_Invoice.StatusEnum;
    matchXeroInvoiceStatusToLocalInvoiceStatus(status: Xero_Invoice.StatusEnum): InvoiceStatus;
    upsertContact(client: Client, xeroTenantId: string): Promise<{
        response: import("http").IncomingMessage;
        body: Contacts;
    }>;
    getBrandingThemes(): Promise<{
        response: import("http").IncomingMessage;
        body: import("xero-node").BrandingThemes;
    }>;
    getQuotes(filters?: XeroQuoteFiltersDto): Promise<{
        response: import("http").IncomingMessage;
        body: Quotes;
    }>;
    prepareQuotationFromXeroQuote(quotes: Quote[], filters: XeroQuoteFiltersDto): Promise<{
        id: number;
        leadId: number;
        scopeOfWork: string;
        file: string;
        type: number;
        status: number;
        isDeleted: boolean;
        addedDate: Date;
        sentDate: Date;
        modifiedDate: Date;
        addedById: number;
        modifiedById: number;
        paymentTerms: string;
        hasSupervision: boolean;
        supervisionMonthlyCharge: number;
        supervisionPaymentSchedule: number;
        projectId: number;
        expiryDate: Date;
        revisedQuotationReferenceId: number;
        revisionCount: number;
        subTotal: number;
        total: number;
        vatAmount: number;
        xeroReference: string;
        quoteNumber: string;
        brandingThemeId: number;
        issueDate: Date;
        xeroTenantId: string;
        note: string;
    }>;
    prepareInvoiceFromXeroInvoice(invoices: Xero_Invoice[], tenantId: string): Promise<{
        id: number;
        title: string;
        message: string;
        projectId: number;
        vatAmount: number;
        total: number;
        status: number;
        file: string;
        isDeleted: boolean;
        addedDate: Date;
        sentDate: Date;
        modifiedDate: Date;
        addedById: number;
        modifiedById: number;
        clientId: number;
        type: number;
        hasSupervisionCharge: boolean;
        quotationId: number;
        balance: number;
        subTotal: number;
        xeroReference: string;
        invoiceNumber: string;
        expiryDate: Date;
        issueDate: Date;
        xeroTenantId: string;
    } & {
        Project: Partial<Project>;
    }>;
    handleWebhook(payload: WebhookEventPayload): Promise<void>;
    syncLocalContact(event: WehbookEventType): Promise<{
        id: number;
        uuid: string;
        name: string;
        type: number;
        designation: string;
        phone: string;
        phoneCode: string;
        whatsapp: string;
        email: string;
        address: string;
        companyId: number;
        addedById: number;
        addedDate: Date;
        deletedById: number;
        deletedDate: Date;
        isDeleted: boolean;
        modifiedById: number;
        modifiedDate: Date;
        taxRegistrationNumber: string;
    }>;
    syncLocalInvoice(event: WehbookEventType): Promise<void>;
    checkLoginStatus(): Promise<boolean>;
    syncAllTenantsAccounts(): Promise<void>;
    syncAccounts(tenantId: string): Promise<{
        message: string;
        statusCode: number;
    }>;
    syncAllTenantsProducts(): Promise<void>;
    syncProducts(tenantId: string): Promise<{
        message: string;
        statusCode: number;
    }>;
    syncAllTenantsTaxRates(): Promise<void>;
    syncTaxRates(tenantId: string): Promise<{
        message: string;
        statusCode: number;
    }>;
    syncEachAccount(account: Account, tenantId: string): Promise<{
        id: number;
        accountCode: string;
        xeroReference: string;
        title: string;
        xeroType: string;
        description: string;
        bankAccountNumber: string;
        showInExpenseClaims: boolean;
        xeroTenantId: string;
    }>;
    syncEachTaxRate(taxRate: TaxRate, tenantId: string): Promise<{
        id: number;
        taxType: string;
        title: string;
        rate: number;
        xeroTenantId: string;
    }>;
    syncEachProduct(item: Item): Promise<{
        id: number;
        xeroReference: string;
        productCode: string;
        title: string;
        description: string;
        quantity: number;
        unitPrice: number;
        accountId: number;
        taxRateId: number;
    }>;
}
