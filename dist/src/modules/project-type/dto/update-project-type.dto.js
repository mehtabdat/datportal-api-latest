"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProjectTypeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_project_type_dto_1 = require("./create-project-type.dto");
class UpdateProjectTypeDto extends (0, swagger_1.PartialType)(create_project_type_dto_1.CreateProjectTypeDto) {
}
exports.UpdateProjectTypeDto = UpdateProjectTypeDto;
//# sourceMappingURL=update-project-type.dto.js.map