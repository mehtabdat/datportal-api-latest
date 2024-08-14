import { DashboardElementsService } from './dashboard-elements.service';
import { CreateDashboardElementDto } from './dto/create-dashboard-element.dto';
import { UpdateDashboardElementDto } from './dto/update-dashboard-element.dto';
import { ParamsDto, ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { DashboardElementFilters } from './dto/dashboard-element-filters.dto';
import { AuthenticatedRequest } from 'src/authentication/authenticated-request';
import { DashboardAuthorizationService } from './dashboard-elements.authorization.service';
export declare class DashboardElementsController {
    private readonly dashboardElementsService;
    private readonly authorizationService;
    private readonly logger;
    constructor(dashboardElementsService: DashboardElementsService, authorizationService: DashboardAuthorizationService);
    create(createDto: CreateDashboardElementDto): Promise<ResponseSuccess | ResponseError>;
    findPublished(filters: DashboardElementFilters): Promise<ResponseSuccess | ResponseError>;
    getDashboardContent(req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findAll(filters: DashboardElementFilters): Promise<ResponseSuccess | ResponseError>;
    update(params: ParamsDto, updateDto: UpdateDashboardElementDto): Promise<ResponseSuccess | ResponseError>;
    remove(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
}
