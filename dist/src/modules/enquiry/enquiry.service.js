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
var EnquiryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnquiryService = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../../config/constants");
const prisma_service_1 = require("../../prisma.service");
const common_2 = require("../../helpers/common");
const user_dto_1 = require("../user/dto/user.dto");
const notification_dto_1 = require("../notification/dto/notification.dto");
const event_emitter_1 = require("@nestjs/event-emitter");
const file_upload_utils_1 = require("../../helpers/file-upload.utils");
let EnquiryService = EnquiryService_1 = class EnquiryService {
    constructor(prisma, eventEmitter) {
        this.prisma = prisma;
        this.eventEmitter = eventEmitter;
        this.logger = new common_1.Logger(EnquiryService_1.name);
    }
    create(createDto) {
        return this.prisma.enquiry.create({
            data: createDto,
        })
            .catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    findAll(pagination, condition) {
        let skip = (pagination.perPage * (pagination.page - 1));
        let take = pagination.perPage;
        let records = this.prisma.enquiry.findMany({
            where: condition,
            skip: skip,
            take: take,
            include: {
                _count: {
                    select: {
                        LeadEnquiryFollowUp: {
                            where: {
                                isDeleted: false
                            }
                        }
                    }
                },
                Attachments: {
                    where: {
                        isDeleted: false
                    }
                },
                ProjectType: {
                    select: {
                        id: true,
                        title: true,
                        slug: true
                    }
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
                },
                ModifiedBy: {
                    select: user_dto_1.UserDefaultAttributes
                }
            },
            orderBy: {
                addedDate: 'desc'
            }
        });
        return records;
    }
    findOne(id) {
        return this.prisma.enquiry.findUnique({
            where: {
                id: id
            },
            include: {
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
                Attachments: {
                    where: {
                        isDeleted: false
                    }
                },
                ProjectType: {
                    select: {
                        id: true,
                        title: true,
                        slug: true
                    }
                },
                AssignedTo: {
                    select: user_dto_1.UserDefaultAttributes
                }
            },
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    async findDuplicateClient(id) {
        let enquiry = await this.findOne(id);
        let email = enquiry.email;
        let domainAddress = email.split("@")[1];
        if (constants_1.GenericEmailDomains.includes(domainAddress)) {
            return this.prisma.client.findMany({
                where: {
                    email: {
                        equals: email,
                        mode: 'insensitive'
                    },
                    isDeleted: false
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    type: true,
                    uuid: true,
                    phone: true,
                    phoneCode: true
                }
            });
        }
        else {
            return this.prisma.client.findMany({
                where: {
                    email: {
                        contains: domainAddress,
                        mode: 'insensitive'
                    },
                    isDeleted: false
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    type: true,
                    uuid: true,
                    phone: true,
                    phoneCode: true
                }
            });
        }
    }
    update(id, updateDto) {
        return this.prisma.enquiry.update({
            data: updateDto,
            where: {
                id: id
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    applyFilters(filters, user, readAllEnquiry) {
        let condition = {
            isDeleted: false
        };
        if (Object.entries(filters).length > 0) {
            if (filters.email) {
                condition = Object.assign(Object.assign({}, condition), { email: filters.email });
            }
            if (filters.phone) {
                condition = Object.assign(Object.assign({}, condition), { phone: { contains: filters.phone } });
            }
            if (filters.source) {
                condition = Object.assign(Object.assign({}, condition), { source: filters.source });
            }
            if (filters.assignedToId) {
                condition = Object.assign(Object.assign({}, condition), { assignedToId: filters.assignedToId });
            }
            if (filters.status) {
                condition = Object.assign(Object.assign({}, condition), { status: filters.status });
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
            if (!readAllEnquiry) {
                if (condition.AND) {
                    if (Array.isArray(condition.AND)) {
                        condition.AND.push({
                            OR: [
                                { addedById: user.userId },
                                { assignedToId: user.userId }
                            ]
                        });
                    }
                    else {
                        condition.AND = [
                            condition.AND,
                            {
                                OR: [
                                    { addedById: user.userId },
                                    { assignedToId: user.userId }
                                ]
                            }
                        ];
                    }
                }
                else {
                    condition = Object.assign(Object.assign({}, condition), { AND: {
                            OR: [
                                { addedById: user.userId },
                                { assignedToId: user.userId }
                            ]
                        } });
                }
            }
            if (filters.userAgent) {
                condition = Object.assign(Object.assign({}, condition), { userAgent: {
                        contains: filters.userAgent,
                        mode: 'insensitive'
                    } });
            }
            if (filters.userIP) {
                condition = Object.assign(Object.assign({}, condition), { userIP: {
                        contains: filters.userIP
                    } });
            }
            if (filters.hasConcerns) {
                condition = Object.assign(Object.assign({}, condition), { LeadEnquiryFollowUp: {
                        some: {
                            isConcern: true,
                            isResolved: false
                        }
                    } });
            }
            if (filters.name) {
                condition = Object.assign(Object.assign({}, condition), { name: {
                        contains: filters.name,
                        mode: 'insensitive'
                    } });
            }
        }
        return condition;
    }
    countTotalRecord(filters) {
        return this.prisma.enquiry.count({
            where: filters
        });
    }
    async updateStatus(enquiryId, enquiryStatusDto) {
        let recordData = await this.prisma.enquiry.findFirst({
            where: {
                id: enquiryId
            },
            select: {
                status: true
            }
        });
        if (recordData.status === constants_1.EnquiryStatus.Qualified) {
            throw {
                message: "This enquiry was already marked as Qualified. You cannot make further changes",
                statusCode: 400
            };
        }
        return this.prisma.enquiry.update({
            where: {
                id: enquiryId
            },
            data: enquiryStatusDto
        });
    }
    checkIfAlreadyRequested(createEnquiryDto) {
        let yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
        let condition = {
            email: createEnquiryDto.email,
            status: constants_1.EnquiryStatus.New,
            isDeleted: false,
            addedDate: {
                gt: yesterday
            },
            phone: createEnquiryDto.phone,
            source: createEnquiryDto.source,
            slug: createEnquiryDto.slug,
        };
        if (createEnquiryDto.phone) {
            condition = Object.assign(Object.assign({}, condition), { phone: createEnquiryDto.phone });
        }
        return this.prisma.enquiry.findFirst({
            where: condition,
        });
    }
    async isFalseRequest(userIPAddress, userAgent) {
        let waitTime = 30;
        let thresholdTime = new Date(new Date().getTime() - (60 * 5 * 1000));
        let numberOfLookupsBySameAgent = await this.prisma.enquiry.count({
            where: {
                userAgent: userAgent,
                userIP: userIPAddress,
                addedDate: {
                    gte: thresholdTime
                },
                status: {
                    in: [constants_1.EnquiryStatus.New, constants_1.EnquiryStatus.Spam]
                }
            }
        });
        if (numberOfLookupsBySameAgent >= 20) {
            let lastSentTime = await this.prisma.enquiry.findFirst({
                where: {
                    userAgent: userAgent,
                    userIP: userIPAddress,
                },
                select: {
                    id: true,
                    addedDate: true,
                    email: true
                },
                orderBy: {
                    addedDate: 'desc'
                }
            });
            let now = new Date();
            let lastSent = new Date(lastSentTime.addedDate);
            let differenceInTime = now.valueOf() - lastSent.valueOf();
            let differenceInMinute = Math.ceil(differenceInTime / 1000 / 60);
            if (differenceInMinute < waitTime) {
                let res = {
                    canActivate: false,
                    message: `Maximum request reached. Please wait ${waitTime - differenceInMinute} minutes and try again`,
                    waitTime: waitTime - differenceInMinute
                };
                this.logger.error("Error on " + this.constructor.name + " \n Error code : IS_FALSE_REQUEST:THRESHOLD_MEET_SAME_AGENT  \n Error message : " + res.message);
                return res;
            }
        }
        return {
            canActivate: true,
            message: `Can create an enquiry`
        };
    }
    markAsReplied(enquiryData) {
        let sentTime = enquiryData.addedDate;
        let repliedTime = new Date();
        let difference = (0, common_2.getBusinessMinutesDiff)(sentTime, repliedTime);
        return this.prisma.enquiry.update({
            where: {
                id: enquiryData.id
            },
            data: {
                hasReplied: true,
                repliedDate: repliedTime,
                timeDifference: difference
            }
        });
    }
    async addNote(enquiryId, createNote, user) {
        let enquiryData = await this.prisma.enquiry.findFirst({
            where: {
                id: enquiryId
            },
            include: {
                Leads: true
            }
        });
        return this.prisma.leadEnquiryFollowUp.create({
            data: {
                enquiryId: enquiryId,
                isConcern: createNote.isConcern,
                note: createNote.note,
                addedById: user.userId,
                leadId: (enquiryData && enquiryData.Leads) ? enquiryData.Leads.id : undefined
            }
        });
    }
    removeNote(noteId) {
        return this.prisma.leadEnquiryFollowUp.update({
            where: {
                id: noteId
            },
            data: {
                isDeleted: true
            }
        });
    }
    removeDocument(documentId) {
        return this.prisma.enquiryAttachment.update({
            where: {
                id: documentId
            },
            data: {
                isDeleted: true
            }
        });
    }
    findAllNotes(noteId) {
        return this.prisma.leadEnquiryFollowUp.findMany({
            where: {
                enquiryId: noteId,
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
    assignEnquiry(enquiryId, asignPropertyDto, user) {
        return this.prisma.enquiry.update({
            where: {
                id: enquiryId,
            },
            data: {
                assignedToId: asignPropertyDto.assignedToId,
                assignedById: user.userId
            }
        });
    }
    removeEnquiry(enquiryId) {
        return this.prisma.enquiry.update({
            where: {
                id: enquiryId
            },
            data: {
                isDeleted: true
            }
        });
    }
    async autoCreateLeadUsingEnquiry(createLeadDto, user) {
        let enquiryData = await this.prisma.enquiry.findFirst({
            where: {
                id: createLeadDto.enquiryId,
                isDeleted: false
            },
            include: {
                Leads: true
            }
        });
        if (!enquiryData) {
            throw {
                message: "Enquiry with the provided ID not found. It might have been removed from the system",
                statusCode: 400
            };
        }
        let leadData = enquiryData.Leads;
        if (leadData) {
            if (leadData.isDeleted === false) {
                throw {
                    message: "You have already create a lead for this enquiry",
                    statusCode: 400
                };
            }
            else {
                await this.prisma.leads.update({
                    where: {
                        id: leadData.id
                    },
                    data: {
                        Enquiry: {
                            disconnect: true
                        }
                    }
                });
            }
        }
        let newLeadData = {
            enquiryId: createLeadDto.enquiryId,
            projectTypeId: createLeadDto.projectTypeId,
            message: createLeadDto.message,
            submissionById: createLeadDto.submissionById,
            addedById: user.userId,
            assignedToId: (createLeadDto.assignedToId) ? createLeadDto.assignedToId : undefined,
            addedDate: new Date(),
            dueDateForSubmissions: (createLeadDto.dueDateForSubmissions) ? createLeadDto.dueDateForSubmissions : undefined
        };
        if (createLeadDto.clientId) {
            let providedClientData = await this.prisma.client.findFirst({
                where: {
                    id: createLeadDto.clientId,
                    isDeleted: false
                }
            });
            if (!providedClientData) {
                throw {
                    message: "Provided client doesnot exist in the system",
                    statusCode: 400
                };
            }
            if (providedClientData.type === constants_1.ClientType.company) {
                if (providedClientData.email === enquiryData.email) {
                    newLeadData.clientId = createLeadDto.clientId;
                }
                else {
                    let clientData = await this.upsertClient(enquiryData, constants_1.ClientType.individual, providedClientData.id);
                    newLeadData.clientId = clientData.id;
                }
            }
            else {
                newLeadData.clientId = createLeadDto.clientId;
            }
        }
        else {
            let clientData = await this.upsertClient(enquiryData, createLeadDto.clientType);
            newLeadData.clientId = clientData.id;
        }
        await this.prisma.enquiry.update({
            where: {
                id: createLeadDto.enquiryId
            },
            data: {
                status: constants_1.EnquiryStatus.Qualified,
                modifiedById: user.userId,
                modifiedDate: new Date()
            }
        });
        let leadDataNew = await this.prisma.leads.create({
            data: newLeadData,
        })
            .catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
        await this.prisma.leadEnquiryFollowUp.updateMany({
            where: {
                enquiryId: createLeadDto.enquiryId
            },
            data: {
                leadId: leadDataNew.id
            }
        });
        await this.prisma.enquiryAttachment.updateMany({
            where: {
                enquiryId: createLeadDto.enquiryId
            },
            data: {
                leadId: leadDataNew.id
            }
        });
        this.logger.log("Subscribing for notification");
        let emitterData = new notification_dto_1.NotificationEventDto({ recordId: leadDataNew.id, moduleName: 'enquiryConfirmed' });
        this.eventEmitter.emit('notification.send', emitterData);
        return leadDataNew;
    }
    async upsertClient(enquiryData, clientType, parentId) {
        let clientData;
        if (enquiryData && enquiryData.email) {
            clientData = await this.prisma.client.findFirst({
                where: {
                    OR: [
                        {
                            email: {
                                contains: enquiryData.email,
                                mode: 'insensitive'
                            },
                        }
                    ],
                    isDeleted: false
                }
            });
        }
        if (clientData) {
            return clientData;
        }
        else {
            let newClient = await this.prisma.client.create({
                data: {
                    name: enquiryData.name,
                    email: (enquiryData === null || enquiryData === void 0 ? void 0 : enquiryData.email) ? enquiryData.email : undefined,
                    phone: enquiryData.phone,
                    type: clientType,
                    phoneCode: enquiryData.phoneCode,
                    companyId: (parentId) ? parentId : undefined,
                }
            });
            return newClient;
        }
    }
    async handleDocuments(enquiryDocuments, files, user) {
        let enquiryData = await this.prisma.enquiry.findUnique({
            where: {
                id: enquiryDocuments.enquiryId
            },
            include: {
                Leads: true
            }
        });
        if (!enquiryData) {
            throw new common_1.NotFoundException({ message: "Enquiry with the provided id not Found", statusCode: 400 });
        }
        let insertData = files.map((ele, index) => {
            var _a;
            let newRecord = {
                title: ele.originalname,
                file: (0, file_upload_utils_1.extractRelativePathFromFullPath)(ele.path),
                mimeType: ele.mimetype,
                enquiryId: enquiryData.id,
                leadId: (enquiryData.Leads) ? (_a = enquiryData.Leads) === null || _a === void 0 ? void 0 : _a.id : undefined,
                fileSize: ele.size / 1024
            };
            return newRecord;
        });
        if (insertData.length > 0) {
            return this.prisma.enquiryAttachment.createMany({
                data: insertData
            }).catch((err) => {
                this.logger.error("Error on " + this.constructor.name + "Custom Error code: ERR437 \n Error code : " + err.code + " \n Error message : " + err.message);
                let errorResponse = { message: err.message, statusCode: 404, data: {} };
                throw errorResponse;
            });
        }
        else {
            return [];
        }
    }
    markConcernAsResolved(noteId) {
        return this.prisma.leadEnquiryFollowUp.update({
            where: {
                id: noteId
            },
            data: {
                isResolved: true
            }
        });
    }
};
EnquiryService = EnquiryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, event_emitter_1.EventEmitter2])
], EnquiryService);
exports.EnquiryService = EnquiryService;
//# sourceMappingURL=enquiry.service.js.map