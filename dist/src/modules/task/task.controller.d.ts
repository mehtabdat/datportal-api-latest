/// <reference types="multer" />
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Pagination, ParamsDto, ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { TaskFilters } from './dto/task-filters.dto';
import { UpdateTaskOrderDto } from './dto/update-task-order.dto';
import { TaskSortingDto } from './dto/task-sorting.dto';
import { AuthenticatedRequest } from 'src/authentication/authenticated-request';
import { AuthorizationService } from 'src/authorization/authorization.service';
import { UploadTaskFiles } from './dto/upload-files.dto';
import { UpdateTaskMember } from './dto/update-task-member.dto';
import { RemoveTaskMember } from './dto/remove-task-member.dto';
export declare class TaskController {
    private readonly taskService;
    private readonly authorizationService;
    constructor(taskService: TaskService, authorizationService: AuthorizationService);
    uploadTaskFiles(uploadPropertyFiles: UploadTaskFiles, files: Array<Express.Multer.File>, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    create(createDto: CreateTaskDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findAll(filters: TaskFilters, sorting: TaskSortingDto, req: AuthenticatedRequest, pagination: Pagination): Promise<ResponseSuccess | ResponseError>;
    tehcSupport(filters: TaskFilters, sorting: TaskSortingDto, req: AuthenticatedRequest, pagination: Pagination): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    updateTaskOrder(params: ParamsDto, updateDto: UpdateTaskOrderDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    update(params: ParamsDto, updateDto: UpdateTaskDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    remove(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    removeFiles(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    updateProjectMembers(updateProjectMember: UpdateTaskMember, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    removeProjectMembers(params: RemoveTaskMember, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
}
