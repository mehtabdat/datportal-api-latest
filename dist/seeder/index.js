"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const PermissionsSeeder_1 = require("./PermissionsSeeder");
const prisma = new client_1.PrismaClient();
async function main() {
    let seedFakers = true;
    await PermissionsSeeder_1.PermissionsSeeder.up().then((data) => { console.log("Permissions Seeding Completed.", data.length); });
    ;
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=index.js.map