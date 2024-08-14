/// <reference types="multer" />
import { CashAdvanceService } from './cash-advance.service';
import { CreateCashAdvanceDto } from './dto/create-cash-advance.dto';
import { Pagination, ParamsDto, ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { CashAdvanceRequestFiltersDto } from './dto/cash-advance-filters.dto';
import { AuthenticatedRequest } from 'src/authentication/authenticated-request';
import { CashAdvanceHrAction } from './dto/cash-advance-hr-action.dto';
import { CashAdvanceFinanceAction } from './dto/cash-advance-finance-action.dto';
import { CashAdvanceAuthorizationService } from './cash-advance.authorization.service';
import { InstallmentPaidDto } from './dto/installment-paid.dto';
export declare class CashAdvanceController {
    private readonly cashAdvanceService;
    private readonly cashAdvanceAuthorizationService;
    constructor(cashAdvanceService: CashAdvanceService, cashAdvanceAuthorizationService: CashAdvanceAuthorizationService);
    create(createDto: CreateCashAdvanceDto, files: Array<Express.Multer.File>, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findAll(filters: CashAdvanceRequestFiltersDto, req: AuthenticatedRequest, pagination: Pagination): Promise<ResponseSuccess | ResponseError>;
    readOwnRequest(filters: CashAdvanceRequestFiltersDto, req: AuthenticatedRequest, pagination: Pagination): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    withdraw(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    markAsPaid(installmentPaidDto: InstallmentPaidDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    hrAction(params: ParamsDto, CashAdvanceHrAction: CashAdvanceHrAction, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    financeAction(params: ParamsDto, action: CashAdvanceFinanceAction, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
}
