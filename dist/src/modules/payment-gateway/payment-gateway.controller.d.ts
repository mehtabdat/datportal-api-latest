import { PaymentGatewayService } from './payment-gateway.service';
import { CreatePaymentGatewayDto } from './dto/create-payment-gateway.dto';
import { UpdatePaymentGatewayDto } from './dto/update-payment-gateway.dto';
import { ParamsDto } from './dto/params.dto';
import { ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { AuthenticatedRequest } from 'src/authentication/authenticated-request';
export declare class PaymentGatewayController {
    private readonly paymentGatewayService;
    constructor(paymentGatewayService: PaymentGatewayService);
    create(createPaymentGatewayDto: CreatePaymentGatewayDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findAll(): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
    update(params: ParamsDto, updatePaymentGatewayDto: UpdatePaymentGatewayDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    remove(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
}
