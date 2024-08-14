import { UserAlertsSettingService } from './user-alerts-setting.service';
import { CreateUserAlertsSettingDto } from './dto/create-user-alerts-setting.dto';
import { ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { FindBySlugDto, ParamsDto } from './dto/params.dto';
import { AuthenticatedRequest } from 'src/authentication/authenticated-request';
export declare class UserAlertsSettingController {
    private readonly UserAlertsSettingService;
    constructor(UserAlertsSettingService: UserAlertsSettingService);
    create(createPropertyTypeCategoryRelationDto: CreateUserAlertsSettingDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    unsubscribeAll(req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findOneBySlug(params: FindBySlugDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
}
