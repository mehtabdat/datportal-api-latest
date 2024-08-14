"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateWorkingHourDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_working_hour_dto_1 = require("./create-working-hour.dto");
class UpdateWorkingHourDto extends (0, swagger_1.PartialType)(create_working_hour_dto_1.CreateWorkingHourDto) {
}
exports.UpdateWorkingHourDto = UpdateWorkingHourDto;
//# sourceMappingURL=update-working-hour.dto.js.map