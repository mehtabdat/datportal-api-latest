import { SmsService } from './sms.service';
import { CreateSmDto } from './dto/create-sm.dto';
import { UpdateSmDto } from './dto/update-sm.dto';
import { ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { ParamsDto } from './dto/params.dto';
import { TestSMSDto } from './dto/test-sms.dto';
import { SMSLogsFiltersDto } from './dto/sms-logs-filters.dto';
import { SMSLogsPaginationDto } from './dto/sms-logs-pagination.dto';
import { SMSLogsSortingDto } from './dto/sms-logs-sorting.dto';
export declare class SmsController {
    private readonly smsService;
    constructor(smsService: SmsService);
    create(createSmDto: CreateSmDto): Promise<ResponseSuccess | ResponseError>;
    findAll(): Promise<ResponseSuccess | ResponseError>;
    update(params: ParamsDto, updateSmDto: UpdateSmDto): Promise<ResponseSuccess | ResponseError>;
    remove(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
    makeDefaultSMSGateway(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
    readSmsSentLogs(filters: SMSLogsFiltersDto, pagination: SMSLogsPaginationDto, sorting: SMSLogsSortingDto): Promise<ResponseSuccess | ResponseError>;
    testSMS(testSMSDto: TestSMSDto): Promise<ResponseSuccess | ResponseError>;
    countrySmsResponse(req: any): Promise<{
        message: string;
        statusCode: number;
        data: any;
    }>;
    findOne(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
}
