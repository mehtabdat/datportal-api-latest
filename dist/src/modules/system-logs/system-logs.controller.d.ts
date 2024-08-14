import { SystemLogsService } from './system-logs.service';
import { SystemLogsFiltersDto } from './dto/system-logs-filters.dto';
import { SystemLogsPaginationDto } from './dto/system-logs-pagination.dto';
import { SystemLogsSortingDto } from './dto/system-logs-sorting.dto';
import { ResponseError, ResponseSuccess } from 'src/common-types/common-types';
export declare class SystemLogsController {
    private readonly systemLogsService;
    constructor(systemLogsService: SystemLogsService);
    readSystemLogs(filters: SystemLogsFiltersDto, pagination: SystemLogsPaginationDto, sorting: SystemLogsSortingDto): Promise<ResponseSuccess | ResponseError>;
}
