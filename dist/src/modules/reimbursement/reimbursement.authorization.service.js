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
exports.ReimbursementAuthorizationService = void 0;
const common_1 = require("@nestjs/common");
const authorization_service_1 = require("../../authorization/authorization.service");
const constants_1 = require("../../config/constants");
const prisma_service_1 = require("../../prisma.service");
const reimbursement_permissions_1 = require("./reimbursement.permissions");
let ReimbursementAuthorizationService = class ReimbursementAuthorizationService extends authorization_service_1.AuthorizationService {
    constructor(prisma) {
        super(prisma);
        this.prisma = prisma;
    }
    async isAuthorizedForReimbursement(recordId, user) {
        if (user.roles.slugs.includes(constants_1.SUPER_ADMIN)) {
            return true;
        }
        let permissions = await this.findUserPermissionsAgainstSlugs(user, [reimbursement_permissions_1.ReimbursementPermissionSet.FINANCE_APPROVAL, reimbursement_permissions_1.ReimbursementPermissionSet.HR_APPROVAL]);
        if (permissions.reimbursementFinanceApproval || permissions.reimbursementHRApproval) {
            return true;
        }
        let record = await this.prisma.reimbursement.findFirst({
            where: {
                id: recordId
            },
        });
        if (record.requestById === user.userId) {
            return true;
        }
        throw {
            message: "Forbidden resource",
            statusCode: 403
        };
    }
};
ReimbursementAuthorizationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReimbursementAuthorizationService);
exports.ReimbursementAuthorizationService = ReimbursementAuthorizationService;
//# sourceMappingURL=reimbursement.authorization.service.js.map