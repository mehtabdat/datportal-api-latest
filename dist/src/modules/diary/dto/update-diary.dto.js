"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDiaryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_diary_dto_1 = require("./create-diary.dto");
class UpdateDiaryDto extends (0, swagger_1.PartialType)(create_diary_dto_1.CreateDiaryDto) {
}
exports.UpdateDiaryDto = UpdateDiaryDto;
//# sourceMappingURL=update-diary.dto.js.map