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
exports.XeroAccountingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
const xero_node_1 = require("xero-node");
const redis_service_1 = require("../redis/redis.service");
const crypto = require("crypto");
const common_2 = require("../../helpers/common");
const constants_1 = require("../../config/constants");
const notification_dto_1 = require("../notification/dto/notification.dto");
const event_emitter_1 = require("@nestjs/event-emitter");
const quotation_dto_1 = require("../quotation/dto/quotation.dto");
const invoice_dto_1 = require("../invoice/dto/invoice.dto");
const file_management_1 = require("../../helpers/file-management");
const BluebirdPromise = require("bluebird");
const organization_dto_1 = require("../organization/dto/organization.dto");
const leads_dto_1 = require("../leads/dto/leads.dto");
let XeroAccountingService = class XeroAccountingService {
    constructor(prisma, redisService, eventEmitter) {
        this.prisma = prisma;
        this.redisService = redisService;
        this.eventEmitter = eventEmitter;
        this.logger = new common_1.Logger(this.constructor.name);
        this.client_id = (process.env.ENVIRONMENT === "production") ? process.env.XERO_CLIENT_ID_LIVE : process.env.XERO_CLIENT_ID;
        this.client_secret = (process.env.ENVIRONMENT === "production") ? process.env.XERO_CLIENT_SECRET_LIVE : process.env.XERO_CLIENT_SECRET;
        this.redirectUrl = (process.env.ENVIRONMENT === "production") ? process.env.XERO_REDIRECT_URL_LIVE : process.env.XERO_REDIRECT_URL;
        this.XERO_WEBHOOK_KEY = (process.env.ENVIRONMENT === "production") ? process.env.XERO_WEBHOOK_KEY_LIVE : process.env.XERO_WEBHOOK_KEY;
        this.scopes = "offline_access openid profile email accounting.transactions accounting.settings accounting.settings.read accounting.contacts accounting.contacts.read accounting.attachments accounting.attachments.read files files.read assets assets.read projects projects.read";
        this.allProcessed = [];
        const xero = new xero_node_1.XeroClient({
            clientId: this.client_id,
            clientSecret: this.client_secret,
            redirectUris: [this.redirectUrl],
            scopes: this.scopes.split(" "),
            httpTimeout: 15000,
        });
        this.xero = xero;
    }
    async saveRefreshToken(refreshToken) {
        await this.redisService.set(`refreshToken`, refreshToken);
    }
    getDefaultTenantId() {
        let tenants = this.xero.tenants;
        let tenantId = null;
        if (tenants && tenants.length > 0) {
            tenantId = tenants[0].tenantId;
        }
        return tenantId;
    }
    async deleteRefreshToken() {
        await this.redisService.del(`refreshToken`);
    }
    async getRefreshToken() {
        return await this.redisService.get(`refreshToken`);
    }
    async logoutFromXero() {
        await this.deleteRefreshToken();
        this.accessToken = null;
        return true;
    }
    async getTanants() {
        let valid = await this.validateAccessToken();
        if (!valid) {
            this.logger.log("Invalid Access Token");
            return;
        }
        return this.xero.tenants;
    }
    async validateAccessToken() {
        var _a, _b;
        if (!this.accessToken) {
            return await this.refreshXeroToken();
        }
        else {
            try {
                let tenants = this.xero.tenants;
                let tenantId = null;
                if (tenants && tenants.length > 0) {
                    tenantId = tenants[0].tenantId;
                }
                await this.xero.accountingApi.getBrandingThemes(tenantId);
                return true;
            }
            catch (err) {
                if ((err === null || err === void 0 ? void 0 : err.statusCode) === 401 || ((_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.statusCode) === 401) {
                    return await this.refreshXeroToken();
                }
                const error = JSON.stringify((_b = err.response) === null || _b === void 0 ? void 0 : _b.body, null, 2);
                console.log(`Status Code: ${err.response.statusCode} => ${error}`);
                return false;
            }
        }
    }
    async refreshXeroToken() {
        let refreshToken = await this.getRefreshToken();
        if (refreshToken) {
            const newTokenSet = await this.xero.refreshWithRefreshToken(this.client_id, this.client_secret, refreshToken);
            this.saveRefreshToken(newTokenSet.refresh_token);
            this.accessToken = newTokenSet.access_token;
            await this.xero.updateTenants();
            return true;
        }
        else {
            return false;
        }
    }
    async getAccessToken() {
        const consentUrl = await this.xero.buildConsentUrl();
        return consentUrl;
    }
    validateWebhook(webhookKey, webhookData) {
        let computedSignature = crypto.createHmac('sha256', this.XERO_WEBHOOK_KEY).update(webhookData.toString()).digest('base64');
        return computedSignature === webhookKey;
    }
    async authenticate(url) {
        if (!url) {
            throw {
                message: "No Callback url provided",
                statusCode: 400
            };
        }
        const tokenSet = await this.xero.apiCallback(url);
        if (tokenSet) {
            this.saveRefreshToken(tokenSet.refresh_token);
            this.accessToken = tokenSet.access_token;
            await this.xero.updateTenants();
            return "Authentication successful";
        }
        else {
            return "Something went wrong";
        }
    }
    resetProcessedData(resourceId, type) {
        setTimeout(() => {
            this.allProcessed = this.allProcessed.filter((processedItems) => processedItems.resourceId !== resourceId && processedItems.type !== type);
        }, 8000);
    }
    async updateInvoiceStatus(invoice) {
        var _a, _b, _c;
        this.logger.log(`Updating Invoice Status in XERO, QuotationId: ${invoice === null || invoice === void 0 ? void 0 : invoice.id}`);
        let recordData = await this.prisma.invoice.findUniqueOrThrow({
            where: { id: invoice.id },
            include: {
                QuotationMilestone: true,
                Project: {
                    select: {
                        Lead: {
                            select: leads_dto_1.LeadsDefaultAttributes
                        },
                        SubmissionBy: {
                            select: organization_dto_1.OrganizationDefaultAttributes
                        }
                    }
                }
            }
        });
        let XERO__TENANT__ID = (recordData.xeroTenantId) ? recordData.xeroTenantId : (_b = (_a = recordData === null || recordData === void 0 ? void 0 : recordData.Project) === null || _a === void 0 ? void 0 : _a.Lead) === null || _b === void 0 ? void 0 : _b.xeroTenantId;
        if (!XERO__TENANT__ID) {
            return;
        }
        if (!recordData.xeroReference) {
            return this.upsertInvoice(recordData);
        }
        let clientData = await this.prisma.client.findFirst({
            where: {
                id: recordData.clientId
            },
            include: {
                ClientXeroConnection: {
                    where: {
                        xeroTenantId: XERO__TENANT__ID
                    }
                }
            }
        });
        let contactRef = (clientData.ClientXeroConnection && clientData.ClientXeroConnection.length > 0) ? clientData.ClientXeroConnection[0].xeroReference : undefined;
        if (!contactRef) {
            let newContact = await this.upsertContact(clientData, XERO__TENANT__ID);
            if (!newContact && !((_c = newContact.body) === null || _c === void 0 ? void 0 : _c.contacts)) {
                this.logger.error("Couldnot create contact in XERO");
                throw {
                    message: "Couldnot create contact",
                    statusCode: 400
                };
            }
            else {
                contactRef = newContact.body.contacts[0].contactID;
            }
        }
        let valid = await this.validateAccessToken();
        if (!valid) {
            this.logger.log("Invalid Access Token");
            return;
        }
        const eachInvoice = {
            invoiceID: recordData.xeroReference,
            invoiceNumber: recordData.invoiceNumber,
            status: this.matchLocalInvoiceStatusToXero(invoice.status),
            date: (0, common_2.convertDate)(new Date()),
            contact: {
                contactID: contactRef
            }
        };
        const invoiceAllData = {
            invoices: [eachInvoice]
        };
        try {
            await this.xero.accountingApi.updateInvoice(XERO__TENANT__ID, recordData.xeroReference, invoiceAllData);
        }
        catch (err) {
            const error = JSON.stringify(err.response.body, null, 2);
            console.log(`Status Code: ${err.response.statusCode} => ${error}`);
        }
    }
    async updateQuotationStatus(quotation) {
        var _a, _b, _c, _d;
        this.logger.log(`Updating Quote Status in XERO, QuotationId: ${quotation === null || quotation === void 0 ? void 0 : quotation.id}`);
        let recordData = await this.prisma.quotation.findUniqueOrThrow({
            where: { id: quotation.id },
            include: {
                Lead: {
                    include: {
                        SubmissionBy: {
                            select: organization_dto_1.OrganizationDefaultAttributes
                        },
                        ProjectType: {
                            select: {
                                id: true,
                                title: true,
                            }
                        }
                    }
                },
                QuotationMilestone: true,
                Project: {
                    select: {
                        id: true,
                        referenceNumber: true,
                        title: true
                    }
                }
            }
        });
        let XERO__TENANT__ID = (recordData.xeroTenantId) ? recordData.xeroTenantId : (_a = recordData === null || recordData === void 0 ? void 0 : recordData.Lead) === null || _a === void 0 ? void 0 : _a.xeroTenantId;
        if (!XERO__TENANT__ID) {
            return;
        }
        if (!recordData.xeroReference) {
            return this.upsertQuotation(recordData);
        }
        let clientData = await this.prisma.client.findFirst({
            where: {
                id: recordData.Lead.clientId
            },
            include: {
                ClientXeroConnection: {
                    where: {
                        xeroTenantId: XERO__TENANT__ID
                    }
                }
            }
        });
        let contactRef = (clientData.ClientXeroConnection && clientData.ClientXeroConnection.length > 0) ? clientData.ClientXeroConnection[0].xeroReference : undefined;
        if (!contactRef) {
            let newContact = await this.upsertContact(clientData, XERO__TENANT__ID);
            if (!newContact && !((_b = newContact.body) === null || _b === void 0 ? void 0 : _b.contacts)) {
                this.logger.error("Couldnot create contact in XERO");
                throw {
                    message: "Couldnot create contact",
                    statusCode: 400
                };
            }
            else {
                contactRef = newContact.body.contacts[0].contactID;
            }
        }
        let valid = await this.validateAccessToken();
        if (!valid) {
            this.logger.log("Invalid Access Token");
            return;
        }
        const quote = {
            quoteID: recordData.xeroReference,
            quoteNumber: recordData.quoteNumber,
            status: this.matchLocalQuoteStatusToXero(quotation.status),
            title: ((_c = recordData.Lead) === null || _c === void 0 ? void 0 : _c.ProjectType) ? (_d = recordData.Lead) === null || _d === void 0 ? void 0 : _d.ProjectType.title : undefined,
            summary: recordData.Project ? recordData.Project.title : undefined,
            date: (0, common_2.convertDate)(new Date()),
            contact: {
                contactID: contactRef
            }
        };
        const quotes = {
            quotes: [quote]
        };
        try {
            await this.xero.accountingApi.updateQuote(XERO__TENANT__ID, recordData.xeroReference, quotes);
        }
        catch (err) {
            const error = JSON.stringify(err.response.body, null, 2);
            console.log(`Status Code: ${err.response.statusCode} => ${error}`);
        }
    }
    async upsertProject(project) {
        var _a, _b, _c;
        this.logger.log(`Upsert Project to XERO, ProjectID: ${project === null || project === void 0 ? void 0 : project.id}`);
        let valid = await this.validateAccessToken();
        if (!valid) {
            this.logger.log("Invalid Access Token");
            return;
        }
        let recordData = await this.prisma.project.findUniqueOrThrow({
            where: {
                id: project.id
            },
            include: {
                Lead: {
                    select: leads_dto_1.LeadsDefaultAttributes
                },
                SubmissionBy: {
                    select: organization_dto_1.OrganizationDefaultAttributes
                },
                Quotation: {
                    where: {
                        status: constants_1.QuotationStatus.confirmed
                    }
                }
            }
        });
        let XERO__TENANT__ID = (recordData.xeroTenantId) ? recordData.xeroTenantId : (_a = recordData === null || recordData === void 0 ? void 0 : recordData.Lead) === null || _a === void 0 ? void 0 : _a.xeroTenantId;
        if (!XERO__TENANT__ID) {
            return;
        }
        let contactData = await this.prisma.client.findFirst({
            where: {
                id: recordData.clientId
            },
            include: {
                ClientXeroConnection: {
                    where: {
                        xeroTenantId: XERO__TENANT__ID
                    }
                }
            }
        });
        let contactRef = ((contactData === null || contactData === void 0 ? void 0 : contactData.ClientXeroConnection) && (contactData === null || contactData === void 0 ? void 0 : contactData.ClientXeroConnection.length) > 0) ? contactData === null || contactData === void 0 ? void 0 : contactData.ClientXeroConnection[0].xeroReference : undefined;
        if (!contactRef) {
            let newContact = await this.upsertContact(contactData, XERO__TENANT__ID);
            if (!newContact && !((_b = newContact.body) === null || _b === void 0 ? void 0 : _b.contacts)) {
                this.logger.error("Couldnot create contact in XERO");
                throw {
                    message: "Couldnot create contact",
                    statusCode: 400
                };
            }
            else {
                contactRef = (_c = newContact.body.contacts[0]) === null || _c === void 0 ? void 0 : _c.contactID;
            }
        }
        let projectData = {
            contactId: contactRef,
            name: recordData.referenceNumber + " | " + recordData.title,
            deadlineUtc: recordData.endDate,
            estimateAmount: recordData.projectEstimate
        };
        try {
            if (recordData.xeroReference) {
                await this.xero.projectApi.updateProject(XERO__TENANT__ID, recordData.xeroReference, projectData);
            }
            else {
                const response = await this.xero.projectApi.createProject(XERO__TENANT__ID, projectData);
                if (response && response.body) {
                    await this.prisma.project.update({
                        where: {
                            id: recordData.id
                        },
                        data: {
                            xeroReference: response.body.projectId,
                            xeroTenantId: XERO__TENANT__ID
                        }
                    });
                }
            }
        }
        catch (err) {
            const error = JSON.stringify(err.response.body, null, 2);
            this.logger.log(`Some error while creting project in XERO, Status Code: ${err.response.statusCode} => ${error}`);
        }
    }
    async upsertQuotation(quotation) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        this.logger.log(`Upsert Quotation to XERO, QuotationID: ${quotation === null || quotation === void 0 ? void 0 : quotation.id}`);
        let valid = await this.validateAccessToken();
        if (!valid) {
            this.logger.log("Invalid Access Token");
            return;
        }
        let XERO__TENANT__ID = (quotation.xeroTenantId) ? quotation.xeroTenantId : (_a = quotation === null || quotation === void 0 ? void 0 : quotation.Lead) === null || _a === void 0 ? void 0 : _a.xeroTenantId;
        if (!XERO__TENANT__ID) {
            return;
        }
        this.logger.log("Updating Quotation to XERO");
        let existingXeroQuotation;
        if (quotation.xeroReference) {
            try {
                let response = await this.xero.accountingApi.getQuote(XERO__TENANT__ID, quotation.xeroReference);
                if (((_b = response.body) === null || _b === void 0 ? void 0 : _b.quotes) && response.body.quotes.length > 0) {
                    existingXeroQuotation = response.body.quotes[0];
                }
            }
            catch (err) {
                const error = JSON.stringify(err.response.body, null, 2);
                this.logger.log(`Some error while creting project in XERO, Status Code: ${err.response.statusCode} => ${error}`);
            }
        }
        let recordData = await this.prisma.quotation.findUniqueOrThrow({
            where: { id: quotation.id },
            include: {
                Lead: {
                    include: {
                        Client: {
                            include: {
                                ClientXeroConnection: {
                                    where: {
                                        xeroTenantId: XERO__TENANT__ID
                                    }
                                }
                            }
                        },
                        ProjectType: true,
                    }
                },
                QuotationMilestone: {
                    include: {
                        Account: {
                            select: {
                                xeroReference: true,
                                id: true,
                                accountCode: true,
                                title: true
                            }
                        },
                        TaxRate: {
                            select: {
                                id: true,
                                taxType: true,
                                title: true
                            }
                        },
                        Product: {
                            select: {
                                xeroReference: true,
                                id: true,
                                title: true,
                                productCode: true
                            }
                        }
                    },
                    orderBy: {
                        id: 'asc'
                    }
                },
                Project: {
                    select: {
                        title: true,
                        id: true,
                        referenceNumber: true
                    }
                }
            }
        });
        const dateValue = (quotation.issueDate) ? quotation.issueDate : quotation.addedDate;
        const expiryDate = quotation.expiryDate;
        let contactRef = (((_c = recordData === null || recordData === void 0 ? void 0 : recordData.Lead) === null || _c === void 0 ? void 0 : _c.Client.ClientXeroConnection) && ((_d = recordData === null || recordData === void 0 ? void 0 : recordData.Lead) === null || _d === void 0 ? void 0 : _d.Client.ClientXeroConnection.length) > 0) ? (_e = recordData === null || recordData === void 0 ? void 0 : recordData.Lead) === null || _e === void 0 ? void 0 : _e.Client.ClientXeroConnection[0].xeroReference : undefined;
        let contactXeroTenantId = (((_f = recordData === null || recordData === void 0 ? void 0 : recordData.Lead) === null || _f === void 0 ? void 0 : _f.Client.ClientXeroConnection) && ((_g = recordData === null || recordData === void 0 ? void 0 : recordData.Lead) === null || _g === void 0 ? void 0 : _g.Client.ClientXeroConnection.length) > 0) ? (_h = recordData === null || recordData === void 0 ? void 0 : recordData.Lead) === null || _h === void 0 ? void 0 : _h.Client.ClientXeroConnection[0].xeroTenantId : undefined;
        ;
        if (!contactRef || contactXeroTenantId !== XERO__TENANT__ID) {
            let newContact = await this.upsertContact(recordData.Lead.Client, XERO__TENANT__ID);
            if (!newContact && !((_j = newContact.body) === null || _j === void 0 ? void 0 : _j.contacts)) {
                this.logger.error("Couldnot create contact in XERO");
                throw {
                    message: "Couldnot create contact",
                    statusCode: 400
                };
            }
            else {
                contactRef = newContact.body.contacts[0].contactID;
            }
        }
        const contact = {
            contactID: contactRef
        };
        const lineItems = [];
        let taxTypes = [];
        recordData.QuotationMilestone.forEach((ele) => {
            if (ele.TaxRate) {
                taxTypes.push(ele.TaxRate.title);
            }
        });
        let allTaxRateData = await this.prisma.taxRate.findMany({
            where: {
                title: {
                    in: taxTypes,
                    mode: 'insensitive'
                },
                xeroTenantId: XERO__TENANT__ID
            }
        });
        recordData.QuotationMilestone.forEach((ele) => {
            var _a;
            let lineTaxType = null;
            if (ele.TaxRate && ((_a = ele.TaxRate) === null || _a === void 0 ? void 0 : _a.title)) {
                let t = allTaxRateData.find((dt) => { var _a, _b, _c; return ((_a = dt.title) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === ((_c = (_b = ele.TaxRate) === null || _b === void 0 ? void 0 : _b.title) === null || _c === void 0 ? void 0 : _c.toLowerCase()); });
                if (t)
                    lineTaxType = t.taxType;
            }
            const lineItem = {
                lineItemID: ele.xeroReference,
                description: ele.title,
                quantity: ele.quantity,
                unitAmount: ele.amount,
                taxAmount: ele.taxAmount,
                taxType: (lineTaxType) ? lineTaxType : undefined,
                accountCode: (ele.Account) ? ele.Account.accountCode : undefined,
                accountID: (ele.Account) ? ele.Account.xeroReference : undefined,
                lineAmount: (ele.quantity * ele.amount)
            };
            lineItems.push(lineItem);
        });
        let xeroReference = recordData.xeroReference;
        if (xeroReference) {
            try {
                let quoteData = await this.xero.accountingApi.getQuote(XERO__TENANT__ID, xeroReference);
                if (!quoteData && !((_k = quoteData.body) === null || _k === void 0 ? void 0 : _k.quotes)) {
                    xeroReference = null;
                }
                else {
                    let __quote = (_l = quoteData.body) === null || _l === void 0 ? void 0 : _l.quotes[0];
                    if (__quote.status === xero_node_1.QuoteStatusCodes.DELETED) {
                        xeroReference = null;
                    }
                }
            }
            catch (err) {
                this.logger.error("Some error while fetching quote from XERO");
            }
        }
        let newStatus = this.matchLocalQuoteStatusToXero(recordData.status);
        if (existingXeroQuotation && (existingXeroQuotation === null || existingXeroQuotation === void 0 ? void 0 : existingXeroQuotation.status) === newStatus) {
            newStatus = null;
        }
        const quote = {
            contact: contact,
            date: (0, common_2.convertDate)(dateValue, 'yy-mm-dd'),
            expiryDate: (0, common_2.convertDate)(expiryDate, 'yy-mm-dd'),
            lineItems: lineItems,
            quoteNumber: recordData.quoteNumber,
            status: (newStatus) ? newStatus : undefined,
            terms: recordData.paymentTerms,
            title: ((_m = recordData.Lead) === null || _m === void 0 ? void 0 : _m.ProjectType) ? (_p = (_o = recordData.Lead) === null || _o === void 0 ? void 0 : _o.ProjectType) === null || _p === void 0 ? void 0 : _p.title : undefined,
            summary: recordData.scopeOfWork ? recordData.scopeOfWork : undefined,
            currencyCode: xero_node_1.CurrencyCode.AED,
            quoteID: (xeroReference) ? xeroReference : undefined,
            subTotal: recordData.subTotal,
            total: recordData.total,
            totalTax: recordData.vatAmount
        };
        const quotes = {
            quotes: [quote]
        };
        this.logger.log("Upsert Quotation in XERO");
        const response = await this.xero.accountingApi.updateOrCreateQuotes(XERO__TENANT__ID, quotes);
        if (response.body && response.body.quotes && response.body.quotes.length > 0) {
            let xeroQuote = response.body.quotes[0];
            this.allProcessed.push({
                resourceId: xeroQuote.quoteID,
                type: 'QUOTATION'
            });
            this.resetProcessedData(xeroQuote.quoteID, 'QUOTATION');
            if (!recordData.xeroReference) {
                await this.prisma.quotation.update({
                    where: {
                        id: recordData.id
                    },
                    data: {
                        xeroReference: xeroQuote.quoteID,
                        xeroTenantId: XERO__TENANT__ID
                    }
                });
            }
            let allPromises = [];
            recordData.QuotationMilestone.forEach((ele) => {
                if (!ele.xeroReference) {
                    let lineItem = xeroQuote.lineItems.find((itemData) => itemData.description === ele.title);
                    if (lineItem) {
                        allPromises.push(this.prisma.quotationMilestone.update({ where: { id: ele.id }, data: { xeroReference: lineItem.lineItemID } }));
                    }
                }
            });
            await Promise.all(allPromises);
        }
        return response;
    }
    async upsertInvoice(invoice) {
        var _a, _b, _c;
        this.logger.log(`Upsert Invoice to XERO, InvoiceID: ${invoice === null || invoice === void 0 ? void 0 : invoice.id}`);
        let valid = await this.validateAccessToken();
        if (!valid) {
            this.logger.log("Invalid Access Token");
            return;
        }
        let XERO__TENANT__ID = (invoice.xeroTenantId) ? invoice.xeroTenantId : (_a = invoice === null || invoice === void 0 ? void 0 : invoice.Project.Lead) === null || _a === void 0 ? void 0 : _a.xeroTenantId;
        if (!XERO__TENANT__ID) {
            return;
        }
        let existingXeroInvoice;
        if (invoice.xeroReference) {
            try {
                let response = await this.xero.accountingApi.getInvoice(XERO__TENANT__ID, invoice.xeroReference);
                if (((_b = response.body) === null || _b === void 0 ? void 0 : _b.invoices) && response.body.invoices.length > 0) {
                    existingXeroInvoice = response.body.invoices[0];
                }
            }
            catch (err) {
                const error = JSON.stringify(err.response.body, null, 2);
                this.logger.log(`Some error while creting project in XERO, Status Code: ${err.response.statusCode} => ${error}`);
            }
        }
        let recordData = await this.prisma.invoice.findUniqueOrThrow({
            where: { id: invoice.id },
            include: {
                Client: {
                    include: {
                        ClientXeroConnection: {
                            where: {
                                xeroTenantId: XERO__TENANT__ID
                            }
                        }
                    }
                },
                InvoiceItems: {
                    include: {
                        Account: {
                            select: {
                                xeroReference: true,
                                id: true,
                                accountCode: true,
                                title: true
                            }
                        },
                        TaxRate: {
                            select: {
                                id: true,
                                taxType: true,
                                title: true
                            }
                        },
                        Product: {
                            select: {
                                xeroReference: true,
                                id: true,
                                title: true,
                                productCode: true
                            }
                        }
                    }
                },
                Quotation: true
            }
        });
        const dateValue = (invoice.issueDate) ? invoice.issueDate : invoice.addedDate;
        const dueDateValue = invoice.expiryDate ? invoice.expiryDate : (0, common_2.addDaysToDate)(invoice.addedDate, 30);
        let contactRef = ((recordData === null || recordData === void 0 ? void 0 : recordData.Client.ClientXeroConnection) && (recordData === null || recordData === void 0 ? void 0 : recordData.Client.ClientXeroConnection.length) > 0) ? recordData === null || recordData === void 0 ? void 0 : recordData.Client.ClientXeroConnection[0].xeroReference : undefined;
        let contactXeroTenantId = ((recordData === null || recordData === void 0 ? void 0 : recordData.Client.ClientXeroConnection) && (recordData === null || recordData === void 0 ? void 0 : recordData.Client.ClientXeroConnection.length) > 0) ? recordData === null || recordData === void 0 ? void 0 : recordData.Client.ClientXeroConnection[0].xeroTenantId : undefined;
        ;
        if (!contactRef || contactXeroTenantId !== XERO__TENANT__ID) {
            let newContact = await this.upsertContact(recordData.Client, XERO__TENANT__ID);
            if (!newContact && !((_c = newContact.body) === null || _c === void 0 ? void 0 : _c.contacts)) {
                this.logger.error("Couldnot create contact in XERO");
                throw {
                    message: "Couldnot create contact",
                    statusCode: 400
                };
            }
            else {
                contactRef = newContact.body.contacts[0].contactID;
            }
        }
        const contact = {
            contactID: contactRef
        };
        const lineItems = [];
        let taxTypes = [];
        recordData.InvoiceItems.forEach((ele) => {
            if (ele.TaxRate) {
                taxTypes.push(ele.TaxRate.title);
            }
        });
        let allTaxRateData = await this.prisma.taxRate.findMany({
            where: {
                title: {
                    in: taxTypes,
                    mode: 'insensitive'
                },
                xeroTenantId: XERO__TENANT__ID
            }
        });
        recordData.InvoiceItems.forEach((ele) => {
            var _a;
            let lineTaxType = null;
            if (ele.TaxRate && ((_a = ele.TaxRate) === null || _a === void 0 ? void 0 : _a.title)) {
                let t = allTaxRateData.find((dt) => { var _a, _b, _c; return ((_a = dt.title) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === ((_c = (_b = ele.TaxRate) === null || _b === void 0 ? void 0 : _b.title) === null || _c === void 0 ? void 0 : _c.toLowerCase()); });
                if (t)
                    lineTaxType = t.taxType;
            }
            const lineItem = {
                lineItemID: ele.xeroReference,
                description: ele.title,
                quantity: ele.quantity,
                unitAmount: ele.amount,
                lineAmount: (ele.quantity * ele.amount),
                taxAmount: ele.taxAmount,
                taxType: lineTaxType ? lineTaxType : undefined,
                accountCode: (ele.Account) ? ele.Account.accountCode : undefined,
                accountID: (ele.Account) ? ele.Account.xeroReference : undefined,
            };
            lineItems.push(lineItem);
        });
        let newStatus = this.matchLocalInvoiceStatusToXero(recordData.status);
        if (existingXeroInvoice && existingXeroInvoice.status === newStatus) {
            newStatus = null;
        }
        const invoiceData = {
            type: xero_node_1.Invoice.TypeEnum.ACCREC,
            contact: contact,
            date: (0, common_2.convertDate)(dateValue, 'yy-mm-dd'),
            dueDate: (0, common_2.convertDate)(dueDateValue, 'yy-mm-dd'),
            lineItems: lineItems,
            currencyCode: xero_node_1.CurrencyCode.AED,
            invoiceNumber: recordData.invoiceNumber,
            reference: recordData.Quotation.quoteNumber,
            status: (newStatus) ? newStatus : undefined,
            invoiceID: (recordData.xeroReference) ? recordData.xeroReference : undefined,
            subTotal: recordData.subTotal,
            total: recordData.total,
            totalTax: recordData.vatAmount
        };
        const invoices = {
            invoices: [invoiceData]
        };
        this.logger.log("Upsert Invoice in XERO");
        const response = await this.xero.accountingApi.updateOrCreateInvoices(XERO__TENANT__ID, invoices);
        if (response.body && response.body.invoices && response.body.invoices.length > 0) {
            let xeroInvoice = response.body.invoices[0];
            this.allProcessed.push({
                resourceId: xeroInvoice.invoiceID,
                type: 'INVOICE'
            });
            this.resetProcessedData(xeroInvoice.invoiceID, 'INVOICE');
            if (!recordData.xeroReference) {
                await this.prisma.invoice.update({
                    where: {
                        id: recordData.id
                    },
                    data: {
                        xeroReference: xeroInvoice.invoiceID,
                        xeroTenantId: XERO__TENANT__ID
                    }
                });
            }
            let allPromises = [];
            recordData.InvoiceItems.forEach((ele) => {
                if (!ele.xeroReference) {
                    let lineItem = xeroInvoice.lineItems.find((itemData) => itemData.description === ele.title);
                    if (lineItem) {
                        allPromises.push(this.prisma.invoiceItem.update({ where: { id: ele.id }, data: { xeroReference: lineItem.lineItemID } }));
                    }
                }
            });
            await Promise.all(allPromises);
        }
        return response;
    }
    matchLocalQuoteStatusToXero(status) {
        switch (status) {
            case constants_1.QuotationStatus.rejected: return xero_node_1.QuoteStatusCodes.DECLINED;
            case constants_1.QuotationStatus.created: return xero_node_1.QuoteStatusCodes.DRAFT;
            case constants_1.QuotationStatus.confirmed: return xero_node_1.QuoteStatusCodes.ACCEPTED;
            case constants_1.QuotationStatus.submitted: return xero_node_1.QuoteStatusCodes.SENT;
            case constants_1.QuotationStatus.revised: return xero_node_1.QuoteStatusCodes.DECLINED;
            case constants_1.QuotationStatus.invoiced: return xero_node_1.QuoteStatusCodes.INVOICED;
            default: return xero_node_1.QuoteStatusCodes.DRAFT;
        }
    }
    matchXeroQuoteStatusToLocalQuoteStatus(status) {
        switch (status) {
            case xero_node_1.QuoteStatusCodes.DECLINED: return constants_1.QuotationStatus.rejected;
            case xero_node_1.QuoteStatusCodes.DRAFT: return constants_1.QuotationStatus.created;
            case xero_node_1.QuoteStatusCodes.ACCEPTED: return constants_1.QuotationStatus.confirmed;
            case xero_node_1.QuoteStatusCodes.SENT: return constants_1.QuotationStatus.submitted;
            case xero_node_1.QuoteStatusCodes.DECLINED: return constants_1.QuotationStatus.revised;
            case xero_node_1.QuoteStatusCodes.INVOICED: return constants_1.QuotationStatus.invoiced;
            default: return constants_1.QuotationStatus.created;
        }
    }
    matchLocalInvoiceStatusToXero(status) {
        switch (status) {
            case constants_1.InvoiceStatus.canceled: return xero_node_1.Invoice.StatusEnum.VOIDED;
            case constants_1.InvoiceStatus.generated: return xero_node_1.Invoice.StatusEnum.DRAFT;
            case constants_1.InvoiceStatus.sent: return xero_node_1.Invoice.StatusEnum.SUBMITTED;
            case constants_1.InvoiceStatus.paid: return xero_node_1.Invoice.StatusEnum.AUTHORISED;
            default: return xero_node_1.Invoice.StatusEnum.DRAFT;
        }
    }
    matchXeroInvoiceStatusToLocalInvoiceStatus(status) {
        switch (status) {
            case xero_node_1.Invoice.StatusEnum.VOIDED: return constants_1.InvoiceStatus.canceled;
            case xero_node_1.Invoice.StatusEnum.DRAFT: return constants_1.InvoiceStatus.generated;
            case xero_node_1.Invoice.StatusEnum.SUBMITTED: return constants_1.InvoiceStatus.sent;
            case xero_node_1.Invoice.StatusEnum.AUTHORISED: return constants_1.InvoiceStatus.sent;
            case xero_node_1.Invoice.StatusEnum.PAID: return constants_1.InvoiceStatus.paid;
            case xero_node_1.Invoice.StatusEnum.DELETED: return constants_1.InvoiceStatus.canceled;
            default: return constants_1.InvoiceStatus.generated;
        }
    }
    async upsertContact(client, xeroTenantId) {
        var _a, _b, _c;
        this.logger.log(`Upsert Client to XERO Contact, ClientID: ${client === null || client === void 0 ? void 0 : client.id}`);
        let valid = await this.validateAccessToken();
        if (!valid) {
            this.logger.log("Invalid Access Token");
            return;
        }
        let XERO__TENANT__ID = xeroTenantId ? xeroTenantId : null;
        if (!XERO__TENANT__ID) {
            return;
        }
        let clientReference = null;
        let existingReference = null;
        let xeroAllReference = await this.prisma.clientXeroConnection.findFirst({
            where: {
                xeroTenantId: XERO__TENANT__ID,
                clientId: client.id
            }
        });
        if (xeroAllReference) {
            clientReference = xeroAllReference.xeroReference;
            existingReference = xeroAllReference.xeroReference;
        }
        const phones = [];
        if (client.phone) {
            const phone = {
                phoneNumber: client.phone,
                phoneCountryCode: client.phoneCode,
                phoneType: xero_node_1.Phone.PhoneTypeEnum.MOBILE
            };
            phones.push(phone);
        }
        if (!clientReference && client.email) {
            try {
                let response = await this.xero.accountingApi.getContacts(XERO__TENANT__ID, null, `emailAddress="${client.email}"`);
                if (response.body && response.body.contacts && response.body.contacts.length > 0) {
                    clientReference = response.body.contacts[0].contactID;
                }
            }
            catch (err) {
                this.logger.error("Some error while finding contact", err.message);
            }
        }
        const contact = {
            name: client.name,
            emailAddress: client.email,
            contactID: (clientReference) ? clientReference : undefined,
            phones: phones,
            contactStatus: (client.isDeleted) ? xero_node_1.Contact.ContactStatusEnum.ARCHIVED : xero_node_1.Contact.ContactStatusEnum.ACTIVE
        };
        const contacts = {
            contacts: [contact]
        };
        let xeroNewClient = await this.xero.accountingApi.updateOrCreateContacts(XERO__TENANT__ID, contacts);
        if (xeroNewClient && ((_b = (_a = xeroNewClient.body) === null || _a === void 0 ? void 0 : _a.contacts) === null || _b === void 0 ? void 0 : _b.length) > 0) {
            let xeroContactData = (_c = xeroNewClient.body) === null || _c === void 0 ? void 0 : _c.contacts[0];
            if (xeroContactData) {
                this.allProcessed.push({
                    resourceId: xeroContactData.contactID,
                    type: 'CONTACT'
                });
                if (existingReference !== xeroContactData.contactID) {
                    await this.prisma.clientXeroConnection.upsert({
                        where: {
                            xeroTenantId_clientId_xeroReference: {
                                xeroTenantId: XERO__TENANT__ID,
                                xeroReference: xeroContactData.contactID,
                                clientId: client.id
                            }
                        },
                        create: {
                            xeroTenantId: XERO__TENANT__ID,
                            xeroReference: xeroContactData.contactID,
                            clientId: client.id
                        },
                        update: {}
                    });
                }
                this.resetProcessedData(xeroContactData.contactID, 'CONTACT');
            }
        }
        return xeroNewClient;
    }
    async getBrandingThemes() {
        let valid = await this.validateAccessToken();
        if (!valid) {
            this.logger.log("Invalid Access Token");
            return;
        }
        let tenantId = this.getDefaultTenantId();
        return this.xero.accountingApi.getBrandingThemes(tenantId);
    }
    async getQuotes(filters = {}) {
        await this.validateAccessToken();
        return this.xero.accountingApi.getQuotes(filters.tenantId, null, null, null, null, null, null, null, null, null, filters.quoteNumber);
    }
    async prepareQuotationFromXeroQuote(quotes, filters) {
        var _a, _b, _c, _d, _e, _f, _g;
        this.logger.log(`Preparing Quotation From Xero Quote ${filters.quoteNumber}`);
        let valid = await this.validateAccessToken();
        if (!valid) {
            this.logger.log("Invalid Access Token");
            return;
        }
        this.logger.log("Syncing Quotation Data From Xero");
        let quotationData;
        let activeRecord = quotes.find((ele) => ele.status !== xero_node_1.QuoteStatusCodes.DELETED);
        if (!activeRecord) {
            throw {
                message: "Couldnot find Invoice from XERO",
                statusCode: 404
            };
        }
        let existingQuotation = await this.prisma.quotation.findFirst({
            where: {
                quoteNumber: filters.quoteNumber,
                isDeleted: false
            },
            include: {
                Lead: true,
                QuotationMilestone: true
            },
            orderBy: {
                id: 'desc'
            }
        });
        if (existingQuotation) {
            if (existingQuotation.xeroReference && existingQuotation.xeroReference !== activeRecord.quoteID) {
                if (filters.force !== true) {
                    throw {
                        message: "This quotation already exists in the system and has a different XERO reference. This may lead to data corruption if done forcefully",
                        statusCode: 400,
                        data: {
                            isDuplicate: true
                        }
                    };
                }
            }
        }
        let clientData = await this.prisma.client.findFirst({
            where: {
                OR: [
                    {
                        ClientXeroConnection: {
                            some: {
                                xeroReference: activeRecord.contact.contactID,
                                xeroTenantId: filters.tenantId
                            }
                        }
                    }
                ]
            }
        });
        if (!clientData) {
            clientData = await this.syncLocalContact({ resourceId: activeRecord.contact.contactID, eventCategory: 'CONTACT', eventType: 'UPDATE', tenantId: filters.tenantId });
        }
        let leadData = existingQuotation === null || existingQuotation === void 0 ? void 0 : existingQuotation.Lead;
        if (!leadData) {
            leadData = await this.prisma.leads.create({
                data: {
                    clientId: clientData.id,
                    message: "Auto Created from XERO Application",
                    xeroTenantId: filters.tenantId
                }
            });
        }
        let quoteFile = null;
        try {
            let quoteAttatchment = await this.xero.accountingApi.getQuoteAsPdf(filters.tenantId, activeRecord.quoteID, {
                headers: {
                    "Accept": "application/pdf"
                }
            });
            if (quoteAttatchment.body) {
                let filename = "Quotation-" + (0, common_2.slugify)(clientData.name) + "-" + Date.now() + "__" + (existingQuotation === null || existingQuotation === void 0 ? void 0 : existingQuotation.id) + ".pdf";
                let fileLocation = (0, quotation_dto_1.getDynamicUploadPath)() + "/";
                quoteFile = fileLocation + filename;
                await (0, file_management_1.uploadFromBuffer)(quoteAttatchment.body, quoteFile);
            }
        }
        catch (err) {
            this.logger.error("Some error while getting quote attachment", err.message);
        }
        quotationData = {
            xeroReference: activeRecord.quoteID,
            xeroTenantId: filters.tenantId,
            quoteNumber: activeRecord.quoteNumber,
            leadId: leadData.id,
            status: this.matchXeroQuoteStatusToLocalQuoteStatus(activeRecord.status),
            scopeOfWork: activeRecord.summary,
            paymentTerms: activeRecord.terms,
            addedDate: new Date(),
            expiryDate: (activeRecord.expiryDate) ? new Date(activeRecord.expiryDate) : undefined,
            issueDate: (activeRecord.date) ? new Date(activeRecord.date) : undefined,
            subTotal: activeRecord.subTotal,
            total: activeRecord.total,
            vatAmount: activeRecord.totalTax,
            isDeleted: false,
            type: constants_1.QuotationType.manual,
            file: (quoteFile) ? quoteFile : undefined
        };
        let newQuotationData;
        if (existingQuotation) {
            newQuotationData = await this.prisma.quotation.update({
                where: {
                    id: existingQuotation.id
                },
                data: quotationData
            });
        }
        else {
            newQuotationData = await this.prisma.quotation.upsert({
                where: {
                    xeroReference: activeRecord.quoteID
                },
                create: quotationData,
                update: quotationData
            });
        }
        if (newQuotationData) {
            let exitingQuoteMilestones = (existingQuotation === null || existingQuotation === void 0 ? void 0 : existingQuotation.QuotationMilestone) ? existingQuotation.QuotationMilestone : [];
            let quoteMilestones = [];
            let toDeleteIds = [];
            let allAccounts = [];
            let allTaxRates = [];
            activeRecord.lineItems.forEach((ele) => {
                if (ele.accountCode) {
                    allAccounts.push(ele.accountCode);
                }
                if (ele.taxType) {
                    allTaxRates.push(ele.taxType);
                }
            });
            let accountDt = this.prisma.account.findMany({
                where: {
                    accountCode: {
                        in: allAccounts
                    }
                }
            });
            let taxRatesDt = this.prisma.taxRate.findMany({
                where: {
                    taxType: {
                        in: allTaxRates
                    }
                }
            });
            const [accountData, taxRatesData] = await Promise.all([accountDt, taxRatesDt]);
            for (let i = 0; i < ((_a = activeRecord === null || activeRecord === void 0 ? void 0 : activeRecord.lineItems) === null || _a === void 0 ? void 0 : _a.length); i++) {
                let ele = activeRecord === null || activeRecord === void 0 ? void 0 : activeRecord.lineItems[i];
                let prevMilestone = exitingQuoteMilestones.find((dt) => dt.xeroReference === ele.lineItemID);
                let lineAccount;
                let lineTaxRate;
                if (ele.accountCode && ele.accountID) {
                    lineAccount = accountData.find((dt) => dt.accountCode === ele.accountCode);
                    if (!lineAccount) {
                        try {
                            let xeroAccountData = await this.xero.accountingApi.getAccount(filters.tenantId, ele.accountID);
                            if ((_b = xeroAccountData.body) === null || _b === void 0 ? void 0 : _b.accounts) {
                                lineAccount = await this.syncEachAccount(xeroAccountData.body.accounts[0], filters.tenantId);
                            }
                        }
                        catch (err) {
                            const error = JSON.stringify((_c = err.response) === null || _c === void 0 ? void 0 : _c.body, null, 2);
                            this.logger.error(`Error while saving new account. Status Code: ${(_d = err.response) === null || _d === void 0 ? void 0 : _d.statusCode} => ${error}`);
                        }
                    }
                }
                if (ele.taxType) {
                    lineTaxRate = taxRatesData.find((dt) => dt.taxType === ele.taxType);
                    if (!lineTaxRate) {
                        try {
                            let xeroItemData = await this.xero.accountingApi.getTaxRates(filters.tenantId, `taxType="${ele.taxType}"`);
                            if ((_e = xeroItemData.body) === null || _e === void 0 ? void 0 : _e.taxRates) {
                                lineTaxRate = await this.syncEachTaxRate(xeroItemData.body.taxRates[0], filters.tenantId);
                            }
                        }
                        catch (err) {
                            const error = JSON.stringify((_f = err.response) === null || _f === void 0 ? void 0 : _f.body, null, 2);
                            this.logger.error(`Error while saving new tax rate. Status Code: ${(_g = err.response) === null || _g === void 0 ? void 0 : _g.statusCode} => ${error}`);
                        }
                    }
                }
                quoteMilestones.push({
                    id: prevMilestone ? prevMilestone.id : undefined,
                    xeroReference: ele.lineItemID,
                    title: ele.description,
                    quantity: ele.quantity,
                    taxAmount: ele.taxAmount,
                    amount: ele.unitAmount,
                    requirePayment: true,
                    status: prevMilestone ? prevMilestone.status : undefined,
                    quotationId: newQuotationData.id,
                    accountId: lineAccount ? lineAccount.id : undefined,
                    taxRateId: lineTaxRate ? lineTaxRate.id : undefined
                });
            }
            exitingQuoteMilestones.forEach((ele) => {
                let item = quoteMilestones.find((dt) => dt.id === ele.id);
                if (!item) {
                    toDeleteIds.push(ele.id);
                }
            });
            let allPromises = [];
            if (toDeleteIds.length > 0) {
                await this.prisma.quotationMilestone.deleteMany({
                    where: { id: { in: toDeleteIds } }
                });
            }
            quoteMilestones.forEach((ele) => {
                if (ele.id) {
                    allPromises.push(this.prisma.quotationMilestone.update({
                        where: {
                            id: ele.id
                        },
                        data: ele
                    }));
                }
                else {
                    allPromises.push(this.prisma.quotationMilestone.upsert({
                        where: {
                            xeroReference: ele.xeroReference
                        },
                        create: ele,
                        update: ele
                    }));
                }
            });
            await Promise.all(allPromises);
        }
        return newQuotationData;
    }
    async prepareInvoiceFromXeroInvoice(invoices, tenantId) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        let valid = await this.validateAccessToken();
        if (!valid) {
            this.logger.log("Invalid Access Token");
            return;
        }
        this.logger.log("Syncing Invoice Data From Xero");
        let invoiceData;
        let activeRecord = invoices.find((ele) => ele.status !== xero_node_1.Invoice.StatusEnum.DELETED);
        if (!activeRecord) {
            throw {
                message: "Couldnot find Invoice from XERO",
                statusCode: 404
            };
        }
        let existingInvoice = await this.prisma.invoice.findFirst({
            where: {
                OR: [
                    { xeroReference: activeRecord.invoiceID },
                    {
                        invoiceNumber: activeRecord.invoiceNumber,
                        Client: {
                            ClientXeroConnection: {
                                some: {
                                    xeroReference: (_a = activeRecord.contact) === null || _a === void 0 ? void 0 : _a.contactID,
                                    xeroTenantId: tenantId
                                }
                            }
                        }
                    }
                ]
            },
            include: {
                Client: true,
                InvoiceItems: true,
                _count: {
                    select: {
                        Transactions: {
                            where: {
                                recordType: constants_1.TransactionRecordType.government_fees,
                                isDeleted: false,
                                status: {
                                    not: {
                                        in: [constants_1.TransactionStatus.paid, constants_1.TransactionStatus.canceled]
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: {
                id: 'desc'
            }
        });
        let clientData = await this.prisma.client.findFirst({
            where: { ClientXeroConnection: {
                    some: {
                        xeroReference: activeRecord.contact.contactID,
                        xeroTenantId: tenantId
                    }
                } }
        });
        if (!clientData) {
            clientData = await this.syncLocalContact({ resourceId: activeRecord.contact.contactID, eventCategory: 'CONTACT', eventType: 'UPDATE', tenantId: tenantId });
        }
        let quoteId;
        let projectId;
        if (activeRecord.reference) {
            let quoteData = await this.prisma.quotation.findFirst({
                where: {
                    quoteNumber: activeRecord.reference,
                    Lead: {
                        Client: {
                            ClientXeroConnection: {
                                some: {
                                    xeroReference: (_b = activeRecord.contact) === null || _b === void 0 ? void 0 : _b.contactID
                                }
                            }
                        }
                    }
                }
            }).catch(err => {
                this.logger.error("Some error while extracting reference number");
            });
            if (quoteData) {
                quoteId = quoteData.id;
                projectId = quoteData.projectId;
            }
        }
        let invoiceFile = null;
        if (!existingInvoice || !existingInvoice.file) {
            try {
                let invoiceAttatchment = await this.xero.accountingApi.getInvoiceAsPdf(tenantId, activeRecord.invoiceID, {
                    headers: {
                        "Accept": "application/pdf"
                    }
                });
                if (invoiceAttatchment.body) {
                    let filename = "Invoice-" + (0, common_2.slugify)(clientData.name) + "-" + Date.now() + "__" + (existingInvoice === null || existingInvoice === void 0 ? void 0 : existingInvoice.id) + ".pdf";
                    let fileLocation = (0, invoice_dto_1.getDynamicUploadPath)() + "/";
                    invoiceFile = fileLocation + filename;
                    await (0, file_management_1.uploadFromBuffer)(invoiceAttatchment.body, invoiceFile);
                }
            }
            catch (err) {
                this.logger.error("Some error while getting quote attachment", err.message);
            }
        }
        invoiceData = {
            xeroReference: activeRecord.invoiceID,
            xeroTenantId: tenantId,
            invoiceNumber: activeRecord.invoiceNumber,
            status: this.matchXeroInvoiceStatusToLocalInvoiceStatus(activeRecord.status),
            addedDate: new Date(),
            issueDate: (activeRecord.date) ? new Date(activeRecord.date) : undefined,
            expiryDate: (activeRecord.dueDate) ? new Date(activeRecord.dueDate) : undefined,
            subTotal: activeRecord.subTotal,
            total: activeRecord.total,
            vatAmount: activeRecord.totalTax,
            type: constants_1.InvoiceType.manual,
            clientId: clientData.id,
            quotationId: (quoteId) ? quoteId : undefined,
            projectId: (projectId) ? projectId : undefined,
            file: (invoiceFile) ? invoiceFile : undefined
        };
        let newInvoiceData;
        if (existingInvoice) {
            newInvoiceData = await this.prisma.invoice.update({
                where: {
                    id: existingInvoice.id
                },
                data: invoiceData,
                include: {
                    Project: {
                        select: {
                            id: true,
                            onHold: true,
                            comment: true
                        }
                    }
                }
            });
        }
        else {
            newInvoiceData = await this.prisma.invoice.create({
                data: invoiceData,
                include: {
                    Project: {
                        select: {
                            id: true,
                            onHold: true,
                            comment: true
                        }
                    }
                }
            });
        }
        if (newInvoiceData) {
            let exitingInvoiceItems = (existingInvoice === null || existingInvoice === void 0 ? void 0 : existingInvoice.InvoiceItems) ? existingInvoice.InvoiceItems : [];
            let invoiceItems = [];
            let toDeleteIds = [];
            let allAccounts = [];
            let allProducts = [];
            let allTaxRates = [];
            activeRecord.lineItems.forEach((ele) => {
                if (ele.accountCode) {
                    allAccounts.push(ele.accountCode);
                }
                if (ele.itemCode) {
                    allProducts.push(ele.itemCode);
                }
                if (ele.taxType) {
                    allTaxRates.push(ele.taxType);
                }
            });
            let accountDt = this.prisma.account.findMany({
                where: {
                    accountCode: {
                        in: allAccounts
                    }
                }
            });
            let productsDt = this.prisma.product.findMany({
                where: {
                    productCode: {
                        in: allProducts
                    }
                }
            });
            let taxRatesDt = this.prisma.taxRate.findMany({
                where: {
                    taxType: {
                        in: allTaxRates
                    }
                }
            });
            const [accountData, productsData, taxRatesData] = await Promise.all([accountDt, productsDt, taxRatesDt]);
            for (let i = 0; i < ((_c = activeRecord === null || activeRecord === void 0 ? void 0 : activeRecord.lineItems) === null || _c === void 0 ? void 0 : _c.length); i++) {
                let ele = activeRecord === null || activeRecord === void 0 ? void 0 : activeRecord.lineItems[i];
                let prevInvoice = exitingInvoiceItems.find((dt) => dt.xeroReference === ele.lineItemID);
                let lineAccount;
                let lineProduct;
                let lineTaxRate;
                if (ele.accountCode && ele.accountID) {
                    lineAccount = accountData.find((dt) => dt.accountCode === ele.accountCode);
                    if (!lineAccount) {
                        try {
                            let xeroAccountData = await this.xero.accountingApi.getAccount(tenantId, ele.accountID);
                            if ((_d = xeroAccountData.body) === null || _d === void 0 ? void 0 : _d.accounts) {
                                lineAccount = await this.syncEachAccount(xeroAccountData.body.accounts[0], tenantId);
                            }
                        }
                        catch (err) {
                            const error = JSON.stringify((_e = err.response) === null || _e === void 0 ? void 0 : _e.body, null, 2);
                            this.logger.error(`Error while saving new account. Status Code: ${(_f = err.response) === null || _f === void 0 ? void 0 : _f.statusCode} => ${error}`);
                        }
                    }
                }
                if (ele.itemCode) {
                    lineProduct = productsData.find((dt) => dt.productCode === ele.itemCode);
                    if (!lineProduct && ((_g = ele.item) === null || _g === void 0 ? void 0 : _g.itemID)) {
                        try {
                            let xeroItemData = await this.xero.accountingApi.getItem(tenantId, ele.item.itemID);
                            if ((_h = xeroItemData.body) === null || _h === void 0 ? void 0 : _h.items) {
                                lineProduct = await this.syncEachProduct(xeroItemData.body.items[0]);
                            }
                        }
                        catch (err) {
                            const error = JSON.stringify((_j = err.response) === null || _j === void 0 ? void 0 : _j.body, null, 2);
                            this.logger.error(`Error while saving new product. Status Code: ${(_k = err.response) === null || _k === void 0 ? void 0 : _k.statusCode} => ${error}`);
                        }
                    }
                }
                if (ele.taxType) {
                    lineTaxRate = taxRatesData.find((dt) => dt.taxType === ele.taxType);
                    if (!lineTaxRate) {
                        try {
                            let xeroItemData = await this.xero.accountingApi.getTaxRates(tenantId, `taxType="${ele.taxType}"`);
                            if ((_l = xeroItemData.body) === null || _l === void 0 ? void 0 : _l.taxRates) {
                                lineTaxRate = await this.syncEachTaxRate(xeroItemData.body.taxRates[0], tenantId);
                            }
                        }
                        catch (err) {
                            const error = JSON.stringify((_m = err.response) === null || _m === void 0 ? void 0 : _m.body, null, 2);
                            this.logger.error(`Error while saving new tax rate. Status Code: ${(_o = err.response) === null || _o === void 0 ? void 0 : _o.statusCode} => ${error}`);
                        }
                    }
                }
                invoiceItems.push({
                    id: prevInvoice ? prevInvoice.id : undefined,
                    xeroReference: ele.lineItemID,
                    title: ele.description,
                    quantity: ele.quantity,
                    amount: ele.unitAmount,
                    invoiceId: newInvoiceData.id,
                    taxAmount: ele.taxAmount,
                    accountId: lineAccount ? lineAccount.id : undefined,
                    productId: lineProduct ? lineProduct.id : undefined,
                    taxRateId: lineTaxRate ? lineTaxRate.id : undefined
                });
            }
            let transactions = [];
            activeRecord === null || activeRecord === void 0 ? void 0 : activeRecord.payments.forEach((ele) => {
                transactions.push({
                    xeroReference: ele.paymentID,
                    title: "Synced from Xero",
                    transactionDate: new Date(ele.date),
                    amount: ele.amount,
                    status: constants_1.TransactionStatus.paid,
                    transactionReference: ele.reference,
                    invoiceId: newInvoiceData.id,
                    projectId: newInvoiceData.projectId,
                    recordType: constants_1.TransactionRecordType.invoice_transaction
                });
            });
            exitingInvoiceItems.forEach((ele) => {
                let item = invoiceItems.find((dt) => dt.id === ele.id);
                if (!item) {
                    toDeleteIds.push(ele.id);
                }
            });
            let allPromises = [];
            if (toDeleteIds.length > 0) {
                await this.prisma.invoiceItem.deleteMany({
                    where: { id: { in: toDeleteIds } }
                });
            }
            invoiceItems.forEach((ele) => {
                if (ele.id) {
                    allPromises.push(this.prisma.invoiceItem.update({
                        where: {
                            id: ele.id
                        },
                        data: ele
                    }));
                }
                else {
                    allPromises.push(this.prisma.invoiceItem.upsert({
                        where: {
                            xeroReference: ele.xeroReference
                        },
                        create: ele,
                        update: ele
                    }));
                }
            });
            transactions.forEach((ele) => {
                allPromises.push(this.prisma.transactions.upsert({
                    where: {
                        xeroReference: ele.xeroReference
                    },
                    create: ele,
                    update: ele
                }));
            });
            await Promise.all(allPromises);
            if (newInvoiceData && newInvoiceData.Project && newInvoiceData.Project.onHold && newInvoiceData.status === constants_1.InvoiceStatus.paid && (existingInvoice === null || existingInvoice === void 0 ? void 0 : existingInvoice.status) !== constants_1.InvoiceStatus.paid) {
                const prjData = await this.prisma.project.update({
                    where: {
                        id: newInvoiceData.Project.id
                    },
                    data: {
                        onHold: false,
                        comment: "Payment verified from XERO and Project Auto Resumed"
                    }
                });
                let emitterData = new notification_dto_1.NotificationEventDto({ recordId: prjData.id, moduleName: 'projectResumeNotification' });
                this.eventEmitter.emit('notification.send', emitterData);
            }
            if (existingInvoice && ((_p = existingInvoice._count) === null || _p === void 0 ? void 0 : _p.Transactions) > 0 && (newInvoiceData.status === constants_1.InvoiceStatus.paid || newInvoiceData.status === constants_1.InvoiceStatus.canceled)) {
                let transactionStatus;
                if (newInvoiceData.status === constants_1.InvoiceStatus.paid) {
                    transactionStatus = constants_1.TransactionStatus.paid;
                }
                else if (newInvoiceData.status === constants_1.InvoiceStatus.canceled) {
                    transactionStatus = constants_1.TransactionStatus.canceled;
                }
                await this.prisma.transactions.updateMany({
                    where: {
                        isDeleted: false,
                        recordType: constants_1.TransactionRecordType.government_fees,
                        invoiceId: newInvoiceData.id,
                        status: {
                            not: {
                                in: [constants_1.TransactionStatus.paid, constants_1.TransactionStatus.canceled]
                            }
                        }
                    },
                    data: {
                        status: transactionStatus
                    }
                });
            }
        }
        return newInvoiceData;
    }
    async handleWebhook(payload) {
        console.log("Webhook call", payload);
        let allEvents = payload.events;
        let allPromises = [];
        let allProcessed = [...this.allProcessed];
        if (Array.isArray(allEvents)) {
            allEvents.forEach((ele) => {
                let isProcessed = allProcessed.find((processedItems) => processedItems.resourceId === ele.resourceId && processedItems.type === ele.eventCategory);
                if (isProcessed)
                    return;
                allProcessed.push({
                    resourceId: ele.resourceId,
                    type: ele.eventCategory
                });
                if (ele.eventCategory === 'CONTACT') {
                    allPromises.push(this.syncLocalContact(ele));
                }
                else if (ele.eventCategory === 'INVOICE') {
                    allPromises.push(this.syncLocalInvoice(ele));
                }
                else {
                    this.logger.error("No such webhook event registered, found", ele.eventCategory);
                }
            });
        }
        await Promise.all(allPromises);
    }
    async syncLocalContact(event) {
        let valid = await this.validateAccessToken();
        if (!valid) {
            this.logger.log("Invalid Access Token");
            return;
        }
        let contactData = await this.xero.accountingApi.getContact(event.tenantId, event.resourceId);
        let contact = contactData.body.contacts[0];
        let status = contact.contactStatus;
        if (!contact) {
            this.logger.error(`Couldnot find contact on xero with id ${event.resourceId}`);
            return;
        }
        let phone = contact.phones.find((ele) => ele.phoneType = xero_node_1.Phone.PhoneTypeEnum.MOBILE);
        let recordToUpsert = {
            name: contact.name,
            email: contact.emailAddress,
            phone: (phone && phone.phoneNumber) ? phone.phoneNumber : undefined,
            phoneCode: (phone && phone.phoneNumber) ? phone.phoneCountryCode : undefined,
            isDeleted: (status === xero_node_1.Contact.ContactStatusEnum.ACTIVE) ? false : undefined
        };
        try {
            let localClient = await this.prisma.client.findFirst({
                where: {
                    ClientXeroConnection: {
                        some: {
                            xeroReference: event.resourceId
                        }
                    }
                }
            });
            if (localClient) {
                let clientDt = await this.prisma.client.update({
                    where: {
                        id: localClient.id
                    },
                    data: recordToUpsert
                });
                await this.prisma.clientXeroConnection.upsert({
                    where: {
                        xeroTenantId_clientId_xeroReference: {
                            xeroTenantId: event.tenantId,
                            clientId: clientDt.id,
                            xeroReference: event.resourceId
                        }
                    },
                    create: {
                        xeroTenantId: event.tenantId,
                        clientId: clientDt.id,
                        xeroReference: event.resourceId
                    },
                    update: {}
                });
                return clientDt;
            }
            else {
                if (recordToUpsert.email) {
                    let clientDt = await this.prisma.client.upsert({
                        where: {
                            email: recordToUpsert.email,
                        },
                        create: recordToUpsert,
                        update: recordToUpsert
                    });
                    await this.prisma.clientXeroConnection.upsert({
                        where: {
                            xeroTenantId_clientId_xeroReference: {
                                xeroTenantId: event.tenantId,
                                clientId: clientDt.id,
                                xeroReference: event.resourceId
                            }
                        },
                        create: {
                            xeroTenantId: event.tenantId,
                            clientId: clientDt.id,
                            xeroReference: event.resourceId
                        },
                        update: {}
                    });
                    return clientDt;
                }
                else {
                    return await this.prisma.client.create({
                        data: Object.assign(Object.assign({}, recordToUpsert), { ClientXeroConnection: {
                                create: {
                                    xeroTenantId: event.tenantId,
                                    xeroReference: event.resourceId
                                }
                            } })
                    });
                }
            }
        }
        catch (err) {
            this.logger.error("Some error while syncing client with xero", err.message);
        }
    }
    async syncLocalInvoice(event) {
        let valid = await this.validateAccessToken();
        if (!valid) {
            this.logger.log("Invalid Access Token");
            return;
        }
        let invoiceData = await this.xero.accountingApi.getInvoice(event.tenantId, event.resourceId);
        let invoices = invoiceData.body.invoices;
        let allPromises = [];
        try {
            invoices === null || invoices === void 0 ? void 0 : invoices.forEach((invoice) => {
                if (invoice.status === xero_node_1.Invoice.StatusEnum.DRAFT)
                    return;
                allPromises.push(this.prepareInvoiceFromXeroInvoice([invoice], event.tenantId));
            });
            await Promise.all(allPromises);
        }
        catch (err) {
            this.logger.error("Some error while adding invoice from xero", err.message);
        }
    }
    async checkLoginStatus() {
        let ref = await this.getRefreshToken();
        if (ref)
            return true;
        return false;
    }
    async syncAllTenantsAccounts() {
        let valid = await this.validateAccessToken();
        if (!valid) {
            this.logger.log("Invalid Access Token");
            return;
        }
        let allTenants = this.xero.tenants;
        allTenants.forEach(async (ele) => {
            if (!ele.tenantName.includes("Demo")) {
                await this.syncAccounts(ele.tenantId);
            }
        });
    }
    async syncAccounts(tenantId) {
        var _a, _b;
        try {
            let allAccounts = await this.xero.accountingApi.getAccounts(tenantId, null, 'Status=="ACTIVE"');
            if (!allAccounts.body || !allAccounts.body.accounts) {
                return {
                    message: "No data to sync",
                    statusCode: 200
                };
            }
            const MAX_CONCURRENT_OPERATIONS = 10;
            this.logger.log(`Found ${(_b = (_a = allAccounts.body) === null || _a === void 0 ? void 0 : _a.accounts) === null || _b === void 0 ? void 0 : _b.length} accounts to sync`);
            await BluebirdPromise.map(allAccounts.body.accounts, async (account) => {
                try {
                    await this.syncEachAccount(account, tenantId);
                }
                catch (err) {
                    this.logger.error("Some error while syncing each account", err.message);
                }
            }, { concurrency: MAX_CONCURRENT_OPERATIONS });
        }
        catch (err) {
            const error = JSON.stringify(err.response.body, null, 2);
            this.logger.error(`Status Code: ${err.response.statusCode} => ${error}`);
            throw {
                message: "Some error while syncing accounts",
                statusCode: 400
            };
        }
    }
    async syncAllTenantsProducts() {
        let valid = await this.validateAccessToken();
        if (!valid) {
            this.logger.log("Invalid Access Token");
            return;
        }
        let allTenants = this.xero.tenants;
        allTenants.forEach(async (ele) => {
            if (!ele.tenantName.includes("Demo")) {
                await this.syncProducts(ele.tenantId);
            }
        });
    }
    async syncProducts(tenantId) {
        var _a, _b;
        try {
            let allAccounts = await this.xero.accountingApi.getItems(tenantId);
            if (!allAccounts.body || !allAccounts.body.items) {
                return {
                    message: "No product data to sync",
                    statusCode: 200
                };
            }
            const MAX_CONCURRENT_OPERATIONS = 10;
            this.logger.log(`Found ${(_b = (_a = allAccounts.body) === null || _a === void 0 ? void 0 : _a.items) === null || _b === void 0 ? void 0 : _b.length} products to sync`);
            await BluebirdPromise.map(allAccounts.body.items, async (item) => {
                try {
                    await this.syncEachProduct(item);
                }
                catch (err) {
                    this.logger.error("Some error while syncing each product", err.message);
                }
            }, { concurrency: MAX_CONCURRENT_OPERATIONS });
        }
        catch (err) {
            const error = JSON.stringify(err.response.body, null, 2);
            this.logger.error(`Status Code: ${err.response.statusCode} => ${error}`);
            throw {
                message: "Some error while syncing product",
                statusCode: 400
            };
        }
    }
    async syncAllTenantsTaxRates() {
        let valid = await this.validateAccessToken();
        if (!valid) {
            this.logger.log("Invalid Access Token");
            return;
        }
        let allTenants = this.xero.tenants;
        allTenants.forEach(async (ele) => {
            if (!ele.tenantName.includes("Demo")) {
                await this.syncTaxRates(ele.tenantId);
            }
        });
    }
    async syncTaxRates(tenantId) {
        var _a, _b;
        try {
            let allAccounts = await this.xero.accountingApi.getTaxRates(tenantId, 'Status=="ACTIVE"');
            if (!allAccounts.body || !allAccounts.body.taxRates) {
                return {
                    message: "No tax rate data to sync",
                    statusCode: 200
                };
            }
            const MAX_CONCURRENT_OPERATIONS = 10;
            this.logger.log(`Found ${(_b = (_a = allAccounts.body) === null || _a === void 0 ? void 0 : _a.taxRates) === null || _b === void 0 ? void 0 : _b.length} tax rates to sync`);
            await BluebirdPromise.map(allAccounts.body.taxRates, async (taxRate) => {
                try {
                    await this.syncEachTaxRate(taxRate, tenantId);
                }
                catch (err) {
                    this.logger.error("Some error while syncing each tax rate", err.message);
                }
            }, { concurrency: MAX_CONCURRENT_OPERATIONS });
        }
        catch (err) {
            const error = JSON.stringify(err.response.body, null, 2);
            this.logger.error(`Status Code: ${err.response.statusCode} => ${error}`);
            throw {
                message: "Some error while syncing tax rates",
                statusCode: 400
            };
        }
    }
    async syncEachAccount(account, tenantId) {
        return this.prisma.account.upsert({
            where: {
                xeroReference: account.accountID
            },
            update: {
                title: account.name,
                accountCode: account.code,
                xeroType: String(account.type),
                description: account.description,
                bankAccountNumber: account.bankAccountNumber,
                xeroTenantId: tenantId
            },
            create: {
                xeroReference: account.accountID,
                title: account.name,
                accountCode: account.code,
                xeroType: String(account.type),
                description: account.description,
                bankAccountNumber: account.bankAccountNumber,
                showInExpenseClaims: (account.showInExpenseClaims) ? account.showInExpenseClaims : undefined,
                xeroTenantId: tenantId
            }
        });
    }
    async syncEachTaxRate(taxRate, tenantId) {
        return this.prisma.taxRate.upsert({
            where: {
                title_taxType_xeroTenantId: {
                    title: taxRate.name,
                    taxType: taxRate.taxType,
                    xeroTenantId: tenantId
                }
            },
            update: {
                title: taxRate.name,
                taxType: taxRate.taxType,
                xeroTenantId: tenantId
            },
            create: {
                title: taxRate.name,
                rate: taxRate.effectiveRate,
                taxType: taxRate.taxType,
                xeroTenantId: tenantId
            }
        });
    }
    async syncEachProduct(item) {
        var _a, _b, _c, _d;
        let taxRate;
        if ((_a = item.salesDetails) === null || _a === void 0 ? void 0 : _a.taxType) {
            taxRate = await this.prisma.taxRate.findFirst({
                where: {
                    taxType: (_b = item.salesDetails) === null || _b === void 0 ? void 0 : _b.taxType
                }
            });
        }
        let account;
        if ((_c = item.salesDetails) === null || _c === void 0 ? void 0 : _c.accountCode) {
            account = await this.prisma.account.findFirst({
                where: {
                    accountCode: (_d = item.salesDetails) === null || _d === void 0 ? void 0 : _d.accountCode
                }
            });
        }
        return this.prisma.product.upsert({
            where: {
                xeroReference: item.itemID
            },
            update: {
                productCode: item.code,
                title: item.name,
                description: item.description,
                quantity: item.quantityOnHand,
                unitPrice: item.totalCostPool,
                accountId: account.id,
                taxRateId: taxRate.id
            },
            create: {
                xeroReference: item.itemID,
                productCode: item.code,
                title: item.name,
                description: item.description,
                quantity: item.quantityOnHand,
                unitPrice: item.totalCostPool,
                accountId: account.id,
                taxRateId: taxRate.id
            }
        });
    }
};
XeroAccountingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService,
        event_emitter_1.EventEmitter2])
], XeroAccountingService);
exports.XeroAccountingService = XeroAccountingService;
//# sourceMappingURL=xero-accounting.service.js.map