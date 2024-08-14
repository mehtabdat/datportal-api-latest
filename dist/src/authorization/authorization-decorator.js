"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckPermissions = void 0;
const common_1 = require("@nestjs/common");
const CheckPermissions = (...permissions) => (0, common_1.SetMetadata)('REQUIRED_PERMISSIONS', permissions);
exports.CheckPermissions = CheckPermissions;
//# sourceMappingURL=authorization-decorator.js.map