"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsSeeder = void 0;
const client_1 = require("@prisma/client");
const common_1 = require("../src/helpers/common");
const permissions_permissions_1 = require("../src/modules/permissions/permissions.permissions");
const prisma = new client_1.PrismaClient();
exports.PermissionsSeeder = {
    up: async () => {
        const seederData = [];
        let index = 0;
        for (const [moduleKey, moduleValue] of Object.entries(permissions_permissions_1.permissionSets)) {
            let modulePermissions = [];
            for (const [permissionKey, permissionValue] of Object.entries(moduleValue)) {
                const modulePermissionsSet = {
                    name: ((0, common_1.toSentenceCase)((0, common_1.camelToSnakeCase)(permissionValue))).replace(/-_/g, " "),
                    action: permissionValue,
                    condition: {},
                    Module: { connect: { id: index + 1 } }
                };
                modulePermissions.push(modulePermissionsSet);
            }
            let slug = (0, common_1.slugify)(moduleKey);
            seederData.push({
                name: (0, common_1.toSentenceCase)((0, common_1.camelToSnakeCase)(moduleKey)),
                slug: slug,
                url: '/siteSettings/' + slug,
                modulePermissions: modulePermissions
            });
            index++;
        }
        const __promises = [];
        for (const ele of seederData) {
            let __n = await prisma.modules.upsert({
                where: { slug: ele.slug },
                update: {},
                create: { name: ele.name, slug: ele.slug, url: ele.url }
            }).catch(err => {
                console.log("Error while seeding Modules and Permissions ", err);
            });
            if (__n) {
                for (const __ele of ele.modulePermissions) {
                    await prisma.permissions.upsert({
                        where: {
                            action_moduleId: {
                                moduleId: __n.id,
                                action: __ele.action
                            }
                        },
                        create: {
                            name: __ele.name,
                            action: __ele.action,
                            condition: __ele.condition,
                            moduleId: __n.id
                        },
                        update: {}
                    });
                }
            }
            __promises.push(__n);
        }
        return Promise.all(__promises);
    }
};
//# sourceMappingURL=PermissionsSeeder.js.map