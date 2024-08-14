"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsEnumArray = exports.IsEnumValue = exports.IsDateGreaterThanToday = exports.IsDateGreaterThan = exports.CustomDateValidator = exports.ValidateName = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
let ValidateName = class ValidateName {
    async validate(value) {
        try {
            let regex = new RegExp(/^[^!@#$%^&*()<>\/{}";'\\.,~`±§]*$/);
            if (regex.test(value)) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (e) {
            return false;
        }
    }
    defaultMessage(args) {
        return `Invalid Username, Username cannot contain special characters `;
    }
};
ValidateName = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'ValidateName', async: true }),
    (0, common_1.Injectable)()
], ValidateName);
exports.ValidateName = ValidateName;
let CustomDateValidator = class CustomDateValidator {
    validate(value, args) {
        return value > new Date();
    }
    defaultMessage(args) {
        return args.constraints[0];
    }
};
CustomDateValidator = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'CustomDateValidator', async: false })
], CustomDateValidator);
exports.CustomDateValidator = CustomDateValidator;
function IsDateGreaterThan(property, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'IsDateGreaterThan',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value, args) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = args.object[relatedPropertyName];
                    if (relatedValue instanceof Date && value instanceof Date) {
                        return value.getTime() > relatedValue.getTime();
                    }
                    return false;
                },
                defaultMessage(args) {
                    const [relatedPropertyName] = args.constraints;
                    return `${args.property} must be greater than ${relatedPropertyName}`;
                },
            },
        });
    };
}
exports.IsDateGreaterThan = IsDateGreaterThan;
function IsDateGreaterThanToday(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'IsDateGreaterThanToday',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value, args) {
                    const currentDate = new Date();
                    if (value instanceof Date) {
                        return value.getTime() > currentDate.getTime();
                    }
                    return false;
                },
                defaultMessage(args) {
                    return `${args.property} must be greater than today's date`;
                },
            },
        });
    };
}
exports.IsDateGreaterThanToday = IsDateGreaterThanToday;
let IsEnumValue = class IsEnumValue {
    validate(value, args) {
        const [enumType] = args.constraints;
        if (!Array.isArray(value)) {
            return false;
        }
        for (const item of value) {
            if (!Object.values(enumType).includes(item)) {
                return false;
            }
        }
        return true;
    }
    defaultMessage(args) {
        return `Each value in the array must be a valid enum value`;
    }
};
IsEnumValue = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'IsEnumValue', async: false })
], IsEnumValue);
exports.IsEnumValue = IsEnumValue;
function IsEnumArray(enumType, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'IsEnumArray',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [enumType],
            options: validationOptions,
            validator: IsEnumValue,
        });
    };
}
exports.IsEnumArray = IsEnumArray;
//# sourceMappingURL=class-validator-custom-decorators.js.map