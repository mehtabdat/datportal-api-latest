import { LeaveTypeService } from './leave-type.service';
import { CreateLeaveTypeDto } from './dto/create-leave-type.dto';
import { UpdateLeaveTypeDto } from './dto/update-leave-type.dto';
import { ParamsDto, ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { LeaveTypeFilters } from './dto/leave-type-filters.dto';
export declare class LeaveTypeController {
    private readonly leaveTypeService;
    constructor(leaveTypeService: LeaveTypeService);
    create(createDto: CreateLeaveTypeDto): Promise<ResponseSuccess | ResponseError>;
    findPublished(filters: LeaveTypeFilters): Promise<ResponseSuccess | ResponseError>;
    findAll(filters: LeaveTypeFilters): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
    update(params: ParamsDto, updateDto: UpdateLeaveTypeDto): Promise<ResponseSuccess | ResponseError>;
    remove(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
}
