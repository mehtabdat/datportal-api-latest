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
var ProjectService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma.service");
const common_2 = require("../../helpers/common");
const project_entity_1 = require("./entities/project.entity");
const file_upload_utils_1 = require("../../helpers/file-upload.utils");
const constants_1 = require("../../config/constants");
const client_dto_1 = require("../client/dto/client.dto");
const user_dto_1 = require("../user/dto/user.dto");
const BluebirdPromise = require("bluebird");
const project_dto_1 = require("./dto/project.dto");
const mail_service_1 = require("../../mail/mail.service");
const chat_gateway_1 = require("../chat/chat.gateway");
const bull_1 = require("@nestjs/bull");
const xero_process_config_1 = require("../xero-accounting/process/xero.process.config");
const notification_dto_1 = require("../notification/dto/notification.dto");
const event_emitter_1 = require("@nestjs/event-emitter");
let ProjectService = ProjectService_1 = class ProjectService {
    constructor(prisma, mailService, chatGateway, eventEmitter, xeroQueue) {
        this.prisma = prisma;
        this.mailService = mailService;
        this.chatGateway = chatGateway;
        this.eventEmitter = eventEmitter;
        this.xeroQueue = xeroQueue;
        this.logger = new common_1.Logger(ProjectService_1.name);
    }
    async create(createDto) {
        const { clientRepresentativeId, projectInchargeId, supportEngineersId, clients } = createDto, rest = __rest(createDto, ["clientRepresentativeId", "projectInchargeId", "supportEngineersId", "clients"]);
        let recordData = rest;
        let projectState = await this.prisma.projectState.findFirst({
            where: {
                isDefault: true
            },
            orderBy: {
                order: 'asc'
            }
        });
        if (projectState) {
            recordData.projectStateId = projectState.id;
        }
        if (createDto.startDate) {
            recordData.startDate = new Date(createDto.startDate);
        }
        if (createDto.endDate) {
            recordData.endDate = new Date(createDto.endDate);
        }
        return this.prisma.project.create({
            data: recordData,
        })
            .then(async (data) => {
            let dt = [];
            let dtClients = [];
            if (projectInchargeId && projectInchargeId.length > 0) {
                let uniqueIds = [];
                projectInchargeId.map((ele) => {
                    if (!uniqueIds.includes(ele)) {
                        uniqueIds.push(ele);
                    }
                });
                uniqueIds.forEach((ele) => {
                    dt.push({
                        projectId: data.id,
                        userId: ele,
                        projectRole: constants_1.ProjectRole.projectIncharge
                    });
                });
            }
            if (supportEngineersId && supportEngineersId.length > 0) {
                let uniqueIds = [];
                supportEngineersId.map((ele) => {
                    if (!uniqueIds.includes(ele)) {
                        uniqueIds.push(ele);
                    }
                });
                uniqueIds.forEach((ele) => {
                    dt.push({
                        projectId: data.id,
                        userId: ele,
                        projectRole: constants_1.ProjectRole.supportEngineers
                    });
                });
            }
            if (clientRepresentativeId) {
                dtClients.push({
                    projectId: data.id,
                    clientId: clientRepresentativeId,
                    isRepresentative: true
                });
            }
            if (clients && clients.length > 0) {
                let uniqueIds = [];
                clients.map((ele) => {
                    if (!uniqueIds.includes(ele) && ele !== clientRepresentativeId) {
                        uniqueIds.push(ele);
                    }
                });
                uniqueIds.forEach((ele) => {
                    dtClients.push({
                        projectId: data.id,
                        clientId: ele,
                        isRepresentative: false
                    });
                });
            }
            await this.prisma.projectMembers.createMany({
                data: dt
            }).catch((err) => {
                this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            });
            await this.prisma.projectClient.createMany({
                data: dtClients
            }).catch((err) => {
                this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            });
            return data;
        })
            .catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    findAll(filters, pagination, rawFilters) {
        let skip = (pagination.perPage * (pagination.page - 1));
        let take = pagination.perPage;
        return this.prisma.project.findMany({
            where: filters,
            skip: skip,
            take: take,
            select: {
                id: true,
                title: true,
                slug: true,
                startDate: true,
                endDate: true,
                priority: true,
                referenceNumber: true,
                leadId: true,
                ProjectState: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        bgColor: true,
                        textColor: true
                    }
                },
                ProjectEnableStates: {
                    select: {
                        id: true,
                        pId: true,
                        pstateId: true,
                    }
                },
                addedDate: true,
                ProjectMembers: {
                    select: {
                        projectRole: true,
                        userId: true,
                        User: {
                            select: {
                                firstName: true,
                                lastName: true,
                                profile: true,
                                id: true,
                                uuid: true
                            }
                        }
                    },
                    orderBy: {
                        projectRole: 'asc'
                    }
                },
                ProjectClient: {
                    select: {
                        clientId: true,
                        Client: {
                            select: client_dto_1.ClientDefaultAttributes
                        }
                    }
                },
                ProjectType: {
                    select: {
                        title: true,
                        slug: true
                    }
                },
                Client: {
                    select: client_dto_1.ClientDefaultAttributes
                },
                SubmissionBy: {
                    select: {
                        name: true,
                        logo: true,
                        uuid: true
                    }
                },
                _count: {
                    select: {
                        Resources: {
                            where: {
                                isDeleted: false
                            }
                        }
                    }
                }
            },
            orderBy: (rawFilters.delayed) ? {
                endDate: 'asc'
            } : {
                addedDate: 'desc'
            }
        });
    }
    async getPriorizedDataInConversation(recordId, user) {
        return this.prisma.project.findFirst({
            where: {
                id: recordId
            },
            select: {
                id: true,
                title: true,
                slug: true,
                referenceNumber: true,
                onHold: true,
                ProjectMembers: {
                    select: {
                        projectRole: true,
                        userId: true,
                        User: {
                            select: {
                                firstName: true,
                                lastName: true,
                                profile: true,
                                id: true,
                                uuid: true
                            }
                        }
                    },
                    orderBy: {
                        projectRole: 'asc'
                    }
                },
                ProjectConversation: {
                    where: {
                        isDeleted: false
                    },
                    select: {
                        message: true,
                        addedDate: true,
                        _count: {
                            select: {
                                Media: {
                                    where: {
                                        isDeleted: false
                                    }
                                }
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        ProjectConversation: {
                            where: {
                                AND: {
                                    isDeleted: false,
                                    OR: [
                                        {
                                            ReadLog: {
                                                some: {
                                                    userId: user.userId,
                                                    read: false
                                                }
                                            }
                                        },
                                        {
                                            ReadLog: {
                                                none: {
                                                    userId: user.userId
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }
            },
            orderBy: {
                addedDate: 'desc'
            }
        });
    }
    async getProjectForConversation(filters, pagination, user, readAllProject) {
        var _a, _b, _c;
        let skip = (pagination.perPage * (pagination.page - 1));
        let take = pagination.perPage;
        let condition = "";
        if (filters.title) {
            condition = ` AND ("p"."title" ILIKE '%${filters.title}%' OR "p"."referenceNumber" ILIKE '%${filters.title}%')`;
        }
        const rawQuery = `
    SELECT
      "p"."id",
      "p"."title",
      "p"."slug",
      "p"."onHold",
      "p"."referenceNumber",
      "pm"."projectRole",
      "pm"."userId",
      "u"."firstName",
      "u"."lastName",
      "u"."email",
      "u"."profile",
      "u"."id" AS userId,
      "u"."uuid",
      "pc"."message" AS pcmessage,
      "pc"."addedDate" AS pcaddeddate,
      "pc"."mediacount",
      (
        SELECT COUNT(*)
        FROM "ProjectConversation" AS pc
        WHERE
          "pc"."projectId" = p.id AND
          "pc"."isDeleted" = false AND
          "pc"."userId" <> ${user.userId} AND
          (
            EXISTS (
              SELECT 1
              FROM "ProjectConversationReadLog" AS rl
              WHERE "rl"."conversationId" = "pc".id AND "rl"."userId" = ${user.userId} AND "rl"."read" = false
            ) OR
            NOT EXISTS (
              SELECT 1
              FROM "ProjectConversationReadLog" AS rl
              WHERE "rl"."conversationId" = "pc".id AND "rl"."userId" = ${user.userId}
            )
          )
      ) AS pcCount
    FROM "Project" AS p
    LEFT JOIN "ProjectMembers" AS "pm" ON "pm"."projectId" = p.id
    LEFT JOIN "User" AS "u" ON "pm"."userId" = "u"."id" AND "u"."isDeleted" = FALSE
    LEFT JOIN LATERAL (
      SELECT
        "message",
        "addedDate",
        (
          SELECT COUNT(*)
          FROM "FileManagement" AS "pcMedia"
          WHERE
            "pcMedia"."projectConversationId" = "pc"."id" AND
            "pcMedia"."isDeleted" = false
        ) AS "mediacount"
      FROM "ProjectConversation" AS "pc"
      WHERE "pc"."projectId" = p.id AND "pc"."isDeleted" = false
      ORDER BY "addedDate" DESC
      LIMIT 1
    ) AS "pc" ON TRUE
    WHERE "p"."isDeleted" = false ${condition} ${readAllProject ? "" : ` AND
    "p"."id" IN (
      SELECT "projectId"
      FROM "ProjectMembers"
      WHERE "userId" = ${user.userId}
    )`}
    ORDER BY CASE WHEN "pc"."addedDate" IS NULL THEN 1 ELSE 0 END, "pc"."addedDate" DESC
    OFFSET ${skip} LIMIT ${take};
    ;
  `;
        const rawData = await this.prisma.$queryRawUnsafe(rawQuery);
        const projectsMap = new Map();
        rawData.forEach((row) => {
            const projectId = row.id;
            if (!projectsMap.has(projectId)) {
                projectsMap.set(projectId, {
                    id: row.id,
                    title: row.title,
                    slug: row.slug,
                    referenceNumber: row.referenceNumber,
                    onHold: row.onHold,
                    ProjectMembers: [],
                    ProjectConversation: {
                        message: row.pcmessage,
                        addedDate: row.pcaddeddate,
                        mediaCount: Number(row.mediacount),
                    },
                    unreadConversationCount: Number(row.pccount),
                });
            }
            if (row.userId) {
                projectsMap.get(projectId).ProjectMembers.push({
                    projectRole: row.projectRole,
                    userId: row.userId,
                    User: {
                        firstName: row.firstName,
                        lastName: row.lastName,
                        email: row.email,
                        profile: row.profile,
                        id: row.userId,
                        uuid: row.uuid,
                    },
                });
            }
        });
        const organizedData = Array.from(projectsMap.values());
        if (filters.id) {
            let rData = await this.getPriorizedDataInConversation(filters.id, user);
            organizedData.unshift({
                id: rData.id,
                title: rData.title,
                slug: rData.slug,
                referenceNumber: rData.referenceNumber,
                onHold: rData.onHold,
                ProjectConversation: (rData.ProjectConversation && rData.ProjectConversation.length > 0) ? {
                    message: rData.ProjectConversation[0].message,
                    addedDate: rData.ProjectConversation[0].addedDate,
                    mediaCount: (_b = (_a = rData.ProjectConversation[0]) === null || _a === void 0 ? void 0 : _a._count) === null || _b === void 0 ? void 0 : _b.Media,
                } : undefined,
                unreadConversationCount: (_c = rData._count) === null || _c === void 0 ? void 0 : _c.ProjectConversation,
                ProjectMembers: rData.ProjectMembers
            });
        }
        return organizedData;
    }
    findProjectList(filters, pagination) {
        let skip = (pagination.perPage * (pagination.page - 1));
        let take = pagination.perPage;
        return this.prisma.project.findMany({
            where: filters,
            skip: skip,
            take: take,
            select: {
                id: true,
                title: true,
                slug: true,
                referenceNumber: true,
                leadId: true,
                submissionById: true,
                clientId: true
            },
            orderBy: {
                id: 'desc'
            }
        });
    }
    findAllPublished(filters, pagination) {
        let skip = (pagination.perPage * (pagination.page - 1));
        let take = pagination.perPage;
        return this.prisma.project.findMany({
            where: filters,
            skip: skip,
            take: take,
            select: {
                id: true,
                title: true,
                slug: true,
                startDate: true,
                endDate: true,
                priority: true,
                referenceNumber: true,
                ProjectState: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        bgColor: true,
                        textColor: true
                    }
                },
                ProjectEnableStates: {
                    select: {
                        id: true,
                        pId: true,
                        pstateId: true,
                    }
                },
                addedDate: true,
                ProjectMembers: {
                    select: {
                        projectRole: true,
                        userId: true,
                        User: {
                            select: {
                                firstName: true,
                                lastName: true,
                                profile: true,
                                id: true,
                                uuid: true
                            }
                        }
                    },
                    orderBy: {
                        projectRole: 'asc'
                    }
                },
                ProjectClient: {
                    select: {
                        clientId: true,
                        Client: {
                            select: client_dto_1.ClientDefaultAttributes
                        }
                    }
                },
                ProjectType: {
                    select: {
                        title: true,
                        slug: true
                    }
                },
                Client: {
                    select: client_dto_1.ClientDefaultAttributes
                },
                SubmissionBy: {
                    select: {
                        name: true,
                        logo: true,
                        uuid: true
                    }
                },
                _count: {
                    select: {
                        Resources: {
                            where: {
                                isDeleted: false
                            }
                        },
                    }
                }
            },
            orderBy: {
                id: 'desc'
            }
        });
    }
    findOne(id) {
        return this.prisma.project.findUnique({
            where: {
                id: id
            },
            include: {
                Quotation: {
                    select: {
                        id: true,
                        scopeOfWork: true,
                        QuotationMilestone: {
                            select: {
                                id: true,
                                title: true,
                                amount: true,
                                status: true
                            }
                        }
                    },
                    where: {
                        status: constants_1.QuotationStatus.confirmed
                    }
                },
                ProjectState: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        bgColor: true,
                        textColor: true
                    }
                },
                ProjectEnableStates: {
                    select: {
                        id: true,
                        pId: true,
                        pstateId: true,
                    }
                },
                ProjectMembers: {
                    select: {
                        projectRole: true,
                        User: {
                            select: {
                                firstName: true,
                                lastName: true,
                                profile: true,
                                id: true,
                                uuid: true
                            }
                        }
                    },
                    orderBy: {
                        projectRole: 'asc'
                    }
                },
                ProjectClient: {
                    select: {
                        clientId: true,
                        isRepresentative: true,
                        Client: {
                            select: client_dto_1.ClientDefaultAttributes
                        }
                    }
                },
                ProjectType: {
                    select: {
                        title: true,
                        slug: true
                    }
                },
                Client: {
                    select: client_dto_1.ClientDefaultAttributes
                },
                SubmissionBy: {
                    select: {
                        name: true,
                        logo: true,
                        uuid: true
                    }
                },
                _count: {
                    select: {
                        Resources: {
                            where: {
                                isDeleted: false
                            }
                        }
                    }
                }
            },
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    findBySlug(slug) {
        return this.prisma.project.findUnique({
            where: {
                slug: slug
            },
            include: {
                ProjectState: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        bgColor: true,
                        textColor: true
                    }
                },
                ProjectHoldBy: {
                    select: user_dto_1.UserDefaultAttributes
                },
                ProjectMembers: {
                    select: {
                        projectRole: true,
                        User: {
                            select: {
                                firstName: true,
                                lastName: true,
                                profile: true,
                                id: true,
                                uuid: true,
                                email: true
                            }
                        }
                    },
                    orderBy: {
                        projectRole: 'asc'
                    }
                },
                ProjectClient: {
                    select: {
                        clientId: true,
                        isRepresentative: true,
                        Client: {
                            select: client_dto_1.ClientDefaultAttributes
                        }
                    }
                },
                ProjectType: {
                    select: {
                        title: true,
                        slug: true
                    }
                },
                Client: {
                    select: client_dto_1.ClientDefaultAttributes
                },
                SubmissionBy: {
                    select: {
                        name: true,
                        logo: true,
                        uuid: true
                    }
                },
                Quotation: {
                    where: {
                        status: constants_1.QuotationStatus.confirmed,
                        isDeleted: false
                    },
                    select: {
                        id: true,
                        scopeOfWork: true,
                        addedDate: true,
                        QuotationMilestone: {
                            select: {
                                id: true,
                                title: true,
                                status: true
                            },
                            orderBy: {
                                id: 'asc'
                            }
                        },
                    },
                    orderBy: {
                        addedDate: 'asc'
                    }
                },
                _count: {
                    select: {
                        Resources: {
                            where: {
                                isDeleted: false
                            }
                        },
                    }
                }
            },
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    async update(id, updateDto) {
        const { clientRepresentativeId, projectInchargeId, supportEngineersId, clients } = updateDto, rest = __rest(updateDto, ["clientRepresentativeId", "projectInchargeId", "supportEngineersId", "clients"]);
        let updateData = rest;
        if (updateDto.startDate) {
            updateData.startDate = new Date(updateDto.startDate);
        }
        if (updateDto.endDate) {
            updateData.endDate = new Date(updateDto.endDate);
        }
        return this.prisma.project.update({
            data: rest,
            where: {
                id: id
            },
            include: {
                ProjectMembers: true,
                ProjectClient: true
            }
        })
            .then(async (data) => {
            if (projectInchargeId && projectInchargeId.length > 0) {
                let newUniqueUserIds = [];
                let existingUserWithDifferentProjectRole = [];
                projectInchargeId.forEach((inchargeId) => {
                    if (newUniqueUserIds.includes(inchargeId) || existingUserWithDifferentProjectRole.includes(inchargeId) || supportEngineersId.includes(inchargeId)) {
                        return;
                    }
                    let esitingUser = data.ProjectMembers.find((ele) => ele.userId === inchargeId);
                    if (esitingUser) {
                        if (esitingUser.projectRole !== constants_1.ProjectRole.projectIncharge) {
                            existingUserWithDifferentProjectRole.push(esitingUser.userId);
                        }
                    }
                    else {
                        newUniqueUserIds.push(inchargeId);
                    }
                });
                if (newUniqueUserIds.length > 0) {
                    let dt = [];
                    newUniqueUserIds.forEach((ele) => {
                        dt.push({
                            projectId: data.id,
                            userId: ele,
                            projectRole: constants_1.ProjectRole.projectIncharge
                        });
                    });
                    await this.prisma.projectMembers.createMany({
                        data: dt
                    });
                }
                if (existingUserWithDifferentProjectRole.length > 0) {
                    await this.prisma.projectMembers.updateMany({
                        where: {
                            userId: {
                                in: existingUserWithDifferentProjectRole
                            }
                        },
                        data: {
                            projectRole: constants_1.ProjectRole.projectIncharge
                        }
                    });
                }
            }
            if (supportEngineersId && supportEngineersId.length > 0) {
                let newUniqueUserIds = [];
                let existingUserWithDifferentProjectRole = [];
                supportEngineersId.forEach((engineerId) => {
                    if (newUniqueUserIds.includes(engineerId) || existingUserWithDifferentProjectRole.includes(engineerId) || projectInchargeId.includes(engineerId)) {
                        return;
                    }
                    let esitingUser = data.ProjectMembers.find((ele) => ele.userId === engineerId);
                    if (esitingUser) {
                        if (esitingUser.projectRole !== constants_1.ProjectRole.supportEngineers) {
                            existingUserWithDifferentProjectRole.push(esitingUser.userId);
                        }
                    }
                    else {
                        newUniqueUserIds.push(engineerId);
                    }
                });
                if (newUniqueUserIds.length > 0) {
                    let dt = [];
                    newUniqueUserIds.forEach((ele) => {
                        dt.push({
                            projectId: data.id,
                            userId: ele,
                            projectRole: constants_1.ProjectRole.supportEngineers
                        });
                    });
                    await this.prisma.projectMembers.createMany({
                        data: dt
                    });
                }
                if (existingUserWithDifferentProjectRole.length > 0) {
                    await this.prisma.projectMembers.updateMany({
                        where: {
                            userId: {
                                in: existingUserWithDifferentProjectRole
                            }
                        },
                        data: {
                            projectRole: constants_1.ProjectRole.supportEngineers
                        }
                    });
                }
            }
            if (clientRepresentativeId) {
                let esitingClientRepresentative = data.ProjectClient.find((ele) => ele.clientId === clientRepresentativeId);
                if (esitingClientRepresentative) {
                    if (esitingClientRepresentative.isRepresentative !== true) {
                        await this.prisma.projectClient.update({
                            where: {
                                projectId_clientId: {
                                    clientId: clientRepresentativeId,
                                    projectId: data.id
                                }
                            },
                            data: {
                                isRepresentative: true
                            }
                        });
                        await this.prisma.projectClient.updateMany({
                            where: {
                                clientId: {
                                    not: clientRepresentativeId
                                },
                                projectId: data.id
                            },
                            data: {
                                isRepresentative: false
                            }
                        });
                    }
                }
                else {
                    await this.prisma.projectClient.create({
                        data: {
                            clientId: clientRepresentativeId,
                            projectId: data.id,
                            isRepresentative: true
                        }
                    });
                    await this.prisma.projectClient.updateMany({
                        where: {
                            clientId: {
                                not: clientRepresentativeId
                            },
                            projectId: data.id
                        },
                        data: {
                            isRepresentative: false
                        }
                    });
                }
            }
            if (clients && clients.length > 0) {
                let newUniqueUserIds = [];
                clients.forEach((clientId) => {
                    if (newUniqueUserIds.includes(clientId) || clientId === clientRepresentativeId) {
                        return;
                    }
                    let esitingUser = data.ProjectClient.find((ele) => ele.clientId === clientId);
                    if (!esitingUser) {
                        newUniqueUserIds.push(clientId);
                    }
                });
                if (newUniqueUserIds.length > 0) {
                    let dt = [];
                    newUniqueUserIds.forEach((ele) => {
                        dt.push({
                            projectId: data.id,
                            clientId: ele,
                            isRepresentative: false
                        });
                    });
                    await this.prisma.projectClient.createMany({
                        data: dt
                    });
                }
            }
            if (updateDto.title) {
                this.xeroQueue.add(xero_process_config_1.XeroProcessNames.syncProject, {
                    message: "Sync Project With Xero",
                    data: data
                }, { removeOnComplete: true });
            }
            return data;
        })
            .catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    updateFiles(fileId, updateDto) {
        return this.prisma.fileManagement.update({
            where: {
                id: fileId
            },
            data: updateDto
        });
    }
    async holdProject(id, updateDto, user) {
        const recordData = await this.prisma.project.update({
            where: {
                id: id
            },
            data: {
                onHold: true,
                comment: updateDto.comment,
                modifiedDate: new Date(),
                projectHoldById: user.userId
            }
        });
        let emitterData = new notification_dto_1.NotificationEventDto({ recordId: recordData.id, moduleName: 'projectHoldNotification' });
        this.eventEmitter.emit('notification.send', emitterData);
    }
    async unholdProject(id, updateDto, user) {
        const recordData = await this.prisma.project.update({
            where: {
                id: id
            },
            data: {
                onHold: false,
                comment: (updateDto.comment) ? updateDto.comment : null,
                modifiedDate: new Date(),
                projectHoldById: user.userId
            }
        });
        let emitterData = new notification_dto_1.NotificationEventDto({ recordId: recordData.id, moduleName: 'projectResumeNotification' });
        this.eventEmitter.emit('notification.send', emitterData);
    }
    remove(id) {
        return this.prisma.project.update({
            data: {
                isDeleted: true
            },
            where: {
                id: id
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    applyConversationFilter(filters, user, hasGlobalPermission = false) {
        let condition = {
            isDeleted: false
        };
        if (hasGlobalPermission === false) {
            condition = Object.assign(Object.assign({}, condition), { ProjectMembers: {
                    some: {
                        userId: user.userId
                    }
                } });
        }
        if (Object.entries(filters).length > 0) {
            if (filters.title) {
                if (condition.AND) {
                    if (Array.isArray(condition.AND)) {
                        condition.AND.push({
                            OR: [
                                {
                                    title: {
                                        contains: filters.title,
                                        mode: 'insensitive'
                                    }
                                },
                                {
                                    referenceNumber: {
                                        contains: filters.title,
                                        mode: 'insensitive'
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
                                    {
                                        title: {
                                            contains: filters.title,
                                            mode: 'insensitive'
                                        }
                                    },
                                    {
                                        referenceNumber: {
                                            contains: filters.title,
                                            mode: 'insensitive'
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
                                {
                                    title: {
                                        contains: filters.title,
                                        mode: 'insensitive'
                                    }
                                },
                                {
                                    referenceNumber: {
                                        contains: filters.title,
                                        mode: 'insensitive'
                                    }
                                }
                            ]
                        } });
                }
            }
        }
        return condition;
    }
    applyFilters(filters, user, hasGlobalPermission = false) {
        let condition = {
            isDeleted: false
        };
        if (hasGlobalPermission === false) {
            condition = Object.assign(Object.assign({}, condition), { OR: [
                    {
                        ProjectMembers: {
                            some: {
                                userId: user.userId
                            }
                        }
                    },
                    {
                        addedById: user.userId
                    }
                ] });
        }
        if (Object.entries(filters).length > 0) {
            if (filters.slug) {
                condition = Object.assign(Object.assign({}, condition), { slug: filters.slug });
            }
            if (filters.ids) {
                let allIds = [];
                if (Array.isArray(filters.ids)) {
                    allIds = filters.ids;
                }
                else {
                    allIds = [filters.ids];
                }
                condition = Object.assign(Object.assign({}, condition), { id: { in: allIds } });
            }
            if (filters.quoteNumber) {
                condition = Object.assign(Object.assign({}, condition), { Quotation: {
                        some: {
                            quoteNumber: filters.quoteNumber
                        }
                    } });
            }
            if (filters.invoiceNumber) {
                condition = Object.assign(Object.assign({}, condition), { Invoice: {
                        some: {
                            invoiceNumber: filters.invoiceNumber
                        }
                    } });
            }
            if (filters.referenceNumber) {
                condition = Object.assign(Object.assign({}, condition), { referenceNumber: {
                        contains: filters.referenceNumber,
                        mode: 'insensitive'
                    } });
            }
            if (filters.fromDate && filters.toDate) {
                if (condition.AND) {
                    if (Array.isArray(condition.AND)) {
                        condition.AND.push({
                            addedDate: {
                                gte: new Date(filters.fromDate + "T00:00:00")
                            }
                        });
                        condition.AND.push({
                            addedDate: {
                                lte: new Date(filters.toDate + "T23:59:59")
                            }
                        });
                    }
                    else {
                        condition.AND = [
                            condition.AND,
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
                        ];
                    }
                }
                else {
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
            }
            else {
                if (filters.fromDate) {
                    condition = Object.assign(Object.assign({}, condition), { addedDate: { gte: new Date(filters.fromDate + "T00:00:00") } });
                }
                if (filters.toDate) {
                    condition = Object.assign(Object.assign({}, condition), { addedDate: { lte: new Date(filters.toDate + "T23:59:59") } });
                }
            }
            if (filters.isClosed || (filters === null || filters === void 0 ? void 0 : filters.isClosed) === false) {
                condition = Object.assign(Object.assign({}, condition), { isClosed: filters.isClosed });
            }
            if (filters.onHold) {
                condition = Object.assign(Object.assign({}, condition), { onHold: filters.onHold });
            }
            if (filters.clientId) {
                condition = Object.assign(Object.assign({}, condition), { clientId: filters.clientId });
            }
            if (filters.delayed) {
                condition = Object.assign(Object.assign({}, condition), { isClosed: false });
            }
            if (filters.projectStateId) {
                condition = Object.assign(Object.assign({}, condition), { projectStateId: filters.projectStateId });
            }
            if (filters.projectStateSlugs) {
                condition = Object.assign(Object.assign({}, condition), { ProjectState: {
                        slug: {
                            in: filters.projectStateSlugs
                        }
                    } });
            }
            if (filters.title) {
                let allIds = (0, common_2.extractIds)(filters.title);
                let referenceCondition = [];
                allIds.forEach((ele) => {
                    referenceCondition.push({
                        referenceNumber: {
                            contains: String(ele),
                            mode: 'insensitive'
                        }
                    });
                });
                if (condition.AND) {
                    if (Array.isArray(condition.AND)) {
                        condition.AND.push({
                            OR: [
                                ...referenceCondition,
                                {
                                    title: {
                                        contains: filters.title,
                                        mode: 'insensitive'
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
                                    {
                                        title: {
                                            contains: filters.title,
                                            mode: 'insensitive'
                                        }
                                    },
                                    ...referenceCondition
                                ]
                            }
                        ];
                    }
                }
                else {
                    condition = Object.assign(Object.assign({}, condition), { AND: {
                            OR: [
                                {
                                    title: {
                                        contains: filters.title,
                                        mode: 'insensitive'
                                    }
                                },
                                ...referenceCondition
                            ]
                        } });
                }
            }
            if (filters.userIds) {
                if (hasGlobalPermission === false) {
                    if (condition.AND) {
                        if (Array.isArray(condition.AND)) {
                            condition.AND.push({
                                ProjectMembers: {
                                    some: {
                                        userId: user.userId
                                    }
                                }
                            });
                            condition.AND.push({
                                ProjectMembers: {
                                    some: {
                                        userId: {
                                            in: filters.userIds
                                        },
                                        projectRole: (filters.projectRole) ? filters.projectRole : undefined
                                    }
                                }
                            });
                        }
                        else {
                            condition.AND = [
                                condition.AND,
                                {
                                    ProjectMembers: {
                                        some: {
                                            userId: user.userId
                                        }
                                    }
                                },
                                {
                                    ProjectMembers: {
                                        some: {
                                            userId: {
                                                in: filters.userIds
                                            },
                                            projectRole: (filters.projectRole) ? filters.projectRole : undefined
                                        }
                                    }
                                }
                            ];
                        }
                    }
                    else {
                        condition = Object.assign(Object.assign({}, condition), { AND: [
                                {
                                    ProjectMembers: {
                                        some: {
                                            userId: user.userId
                                        }
                                    }
                                },
                                {
                                    ProjectMembers: {
                                        some: {
                                            userId: {
                                                in: filters.userIds
                                            },
                                            projectRole: (filters.projectRole) ? filters.projectRole : undefined
                                        }
                                    }
                                }
                            ] });
                    }
                }
                else {
                    condition = Object.assign(Object.assign({}, condition), { ProjectMembers: {
                            some: {
                                userId: {
                                    in: filters.userIds
                                },
                                projectRole: (filters.projectRole) ? filters.projectRole : undefined
                            },
                        } });
                }
            }
        }
        return condition;
    }
    countProject(filters) {
        return this.prisma.project.count({
            where: filters
        });
    }
    countProjectResources(filters) {
        return this.prisma.fileManagement.count({
            where: filters
        });
    }
    countProjectNotes(filters) {
        return this.prisma.projectConversation.count({
            where: filters
        });
    }
    countFileShareLogs(filters) {
        return this.prisma.fileshareLogs.count({
            where: filters
        });
    }
    async handlePropertyFiles(uploadPropertyFiles, files, user) {
        let property = await this.prisma.project.findUnique({
            where: {
                id: uploadPropertyFiles.projectId
            }
        });
        if (!property) {
            throw new common_1.NotFoundException({ message: "Property with the provided propertyId not Found", statusCode: 400 });
        }
        let insertedIds = [];
        let insertData = files.map((ele, index) => {
            let uuid = (0, common_2.generateUUID)();
            insertedIds.push(uuid);
            let newRecord = {
                uuid: uuid,
                documentType: uploadPropertyFiles.documentType,
                title: uploadPropertyFiles.title ? uploadPropertyFiles.title : (0, common_2.getEnumKeyByValue)(project_entity_1.ProjectDocumentsTypes, uploadPropertyFiles.documentType),
                name: ele.originalname,
                file: ele.filename,
                fileType: ele.mimetype,
                path: (0, file_upload_utils_1.extractRelativePathFromFullPath)(ele.path),
                isTemp: false,
                status: constants_1.FileStatus.Verified,
                addedById: user.userId,
                visibility: client_1.FileVisibility.organization,
                projectId: uploadPropertyFiles.projectId,
                fileSize: ele.size / 1024
            };
            return newRecord;
        });
        if (insertData.length > 0) {
            await this.prisma.fileManagement.createMany({
                data: insertData
            }).catch((err) => {
                this.logger.error("Error on " + this.constructor.name + "Custom Error code: ERR437 \n Error code : " + err.code + " \n Error message : " + err.message);
                let errorResponse = { message: err.message, statusCode: 404, data: {} };
                throw errorResponse;
            });
            return this.prisma.fileManagement.findMany({
                where: {
                    uuid: {
                        in: insertedIds
                    }
                },
                select: {
                    id: true,
                    uuid: true,
                    file: true,
                    name: true,
                    isTemp: true,
                    projectId: true,
                    path: true
                }
            }).catch((err) => {
                this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
                let errorResponse = { message: err.message, statusCode: 404, data: {} };
                throw errorResponse;
            });
        }
        else {
            return [];
        }
    }
    async handleConversationFiles(projectId, files, user) {
        let property = await this.prisma.project.findUnique({
            where: {
                id: projectId
            }
        });
        if (!property) {
            throw new common_1.NotFoundException({ message: "Property with the provided propertyId not Found", statusCode: 400 });
        }
        let conversationData = await this.prisma.projectConversation.create({
            data: {
                message: "",
                addedDate: new Date(),
                projectId: projectId,
                userId: user.userId
            }
        });
        let insertData = files.map((ele, index) => {
            let newRecord = {
                documentType: project_entity_1.ProjectDocumentsTypes.other,
                title: (0, common_2.getEnumKeyByValue)(project_entity_1.ProjectDocumentsTypes, project_entity_1.ProjectDocumentsTypes.other),
                name: ele.originalname,
                file: ele.filename,
                fileType: ele.mimetype,
                path: (0, file_upload_utils_1.extractRelativePathFromFullPath)(ele.path),
                isTemp: false,
                status: constants_1.FileStatus.Verified,
                addedById: user.userId,
                visibility: client_1.FileVisibility.organization,
                projectId: projectId,
                addedDate: new Date(),
                projectConversationId: conversationData.id,
                fileSize: ele.size / 1024
            };
            return newRecord;
        });
        if (insertData.length > 0) {
            await this.prisma.fileManagement.createMany({
                data: insertData
            }).catch((err) => {
                this.logger.error("Error on " + this.constructor.name + "Custom Error code: ERR437 \n Error code : " + err.code + " \n Error message : " + err.message);
                let errorResponse = { message: err.message, statusCode: 404, data: {} };
                throw errorResponse;
            });
            return this.prisma.projectConversation.findMany({
                where: {
                    id: conversationData.id
                },
                include: {
                    Media: {
                        select: {
                            id: true,
                            uuid: true,
                            file: true,
                            name: true,
                            path: true,
                            fileType: true,
                            addedDate: true,
                            AddedBy: {
                                select: user_dto_1.UserDefaultAttributes
                            }
                        }
                    }
                }
            }).catch((err) => {
                this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
                let errorResponse = { message: err.message, statusCode: 404, data: {} };
                throw errorResponse;
            });
        }
        else {
            return [];
        }
    }
    removeProjectMember(removeProjectMember) {
        return this.prisma.projectMembers.deleteMany({
            where: {
                projectId: removeProjectMember.projectId,
                userId: removeProjectMember.userId
            }
        });
    }
    removeProjectClient(removeProjectClient) {
        return this.prisma.projectClient.deleteMany({
            where: {
                projectId: removeProjectClient.projectId,
                clientId: removeProjectClient.clientId
            }
        });
    }
    async updateProjectMember(updateProjectMember) {
        const { projectId, projectInchargeId, clientRepresentativeId, supportEngineersId, clients } = updateProjectMember;
        let data = await this.prisma.project.findFirst({
            where: {
                id: projectId
            },
            include: {
                ProjectMembers: true,
                ProjectClient: true
            }
        });
        if (!data) {
            throw {
                message: "No Project Found with the provided ID",
                statusCode: 404
            };
        }
        if (projectInchargeId && projectInchargeId.length > 0) {
            let newUniqueUserIds = [];
            let existingUserWithDifferentProjectRole = [];
            projectInchargeId.forEach((inchargeId) => {
                if (newUniqueUserIds.includes(inchargeId) || existingUserWithDifferentProjectRole.includes(inchargeId)) {
                    return;
                }
                let esitingUser = data.ProjectMembers.find((ele) => ele.userId === inchargeId);
                if (esitingUser) {
                    if (esitingUser.projectRole !== constants_1.ProjectRole.projectIncharge) {
                        existingUserWithDifferentProjectRole.push(esitingUser.userId);
                    }
                }
                else {
                    newUniqueUserIds.push(inchargeId);
                }
            });
            if (newUniqueUserIds.length > 0) {
                let dt = [];
                newUniqueUserIds.forEach((ele) => {
                    dt.push({
                        projectId: data.id,
                        userId: ele,
                        projectRole: constants_1.ProjectRole.projectIncharge
                    });
                });
                await this.prisma.projectMembers.createMany({
                    data: dt
                });
                let emitterData = new notification_dto_1.NotificationEventDto({ recordId: data.id, moduleName: 'projectMembersAddition', additionalData: dt });
                this.eventEmitter.emit('notification.send', emitterData);
            }
            if (existingUserWithDifferentProjectRole.length > 0) {
                await this.prisma.projectMembers.updateMany({
                    where: {
                        userId: {
                            in: existingUserWithDifferentProjectRole
                        }
                    },
                    data: {
                        projectRole: constants_1.ProjectRole.projectIncharge
                    }
                });
            }
        }
        if (supportEngineersId && supportEngineersId.length > 0) {
            let newUniqueUserIds = [];
            let existingUserWithDifferentProjectRole = [];
            supportEngineersId.forEach((engineerId) => {
                if (newUniqueUserIds.includes(engineerId) || existingUserWithDifferentProjectRole.includes(engineerId)) {
                    return;
                }
                let esitingUser = data.ProjectMembers.find((ele) => ele.userId === engineerId);
                if (esitingUser) {
                    if (esitingUser.projectRole !== constants_1.ProjectRole.supportEngineers) {
                        existingUserWithDifferentProjectRole.push(esitingUser.userId);
                    }
                }
                else {
                    newUniqueUserIds.push(engineerId);
                }
            });
            if (newUniqueUserIds.length > 0) {
                let dt = [];
                newUniqueUserIds.forEach((ele) => {
                    dt.push({
                        projectId: data.id,
                        userId: ele,
                        projectRole: constants_1.ProjectRole.supportEngineers
                    });
                });
                await this.prisma.projectMembers.createMany({
                    data: dt
                });
                let emitterData = new notification_dto_1.NotificationEventDto({ recordId: data.id, moduleName: 'projectMembersAddition', additionalData: dt });
                this.eventEmitter.emit('notification.send', emitterData);
            }
            if (existingUserWithDifferentProjectRole.length > 0) {
                await this.prisma.projectMembers.updateMany({
                    where: {
                        userId: {
                            in: existingUserWithDifferentProjectRole
                        }
                    },
                    data: {
                        projectRole: constants_1.ProjectRole.supportEngineers
                    }
                });
            }
        }
        if (clientRepresentativeId) {
            let esitingClientRepresentative = data.ProjectClient.find((ele) => ele.clientId === clientRepresentativeId);
            if (esitingClientRepresentative) {
                if (esitingClientRepresentative.isRepresentative !== true) {
                    await this.prisma.projectClient.update({
                        where: {
                            projectId_clientId: {
                                clientId: clientRepresentativeId,
                                projectId: data.id
                            }
                        },
                        data: {
                            isRepresentative: true
                        }
                    });
                    await this.prisma.projectClient.updateMany({
                        where: {
                            clientId: {
                                not: clientRepresentativeId
                            },
                            projectId: data.id
                        },
                        data: {
                            isRepresentative: false
                        }
                    });
                }
            }
            else {
                await this.prisma.projectClient.create({
                    data: {
                        clientId: clientRepresentativeId,
                        projectId: data.id,
                        isRepresentative: true
                    }
                });
                await this.prisma.projectClient.updateMany({
                    where: {
                        clientId: {
                            not: clientRepresentativeId
                        },
                        projectId: data.id
                    },
                    data: {
                        isRepresentative: false
                    }
                });
            }
        }
        if (clients && clients.length > 0) {
            let newUniqueUserIds = [];
            clients.forEach((clientId) => {
                if (newUniqueUserIds.includes(clientId) || clientId === clientRepresentativeId) {
                    return;
                }
                let esitingUser = data.ProjectClient.find((ele) => ele.clientId === clientId);
                if (!esitingUser) {
                    newUniqueUserIds.push(clientId);
                }
            });
            if (newUniqueUserIds.length > 0) {
                let dt = [];
                newUniqueUserIds.forEach((ele) => {
                    dt.push({
                        projectId: data.id,
                        clientId: ele,
                        isRepresentative: false
                    });
                });
                await this.prisma.projectClient.createMany({
                    data: dt
                });
            }
        }
    }
    async updateProjectStatus(updateProjectStatus, user) {
        let projectStateData = await this.prisma.projectState.findFirst({
            where: {
                id: updateProjectStatus.projectStateId,
                isDeleted: false,
                isPublished: true
            }
        });
        if (!projectStateData) {
            throw {
                message: "This status is not available or may have been removed by the administrator",
                statusCode: 404
            };
        }
        let updateData = {
            projectStateId: projectStateData.id,
            isClosed: projectStateData.shouldCloseProject === true ? true : false,
            modifiedDate: new Date(),
            modifiedById: user.userId
        };
        return this.prisma.project.update({
            where: {
                id: updateProjectStatus.projectId,
            },
            data: updateData
        });
    }
    async addProjectStates(id, projectStateIds) {
        let insertData = projectStateIds.map((key) => ({ pId: id, pstateId: key }));
        try {
            let result = await this.prisma.projectEnableStates.createMany({
                data: insertData
            });
            console.log('Insert result:', result);
            return result;
        }
        catch (err) {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 404, data: {} };
            throw errorResponse;
        }
    }
    findProjectStatesByStateIds(pId, projectStateIds) {
        let condition = { pId: pId };
        condition = Object.assign(Object.assign({}, condition), { pstateId: { in: projectStateIds } });
        return this.prisma.projectEnableStates.findMany({
            where: condition
        });
    }
    removeProjectStatesByStateIds(pId, projectStateIds) {
        return this.prisma.projectEnableStates.deleteMany({
            where: {
                pId: pId,
                pstateId: {
                    in: projectStateIds
                }
            }
        });
    }
    removeProjectFiles(fileId, user) {
        return this.prisma.fileManagement.update({
            where: {
                id: fileId
            },
            data: {
                isDeleted: true,
                deletedDate: new Date(),
                deletedById: user.userId
            }
        });
    }
    applyResourcesFilters(filters) {
        let condition = {
            isDeleted: false
        };
        if (filters && Object.entries(filters).length > 0) {
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
            if (filters.fileName) {
                condition = Object.assign(Object.assign({}, condition), { AND: {
                        OR: [
                            {
                                file: {
                                    contains: filters.fileName,
                                    mode: 'insensitive'
                                }
                            },
                            {
                                title: {
                                    contains: filters.fileName,
                                    mode: 'insensitive'
                                }
                            },
                            {
                                name: {
                                    contains: filters.fileName,
                                    mode: 'insensitive'
                                }
                            },
                            {
                                description: {
                                    contains: filters.fileName,
                                    mode: 'insensitive'
                                }
                            }
                        ]
                    } });
            }
            if (filters.fileType) {
                condition = Object.assign(Object.assign({}, condition), { fileType: filters.fileType });
            }
            if (filters.sharedToClient) {
                condition = Object.assign(Object.assign({}, condition), { FileshareLogs: {
                        some: {}
                    } });
            }
            if (filters.projectDocumentsTypes) {
                condition = Object.assign(Object.assign({}, condition), { documentType: filters.projectDocumentsTypes });
            }
            if (filters.projectId) {
                condition = Object.assign(Object.assign({}, condition), { projectId: filters.projectId });
            }
        }
        return condition;
    }
    applyNotesFilters(filters) {
        let condition = {
            isDeleted: false,
            AND: {
                OR: [
                    {
                        message: {
                            not: ""
                        }
                    },
                    {
                        Media: {
                            some: {
                                isDeleted: false
                            }
                        }
                    }
                ]
            }
        };
        if (filters && Object.entries(filters).length > 0) {
            if (filters.message) {
                condition = Object.assign(Object.assign({}, condition), { message: {
                        contains: filters.message,
                        mode: 'insensitive'
                    } });
            }
            if (filters.projectId) {
                condition = Object.assign(Object.assign({}, condition), { projectId: filters.projectId });
            }
        }
        return condition;
    }
    findAllResources(filters, pagination) {
        let skip = (pagination.perPage * (pagination.page - 1));
        let take = pagination.perPage;
        let records = this.prisma.fileManagement.findMany({
            where: filters,
            skip: skip,
            take: take,
            select: {
                id: true,
                uuid: true,
                file: true,
                name: true,
                path: true,
                title: true,
                fileType: true,
                addedDate: true,
                documentType: true,
                AddedBy: {
                    select: user_dto_1.UserDefaultAttributes
                }
            },
            orderBy: {
                id: 'desc'
            }
        });
        return records;
    }
    findProjectNotes(filters, pagination) {
        let skip = (pagination.perPage * (pagination.page - 1));
        let take = pagination.perPage;
        let cursor = undefined;
        if (pagination.before) {
            cursor = {
                id: pagination.before
            };
        }
        let records = this.prisma.projectConversation.findMany({
            where: filters,
            skip: (pagination.before) ? 1 : skip,
            take: take,
            cursor: (pagination.before) ? cursor : undefined,
            include: {
                User: {
                    select: {
                        firstName: true,
                        lastName: true,
                        profile: true,
                        id: true,
                        uuid: true,
                        email: true
                    }
                },
                Media: {
                    where: {
                        isDeleted: false
                    },
                    select: {
                        id: true,
                        uuid: true,
                        file: true,
                        name: true,
                        path: true,
                        fileType: true,
                        addedDate: true,
                        AddedBy: {
                            select: user_dto_1.UserDefaultAttributes
                        }
                    }
                }
            },
            orderBy: {
                addedDate: 'desc'
            }
        });
        return records;
    }
    async createProjectNote(createDto, user) {
        const { message } = createDto, rest = __rest(createDto, ["message"]);
        let formattedMessage = message.replace(/\n{3,}/g, '\n\n').trim();
        let conversation = await this.prisma.projectConversation.create({
            data: Object.assign(Object.assign({}, rest), { message: formattedMessage, userId: user.userId }),
            include: {
                User: {
                    select: {
                        firstName: true,
                        lastName: true,
                        profile: true,
                        id: true,
                        uuid: true,
                        email: true
                    }
                },
                Project: {
                    select: Object.assign(Object.assign({}, project_dto_1.ProjectDefaultAttributes), { onHold: true, ProjectMembers: {
                            where: {
                                User: {
                                    isDeleted: false
                                }
                            },
                            include: {
                                User: {
                                    select: user_dto_1.UserDefaultAttributes
                                }
                            }
                        } })
                },
                Media: {
                    where: {
                        isDeleted: false
                    },
                    select: {
                        id: true,
                        uuid: true,
                        file: true,
                        name: true,
                        path: true,
                        fileType: true,
                        addedDate: true,
                        AddedBy: {
                            select: user_dto_1.UserDefaultAttributes
                        }
                    }
                }
            },
        });
        this.chatGateway.sendMessage(conversation, user.userId);
        this.readAllConversation(conversation.projectId, user);
        return conversation;
    }
    async removeNote(noteId) {
        let currentTime = new Date();
        let recordData = await this.prisma.projectConversation.findUniqueOrThrow({
            where: {
                id: noteId
            }
        });
        let timeDifference = Math.abs((0, common_2.getMinutesDiff)(recordData.addedDate, currentTime));
        if (timeDifference > 15) {
            throw {
                message: "You cannot delete conversation anymore. Deletions are restricted to 15 minutes of posting a message.",
                statusCode: 400
            };
        }
        return this.prisma.projectConversation.update({
            where: {
                id: noteId
            },
            data: {
                isDeleted: true,
                Media: {
                    updateMany: {
                        where: {
                            projectConversationId: noteId
                        },
                        data: {
                            isDeleted: true
                        }
                    }
                }
            }
        });
    }
    async removeNoteMedia(mediaId) {
        let currentTime = new Date();
        let recordData = await this.prisma.fileManagement.findUniqueOrThrow({
            where: {
                id: mediaId
            }
        });
        let timeDifference = Math.abs((0, common_2.getMinutesDiff)(recordData.addedDate, currentTime));
        if (timeDifference > 15) {
            throw {
                message: "You cannot delete conversation anymore. Deletions are restricted to 15 minutes of posting a message.",
                statusCode: 400
            };
        }
        return this.prisma.fileManagement.update({
            where: {
                id: mediaId
            },
            data: {
                isDeleted: true
            }
        });
    }
    async readAllConversation(projectId, user) {
        let notReadMessages = await this.prisma.projectConversation.findMany({
            where: {
                AND: {
                    isDeleted: false,
                    projectId: projectId,
                    userId: {
                        not: user.userId
                    },
                    OR: [
                        {
                            ReadLog: {
                                some: {
                                    userId: user.userId,
                                    read: false
                                }
                            }
                        },
                        {
                            ReadLog: {
                                none: {
                                    userId: user.userId
                                }
                            }
                        }
                    ]
                }
            },
            select: {
                id: true
            }
        });
        if (notReadMessages.length === 0) {
            return;
        }
        this.logger.log(`Marking ${notReadMessages.length} messages as read`);
        const MAX_CONCURRENT_OPERATIONS = 10;
        await BluebirdPromise.map(notReadMessages, async (msg) => {
            try {
                await this.prisma.projectConversationReadLog.upsert({
                    where: {
                        conversationId_userId: {
                            conversationId: msg.id,
                            userId: user.userId
                        },
                    },
                    create: {
                        conversationId: msg.id,
                        userId: user.userId,
                        read: true
                    },
                    update: {
                        read: true
                    }
                });
            }
            catch (err) {
                this.logger.error("Some error marking message as read", err.message);
            }
        }, { concurrency: MAX_CONCURRENT_OPERATIONS });
    }
    async shareFilesToClient(shareFiles, user) {
        let allFilesToShare = await this.prisma.fileManagement.findMany({
            where: {
                projectId: shareFiles.projectId,
                id: {
                    in: shareFiles.fileIds
                }
            }
        });
        let projectData = await this.prisma.project.findUniqueOrThrow({
            where: {
                id: shareFiles.projectId
            },
            include: {
                Client: {
                    select: client_dto_1.ClientDefaultAttributes
                },
                ProjectClient: {
                    include: {
                        Client: {
                            select: client_dto_1.ClientDefaultAttributes
                        }
                    }
                }
            }
        });
        if (allFilesToShare.length === 0) {
            throw {
                message: "FNo Files Found for the given Project and File Ids"
            };
        }
        let lastBatch = await this.prisma.fileshareLogs.aggregate({
            _max: {
                batchNumber: true
            }
        });
        let newBatch = (lastBatch && lastBatch._max.batchNumber) ? lastBatch._max.batchNumber + 1 : 1;
        let allRecords = [];
        allFilesToShare.forEach((ele) => {
            let t = {
                clientId: projectData.clientId,
                projectId: ele.projectId,
                fileId: ele.id,
                addedDate: new Date(),
                sharedById: user.userId,
                batchNumber: newBatch
            };
            allRecords.push(t);
        });
        await this.prisma.fileshareLogs.createMany({
            data: allRecords
        });
        if (shareFiles.shareInEmail) {
            this.mailService.shareProjectFilesToClient(projectData, allFilesToShare, user);
        }
    }
    async findSharedFilesToClient(projectId) {
        return this.prisma.fileshareLogs.findMany({
            where: {
                projectId: projectId,
            }
        });
    }
    async prepareFinanceReport(projectId, projectEstimate) {
        let invoicedAmount = 0;
        let timeAndExpenses = 0;
        let invoiceTransaction = this.prisma.transactions.aggregate({
            where: {
                Invoice: {
                    InvoiceItems: {
                        some: {
                            Account: {
                                showInExpenseClaims: false
                            }
                        }
                    }
                },
                isDeleted: false,
                projectId: projectId
            },
            _sum: { amount: true }
        });
        let expensesTransaction = this.prisma.transactions.aggregate({
            where: {
                Invoice: {
                    InvoiceItems: {
                        some: {
                            Account: {
                                showInExpenseClaims: true
                            }
                        }
                    }
                },
                isDeleted: false,
                projectId: projectId
            },
            _sum: { amount: true }
        });
        let pendingInvoicesCount = this.prisma.invoice.count({
            where: {
                status: {
                    in: [constants_1.InvoiceStatus.sent, constants_1.InvoiceStatus.generated]
                },
                projectId: projectId,
                isDeleted: false
            }
        });
        let expensesToCollectCount = this.prisma.transactions.count({
            where: {
                status: {
                    in: [constants_1.TransactionStatus.sent_to_client, constants_1.TransactionStatus.pending_payment]
                },
                authorityId: { not: null },
                isDeleted: false,
                projectId: projectId
            }
        });
        let after30Days = new Date();
        after30Days.setDate(after30Days.getDate() + 30);
        let permitExpiringCount = this.prisma.permit.count({
            where: {
                isDeleted: false,
                projectId: projectId,
                expiryDate: {
                    lte: after30Days,
                    gte: new Date()
                },
            }
        });
        const [invoicePayments, expensePayments, invoiceToCollectPayment, governmentFeesToCollect, permitExpiring] = await Promise.all([invoiceTransaction, expensesTransaction, pendingInvoicesCount, expensesToCollectCount, permitExpiringCount]);
        invoicedAmount = invoicePayments._sum.amount;
        timeAndExpenses = expensePayments._sum.amount | 0;
        let invoicedPercentage = (invoicedAmount / projectEstimate) * 100;
        return {
            projectEstimate: projectEstimate,
            invoicedAmount: invoicedAmount,
            invoicedPercentage: invoicedPercentage,
            timeAndExpensesAmount: timeAndExpenses,
            toBeInvoicedAmount: projectEstimate - invoicedAmount,
            toBeInvoicedAmountPercentage: 100 - invoicedPercentage,
            invoiceToCollectPayment: invoiceToCollectPayment,
            governmentFeesToCollect: governmentFeesToCollect,
            permitExpiringThisMonth: permitExpiring
        };
    }
    async findSharedFiles(projectId) {
        let query = `SELECT "batchNumber", DATE("addedDate") as "sharedDate"
    FROM "FileshareLogs"
    WHERE "projectId" = '${projectId}'
    GROUP BY "batchNumber", "sharedDate"
    ORDER BY "batchNumber" ASC
    ;`;
        const uniqueBatchNumbers = await this.prisma.$queryRawUnsafe(query);
        const filesShared = await Promise.all(uniqueBatchNumbers.map(async (entry) => {
            const files = await this.prisma.fileManagement.findMany({
                where: {
                    projectId: projectId,
                    FileshareLogs: {
                        some: {
                            batchNumber: entry.batchNumber
                        }
                    }
                },
                select: {
                    id: true,
                    uuid: true,
                    file: true,
                    name: true,
                    path: true,
                    title: true,
                    fileType: true,
                    addedDate: true,
                    documentType: true,
                    AddedBy: {
                        select: user_dto_1.UserDefaultAttributes
                    },
                },
                orderBy: {
                    id: 'desc'
                },
            });
            return {
                batchNumber: entry.batchNumber,
                sharedDate: (files.length > 0) ? files[0].addedDate : undefined,
                sharedFiles: files,
            };
        }));
        return filesShared;
    }
};
ProjectService = ProjectService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(4, (0, bull_1.InjectQueue)('xero')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService,
        chat_gateway_1.ChatGateway,
        event_emitter_1.EventEmitter2, Object])
], ProjectService);
exports.ProjectService = ProjectService;
//# sourceMappingURL=project.service.js.map