import { ProjectComponentsService } from './project-components.service';
import { CreateProjectComponentDto } from './dto/create-project-component.dto';
import { UpdateProjectComponentDto } from './dto/update-project-component.dto';
import { FindBySlugDto, Pagination, ParamsDto, ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { ProjectComponentFiltersDto } from './dto/project-component-filters.dto';
export declare class ProjectComponentsController {
    private readonly projectComponentsService;
    constructor(projectComponentsService: ProjectComponentsService);
    create(createDto: CreateProjectComponentDto): Promise<ResponseSuccess | ResponseError>;
    findPublished(filters: ProjectComponentFiltersDto, pagination: Pagination): Promise<ResponseSuccess | ResponseError>;
    findBySlug(findBySlugDto: FindBySlugDto): Promise<ResponseSuccess | ResponseError>;
    findAll(filters: ProjectComponentFiltersDto, pagination: Pagination): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
    update(params: ParamsDto, updateDto: UpdateProjectComponentDto): Promise<ResponseSuccess | ResponseError>;
    remove(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
}
