"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountrySeeder = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const allCountry_1 = require("./Country/allCountry");
exports.CountrySeeder = {
    up: () => {
        const __promises = [];
        allCountry_1.allCountries.forEach(async function (ele) {
            let __n = await prisma.country.upsert({
                where: { isoCode: ele.code },
                update: {},
                create: {
                    name: ele.name,
                    shortName: ele.code,
                    isoCode: ele.code,
                    displayName: ele.name,
                    phoneCode: ele.dial_code,
                    flag: ele.emoji
                }
            }).catch(err => {
                console.log("Error while seeding Country ", err);
            });
            __promises.push(__n);
        });
        return Promise.all(__promises);
    }
};
//# sourceMappingURL=CountrySeeder.js.map