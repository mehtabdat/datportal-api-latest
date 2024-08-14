"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSmDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_sm_dto_1 = require("./create-sm.dto");
class UpdateSmDto extends (0, swagger_1.PartialType)(create_sm_dto_1.CreateSmDto) {
}
exports.UpdateSmDto = UpdateSmDto;
//# sourceMappingURL=update-sm.dto.js.map