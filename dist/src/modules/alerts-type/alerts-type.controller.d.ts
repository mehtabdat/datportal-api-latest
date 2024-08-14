import { AlertsTypeService } from './alerts-type.service';
import { CreateAlertsTypeDto } from './dto/create-alerts-type.dto';
import { UpdateAlertsTypeDto } from './dto/update-alerts-type.dto';
import { ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { FindBySlugDto, ParamsDto } from './dto/params.dto';
import { AuthenticatedRequest } from 'src/authentication/authenticated-request';
export declare class AlertsTypeController {
    private readonly alertsTypeService;
    constructor(alertsTypeService: AlertsTypeService);
    create(createAlertsTypeDto: CreateAlertsTypeDto): Promise<ResponseSuccess | ResponseError>;
    findPublished(req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findBySlug(findBySlugDto: FindBySlugDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findAll(): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
    update(params: ParamsDto, updateAlertsTypeDto: UpdateAlertsTypeDto): Promise<ResponseSuccess | ResponseError>;
    remove(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
}
