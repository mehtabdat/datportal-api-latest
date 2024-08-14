import { PublicHolidayService } from './public-holiday.service';
import { CreatePublicHolidayDto } from './dto/create-public-holiday.dto';
import { UpdatePublicHolidayDto } from './dto/update-public-holiday.dto';
import { Pagination, ParamsDto, ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { PublicHolidayFilters } from './dto/public-holiday-filters.dto';
import { AuthenticatedRequest } from 'src/authentication/authenticated-request';
export declare class PublicHolidayController {
    private readonly publicHolidayService;
    constructor(publicHolidayService: PublicHolidayService);
    create(createDto: CreatePublicHolidayDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findAll(filters: PublicHolidayFilters, pagination: Pagination): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
    update(params: ParamsDto, updateDto: UpdatePublicHolidayDto): Promise<ResponseSuccess | ResponseError>;
    delete(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
}
