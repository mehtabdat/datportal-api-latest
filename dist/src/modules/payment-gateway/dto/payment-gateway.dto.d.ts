import { ResponseSuccess } from "src/common-types/common-types";
import { PaymentGateway } from "../entities/payment-gateway.entity";
export declare class PaymentGatewayResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: PaymentGateway;
}
export declare class PaymentGatewayResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: PaymentGateway;
}
