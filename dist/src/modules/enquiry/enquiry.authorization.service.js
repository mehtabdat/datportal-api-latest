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
exports.EnquiryAuthorizationService = void 0;
const common_1 = require("@nestjs/common");
const authorization_service_1 = require("../../authorization/authorization.service");
const constants_1 = require("../../config/constants");
const prisma_service_1 = require("../../prisma.service");
const enquiry_permissions_1 = require("./enquiry.permissions");
let EnquiryAuthorizationService = class EnquiryAuthorizationService extends authorization_service_1.AuthorizationService {
    constructor(prisma) {
        super(prisma);
        this.prisma = prisma;
    }
    async isAuthorizedForEnquiry(recordId, user) {
        if (user.roles.slugs.includes(constants_1.SUPER_ADMIN)) {
            return true;
        }
        let permissions = await this.findUserPermissionsAgainstSlugs(user, [enquiry_permissions_1.EnquiryPermissionSet.READ_ALL]);
        if (permissions.readAllEnquiry) {
            return true;
        }
        let record = await this.prisma.enquiry.findFirst({
            where: {
                id: recordId,
                AND: {
                    OR: [
                        { addedById: user.userId },
                        { assignedToId: user.userId }
                    ]
                }
            },
        });
        if (record) {
            return true;
        }
        throw {
            message: "Forbidden resource",
            statusCode: 403
        };
    }
    async isAuthorizedForEnquiryNote(recordId, user) {
        if (user.roles.slugs.includes(constants_1.SUPER_ADMIN)) {
            return true;
        }
        let permissions = await this.findUserPermissionsAgainstSlugs(user, [enquiry_permissions_1.EnquiryPermissionSet.READ_ALL]);
        if (permissions.readAllEnquiry) {
            return true;
        }
        let record = await this.prisma.leadEnquiryFollowUp.findFirst({
            where: {
                id: recordId,
                AND: {
                    OR: [
                        {
                            Enquiry: {
                                AND: {
                                    OR: [
                                        { addedById: user.userId },
                                        { assignedToId: user.userId }
                                    ]
                                }
                            }
                        },
                        {
                            Lead: {
                                AND: {
                                    OR: [
                                        { addedById: user.userId },
                                        { assignedToId: user.userId }
                                    ]
                                }
                            }
                        }
                    ]
                }
            },
        });
        if (record) {
            return true;
        }
        throw {
            message: "Forbidden resource",
            statusCode: 403
        };
    }
    async isAuthorizedForEnquiryDocument(recordId, user) {
        if (user.roles.slugs.includes(constants_1.SUPER_ADMIN)) {
            return true;
        }
        let permissions = await this.findUserPermissionsAgainstSlugs(user, [enquiry_permissions_1.EnquiryPermissionSet.READ_ALL]);
        if (permissions.readAllEnquiry) {
            return true;
        }
        let record = await this.prisma.enquiryAttachment.findFirst({
            where: {
                id: recordId,
                AND: {
                    OR: [
                        {
                            Enquiry: {
                                AND: {
                                    OR: [
                                        { addedById: user.userId },
                                        { assignedToId: user.userId }
                                    ]
                                }
                            }
                        },
                        {
                            Lead: {
                                AND: {
                                    OR: [
                                        { addedById: user.userId },
                                        { assignedToId: user.userId }
                                    ]
                                }
                            }
                        }
                    ]
                }
            },
        });
        if (record) {
            return true;
        }
        throw {
            message: "Forbidden resource",
            statusCode: 403
        };
    }
};
EnquiryAuthorizationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EnquiryAuthorizationService);
exports.EnquiryAuthorizationService = EnquiryAuthorizationService;
//# sourceMappingURL=enquiry.authorization.service.js.map