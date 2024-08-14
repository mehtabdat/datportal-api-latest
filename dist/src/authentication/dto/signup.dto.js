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
exports.LoginSignUpByPhone = exports.PhoneSignupDto = exports.EmailSignupDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class EmailSignupDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please enter first name" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EmailSignupDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please enter last name" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EmailSignupDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)({ message: "Please enter your email" }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], EmailSignupDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EmailSignupDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EmailSignupDto.prototype, "phoneCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please create a passowrd" }),
    (0, class_validator_1.MinLength)(4),
    __metadata("design:type", String)
], EmailSignupDto.prototype, "password", void 0);
exports.EmailSignupDto = EmailSignupDto;
class PhoneSignupDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please enter first name" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PhoneSignupDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please enter last name" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PhoneSignupDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please enter your email" }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], PhoneSignupDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PhoneSignupDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PhoneSignupDto.prototype, "phoneCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)({ message: "Please enter a passowrd" }),
    (0, class_validator_1.MinLength)(4),
    __metadata("design:type", String)
], PhoneSignupDto.prototype, "password", void 0);
exports.PhoneSignupDto = PhoneSignupDto;
class LoginSignUpByPhone {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please enter your phone" }),
    (0, class_validator_1.Max)(999999999999),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], LoginSignUpByPhone.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please enter your phone code" }),
    (0, class_validator_1.Max)(9999),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], LoginSignUpByPhone.prototype, "phoneCode", void 0);
exports.LoginSignUpByPhone = LoginSignUpByPhone;
//# sourceMappingURL=signup.dto.js.map