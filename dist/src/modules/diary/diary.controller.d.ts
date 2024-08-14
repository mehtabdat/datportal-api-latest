import { DiaryService } from './diary.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { Pagination, ParamsDto, ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { DiaryFilters } from './dto/diary-filters.dto';
import { AuthenticatedRequest } from 'src/authentication/authenticated-request';
export declare class DiaryController {
    private readonly diaryService;
    constructor(diaryService: DiaryService);
    create(createDto: CreateDiaryDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findAll(filters: DiaryFilters, pagination: Pagination): Promise<ResponseSuccess | ResponseError>;
    findDiaryReport(filters: DiaryFilters, pagination: Pagination, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findDiaryReportOfUser(filters: DiaryFilters, pagination: Pagination, req: AuthenticatedRequest, params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
    update(params: ParamsDto, updateDto: UpdateDiaryDto): Promise<ResponseSuccess | ResponseError>;
    remove(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
}
