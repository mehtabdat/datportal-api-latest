import { PayrollService } from './payroll.service';
import { UpdatePayrollDto } from './dto/update-payroll.dto';
import { Pagination, ParamsDto, ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { PayrollFiltersDto } from './dto/payroll-filters.dto';
import { AuthenticatedRequest } from 'src/authentication/authenticated-request';
import { PaidPayrollsDto } from './dto/paid-payroll.dto';
import { PayrollAuthorizationService } from './payroll.authorization.service';
import { GeneratePayrollReport } from './dto/generate-report.dto';
export declare class PayrollController {
    private readonly payrollService;
    private readonly authorizationService;
    constructor(payrollService: PayrollService, authorizationService: PayrollAuthorizationService);
    findAll(filters: PayrollFiltersDto, pagination: Pagination, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    update(params: ParamsDto, updateDto: UpdatePayrollDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    markAsPaid(paidPayrollsDto: PaidPayrollsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    recalculate(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
    remove(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
    generateReport(reportDto: GeneratePayrollReport, res: any): Promise<void>;
}
