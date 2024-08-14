"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePaymentGatewayDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_payment_gateway_dto_1 = require("./create-payment-gateway.dto");
class UpdatePaymentGatewayDto extends (0, swagger_1.PartialType)(create_payment_gateway_dto_1.CreatePaymentGatewayDto) {
}
exports.UpdatePaymentGatewayDto = UpdatePaymentGatewayDto;
//# sourceMappingURL=update-payment-gateway.dto.js.map