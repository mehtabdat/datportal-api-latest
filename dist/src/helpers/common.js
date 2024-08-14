"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTaxData = exports.extractIds = exports.sleep = exports.generateRandomName = exports.isDateInRange = exports.getDayRange = exports.calculateTotalHours = exports.isWeekend = exports.isSameMonthYear = exports.isSameDay = exports.convertDate = exports.getDifferenceInDays = exports.getBusinessMinutesDiff = exports.getMinutesDiff = exports.extractURLsFromString = exports.validateRecaptcha = exports.addDaysToDate = exports.addDaysToCurrentDate = exports.convertToStandardTimeFormat = exports.getEnumKeyByValue = exports.generateOTP = exports.camelToSnakeCase = exports.slugify = exports.toSentenceCase = exports.getEnumKeyByEnumValue = exports.generateUUID = void 0;
const uuid_1 = require("uuid");
const axios_1 = require("axios");
const generateUUID = () => {
    return (0, uuid_1.v4)();
};
exports.generateUUID = generateUUID;
function getEnumKeyByEnumValue(myEnum, enumValue) {
    let keys = Object.keys(myEnum).filter((x) => myEnum[x] == enumValue);
    return keys.length > 0 ? keys[0] : '';
}
exports.getEnumKeyByEnumValue = getEnumKeyByEnumValue;
const toSentenceCase = (str) => {
    if (!str) {
        return "";
    }
    str = str.toLowerCase();
    const s = str &&
        str
            .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
            .join(' ');
    return s.slice(0, 1).toUpperCase() + s.slice(1);
};
exports.toSentenceCase = toSentenceCase;
const slugify = (value = "", upper = false) => {
    let tempSlug = (0, exports.camelToSnakeCase)(value);
    tempSlug = tempSlug.replace(/\s/g, '-');
    if (upper) {
        tempSlug = tempSlug.toUpperCase();
    }
    else {
        tempSlug = tempSlug.toLowerCase();
    }
    tempSlug = tempSlug.replace(/[^\w-]+/g, '').replace(/-+/g, '-');
    return tempSlug;
};
exports.slugify = slugify;
const camelToSnakeCase = str => str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
exports.camelToSnakeCase = camelToSnakeCase;
const generateOTP = (phone) => {
    return Number(Math.floor(100000 + Math.random() * 900000).toString());
};
exports.generateOTP = generateOTP;
function getEnumKeyByValue(__enum, value) {
    const indexOfS = Object.values(__enum).indexOf(value);
    const key = Object.keys(__enum)[indexOfS];
    return key;
}
exports.getEnumKeyByValue = getEnumKeyByValue;
const convertToStandardTimeFormat = (durationInSeconds) => {
    let hours = durationInSeconds / 3600;
    let mins = (durationInSeconds % 3600) / 60;
    let secs = (mins * 60) % 60;
    hours = Math.trunc(hours);
    mins = Math.trunc(mins);
    secs = Math.trunc(secs);
    if (!hours && !mins && !secs) {
        return "None";
    }
    if (hours) {
        if (mins) {
            return secs
                ? `${hours} hr ${mins} min & ${secs} sec`
                : `${hours} hr & ${mins} min`;
        }
        else {
            return secs ? `${hours} hr & ${secs} sec` : `${hours} hr`;
        }
    }
    else {
        if (mins) {
            return secs ? `${mins} min & ${secs} sec` : `${mins} min`;
        }
        else {
            return secs ? `${secs} sec` : `1 sec`;
        }
    }
};
exports.convertToStandardTimeFormat = convertToStandardTimeFormat;
function addDaysToCurrentDate(days) {
    var result = new Date();
    result.setDate(result.getDate() + days);
    return result;
}
exports.addDaysToCurrentDate = addDaysToCurrentDate;
function addDaysToDate(date, days) {
    if (!date) {
        return "No Date Provided";
    }
    let fromDate = new Date(date);
    fromDate.setDate(fromDate.getDate() + days);
    return fromDate;
}
exports.addDaysToDate = addDaysToDate;
const secretKey = "6LdwphIjAAAAAPuCaR7lCF7Gw5lZYvVvqnoI-Rcb";
function validateRecaptcha(token, ip) {
    if (!token) {
        throw { message: "Recaptcha token not found", statusCode: 400 };
    }
    const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}&remoteip=${ip}`;
    return (0, axios_1.default)(verifyURL, {
        method: "POST",
    }).then((resp) => {
        var _a;
        let captchaValidation = (_a = resp === null || resp === void 0 ? void 0 : resp.data) === null || _a === void 0 ? void 0 : _a.success;
        if (!captchaValidation) {
            throw { message: "Recaptcha verification failed, please try again", statusCode: 400 };
        }
        return true;
    }).catch((error) => {
        throw { message: "Recaptcha verification failed, please try again", statusCode: 400 };
    });
}
exports.validateRecaptcha = validateRecaptcha;
function extractURLsFromString(message) {
    var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    return message.match(urlRegex);
}
exports.extractURLsFromString = extractURLsFromString;
function getMinutesDiff(date1, date2) {
    const diffMilliseconds = Math.abs(date1.getTime() - date2.getTime());
    const diffMinutes = Math.floor(diffMilliseconds / (1000 * 60));
    return diffMinutes;
}
exports.getMinutesDiff = getMinutesDiff;
function getBusinessMinutesDiff(requestDate, replyDate) {
    let start = new Date(requestDate);
    let end = new Date(replyDate);
    var count = 0;
    for (var i = start.valueOf(); i < end.valueOf(); i = (start.setMinutes(start.getMinutes() + 1)).valueOf()) {
        if (start.getDay() != 0 && start.getDay() != 6 && start.getHours() >= 9 && start.getHours() < 18) {
            count++;
        }
    }
    return count;
}
exports.getBusinessMinutesDiff = getBusinessMinutesDiff;
function getDifferenceInDays(startDate, endDate) {
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const timeDifference = endDateObj.getTime() - startDateObj.getTime();
    const differenceInDays = timeDifference / (24 * 60 * 60 * 1000);
    return Math.round(differenceInDays);
}
exports.getDifferenceInDays = getDifferenceInDays;
let months = [
    ["Jan", "January"],
    ["Feb", "February"],
    ["Mar", "March"],
    ["Apr", "April"],
    ["May", "May"],
    ["Jun", "June"],
    ["Jul", "July"],
    ["Aug", "August"],
    ["Sep", "September"],
    ["Oct", "October"],
    ["Nov", "November"],
    ["Dec", "December"],
];
function convertDate(dt, format = 'dd M yy') {
    if (dt) {
        var date = new Date(dt);
        let day = date.getDate();
        let dayWith0 = day > 9 ? day : "0" + String(day);
        let month = date.getMonth();
        let monthWith0 = month + 1 > 9 ? month + 1 : "0" + String(month + 1);
        let year = date.getFullYear();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let min = minutes > 9 ? minutes : "0" + String(minutes);
        let monthNameShort = months[month][0];
        let monthNameLong = months[month][1];
        switch (format) {
            case "dd/mm/yy":
                return `${dayWith0}/${monthWith0}/${year}`;
            case "dd-mm-yy":
                return `${dayWith0}-${monthWith0}-${year}`;
            case "yy-mm-dd":
                return `${year}-${monthWith0}-${dayWith0}`;
            case "dd mm yy":
                return `${dayWith0} ${monthWith0} ${year}`;
            case "dd M yy":
                return `${dayWith0} ${monthNameShort} ${year}`;
            case "dd M,yy":
                return `${dayWith0} ${monthNameShort}, ${year}`;
            case "dd MM,yy":
                return `${dayWith0} ${monthNameLong}, ${year}`;
            case "dd MM yy":
                return `${dayWith0} ${monthNameLong} ${year}`;
            case "M dd,yy":
                return ` ${monthNameShort} ${dayWith0}, ${year}`;
            case "MM dd,yy":
                return `${monthNameLong} ${dayWith0}, ${year}`;
            case "M dd yy":
                return ` ${monthNameShort} ${dayWith0} ${year}`;
            case "MM dd yy":
                return `${monthNameLong} ${dayWith0} ${year}`;
            case "MM yy":
                return `${monthNameLong} ${year}`;
            case "dd M,yy-t":
                return `${dayWith0} ${monthNameShort}, ${year} - ${hours > 12 ? `${hours - 12}:${min} pm` : `${hours}:${min} am`}`;
            default:
                break;
        }
    }
}
exports.convertDate = convertDate;
function isSameDay(date1, date2) {
    return (date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate());
}
exports.isSameDay = isSameDay;
function isSameMonthYear(date1, date2) {
    return (date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth());
}
exports.isSameMonthYear = isSameMonthYear;
function isWeekend(date) {
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
}
exports.isWeekend = isWeekend;
function calculateTotalHours(startDate, endDate) {
    const timeDifference = endDate.getTime() - startDate.getTime();
    const hours = timeDifference / (1000 * 60 * 60);
    return parseFloat(hours.toFixed(2));
}
exports.calculateTotalHours = calculateTotalHours;
function getDayRange(date) {
    const currentDate = new Date(date);
    const dayStart = new Date(currentDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(currentDate);
    dayEnd.setHours(23, 59, 59, 999);
    return {
        dayStart,
        dayEnd,
    };
}
exports.getDayRange = getDayRange;
function isDateInRange(givenDate, fromDate, toDate) {
    givenDate = new Date(givenDate);
    givenDate.setHours(0, 0, 0, 0);
    fromDate = new Date(fromDate);
    fromDate.setHours(0, 0, 0, 0);
    toDate = new Date(toDate);
    toDate.setHours(0, 0, 0, 0);
    return givenDate >= fromDate && givenDate <= toDate;
}
exports.isDateInRange = isDateInRange;
function generateRandomName(length = 20) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomName = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        randomName += charset.charAt(randomIndex);
    }
    return randomName;
}
exports.generateRandomName = generateRandomName;
async function sleep(duration = 2000) {
    await new Promise(resolve => setTimeout(resolve, duration));
}
exports.sleep = sleep;
function extractIds(text) {
    const regex = /\d+/g;
    const extractedIds = text.match(regex);
    let allIds = [];
    if (extractedIds) {
        extractedIds.forEach((ele) => {
            allIds.push(Number(ele));
        });
    }
    return allIds;
}
exports.extractIds = extractIds;
function getTaxData(lineItems) {
    let taxData = new Map();
    lineItems.forEach((ele) => {
        if (ele.taxRateId) {
            let totalTax = taxData.get(ele.taxRateId) ? taxData.get(ele.taxRateId).totalTax : 0;
            totalTax += ele.taxAmount;
            taxData.set(ele.taxRateId, { title: ele.TaxRate.title, rate: ele.TaxRate.rate, totalTax: totalTax });
        }
    });
    return Array.from(taxData);
}
exports.getTaxData = getTaxData;
//# sourceMappingURL=common.js.map