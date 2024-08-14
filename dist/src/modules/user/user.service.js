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
var UserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const constants_1 = require("../../config/constants");
const bcrypt_helpers_1 = require("../../helpers/bcrypt-helpers");
const helpers_1 = require("../../helpers/helpers");
const user_avatar_1 = require("../../helpers/user-avatar");
const prisma_service_1 = require("../../prisma.service");
const user_sorting_dto_1 = require("./dto/user-sorting.dto");
const user_dto_1 = require("./dto/user.dto");
const file_upload_utils_1 = require("../../helpers/file-upload.utils");
const common_2 = require("../../helpers/common");
let UserService = UserService_1 = class UserService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(UserService_1.name);
    }
    async create(createUserDto) {
        createUserDto.password = (0, bcrypt_helpers_1.generateHash)(createUserDto.password);
        let dataRestrictions = [];
        if (createUserDto.dataAccessRestrictedTo) {
            dataRestrictions = createUserDto.dataAccessRestrictedTo.filter((ele) => ele !== 0);
        }
        return this.prisma.user.create({
            data: Object.assign(Object.assign({}, createUserDto), { dataAccessRestrictedTo: dataRestrictions }),
            select: user_dto_1.userAttributes.general
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 404, data: {} };
            throw errorResponse;
        });
    }
    findAll(pagination, sorting, condition) {
        let skip = (pagination.perPage * (pagination.page - 1));
        let take = pagination.perPage;
        let __sorter = { [sorting.sortByField]: sorting.sortOrder };
        if (sorting.sortByField === user_sorting_dto_1.SortableFields.name) {
            __sorter = {
                firstName: sorting.sortOrder
            };
        }
        return this.prisma.user.findMany({
            where: condition,
            select: {
                id: true,
                uuid: true,
                firstName: true,
                lastName: true,
                phoneCode: true,
                email: true,
                phone: true,
                address: true,
                preferences: true,
                profile: true,
                phoneVerified: true,
                emailVerified: true,
                userSignupSource: true,
                addedDate: true,
                designation: true,
                status: true,
                dateOfJoining: true,
                lastWorkingDate: true,
                enableRemoteCheckin: true,
                _count: {
                    select: {
                        AssetAllocation: true
                    }
                },
                Department: {
                    select: {
                        id: true,
                        title: true,
                        slug: true
                    }
                },
                organizationId: true,
                Organization: {
                    select: {
                        id: true,
                        name: true,
                        uuid: true,
                        logo: true
                    }
                },
                managerId: true,
                Manager: {
                    select: user_dto_1.UserDefaultAttributes
                },
                AddedBy: {
                    select: {
                        id: true,
                        uuid: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                isPublished: true,
                userRole: {
                    select: {
                        Role: {
                            select: {
                                id: true,
                                title: true,
                                slug: true
                            }
                        }
                    }
                }
            },
            skip: skip,
            take: take,
            orderBy: __sorter
        });
    }
    findAllBasic(pagination, sorting, condition) {
        let skip = (pagination.perPage * (pagination.page - 1));
        let take = pagination.perPage;
        let __sorter = { [sorting.sortByField]: sorting.sortOrder };
        if (sorting.sortByField === user_sorting_dto_1.SortableFields.name) {
            __sorter = {
                firstName: sorting.sortOrder
            };
        }
        return this.prisma.user.findMany({
            where: condition,
            select: {
                id: true,
                uuid: true,
                firstName: true,
                lastName: true,
                phoneCode: true,
                email: true,
                phone: true,
                profile: true,
                isPublished: true,
                designation: true,
            },
            skip: skip,
            take: take,
            orderBy: __sorter
        });
    }
    findAllAuthTokensIssued(pagination, condition) {
        let skip = (pagination.perPage * (pagination.page - 1));
        let take = pagination.perPage;
        return this.prisma.authTokens.findMany({
            where: condition,
            select: {
                id: true,
                userAgent: true,
                userIP: true,
                tokenType: true,
                addedDate: true,
                status: true,
                user: {
                    select: {
                        id: true,
                        uuid: true,
                        firstName: true,
                        lastName: true,
                        status: true,
                    }
                }
            },
            skip: skip,
            take: take,
            orderBy: {
                addedDate: 'desc'
            }
        });
    }
    findAllocatedResource(id) {
        return this.prisma.assetAllocation.findMany({
            where: {
                userId: id
            },
            include: {
                CompanyAsset: {
                    where: {
                        isDeleted: false
                    },
                    select: {
                        id: true,
                        assetName: true,
                        type: true,
                        code: true,
                        assetDetail: true,
                    }
                }
            }
        });
    }
    findOne(id) {
        return this.prisma.user.findUnique({
            where: {
                id: id
            },
            select: {
                id: true,
                uuid: true,
                firstName: true,
                lastName: true,
                phoneCode: true,
                email: true,
                phone: true,
                address: true,
                preferences: true,
                profile: true,
                phoneVerified: true,
                emailVerified: true,
                whatsapp: true,
                UserMeta: true,
                status: true,
                departmentId: true,
                designation: true,
                dateOfJoining: true,
                lastWorkingDate: true,
                dataAccessRestrictedTo: true,
                Salary: {
                    orderBy: {
                        addedDate: 'asc'
                    }
                },
                LeaveCredits: {
                    orderBy: {
                        addedDate: 'desc'
                    }
                },
                AddedBy: {
                    select: {
                        id: true,
                        uuid: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                AssetAllocation: {
                    select: {
                        label: true,
                        id: true,
                        CompanyAsset: {
                            where: {
                                isDeleted: false
                            },
                            select: {
                                id: true,
                                assetName: true,
                                type: true,
                                code: true,
                                assetDetail: true,
                            }
                        }
                    }
                },
                Department: {
                    select: {
                        id: true,
                        title: true,
                        slug: true
                    }
                },
                organizationId: true,
                Organization: {
                    select: {
                        id: true,
                        name: true,
                        uuid: true,
                        logo: true
                    }
                },
                managerId: true,
                Manager: {
                    select: user_dto_1.UserDefaultAttributes
                },
                UserDocuments: {
                    include: {
                        AddedBy: {
                            select: user_dto_1.UserDefaultAttributes
                        }
                    },
                    where: {
                        isDeleted: false
                    },
                    orderBy: {
                        addedDate: 'desc'
                    }
                },
                isPublished: true
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 404, data: {} };
            throw errorResponse;
        });
    }
    findOneByEmail(email, atttibutes = user_dto_1.userAttributesTypes.GENERAL) {
        const __attributes = user_dto_1.userAttributes[atttibutes];
        return this.prisma.user.findFirst({
            select: __attributes,
            where: {
                email: email
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 404, data: {} };
            throw errorResponse;
        });
    }
    findLoggedInUserDetails(email, extraParams = {}) {
        return this.prisma.user.findFirst({
            where: {
                isDeleted: false,
                email: {
                    equals: email,
                    mode: 'insensitive'
                }
            },
            select: {
                id: true,
                uuid: true,
                firstName: true,
                lastName: true,
                email: true,
                phoneCode: true,
                phone: true,
                profile: true,
                status: true,
                dataAccessRestrictedTo: true,
                _count: {
                    select: {
                        Employees: true
                    }
                },
                userSignupSource: (extraParams && extraParams.userSignupSource) ? extraParams.userSignupSource : false,
                password: (extraParams && extraParams.password) ? extraParams.password : false,
                Department: {
                    select: {
                        id: true,
                        title: true,
                        slug: true
                    }
                },
                Organization: {
                    select: {
                        id: true,
                        name: true,
                        logo: true,
                        uuid: true,
                        status: true,
                        type: true
                    }
                }
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 404, data: {} };
            throw errorResponse;
        });
    }
    async update(id, updateUserDto) {
        const { password } = updateUserDto;
        if (password) {
            updateUserDto.password = (0, bcrypt_helpers_1.generateHash)(updateUserDto.password);
            await this.prisma.authTokens.deleteMany({
                where: {
                    userId: id,
                    tokenType: client_1.TokenTypes.refreshToken
                }
            });
        }
        let dataRestrictions = [];
        if (updateUserDto.dataAccessRestrictedTo) {
            dataRestrictions = updateUserDto.dataAccessRestrictedTo.filter((ele) => ele !== 0);
        }
        return this.prisma.user.update({
            data: Object.assign(Object.assign({}, updateUserDto), { dataAccessRestrictedTo: updateUserDto.dataAccessRestrictedTo ? dataRestrictions : undefined }),
            where: {
                id: id
            },
            select: user_dto_1.userAttributes.general
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 404, data: {} };
            throw errorResponse;
        });
    }
    remove(id, user) {
        return this.prisma.user.update({
            data: {
                isPublished: false,
                status: constants_1.UserStatus.suspended,
                isDeleted: true,
                deletedDate: new Date(),
                deletedById: user.userId
            },
            where: {
                id: id
            },
            select: user_dto_1.userAttributes.general
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 404, data: {} };
            throw errorResponse;
        });
    }
    addUserRole(id, roles) {
        let insertData = roles.map((key) => { return { userId: id, roleId: key }; });
        return this.prisma.userRole.createMany({
            data: insertData
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 404, data: {} };
            throw errorResponse;
        });
    }
    removeAllUserRoles(id) {
        return this.prisma.userRole.deleteMany({
            where: {
                userId: id
            }
        });
    }
    findUserRolesByRoleIds(userId, roleIds) {
        let condition = { userId: userId };
        condition = Object.assign(Object.assign({}, condition), { roleId: { in: roleIds } });
        return this.prisma.userRole.findMany({
            where: condition
        });
    }
    removeUserRolesByRoleIds(userId, roleIds) {
        let condition = { userId: userId };
        condition = Object.assign(Object.assign({}, condition), { roleId: { in: roleIds } });
        return this.prisma.userRole.deleteMany({
            where: condition
        });
    }
    findLoggedInUserMenu(user) {
        let result;
        if (user.roles.slugs.includes(constants_1.SUPER_ADMIN)) {
            result = this.prisma.modules.findMany({
                where: {
                    isMenuItem: true
                },
                include: {
                    Permissions: {
                        where: {
                            isMenuItem: true
                        },
                        orderBy: {
                            order: 'asc'
                        }
                    }
                },
                orderBy: {
                    order: 'asc'
                }
            });
        }
        else {
            result = this.prisma.modules.findMany({
                where: {
                    AND: [
                        {
                            Permissions: {
                                some: {
                                    AND: [
                                        {
                                            RolePermissions: {
                                                some: {
                                                    roleId: {
                                                        in: user.roles.ids
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            isMenuItem: true
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            isMenuItem: true
                        }
                    ]
                },
                include: {
                    Permissions: {
                        where: {
                            isMenuItem: true,
                            RolePermissions: {
                                some: {
                                    roleId: {
                                        in: user.roles.ids
                                    }
                                }
                            }
                        },
                        orderBy: {
                            order: 'asc'
                        }
                    }
                },
                orderBy: {
                    order: 'asc'
                }
            });
        }
        return result;
    }
    async findUserPermissionsAgainstSlugs(user, slugs) {
        let results = {};
        let __slugs = Array.isArray(slugs) ? slugs : [slugs];
        if (user.roles.slugs.includes(constants_1.SUPER_ADMIN)) {
            __slugs.map(function (ele) {
                results[ele] = true;
            });
            return results;
        }
        else {
            let dt = await this.prisma.rolePermissions.findMany({
                where: {
                    AND: [
                        {
                            roleId: {
                                in: user.roles.ids
                            }
                        },
                        {
                            Permission: {
                                action: {
                                    in: __slugs
                                }
                            }
                        }
                    ]
                },
                select: {
                    Permission: {
                        select: {
                            action: true
                        }
                    }
                }
            });
            let foundSlugs = dt.map((ele) => {
                return ele.Permission.action;
            });
            __slugs.map(function (ele) {
                results[ele] = foundSlugs.includes(ele);
            });
            return results;
        }
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
            if (filters.organizationId) {
                condition = Object.assign(Object.assign({}, condition), { organizationId: filters.organizationId });
            }
            if (filters.ids) {
                if (filters.ids) {
                    if (Array.isArray(filters.ids)) {
                        condition = Object.assign(Object.assign({}, condition), { id: { in: filters.ids } });
                    }
                    else {
                        condition = Object.assign(Object.assign({}, condition), { id: filters.ids });
                    }
                }
            }
            if (filters.roleIds) {
                condition = Object.assign(Object.assign({}, condition), { userRole: {
                        some: {
                            roleId: {
                                in: filters.roleIds
                            }
                        }
                    } });
            }
            if (filters.roleSlugs) {
                condition = Object.assign(Object.assign({}, condition), { userRole: {
                        some: {
                            Role: {
                                slug: {
                                    in: filters.roleSlugs
                                }
                            }
                        }
                    } });
            }
            if (filters.departmentSlug) {
                condition = Object.assign(Object.assign({}, condition), { Department: {
                        slug: filters.departmentSlug
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
                let allIds = (0, common_2.extractIds)(filters.name);
                condition = Object.assign(Object.assign({}, condition), { OR: [
                        {
                            firstName: { contains: filters.name, mode: 'insensitive' }
                        },
                        {
                            lastName: { contains: filters.name, mode: 'insensitive' }
                        },
                        {
                            email: { contains: filters.name, mode: 'insensitive' }
                        },
                        ...(allIds && allIds.length > 0 ? [{ id: { in: allIds } }] : [])
                    ] });
            }
            if (filters.departmentId) {
                condition = Object.assign(Object.assign({}, condition), { departmentId: filters.departmentId });
            }
        }
        return condition;
    }
    applyFiltersAuthTokensIssued(filters) {
        let condition = {};
        if (Object.entries(filters).length > 0) {
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
            if (filters.userAgent) {
                condition = Object.assign(Object.assign({}, condition), { userAgent: {
                        contains: filters.userAgent,
                        mode: 'insensitive'
                    } });
            }
            if (filters.userIP) {
                condition = Object.assign(Object.assign({}, condition), { userIP: {
                        contains: filters.userIP,
                        mode: 'insensitive'
                    } });
            }
            if (filters.userId) {
                condition = Object.assign(Object.assign({}, condition), { user: {
                        id: filters.userId
                    } });
            }
            if (filters.tokenType) {
                condition = Object.assign(Object.assign({}, condition), { tokenType: filters.tokenType });
            }
        }
        return condition;
    }
    countTotalRecord(filters) {
        return this.prisma.user.count({
            where: filters
        });
    }
    countTotalAuthToken(filters) {
        return this.prisma.authTokens.count({
            where: filters
        });
    }
    async createUserAvatar(userId, meta = { username: "", shouldFetch: true }) {
        let username = meta.username;
        if (meta.shouldFetch === true) {
            let user = await this.findOne(userId);
            if (!user || user.profile) {
                return false;
            }
            username = user.firstName + " " + user.lastName;
        }
        let filename = (0, helpers_1.generateSEOFriendlyFileName)(username) + "-" + Date.now() + ".png";
        let currentDate = new Date().toISOString().split('T')[0];
        let fileLocation = 'public/user/' + currentDate;
        try {
            (0, user_avatar_1.createAvatarImage)(username, fileLocation, filename);
            let profileUploaded = fileLocation + "/" + filename;
            await this.prisma.user.update({
                data: {
                    profile: profileUploaded,
                    isAvatar: true
                },
                where: {
                    id: userId
                }
            });
            return profileUploaded;
        }
        catch (err) {
            this.logger.error("some error while creating user avatar", err);
        }
    }
    updateUserMeta(userId, updateUserMetaDto) {
        var _a;
        let allPromises = [];
        (_a = updateUserMetaDto.userMeta) === null || _a === void 0 ? void 0 : _a.map((ele) => {
            let data = this.prisma.userMeta.upsert({
                where: {
                    key_userId: {
                        userId: userId,
                        key: ele.key
                    }
                },
                create: {
                    key: ele.key,
                    value: ele.value,
                    userId: userId
                },
                update: {
                    value: ele.value
                }
            });
            allPromises.push(data);
        });
        return Promise.all(allPromises);
    }
    async deleteUserMeta(metaId) {
        return this.prisma.userMeta.delete({
            where: {
                id: metaId
            }
        });
    }
    async deleteUserMetaByKey(userId, key) {
        return this.prisma.userMeta.delete({
            where: {
                key_userId: {
                    key: key,
                    userId: userId
                }
            }
        });
    }
    findUserRoles(userId) {
        return this.prisma.userRole.findMany({
            where: {
                userId: userId
            },
            select: {
                Role: {
                    select: {
                        id: true,
                        slug: true
                    }
                }
            }
        });
    }
    deactivateUser(userId) {
        return this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                isDeleted: true,
                isPublished: false,
                status: constants_1.UserStatus.suspended
            }
        });
    }
    async handleUserDocuments(userDocuments, files, user) {
        let userData = await this.prisma.user.findUnique({
            where: {
                id: userDocuments.userId
            }
        });
        if (!userData) {
            throw new common_1.NotFoundException({ message: "userData with the provided userDataId not Found", statusCode: 400 });
        }
        let insertedIds = [];
        let insertData = files.map((ele, index) => {
            let newRecord = {
                title: userDocuments.title ? userDocuments.title : ele.originalname,
                documentType: userDocuments.documentType,
                file: (0, file_upload_utils_1.extractRelativePathFromFullPath)(ele.path),
                mimeType: ele.mimetype,
                addedById: user.userId,
                userId: userDocuments.userId
            };
            return newRecord;
        });
        if (insertData.length > 0) {
            return this.prisma.userDocument.createMany({
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
    updateUserDocument(updateDocuments) {
        const { documentId } = updateDocuments, rest = __rest(updateDocuments, ["documentId"]);
        return this.prisma.userDocument.update({
            where: {
                id: documentId
            },
            data: rest
        });
    }
    deleteUserDocument(documentId) {
        return this.prisma.userDocument.update({
            where: {
                id: documentId
            },
            data: {
                isDeleted: true
            }
        });
    }
    async findDashboardElements(user) {
        let userRole = await this.prisma.role.findFirst({
            where: {
                UserRole: {
                    some: {
                        userId: user.userId
                    }
                },
                DashboardElements: {
                    some: {
                        DashboardElement: {
                            isDeleted: false
                        }
                    }
                }
            },
            orderBy: {
                level: 'asc'
            }
        });
        return this.prisma.roleDashboardElement.findMany({
            where: {
                roleId: userRole.id,
                DashboardElement: {
                    isDeleted: false
                }
            },
            orderBy: {
                order: 'asc'
            }
        });
    }
    async updateSalary(userId, userSalaryDto) {
        let existing = await this.prisma.salary.findFirst({
            where: {
                isActive: true,
                userId: userId
            }
        });
        if (existing && userSalaryDto.startDate < existing.startDate) {
            throw {
                message: "You cannot choose new salary start date smaller than current salary start date",
                statusCode: 400
            };
        }
        let newSalary = await this.prisma.salary.create({
            data: {
                userId: userId,
                isActive: true,
                amount: userSalaryDto.amount,
                startDate: userSalaryDto.startDate
            }
        });
        let endDate = new Date(userSalaryDto.startDate);
        endDate.setDate(endDate.getDate() - 1);
        await this.prisma.salary.updateMany({
            where: {
                userId: userId,
                NOT: {
                    id: newSalary.id
                },
                isActive: true
            },
            data: {
                endDate: endDate,
                isActive: false
            }
        });
        return newSalary;
    }
};
UserService = UserService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map