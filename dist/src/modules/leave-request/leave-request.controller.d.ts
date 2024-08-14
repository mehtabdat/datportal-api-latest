/// <reference types="multer" />
import { LeaveRequestService } from './leave-request.service';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { Pagination, ParamsDto, ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { LeaveRequestFiltersDto } from './dto/leave-request-filters.dto';
import { AuthenticatedRequest } from 'src/authentication/authenticated-request';
import { LeaveRequestAdminAction } from './dto/leave-request-admin-action.dto';
import { LeaveRequestAuthorizationService } from './leave-request.authorization.service';
import { LeaveRequestInfoDto } from './dto/get-leave-request-info.dto';
export declare class LeaveRequestController {
    private readonly leaveRequestService;
    private readonly leaveRequestAuthorizationService;
    constructor(leaveRequestService: LeaveRequestService, leaveRequestAuthorizationService: LeaveRequestAuthorizationService);
    create(createDto: CreateLeaveRequestDto, files: Array<Express.Multer.File>, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findAll(filters: LeaveRequestFiltersDto, req: AuthenticatedRequest, pagination: Pagination): Promise<ResponseSuccess | ResponseError>;
    readOwnRequest(filters: LeaveRequestFiltersDto, req: AuthenticatedRequest, pagination: Pagination): Promise<ResponseSuccess | ResponseError>;
    getLeaveInfo(params: LeaveRequestInfoDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findLeavesReport(req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findLeavesReportOfUser(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    withdraw(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    submitRequest(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    hrAction(params: ParamsDto, LeaveRequestAdminAction: LeaveRequestAdminAction, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    projectManagerAction(params: ParamsDto, action: LeaveRequestAdminAction, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
}
