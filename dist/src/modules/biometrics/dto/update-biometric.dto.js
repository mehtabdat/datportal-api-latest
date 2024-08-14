"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBiometricDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_biometric_dto_1 = require("./create-biometric.dto");
class UpdateBiometricDto extends (0, swagger_1.PartialType)(create_biometric_dto_1.CreateBiometricDto) {
}
exports.UpdateBiometricDto = UpdateBiometricDto;
//# sourceMappingURL=update-biometric.dto.js.map