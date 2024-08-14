"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.oneItemOfRecordsMockup = exports.recordsMockup = exports.model = exports.moduleName = void 0;
exports.moduleName = "Role(s)";
exports.model = "role";
exports.recordsMockup = [
    {
        id: 1,
        title: "Admin",
        slug: "A",
        isPublished: true,
        isDeleted: false
    },
    {
        id: 2,
        title: "Manager",
        slug: "M",
        isPublished: false,
        isDeleted: true
    }
];
exports.oneItemOfRecordsMockup = exports.recordsMockup[0];
const findDataById = (id) => {
    return exports.recordsMockup.find(e => e.id === id);
};
exports.db = {
    [exports.model]: {
        findMany: jest.fn().mockResolvedValue(exports.recordsMockup),
        findUnique: jest.fn().mockResolvedValue(exports.oneItemOfRecordsMockup),
        create: jest.fn().mockReturnValue(exports.oneItemOfRecordsMockup),
        update: jest.fn().mockResolvedValue(exports.oneItemOfRecordsMockup),
        delete: jest.fn().mockResolvedValue(exports.oneItemOfRecordsMockup),
        findAll: jest.fn().mockResolvedValue(exports.recordsMockup),
        findOne: jest.fn().mockImplementation((id) => {
            return new Promise((resolve, reject) => {
                const record = findDataById(id);
                if (record) {
                    resolve(record);
                }
                else {
                    reject({ statusCode: 400, data: {} });
                }
            });
        }),
    },
};
//# sourceMappingURL=test-data.js.map