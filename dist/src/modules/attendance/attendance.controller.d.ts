import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Pagination, ParamsDto, ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { AttendanceFilters } from './dto/attendance-filters.dto';
import { UserAttendanceFilters } from './dto/user-attendance-filters.dto';
import { AttendanceSortingDto } from './dto/attendance-sorting.dto';
import { AttendanceAuthorizationService } from './attendance.authorization.service';
import { AuthenticatedRequest } from 'src/authentication/authenticated-request';
import { GenerateAttendanceReport } from './dto/generate-report.dto';
export declare class AttendanceController {
    private readonly attendanceService;
    private readonly authorizationService;
    constructor(attendanceService: AttendanceService, authorizationService: AttendanceAuthorizationService);
    create(createDto: CreateAttendanceDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    triggerBulkAttendanceCalculation(): Promise<ResponseSuccess | ResponseError>;
    findAll(filters: AttendanceFilters, req: AuthenticatedRequest, pagination: Pagination): Promise<ResponseSuccess | ResponseError>;
    findUserAttendance(filters: UserAttendanceFilters, sorting: AttendanceSortingDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findUserAttendanceForPayroll(filters: AttendanceFilters, sorting: AttendanceSortingDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    generateReport(reportDto: GenerateAttendanceReport, res: any): Promise<void>;
    findOne(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    update(params: ParamsDto, updateDto: UpdateAttendanceDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    delete(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
}
