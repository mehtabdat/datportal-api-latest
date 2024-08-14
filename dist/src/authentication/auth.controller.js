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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("../helpers/common");
const user_dto_1 = require("../modules/user/dto/user.dto");
const auth_service_1 = require("./auth.service");
const refresh_token_dto_1 = require("./dto/refresh-token.dto");
const signup_dto_1 = require("./dto/signup.dto");
const user_login_dto_1 = require("./dto/user-login.dto");
const jwt_refresh_auth_guard_1 = require("./guards/jwt-refresh-auth.guard");
const jwt_phone_signup_auth_guard_1 = require("./guards/jwt-phone-signup-auth.guard");
const public_metadata_1 = require("./public-metadata");
const jwt_email_signup_auth_guard_1 = require("./guards/jwt-email-signup-auth.guard");
const validate_user_email_dto_1 = require("./dto/validate-user-email.dto");
const constants_1 = require("../config/constants");
const password_reset_dto_1 = require("./dto/password-reset-dto");
const reset_user_password_dto_1 = require("./dto/reset-user-password.dto");
const jwt_password_reset_auth_guard_1 = require("./guards/jwt-password-reset-auth.guard");
const change_user_password_dto_1 = require("./dto/change-user-password.dto");
const validate_user_otp_dto_1 = require("./dto/validate-user-otp.dto");
const update_user_credentials_dto_1 = require("./dto/update-user-credentials.dto");
const system_logger_service_1 = require("../modules/system-logs/system-logger.service");
const google_token_verification_dto_1 = require("./dto/google-token-verification.dto");
const google_auth_service_1 = require("./google-auth.service");
const google_oauth_guard_1 = require("./guards/google-oauth.guard");
const login_as_user_dto_1 = require("./dto/login-as-user.dto");
const authorization_decorator_1 = require("../authorization/authorization-decorator");
const authorization_service_1 = require("../authorization/authorization.service");
const helpers_1 = require("../helpers/helpers");
let AuthController = class AuthController {
    constructor(authService, systemLogger, googleAuthService, authorizationService) {
        this.authService = authService;
        this.systemLogger = systemLogger;
        this.googleAuthService = googleAuthService;
        this.authorizationService = authorizationService;
    }
    async login(userLoginDto, req) {
        try {
            let data = await this.authService.validateUser(userLoginDto.email, userLoginDto.password, userLoginDto.safeModeKey);
            if (!data.Organization) {
                throw {
                    message: "You are not added to any organization. Only organization user can login to the portal",
                    statusCode: 400
                };
            }
            if (data.status !== constants_1.UserStatus.active) {
                throw {
                    message: `Your account has been ${(0, common_2.getEnumKeyByEnumValue)(constants_1.UserStatus, data.status)} by the organization. You can not login. Please contact your administrator.`,
                    statusCode: 400
                };
            }
            let userRoles = await this.authService.findUserRoles(data.id);
            const userRoleIds = userRoles.map((key) => key.Role.id);
            const userRoleSlugs = userRoles.map((key) => key.Role.slug);
            let allData = Object.assign(Object.assign({}, data), { roles: {
                    ids: userRoleIds,
                    slugs: userRoleSlugs
                } });
            let userAgent = req.headers["user-agent"];
            let clientIPAddress = (0, helpers_1.findClientIpAddress)(req);
            let token = this.authService.accessTokens(allData, true, userAgent, clientIPAddress);
            return { message: "User Logged in Successfully", statusCode: 200, data: { userData: allData, token: token } };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async loggedInAs(loginAsUser, req) {
        try {
            let data = await this.authService.getUserDataForLoginAsUser(loginAsUser.userId);
            let userRoles = await this.authService.findAdminRoles(data.id);
            if (userRoles.length === 0) {
                throw { message: "This user doesnot have enough roles to login to adminpanel. Please assign some roles and try again.", statusCode: 400 };
            }
            this.systemLogger.logData({
                tableName: "User",
                field: 'id',
                value: loginAsUser.userId,
                actionType: 'LOGIN',
                valueType: "number",
                user: req.user.userId,
                data: { loginBy: req.user.userId, loginAs: loginAsUser.userId },
                endPoint: req.originalUrl,
                controllerName: this.constructor.name,
                message: "Login as different user"
            });
            const userRoleIds = userRoles.map((key) => key.Role.id);
            const userRoleSlugs = userRoles.map((key) => key.Role.slug);
            let allData = Object.assign(Object.assign({}, data), { roles: {
                    ids: userRoleIds,
                    slugs: userRoleSlugs
                } });
            let userAgent = req.headers["user-agent"];
            let clientIPAddress = (0, helpers_1.findClientIpAddress)(req);
            let token = this.authService.accessTokens(allData, true, userAgent, clientIPAddress);
            return { message: "User Logged in Successfully", statusCode: 200, data: { userData: data, token: token } };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async googleAuth(req) {
        try {
            console.log("I am here");
            console.log(req.params);
            console.log(req.body);
            return { message: "User Logged in with google Successfully", statusCode: 200, data: {} };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async googleAuthVerify(tokenData, req) {
        try {
            let userDataFromGoogle = await this.googleAuthService.authenticate(tokenData.token);
            let userAgent = req.headers["user-agent"];
            let data = await this.authService.validateUserWithGoogle(userDataFromGoogle, userAgent);
            let userRoles = await this.authService.findUserRoles(data.id);
            const userRoleIds = userRoles.map((key) => key.Role.id);
            const userRoleSlugs = userRoles.map((key) => key.Role.slug);
            let allData = Object.assign(Object.assign({}, data), { roles: {
                    ids: userRoleIds,
                    slugs: userRoleSlugs
                } });
            let tokens = this.authService.accessTokens(allData);
            return { message: "User Logged in Successfully", statusCode: 200, data: { userData: allData, token: tokens } };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async googleAuthCallback(req) {
        try {
            let userAgent = req.headers["user-agent"];
            let data = await this.authService.validateUserWithGoogle(req.user, userAgent);
            let userRoles = await this.authService.findUserRoles(data.id);
            const userRoleIds = userRoles.map((key) => key.Role.id);
            const userRoleSlugs = userRoles.map((key) => key.Role.slug);
            data.roles = { ids: userRoleIds, slugs: userRoleSlugs };
            return { message: "User Logged in Successfully", statusCode: 200, data: { userData: data, token: this.authService.accessTokens(data) } };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async refresh(req, refreshToken) {
        try {
            let user = req.user;
            let data = await this.authService.fetchUserDetails(user.userEmail, user.userId);
            let userRoles = await this.authService.findUserRoles(user.userId);
            const userRoleIds = userRoles.map((key) => key.Role.id);
            const userRoleSlugs = userRoles.map((key) => key.Role.slug);
            data.roles = { ids: userRoleIds, slugs: userRoleSlugs };
            let userAgent = req.headers["user-agent"];
            let clientIPAddress = (0, helpers_1.findClientIpAddress)(req);
            let tokenData = this.authService.accessTokens(data, false, userAgent, clientIPAddress);
            this.authService.deleteRefreshToken(refreshToken.refreshToken, req.user.userId);
            return { message: "Token refreshed Successfully", statusCode: 200, data: tokenData };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async refreshAdmin(req, refreshToken) {
        try {
            let user = req.user;
            let data = await this.authService.fetchUserDetailsAdmin(user.userEmail, user.userId);
            let userRoles = await this.authService.findUserRoles(user.userId);
            if (userRoles.length === 0) {
                throw { message: "You don't have enough permission to login in Yallah Portal. Kindly contact your organization to get an access.", statusCode: 400 };
            }
            const userRoleIds = userRoles.map((key) => key.Role.id);
            const userRoleSlugs = userRoles.map((key) => key.Role.slug);
            data.roles = { ids: userRoleIds, slugs: userRoleSlugs };
            let userAgent = req.headers["user-agent"];
            let clientIPAddress = (0, helpers_1.findClientIpAddress)(req);
            let tokenData = this.authService.accessTokens(data, false, userAgent, clientIPAddress);
            this.authService.deleteRefreshToken(refreshToken.refreshToken, req.user.userId);
            return { message: "Token refreshed Successfully", statusCode: 200, data: tokenData };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async logout(req, refreshToken) {
        try {
            this.authService.deleteRefreshToken(refreshToken.refreshToken, req.user.userId);
            return { message: "User logged out successfully", statusCode: 200, data: {} };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async phoneSignup(signupDto, req) {
        try {
            if (!req.user.phone) {
                throw {
                    message: "Bad request, user phone not found in the token",
                    statusCode: 400
                };
            }
            signupDto.phone = req.user.phone;
            signupDto.phoneCode = req.user.phoneCode;
            let userExist = await this.authService.userPhoneExists(req.user.phoneCode, req.user.phone);
            if (userExist) {
                throw {
                    message: "User phone already exists. Please login instead",
                    statusCode: 400
                };
            }
            if (signupDto.email) {
                let userExist = await this.authService.userEmailExists(signupDto.email);
                if (userExist) {
                    throw {
                        message: "User email already exists.",
                        statusCode: 400
                    };
                }
            }
            let userAgent = req.headers["user-agent"];
            let user = await this.authService.signUpUser(signupDto, { signupSource: constants_1.USER_SIGNUP_SOURCE_TYPES.phone, userAgent: userAgent });
            this.authService.parseUserStatus(user);
            let userRoles = await this.authService.findUserRoles(user.id);
            const userRoleIds = userRoles.map((key) => key.Role.id);
            const userRoleSlugs = userRoles.map((key) => key.Role.slug);
            user.roles = { ids: userRoleIds, slugs: userRoleSlugs };
            return { message: "User Registered Successfully", statusCode: 200, data: { userData: user, token: this.authService.accessTokens(user), status: "AUTH" } };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async emailSignup(signupDto, req) {
        try {
            if (!req.user.email) {
                throw {
                    message: "Bad request, user email not found in the token",
                    statusCode: 400
                };
            }
            signupDto.email = req.user.email;
            let userExist = await this.authService.userEmailExists(req.user.email);
            if (userExist) {
                throw {
                    message: "User email already exists. Please login instead",
                    statusCode: 400
                };
            }
            let userAgent = req.headers["user-agent"];
            let user = await this.authService.signUpUser(signupDto, { signupSource: constants_1.USER_SIGNUP_SOURCE_TYPES.email, userAgent: userAgent });
            this.authService.parseUserStatus(user);
            let userRoles = await this.authService.findUserRoles(user.id);
            const userRoleIds = userRoles.map((key) => key.Role.id);
            const userRoleSlugs = userRoles.map((key) => key.Role.slug);
            user.roles = { ids: userRoleIds, slugs: userRoleSlugs };
            return { message: "User Registered Successfully", statusCode: 200, data: { userData: user, token: this.authService.accessTokens(user), status: "AUTH" } };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async emailLookup(validateUserEmail, req) {
        try {
            let userAgent = req.headers["user-agent"];
            let userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            let clientIPAddress = userIp.split(',')[0];
            let requestType = await this.authService.isFalseRequest(clientIPAddress, userAgent);
            if (requestType.canActivate !== true) {
                throw {
                    statusCode: 400,
                    message: requestType.message,
                    data: {
                        waitTime: requestType.waitTime
                    }
                };
            }
            let user = await this.authService.findUserByEmail(validateUserEmail.email);
            if (!user) {
                await this.authService.logEmailLookup(validateUserEmail.email, clientIPAddress, userAgent);
                let token = this.authService.generateEmailSignupTempToken(validateUserEmail.email);
                return { message: "Email validated successfully", statusCode: 200, data: { token, status: "SIGN-UP" } };
            }
            else {
                this.authService.parseUserStatus(user);
                return { message: "Email validated successfully", statusCode: 200, data: { status: "LOGIN" } };
            }
        }
        catch (err) {
            throw new common_1.HttpException({
                message: err.message,
                data: err.data,
                statusCode: err.statusCode
            }, err.statusCode);
        }
    }
    async sendPasswordResetLink(passwordResetDto, req) {
        try {
            let userAgent = req.headers["user-agent"];
            let userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            let clientIPAddress = userIp.split(',')[0];
            let origin = req.headers.origin;
            let requestType = await this.authService.isFalseRequest(clientIPAddress, userAgent);
            if (requestType.canActivate !== true) {
                throw {
                    statusCode: 400,
                    message: requestType.message,
                    data: {
                        waitTime: requestType.waitTime
                    }
                };
            }
            let user = await this.authService.findUserByEmail(passwordResetDto.email);
            if (user) {
                this.authService.parseUserStatus(user, true);
                let requestThreshold = await this.authService.resetThresholdForADay(user.id);
                if (requestThreshold.canActivate !== true) {
                    throw {
                        statusCode: 400,
                        message: requestType.message,
                        data: {
                            waitTime: requestType.waitTime
                        }
                    };
                }
                this.authService.sendPasswordResetEmail(user, origin);
            }
            else {
                await this.authService.logEmailLookup(passwordResetDto.email, clientIPAddress, userAgent);
            }
            return {
                message: "If the email is registered to the system you will receive a reset link in the registered email.",
                statusCode: 200,
                data: {}
            };
        }
        catch (err) {
            throw new common_1.HttpException({
                message: err.message,
                data: err.data,
                statusCode: err.statusCode
            }, err.statusCode);
        }
    }
    async resetUserPassword(updateUserPassword, req) {
        try {
            let user = await this.authService.findUserByUUID(req.user.uuid);
            if (!user) {
                throw {
                    message: "Invalid token. User not found"
                };
            }
            await this.authService.updateUserPassword(req.user.uuid, updateUserPassword.password);
            await this.authService.invalidateResetToken(req.body.resetToken);
            await this.authService.logoutFromAllDevices(user.id);
            this.systemLogger.logData({
                tableName: "User",
                field: 'id',
                value: user.id,
                actionType: 'UPDATE',
                valueType: "number",
                user: user.id,
                data: {},
                endPoint: req.originalUrl,
                controllerName: this.constructor.name,
                message: "Reset Passowrd"
            });
            return {
                message: "User password updated successfully.",
                statusCode: 200,
                data: {}
            };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async changeUserPassword(changeUserPassword, req) {
        try {
            let isValidPassword = await this.authService.isValidUserPassword(req.user, changeUserPassword.password);
            if (isValidPassword) {
                await this.authService.updateUserPassword(req.user.userUid, changeUserPassword.newPassword);
                await this.authService.logoutFromAllDevices(req.user.userId);
                this.systemLogger.logData({
                    tableName: "User",
                    field: 'id',
                    value: req.user.userId,
                    actionType: 'UPDATE',
                    valueType: "number",
                    user: req.user.userId,
                    data: {},
                    endPoint: req.originalUrl,
                    controllerName: this.constructor.name,
                    message: "Change user password"
                });
                return {
                    message: "Your password has been updated successfully. You have also been logged out from all devices.",
                    statusCode: 200,
                    data: {}
                };
            }
            else {
                throw {
                    message: "Old password is not valid",
                    statusCode: 400,
                    data: {}
                };
            }
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async sendCredentialsResetCode(req) {
        try {
            let user = req.user;
            let userData = await this.authService.findUserByUUID(user.userUid);
            let otp = (0, common_2.generateOTP)(userData.phone.toString());
            let userAgent = req.headers["user-agent"];
            let userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            let clientIPAddress = userIp.split(',')[0];
            let sendOtp;
            if (userData.phone) {
                sendOtp = await this.authService.canSendOtp({ phone: parseInt(userData.phone), phoneCode: parseInt(userData.phoneCode) }, clientIPAddress, userAgent);
            }
            else {
                sendOtp = await this.authService.canSendOtpEmail(userData.email, clientIPAddress, userAgent);
            }
            if (!sendOtp.canActivate) {
                throw {
                    statusCode: 400,
                    message: sendOtp.message,
                    data: {
                        waitTime: sendOtp.waitTime
                    }
                };
            }
            if (userData.email) {
                this.authService.sendOtpEmail(userData, otp);
            }
            let sendOtpData = {
                email: (userData.email) ? userData.email : null,
                phone: (userData.phone) ? userData.phone : null,
                phoneCode: (userData.phoneCode) ? userData.phoneCode : null
            };
            let data = await this.authService.sendUserOtp(sendOtpData, otp.toString(), clientIPAddress, userAgent);
            let sentToData = {};
            if (userData.phone) {
                sentToData = {
                    phone: userData.phoneCode + userData.phone,
                    email: userData.email
                };
            }
            else {
                sentToData = {
                    email: userData.email
                };
            }
            return { message: "OTP sent successfully", statusCode: 200, data: { sentAt: data.addedDate, sentTo: sentToData } };
        }
        catch (err) {
            throw new common_1.HttpException({
                message: err.message,
                data: err.data,
                statusCode: err.statusCode
            }, err.statusCode);
        }
    }
    async validateUser(validateUserOtp, req) {
        try {
            let userData = await this.authService.findUserByUUID(req.user.userUid);
            let udt = {};
            if (userData.phone) {
                udt = {
                    phone: userData.phone,
                    phoneCode: userData.phoneCode
                };
            }
            if (userData.email) {
                udt = Object.assign(Object.assign({}, udt), { email: userData.email });
            }
            let validationResult = await this.authService.validateUserOTP(udt, validateUserOtp.otp);
            if (validationResult.isValid === true) {
                return { message: "User Logged in Successfully", statusCode: 200, data: { token: this.authService.generateChangeUserPhoneEmailToken(userData.uuid, userData.id), status: "AUTH" } };
            }
            else {
                throw {
                    message: validationResult.message,
                    statusCode: 400
                };
            }
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async sendOtpEmail(updateUserEmail, req) {
        try {
            let otp = (0, common_2.generateOTP)();
            let userAgent = req.headers["user-agent"];
            let userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            let clientIPAddress = userIp.split(',')[0];
            let sendOtp = await this.authService.canSendOtpEmail(updateUserEmail.email, clientIPAddress, userAgent);
            if (!sendOtp.canActivate) {
                throw {
                    statusCode: 400,
                    message: sendOtp.message,
                    data: {
                        waitTime: sendOtp.waitTime
                    }
                };
            }
            let userData = await this.authService.findUserByUUID(req.user.userUid);
            userData.email = updateUserEmail.email;
            this.authService.sendOtpEmail(userData, otp);
            let data = await this.authService.sendUserOtp({ email: updateUserEmail.email }, otp.toString(), clientIPAddress, userAgent);
            let sentToData = { email: userData.email };
            return { message: "OTP sent successfully", statusCode: 200, data: { sentAt: data.addedDate, sentTo: sentToData } };
        }
        catch (err) {
            throw new common_1.HttpException({
                message: err.message,
                data: err.data,
                statusCode: err.statusCode
            }, err.statusCode);
        }
    }
    async validateAndUpdateUserEmail(validateUserEmailOtp, req) {
        try {
            let validationResult = await this.authService.validateUserOTP({ email: validateUserEmailOtp.email }, validateUserEmailOtp.otp);
            if (validationResult.isValid === true) {
                let userExist = await this.authService.userEmailExists(validateUserEmailOtp.email);
                if (userExist) {
                    throw {
                        message: "Some user is already using this email address. If it belongs to you please contect at " + constants_1.defaultYallahEmail,
                        statusCode: 400
                    };
                }
                let user = await this.authService.updateUserEmail(req.user, validateUserEmailOtp.email);
                this.authService.parseUserStatus(user);
                let userRoles = await this.authService.findUserRoles(user.id);
                const userRoleIds = userRoles.map((key) => key.Role.id);
                const userRoleSlugs = userRoles.map((key) => key.Role.slug);
                user["roles"] = { ids: userRoleIds, slugs: userRoleSlugs };
                this.systemLogger.logData({
                    tableName: "User",
                    field: 'id',
                    value: req.user.userId,
                    actionType: 'UPDATE',
                    valueType: "number",
                    user: req.user.userId,
                    data: { oldData: { email: req.user.userEmail }, newData: validateUserEmailOtp },
                    endPoint: req.originalUrl,
                    controllerName: this.constructor.name,
                    message: "Change user email"
                });
                return { message: "User Email Updated Successfully", statusCode: 200, data: { userData: user, token: this.authService.accessTokens(user), status: "AUTH" } };
            }
            else {
                throw {
                    message: validationResult.message,
                    statusCode: 400
                };
            }
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, public_metadata_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Logs in user to the system' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: user_dto_1.UserDto, isArray: false, description: 'Returns the access token if the user credentials are valid' }),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_login_dto_1.UserLoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(),
    (0, swagger_1.ApiOperation)({ summary: 'Logs in user to the system' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: user_dto_1.UserDto, isArray: false, description: 'Returns the access token if the user credentials are valid' }),
    (0, common_1.Post)('loginAsUser'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_as_user_dto_1.LoginAsUser, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loggedInAs", null);
__decorate([
    (0, public_metadata_1.Public)(),
    (0, common_1.UseGuards)(google_oauth_guard_1.GoogleOauthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Logs in user to the system' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: user_dto_1.UserDto, isArray: false, description: 'Returns the access token if the user credentials are valid' }),
    (0, common_1.Get)('google-auth'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, public_metadata_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Logs in user to the system' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: user_dto_1.UserDto, isArray: false, description: 'Returns the access token if the user credentials are valid' }),
    (0, common_1.Post)('google-auth-verify'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [google_token_verification_dto_1.GoogleTokenVerificationDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuthVerify", null);
__decorate([
    (0, public_metadata_1.Public)(),
    (0, common_1.Get)('oauth-google-callback'),
    (0, common_1.UseGuards)(google_oauth_guard_1.GoogleOauthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuthCallback", null);
__decorate([
    (0, public_metadata_1.Public)(),
    (0, common_1.UseGuards)(jwt_refresh_auth_guard_1.JwtRefreshAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Generates access token for the user using refresh token', description: "Refresh tokens should be passed in the header just like the access token" }),
    (0, swagger_1.ApiResponse)({ status: 200, type: user_dto_1.UserDto, isArray: false, description: 'Returns the access token if the user refresh token are valid' }),
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, refresh_token_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, public_metadata_1.Public)(),
    (0, common_1.UseGuards)(jwt_refresh_auth_guard_1.JwtRefreshAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Generates access token for the user using refresh token', description: "Refresh tokens should be passed in the header just like the access token" }),
    (0, swagger_1.ApiResponse)({ status: 200, type: user_dto_1.UserDto, isArray: false, description: 'Returns the access token if the user refresh token are valid' }),
    (0, common_1.Post)('refreshAdmin'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, refresh_token_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshAdmin", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Logout user from the system', description: "Logout user from the system" }),
    (0, swagger_1.ApiResponse)({ status: 200, isArray: false, description: 'Returns success if the user logout is success or an error' }),
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, refresh_token_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, public_metadata_1.Public)(),
    (0, common_1.UseGuards)(jwt_phone_signup_auth_guard_1.JwtPhoneSignupAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Signup user in the system', description: "signup user in the system" }),
    (0, swagger_1.ApiResponse)({ status: 200, isArray: false, description: 'Returns success if the user logout is success or an error' }),
    (0, common_1.Post)('phone-signup'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signup_dto_1.PhoneSignupDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "phoneSignup", null);
__decorate([
    (0, public_metadata_1.Public)(),
    (0, common_1.UseGuards)(jwt_email_signup_auth_guard_1.JwtEmailSignupAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Signup user in the system', description: "signup user in the system" }),
    (0, swagger_1.ApiResponse)({ status: 200, isArray: false, description: 'Returns success if the user logout is success or an error' }),
    (0, common_1.Post)('email-signup'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signup_dto_1.EmailSignupDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "emailSignup", null);
__decorate([
    (0, public_metadata_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Validate user email', description: "user email validation" }),
    (0, swagger_1.ApiResponse)({ status: 200, isArray: false, description: 'Returns success if the user email validated successfully' }),
    (0, common_1.Post)('email-lookup'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [validate_user_email_dto_1.ValidateUserEmail, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "emailLookup", null);
__decorate([
    (0, public_metadata_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Forget user password', description: "User password recovery" }),
    (0, swagger_1.ApiResponse)({ status: 200, isArray: false, description: 'Sends an recovery link to an email to recover the user password' }),
    (0, common_1.Post)('send-password-reset-link'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [password_reset_dto_1.PasswordResetDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendPasswordResetLink", null);
__decorate([
    (0, public_metadata_1.Public)(),
    (0, common_1.UseGuards)(jwt_password_reset_auth_guard_1.JwtPasswordResetAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update user password', description: "User password update on the basis of token provided" }),
    (0, swagger_1.ApiResponse)({ status: 200, isArray: false, description: 'Updates user password on the basis of token data' }),
    (0, common_1.Post)('reset-user-password'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_user_password_dto_1.ResetUserPassword, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetUserPassword", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update user password', description: "User password update on the basis of token provided" }),
    (0, swagger_1.ApiResponse)({ status: 200, isArray: false, description: 'Updates user password on the basis of token data' }),
    (0, common_1.Post)('change-user-password'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [change_user_password_dto_1.ChangeUserPassword, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changeUserPassword", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Send OTP to update user credentials', description: "Send OTP to update user credentials" }),
    (0, swagger_1.ApiResponse)({ status: 200, isArray: false, description: 'Sends an OTP code to phone or an email to change the user email/phone' }),
    (0, common_1.Post)('send-credentials-reset-code'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendCredentialsResetCode", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Validate user phone', description: "user phone validation" }),
    (0, swagger_1.ApiResponse)({ status: 200, isArray: false, description: 'Returns success if the user phone validated successfully' }),
    (0, common_1.Post)('validate-user'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [validate_user_otp_dto_1.ValidateUserOtp, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "validateUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update user password', description: "User password update on the basis of token provided" }),
    (0, swagger_1.ApiResponse)({ status: 200, isArray: false, description: 'Updates user password on the basis of token data' }),
    (0, common_1.Post)('send-otp-email'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_user_credentials_dto_1.UpdateUserEmailRequest, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendOtpEmail", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Validate and update user email', description: "Update user email" }),
    (0, swagger_1.ApiResponse)({ status: 200, isArray: false, description: 'Returns new token and refresh token if the user validated successfully' }),
    (0, common_1.Post)('validate-and-update-user-email'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_user_credentials_dto_1.ValidateUserEmailOtp, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "validateAndUpdateUserEmail", null);
AuthController = __decorate([
    (0, swagger_1.ApiTags)("Authentication"),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        system_logger_service_1.SystemLogger,
        google_auth_service_1.GoogleAuthService,
        authorization_service_1.AuthorizationService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map