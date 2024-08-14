/// <reference types="multer" />
import { FaqsService } from './faqs.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { FindBySlugDto, ParamsDto } from './dto/params.dto';
import { FaqsPaginationDto } from './dto/faqs-pagination.dto';
import { FaqsFiltersDto } from './dto/faqs-filter.dto';
import { UploadFaqImage } from './dto/upload-image.dto';
import { AuthenticatedRequest } from 'src/authentication/authenticated-request';
export declare class FaqsController {
    private readonly faqsService;
    constructor(faqsService: FaqsService);
    uploadFaqImages(uploadFaqImage: UploadFaqImage, files: Array<Express.Multer.File>, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    create(createFaqDto: CreateFaqDto): Promise<ResponseSuccess | ResponseError>;
    findPublished(filters: FaqsFiltersDto, pagination: FaqsPaginationDto): Promise<ResponseSuccess | ResponseError>;
    findBySlug(findBySlugDto: FindBySlugDto): Promise<ResponseSuccess | ResponseError>;
    findAll(filters: FaqsFiltersDto, pagination: FaqsPaginationDto): Promise<ResponseSuccess | ResponseError>;
    removeImages(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    getFaqsImages(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
    update(params: ParamsDto, updateFaqDto: UpdateFaqDto): Promise<ResponseSuccess | ResponseError>;
    remove(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
}
