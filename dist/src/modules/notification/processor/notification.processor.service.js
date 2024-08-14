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
var NotificationProcessorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationProcessorService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma.service");
const notification_dto_1 = require("../dto/notification.dto");
const quotation_permissions_1 = require("../../quotation/quotation.permissions");
const invoice_permissions_1 = require("../../invoice/invoice.permissions");
const constants_1 = require("../../../config/constants");
const user_dto_1 = require("../../user/dto/user.dto");
const client_dto_1 = require("../../client/dto/client.dto");
const mail_service_1 = require("../../../mail/mail.service");
const leads_permissions_1 = require("../../leads/leads.permissions");
const project_permissions_1 = require("../../project/project.permissions");
const organization_dto_1 = require("../../organization/dto/organization.dto");
const common_2 = require("../../../helpers/common");
const transactions_permissions_1 = require("../../transactions/transactions.permissions");
let NotificationProcessorService = NotificationProcessorService_1 = class NotificationProcessorService {
    constructor(prisma, mailService) {
        this.prisma = prisma;
        this.mailService = mailService;
        this.logger = new common_1.Logger(NotificationProcessorService_1.name);
        this.activeJob = null;
        this.jobQueue = [];
        this.isProcessing = false;
    }
    async sendNotification(eventData) {
        try {
            switch (eventData.moduleName) {
                case 'invoice':
                    await this.sendInvoiceNotification(eventData.recordId);
                    break;
                case 'reimbursement':
                    await this.sendReimbursementNotification(eventData.recordId);
                    break;
                case 'newProject':
                    await this.sendNewProjectNotification(eventData.recordId);
                    break;
                case 'projectMembersAddition':
                    await this.sendProjectMembersChangeNotification(eventData.recordId, eventData.additionalData);
                    break;
                case 'quotationApproved':
                    await this.sendQuotationNotification(eventData.recordId);
                    break;
                case 'milestoneCompleted':
                    await this.sendMilestoneCompletedNotification(eventData.recordId);
                    break;
                case 'enquiryConfirmed':
                    await this.sendEnquiryConfirmedNotification(eventData.recordId);
                    break;
                case 'projectHoldNotification':
                    await this.sendProjectHoldNotification(eventData.recordId);
                    break;
                case 'projectResumeNotification':
                    await this.sendProjectResumeNotification(eventData.recordId);
                    break;
                case 'dailyNotification':
                    await this.sendDailyNotification();
                    break;
            }
        }
        catch (err) {
            this.logger.log("Error while sending notificaiton. Event:", eventData, " Message:", err.message);
        }
        finally {
            return this.handleNext();
        }
    }
    handleNext() {
        if (this.jobQueue.length > 0) {
            let activeJob = this.jobQueue.shift();
            this.activeJob = activeJob;
            console.log("Starting Sending Notification", activeJob);
            this.sendNotification(activeJob);
        }
        else {
            console.log("No more notifications to send in the queue, clearing the available resources");
            this.isProcessing = false;
        }
    }
    async sendInvoiceNotification(recordId) {
        return this.handleNext();
    }
    async sendProjectHoldNotification(recordId) {
        try {
            let recordData = await this.prisma.project.findUniqueOrThrow({
                where: {
                    id: recordId
                },
                select: {
                    id: true,
                    referenceNumber: true,
                    slug: true,
                    title: true,
                    onHold: true,
                    comment: true,
                    ProjectState: {
                        select: {
                            title: true,
                            slug: true,
                            id: true
                        }
                    },
                    Client: {
                        select: client_dto_1.ClientDefaultAttributes
                    },
                    SubmissionBy: {
                        select: organization_dto_1.OrganizationDefaultAttributes
                    }
                }
            });
            this.logger.log("Find Users who can receive project Notification");
            let subscribedUsers = await this.findProjectUsers(recordId);
            let emailSubscribers = await this.findProjectUsers(recordId, true);
            this.logger.log("Creating Project Hold Notification");
            await this.prisma.notification.create({
                data: {
                    message: `Project has been temporarily placed on hold - ${recordData.referenceNumber} | ${recordData.title}.`,
                    link: constants_1.HOSTS.defaultAdminDomain + "/projects/" + recordData.slug + "?id=" + (recordData === null || recordData === void 0 ? void 0 : recordData.id),
                    linkLabel: "View Project",
                    icon: notification_dto_1.notificationFileUploadPath + "/common/inventory.png",
                    type: 'user',
                    Subscribers: {
                        createMany: {
                            data: subscribedUsers.map((ele) => {
                                return {
                                    userId: ele.id,
                                    read: false
                                };
                            })
                        }
                    }
                }
            });
            if (emailSubscribers.length > 0) {
                let allUserEmails = emailSubscribers.map((ele) => ele.email);
                this.logger.log("Sending Project Resumed Notification to " + allUserEmails.join(", "));
                await this.mailService.sendProjectHoldNotification(recordData, recordData.Client, recordData.SubmissionBy, allUserEmails);
            }
        }
        catch (err) {
            this.logger.error("Some error while sending project hold notification", err.message);
        }
        finally {
            return this.handleNext();
        }
    }
    async sendProjectResumeNotification(recordId) {
        try {
            let recordData = await this.prisma.project.findUniqueOrThrow({
                where: {
                    id: recordId
                },
                select: {
                    id: true,
                    referenceNumber: true,
                    slug: true,
                    title: true,
                    onHold: true,
                    comment: true,
                    ProjectState: {
                        select: {
                            title: true,
                            slug: true,
                            id: true
                        }
                    },
                    Client: {
                        select: client_dto_1.ClientDefaultAttributes
                    },
                    SubmissionBy: {
                        select: organization_dto_1.OrganizationDefaultAttributes
                    }
                }
            });
            this.logger.log("Find Users who can receive project Notification");
            let subscribedUsers = await this.findProjectUsers(recordId);
            let emailSubscribers = await this.findProjectUsers(recordId, true);
            this.logger.log("Creating Project Resumed Notification");
            await this.prisma.notification.create({
                data: {
                    message: `Project Resumed - ${recordData.referenceNumber} | ${recordData.title}.`,
                    link: constants_1.HOSTS.defaultAdminDomain + "/projects/" + recordData.slug + "?id=" + (recordData === null || recordData === void 0 ? void 0 : recordData.id),
                    linkLabel: "View Project",
                    icon: notification_dto_1.notificationFileUploadPath + "/common/inventory.png",
                    type: 'user',
                    Subscribers: {
                        createMany: {
                            data: subscribedUsers.map((ele) => {
                                return {
                                    userId: ele.id,
                                    read: false
                                };
                            })
                        }
                    }
                }
            });
            if (emailSubscribers.length > 0) {
                let allUserEmails = emailSubscribers.map((ele) => ele.email);
                this.logger.log("Sending Project Resumed Notification to " + allUserEmails.join(", "));
                await this.mailService.sendProjectResumedNotification(recordData, recordData.Client, recordData.SubmissionBy, allUserEmails);
            }
        }
        catch (err) {
            this.logger.error("Some error while sending project resumed notification", err.message);
        }
        finally {
            return this.handleNext();
        }
    }
    async sendReimbursementNotification(recordId) {
        try {
        }
        catch (err) {
            this.logger.error("Some error while sending reimbursement notification", err.message);
        }
        finally {
            return this.handleNext();
        }
    }
    async sendNewProjectNotification(recordId) {
        let recordData = await this.prisma.project.findUniqueOrThrow({
            where: {
                id: recordId
            },
            select: {
                id: true,
                referenceNumber: true,
                slug: true,
                title: true,
                onHold: true,
                comment: true,
                ProjectState: {
                    select: {
                        title: true,
                        slug: true,
                        id: true
                    }
                },
                Client: {
                    select: client_dto_1.ClientDefaultAttributes
                },
                SubmissionBy: {
                    select: organization_dto_1.OrganizationDefaultAttributes
                }
            }
        });
        this.logger.log("Find Users who can receive new project Notification");
        let subscribedUsers = await this.findUsersBasedOnPermission(project_permissions_1.ProjectPermissionSet.REAL_ALL_PROJECT);
        let emailSubscribers = await this.findUsersBasedOnPermission(project_permissions_1.ProjectPermissionSet.REAL_ALL_PROJECT, true);
        this.logger.log("Creating New Project Notification");
        await this.prisma.notification.create({
            data: {
                message: `New project has been added to the system. ${recordData.referenceNumber} | ${recordData.title}.`,
                link: constants_1.HOSTS.defaultAdminDomain + "/projects/" + recordData.slug + "?id=" + (recordData === null || recordData === void 0 ? void 0 : recordData.id),
                linkLabel: "View Project",
                icon: notification_dto_1.notificationFileUploadPath + "/common/inventory.png",
                type: 'user',
                Subscribers: {
                    createMany: {
                        data: subscribedUsers.map((ele) => {
                            return {
                                userId: ele.id,
                                read: false
                            };
                        })
                    }
                }
            }
        });
        if (emailSubscribers.length > 0) {
            let allUserEmails = emailSubscribers.map((ele) => ele.email);
            this.logger.log("Sending New Project Email Notification to " + allUserEmails.join(", "));
            await this.mailService.sendNewProjectNotification(recordData, recordData.Client, recordData.SubmissionBy, allUserEmails);
        }
        return this.handleNext();
    }
    async sendProjectMembersChangeNotification(recordId, additionalData) {
        let recordData = await this.prisma.project.findUniqueOrThrow({
            where: {
                id: recordId
            },
            select: {
                id: true,
                referenceNumber: true,
                slug: true,
                title: true,
                onHold: true,
                comment: true,
                ProjectState: {
                    select: {
                        title: true,
                        slug: true,
                        id: true
                    }
                },
                Client: {
                    select: client_dto_1.ClientDefaultAttributes
                },
                SubmissionBy: {
                    select: organization_dto_1.OrganizationDefaultAttributes
                }
            }
        });
        let allMembers = additionalData;
        if (Array.isArray(allMembers)) {
            allMembers.forEach((ele) => {
                if (ele.projectId && ele.projectRole && ele.userId) {
                    this.sendEachProjectMembersChangeNotification(recordData, ele);
                }
            });
        }
        else {
            if (allMembers.projectId && allMembers.projectRole && allMembers.userId) {
                this.sendEachProjectMembersChangeNotification(recordData, allMembers);
            }
        }
    }
    async sendEachProjectMembersChangeNotification(recordData, addedMember) {
        let role = (0, common_2.getEnumKeyByEnumValue)(constants_1.ProjectRole, addedMember.projectRole);
        role = (0, common_2.camelToSnakeCase)(role);
        role = (0, common_2.toSentenceCase)(role);
        if (addedMember) {
            let isUserSubscribed = await this.prisma.user.findFirst({
                where: {
                    AND: [
                        {
                            id: addedMember.userId,
                            isDeleted: false,
                        },
                        {
                            OR: [
                                {
                                    UserAlertsSetting: {
                                        some: {
                                            AlertsType: {
                                                slug: "general"
                                            },
                                            email: true
                                        }
                                    },
                                },
                                {
                                    UserAlertsSetting: {
                                        none: {
                                            AlertsType: {
                                                slug: 'general'
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                },
                select: user_dto_1.UserDefaultAttributes
            });
            this.logger.log("Creating Project Member Notification");
            await this.prisma.notification.create({
                data: {
                    message: `You have been added to a project. ${recordData.referenceNumber} | ${recordData.title} as ${role}.`,
                    link: constants_1.HOSTS.defaultAdminDomain + "/projects/" + recordData.slug + "?id=" + (recordData === null || recordData === void 0 ? void 0 : recordData.id),
                    linkLabel: "View Project",
                    icon: notification_dto_1.notificationFileUploadPath + "/common/inventory.png",
                    type: 'user',
                    Subscribers: {
                        create: {
                            userId: addedMember.userId,
                            read: false
                        }
                    }
                }
            });
            if (isUserSubscribed) {
                this.logger.log("Sending Project Member Add Email Notification to " + isUserSubscribed.email);
                await this.mailService.sendProjectMemberNotification(recordData, role, recordData.Client, recordData.SubmissionBy, isUserSubscribed);
            }
        }
        return this.handleNext();
    }
    getQuotation(recordId) {
        this.logger.log("Finding quotation data to send notification");
        return this.prisma.quotation.findUniqueOrThrow({
            where: {
                id: recordId
            },
            include: {
                Lead: {
                    include: {
                        Client: true
                    }
                }
            }
        });
    }
    getFinanceUsers() {
        this.logger.log("Finding finance users who are subscribed to email notification");
        return this.prisma.user.findMany({
            where: {
                Department: {
                    slug: constants_1.Departments.finance
                },
                AND: {
                    OR: [
                        {
                            UserAlertsSetting: {
                                some: {
                                    AlertsType: {
                                        slug: "general"
                                    },
                                    email: true
                                }
                            },
                        },
                        {
                            UserAlertsSetting: {
                                none: {
                                    AlertsType: {
                                        slug: 'general'
                                    }
                                }
                            }
                        }
                    ]
                },
                isDeleted: false
            },
            select: user_dto_1.UserDefaultAttributes
        });
    }
    async sendQuotationNotification(recordId) {
        let recordData = await this.getQuotation(recordId);
        let financeUsers = await this.getFinanceUsers();
        this.logger.log("Creating Notification");
        await this.prisma.notification.create({
            data: {
                message: `Quotation DATP-${recordData.id} has been approved. Please collect the payment to start the project`,
                type: 'department',
                link: constants_1.HOSTS.defaultAdminDomain + "/quotations/?id=" + (recordData === null || recordData === void 0 ? void 0 : recordData.id),
                linkLabel: "View Quotation",
                icon: notification_dto_1.notificationFileUploadPath + "/common/verified.png",
                Department: {
                    connectOrCreate: {
                        where: {
                            slug: constants_1.Departments.finance
                        },
                        create: {
                            title: "Finance",
                            slug: constants_1.Departments.finance
                        }
                    }
                }
            }
        });
        if (financeUsers.length > 0) {
            let allUserEmails = financeUsers.map((ele) => ele.email);
            this.logger.log("Sending Email Notification to " + allUserEmails.join(", "));
            await this.mailService.sendQuotationNotification(recordData, allUserEmails);
        }
    }
    async sendMilestoneCompletedNotification(recordId) {
        var _a, _b, _c, _d;
        let recordData = await this.prisma.quotationMilestone.findFirst({
            where: {
                id: recordId
            },
            select: {
                id: true,
                title: true,
                CompletedBy: {
                    select: user_dto_1.UserDefaultAttributes
                },
                Quotation: {
                    select: {
                        id: true,
                        Project: {
                            select: {
                                id: true,
                                title: true,
                                slug: true
                            }
                        }
                    }
                }
            }
        });
        let financeUsers = await this.getFinanceUsers();
        this.logger.log("Creating Milestone Completed Notification");
        await this.prisma.notification.create({
            data: {
                message: `Milestone of Project ${(_b = (_a = recordData.Quotation) === null || _a === void 0 ? void 0 : _a.Project) === null || _b === void 0 ? void 0 : _b.title} has been completed and project has been set to auto hold. Please collect the payment to continue the project. Kindly resume the project if the payment is not required`,
                link: constants_1.HOSTS.defaultAdminDomain + "/project/" + ((_d = (_c = recordData === null || recordData === void 0 ? void 0 : recordData.Quotation) === null || _c === void 0 ? void 0 : _c.Project) === null || _d === void 0 ? void 0 : _d.slug) + "?resume=true",
                linkLabel: "View Project",
                type: 'department',
                icon: notification_dto_1.notificationFileUploadPath + "/common/completed-task.png",
                Department: {
                    connectOrCreate: {
                        where: {
                            slug: constants_1.Departments.finance
                        },
                        create: {
                            title: "Finance",
                            slug: constants_1.Departments.finance
                        }
                    }
                }
            }
        });
        if (financeUsers.length > 0) {
            let allUserEmails = financeUsers.map((ele) => ele.email);
            this.logger.log("Sending Milestone Email Notification to " + allUserEmails.join(", "));
            await this.mailService.sendMilestoneCompletedNotification(recordData.Quotation.Project, recordData.CompletedBy, allUserEmails);
        }
    }
    async sendEnquiryConfirmedNotification(leadId) {
        var _a;
        let recordData = await this.prisma.leads.findUniqueOrThrow({
            where: {
                id: leadId
            },
            select: {
                id: true,
                message: true,
                submissionById: true,
                assignedToId: true,
                Enquiry: {
                    select: {
                        id: true
                    }
                },
                AddedBy: {
                    select: user_dto_1.UserDefaultAttributes
                },
                Client: {
                    select: client_dto_1.ClientDefaultAttributes
                }
            }
        });
        this.logger.log("Find Users who can receive enquiry confirmed Notification");
        let __subscribedUsers = await this.findUsersBasedOnPermission(leads_permissions_1.LeadsPermissionSet.READ_ALL, false, { id: (recordData === null || recordData === void 0 ? void 0 : recordData.assignedToId) ? recordData.assignedToId : undefined });
        let subscribedUsers = [];
        __subscribedUsers.forEach((ele) => {
            if (ele.dataAccessRestrictedTo && ele.dataAccessRestrictedTo.length > 0 && ele.dataAccessRestrictedTo.includes(recordData.submissionById)) {
                subscribedUsers.push(ele);
            }
            else {
                subscribedUsers.push(ele);
            }
        });
        let __emailSubscribers = await this.findUsersBasedOnPermission(leads_permissions_1.LeadsPermissionSet.READ_ALL, true, { id: (recordData === null || recordData === void 0 ? void 0 : recordData.assignedToId) ? recordData.assignedToId : undefined });
        let emailSubscribers = [];
        __emailSubscribers.forEach((ele) => {
            if (ele.dataAccessRestrictedTo && ele.dataAccessRestrictedTo.length > 0 && ele.dataAccessRestrictedTo.includes(recordData.submissionById)) {
                emailSubscribers.push(ele);
            }
            else {
                emailSubscribers.push(ele);
            }
        });
        this.logger.log("Creating Enquiry Confirmed Notification");
        await this.prisma.notification.create({
            data: {
                message: `Enquiry of ${(_a = recordData === null || recordData === void 0 ? void 0 : recordData.Client) === null || _a === void 0 ? void 0 : _a.name} with reference ENQ-${recordData === null || recordData === void 0 ? void 0 : recordData.Enquiry.id} has been qualified and lead has been created. Please share the quotation to continue`,
                link: constants_1.HOSTS.defaultAdminDomain + "/leads/?id=" + (recordData === null || recordData === void 0 ? void 0 : recordData.id),
                linkLabel: "View Lead",
                icon: notification_dto_1.notificationFileUploadPath + "/common/phone-call.png",
                type: 'user',
                Subscribers: {
                    createMany: {
                        data: subscribedUsers.map((ele) => {
                            return {
                                userId: ele.id,
                                read: false
                            };
                        })
                    }
                }
            }
        });
        if (emailSubscribers.length > 0) {
            let allUserEmails = emailSubscribers.map((ele) => ele.email);
            this.logger.log("Sending Enquiry Confirmed Email Notification to " + allUserEmails.join(", "));
            await this.mailService.sendEnquiryConfirmedNotification(recordData, recordData.Client, recordData.AddedBy, allUserEmails);
        }
    }
    async findUsersBasedOnPermission(permission, emailSubscribers, condition) {
        let allPermission = [];
        if (Array.isArray(permission)) {
            allPermission = permission;
        }
        else {
            allPermission = [permission];
        }
        if (!condition) {
            condition = {};
        }
        return this.prisma.user.findMany({
            where: Object.assign(Object.assign({}, condition), { AND: [
                    {
                        userRole: {
                            some: {
                                Role: {
                                    RolePermissions: {
                                        some: {
                                            Permission: {
                                                action: {
                                                    in: allPermission
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    {
                        isDeleted: false,
                    },
                    (emailSubscribers) ?
                        {
                            OR: [
                                {
                                    UserAlertsSetting: {
                                        some: {
                                            AlertsType: {
                                                slug: "general"
                                            },
                                            email: true
                                        }
                                    },
                                },
                                {
                                    UserAlertsSetting: {
                                        none: {
                                            AlertsType: {
                                                slug: 'general'
                                            }
                                        }
                                    }
                                }
                            ]
                        } : undefined,
                ] }),
            select: user_dto_1.UserDefaultAttributes
        });
    }
    async findProjectUsers(projectId, emailSubscribers) {
        let allAdminUsers = await this.prisma.user.findMany({
            where: {
                AND: [
                    {
                        userRole: {
                            some: {
                                Role: {
                                    RolePermissions: {
                                        some: {
                                            Permission: {
                                                action: project_permissions_1.ProjectPermissionSet.REAL_ALL_PROJECT,
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    {
                        isDeleted: false,
                    },
                    (emailSubscribers) ?
                        {
                            OR: [
                                {
                                    UserAlertsSetting: {
                                        some: {
                                            AlertsType: {
                                                slug: "general"
                                            },
                                            email: true
                                        }
                                    },
                                },
                                {
                                    UserAlertsSetting: {
                                        none: {
                                            AlertsType: {
                                                slug: 'general'
                                            }
                                        }
                                    }
                                }
                            ]
                        } : undefined,
                ]
            },
            select: user_dto_1.UserDefaultAttributes
        });
        let adminUsersId = allAdminUsers.map((ele) => ele.id);
        let otherProjectMembers = await this.prisma.projectMembers.findMany({
            where: {
                AND: [
                    {
                        projectId: projectId,
                        NOT: {
                            id: {
                                in: adminUsersId
                            }
                        }
                    },
                    (emailSubscribers) ?
                        {
                            User: {
                                OR: [
                                    {
                                        UserAlertsSetting: {
                                            some: {
                                                AlertsType: {
                                                    slug: "general"
                                                },
                                                email: true
                                            }
                                        },
                                    },
                                    {
                                        UserAlertsSetting: {
                                            none: {
                                                AlertsType: {
                                                    slug: 'general'
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        } : undefined,
                ]
            },
            include: {
                User: {
                    select: user_dto_1.UserDefaultAttributes
                }
            }
        });
        let otherUsers = otherProjectMembers.map((ele) => ele.User);
        return [...allAdminUsers, ...otherUsers];
    }
    async sendDailyNotification() {
        try {
            await this.sendQuotationFollowupNotification();
            await this.sendAssignedQuotationFollowupNotification();
            await this.sendInvoiceFollowupNotification();
            await this.sendLeadsFollowupNotification();
            await this.sendGovernmentFeesToCollectNotification();
        }
        catch (err) {
            this.logger.error("Some error while sending daily notification", err.message);
        }
        finally {
            return this.handleNext();
        }
    }
    async sendAssignedQuotationFollowupNotification() {
        let last7Day = new Date();
        last7Day.setDate(last7Day.getDate() - 7);
        last7Day.setHours(0, 0, 0, 0);
        const rawQuery = `SELECT "U"."id" as "userId", "U"."email" as "userEmail", "U"."firstName" as "firstName",  "U"."lastName" as "lastName",  COUNT("Q"."id") as "quotationCount" FROM "User" "U"
    LEFT JOIN "Leads" "L" ON "U"."id" = "L"."assignedToId"
    LEFT JOIN "Quotation" "Q" ON "L"."id" = "Q"."leadId"
    WHERE (
      "Q"."status" IN (${constants_1.QuotationStatus.submitted}, ${constants_1.QuotationStatus.created})
      AND (
        "Q"."sentDate" <= '${last7Day.toISOString()}' 
        OR 
        (
          "Q"."addedDate" <= '${last7Day.toISOString()}' AND "Q"."status" = ${constants_1.QuotationStatus.created}
        )
      )
    )
    GROUP BY "userId", "userEmail"
    HAVING COUNT("Q"."id") > 0`;
        try {
            const rawData = await this.prisma.$queryRawUnsafe(rawQuery);
            if (rawData.length === 0) {
                return;
            }
            this.logger.log("Creating Quotation Followup Notification To Assigned Users");
            for (let i = 0; i < rawData.length; i++) {
                let ele = rawData[i];
                await this.prisma.notification.create({
                    data: {
                        message: `There are ${ele.quotationCount} qotations which are older than 7 days and are waiting for approval or submission to client. Kidly take the necessary action to update the status`,
                        link: constants_1.HOSTS.defaultAdminDomain + "/quotations",
                        linkLabel: "View Quotations",
                        icon: notification_dto_1.notificationFileUploadPath + "/common/phone-call.png",
                        type: 'user',
                        Subscribers: {
                            create: {
                                userId: ele.userId,
                                read: false
                            }
                        }
                    }
                });
                await this.mailService.sendQuotationFollowupNotification(ele.userEmail, ele.quotationCount, ele.firstName + " " + ele.lastName);
            }
        }
        catch (err) {
            console.log(err);
            this.logger.error("Some error while sending quotation followup notification to each user", err === null || err === void 0 ? void 0 : err.message);
        }
    }
    async sendQuotationFollowupNotification() {
        let last7Day = new Date();
        last7Day.setDate(last7Day.getDate() - 7);
        last7Day.setHours(0, 0, 0, 0);
        let quotations = await this.prisma.quotation.count({
            where: {
                status: {
                    in: [constants_1.QuotationStatus.submitted, constants_1.QuotationStatus.created]
                },
                Lead: {
                    assignedToId: null
                },
                AND: {
                    OR: [
                        {
                            sentDate: {
                                gte: last7Day
                            }
                        },
                        {
                            addedDate: {
                                gte: last7Day
                            }
                        }
                    ]
                }
            }
        });
        if (quotations === 0 || quotations === null) {
            return;
        }
        this.logger.log("Find Users who can receive quotation followup Notification");
        let subscribedUsers = await this.findUsersBasedOnPermission(quotation_permissions_1.QuotationPermissionSet.READ);
        let emailSubscribers = await this.findUsersBasedOnPermission(quotation_permissions_1.QuotationPermissionSet.READ, true);
        this.logger.log("Creating Unassigned Quotation Followup Confirmed Notification");
        await this.prisma.notification.create({
            data: {
                message: `There are ${quotations} qotations which are waiting for approval. These quotations are not assigned to any team members. Kidly followup with client and update the status`,
                link: constants_1.HOSTS.defaultAdminDomain + "/quotations",
                linkLabel: "View Quotations",
                icon: notification_dto_1.notificationFileUploadPath + "/common/phone-call.png",
                type: 'user',
                Subscribers: {
                    createMany: {
                        data: subscribedUsers.map((ele) => {
                            return {
                                userId: ele.id,
                                read: false
                            };
                        })
                    }
                }
            }
        });
        if (emailSubscribers.length > 0) {
        }
    }
    async sendInvoiceFollowupNotification() {
        let last7Day = new Date();
        last7Day.setDate(last7Day.getDate() - 7);
        last7Day.setHours(0, 0, 0, 0);
        let invoicesCount = await this.prisma.invoice.count({
            where: {
                status: {
                    in: [constants_1.InvoiceStatus.sent, constants_1.InvoiceStatus.generated]
                },
                AND: {
                    OR: [
                        {
                            sentDate: {
                                gte: last7Day
                            }
                        },
                        {
                            addedDate: {
                                gte: last7Day
                            }
                        }
                    ]
                }
            }
        });
        if (invoicesCount === 0 || invoicesCount === null) {
            return;
        }
        this.logger.log("Find Users who can receive invoice followup Notification");
        let subscribedUsers = await this.findUsersBasedOnPermission(invoice_permissions_1.InvoicePermissionSet.READ);
        let emailSubscribers = await this.findUsersBasedOnPermission(invoice_permissions_1.InvoicePermissionSet.READ, true);
        this.logger.log("Creating Invoice Followup Confirmed Notification");
        await this.prisma.notification.create({
            data: {
                message: `There are ${invoicesCount} invoices which are not cleared from last 7 days. Kidly followup with client and update the status`,
                link: constants_1.HOSTS.defaultAdminDomain + "/invoice",
                linkLabel: "View Invoices",
                icon: notification_dto_1.notificationFileUploadPath + "/common/inventory.png",
                type: 'user',
                Subscribers: {
                    createMany: {
                        data: subscribedUsers.map((ele) => {
                            return {
                                userId: ele.id,
                                read: false
                            };
                        })
                    }
                }
            }
        });
        if (emailSubscribers.length > 0) {
        }
    }
    async sendLeadsFollowupNotification() {
        let last7Day = new Date();
        last7Day.setDate(last7Day.getDate() - 7);
        last7Day.setHours(0, 0, 0, 0);
        let leads = await this.prisma.leads.groupBy({
            by: ['assignedToId'],
            where: {
                assignedToId: {
                    not: null
                },
                status: {
                    in: [constants_1.LeadsStatus.in_progress, constants_1.LeadsStatus.new]
                },
                OR: [
                    {
                        addedDate: { lte: last7Day },
                        Quotation: {
                            none: {
                                sentDate: {
                                    gte: last7Day
                                },
                                status: {
                                    in: [constants_1.QuotationStatus.submitted, constants_1.QuotationStatus.created]
                                }
                            }
                        }
                    },
                    { Quotation: {
                            some: {
                                sentDate: {
                                    lte: last7Day
                                },
                                status: {
                                    in: [constants_1.QuotationStatus.submitted, constants_1.QuotationStatus.created]
                                }
                            }
                        } }
                ]
            },
            _count: {
                id: true
            }
        });
        if (!leads || leads.length === 0) {
            return;
        }
        for (let i = 0; i < leads.length; i++) {
            let ele = leads[i];
            await this.prisma.notification.create({
                data: {
                    message: `There are ${ele._count.id} leads which has not received quotations yet or has not approved since 7 days. Kidly followup with client and update the status`,
                    link: constants_1.HOSTS.defaultAdminDomain + "/leads",
                    linkLabel: "View Leads",
                    icon: notification_dto_1.notificationFileUploadPath + "/common/phone-call.png",
                    type: 'user',
                    Subscribers: {
                        create: {
                            userId: ele.assignedToId,
                            read: false
                        }
                    }
                }
            });
        }
    }
    async sendGovernmentFeesToCollectNotification() {
        let last7Day = new Date();
        last7Day.setDate(last7Day.getDate() - 7);
        last7Day.setHours(0, 0, 0, 0);
        let governmentFees = await this.prisma.transactions.count({
            where: {
                status: {
                    in: [constants_1.TransactionStatus.pending_payment, constants_1.TransactionStatus.sent_to_client]
                },
                transactionDate: {
                    gte: last7Day
                },
            }
        });
        if (governmentFees === 0 || governmentFees === null) {
            return;
        }
        this.logger.log("Find Users who can receive government fees followup Notification");
        let subscribedUsers = await this.findUsersBasedOnPermission(transactions_permissions_1.TransactionPermissionSet.READ);
        let emailSubscribers = await this.findUsersBasedOnPermission(transactions_permissions_1.TransactionPermissionSet.READ, true);
        this.logger.log("Creating Government Fees Notification");
        await this.prisma.notification.create({
            data: {
                message: `There are ${governmentFees} government fees which are to be collected from clients. Kidly followup with client and update the status`,
                link: constants_1.HOSTS.defaultAdminDomain + "/transactions",
                linkLabel: "View Government Fees",
                icon: notification_dto_1.notificationFileUploadPath + "/common/phone-call.png",
                type: 'user',
                Subscribers: {
                    createMany: {
                        data: subscribedUsers.map((ele) => {
                            return {
                                userId: ele.id,
                                read: false
                            };
                        })
                    }
                }
            }
        });
        if (emailSubscribers.length > 0) {
        }
    }
};
NotificationProcessorService = NotificationProcessorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, mail_service_1.MailService])
], NotificationProcessorService);
exports.NotificationProcessorService = NotificationProcessorService;
//# sourceMappingURL=notification.processor.service.js.map