"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoleSeeder = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const seederData = [
    {
        User: {
            connect: {
                email: "root@datconsultancy.com"
            }
        },
        Role: {
            connect: {
                slug: "SUPER-ADMIN"
            }
        }
    },
    {
        User: {
            connect: {
                email: "yogen.pokhrel@datconsultancy.com"
            }
        },
        Role: {
            connect: {
                slug: "SYSTEM-ADMIN"
            }
        }
    },
    {
        User: {
            connect: {
                email: "dikshya@yallahproperty.com"
            }
        },
        Role: {
            connect: {
                slug: "ORG-ADMIN"
            }
        }
    },
    {
        User: {
            connect: {
                email: "james@gmail.com"
            }
        },
        Role: {
            connect: {
                slug: "CUSTOMER"
            }
        }
    },
];
exports.UserRoleSeeder = {
    up: () => {
        const __promises = [];
        seederData.forEach(async function (ele) {
            let dt = await prisma.userRole.findFirst({ where: { User: { email: ele.User.connect.email }, Role: { slug: ele.Role.connect.slug } } });
            if (!dt) {
                let __n = await prisma.userRole.create({
                    data: ele
                }).catch(err => {
                    console.log("Error while seeding User Roles", err);
                });
                __promises.push(__n);
            }
        });
        return Promise.all(__promises);
    }
};
//# sourceMappingURL=UserRoleSeeder.js.map