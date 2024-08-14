"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationSeeder = void 0;
const client_1 = require("@prisma/client");
const OrganizationFaker_1 = require("./OrganizationFaker");
const prisma = new client_1.PrismaClient();
const organizationSeederData = [
    {
        email: "root@datconsultancy.com",
        phone: "509826068",
        phoneCode: "971",
        address: "The Opus Tower by Zaha Hadid, Office B803, Business Bay, Dubai",
        logo: "public/agents/dat-logo.png",
        Country: {
            connect: {
                isoCode: 'AE'
            }
        },
        locationMap: "https://www.google.com/maps/place/DAT+Engineering+Consultancy/@25.1887385,55.2648997,17z/data=!3m1!4b1!4m5!3m4!1s0x3e5f694b6c18b021:0x69274a387c7699f7!8m2!3d25.1887385!4d55.2670884",
        name: "System Root",
    },
    {
        email: "info@datconsultancy.com",
        phone: "509826068",
        phoneCode: "971",
        address: "The Opus Tower by Zaha Hadid, Office B803, Business Bay, Dubai",
        logo: "public/agents/dat-logo.png",
        Country: {
            connect: {
                isoCode: 'AE'
            }
        },
        locationMap: "https://www.google.com/maps/place/DAT+Engineering+Consultancy/@25.1887385,55.2648997,17z/data=!3m1!4b1!4m5!3m4!1s0x3e5f694b6c18b021:0x69274a387c7699f7!8m2!3d25.1887385!4d55.2670884",
        name: "DAT Engineering Consultancy",
    },
    {
        email: "info@yallahproperty.com",
        phone: "509826068",
        phoneCode: "971",
        address: "Emirates tower, 1306, Dubai, United Arab Emirates",
        logo: "public/agents/yallah-property-logo.png",
        locationMap: "https://www.google.com/maps/place/DAT+Engineering+Consultancy/@25.1887385,55.2648997,17z/data=!3m1!4b1!4m5!3m4!1s0x3e5f694b6c18b021:0x69274a387c7699f7!8m2!3d25.1887385!4d55.2670884",
        name: "DAT Project Portal",
    }
];
exports.OrganizationSeeder = {
    up: (faker = true) => {
        const __promises = [];
        let seeds = organizationSeederData;
        if (faker) {
            seeds = [...seeds, ...OrganizationFaker_1.organizationFaker];
        }
        seeds.forEach(async function (ele) {
            let __n = await prisma.organization.upsert({
                where: { email: ele.email },
                update: {},
                create: ele
            }).catch(err => {
                console.log("Error while seeding organization ", err);
            });
            __promises.push(__n);
        });
        return Promise.all(__promises);
    }
};
//# sourceMappingURL=OrganizationSeeder.js.map