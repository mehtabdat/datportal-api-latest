import { FaqsCategoryService } from './faqs-category.service';
import { CreateFaqsCategoryDto } from './dto/create-faqs-category.dto';
import { UpdateFaqsCategoryDto } from './dto/update-faqs-category.dto';
import { ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { FindBySlugDto, ParamsDto } from './dto/params.dto';
import { FaqsCategoryFiltersDto } from './dto/faqs-category-filter.dto';
import { FaqsCategoryPaginationDto } from './dto/faqs-category-pagination.dto';
export declare class FaqsCategoryController {
    private readonly faqsCategoryService;
    constructor(faqsCategoryService: FaqsCategoryService);
    create(createFaqsCategoryDto: CreateFaqsCategoryDto): Promise<ResponseSuccess | ResponseError>;
    findPublished(): Promise<ResponseSuccess | ResponseError>;
    findBySlug(findBySlugDto: FindBySlugDto): Promise<ResponseSuccess | ResponseError>;
    findAll(filters: FaqsCategoryFiltersDto, pagination: FaqsCategoryPaginationDto): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
    update(params: ParamsDto, updateFaqsCategoryDto: UpdateFaqsCategoryDto): Promise<ResponseSuccess | ResponseError>;
    remove(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
}
