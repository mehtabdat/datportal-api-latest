import { PayrollCycleService } from './payroll-cycle.service';
import { CreatePayrollCycleDto } from './dto/create-payroll-cycle.dto';
import { UpdatePayrollCycleDto } from './dto/update-payroll-cycle.dto';
import { Pagination, ParamsDto, ResponseError, ResponseSuccess } from 'src/common-types/common-types';
export declare class PayrollCycleController {
    private readonly payrollCycleService;
    constructor(payrollCycleService: PayrollCycleService);
    create(createDto: CreatePayrollCycleDto): Promise<ResponseSuccess | ResponseError>;
    findAll(pagination: Pagination): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
    update(params: ParamsDto, updateDto: UpdatePayrollCycleDto): Promise<ResponseSuccess | ResponseError>;
    remove(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
}
