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
var SmsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const constants_1 = require("../../config/constants");
const prisma_service_1 = require("../../prisma.service");
let SmsService = SmsService_1 = class SmsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(SmsService_1.name);
    }
    async create(createSmDto) {
        let otherGateways = await this.prisma.smsConfiguration.findFirst({
            where: {
                isDefault: true,
                countryId: createSmDto.countryId,
                test: createSmDto.test
            }
        });
        if (!otherGateways) {
            createSmDto['isDefault'] = true;
        }
        return this.prisma.smsConfiguration.create({
            data: createSmDto
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    findAll() {
        let records = this.prisma.smsConfiguration.findMany({
            where: {
                isDeleted: false
            },
            orderBy: {
                addedDate: 'desc'
            }
        });
        return records;
    }
    findOne(id) {
        return this.prisma.smsConfiguration.findUnique({
            where: {
                id: id
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    update(id, updateSmDto) {
        return this.prisma.smsConfiguration.update({
            data: updateSmDto,
            where: {
                id: id
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    async remove(id) {
        let recordData = await this.findOne(id);
        if (!recordData) {
            throw { message: "Record to delete not found", statusCode: 400 };
        }
        let otherGateways = await this.prisma.smsConfiguration.findFirst({
            where: {
                isDefault: true,
                countryId: recordData.countryId,
                test: (recordData.test === false) ? false : true,
                NOT: {
                    id: id
                }
            }
        });
        if (!otherGateways) {
            throw { message: "A country must have at least one default payment gateway. Please create at least one default gateway to delete this record", statusCode: 400 };
        }
        return this.prisma.smsConfiguration.delete({
            where: {
                id: id
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    async makeDefault(id) {
        let recordData = await this.findOne(id);
        if (!recordData) {
            throw { message: "Provided SMS Gateway ID not found.", statusCode: 400 };
        }
        await this.prisma.smsConfiguration.updateMany({
            where: {
                countryId: recordData.countryId,
                test: recordData.test
            },
            data: {
                isDefault: false
            }
        });
        return this.prisma.smsConfiguration.update({
            where: {
                id: id
            },
            data: { isDefault: true }
        });
    }
    async sendSms(smsData) {
        if ((smsData.phone === constants_1.TEST_PHONE && smsData.smsType === 'T')) {
            return;
        }
        const { phoneCode } = smsData;
        let country = await this.prisma.country.findFirst({
            where: {
                phoneCode: phoneCode
            },
            select: {
                id: true
            }
        });
        if (!country || !country.id) {
            throw {
                message: `Cannot send sms to ${smsData.phoneCode} - ${smsData.phone}. We are not operating to the country specified. Please try again with some other local number `,
                statusCode: 400
            };
        }
        let smsGateways = await this.prisma.smsConfiguration.findFirst({
            where: {
                countryId: country.id,
                test: (process.env.ENVIRONMENT === "development") ? true : false,
                isPublished: true,
                senderIdType: smsData.smsType,
                isDeleted: false
            }
        });
        if (smsGateways) {
            smsData.gateway = smsGateways;
            this.logSms(smsData);
            switch (smsGateways.slug) {
                case constants_1.KnownSMSGateways['SMS-ALA']:
                case constants_1.KnownSMSGateways['SMS-ALA-TEST']:
                    this.sendSMSUsingSMSAlaGateway(smsData);
                    break;
                case constants_1.KnownSMSGateways['SMS-COUNTRY']:
                case constants_1.KnownSMSGateways['SMS-COUNTRY-TEST']:
                    this.sendSMSUsingCountrySMSgateway(smsData);
                    break;
                default:
                    this.logger.error("Error on:" + this.constructor.name + "\n Error code: NO_SMS_GATEWAY. \n No default SMS gateway found. Please set a default SMS gateway to send an SMS");
                    break;
            }
        }
    }
    async logSms(smsData) {
        var _a;
        await this.prisma.smsLogs.create({
            data: {
                gateway: smsData.gateway.slug,
                message: smsData.message,
                number: smsData.phoneCode + smsData.phone,
                sentDate: new Date(),
                userId: (smsData.user) ? (_a = smsData.user) === null || _a === void 0 ? void 0 : _a.userId : undefined
            }
        });
    }
    sendSMSUsingSMSAlaGateway(smsData) {
        let data = {
            api_id: smsData.gateway.appId,
            api_password: smsData.gateway.appPassword,
            sender_id: smsData.gateway.senderId,
            encoding: 'T',
            sms_type: (smsData.smsType) ? smsData.smsType : 'T'
        };
        axios_1.default.post(smsData.gateway.gateway + (Array.isArray(smsData.phone) ? "SendSMSMulti" : "SendSMS"), Object.assign(Object.assign({}, data), { phonenumber: (Array.isArray(smsData.phone)) ? smsData.phone.join(',') : smsData.phone })).then(response => {
            console.log(response.data);
        }).catch(err => {
            this.logger.log("Error while sending sms. Custom Error Code: SMS-ALA-193 \n", err.message);
        });
    }
    sendSMSUsingCountrySMSgateway(smsData) {
        let data = {
            Text: smsData.message,
            Number: smsData.phoneCode + smsData.phone,
            SenderId: smsData.gateway.senderId,
            DRNotifyUrl: "https://d777-94-205-243-22.in.ngrok.io/sms/countrySms-response",
            DRNotifyHttpMethod: "POST",
            Tool: "API"
        };
        let authToken = Buffer.from(smsData.gateway.appId + ":" + smsData.gateway.appPassword);
        let authEncoded = authToken.toString('base64');
        let headers = {
            "Content-Type": "application/json",
            "Authorization": "Basic " + authEncoded
        };
        (0, axios_1.default)({
            method: 'POST',
            url: smsData.gateway.gateway + `Accounts/${smsData.gateway.appId}/SMSes`,
            data: data,
            headers: headers
        }).then(response => {
        }).catch(err => {
            this.logger.error("Error while sending sms. Custom Error Code: SMS-COUNTRY-239 \n", err);
        });
    }
    findSmsLogs(pagination, sorting, condition) {
        let skip = (pagination.perPage * (pagination.page - 1));
        let take = pagination.perPage;
        let __sorter = { [sorting.sortByField]: sorting.sortOrder };
        return this.prisma.smsLogs.findMany({
            where: condition,
            skip: skip,
            take: take,
            orderBy: __sorter,
        });
    }
    applyFilters(filters) {
        let condition = {};
        if (Object.entries(filters).length > 0) {
            if (filters.status) {
                condition = Object.assign(Object.assign({}, condition), { status: filters.status });
            }
            if (filters.fromDate && filters.toDate) {
                condition = Object.assign(Object.assign({}, condition), { AND: [
                        {
                            sentDate: {
                                gte: new Date(filters.fromDate + "T00:00:00")
                            }
                        },
                        {
                            sentDate: {
                                lte: new Date(filters.toDate + "T23:59:59")
                            }
                        }
                    ] });
            }
            else {
                if (filters.fromDate) {
                    condition = Object.assign(Object.assign({}, condition), { sentDate: { gte: new Date(filters.fromDate + "T00:00:00") } });
                }
                if (filters.toDate) {
                    condition = Object.assign(Object.assign({}, condition), { sentDate: { lte: new Date(filters.toDate + "T23:59:59") } });
                }
            }
            if (filters.userId) {
                condition = Object.assign(Object.assign({}, condition), { userId: filters.userId });
            }
            if (filters.message) {
                condition = Object.assign(Object.assign({}, condition), { message: {
                        contains: filters.message,
                        mode: 'insensitive'
                    } });
            }
            if (filters.gateway) {
                condition = Object.assign(Object.assign({}, condition), { gateway: filters.gateway });
            }
            if (filters.number) {
                condition = Object.assign(Object.assign({}, condition), { number: filters.number });
            }
        }
        return condition;
    }
    countTotalRecord(condition) {
        return this.prisma.smsLogs.count({
            where: condition
        });
    }
};
SmsService = SmsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SmsService);
exports.SmsService = SmsService;
//# sourceMappingURL=sms.service.js.map