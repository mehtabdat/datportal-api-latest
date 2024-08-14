/// <reference types="multer" />
import { SystemModulesService } from './system-modules.service';
import { CreateSystemModuleDto } from './dto/create-system-module.dto';
import { UpdateSystemModuleDto } from './dto/update-system-module.dto';
import { ParamsDto } from './dto/params.dto';
import { ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { SystemModuleFilters } from './dto/system-modules.filters';
import { AuthenticatedRequest } from 'src/authentication/authenticated-request';
export declare class SystemModulesController {
    private readonly systemModulesService;
    constructor(systemModulesService: SystemModulesService);
    create(createSystemModuleDto: CreateSystemModuleDto, icon: Express.Multer.File): Promise<ResponseSuccess | ResponseError>;
    findAll(filters: SystemModuleFilters, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    update(params: ParamsDto, updateSystemModuleDto: UpdateSystemModuleDto, icon: Express.Multer.File): Promise<ResponseSuccess | ResponseError>;
    remove(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
}
