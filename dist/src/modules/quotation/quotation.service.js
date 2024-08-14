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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var QuotationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuotationService = void 0;
const puppeteer_1 = require("puppeteer");
const fs = require("fs");
const ejs = require("ejs");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma.service");
const mail_service_1 = require("../../mail/mail.service");
const user_dto_1 = require("../user/dto/user.dto");
const constants_1 = require("../../config/constants");
const quotation_dto_1 = require("./dto/quotation.dto");
const file_management_1 = require("../../helpers/file-management");
const fs_1 = require("fs");
const organization_dto_1 = require("../organization/dto/organization.dto");
const common_2 = require("../../helpers/common");
const client_dto_1 = require("../client/dto/client.dto");
const notification_dto_1 = require("../notification/dto/notification.dto");
const event_emitter_1 = require("@nestjs/event-emitter");
const project_entity_1 = require("../project/entities/project.entity");
const bull_1 = require("@nestjs/bull");
const xero_process_config_1 = require("../xero-accounting/process/xero.process.config");
let QuotationService = QuotationService_1 = class QuotationService {
    constructor(prisma, mailService, eventEmitter, xeroQueue) {
        this.prisma = prisma;
        this.mailService = mailService;
        this.eventEmitter = eventEmitter;
        this.xeroQueue = xeroQueue;
        this.logger = new common_1.Logger(QuotationService_1.name);
    }
    async create(createDto, user) {
        var _a;
        const { milestone, submissionById, revisedQuotationReferenceId } = createDto, rest = __rest(createDto, ["milestone", "submissionById", "revisedQuotationReferenceId"]);
        let leadData;
        if (createDto.leadId) {
            leadData = await this.prisma.leads.findFirst({
                where: {
                    id: createDto.leadId
                },
                include: {
                    Project: true,
                    SubmissionBy: {
                        select: organization_dto_1.OrganizationDefaultAttributes
                    }
                }
            });
        }
        if (!leadData && createDto.clientId) {
            leadData = await this.prisma.leads.create({
                data: {
                    clientId: createDto.clientId,
                    message: "Auto Created from Quotation",
                    submissionById: submissionById
                },
                include: {
                    Project: true,
                    SubmissionBy: {
                        select: organization_dto_1.OrganizationDefaultAttributes
                    }
                }
            });
        }
        if (!leadData) {
            throw {
                message: "No Lead Data Found",
                statusCode: 400
            };
        }
        if (!leadData.submissionById && !submissionById) {
            throw {
                message: "Please provide Submission Company, either it is DAT, Luxedesign or any other",
                statusCode: 400
            };
        }
        if (submissionById && leadData.submissionById !== submissionById) {
            leadData = await this.prisma.leads.update({
                where: {
                    id: createDto.leadId
                },
                data: {
                    submissionById: submissionById
                },
                include: {
                    Project: true,
                    SubmissionBy: {
                        select: organization_dto_1.OrganizationDefaultAttributes
                    }
                }
            });
        }
        let totalAmount = 0;
        let vatAmount = 0;
        let vatData = new Map();
        let quotationMileStone = [];
        for (let i = 0; i < milestone.length; i++) {
            let ele = milestone[i];
            let lineAmount = (ele.quantity * ele.amount);
            let lineVatAmount = 0;
            totalAmount = totalAmount + lineAmount;
            if (ele.taxRateId) {
                let rate = 0;
                if (vatData.has(ele.taxRateId)) {
                    rate = vatData.get(ele.taxRateId).rate;
                }
                else {
                    let vt = await this.prisma.taxRate.findFirst({
                        where: { id: ele.taxRateId }
                    });
                    rate = vt.rate;
                    vatData.set(ele.taxRateId, { rate: rate });
                }
                lineVatAmount = (rate / 100) * lineAmount;
                vatAmount += lineVatAmount;
            }
            quotationMileStone.push(Object.assign(Object.assign({}, ele), { taxAmount: lineVatAmount }));
        }
        let previousQuotation = null;
        if (revisedQuotationReferenceId) {
            previousQuotation = await this.prisma.quotation.findFirst({
                where: {
                    id: revisedQuotationReferenceId
                }
            });
        }
        let newQuotation = await this.prisma.quotation.create({
            data: Object.assign(Object.assign({}, rest), { addedById: user.userId, xeroTenantId: leadData === null || leadData === void 0 ? void 0 : leadData.xeroTenantId, leadId: leadData.id, subTotal: totalAmount, vatAmount: vatAmount, total: totalAmount + vatAmount, projectId: (leadData && (leadData === null || leadData === void 0 ? void 0 : leadData.Project)) ? (_a = leadData === null || leadData === void 0 ? void 0 : leadData.Project) === null || _a === void 0 ? void 0 : _a.id : undefined, revisedQuotationReferenceId: (previousQuotation) ? previousQuotation.id : undefined, revisionCount: (previousQuotation) ? previousQuotation.revisionCount + 1 : 0, brandingThemeId: createDto.brandingThemeId, QuotationMilestone: {
                    createMany: {
                        data: quotationMileStone.map((_a) => {
                            var { id } = _a, rest = __rest(_a, ["id"]);
                            return rest;
                        })
                    }
                } }),
        })
            .catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
        if (newQuotation && previousQuotation) {
            let previousQuotationData = await this.prisma.quotation.update({
                where: {
                    id: previousQuotation.id
                },
                data: {
                    status: constants_1.QuotationStatus.revised
                }
            });
            this.xeroQueue.add(xero_process_config_1.XeroProcessNames.updateQuotationStatus, {
                message: "Sync Quotation With Xero",
                data: previousQuotationData
            }, { removeOnComplete: true });
        }
        this.xeroQueue.add(xero_process_config_1.XeroProcessNames.syncQuotation, {
            message: "Sync Quotation With Xero",
            data: newQuotation
        }, { removeOnComplete: true });
        return newQuotation;
    }
    findAll(pagination, condition) {
        let skip = (pagination.perPage * (pagination.page - 1));
        let take = pagination.perPage;
        let records = this.prisma.quotation.findMany({
            where: condition,
            skip: skip,
            take: take,
            include: {
                QuotationMilestone: {
                    orderBy: {
                        id: 'asc'
                    }
                },
                Lead: {
                    select: {
                        ProjectType: {
                            select: {
                                id: true,
                                slug: true,
                                title: true
                            }
                        },
                        SubmissionBy: {
                            select: organization_dto_1.OrganizationDefaultAttributes
                        },
                        Client: {
                            select: client_dto_1.ClientDefaultAttributes
                        },
                        LeadEnquiryFollowUp: {
                            where: {
                                isDeleted: false
                            },
                            include: {
                                AddedBy: {
                                    select: user_dto_1.UserDefaultAttributes
                                }
                            },
                            take: 3,
                            orderBy: {
                                addedDate: 'desc'
                            }
                        },
                        AssignedTo: {
                            select: user_dto_1.UserDefaultAttributes
                        }
                    },
                },
            },
            orderBy: {
                addedDate: 'desc'
            }
        });
        return records;
    }
    findOne(id) {
        return this.prisma.quotation.findUnique({
            where: {
                id: id
            },
            include: {
                QuotationMilestone: {
                    include: {
                        Account: {
                            select: {
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
                Lead: {
                    select: {
                        ProjectType: {
                            select: {
                                id: true,
                                slug: true,
                                title: true
                            }
                        },
                        SubmissionBy: {
                            select: organization_dto_1.OrganizationDefaultAttributes
                        },
                        Client: {
                            select: client_dto_1.ClientDefaultAttributes
                        },
                        LeadEnquiryFollowUp: {
                            where: {
                                isDeleted: false
                            },
                            include: {
                                AddedBy: {
                                    select: user_dto_1.UserDefaultAttributes
                                }
                            },
                            take: 3,
                            orderBy: {
                                addedDate: 'desc'
                            }
                        },
                        AssignedTo: {
                            select: user_dto_1.UserDefaultAttributes
                        }
                    },
                },
            },
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    async update(id, updateDto, user) {
        const { milestone, revisedQuotationReferenceId, submissionById } = updateDto, rest = __rest(updateDto, ["milestone", "revisedQuotationReferenceId", "submissionById"]);
        let recordData = await this.findOne(id);
        if (recordData.status !== constants_1.QuotationStatus.created) {
            throw {
                message: "You cannot modify the quotation once it is sent to client. Please mark as rejected and recreate the new quotation",
                statusCode: 400
            };
        }
        let updatedRecord = await this.prisma.quotation.update({
            data: Object.assign(Object.assign({}, rest), { modifiedById: user.userId, modifiedDate: new Date() }),
            where: {
                id: id
            }
        });
        if (milestone) {
            let allIds = [];
            milestone.forEach((ele) => {
                if (ele.id) {
                    allIds.push(ele.id);
                }
            });
            await this.prisma.quotationMilestone.deleteMany({
                where: {
                    quotationId: updatedRecord.id,
                    NOT: {
                        id: {
                            in: allIds
                        }
                    }
                }
            });
            let newMileStone = [];
            let vatData = new Map();
            for (let i = 0; i < milestone.length; i++) {
                let ele = milestone[i];
                let lineAmount = (ele.quantity * ele.amount);
                let lineVatAmount = 0;
                if (ele.taxRateId) {
                    let rate = 0;
                    if (vatData.has(ele.taxRateId)) {
                        rate = vatData.get(ele.taxRateId).rate;
                    }
                    else {
                        let vt = await this.prisma.taxRate.findFirst({
                            where: { id: ele.taxRateId }
                        });
                        rate = vt.rate;
                        vatData.set(ele.taxRateId, { rate: rate });
                    }
                    lineVatAmount = (rate / 100) * lineAmount;
                }
                if (ele.id) {
                    let t = this.prisma.quotationMilestone.update({
                        where: {
                            id: ele.id
                        },
                        data: {
                            quotationId: updatedRecord.id,
                            amount: ele.amount,
                            taxAmount: lineVatAmount,
                            taxRateId: ele.taxRateId,
                            accountId: ele.accountId,
                            productId: ele.productId,
                            quantity: ele.quantity,
                            title: ele.title,
                            requirePayment: ele.requirePayment
                        }
                    });
                    newMileStone.push(t);
                }
                else {
                    let t = this.prisma.quotationMilestone.create({
                        data: {
                            taxRateId: ele.taxRateId,
                            accountId: ele.accountId,
                            productId: ele.productId,
                            quotationId: updatedRecord.id,
                            quantity: ele.quantity,
                            amount: ele.amount,
                            taxAmount: lineVatAmount,
                            title: ele.title,
                            requirePayment: ele.requirePayment
                        }
                    });
                    newMileStone.push(t);
                }
            }
            await Promise.all(newMileStone);
        }
        await this.adjustTotalAmount(updatedRecord.id);
        this.xeroQueue.add(xero_process_config_1.XeroProcessNames.syncQuotation, {
            message: "Sync Quotation With Xero",
            data: updatedRecord
        }, { removeOnComplete: true });
        return this.findOne(updatedRecord.id);
    }
    async adjustTotalAmount(quotationId) {
        let milestones = await this.prisma.quotationMilestone.findMany({
            where: {
                quotationId: quotationId
            },
            select: {
                quantity: true,
                amount: true,
                taxAmount: true
            }
        });
        let totalAmount = 0;
        let vatAmount = 0;
        milestones.forEach((ele) => {
            totalAmount = totalAmount + (ele.quantity * ele.amount);
            vatAmount = vatAmount + ele.taxAmount;
        });
        return this.prisma.quotation.update({
            where: {
                id: quotationId
            },
            data: {
                subTotal: totalAmount,
                vatAmount: vatAmount,
                total: totalAmount + vatAmount
            }
        });
    }
    applyFilters(filters, user, readAllQuotation) {
        let condition = {
            isDeleted: false
        };
        if (Object.entries(filters).length > 0) {
            if (filters.__status) {
                condition = Object.assign(Object.assign({}, condition), { status: {
                        in: filters.__status
                    } });
            }
            if (filters.id) {
                condition = Object.assign(Object.assign({}, condition), { id: filters.id });
            }
            if (filters.assignedToId) {
                condition = Object.assign(Object.assign({}, condition), { Lead: {
                        assignedToId: filters.assignedToId
                    } });
            }
            if (filters.clientId) {
                condition = Object.assign(Object.assign({}, condition), { Lead: {
                        clientId: filters.clientId
                    } });
            }
            if (filters.quoteNumber) {
                condition = Object.assign(Object.assign({}, condition), { quoteNumber: {
                        contains: filters.quoteNumber,
                        mode: 'insensitive'
                    } });
            }
            if (filters.projectTypeId) {
                condition = Object.assign(Object.assign({}, condition), { Lead: {
                        projectTypeId: filters.projectTypeId
                    } });
            }
            if (filters.projectId) {
                condition = Object.assign(Object.assign({}, condition), { projectId: filters.projectId });
            }
            if (filters.fromDate && filters.toDate) {
                condition = Object.assign(Object.assign({}, condition), { AND: [
                        {
                            addedDate: {
                                gte: new Date(filters.fromDate + "T00:00:00")
                            }
                        },
                        {
                            addedDate: {
                                lte: new Date(filters.toDate + "T23:59:59")
                            }
                        }
                    ] });
            }
            else {
                if (filters.fromDate) {
                    condition = Object.assign(Object.assign({}, condition), { addedDate: { gte: new Date(filters.fromDate + "T00:00:00") } });
                }
                if (filters.toDate) {
                    condition = Object.assign(Object.assign({}, condition), { addedDate: { lte: new Date(filters.toDate + "T23:59:59") } });
                }
            }
        }
        if (!readAllQuotation) {
            if (condition.AND) {
                if (Array.isArray(condition.AND)) {
                    condition.AND.push({
                        OR: [
                            { addedById: user.userId },
                            {
                                Lead: {
                                    OR: [
                                        { addedById: user.userId },
                                        { assignedToId: user.userId }
                                    ]
                                }
                            }
                        ]
                    });
                }
                else {
                    condition.AND = [
                        condition.AND,
                        {
                            OR: [
                                { addedById: user.userId },
                                {
                                    Lead: {
                                        OR: [
                                            { addedById: user.userId },
                                            { assignedToId: user.userId }
                                        ]
                                    }
                                }
                            ]
                        }
                    ];
                }
            }
            else {
                condition = Object.assign(Object.assign({}, condition), { AND: {
                        OR: [
                            { addedById: user.userId },
                            {
                                Lead: {
                                    OR: [
                                        { addedById: user.userId },
                                        { assignedToId: user.userId }
                                    ]
                                }
                            }
                        ]
                    } });
            }
        }
        else {
            if (user.litmitAccessTo && user.litmitAccessTo.length > 0) {
                if (condition.AND) {
                    if (Array.isArray(condition.AND)) {
                        condition.AND.push({
                            OR: [
                                { addedById: user.userId },
                                {
                                    Lead: {
                                        submissionById: {
                                            in: user.litmitAccessTo
                                        }
                                    }
                                }
                            ]
                        });
                    }
                    else {
                        condition.AND = [
                            condition.AND,
                            {
                                OR: [
                                    { addedById: user.userId },
                                    {
                                        Lead: {
                                            submissionById: {
                                                in: user.litmitAccessTo
                                            }
                                        }
                                    }
                                ]
                            }
                        ];
                    }
                }
                else {
                    condition = Object.assign(Object.assign({}, condition), { AND: {
                            OR: [
                                { addedById: user.userId },
                                {
                                    Lead: {
                                        submissionById: {
                                            in: user.litmitAccessTo
                                        }
                                    }
                                }
                            ]
                        } });
                }
            }
        }
        return condition;
    }
    countTotalRecord(filters) {
        return this.prisma.quotation.count({
            where: filters
        });
    }
    async submitQuotation(quotationId, user) {
        var _a, _b;
        let recordData = await this.findOne(quotationId);
        if (recordData.status !== constants_1.QuotationStatus.created) {
            throw {
                message: "This quotation has already been submitted",
                statusCode: 400
            };
        }
        let updatedRecord = await this.prisma.quotation.update({
            where: {
                id: quotationId
            },
            data: {
                status: constants_1.QuotationStatus.submitted,
                sentDate: new Date(),
                Lead: {
                    update: {
                        status: constants_1.LeadsStatus.in_progress
                    }
                }
            }
        });
        this.xeroQueue.add(xero_process_config_1.XeroProcessNames.updateQuotationStatus, {
            message: "Sync Quotation With Xero",
            data: updatedRecord
        }, { removeOnComplete: true });
        if ((_b = (_a = recordData === null || recordData === void 0 ? void 0 : recordData.Lead) === null || _a === void 0 ? void 0 : _a.Client) === null || _b === void 0 ? void 0 : _b.email) {
            this.mailService.sendQuotationToClient(recordData, user);
        }
    }
    async updateStatus(quotationId, quotationStatusDto) {
        let dt = await this.prisma.quotation.findUniqueOrThrow({
            where: {
                id: quotationId
            }
        });
        if (!(dt.status === constants_1.QuotationStatus.created || dt.status === constants_1.QuotationStatus.submitted)) {
            throw {
                message: `This quotation has been already ${(0, common_2.getEnumKeyByEnumValue)(constants_1.QuotationStatus, dt.status)}. You can no longer approve or reject this quotation.`,
                statusCode: 400
            };
        }
        let recordData = await this.prisma.quotation.update({
            where: {
                id: quotationId
            },
            data: quotationStatusDto
        });
        if (quotationStatusDto.status === constants_1.QuotationStatus.confirmed) {
            await this.prisma.leads.update({
                where: {
                    id: recordData.leadId
                },
                data: {
                    status: constants_1.LeadsStatus.confirmed
                }
            });
            let emitterData = new notification_dto_1.NotificationEventDto({ recordId: quotationId, moduleName: 'quotationApproved' });
            this.eventEmitter.emit('notification.send', emitterData);
        }
        this.xeroQueue.add(xero_process_config_1.XeroProcessNames.updateQuotationStatus, {
            message: "Sync Quotation With Xero",
            data: recordData
        }, { removeOnComplete: true });
        return recordData;
    }
    async markAsSent(quotationId, user) {
        let recordData = await this.findOne(quotationId);
        if (recordData.status !== constants_1.QuotationStatus.created) {
            throw {
                message: "This quotation has already been submitted",
                statusCode: 400
            };
        }
        let updatedRecord = await this.prisma.quotation.update({
            where: {
                id: quotationId
            },
            data: {
                status: constants_1.QuotationStatus.submitted,
                sentDate: new Date(),
                Lead: {
                    update: {
                        status: constants_1.LeadsStatus.in_progress
                    }
                }
            }
        });
        this.xeroQueue.add(xero_process_config_1.XeroProcessNames.updateQuotationStatus, {
            message: "Sync Quotation With Xero",
            data: updatedRecord
        }, { removeOnComplete: true });
    }
    removeQuotation(quotationId, user) {
        return this.prisma.quotation.update({
            where: {
                id: quotationId
            },
            data: {
                isDeleted: true,
                modifiedById: user.userId,
                modifiedDate: new Date()
            }
        });
    }
    viewQuotationPdf(quotationId) {
        return this.prisma.quotation.findUniqueOrThrow({
            where: {
                id: quotationId
            },
            include: {
                Lead: {
                    include: {
                        ProjectType: {
                            select: {
                                id: true,
                                title: true,
                                slug: true
                            }
                        },
                        Client: true,
                        SubmissionBy: {
                            select: Object.assign(Object.assign({}, organization_dto_1.OrganizationDefaultAttributes), { taxRegistrationNumber: true, digitalStamp: true, address: true })
                        }
                    }
                },
                QuotationMilestone: {
                    include: {
                        TaxRate: {
                            select: {
                                title: true,
                                rate: true,
                                id: true
                            }
                        }
                    },
                    orderBy: {
                        id: 'asc'
                    }
                }
            }
        });
    }
    async generateQuotationPdf(quotationId) {
        var _a, _b, _c;
        let quotationData = await this.prisma.quotation.findUniqueOrThrow({
            where: {
                id: quotationId
            },
            include: {
                Lead: {
                    include: {
                        ProjectType: {
                            select: {
                                id: true,
                                slug: true,
                                title: true
                            }
                        },
                        Client: true,
                        SubmissionBy: {
                            select: Object.assign(Object.assign({}, organization_dto_1.OrganizationDefaultAttributes), { taxRegistrationNumber: true, address: true, digitalStamp: true })
                        }
                    }
                },
                QuotationMilestone: {
                    include: {
                        TaxRate: {
                            select: {
                                title: true,
                                rate: true,
                                id: true
                            }
                        }
                    },
                    orderBy: {
                        id: 'asc'
                    }
                }
            }
        });
        let clientData = (_a = quotationData.Lead) === null || _a === void 0 ? void 0 : _a.Client;
        let submissionBy = (_b = quotationData.Lead) === null || _b === void 0 ? void 0 : _b.SubmissionBy;
        const browser = await puppeteer_1.default.launch({ headless: "new" });
        const page = await browser.newPage();
        const pageData = await fs.promises.readFile("views/pdf-templates/quotation.ejs", 'utf-8');
        const renderedContent = ejs.render(pageData, {
            clientData: clientData,
            quotation: quotationData,
            projectType: (_c = quotationData.Lead) === null || _c === void 0 ? void 0 : _c.ProjectType,
            submissionBy: submissionBy,
            taxData: (0, common_2.getTaxData)(quotationData.QuotationMilestone),
            convertDate: common_2.convertDate,
            addDaysToDate: common_2.addDaysToDate,
            getEnumKeyByEnumValue: common_2.getEnumKeyByEnumValue,
            SupervisionPaymentSchedule: constants_1.SupervisionPaymentSchedule
        });
        await page.setContent(renderedContent, { waitUntil: 'networkidle0', timeout: 10000 });
        let filename = "Quotation-" + (0, common_2.slugify)(clientData.name) + "-" + Date.now() + "__" + quotationData.id + ".pdf";
        let fileLocation = (0, quotation_dto_1.getDynamicUploadPath)() + "/";
        let __fileLocation = process.cwd() + "/" + fileLocation;
        if (!(0, fs_1.existsSync)(fileLocation)) {
            (0, fs_1.mkdirSync)(fileLocation, { recursive: true });
        }
        await page.pdf({ path: fileLocation + filename });
        await browser.close();
        const fileToUpload = {
            fieldname: "",
            filename: filename,
            size: 0,
            encoding: 'utf-8',
            mimetype: "application/pdf",
            destination: fileLocation,
            path: __fileLocation + filename,
            originalname: filename,
            stream: undefined,
            buffer: undefined
        };
        await (0, file_management_1.uploadFile)(fileToUpload);
        await this.prisma.quotation.update({
            where: {
                id: quotationId
            },
            data: {
                file: fileLocation + filename
            }
        });
        return this.findOne(quotationId);
    }
    async completeMilestone(milestoneId, user) {
        let milestoneData = await this.prisma.quotationMilestone.findUnique({
            where: {
                id: milestoneId
            },
            include: {
                Quotation: true
            }
        });
        if (milestoneData.status !== constants_1.MilestoneStatus.not_completed) {
            if (milestoneData.status === constants_1.MilestoneStatus.completed) {
                return milestoneData;
            }
            else {
                throw {
                    message: `This milestone was already completed and has been further processed.`,
                    statusCode: 400
                };
            }
        }
        let updatedMilestoneData = await this.prisma.quotationMilestone.update({
            where: {
                id: milestoneId
            },
            data: {
                status: constants_1.MilestoneStatus.completed,
                completedById: user.userId
            }
        });
        if (milestoneData.requirePayment) {
            await this.prisma.project.update({
                where: {
                    id: milestoneData.Quotation.projectId
                },
                data: {
                    onHold: true,
                    comment: "Requires clearance from Finance (AUTO-HOLD)",
                    ProjectHoldBy: {
                        disconnect: true
                    }
                }
            });
            let emitterData = new notification_dto_1.NotificationEventDto({ recordId: milestoneId, moduleName: 'milestoneCompleted' });
            this.eventEmitter.emit('notification.send', emitterData);
        }
        return updatedMilestoneData;
    }
    async autoCreateProjectFromApprovedQuotation(createDto, user) {
        var _a, _b;
        let submissionById;
        let quoteData = await this.prisma.quotation.findFirst({
            where: {
                id: createDto.quoteId
            },
            include: {
                Lead: {
                    include: {
                        Project: true
                    }
                },
                Project: true
            }
        });
        if (!quoteData || !quoteData.Lead) {
            throw {
                message: "No Quote / Lead data found",
                statusCode: 400
            };
        }
        if (quoteData.Lead.submissionById) {
            submissionById = quoteData.Lead.submissionById;
        }
        else if (createDto.submissionById) {
            submissionById = createDto.submissionById;
        }
        if (!submissionById) {
            throw {
                message: "Could not determine submitting company if it is DAT or Luxedesign",
                statusCode: 400
            };
        }
        let isAlreadyExist = await this.prisma.project.findFirst({
            where: {
                leadId: quoteData.Lead.id
            }
        });
        if (isAlreadyExist && isAlreadyExist.isDeleted === true) {
            await this.prisma.project.update({
                where: {
                    id: isAlreadyExist.id,
                },
                data: {
                    Lead: {
                        disconnect: {}
                    }
                }
            });
            isAlreadyExist = null;
        }
        if (isAlreadyExist) {
            let updatedQuoteData = await this.prisma.quotation.update({
                where: {
                    id: createDto.quoteId
                },
                data: {
                    status: constants_1.QuotationStatus.confirmed,
                    projectId: isAlreadyExist.id
                }
            });
            this.xeroQueue.add(xero_process_config_1.XeroProcessNames.updateQuotationStatus, {
                message: "Sync Quotation With Xero",
                data: updatedQuoteData
            }, { removeOnComplete: true });
            if (quoteData.Lead && quoteData.Lead.status !== constants_1.LeadsStatus.confirmed) {
                await this.prisma.leads.update({
                    where: {
                        id: quoteData.Lead.id
                    },
                    data: {
                        submissionById: submissionById,
                        projectTypeId: (createDto.projectTypeId) ? createDto.projectTypeId : undefined,
                        status: constants_1.LeadsStatus.confirmed,
                        Project: (quoteData.Lead && !quoteData.Lead.Project) ?
                            {
                                connect: {
                                    id: isAlreadyExist.id
                                }
                            } : undefined
                    }
                });
            }
            let existingReference = isAlreadyExist.referenceNumber;
            let newRef = quoteData.quoteNumber.replace("QU-", "");
            existingReference.replace(newRef, "");
            let newReference = existingReference + " " + newRef;
            let projectEstimate = isAlreadyExist.projectEstimate + quoteData.total;
            await this.prisma.project.update({
                where: {
                    id: isAlreadyExist.id
                }, data: {
                    referenceNumber: newReference,
                    projectEstimate: projectEstimate,
                    submissionById: submissionById,
                    projectTypeId: (createDto.projectTypeId) ? createDto.projectTypeId : undefined,
                    xeroReference: (!isAlreadyExist.xeroReference && createDto.xeroReference) ? createDto.xeroReference : undefined
                }
            });
            this.xeroQueue.add(xero_process_config_1.XeroProcessNames.syncProject, {
                message: "Sync Project With Xero",
                data: isAlreadyExist
            }, { removeOnComplete: true });
            if (((_a = quoteData.Lead) === null || _a === void 0 ? void 0 : _a.representativeId) && isAlreadyExist.clientId !== quoteData.Lead.representativeId) {
                await this.prisma.projectClient.upsert({
                    where: {
                        projectId_clientId: {
                            clientId: quoteData.Lead.representativeId,
                            projectId: isAlreadyExist.id
                        }
                    },
                    create: {
                        clientId: quoteData.Lead.representativeId,
                        projectId: isAlreadyExist.id,
                        isRepresentative: true
                    },
                    update: {
                        isRepresentative: true
                    }
                });
            }
            return isAlreadyExist;
        }
        let projectState = await this.prisma.projectState.findUnique({
            where: {
                slug: constants_1.KnownProjectStatus.new
            }
        });
        let newProject = await this.prisma.project.create({
            data: {
                title: createDto.title,
                instructions: createDto.instructions,
                submissionById: createDto.submissionById,
                clientId: quoteData.Lead.clientId,
                addedById: user.userId,
                projectTypeId: quoteData.Lead.projectTypeId,
                leadId: quoteData.Lead.id,
                referenceNumber: quoteData.quoteNumber.replace("QU-", ""),
                projectEstimate: quoteData.total,
                projectStateId: (projectState) ? projectState.id : undefined,
                onHold: true,
                startDate: (createDto.startDate) ? createDto.startDate : undefined,
                endDate: (createDto.endDate) ? createDto.endDate : undefined,
                comment: "Requires clearance from Finance for Advance Payment (AUTO-HOLD)",
                xeroReference: createDto.xeroReference,
                xeroTenantId: quoteData.Lead.xeroTenantId
            }
        });
        this.xeroQueue.add(xero_process_config_1.XeroProcessNames.syncProject, {
            message: "Sync Project With Xero",
            data: newProject
        }, { removeOnComplete: true });
        if ((_b = quoteData.Lead) === null || _b === void 0 ? void 0 : _b.representativeId) {
            await this.prisma.projectClient.create({
                data: {
                    projectId: newProject.id,
                    clientId: quoteData.Lead.representativeId,
                    isRepresentative: true
                }
            });
        }
        await this.prisma.leads.update({
            where: {
                id: quoteData.Lead.id
            },
            data: {
                submissionById: createDto.submissionById,
                projectTypeId: (createDto.projectTypeId) ? createDto.projectTypeId : undefined,
                Project: {
                    connect: {
                        id: newProject.id
                    }
                },
                status: constants_1.LeadsStatus.confirmed
            }
        });
        let allFiles = await this.prisma.enquiryAttachment.findMany({
            where: {
                leadId: quoteData.Lead.id
            }
        });
        let projectResources = [];
        allFiles.forEach((ele) => {
            let t = {
                title: ele.title,
                documentType: project_entity_1.ProjectDocumentsTypes.other,
                name: ele.title,
                file: ele.file,
                fileType: ele.mimeType,
                path: ele.file,
                isTemp: false,
                status: constants_1.FileStatus.Verified,
                addedById: user.userId,
                visibility: client_1.FileVisibility.organization,
                projectId: newProject.id,
                fileSize: ele.fileSize
            };
            projectResources.push(t);
        });
        if (projectResources.length > 0) {
            await this.prisma.fileManagement.createMany({
                data: projectResources
            });
        }
        let updatedQuotation = await this.prisma.quotation.update({
            where: {
                id: createDto.quoteId
            },
            data: {
                projectId: newProject.id,
                status: constants_1.QuotationStatus.confirmed
            }
        });
        this.xeroQueue.add(xero_process_config_1.XeroProcessNames.updateQuotationStatus, {
            message: "Sync Quotation Status With Xero",
            data: updatedQuotation
        }, { removeOnComplete: true });
        return updatedQuotation;
    }
    async checkForDuplicacy(checkQuoteDuplicacyDto) {
        let condition = {
            quoteNumber: checkQuoteDuplicacyDto.quoteNumber,
            isDeleted: false
        };
        if (checkQuoteDuplicacyDto.excludeId) {
            condition = Object.assign(Object.assign({}, condition), { id: {
                    not: checkQuoteDuplicacyDto.excludeId
                } });
        }
        let recordData = await this.prisma.quotation.findFirst({
            where: condition
        });
        if (recordData) {
            return true;
        }
        else {
            return false;
        }
    }
    async prepareUniqueQuoteNumber(leadId, revisionId) {
        let leadData;
        if (leadId) {
            leadData = await this.prisma.leads.findFirst({
                where: {
                    id: leadId
                },
                include: {
                    SubmissionBy: {
                        select: {
                            organizationCode: true
                        }
                    }
                }
            });
        }
        if (!leadId && revisionId) {
            leadData = await this.prisma.leads.findFirst({
                where: {
                    Quotation: {
                        some: {
                            id: revisionId
                        }
                    }
                },
                include: {
                    SubmissionBy: {
                        select: {
                            organizationCode: true
                        }
                    }
                }
            });
        }
        let prefix = "QU-" + ((leadData && leadData.SubmissionBy) ? leadData.SubmissionBy.organizationCode : "");
        let condition = {
            isDeleted: false
        };
        if (leadData && leadData.submissionById) {
            condition = Object.assign(Object.assign({}, condition), { Lead: {
                    submissionById: leadData.submissionById
                } });
        }
        let lastQuote = await this.prisma.quotation.findFirst({
            where: condition,
            orderBy: {
                id: 'desc'
            }
        });
        if (lastQuote) {
            if (lastQuote === null || lastQuote === void 0 ? void 0 : lastQuote.quoteNumber) {
                let ids = (0, common_2.extractIds)(lastQuote.quoteNumber);
                if (ids.length > 0) {
                    return prefix + String(ids[0] + 1).padStart(4, '0');
                }
                else {
                    return prefix + String(lastQuote.id + 1).padStart(4, '0');
                }
            }
            else {
                return prefix + String((lastQuote === null || lastQuote === void 0 ? void 0 : lastQuote.id) + 1).padStart(4, '0');
            }
        }
        else {
            return prefix + String(1).padStart(4, '0');
        }
    }
    async quickUpdate(quotationId, quickUpdateQuotation, user) {
        let recordData = await this.prisma.quotation.findUniqueOrThrow({
            where: {
                id: quotationId
            }
        });
        await this.prisma.leads.update({
            where: {
                id: recordData.leadId
            },
            data: {
                Project: {
                    update: {
                        projectTypeId: (quickUpdateQuotation.projectTypeId) ? quickUpdateQuotation.projectTypeId : undefined,
                    },
                    connect: {
                        id: quickUpdateQuotation.projectId
                    }
                },
                submissionById: quickUpdateQuotation.submissionById,
                projectTypeId: (quickUpdateQuotation.projectTypeId) ? quickUpdateQuotation.projectTypeId : undefined,
                Quotation: {
                    updateMany: {
                        where: {
                            leadId: recordData.leadId
                        },
                        data: {
                            projectId: quickUpdateQuotation.projectId
                        }
                    }
                }
            }
        });
        return this.findOne(quotationId);
    }
};
QuotationService = QuotationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, bull_1.InjectQueue)('xero')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService,
        event_emitter_1.EventEmitter2, Object])
], QuotationService);
exports.QuotationService = QuotationService;
//# sourceMappingURL=quotation.service.js.map