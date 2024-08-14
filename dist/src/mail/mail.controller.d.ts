import { ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { MailLogsFiltersDto } from './dto/mail-logs-filters.dto';
import { MailLogsPaginationDto } from './dto/mail-logs-pagination.dto';
import { MailLogsSortingDto } from './dto/mail-logs-sorting.dto';
import { MailService } from './mail.service';
export declare class MailController {
    private readonly mailService;
    constructor(mailService: MailService);
    readMailSentLogs(filters: MailLogsFiltersDto, pagination: MailLogsPaginationDto, sorting: MailLogsSortingDto): Promise<ResponseSuccess | ResponseError>;
}
