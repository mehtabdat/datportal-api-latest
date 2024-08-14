/// <reference types="multer" />
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { ResponseError, ResponseSuccess, SEOData } from 'src/common-types/common-types';
import { BlogsDetail, ParamsDto } from './dto/params.dto';
import { AuthenticatedRequest } from 'src/authentication/authenticated-request';
import { BlogsFiltersDto, BlogsPublicFiltersDto } from './dto/blogs-filter.dto';
import { BlogsPaginationDto } from './dto/blogs-pagination.dto';
import { BlogsSortingDto } from './dto/blogs-sorting.dto';
import { AuthorizationService } from 'src/authorization/authorization.service';
import { BlogStatusDto } from './dto/blog-status.dto';
import { SystemLogger } from '../system-logs/system-logger.service';
import { UploadBlogImage } from './dto/upload-image.dto';
export declare class BlogsController {
    private readonly blogsService;
    private readonly authorizationService;
    private readonly systemLogger;
    constructor(blogsService: BlogsService, authorizationService: AuthorizationService, systemLogger: SystemLogger);
    uploadBlogImages(uploadBlogImage: UploadBlogImage, files: Array<Express.Multer.File>, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    create(createBlogDto: CreateBlogDto, file: Express.Multer.File, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findAll(req: AuthenticatedRequest, filters: BlogsFiltersDto, pagination: BlogsPaginationDto, sorting: BlogsSortingDto): Promise<ResponseSuccess | ResponseError>;
    findPublished(filters: BlogsPublicFiltersDto, pagination: BlogsPaginationDto, sorting: BlogsSortingDto, req: any): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
    findOneBySlug(params: BlogsDetail): Promise<ResponseSuccess | ResponseError>;
    update(params: ParamsDto, updateBlogDto: UpdateBlogDto, file: Express.Multer.File, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    remove(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    updateBlogStatus(params: ParamsDto, blogStatusDto: BlogStatusDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    verifyAndPublish(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    updateSEO(params: ParamsDto, seoData: SEOData, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    removeImages(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    getBlogImages(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
}
