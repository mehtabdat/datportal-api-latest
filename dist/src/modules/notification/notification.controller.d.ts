/// <reference types="multer" />
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { ParamsDto } from './dto/params.dto';
import { AuthenticatedRequest } from 'src/authentication/authenticated-request';
import { NotificationFilters } from './dto/notification-filters.dto';
import { NotificationPaginationDto } from './dto/notification-pagination.dto';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    create(createNotificationDto: CreateNotificationDto, file: Express.Multer.File): Promise<ResponseSuccess | ResponseError>;
    findAll(req: AuthenticatedRequest, filters: NotificationFilters, pagination: NotificationPaginationDto): Promise<ResponseSuccess | ResponseError>;
    findAllAnnouncements(req: AuthenticatedRequest, filters: NotificationFilters, pagination: NotificationPaginationDto): Promise<ResponseSuccess | ResponseError>;
    markAsReadAll(req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    markAsRead(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    remove(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
}
