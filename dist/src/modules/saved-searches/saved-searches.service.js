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
var SavedSearchesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedSearchesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
const saved_searches_filters_dto_1 = require("./dto/saved-searches-filters.dto");
const saved_searches_enums_1 = require("./enums/saved-searches.enums");
const saved_searches_admin_filters_dto_1 = require("./dto/saved-searches-admin-filters.dto");
let SavedSearchesService = SavedSearchesService_1 = class SavedSearchesService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(SavedSearchesService_1.name);
    }
    async create(createSavedSearchDto) {
        if (Object.entries(createSavedSearchDto.savedSearchesFilters).length === 0)
            throw { message: "No filters provided. Please provide at least one filter", statusCode: 400 };
        let filters = new saved_searches_filters_dto_1.SavedSearchesFiltersDto();
        filters.savedSearchesFilters = createSavedSearchDto.savedSearchesFilters;
        filters.userIds = createSavedSearchDto['userId'];
        filters["forAdminpanel"] = false;
        let appliedFilters = this.applyFilters(filters);
        let exisingRecord = await this.checkIfRecordExists(appliedFilters);
        if (exisingRecord) {
            throw {
                message: "You have already saved this search",
                statusCode: 200
            };
        }
        let totalAlerts = await this.countSavedSearches({ userId: createSavedSearchDto['userId'], isPublished: true });
        if (totalAlerts > saved_searches_enums_1.SavedSearchesThresholdPerUser) {
            throw {
                message: "You have reached your subscriptions limit. Please delete some to add new subscription",
                statusCode: 400
            };
        }
        let { savedSearchesFilters } = createSavedSearchDto, rest = __rest(createSavedSearchDto, ["savedSearchesFilters"]);
        let insertData = rest;
        insertData.filters = savedSearchesFilters;
        insertData.forAdminpanel = false;
        insertData.isPrivate = true;
        insertData.visibility = "self";
        return this.prisma.savedSearches.create({
            data: insertData
        })
            .catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    async createAdminpanelFilters(createSavedSearchDto, user) {
        if (Object.entries(createSavedSearchDto.savedSearchesFilters).length === 0)
            throw { message: "No filters provided. Please provide at least one filter", statusCode: 400 };
        let filters = new saved_searches_admin_filters_dto_1.SavedSearchesAdminFiltersDto();
        filters.savedSearchesFilters = createSavedSearchDto.savedSearchesFilters;
        if (createSavedSearchDto.visibility === 'self') {
            filters.userIds = user.userId;
        }
        filters["forAdminpanel"] = true;
        let appliedFilters = this.applyAdminFilters(filters);
        let exisingRecord = await this.checkIfRecordExists(appliedFilters);
        if (exisingRecord) {
            throw {
                message: "You have already saved this search",
                statusCode: 200
            };
        }
        let totalAlerts = await this.countSavedSearches({ userId: createSavedSearchDto['userId'], isPublished: true });
        if (totalAlerts > saved_searches_enums_1.SavedSearchesThresholdPerUser) {
            throw {
                message: "You have reached your subscriptions limit. Please delete some to add new subscription",
                statusCode: 400
            };
        }
        let { savedSearchesFilters } = createSavedSearchDto, rest = __rest(createSavedSearchDto, ["savedSearchesFilters"]);
        let insertData = rest;
        insertData.filters = savedSearchesFilters;
        insertData.forAdminpanel = true;
        if (createSavedSearchDto.visibility === 'self') {
            insertData.userId = user.userId;
        }
        return this.prisma.savedSearches.create({
            data: insertData
        })
            .catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    findAll(filters, pagination, sorting) {
        let skip = (pagination.perPage * (pagination.page - 1));
        let take = pagination.perPage;
        let __sorter = { [sorting.sortByField]: sorting.sortOrder };
        let records = this.prisma.savedSearches.findMany({
            where: filters,
            take: take,
            skip: skip,
            orderBy: __sorter
        });
        return records;
    }
    checkIfRecordExists(filters) {
        let records = this.prisma.savedSearches.findFirst({
            where: filters
        });
        return records;
    }
    findOne(id, user) {
        return this.prisma.savedSearches.findFirst({
            where: {
                id: id,
                userId: user.userId
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    findOneById(id) {
        return this.prisma.savedSearches.findFirst({
            where: {
                id: id
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    remove(id) {
        return this.prisma.savedSearches.delete({
            where: {
                id: id
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    removeSavedSearches(id, userId) {
        return this.prisma.savedSearches.deleteMany({
            where: {
                id: id,
                userId: userId
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    removeAllSavedSearches(userId, adminpanel) {
        return this.prisma.savedSearches.deleteMany({
            where: {
                userId: userId,
                forAdminpanel: adminpanel
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    applyFilters(filters) {
        let condition = {};
        if (Object.entries(filters).length > 0) {
            if (filters.isPublished || filters.isPublished === false) {
                condition = Object.assign(Object.assign({}, condition), { isPublished: filters.isPublished });
            }
            if (filters.userIds) {
                if (Array.isArray(filters.userIds)) {
                    condition = Object.assign(Object.assign({}, condition), { userId: { in: filters.userIds } });
                }
                else {
                    condition = Object.assign(Object.assign({}, condition), { userId: filters.userIds });
                }
            }
            if (filters.organizationId) {
                condition = Object.assign(Object.assign({}, condition), { organizationId: filters.organizationId });
            }
            let alertFiltersCondition = [];
            if ((filters === null || filters === void 0 ? void 0 : filters.savedSearchesFilters) && Object.entries(filters.savedSearchesFilters).length > 0) {
                if (filters.savedSearchesFilters.category) {
                    alertFiltersCondition.push({ filters: { path: ['category'], equals: filters.savedSearchesFilters.category } });
                }
                if (filters.savedSearchesFilters.type) {
                    alertFiltersCondition.push({ filters: { path: ['type'], equals: filters.savedSearchesFilters.type } });
                }
            }
            if (alertFiltersCondition.length > 0) {
                condition = Object.assign(Object.assign({}, condition), { AND: alertFiltersCondition });
            }
        }
        return condition;
    }
    applyAdminFilters(filters) {
        let condition = {};
        if (Object.entries(filters).length > 0) {
            if (filters.isPublished || filters.isPublished === false) {
                condition = Object.assign(Object.assign({}, condition), { isPublished: filters.isPublished });
            }
            if (filters.userIds) {
                if (Array.isArray(filters.userIds)) {
                    condition = Object.assign(Object.assign({}, condition), { userId: { in: filters.userIds } });
                }
                else {
                    condition = Object.assign(Object.assign({}, condition), { userId: filters.userIds });
                }
            }
            if (filters.organizationId) {
                condition = Object.assign(Object.assign({}, condition), { organizationId: filters.organizationId });
            }
            let alertFiltersCondition = [];
            if ((filters === null || filters === void 0 ? void 0 : filters.savedSearchesFilters) && Object.entries(filters.savedSearchesFilters).length > 0) {
                if (filters.savedSearchesFilters.title) {
                    alertFiltersCondition.push({ filters: { path: ['title'], string_contains: filters.savedSearchesFilters.title } });
                }
            }
            if (alertFiltersCondition.length > 0) {
                condition = Object.assign(Object.assign({}, condition), { AND: alertFiltersCondition });
            }
        }
        return condition;
    }
    countSavedSearches(filters) {
        return this.prisma.savedSearches.count({
            where: filters
        });
    }
};
SavedSearchesService = SavedSearchesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SavedSearchesService);
exports.SavedSearchesService = SavedSearchesService;
//# sourceMappingURL=saved-searches.service.js.map