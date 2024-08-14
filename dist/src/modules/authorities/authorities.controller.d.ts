import { AuthoritiesService } from './authorities.service';
import { CreateAuthorityDto } from './dto/create-authority.dto';
import { UpdateAuthorityDto } from './dto/update-authority.dto';
import { FindBySlugDto, Pagination, ParamsDto, ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { AuthorityFiltersDto } from './dto/authority-filters.dto';
export declare class AuthoritiesController {
    private readonly authoritiesService;
    constructor(authoritiesService: AuthoritiesService);
    create(createDto: CreateAuthorityDto): Promise<ResponseSuccess | ResponseError>;
    findPublished(filters: AuthorityFiltersDto, pagination: Pagination): Promise<ResponseSuccess | ResponseError>;
    findBySlug(findBySlugDto: FindBySlugDto): Promise<ResponseSuccess | ResponseError>;
    findAll(filters: AuthorityFiltersDto, pagination: Pagination): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
    update(params: ParamsDto, updateDto: UpdateAuthorityDto): Promise<ResponseSuccess | ResponseError>;
    remove(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
}
