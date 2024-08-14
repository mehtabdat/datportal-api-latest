/// <reference types="multer" />
import { BlogsCategoryService } from './blogs-category.service';
import { CreateBlogCategoryDto } from './dto/create-category-blog.dto';
import { UpdateBlogCategoryDto } from './dto/update-category-blog.dto';
import { ResponseError, ResponseSuccess, SEOData } from 'src/common-types/common-types';
import { BlogsDetail, ParamsDto } from './dto/params.dto';
import { AuthenticatedRequest } from 'src/authentication/authenticated-request';
import { BlogsCategoryFiltersDto, BlogsCategoryPublicFiltersDto } from './dto/blogs-category-filter.dto';
import { BlogsCategoryPaginationDto } from './dto/blogs-category-pagination.dto';
import { BlogsCategorySortingDto } from './dto/blogs-category-sorting.dto';
import { AuthorizationService } from 'src/authorization/authorization.service';
import { BlogCategoryStatusDto } from './dto/blog-category-status.dto';
import { SystemLogger } from '../system-logs/system-logger.service';
import { PublishUnpublish } from './dto/blog-category-publish-unpublish.dto';
export declare class BlogsCategoryController {
    private readonly blogsCategoryService;
    private readonly authorizationService;
    private readonly systemLogger;
    constructor(blogsCategoryService: BlogsCategoryService, authorizationService: AuthorizationService, systemLogger: SystemLogger);
    create(createBlogCategoryDto: CreateBlogCategoryDto, file: Express.Multer.File, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findAll(req: AuthenticatedRequest, filters: BlogsCategoryFiltersDto, pagination: BlogsCategoryPaginationDto, sorting: BlogsCategorySortingDto): Promise<ResponseSuccess | ResponseError>;
    findPublished(filters: BlogsCategoryPublicFiltersDto, pagination: BlogsCategoryPaginationDto, sorting: BlogsCategorySortingDto, req: any): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
    findOneBySlug(params: BlogsDetail, pagination: BlogsCategoryPaginationDto, req: any): Promise<ResponseSuccess | ResponseError>;
    update(params: ParamsDto, updateBlogCategoryDto: UpdateBlogCategoryDto, file: Express.Multer.File, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    remove(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    updateBlogStatus(params: ParamsDto, blogCategoryStatusDto: BlogCategoryStatusDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    verifyAndPublish(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    updateSEO(params: ParamsDto, seoData: SEOData, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    publishUnpublishBlogCategory(params: ParamsDto, req: AuthenticatedRequest, publishUnpublish: PublishUnpublish): Promise<ResponseSuccess | ResponseError>;
}
