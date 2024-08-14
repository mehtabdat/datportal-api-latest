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
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
const constants_1 = require("../config/constants");
const prisma_service_1 = require("../prisma.service");
const file_management_1 = require("../helpers/file-management");
const common_2 = require("../helpers/common");
const fs_1 = require("fs");
let MailService = MailService_1 = class MailService {
    constructor(mailerService, prisma) {
        this.mailerService = mailerService;
        this.prisma = prisma;
        this.logger = new common_1.Logger(MailService_1.name);
    }
    resolveOrigin(origin) {
        return (constants_1.HOSTS.activeFrontendDomains.includes(origin)) ? origin : constants_1.HOSTS.defaultFrontendDomain;
    }
    async sendUserPasswordResetLink(emailData) {
        let resetLink = this.resolveOrigin(emailData.origin) + "/reset-password/" + emailData.token;
        let context = Object.assign(Object.assign({}, constants_1.ejsTemplateDefaults), { emailTitle: "Reset your password", hideFooter: true, firstName: emailData.user.firstName, url: resetLink });
        const stack = new Error().stack;
        const calleFunctionName = stack.split('at ')[2].split(' ')[0];
        this.logSentEmail({
            email: emailData.user.email,
            subject: "Reset your DAT project portal Account Password",
            data: context,
            template: "./password-reset",
            calleFunction: calleFunctionName
        });
        await this.mailerService.sendMail({
            to: emailData.user.email,
            subject: 'Reset your DAT project portal Account Password',
            template: './password-reset',
            context: context,
        });
    }
    async sendOtpEmail(user, otpCode) {
        let context = Object.assign(Object.assign({}, constants_1.ejsTemplateDefaults), { emailTitle: "OTP Code", hideFooter: true, firstName: user.firstName, otpCode: otpCode });
        const stack = new Error().stack;
        const calleFunctionName = stack.split('at ')[2].split(' ')[0];
        this.logSentEmail({
            email: user.email,
            subject: "DAT Project Portal Account Verification Code",
            data: context,
            template: "./email-otp",
            calleFunction: calleFunctionName
        });
        await this.mailerService.sendMail({
            to: user.email,
            subject: 'DAT Project Portal Account Verification Code',
            template: './email-otp',
            context: context,
        });
    }
    async logSentEmail(data) {
        await this.prisma.mailSentLogs.create({
            data: data
        });
    }
    findMailSentLogs(pagination, sorting, condition) {
        let skip = (pagination.perPage * (pagination.page - 1));
        let take = pagination.perPage;
        let __sorter = { [sorting.sortByField]: sorting.sortOrder };
        return this.prisma.mailSentLogs.findMany({
            where: condition,
            skip: skip,
            take: take,
            orderBy: __sorter,
        });
    }
    applyFilters(filters) {
        let condition = {};
        if (Object.entries(filters).length > 0) {
            if (filters.email) {
                condition = Object.assign(Object.assign({}, condition), { email: filters.email });
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
            if (filters.subject) {
                condition = Object.assign(Object.assign({}, condition), { subject: {
                        contains: filters.subject,
                        mode: 'insensitive'
                    } });
            }
            if (filters.template) {
                condition = Object.assign(Object.assign({}, condition), { template: {
                        contains: filters.template,
                        mode: 'insensitive'
                    } });
            }
        }
        return condition;
    }
    countTotalRecord(condition) {
        return this.prisma.mailSentLogs.count({
            where: condition
        });
    }
    async sendLeadsEnquiryEmail(user, leads, link) {
        let unsubscribeLink = "";
        let propertyLink = link;
        let emailData = Object.assign(Object.assign({}, constants_1.ejsTemplateDefaults), { emailTitle: "New Enquiry PropertyID: ", firstName: user.firstName, lastName: user.lastName, unsubscribeUrl: unsubscribeLink, leads: leads, propertyLink: propertyLink });
        const stack = new Error().stack;
        const calleFunctionName = stack.split('at ')[2].split(' ')[0];
        this.logSentEmail({
            email: user.email,
            subject: emailData.emailTitle,
            data: emailData,
            template: "./email-leads",
            calleFunction: calleFunctionName
        });
        await this.mailerService.sendMail({
            to: (process.env.ENVIRONMENT === "development") ? constants_1.defaultYallahEmail : user.email,
            subject: emailData.emailTitle,
            template: './email-leads',
            context: emailData
        });
    }
    async sendQuotationToClient(quotation, user) {
        var _a, _b;
        let emailData = Object.assign(Object.assign({}, constants_1.ejsTemplateDefaults), { hideFooter: true, emailTitle: "Quotation - " + quotation.quoteNumber, clientData: (_a = quotation.Lead) === null || _a === void 0 ? void 0 : _a.Client, lead: quotation.Lead, submissionBy: (_b = quotation.Lead) === null || _b === void 0 ? void 0 : _b.SubmissionBy, quotation: quotation });
        const stack = new Error().stack;
        const calleFunctionName = stack.split('at ')[2].split(' ')[0];
        this.logSentEmail({
            email: emailData.clientData.email,
            subject: emailData.emailTitle,
            data: emailData,
            template: "./quotation",
            calleFunction: calleFunctionName
        });
        let readStream;
        if (quotation.file) {
            readStream = (0, file_management_1.getFileStream)(quotation.file);
        }
        const pathParts = quotation.file.split('/');
        const filename = pathParts[pathParts.length - 1];
        await this.mailerService.sendMail({
            to: (process.env.ENVIRONMENT === "development") ? constants_1.defaultYallahEmail : emailData.clientData.email,
            subject: emailData.emailTitle,
            template: './quotation',
            context: emailData,
            cc: (process.env.ENVIRONMENT === "development") ? constants_1.defaultYallahAlternateEmail : user.userEmail,
            attachments: [{
                    filename: filename,
                    content: readStream,
                    contentDisposition: 'attachment'
                }]
        });
    }
    async sendInvoiceToClient(invoice, user) {
        var _a;
        let emailData = Object.assign(Object.assign({}, constants_1.ejsTemplateDefaults), { hideFooter: true, emailTitle: "Invoice - " + invoice.invoiceNumber, clientData: invoice === null || invoice === void 0 ? void 0 : invoice.Client, project: invoice.Project, submissionBy: (_a = invoice.Project) === null || _a === void 0 ? void 0 : _a.SubmissionBy });
        const stack = new Error().stack;
        const calleFunctionName = stack.split('at ')[2].split(' ')[0];
        this.logSentEmail({
            email: emailData.clientData.email,
            subject: emailData.emailTitle,
            data: emailData,
            template: "./invoice",
            calleFunction: calleFunctionName
        });
        let readStream;
        if (invoice.file) {
            readStream = (0, file_management_1.getFileStream)(invoice.file);
        }
        const pathParts = invoice.file.split('/');
        const filename = pathParts[pathParts.length - 1];
        await this.mailerService.sendMail({
            to: (process.env.ENVIRONMENT === "development") ? constants_1.defaultYallahEmail : emailData.clientData.email,
            from: `"DATP Finance Team" <${user.userEmail}>`,
            subject: emailData.emailTitle,
            template: './invoice',
            context: emailData,
            cc: (process.env.ENVIRONMENT === "development") ? constants_1.defaultYallahAlternateEmail : user.userEmail,
            attachments: [{
                    filename: filename,
                    content: readStream,
                    contentDisposition: 'attachment'
                }]
        });
    }
    async sendQuotationNotification(quotation, userEmails) {
        var _a;
        let emailData = Object.assign(Object.assign({}, constants_1.ejsTemplateDefaults), { hideFooter: false, emailTitle: "Quotation Approved - " + quotation.quoteNumber, clientData: (_a = quotation.Lead) === null || _a === void 0 ? void 0 : _a.Client });
        const stack = new Error().stack;
        const calleFunctionName = stack.split('at ')[2].split(' ')[0];
        this.logSentEmail({
            email: (Array.isArray(userEmails)) ? userEmails.join(",") : userEmails,
            subject: emailData.emailTitle,
            data: emailData,
            template: "./quotation-approved-notification",
            calleFunction: calleFunctionName
        });
        let readStream;
        if (quotation.file) {
            readStream = (0, file_management_1.getFileStream)(quotation.file);
        }
        const pathParts = quotation.file.split('/');
        const filename = pathParts[pathParts.length - 1];
        await this.mailerService.sendMail({
            to: (process.env.ENVIRONMENT === "development") ? constants_1.defaultYallahEmail : userEmails,
            subject: emailData.emailTitle,
            template: './quotation-approved-notification',
            context: emailData,
            attachments: [{
                    filename: filename,
                    content: readStream,
                    contentDisposition: 'attachment'
                }]
        });
    }
    async sendMilestoneCompletedNotification(project, completedBy, userEmails) {
        let emailData = Object.assign(Object.assign({}, constants_1.ejsTemplateDefaults), { hideFooter: false, emailTitle: "Milestone Completed of Project - " + project.title, user: completedBy, project: project });
        const stack = new Error().stack;
        const calleFunctionName = stack.split('at ')[2].split(' ')[0];
        this.logSentEmail({
            email: (Array.isArray(userEmails)) ? userEmails.join(",") : userEmails,
            subject: emailData.emailTitle,
            data: emailData,
            template: "./quotation-milestone-completed-notification",
            calleFunction: calleFunctionName
        });
        await this.mailerService.sendMail({
            to: (process.env.ENVIRONMENT === "development") ? constants_1.defaultYallahEmail : userEmails,
            subject: emailData.emailTitle,
            template: './quotation-milestone-completed-notification',
            context: emailData,
        });
    }
    async sendEnquiryConfirmedNotification(lead, client, confirmedBy, userEmails) {
        let emailData = Object.assign(Object.assign({}, constants_1.ejsTemplateDefaults), { hideFooter: false, emailTitle: "Enquiry Confirmed - LEAD-" + lead.id, user: confirmedBy, clientData: client, lead: lead });
        const stack = new Error().stack;
        const calleFunctionName = stack.split('at ')[2].split(' ')[0];
        this.logSentEmail({
            email: (Array.isArray(userEmails)) ? userEmails.join(",") : userEmails,
            subject: emailData.emailTitle,
            data: emailData,
            template: "./enquiry-confirmed-notification",
            calleFunction: calleFunctionName
        });
        await this.mailerService.sendMail({
            to: (process.env.ENVIRONMENT === "development") ? constants_1.defaultYallahEmail : userEmails,
            subject: emailData.emailTitle,
            template: './enquiry-confirmed-notification',
            context: emailData,
        });
    }
    async sendQuotationFollowupNotification(userEmails, quotationCount, salutation) {
        let emailData = Object.assign(Object.assign({}, constants_1.ejsTemplateDefaults), { hideFooter: false, emailTitle: quotationCount + " assigned quotations pending for approval or submission", quotationCount: quotationCount, salutation: (salutation) ? salutation : "Team" });
        const stack = new Error().stack;
        const calleFunctionName = stack.split('at ')[2].split(' ')[0];
        this.logSentEmail({
            email: (Array.isArray(userEmails)) ? userEmails.join(",") : userEmails,
            subject: emailData.emailTitle,
            data: emailData,
            template: "./quotation-followup-notification",
            calleFunction: calleFunctionName
        });
        await this.mailerService.sendMail({
            to: (process.env.ENVIRONMENT === "development") ? constants_1.defaultYallahEmail : userEmails,
            subject: emailData.emailTitle,
            template: './quotation-followup-notification',
            context: emailData,
        });
    }
    async sendNewProjectNotification(project, client, submissionBy, userEmails) {
        let emailData = Object.assign(Object.assign({}, constants_1.ejsTemplateDefaults), { hideFooter: false, emailTitle: "New Project has been added to the portal -" + project.referenceNumber + " | " + project.title, clientData: client, submissionBy: submissionBy, project: project });
        const stack = new Error().stack;
        const calleFunctionName = stack.split('at ')[2].split(' ')[0];
        this.logSentEmail({
            email: (Array.isArray(userEmails)) ? userEmails.join(",") : userEmails,
            subject: emailData.emailTitle,
            data: emailData,
            template: "./new-project-notification",
            calleFunction: calleFunctionName
        });
        await this.mailerService.sendMail({
            to: (process.env.ENVIRONMENT === "development") ? constants_1.defaultYallahEmail : userEmails,
            subject: emailData.emailTitle,
            template: './new-project-notification',
            context: emailData,
        });
    }
    async sendProjectResumedNotification(project, client, submissionBy, userEmails) {
        let emailData = Object.assign(Object.assign({}, constants_1.ejsTemplateDefaults), { hideFooter: false, emailTitle: "Project Resumed -" + project.referenceNumber + " | " + project.title, clientData: client, submissionBy: submissionBy, project: project });
        const stack = new Error().stack;
        const calleFunctionName = stack.split('at ')[2].split(' ')[0];
        this.logSentEmail({
            email: (Array.isArray(userEmails)) ? userEmails.join(",") : userEmails,
            subject: emailData.emailTitle,
            data: emailData,
            template: "./project-resumed-notification",
            calleFunction: calleFunctionName
        });
        await this.mailerService.sendMail({
            to: (process.env.ENVIRONMENT === "development") ? constants_1.defaultYallahEmail : userEmails,
            subject: emailData.emailTitle,
            template: './project-resumed-notification',
            context: emailData,
        });
    }
    async sendProjectHoldNotification(project, client, submissionBy, userEmails) {
        let emailData = Object.assign(Object.assign({}, constants_1.ejsTemplateDefaults), { hideFooter: false, emailTitle: "Project has been temporarily placed on hold -" + project.referenceNumber + " | " + project.title, clientData: client, submissionBy: submissionBy, project: project });
        const stack = new Error().stack;
        const calleFunctionName = stack.split('at ')[2].split(' ')[0];
        this.logSentEmail({
            email: (Array.isArray(userEmails)) ? userEmails.join(",") : userEmails,
            subject: emailData.emailTitle,
            data: emailData,
            template: "./project-hold-notification",
            calleFunction: calleFunctionName
        });
        await this.mailerService.sendMail({
            to: (process.env.ENVIRONMENT === "development") ? constants_1.defaultYallahEmail : userEmails,
            subject: emailData.emailTitle,
            template: './project-hold-notification',
            context: emailData,
        });
    }
    async sendProjectMemberNotification(project, projectRole, client, submissionBy, user) {
        let emailData = Object.assign(Object.assign({}, constants_1.ejsTemplateDefaults), { hideFooter: false, emailTitle: "You have been added to a project -" + project.referenceNumber + " | " + project.title + " as " + projectRole, clientData: client, submissionBy: submissionBy, project: project, projectRole: projectRole, user: user });
        const stack = new Error().stack;
        const calleFunctionName = stack.split('at ')[2].split(' ')[0];
        this.logSentEmail({
            email: user.email,
            subject: emailData.emailTitle,
            data: emailData,
            template: "./project-member-add-notification",
            calleFunction: calleFunctionName
        });
        await this.mailerService.sendMail({
            to: (process.env.ENVIRONMENT === "development") ? constants_1.defaultYallahEmail : user.email,
            subject: emailData.emailTitle,
            template: './project-member-add-notification',
            context: emailData,
        });
    }
    async shareProjectFilesToClient(project, files, user) {
        this.logger.log("Preparing data to share files to client");
        let emailData = Object.assign(Object.assign({}, constants_1.ejsTemplateDefaults), { hideFooter: false, emailTitle: "Files Shared - Project:" + project.title, clientData: project === null || project === void 0 ? void 0 : project.Client, attatchZipLink: false, zipFileLink: "", zipFileName: "" });
        const stack = new Error().stack;
        const calleFunctionName = stack.split('at ')[2].split(' ')[0];
        let allClientEmails = [project.Client.email];
        if (project.ProjectClient && project.ProjectClient.length > 0) {
            project.ProjectClient.forEach((ele) => {
                allClientEmails.push(ele.email);
            });
        }
        this.logSentEmail({
            email: (Array.isArray(allClientEmails)) ? allClientEmails.join(",") : allClientEmails,
            subject: emailData.emailTitle,
            data: emailData,
            template: "./share-file-to-client",
            calleFunction: calleFunctionName
        });
        let attatchments = [];
        let allFilesKeys = [];
        let totalFileSize = 0;
        files.forEach((ele) => {
            totalFileSize = totalFileSize + ele.fileSize;
            allFilesKeys.push(ele.path);
        });
        let totalFileSizeInMb = totalFileSize / 1024;
        if (totalFileSizeInMb < 22) {
            this.logger.log("Files size is lesser than threshold, sending in attatchment");
            files.forEach((ele) => {
                let readStream;
                if (ele.path) {
                    readStream = (0, file_management_1.getFileStream)(ele.path);
                }
                const pathParts = ele.path.split('/');
                const filename = pathParts[pathParts.length - 1];
                attatchments.push({
                    filename: filename,
                    content: readStream,
                    contentDisposition: 'attachment'
                });
            });
        }
        else {
            let zipFileName = Date.now() + "-" + (0, common_2.generateRandomName)(20) + ".zip";
            let zipFilepath = "public/shared/" + project.slug + "/";
            if (!(0, fs_1.existsSync)(zipFilepath)) {
                (0, fs_1.mkdirSync)(zipFilepath, { recursive: true });
            }
            let filePath = zipFilepath + zipFileName;
            await (0, file_management_1.createZipAndUpload)(allFilesKeys, filePath);
            this.logger.log("Zipped created successfully, sending email...");
            emailData.attatchZipLink = true;
            emailData.zipFileLink = filePath;
            emailData.zipFileName = zipFileName;
        }
        await this.mailerService.sendMail({
            to: (process.env.ENVIRONMENT === "development") ? constants_1.defaultYallahEmail : allClientEmails,
            cc: (process.env.ENVIRONMENT === "development") ? constants_1.defaultYallahAlternateEmail : user.userEmail,
            subject: emailData.emailTitle,
            template: './share-file-to-client',
            context: emailData,
            attachments: attatchments
        });
    }
};
MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService, prisma_service_1.PrismaService])
], MailService);
exports.MailService = MailService;
//# sourceMappingURL=mail.service.js.map