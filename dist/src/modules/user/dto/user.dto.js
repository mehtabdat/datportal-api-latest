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
exports.UserResponseArray = exports.UserResponseObject = exports.userFileUploadPath = exports.getDynamicUploadPath = exports.userAttributes = exports.DepartmentDefaultAttributes = exports.UserDefaultAttributes = exports.userAttributesTypes = exports.UserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const update_user_dto_1 = require("./update-user.dto");
const constants_1 = require("../../../config/constants");
class UserDto extends update_user_dto_1.UpdateUserDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], UserDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], UserDto.prototype, "uid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], UserDto.prototype, "addedDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], UserDto.prototype, "addedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], UserDto.prototype, "modifiedDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], UserDto.prototype, "modifiedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], UserDto.prototype, "deletedDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], UserDto.prototype, "deletedBy", void 0);
exports.UserDto = UserDto;
var userAttributesTypes;
(function (userAttributesTypes) {
    userAttributesTypes["PUBLIC"] = "public";
    userAttributesTypes["PRIVATE"] = "private";
    userAttributesTypes["LOGIN"] = "login";
    userAttributesTypes["GENERAL"] = "general";
})(userAttributesTypes = exports.userAttributesTypes || (exports.userAttributesTypes = {}));
exports.UserDefaultAttributes = {
    id: true,
    uuid: true,
    firstName: true,
    lastName: true,
    email: true,
    profile: true,
    phone: true,
    phoneCode: true,
    dataAccessRestrictedTo: true
};
exports.DepartmentDefaultAttributes = {
    id: true,
    title: true,
    slug: true
};
exports.userAttributes = {
    public: {
        id: true,
        uuid: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneCode: true,
        phone: true,
        whatsapp: true,
        address: true,
        preferences: true,
        profile: true,
    },
    general: {
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
        status: true,
        AddedBy: {
            select: {
                id: true,
                uuid: true,
                firstName: true,
                lastName: true,
                email: true
            }
        },
        isPublished: true
    },
    login: {
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
        dataAccessRestrictedTo: true
    }
};
function getDynamicUploadPath(visibility) {
    let basepath = (visibility === "public") ? "public" : "protected";
    let currentDate = new Date().toISOString().split('T')[0];
    return basepath + '/' + constants_1.ResourcesLocation.user + '/' + currentDate;
}
exports.getDynamicUploadPath = getDynamicUploadPath;
exports.userFileUploadPath = 'public/user';
class UserResponseObject {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UserResponseObject.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UserResponseObject.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", UserDto)
], UserResponseObject.prototype, "data", void 0);
exports.UserResponseObject = UserResponseObject;
class UserResponseArray {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UserResponseArray.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UserResponseArray.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true }),
    __metadata("design:type", UserDto)
], UserResponseArray.prototype, "data", void 0);
exports.UserResponseArray = UserResponseArray;
//# sourceMappingURL=user.dto.js.map