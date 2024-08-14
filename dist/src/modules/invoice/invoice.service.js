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
var InvoiceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceService = void 0;
const puppeteer_1 = require("puppeteer");
const fs = require("fs");
const ejs = require("ejs");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
const mail_service_1 = require("../../mail/mail.service");
const constants_1 = require("../../config/constants");
const client_dto_1 = require("../client/dto/client.dto");
const project_dto_1 = require("../project/dto/project.dto");
const organization_dto_1 = require("../organization/dto/organization.dto");
const common_2 = require("../../helpers/common");
const invoice_dto_1 = require("./dto/invoice.dto");
const fs_1 = require("fs");
const file_management_1 = require("../../helpers/file-management");
const bull_1 = require("@nestjs/bull");
const xero_process_config_1 = require("../xero-accounting/process/xero.process.config");
const leads_dto_1 = require("../leads/dto/leads.dto");
let InvoiceService = InvoiceService_1 = class InvoiceService {
    constructor(prisma, mailService, xeroQueue) {
        this.prisma = prisma;
        this.mailService = mailService;
        this.xeroQueue = xeroQueue;
        this.logger = new common_1.Logger(InvoiceService_1.name);
    }
    async create(createDto, user) {
        var _a;
        const { invoiceItems, milestoneIds } = createDto, rest = __rest(createDto, ["invoiceItems", "milestoneIds"]);
        let project = await this.prisma.project.findFirstOrThrow({
            where: {
                id: createDto.projectId
            },
            include: {
                Lead: {
                    select: leads_dto_1.LeadsDefaultAttributes
                },
                SubmissionBy: {
                    select: organization_dto_1.OrganizationDefaultAttributes
                }
            }
        });
        if (!project.SubmissionBy) {
            throw {
                message: "Could not determine submission by company. Please update Submission By in the project eg: DAT, DAT Abu Dhabi or Luxedesign",
                statusCode: 404
            };
        }
        let totalAmount = 0;
        let vatAmount = 0;
        let vatData = new Map();
        let invoiceLineItems = [];
        for (let i = 0; i < invoiceItems.length; i++) {
            let ele = invoiceItems[i];
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
            invoiceLineItems.push(Object.assign(Object.assign({}, ele), { taxAmount: lineVatAmount }));
        }
        let totalAmountWithVat = totalAmount + vatAmount;
        let record = await this.prisma.invoice.create({
            data: Object.assign(Object.assign({}, rest), { addedById: user.userId, clientId: project.clientId, xeroTenantId: (_a = project.Lead) === null || _a === void 0 ? void 0 : _a.xeroTenantId, subTotal: totalAmount, vatAmount: vatAmount, total: totalAmountWithVat, status: constants_1.InvoiceStatus.generated, InvoiceItems: {
                    createMany: {
                        data: invoiceLineItems.map((_a) => {
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
        if (record && milestoneIds) {
            let milestoneToUpdate = [];
            if (Array.isArray(milestoneIds)) {
                milestoneToUpdate = milestoneIds;
            }
            else {
                milestoneToUpdate = [milestoneIds];
            }
            if (milestoneToUpdate.length > 0) {
                await this.prisma.quotationMilestone.updateMany({
                    where: {
                        id: {
                            in: milestoneToUpdate
                        }
                    },
                    data: {
                        status: constants_1.MilestoneStatus.invoice_generated,
                        invoiceId: record.id
                    }
                });
            }
        }
        this.xeroQueue.add(xero_process_config_1.XeroProcessNames.syncInvoice, {
            message: "Sync Invoice With Xero",
            data: record
        }, { removeOnComplete: true });
        return record;
    }
    findAll(pagination, condition) {
        let skip = (pagination.perPage * (pagination.page - 1));
        let take = pagination.perPage;
        let records = this.prisma.invoice.findMany({
            where: condition,
            skip: skip,
            take: take,
            include: {
                _count: {
                    select: {
                        InvoiceFollowUp: {
                            where: {
                                isDeleted: false
                            }
                        }
                    }
                },
                InvoiceItems: true,
                QuotationMilestone: true,
                Project: {
                    select: project_dto_1.ProjectDefaultAttributes
                },
                Client: {
                    select: client_dto_1.ClientDefaultAttributes
                },
                InvoiceFollowUp: {
                    where: {
                        isDeleted: false
                    },
                    take: 1,
                    orderBy: {
                        addedDate: 'desc'
                    }
                },
            },
            orderBy: {
                addedDate: 'desc'
            }
        });
        return records;
    }
    findOne(id) {
        return this.prisma.invoice.findUnique({
            where: {
                id: id
            },
            include: {
                InvoiceItems: {
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
                    }
                },
                QuotationMilestone: true,
                Quotation: {
                    include: {
                        QuotationMilestone: true
                    }
                },
                Project: {
                    select: Object.assign(Object.assign({}, project_dto_1.ProjectDefaultAttributes), { SubmissionBy: {
                            select: organization_dto_1.OrganizationDefaultAttributes
                        } })
                },
                Client: {
                    select: client_dto_1.ClientDefaultAttributes
                }
            },
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    async update(id, updateDto, user) {
        const { invoiceItems, milestoneIds } = updateDto, rest = __rest(updateDto, ["invoiceItems", "milestoneIds"]);
        let recordData = await this.findOne(id);
        if (recordData.status !== constants_1.InvoiceStatus.generated) {
            throw {
                message: "You cannot modify the invoice once it is sent to client. Please mark as canceled and recreate the new invoice",
                statusCode: 400
            };
        }
        let updatedRecord = await this.prisma.invoice.update({
            data: Object.assign(Object.assign({}, rest), { modifiedById: user.userId, modifiedDate: new Date() }),
            where: {
                id: id
            }
        });
        if (updatedRecord && milestoneIds) {
            let milestoneToUpdate = [];
            if (Array.isArray(milestoneIds)) {
                milestoneToUpdate = milestoneIds;
            }
            else {
                milestoneToUpdate = [milestoneIds];
            }
            if (milestoneToUpdate.length > 0) {
                await this.prisma.quotationMilestone.updateMany({
                    where: {
                        id: {
                            in: milestoneToUpdate
                        }
                    },
                    data: {
                        status: constants_1.MilestoneStatus.invoice_generated,
                        invoiceId: updatedRecord.id
                    }
                });
            }
        }
        if (invoiceItems) {
            let allIds = [];
            invoiceItems.forEach((ele) => {
                if (ele.id) {
                    allIds.push(ele.id);
                }
            });
            await this.prisma.invoiceItem.deleteMany({
                where: {
                    invoiceId: updatedRecord.id,
                    NOT: {
                        id: {
                            in: allIds
                        }
                    }
                }
            });
            let newMileStone = [];
            let vatData = new Map();
            for (let i = 0; i < invoiceItems.length; i++) {
                let ele = invoiceItems[i];
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
                    let t = this.prisma.invoiceItem.update({
                        where: {
                            id: ele.id
                        },
                        data: {
                            invoiceId: updatedRecord.id,
                            amount: ele.amount,
                            quantity: ele.quantity,
                            taxAmount: lineVatAmount,
                            taxRateId: (ele.taxRateId) ? ele.taxRateId : undefined,
                            productId: (ele.productId) ? ele.productId : undefined,
                            accountId: (ele.accountId) ? ele.accountId : undefined,
                            title: ele.title
                        }
                    });
                    newMileStone.push(t);
                }
                else {
                    let t = this.prisma.invoiceItem.create({
                        data: {
                            invoiceId: updatedRecord.id,
                            amount: ele.amount,
                            title: ele.title,
                            quantity: ele.quantity,
                            taxAmount: lineVatAmount,
                            taxRateId: (ele.taxRateId) ? ele.taxRateId : undefined,
                            productId: (ele.productId) ? ele.productId : undefined,
                            accountId: (ele.accountId) ? ele.accountId : undefined,
                        }
                    });
                    newMileStone.push(t);
                }
            }
            await Promise.all(newMileStone);
        }
        await this.adjustTotalAfterUpdate(updatedRecord.id);
        this.xeroQueue.add(xero_process_config_1.XeroProcessNames.syncInvoice, {
            message: "Sync Invoice With Xero",
            data: updatedRecord
        }, { removeOnComplete: true });
        return this.findOne(updatedRecord.id);
    }
    async adjustTotalAfterUpdate(invoiceId) {
        let invoiceItems = await this.prisma.invoiceItem.findMany({
            where: {
                invoiceId: invoiceId
            }
        });
        let totalAmount = 0;
        let vatAmount = 0;
        invoiceItems.forEach((ele) => {
            totalAmount = totalAmount + (ele.quantity * ele.amount);
            vatAmount = vatAmount + ele.taxAmount;
        });
        let totalAmountWithVat = totalAmount + vatAmount;
        return this.prisma.invoice.update({
            where: {
                id: invoiceId
            },
            data: {
                subTotal: totalAmount,
                vatAmount: vatAmount,
                total: totalAmountWithVat
            }
        });
    }
    applyFilters(filters) {
        let condition = {
            isDeleted: false
        };
        if (Object.entries(filters).length > 0) {
            if (filters.__status) {
                condition = Object.assign(Object.assign({}, condition), { status: {
                        in: filters.__status
                    } });
            }
            if (filters.clientId) {
                condition = Object.assign(Object.assign({}, condition), { clientId: filters.clientId });
            }
            if (filters.hasConcerns) {
                condition = Object.assign(Object.assign({}, condition), { InvoiceFollowUp: {
                        some: {
                            isConcern: true,
                            isResolved: false
                        }
                    } });
            }
            if (filters.id) {
                condition = Object.assign(Object.assign({}, condition), { id: filters.id });
            }
            if (filters.invoiceNumber) {
                condition = Object.assign(Object.assign({}, condition), { invoiceNumber: {
                        contains: filters.invoiceNumber,
                        mode: 'insensitive'
                    } });
            }
            if (filters.projectTypeId) {
                condition = Object.assign(Object.assign({}, condition), { Project: {
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
        return condition;
    }
    countTotalRecord(filters) {
        return this.prisma.invoice.count({
            where: filters
        });
    }
    async submitInvoice(invoiceId, user) {
        let recordData = await this.findOne(invoiceId);
        if (recordData.status !== constants_1.InvoiceStatus.generated) {
            throw {
                message: "This invoice has already been submitted",
                statusCode: 400
            };
        }
        await this.prisma.invoice.update({
            where: {
                id: invoiceId
            },
            data: {
                status: constants_1.InvoiceStatus.sent,
                sentDate: new Date(),
                modifiedById: user.userId,
                QuotationMilestone: {
                    updateMany: {
                        where: {
                            invoiceId: invoiceId
                        },
                        data: {
                            status: constants_1.MilestoneStatus.invoice_sent
                        }
                    }
                }
            }
        });
        this.xeroQueue.add(xero_process_config_1.XeroProcessNames.updateInvoiceStatus, {
            message: "Sync Invoice Status With Xero",
            data: recordData
        }, { removeOnComplete: true });
        this.mailService.sendInvoiceToClient(recordData, user);
    }
    async markAsSent(invoiceId, user) {
        let recordData = await this.findOne(invoiceId);
        if (recordData.status !== constants_1.InvoiceStatus.generated) {
            throw {
                message: "This invoice has already been submitted",
                statusCode: 400
            };
        }
        let updatedRecord = await this.prisma.invoice.update({
            where: {
                id: invoiceId
            },
            data: {
                status: constants_1.InvoiceStatus.sent,
                sentDate: new Date(),
                modifiedById: user.userId,
                QuotationMilestone: {
                    updateMany: {
                        where: {
                            invoiceId: invoiceId
                        },
                        data: {
                            status: constants_1.MilestoneStatus.invoice_sent
                        }
                    }
                }
            }
        });
        this.xeroQueue.add(xero_process_config_1.XeroProcessNames.updateInvoiceStatus, {
            message: "Sync Invoice Status With Xero",
            data: recordData
        }, { removeOnComplete: true });
        return updatedRecord;
    }
    async updateStatus(invoiceId, invoiceStatusDto, user) {
        var _a;
        let recordData = await this.prisma.invoice.update({
            where: {
                id: invoiceId
            },
            data: {
                status: invoiceStatusDto.status
            },
            include: {
                Project: {
                    select: {
                        id: true,
                        onHold: true
                    }
                }
            }
        });
        if (invoiceStatusDto.status === constants_1.InvoiceStatus.paid) {
            await this.prisma.quotationMilestone.updateMany({
                where: {
                    invoiceId: invoiceId
                },
                data: {
                    status: constants_1.MilestoneStatus.invoice_paid
                }
            });
            if (invoiceStatusDto.resumeProject && ((_a = recordData.Project) === null || _a === void 0 ? void 0 : _a.onHold)) {
                await this.prisma.project.update({
                    where: {
                        id: recordData.Project.id
                    },
                    data: {
                        onHold: false,
                        comment: "Payment verified, project reactivated!",
                        projectHoldById: user.userId,
                    }
                });
            }
        }
        else if (invoiceStatusDto.status === constants_1.InvoiceStatus.canceled) {
            await this.prisma.quotationMilestone.updateMany({
                where: {
                    invoiceId: invoiceId
                },
                data: {
                    status: constants_1.MilestoneStatus.invoice_canceled
                }
            });
        }
        this.xeroQueue.add(xero_process_config_1.XeroProcessNames.updateInvoiceStatus, {
            message: "Sync Invoice Status With Xero",
            data: recordData
        }, { removeOnComplete: true });
        return recordData;
    }
    removeInvoice(invoiceId, user) {
        return this.prisma.invoice.update({
            where: {
                id: invoiceId
            },
            data: {
                isDeleted: true,
                modifiedById: user.userId,
                modifiedDate: new Date()
            }
        });
    }
    viewInvoicePdf(invoiceId) {
        return this.prisma.invoice.findUnique({
            where: {
                id: invoiceId
            },
            include: {
                QuotationMilestone: true,
                InvoiceItems: {
                    include: {
                        TaxRate: {
                            select: {
                                id: true,
                                rate: true,
                                title: true
                            }
                        }
                    }
                },
                Client: {
                    select: client_dto_1.ClientDefaultAttributes
                },
                Project: {
                    select: {
                        SubmissionBy: true,
                        Lead: {
                            include: {
                                Client: true,
                                SubmissionBy: {
                                    select: Object.assign(Object.assign({}, organization_dto_1.OrganizationDefaultAttributes), { taxRegistrationNumber: true, address: true })
                                }
                            }
                        },
                    }
                }
            }
        });
    }
    async generateInvoicePdf(invoiceId) {
        var _a;
        let invoiceData = await this.prisma.invoice.findUniqueOrThrow({
            where: {
                id: invoiceId
            },
            include: {
                Client: true,
                Project: {
                    include: {
                        SubmissionBy: true
                    }
                },
                InvoiceItems: {
                    include: {
                        TaxRate: {
                            select: {
                                id: true,
                                title: true,
                                rate: true
                            }
                        }
                    }
                }
            }
        });
        let clientData = invoiceData.Client;
        let submissionBy = (_a = invoiceData.Project) === null || _a === void 0 ? void 0 : _a.SubmissionBy;
        const browser = await puppeteer_1.default.launch({ headless: "new" });
        const page = await browser.newPage();
        const pageData = await fs.promises.readFile("views/pdf-templates/invoice.ejs", 'utf-8');
        const renderedContent = ejs.render(pageData, {
            clientData: clientData,
            invoice: invoiceData,
            submissionBy: submissionBy,
            convertDate: common_2.convertDate,
            taxData: (0, common_2.getTaxData)(invoiceData.InvoiceItems),
            addDaysToDate: common_2.addDaysToDate,
            getEnumKeyByEnumValue: common_2.getEnumKeyByEnumValue,
            SupervisionPaymentSchedule: constants_1.SupervisionPaymentSchedule
        });
        await page.setContent(renderedContent, { waitUntil: 'networkidle0', timeout: 10000 });
        let filename = "Invoice-" + (0, common_2.slugify)(clientData.name) + "-" + Date.now() + "__" + invoiceData.id + ".pdf";
        let fileLocation = (0, invoice_dto_1.getDynamicUploadPath)() + "/";
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
        await this.prisma.invoice.update({
            where: {
                id: invoiceId
            },
            data: {
                file: fileLocation + filename
            }
        });
        return this.findOne(invoiceId);
    }
    async checkForDuplicacy(checkInvoiceDuplicacyDto) {
        let condition = {
            invoiceNumber: checkInvoiceDuplicacyDto.invoiceNumber,
            isDeleted: false
        };
        if (checkInvoiceDuplicacyDto.excludeId) {
            condition = Object.assign(Object.assign({}, condition), { id: {
                    not: checkInvoiceDuplicacyDto.excludeId
                } });
        }
        let recordData = await this.prisma.invoice.findFirst({
            where: condition
        });
        if (recordData) {
            return true;
        }
        else {
            return false;
        }
    }
    async prepareUniqueInvoiceNumber(projectId) {
        let projectData;
        if (projectId) {
            let projectData = await this.prisma.project.findFirst({
                where: {
                    id: projectId
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
        let invoicePrefix = "INV-" + ((projectData && projectData.SubmissionBy) ? projectData.SubmissionBy.organizationCode : "");
        let condition = {
            isDeleted: false,
        };
        if (projectData && projectData.submissionById) {
            condition = Object.assign(Object.assign({}, condition), { Project: {
                    submissionById: projectData.submissionById
                } });
        }
        let lastInvoice = await this.prisma.invoice.findFirst({
            where: condition,
            orderBy: {
                id: 'desc'
            }
        });
        if (lastInvoice) {
            if (lastInvoice.invoiceNumber) {
                let ids = (0, common_2.extractIds)(lastInvoice.invoiceNumber);
                if (ids.length > 0) {
                    return invoicePrefix + String(ids[0] + 1).padStart(4, '0');
                }
                else {
                    return invoicePrefix + String(lastInvoice.id + 1).padStart(4, '0');
                }
            }
            else {
                return invoicePrefix + String(lastInvoice.id + 1).padStart(4, '0');
            }
        }
        else {
            return invoicePrefix + String(1).padStart(4, '0');
        }
    }
    async quickUpdate(invoiceId, quickUpdate, user) {
        await this.prisma.invoice.update({
            where: {
                id: invoiceId
            },
            data: {
                projectId: quickUpdate.projectId
            }
        });
        return this.findOne(invoiceId);
    }
    findAllNotes(invoiceId) {
        return this.prisma.invoiceFollowUp.findMany({
            where: {
                invoiceId: invoiceId,
                isDeleted: false
            },
            orderBy: {
                addedDate: 'desc'
            },
            include: {
                AddedBy: {
                    select: {
                        id: true,
                        uuid: true,
                        firstName: true,
                        lastName: true,
                        profile: true,
                        email: true,
                    }
                }
            }
        });
    }
    async addNote(invoiceId, createNote, user) {
        return this.prisma.invoiceFollowUp.create({
            data: {
                invoiceId: invoiceId,
                isConcern: createNote.isConcern,
                note: createNote.note,
                addedById: user.userId,
            }
        });
    }
    removeNote(noteId) {
        return this.prisma.invoiceFollowUp.update({
            where: {
                id: noteId
            },
            data: {
                isDeleted: true
            }
        });
    }
    markConcernAsResolved(noteId) {
        return this.prisma.invoiceFollowUp.update({
            where: {
                id: noteId
            },
            data: {
                isResolved: true
            }
        });
    }
};
InvoiceService = InvoiceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, bull_1.InjectQueue)('xero')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService, Object])
], InvoiceService);
exports.InvoiceService = InvoiceService;
//# sourceMappingURL=invoice.service.js.map