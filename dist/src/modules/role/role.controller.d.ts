import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { ParamsDto } from './dto/params.dto';
import { RoleFiltersDto } from './dto/role-filters.dto';
import { AuthenticatedRequest } from 'src/authentication/authenticated-request';
import { AuthorizationService } from 'src/authorization/authorization.service';
import { RoleDashboardElements } from './dto/role-dashboard-elements.dto';
export declare class RoleController {
    private readonly roleService;
    private readonly authorizationService;
    constructor(roleService: RoleService, authorizationService: AuthorizationService);
    create(createRoleDto: CreateRoleDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findAll(filters: RoleFiltersDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    addDashboardElement(params: ParamsDto, roleDashboardElements: RoleDashboardElements, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    removeDashboardElement(params: ParamsDto, roleDashboardElements: RoleDashboardElements, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
    update(params: ParamsDto, updateRoleDto: UpdateRoleDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    remove(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
}
