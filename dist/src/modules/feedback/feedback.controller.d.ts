/// <reference types="multer" />
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { Pagination, ParamsDto, ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { FeedbackFiltersDto } from './dto/feedback-filters.dto';
import { AuthenticatedRequest } from 'src/authentication/authenticated-request';
import { FeedbackSortingDto } from './dto/feedback-sorting.dto';
export declare class FeedbackController {
    private readonly feedbackService;
    constructor(feedbackService: FeedbackService);
    create(createDto: CreateFeedbackDto, files: Array<Express.Multer.File>, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findAll(filters: FeedbackFiltersDto, sorting: FeedbackSortingDto, pagination: Pagination): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
}
