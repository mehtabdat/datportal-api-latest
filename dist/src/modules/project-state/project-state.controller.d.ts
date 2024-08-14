import { ProjectStateService } from './project-state.service';
import { CreateProjectStateDto } from './dto/create-project-state.dto';
import { UpdateProjectStateDto } from './dto/update-project-state.dto';
import { FindBySlugDto, Pagination, ParamsDto, ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { ProjectStateFiltersDto } from './dto/project-state-filters.dto';
export declare class ProjectStateController {
    private readonly projectStateService;
    constructor(projectStateService: ProjectStateService);
    create(createDto: CreateProjectStateDto): Promise<ResponseSuccess | ResponseError>;
    findPublished(filters: ProjectStateFiltersDto, pagination: Pagination): Promise<ResponseSuccess | ResponseError>;
    findPublishedStates(filters: ProjectStateFiltersDto): Promise<ResponseSuccess | ResponseError>;
    findBySlug(findBySlugDto: FindBySlugDto): Promise<ResponseSuccess | ResponseError>;
    findAll(filters: ProjectStateFiltersDto, pagination: Pagination): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
    update(params: ParamsDto, updateDto: UpdateProjectStateDto): Promise<ResponseSuccess | ResponseError>;
    remove(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
}
