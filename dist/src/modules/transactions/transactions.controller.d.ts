/// <reference types="multer" />
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { ParamsDto } from './dto/params.dto';
import { AuthenticatedRequest } from 'src/authentication/authenticated-request';
import { TransactionFiltersDto } from './dto/transaction-filters.dto';
import { TransactionPaginationDto } from './dto/transaction-pagination.dto';
import { TransactionSortingDto } from './dto/transaction-sorting.dto';
import { AssignTransactionDto } from './dto/assign-transaction.dto';
import { SystemLogger } from '../system-logs/system-logger.service';
export declare class TransactionsController {
    private readonly transactionsService;
    private readonly systemLogger;
    constructor(transactionsService: TransactionsService, systemLogger: SystemLogger);
    create(createTransactionDto: CreateTransactionDto, receipt: Express.Multer.File, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findAll(req: AuthenticatedRequest, filters: TransactionFiltersDto, pagination: TransactionPaginationDto, sorting: TransactionSortingDto): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
    assignTransaction(params: ParamsDto, assignTransactionDto: AssignTransactionDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    update(params: ParamsDto, receipt: Express.Multer.File, updateTransactionDto: UpdateTransactionDto): Promise<ResponseSuccess | ResponseError>;
    remove(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
}
