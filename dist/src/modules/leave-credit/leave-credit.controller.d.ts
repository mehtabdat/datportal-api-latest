import { LeaveCreditService } from './leave-credit.service';
import { CreateLeaveCreditDto } from './dto/create-leave-credit.dto';
import { UpdateLeaveCreditDto } from './dto/update-leave-credit.dto';
import { ParamsDto, ResponseError, ResponseSuccess } from 'src/common-types/common-types';
export declare class LeaveCreditController {
    private readonly leaveCreditService;
    constructor(leaveCreditService: LeaveCreditService);
    create(createDto: CreateLeaveCreditDto): Promise<ResponseSuccess | ResponseError>;
    update(params: ParamsDto, updateDto: UpdateLeaveCreditDto): Promise<ResponseSuccess | ResponseError>;
    remove(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
}
