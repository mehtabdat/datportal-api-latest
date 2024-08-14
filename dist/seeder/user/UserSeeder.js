"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSeeder = void 0;
const client_1 = require("@prisma/client");
const UserFaker_1 = require("./UserFaker");
const prisma = new client_1.PrismaClient();
const seederData = [
    {
        firstName: "Super",
        lastName: "User",
        phone: "509826068",
        phoneCode: "971",
        email: "root@datconsultancy.com",
        address: "11b Street, Dubai, UAE",
        password: "$2b$10$Ssf3HDf/EHdiooNpbg3QV.6TGcnV5Wohu/iBnLvVpKhc4mTgSsyIu",
        isPublished: true,
        Organization: {
            connect: {
                email: "root@datconsultancy.com"
            }
        }
    },
    {
        firstName: "Yogen",
        lastName: "Pokhrel",
        phone: "509826068",
        phoneCode: "971",
        email: "yogen.pokhrel@datconsultancy.com",
        address: "11b Street, Dubai, UAE",
        password: "$2b$10$Ssf3HDf/EHdiooNpbg3QV.6TGcnV5Wohu/iBnLvVpKhc4mTgSsyIu",
        isPublished: true,
        Organization: {
            connect: {
                email: "info@datconsultancy.com"
            }
        }
    }
];
exports.UserSeeder = {
    up: (faker = true) => {
        const __promises = [];
        let seeds = seederData;
        if (faker) {
            seeds = [...seeds, ...UserFaker_1.userFaker];
        }
        seeds.forEach(async function (ele) {
            let __n = await prisma.user.upsert({
                where: { email: ele.email },
                update: {},
                create: ele
            }).catch(err => {
                console.error("Error while seeding User", err.message);
            });
            __promises.push(__n);
        });
        return Promise.all(__promises);
    }
};
//# sourceMappingURL=UserSeeder.js.map