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
var LeadsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
const mail_service_1 = require("../../mail/mail.service");
const constants_1 = require("../../config/constants");
const user_dto_1 = require("../user/dto/user.dto");
const client_dto_1 = require("../client/dto/client.dto");
const file_upload_utils_1 = require("../../helpers/file-upload.utils");
const organization_dto_1 = require("../organization/dto/organization.dto");
let LeadsService = LeadsService_1 = class LeadsService {
    constructor(prisma, mailService) {
        this.prisma = prisma;
        this.mailService = mailService;
        this.logger = new common_1.Logger(LeadsService_1.name);
    }
    create(createLeadDto) {
        return this.prisma.leads.create({
            data: createLeadDto,
        })
            .catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    findAll(pagination, sorting, condition, includeNotes = false) {
        let skip = (pagination.perPage * (pagination.page - 1));
        let take = pagination.perPage;
        let __sorter = { [sorting.sortByField]: sorting.sortOrder };
        let records = this.prisma.leads.findMany({
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
                Quotation: {
                    include: {
                        AddedBy: {
                            select: user_dto_1.UserDefaultAttributes
                        }
                    },
                    orderBy: [
                        {
                            addedDate: 'desc'
                        }
                    ]
                },
                SubmissionBy: {
                    select: organization_dto_1.OrganizationDefaultAttributes
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
                Client: {
                    select: client_dto_1.ClientDefaultAttributes
                },
                Representative: {
                    select: client_dto_1.ClientDefaultAttributes
                },
                ProjectType: {
                    select: {
                        id: true,
                        title: true,
                        slug: true
                    }
                },
                Project: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            },
            orderBy: __sorter
        });
        return records;
    }
    findOne(id) {
        return this.prisma.leads.findUnique({
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
                    orderBy: {
                        addedDate: 'desc'
                    }
                },
                SubmissionBy: {
                    select: organization_dto_1.OrganizationDefaultAttributes
                },
                Attachments: {
                    where: {
                        isDeleted: false
                    }
                },
                Quotation: {
                    include: {
                        AddedBy: {
                            select: user_dto_1.UserDefaultAttributes
                        }
                    },
                    orderBy: [
                        {
                            sentDate: 'desc'
                        },
                        {
                            addedDate: 'desc'
                        }
                    ]
                },
                AssignedTo: {
                    select: user_dto_1.UserDefaultAttributes
                },
                Client: {
                    select: client_dto_1.ClientDefaultAttributes
                },
                Representative: {
                    select: client_dto_1.ClientDefaultAttributes
                },
                ProjectType: {
                    select: {
                        id: true,
                        title: true,
                        slug: true
                    }
                },
                Project: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            },
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    async update(id, updateLeadDto) {
        const rest = __rest(updateLeadDto, []);
        if (updateLeadDto.submissionById) {
            let currentData = await this.prisma.leads.findUniqueOrThrow({
                where: {
                    id: id
                },
                include: {
                    _count: {
                        select: {
                            Quotation: true
                        }
                    }
                }
            });
        }
        return this.prisma.leads.update({
            data: Object.assign({}, rest),
            where: {
                id: id
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    applyFilters(filters, user, readAllLeads) {
        let condition = {
            isDeleted: false
        };
        if (Object.entries(filters).length > 0) {
            if (filters.__status) {
                condition = Object.assign(Object.assign({}, condition), { status: {
                        in: filters.__status
                    } });
            }
            if (filters.fetchCompleted) {
                condition = Object.assign(Object.assign({}, condition), { Project: {
                        ProjectState: {
                            slug: {
                                in: [constants_1.KnownProjectStatus.completed, constants_1.KnownProjectStatus.canceled]
                            }
                        }
                    } });
            }
            if (filters.clientId) {
                condition = Object.assign(Object.assign({}, condition), { clientId: filters.clientId });
            }
            if (filters.assignedToId) {
                condition = Object.assign(Object.assign({}, condition), { assignedToId: filters.assignedToId });
            }
            if (filters.enquiryId) {
                condition = Object.assign(Object.assign({}, condition), { enquiryId: filters.enquiryId });
            }
            if (filters.representativeId) {
                condition = Object.assign(Object.assign({}, condition), { representativeId: filters.representativeId });
            }
            if (filters.projectTypeId) {
                condition = Object.assign(Object.assign({}, condition), { projectTypeId: filters.projectTypeId });
            }
            if (filters.hasConcerns) {
                condition = Object.assign(Object.assign({}, condition), { LeadEnquiryFollowUp: {
                        some: {
                            isConcern: true,
                            isResolved: false
                        }
                    } });
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
        if (!readAllLeads) {
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
        else {
            if (user.litmitAccessTo && user.litmitAccessTo.length > 0) {
                condition = Object.assign(Object.assign({}, condition), { submissionById: {
                        in: user.litmitAccessTo
                    } });
            }
        }
        return condition;
    }
    countTotalRecord(filters) {
        return this.prisma.leads.count({
            where: filters
        });
    }
    async updateStatus(leadsId, leadsStatusDto) {
        let recordData = await this.prisma.leads.update({
            where: {
                id: leadsId
            },
            data: Object.assign(Object.assign({}, leadsStatusDto), { Quotation: {
                    updateMany: {
                        where: {
                            leadId: leadsId
                        },
                        data: {
                            status: constants_1.QuotationStatus.rejected
                        }
                    }
                } })
        });
        return recordData;
    }
    assignLeads(leadsId, asignPropertyDto, user) {
        return this.prisma.leads.update({
            where: {
                id: leadsId,
            },
            data: {
                assignedToId: asignPropertyDto.assignedToId,
                assignedById: user.userId
            }
        });
    }
    async addNote(leadId, createLeadNoteDto, user) {
        let leadData = await this.findOne(leadId);
        return this.prisma.leadEnquiryFollowUp.create({
            data: {
                leadId: leadId,
                note: createLeadNoteDto.note,
                isConcern: createLeadNoteDto.isConcern,
                addedById: user.userId,
                enquiryId: (leadData) ? leadData.enquiryId : undefined
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
    findAllNotes(leadId) {
        return this.prisma.leadEnquiryFollowUp.findMany({
            where: {
                leadId: leadId,
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
    removeLead(leadId) {
        return this.prisma.leads.update({
            where: {
                id: leadId
            },
            data: {
                isDeleted: true
            }
        });
    }
    async handleDocuments(uploadDocuments, files, user) {
        let leadData = await this.prisma.leads.findUnique({
            where: {
                id: uploadDocuments.leadId
            },
            include: {
                Enquiry: true
            }
        });
        if (!leadData) {
            throw new common_1.NotFoundException({ message: "Enquiry with the provided id not Found", statusCode: 400 });
        }
        let insertData = files.map((ele, index) => {
            let newRecord = {
                title: ele.originalname,
                file: (0, file_upload_utils_1.extractRelativePathFromFullPath)(ele.path),
                mimeType: ele.mimetype,
                enquiryId: (leadData.enquiryId) ? leadData.enquiryId : undefined,
                leadId: leadData.id,
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
LeadsService = LeadsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, mail_service_1.MailService])
], LeadsService);
exports.LeadsService = LeadsService;
//# sourceMappingURL=leads.service.js.map