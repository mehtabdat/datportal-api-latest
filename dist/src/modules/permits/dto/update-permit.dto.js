"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePermitDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_permit_dto_1 = require("./create-permit.dto");
class UpdatePermitDto extends (0, swagger_1.PartialType)(create_permit_dto_1.CreatePermitDto) {
}
exports.UpdatePermitDto = UpdatePermitDto;
//# sourceMappingURL=update-permit.dto.js.map