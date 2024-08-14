/// <reference types="multer" />
import { ReimbursementService } from './reimbursement.service';
import { CreateReimbursementDto } from './dto/create-reimbursement.dto';
import { Pagination, ParamsDto, ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { ReimbursementFiltersDto } from './dto/reimbursement-filters.dto';
import { AuthenticatedRequest } from 'src/authentication/authenticated-request';
import { ReimbursementHrAction } from './dto/reimbursement-hr-action.dto';
import { ReimbursementFinanceAction } from './dto/reimbursement-finance-action.dto';
import { ReimbursementAuthorizationService } from './reimbursement.authorization.service';
export declare class ReimbursementController {
    private readonly reimbursementService;
    private readonly reimbursementAuthorizationService;
    constructor(reimbursementService: ReimbursementService, reimbursementAuthorizationService: ReimbursementAuthorizationService);
    create(createDto: CreateReimbursementDto, files: Array<Express.Multer.File>, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findAll(filters: ReimbursementFiltersDto, req: AuthenticatedRequest, pagination: Pagination): Promise<ResponseSuccess | ResponseError>;
    readOwnRequest(filters: ReimbursementFiltersDto, req: AuthenticatedRequest, pagination: Pagination): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    withdraw(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    hrAction(params: ParamsDto, reimbursementHrAction: ReimbursementHrAction, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    financeAction(params: ParamsDto, reimbursementAction: ReimbursementFinanceAction, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    remove(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
}
