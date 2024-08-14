import { WorkingHoursService } from './working-hours.service';
import { CreateWorkingHourDto } from './dto/create-working-hour.dto';
import { UpdateWorkingHourDto } from './dto/update-working-hour.dto';
import { ParamsDto, ResponseError, ResponseSuccess } from 'src/common-types/common-types';
export declare class WorkingHoursController {
    private readonly workingHoursService;
    constructor(workingHoursService: WorkingHoursService);
    create(createDto: CreateWorkingHourDto): Promise<ResponseSuccess | ResponseError>;
    findAll(): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
    update(params: ParamsDto, updateDto: UpdateWorkingHourDto): Promise<ResponseSuccess | ResponseError>;
    remove(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
}
