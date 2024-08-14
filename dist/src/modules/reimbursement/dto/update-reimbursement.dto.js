"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateReimbursementDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_reimbursement_dto_1 = require("./create-reimbursement.dto");
class UpdateReimbursementDto extends (0, swagger_1.PartialType)(create_reimbursement_dto_1.CreateReimbursementDto) {
}
exports.UpdateReimbursementDto = UpdateReimbursementDto;
//# sourceMappingURL=update-reimbursement.dto.js.map