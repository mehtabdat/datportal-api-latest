import { ProjectTypeService } from './project-type.service';
import { CreateProjectTypeDto } from './dto/create-project-type.dto';
import { UpdateProjectTypeDto } from './dto/update-project-type.dto';
import { FindBySlugDto, Pagination, ParamsDto, ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { ProjectTypeFiltersDto } from './dto/project-type-filters.dto';
export declare class ProjectTypeController {
    private readonly projectTypeService;
    constructor(projectTypeService: ProjectTypeService);
    create(createDto: CreateProjectTypeDto): Promise<ResponseSuccess | ResponseError>;
    findPublished(filters: ProjectTypeFiltersDto, pagination: Pagination): Promise<ResponseSuccess | ResponseError>;
    findBySlug(findBySlugDto: FindBySlugDto): Promise<ResponseSuccess | ResponseError>;
    findAll(filters: ProjectTypeFiltersDto, pagination: Pagination): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
    update(params: ParamsDto, updateDto: UpdateProjectTypeDto): Promise<ResponseSuccess | ResponseError>;
    remove(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
}
