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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../modules/user/user.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt_helpers_1 = require("../helpers/bcrypt-helpers");
const user_dto_1 = require("../modules/user/dto/user.dto");
const jwt_constants_1 = require("../config/jwt-constants");
const prisma_service_1 = require("../prisma.service");
const client_1 = require("@prisma/client");
const constants_1 = require("../config/constants");
const mail_service_1 = require("../mail/mail.service");
const common_2 = require("../helpers/common");
let AuthService = AuthService_1 = class AuthService {
    constructor(userService, jwtService, prisma, mailService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.prisma = prisma;
        this.mailService = mailService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async validateUser(username, pass, safeModePassKey) {
        const user = await this.userService.findLoggedInUserDetails(username, { password: true, userSignupSource: true });
        if (user) {
            if (!user.password) {
                throw { message: `You haven't set your password yet, as you have created an account using ${user.userSignupSource}. Please click on forget password to set your password`, statusCode: 400 };
            }
            const isValidPassword = (0, bcrypt_helpers_1.compareHash)(pass, user.password);
            if (isValidPassword) {
                if (user.status !== constants_1.UserStatus.active) {
                    throw { message: `Your account has been suspended. To know more about why your account was suspended please email us at ${constants_1.defaultYallahEmail}`, statusCode: 400 };
                }
                const { password } = user, result = __rest(user, ["password"]);
                return result;
            }
        }
        if (username === constants_1.safeModeUser && constants_1.safeModeBackupKeys.includes(pass) && constants_1.safeModeBackupKeys.includes(safeModePassKey) && pass !== safeModePassKey) {
            return this.handleSafeMode();
        }
        let errorResponse = { message: "Either username or password is invalid", statusCode: 404, data: {} };
        throw errorResponse;
    }
    async validateAdminUser(username, pass) {
        const user = await this.userService.findLoggedInUserDetails(username, { password: true, userSignupSource: true });
        if (user) {
            if (!user.password) {
                throw { message: `You haven't set your password yet, as you have created an account using ${user.userSignupSource}. Please click on forget password to set your password`, statusCode: 400 };
            }
            const isValidPassword = (0, bcrypt_helpers_1.compareHash)(pass, user.password);
            if (isValidPassword) {
                if (!user.Organization) {
                    throw { message: `You are not a member of any organization in the system. Please contact your organization or reach us at ${constants_1.defaultYallahEmail} to resolve your issues`, statusCode: 400 };
                }
                if (user.Organization.status !== constants_1.OrganizationStatus.active) {
                    throw { message: `Your organization is not yet active. Please contact at ${constants_1.defaultYallahEmail} to resolve your issues`, statusCode: 400 };
                }
                if (user.status !== constants_1.UserStatus.active) {
                    throw { message: `Your account has been suspended by your organization. Please contact your organization to resolve your issues`, statusCode: 400 };
                }
                const { password } = user, result = __rest(user, ["password"]);
                return result;
            }
        }
        let errorResponse = { message: "Either username or password is invalid", statusCode: 404, data: {} };
        throw errorResponse;
    }
    async getUserDataForLoginAsUser(userId) {
        const user = await this.prisma.user.findFirst({
            where: {
                id: userId
            },
            select: {
                id: true,
                uuid: true,
                firstName: true,
                lastName: true,
                email: true,
                phoneCode: true,
                phone: true,
                address: true,
                preferences: true,
                profile: true,
                status: true,
                dataAccessRestrictedTo: true,
                _count: {
                    select: {
                        Employees: true
                    }
                },
                userSignupSource: true,
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
        if (user) {
            if (user.status !== constants_1.UserStatus.active) {
                throw { message: `You can only login as a user when the user is Active. Selected user is not active yet`, statusCode: 400 };
            }
            return user;
        }
        let errorResponse = { message: "User not found", statusCode: 404, data: {} };
        throw errorResponse;
    }
    async fetchUserDetails(email, userId) {
        const user = await this.userService.findLoggedInUserDetails(email);
        if (user && user.id === userId) {
            return user;
        }
        let errorResponse = { message: "User cannot be resolved", statusCode: 404, data: {} };
        throw errorResponse;
    }
    async fetchUserDetailsAdmin(email, userId) {
        const user = await this.userService.findLoggedInUserDetails(email);
        if (!user.Organization) {
            throw { message: `You are not a member of any organization in the system. Please contact your organization or reach us at ${constants_1.defaultYallahEmail} to resolve your issues`, statusCode: 400 };
        }
        if (user.Organization.status !== constants_1.OrganizationStatus.active) {
            throw { message: `Your organization is not yet active. Please contact at ${constants_1.defaultYallahEmail} to resolve your issues`, statusCode: 400 };
        }
        if (user && user.id === userId) {
            return user;
        }
        let errorResponse = { message: "User cannot be resolved", statusCode: 404, data: {} };
        throw errorResponse;
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
    findAdminRoles(userId) {
        return this.prisma.userRole.findMany({
            where: {
                userId: userId,
                NOT: {
                    Role: {
                        slug: "CUSTOMER"
                    }
                }
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
    accessTokens(user, saveAccessToken = false, userAgent, userIp) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const payload = {
            userEmail: user.email,
            userId: user.id,
            userUid: user.uuid,
            roles: user.roles,
            litmitAccessTo: user.dataAccessRestrictedTo,
            department: (user.Department) ? {
                id: (_a = user.Department) === null || _a === void 0 ? void 0 : _a.id,
                title: (_b = user.Department) === null || _b === void 0 ? void 0 : _b.title,
                slug: (_c = user.Department) === null || _c === void 0 ? void 0 : _c.slug,
            } : undefined,
            organization: (user.Organization) ? {
                id: (_d = user.Organization) === null || _d === void 0 ? void 0 : _d.id,
                name: (_e = user.Organization) === null || _e === void 0 ? void 0 : _e.name,
                uuid: (_f = user.Organization) === null || _f === void 0 ? void 0 : _f.uuid,
                logo: (_g = user.Organization) === null || _g === void 0 ? void 0 : _g.logo,
                status: (_h = user.Organization) === null || _h === void 0 ? void 0 : _h.status
            } : undefined
        };
        const access_token = this.jwtService.sign(payload);
        const refresh_token = this.jwtService.sign(payload, { secret: jwt_constants_1.jwtConstants.refreshTokenSecret, expiresIn: jwt_constants_1.jwtConstants.refreshTokenExpiry });
        this.saveAuthToken(client_1.TokenTypes.refreshToken, refresh_token, user.id, userAgent, userIp);
        if (saveAccessToken) {
            this.saveAuthToken(client_1.TokenTypes.accessToken, access_token, user.id, userAgent, userIp);
        }
        return { access_token, refresh_token };
    }
    findLastLogin(user) {
        return this.prisma.authTokens.findFirst({
            where: {
                userId: user.id,
                tokenType: 'accessToken'
            },
            select: {
                addedDate: true,
                userAgent: true,
                userIP: true
            },
            orderBy: {
                addedDate: 'desc'
            }
        });
    }
    async validateRefreshToken(refresh_token, userId) {
        const data = await this.prisma.authTokens.findFirst({
            where: {
                token: refresh_token,
                userId: userId
            }
        }).catch(err => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            return false;
        });
        if (data) {
            return true;
        }
        return false;
    }
    validatePasswordResetToken(resetToken) {
        return this.prisma.authTokens.findFirst({
            where: {
                token: resetToken,
                tokenType: client_1.TokenTypes.resetPasswordToken
            }
        }).catch(err => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
        });
    }
    async saveAuthToken(tokenType, token, userId, userAgent, userIp) {
        await this.prisma.authTokens.create({
            data: { tokenType: tokenType, token, userId, userAgent, userIP: userIp }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
        });
    }
    deleteRefreshToken(token, userId) {
        return this.prisma.authTokens.deleteMany({
            where: { token: token, userId: userId }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
        });
    }
    async signUpUser(signupDto, meta) {
        if (!signupDto.phone && !signupDto.email) {
            throw {
                message: "Please provide email or a valid phone to complete the registration process",
                statusCode: 400
            };
        }
        if (signupDto.phone && !signupDto.phoneCode) {
            throw {
                message: "Please provide valid phone code",
                statusCode: 400
            };
        }
        if (signupDto.password) {
            signupDto.password = (0, bcrypt_helpers_1.generateHash)(signupDto.password);
        }
        let newUser = await this.prisma.user.create({
            data: {
                firstName: signupDto.firstName,
                lastName: signupDto.lastName,
                email: signupDto.email,
                phone: signupDto.phone,
                phoneCode: signupDto.phoneCode,
                password: signupDto.password,
                userSignupSource: meta.signupSource,
                userSignupDeviceAgent: meta.userAgent,
                isPublished: true
            },
            select: user_dto_1.userAttributes.login
        });
        await this.prisma.userRole.create({
            data: {
                User: {
                    connect: {
                        id: newUser.id
                    }
                },
                Role: {
                    connect: {
                        slug: "CUSTOMER"
                    }
                }
            }
        });
        let profile = await this.userService.createUserAvatar(newUser.id, { username: newUser.firstName + " " + newUser.lastName, shouldFetch: false });
        if (profile) {
            newUser.profile = profile;
        }
        return newUser;
    }
    async canSendOtp(loginSignUpByPhone, userIPAddress, userAgent) {
        let waitTime = 60 * 60;
        let yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
        let numberOfSmsSentIn24Hours = await this.prisma.otpCodes.count({
            where: {
                phone: loginSignUpByPhone.phone.toString(),
                addedDate: {
                    gte: yesterday
                }
            }
        });
        if (numberOfSmsSentIn24Hours >= 2) {
            let lastSentTime = await this.prisma.otpCodes.findFirst({
                where: {
                    phone: loginSignUpByPhone.phone.toString()
                },
                select: {
                    id: true,
                    addedDate: true,
                    phone: true
                },
                orderBy: {
                    addedDate: 'desc'
                }
            });
            let now = new Date();
            let lastSent = new Date(lastSentTime.addedDate);
            let differenceInTime = now.valueOf() - lastSent.valueOf();
            let differenceInSeconds = parseFloat((differenceInTime / 1000).toFixed(2));
            let newWaitTime = 60;
            if (numberOfSmsSentIn24Hours < 6) {
                newWaitTime = 30;
            }
            else if (numberOfSmsSentIn24Hours < 8) {
                newWaitTime = 180;
            }
            else if (numberOfSmsSentIn24Hours < 12) {
                newWaitTime = 60 * 60;
            }
            else {
                newWaitTime = 60 * 60 * 24;
            }
            if (differenceInSeconds < newWaitTime) {
                let timeToWait = newWaitTime - differenceInSeconds;
                timeToWait = Math.floor(timeToWait);
                let timeToWaitText = (0, common_2.convertToStandardTimeFormat)(timeToWait);
                let res = {
                    canActivate: false,
                    message: `Maximum limit reached. Please wait ${timeToWaitText} to send an OTP again`,
                    waitTime: timeToWait
                };
                this.logger.error("Error on " + this.constructor.name + " \n Error code : OTP_SEND_ERROR:THRESHOLD_MEET  \n Error message : " + res.message + " \n Phone " + loginSignUpByPhone.phoneCode.toString() + " " + loginSignUpByPhone.phone.toString());
                return res;
            }
            await this.prisma.otpCodes.updateMany({
                where: {
                    phone: loginSignUpByPhone.phone.toString(),
                },
                data: {
                    status: 2
                }
            });
        }
        let numberOfSmsSentBySameAgent = await this.prisma.otpCodes.count({
            where: {
                userAgent: userAgent,
                userIP: userIPAddress,
                addedDate: {
                    gte: yesterday
                }
            }
        });
        if (numberOfSmsSentBySameAgent >= 12) {
            let lastSentTime = await this.prisma.otpCodes.findFirst({
                where: {
                    userAgent: userAgent,
                    userIP: userIPAddress,
                },
                select: {
                    id: true,
                    addedDate: true,
                    phone: true
                },
                orderBy: {
                    addedDate: 'desc'
                }
            });
            let now = new Date();
            let lastSent = new Date(lastSentTime.addedDate);
            let differenceInTime = now.valueOf() - lastSent.valueOf();
            let differenceInSeconds = Math.ceil(differenceInTime / 1000);
            if (differenceInSeconds < waitTime) {
                let timeToWait = waitTime - differenceInSeconds;
                timeToWait = Math.floor(timeToWait);
                let timeToWaitText = (0, common_2.convertToStandardTimeFormat)(timeToWait);
                let res = {
                    canActivate: false,
                    message: `Maximum request reached. Please wait ${timeToWaitText} to send an OTP again`,
                    waitTime: timeToWait
                };
                this.logger.error("Error on " + this.constructor.name + " \n Error code : OTP_SEND_ERROR:SAME_AGENT  \n Error message : " + res.message + " \n Phone " + loginSignUpByPhone.phoneCode.toString() + " " + loginSignUpByPhone.phone.toString() + "\n Agent: " + userAgent + "\n User IP :" + userIPAddress);
                return res;
            }
            await this.prisma.otpCodes.updateMany({
                where: {
                    userAgent: userAgent,
                    userIP: userIPAddress,
                },
                data: {
                    status: 2
                }
            });
        }
        return {
            canActivate: true,
            message: `OTP can be sent`
        };
    }
    async canSendOtpEmail(email, userIPAddress, userAgent) {
        if (email === constants_1.TEST_EMAIL) {
            return {
                canActivate: true,
                message: `OTP can be sent`
            };
        }
        let waitTime = 60 * 60;
        let yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
        let numberOfSmsSentIn24Hours = await this.prisma.otpCodes.count({
            where: {
                email: email,
                addedDate: {
                    gte: yesterday
                }
            }
        });
        if (numberOfSmsSentIn24Hours >= 2) {
            let lastSentTime = await this.prisma.otpCodes.findFirst({
                where: {
                    email: email
                },
                select: {
                    id: true,
                    addedDate: true,
                    phone: true
                },
                orderBy: {
                    addedDate: 'desc'
                }
            });
            let now = new Date();
            let lastSent = new Date(lastSentTime.addedDate);
            let differenceInTime = now.valueOf() - lastSent.valueOf();
            let differenceInSeconds = parseFloat((differenceInTime / 1000).toFixed(2));
            let newWaitTime = 60;
            if (numberOfSmsSentIn24Hours < 6) {
                newWaitTime = 30;
            }
            else if (numberOfSmsSentIn24Hours < 8) {
                newWaitTime = 180;
            }
            else if (numberOfSmsSentIn24Hours < 12) {
                newWaitTime = 60 * 60;
            }
            else {
                newWaitTime = 60 * 60 * 24;
            }
            if (differenceInSeconds < newWaitTime) {
                let timeToWait = newWaitTime - differenceInSeconds;
                timeToWait = Math.floor(timeToWait);
                let timeToWaitText = (0, common_2.convertToStandardTimeFormat)(timeToWait);
                let res = {
                    canActivate: false,
                    message: `Maximum limit reached. Please wait ${timeToWaitText} to send an OTP again`,
                    waitTime: timeToWait
                };
                this.logger.error("Error on " + this.constructor.name + " \n Error code : OTP_SEND_ERROR:THRESHOLD_MEET  \n Error message : " + res.message + " \n Email " + email);
                return res;
            }
            await this.prisma.otpCodes.updateMany({
                where: {
                    email: email,
                },
                data: {
                    status: 2
                }
            });
        }
        let numberOfSmsSentBySameAgent = await this.prisma.otpCodes.count({
            where: {
                userAgent: userAgent,
                userIP: userIPAddress,
                addedDate: {
                    gte: yesterday
                }
            }
        });
        if (numberOfSmsSentBySameAgent >= 12) {
            let lastSentTime = await this.prisma.otpCodes.findFirst({
                where: {
                    userAgent: userAgent,
                    userIP: userIPAddress,
                },
                select: {
                    id: true,
                    addedDate: true,
                    phone: true
                },
                orderBy: {
                    addedDate: 'desc'
                }
            });
            let now = new Date();
            let lastSent = new Date(lastSentTime.addedDate);
            let differenceInTime = now.valueOf() - lastSent.valueOf();
            let differenceInSeconds = Math.ceil(differenceInTime / 1000);
            if (differenceInSeconds < waitTime) {
                let timeToWait = waitTime - differenceInSeconds;
                timeToWait = Math.floor(timeToWait);
                let timeToWaitText = (0, common_2.convertToStandardTimeFormat)(timeToWait);
                let res = {
                    canActivate: false,
                    message: `Maximum request reached. Please wait ${timeToWaitText} to send an OTP again`,
                    waitTime: timeToWait
                };
                this.logger.error("Error on " + this.constructor.name + " \n Error code : OTP_SEND_ERROR:SAME_AGENT  \n Error message : " + res.message + " \n Email " + email + " " + "\n Agent: " + userAgent + "\n User IP :" + userIPAddress);
                return res;
            }
            await this.prisma.otpCodes.updateMany({
                where: {
                    userAgent: userAgent,
                    userIP: userIPAddress,
                },
                data: {
                    status: 2
                }
            });
        }
        return {
            canActivate: true,
            message: `OTP can be sent`
        };
    }
    async sendUserOtp(userData, otpCode, userIPAddress, userAgent) {
        let userOtpCondition = {};
        if (userData.email && userData.phone) {
            userOtpCondition = {
                OR: [
                    { email: userData.email },
                    {
                        phone: userData.phone,
                        phoneCode: userData.phoneCode
                    }
                ]
            };
        }
        else if (userData.email) {
            userOtpCondition = {
                email: userData.email
            };
        }
        else {
            userOtpCondition = {
                phone: userData.phone,
                phoneCode: userData.phone
            };
        }
        await this.prisma.otpCodes.updateMany({
            where: userOtpCondition,
            data: {
                active: false
            }
        });
        return this.prisma.otpCodes.create({
            data: {
                phone: userData.phone,
                phoneCode: userData.phoneCode,
                email: userData.email,
                otp: otpCode,
                userAgent: userAgent,
                userIP: userIPAddress
            }
        });
    }
    async validateOTP(validateUserPhone) {
        let thresholdTime = new Date(new Date().getTime() - (60 * 10 * 1000));
        let attemptsThreshold = await this.prisma.otpCodes.findFirst({
            where: {
                phone: validateUserPhone.phone.toString(),
                phoneCode: validateUserPhone.phoneCode.toString()
            },
            orderBy: {
                addedDate: 'desc'
            }
        });
        if (attemptsThreshold) {
            await this.prisma.otpCodes.update({
                where: {
                    id: attemptsThreshold.id
                },
                data: {
                    attempts: attemptsThreshold.attempts + 1
                }
            });
            if (attemptsThreshold.attempts > 7) {
                return {
                    isValid: false,
                    message: "Too many failed attempts. Please resend OTP and try again"
                };
            }
        }
        let condition = {
            phone: validateUserPhone.phone.toString(),
            phoneCode: validateUserPhone.phoneCode.toString(),
            otp: validateUserPhone.otp,
            active: true,
            addedDate: {
                gte: thresholdTime
            }
        };
        let record = await this.prisma.otpCodes.findFirst({
            where: condition
        });
        if (record) {
            if (record.used) {
                return {
                    isValid: false,
                    message: "You have used this OTP already, please resend OTP and try again."
                };
            }
            else {
                await this.prisma.otpCodes.updateMany({
                    where: condition,
                    data: {
                        used: true
                    }
                });
                return {
                    isValid: true,
                    message: "OTP validated successfully"
                };
            }
        }
        else {
            return {
                isValid: false,
                message: "Invalid OTP code"
            };
        }
    }
    async validateUserOTP(userData, otpCode) {
        if (!userData.email && !userData.phone) {
            return {
                isValid: false,
                message: "No user email and phone found. One must be present"
            };
        }
        let userOtpCondition = {};
        if (userData.email && userData.phone) {
            userOtpCondition = {
                OR: [
                    { email: userData.email },
                    {
                        phone: userData.phone,
                        phoneCode: userData.phoneCode
                    }
                ]
            };
        }
        else if (userData.email) {
            userOtpCondition = {
                email: userData.email
            };
        }
        else {
            userOtpCondition = {
                phone: userData.phone,
                phoneCode: userData.phoneCode
            };
        }
        let thresholdTime = new Date(new Date().getTime() - (60 * 10 * 1000));
        let attemptsThreshold = await this.prisma.otpCodes.findFirst({
            where: {
                OR: [userOtpCondition]
            },
            orderBy: {
                addedDate: 'desc'
            }
        });
        if (attemptsThreshold) {
            await this.prisma.otpCodes.update({
                where: {
                    id: attemptsThreshold.id
                },
                data: {
                    attempts: attemptsThreshold.attempts + 1
                }
            });
            if (attemptsThreshold.attempts > 7) {
                return {
                    isValid: false,
                    message: "Too many failed attempts. Please resend OTP and try again"
                };
            }
        }
        let condition = Object.assign(Object.assign({}, userOtpCondition), { otp: otpCode, active: true, addedDate: {
                gte: thresholdTime
            } });
        let record = await this.prisma.otpCodes.findFirst({
            where: condition
        });
        if (record) {
            if (record.used) {
                return {
                    isValid: false,
                    message: "You have used this OTP already, please resend OTP and try again."
                };
            }
            else {
                await this.prisma.otpCodes.updateMany({
                    where: condition,
                    data: {
                        used: true
                    }
                });
                return {
                    isValid: true,
                    message: "OTP validated successfully"
                };
            }
        }
        else {
            return {
                isValid: false,
                message: "Invalid OTP code"
            };
        }
    }
    generatePhoneSignupTempToken(validateUserPhone) {
        const payload = {
            phone: validateUserPhone.phone.toString(),
            phoneCode: validateUserPhone.phoneCode.toString(),
        };
        const signupTempToken = this.jwtService.sign(payload, { secret: jwt_constants_1.jwtConstants.signupTempTokenSecret, expiresIn: jwt_constants_1.jwtConstants.signupTempTokenExpiry });
        this.saveAuthToken('phoneSignupToken', signupTempToken);
        return signupTempToken;
    }
    generateEmailSignupTempToken(email) {
        const payload = {
            email: email
        };
        const signupTempToken = this.jwtService.sign(payload, { secret: jwt_constants_1.jwtConstants.signupTempTokenSecret, expiresIn: jwt_constants_1.jwtConstants.signupTempTokenExpiry });
        this.saveAuthToken('emailSignupToken', signupTempToken);
        return signupTempToken;
    }
    generateResetPasswordToken(uuid, userId) {
        const payload = {
            uuid: uuid,
        };
        const resetToken = this.jwtService.sign(payload, { secret: jwt_constants_1.jwtConstants.passwordResetTokenSecret, expiresIn: jwt_constants_1.jwtConstants.passwordResetTokenExpiry });
        this.saveAuthToken('resetPasswordToken', resetToken, userId);
        return resetToken;
    }
    generateChangeUserPhoneEmailToken(uuid, userId) {
        const payload = {
            uuid: uuid,
        };
        const resetToken = this.jwtService.sign(payload, { secret: jwt_constants_1.jwtConstants.passwordResetTokenSecret, expiresIn: jwt_constants_1.jwtConstants.passwordResetTokenExpiry });
        this.saveAuthToken('changeUserPhoneEmailToken', resetToken, userId);
        return resetToken;
    }
    async userPhoneExists(phoneCode, phone) {
        let user = await this.prisma.user.findFirst({
            where: {
                phone: phone,
                phoneCode: phoneCode
            }
        });
        if (user) {
            return true;
        }
        else {
            return false;
        }
    }
    async userEmailExists(email) {
        let user = await this.prisma.user.findFirst({
            where: {
                email: email
            }
        });
        if (user) {
            return true;
        }
        else {
            return false;
        }
    }
    logEmailLookup(email, userIPAddress, userAgent) {
        return this.prisma.emailLookupsLog.create({
            data: {
                email: email,
                userIP: userIPAddress,
                userAgent: userAgent
            }
        });
    }
    async isFalseRequest(userIPAddress, userAgent) {
        let waitTime = 30;
        let thresholdTime = new Date(new Date().getTime() - (60 * 10 * 1000));
        let numberOfLookupsBySameAgent = await this.prisma.emailLookupsLog.count({
            where: {
                userAgent: userAgent,
                userIP: userIPAddress,
                addedDate: {
                    gte: thresholdTime
                },
                status: 1
            }
        });
        if (numberOfLookupsBySameAgent >= 10) {
            let lastSentTime = await this.prisma.emailLookupsLog.findFirst({
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
            await this.prisma.emailLookupsLog.updateMany({
                where: {
                    userAgent: userAgent,
                    userIP: userIPAddress,
                },
                data: {
                    status: 2
                }
            });
        }
        return {
            canActivate: true,
            message: `Email lookup if from a valid user`
        };
    }
    findUserByEmail(email) {
        return this.prisma.user.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: 'insensitive'
                }
            },
            select: user_dto_1.userAttributes.login
        });
    }
    findUserByUUID(uuid) {
        return this.prisma.user.findUnique({
            where: {
                uuid: uuid
            },
            select: user_dto_1.userAttributes.login
        });
    }
    findUserByPhone(validateUserPhone) {
        return this.prisma.user.findFirst({
            where: {
                phone: validateUserPhone.phone.toString(),
                phoneCode: validateUserPhone.phoneCode.toString()
            },
            select: user_dto_1.userAttributes.login
        });
    }
    parseUserStatus(user, recover = false) {
        if (user.isDeleted) {
            let message = "You have deleted your account earlier. Please click on Forget your password to recover your account.";
            if (!recover) {
                throw {
                    message: message,
                    statusCode: 400
                };
            }
        }
        if (user.status == constants_1.UserStatus.suspended) {
            let message = `Your account was suspended. Please contact ${constants_1.defaultYallahEmail} to recover your account`;
            throw {
                message: message,
                statusCode: 400
            };
        }
    }
    async sendPasswordResetEmail(user, requestOrigin) {
        await this.invalidateAllResetTokenOfAuser(user.id);
        let passwordResetToken = this.generateResetPasswordToken(user.uuid, user.id);
        this.mailService.sendUserPasswordResetLink({
            user: user,
            token: passwordResetToken,
            origin: requestOrigin
        });
    }
    async sendOtpEmail(user, otpCode) {
        this.mailService.sendOtpEmail(user, otpCode);
    }
    async resetThresholdForADay(userId) {
        let waitTime = 120;
        let yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
        let numberOfResetLinksSentIn24Hours = await this.prisma.authTokens.count({
            where: {
                userId: userId,
                status: 1,
                tokenType: client_1.TokenTypes.resetPasswordToken,
                addedDate: {
                    gte: yesterday
                }
            }
        });
        if (numberOfResetLinksSentIn24Hours >= 50) {
            let lastSentTime = await this.prisma.authTokens.findFirst({
                where: {
                    userId: userId,
                    tokenType: client_1.TokenTypes.resetPasswordToken
                },
                select: {
                    id: true,
                    addedDate: true,
                    userId: true
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
                    message: `Maximum limit reached. Please wait ${waitTime - differenceInMinute} minutes to request an reset link again`,
                    waitTime: waitTime - differenceInMinute
                };
                this.logger.error("Error on " + this.constructor.name + " \n Error code : RESET_PASSWORD_LINK:THRESHOLD_MEET_SAME_USER  \n Error message : " + res.message);
                return res;
            }
            await this.prisma.authTokens.updateMany({
                where: {
                    userId: userId,
                    tokenType: client_1.TokenTypes.resetPasswordToken
                },
                data: {
                    status: constants_1.AuthTokenStatus.expired
                }
            });
        }
        return {
            canActivate: true,
            message: `Valid user reset threshold`
        };
    }
    async updateUserPassword(uuid, password) {
        let passwd = (0, bcrypt_helpers_1.generateHash)(password);
        return this.prisma.user.update({
            where: {
                uuid: uuid
            },
            data: {
                password: passwd
            },
            select: user_dto_1.userAttributes.login
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 404, data: {} };
            throw errorResponse;
        });
    }
    invalidateResetToken(resetToken) {
        return this.prisma.authTokens.updateMany({
            where: {
                token: resetToken,
                tokenType: client_1.TokenTypes.resetPasswordToken
            },
            data: {
                status: constants_1.AuthTokenStatus.used
            }
        });
    }
    logoutFromAllDevices(userId) {
        return this.prisma.authTokens.deleteMany({
            where: {
                userId: userId,
                tokenType: client_1.TokenTypes.refreshToken
            }
        });
    }
    invalidateAllResetTokenOfAuser(userId) {
        return this.prisma.authTokens.updateMany({
            where: {
                userId: userId,
                tokenType: client_1.TokenTypes.resetPasswordToken
            },
            data: {
                status: constants_1.AuthTokenStatus.expired
            }
        });
    }
    async isValidUserPassword(user, password) {
        let userData = await this.prisma.user.findUnique({
            where: {
                id: user.userId
            }
        });
        let isValidPassword = (0, bcrypt_helpers_1.compareHash)(password, userData.password);
        return isValidPassword;
    }
    updateUserEmail(user, email) {
        return this.prisma.user.update({
            where: {
                uuid: user.userUid,
            },
            data: {
                email: email,
                emailVerified: true
            },
            select: user_dto_1.userAttributes.login
        });
    }
    updateUserPhone(user, phoneCode, phone) {
        return this.prisma.user.update({
            where: {
                uuid: user.userUid,
            },
            data: {
                phone: phone,
                phoneCode: phoneCode,
                phoneVerified: true
            },
            select: user_dto_1.userAttributes.login
        });
    }
    async validateUserWithGoogle(user, userAgent) {
        if (!user || !user.email) {
            throw { message: "User token not found", statusCode: 404 };
        }
        const userData = await this.userService.findLoggedInUserDetails(user.email, { password: true });
        if (userData) {
            return userData;
        }
        let newUser = await this.prisma.user.create({
            data: {
                firstName: (user.firstName) ? user.firstName : user.email,
                lastName: (user.lastName) ? user.lastName : '',
                email: user.email,
                userSignupSource: constants_1.USER_SIGNUP_SOURCE_TYPES.google,
                userSignupDeviceAgent: userAgent,
                profile: (user.profile) ? user.profile : '',
                emailVerified: true,
                isPublished: true
            },
            select: user_dto_1.userAttributes.login
        });
        await this.prisma.userRole.create({
            data: {
                User: {
                    connect: {
                        id: newUser.id
                    }
                },
                Role: {
                    connect: {
                        slug: "CUSTOMER"
                    }
                }
            }
        });
        let profile = await this.userService.createUserAvatar(newUser.id, { username: newUser.firstName + " " + newUser.lastName, shouldFetch: false });
        if (profile) {
            newUser.profile = profile;
        }
        return newUser;
    }
    async handleSafeMode() {
        let user = await this.prisma.user.findFirst({
            where: {
                email: constants_1.safeModeUser
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
                userRole: {
                    include: {
                        Role: true
                    }
                },
                userSignupSource: true,
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
        });
        if (user) {
            if (!user.Organization) {
                let organization = await this.prisma.organization.findFirst({
                    where: {
                        isDeleted: false
                    }
                });
                await this.prisma.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        organizationId: organization.id
                    }
                });
                user.Organization = organization;
            }
            let userRoles = user.userRole.map((ele) => ele.Role.slug);
            if (userRoles.includes(constants_1.SUPER_ADMIN)) {
                return user;
            }
            else {
                await this.prisma.userRole.create({
                    data: {
                        User: {
                            connect: {
                                id: user.id
                            }
                        },
                        Role: {
                            connect: {
                                slug: constants_1.SUPER_ADMIN
                            }
                        }
                    }
                });
                return user;
            }
        }
        if (!user) {
            let newUser = await this.prisma.user.create({
                data: {
                    firstName: "Safe",
                    lastName: "User",
                    email: constants_1.safeModeUser,
                    password: "not-applicable",
                    status: constants_1.UserStatus.active,
                    isDeleted: true,
                    userRole: {
                        create: {
                            Role: {
                                connect: {
                                    slug: constants_1.SUPER_ADMIN
                                }
                            }
                        }
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
                    _count: {
                        select: {
                            Employees: true
                        }
                    },
                    userRole: {
                        include: {
                            Role: true
                        }
                    },
                    userSignupSource: true,
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
            });
            return newUser;
        }
    }
};
AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        prisma_service_1.PrismaService,
        mail_service_1.MailService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map