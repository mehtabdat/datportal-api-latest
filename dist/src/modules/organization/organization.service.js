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
var OrganizationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationService = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../../config/constants");
const prisma_service_1 = require("../../prisma.service");
const helpers_1 = require("../../helpers/helpers");
const user_avatar_1 = require("../../helpers/user-avatar");
let OrganizationService = OrganizationService_1 = class OrganizationService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(OrganizationService_1.name);
    }
    async create(createOrganizationDto, user) {
        let country = await this.prisma.country.findFirst({
            where: {
                isoCode: {
                    equals: "AE",
                    mode: 'insensitive'
                }
            }
        });
        let parent = undefined;
        if (createOrganizationDto.type === constants_1.OrganizationType.branch) {
            if (!createOrganizationDto.parentId) {
                throw {
                    message: "Please choose a parent company",
                    statusCode: 400
                };
            }
            else {
                parent = createOrganizationDto.parentId;
            }
        }
        return this.prisma.organization.create({
            data: Object.assign(Object.assign({}, createOrganizationDto), { addedById: user.userId, countryId: country.id, parentId: parent }),
        })
            .catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    findAll(pagination, sorting, condition, meta) {
        let skip = (pagination.perPage * (pagination.page - 1));
        let take = pagination.perPage;
        let __sorter = { [sorting.sortByField]: sorting.sortOrder };
        let records = this.prisma.organization.findMany({
            where: condition,
            include: {
                Country: {
                    select: {
                        name: true,
                        isoCode: true,
                        displayName: true
                    }
                },
                WorkingHours: true
            },
            skip: skip,
            take: take,
            orderBy: __sorter
        });
        return records;
    }
    findAllPublished(pagination, sorting, condition) {
        let skip = (pagination.perPage * (pagination.page - 1));
        let take = pagination.perPage;
        let __sorter = { [sorting.sortByField]: sorting.sortOrder };
        let records = this.prisma.organization.findMany({
            where: condition,
            select: {
                id: true,
                uuid: true,
                email: true,
                phone: true,
                phoneCode: true,
                whatsapp: true,
                address: true,
                logo: true,
                name: true
            },
            skip: skip,
            take: take,
            orderBy: [
                {
                    addedDate: 'desc'
                },
                __sorter
            ],
        });
        return records;
    }
    findOne(id) {
        return this.prisma.organization.findUnique({
            where: {
                id: id
            },
            include: {
                WorkingHours: true
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    findOneByUUID(uuid) {
        return this.prisma.organization.findFirst({
            where: {
                uuid: uuid,
                status: constants_1.OrganizationStatus.active
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    update(id, updateOrganizationDto) {
        if (updateOrganizationDto.parentId && updateOrganizationDto.parentId === id) {
            throw {
                message: "Organization cannot be a parent of itself",
                statusCode: 400
            };
        }
        return this.prisma.organization.update({
            data: updateOrganizationDto,
            where: {
                id: id
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    remove(id, userId) {
        return this.prisma.organization.update({
            data: {
                isPublished: false,
                isDeleted: true,
                deletedById: userId,
                deletedDate: new Date()
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
    applyFilters(filters) {
        let condition = { isDeleted: false };
        if (Object.entries(filters).length > 0) {
            if (filters.email) {
                condition = Object.assign(Object.assign({}, condition), { email: filters.email });
            }
            if (filters.isPublished !== undefined) {
                condition = Object.assign(Object.assign({}, condition), { isPublished: filters.isPublished });
            }
            if (filters.phone) {
                condition = Object.assign(Object.assign({}, condition), { phone: { contains: filters.phone } });
            }
            if (filters.status) {
                condition = Object.assign(Object.assign({}, condition), { status: filters.status });
            }
            if (filters.ids) {
                condition = Object.assign(Object.assign({}, condition), { id: {
                        in: filters.ids
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
            if (filters.name) {
                condition = Object.assign(Object.assign({}, condition), { name: {
                        contains: filters.name,
                        mode: 'insensitive'
                    } });
            }
            if (filters.fetchParentOnly) {
                condition = Object.assign(Object.assign({}, condition), { parentId: null });
            }
            if (filters.type) {
                if (filters.includeBranches) {
                    condition = Object.assign(Object.assign({}, condition), { OR: [
                            {
                                Parent: {
                                    type: filters.type
                                }
                            },
                            {
                                type: filters.type
                            }
                        ] });
                }
                else {
                    condition = Object.assign(Object.assign({}, condition), { type: filters.type });
                }
            }
        }
        return condition;
    }
    countTotalRecord(filters) {
        return this.prisma.organization.count({
            where: filters
        });
    }
    publishOrganization(organizationId) {
        return this.prisma.organization.update({
            where: {
                id: organizationId
            },
            data: {
                status: constants_1.OrganizationStatus.active
            }
        });
    }
    suspendOrganization(organizationId) {
        return this.prisma.organization.update({
            where: {
                id: organizationId
            },
            data: {
                status: constants_1.OrganizationStatus.suspended
            }
        });
    }
    async createOrganizationAvatar(organizationId, meta = { organizationName: "", shouldFetch: true }) {
        let organizationName = meta.organizationName;
        if (meta.shouldFetch === true) {
            let org = await this.findOne(organizationId);
            if (!org || org.logo) {
                return false;
            }
            organizationName = org.name;
        }
        let filename = (0, helpers_1.generateSEOFriendlyFileName)(organizationName) + "-" + Date.now() + ".png";
        let currentDate = new Date().toISOString().split('T')[0];
        let fileLocation = 'public/organization/' + currentDate;
        try {
            (0, user_avatar_1.createAvatarImage)(organizationName, fileLocation, filename);
            let profileUploaded = fileLocation + "/" + filename;
            await this.prisma.organization.update({
                data: {
                    logo: profileUploaded,
                },
                where: {
                    id: organizationId
                }
            });
            return profileUploaded;
        }
        catch (err) {
            this.logger.error("some error while creating organization avatar", err);
        }
    }
};
OrganizationService = OrganizationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrganizationService);
exports.OrganizationService = OrganizationService;
//# sourceMappingURL=organization.service.js.map