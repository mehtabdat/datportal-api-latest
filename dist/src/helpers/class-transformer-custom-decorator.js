"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseCustomPropertyId = exports.ParseCustomNumberArray = exports.ParseJson = exports.SlugifyString = exports.ParseBoolean = exports.optionalBooleanMapper = void 0;
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const common_2 = require("./common");
exports.optionalBooleanMapper = new Map([
    ['undefined', undefined],
    ['true', true],
    ['false', false],
]);
const ParseBoolean = () => (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true || value === 1 || value === '1');
exports.ParseBoolean = ParseBoolean;
const SlugifyString = (upper = false, delimeter = '-') => (0, class_transformer_1.Transform)(({ value }) => {
    if (typeof value !== "string")
        throw { message: "Please provide a valid slug. You may have provided multiple values", statusCode: 400 };
    let tempSlug = value;
    if (!upper) {
        tempSlug = (0, common_2.camelToSnakeCase)(value);
    }
    tempSlug = tempSlug.replace(/\s/g, delimeter);
    if (upper) {
        tempSlug = tempSlug.toUpperCase();
    }
    else {
        tempSlug = tempSlug.toLowerCase();
    }
    tempSlug = tempSlug.replace(/[^\w-]+/g, '').replace(/-+/g, delimeter);
    return tempSlug;
});
exports.SlugifyString = SlugifyString;
const ParseJson = () => (0, class_transformer_1.Transform)((options) => {
    try {
        if (typeof options.value === "object")
            return options.value;
        return JSON.parse(options.value);
    }
    catch (e) {
        throw new common_1.BadRequestException(`${options.key} contains invalid JSON `);
    }
});
exports.ParseJson = ParseJson;
const ParseCustomNumberArray = () => (0, class_transformer_1.Transform)(({ key, value }) => {
    if (Array.isArray(value)) {
        let temp = [...new Set(value)];
        return temp.map((val) => { if (parseInt(val))
            return parseInt(val);
        else
            throw new common_1.BadRequestException(`Invalid ${key} provided, ${key} must be an integer value`); });
    }
    return parseInt(value);
});
exports.ParseCustomNumberArray = ParseCustomNumberArray;
const ParseCustomPropertyId = () => (0, class_transformer_1.Transform)(({ key, value }) => {
    if (typeof value === 'number') {
        return value;
    }
    else if (typeof value === 'string') {
        if (value.includes("-")) {
            let t = value.split("-");
            if (t[1]) {
                return Number(t[1]);
            }
            else {
                throw new common_1.BadRequestException(`Provided ${key} is not a valid property ID or Reference number `);
            }
        }
        else {
            let t = Number(value);
            if ((0, class_validator_1.isNumber)(t) === true) {
                return t;
            }
            else {
                throw new common_1.BadRequestException(`Provided ${key} is not a valid property ID or Reference number `);
            }
        }
    }
    else {
        throw new common_1.BadRequestException(`Provided ${key} is not a valid property ID or Reference number `);
    }
});
exports.ParseCustomPropertyId = ParseCustomPropertyId;
//# sourceMappingURL=class-transformer-custom-decorator.js.map