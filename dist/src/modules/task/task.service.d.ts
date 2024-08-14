/// <reference types="multer" />
import { Prisma } from '@prisma/client';
import { Pagination } from 'src/common-types/common-types';
import { PrismaService } from 'src/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskFilters } from './dto/task-filters.dto';
import { UpdateTaskOrderDto } from './dto/update-task-order.dto';
import { TaskSortingDto } from './dto/task-sorting.dto';
import { UploadTaskFiles } from './dto/upload-files.dto';
import { AuthenticatedUser } from 'src/authentication/jwt-payload';
import { UpdateTaskMember } from './dto/update-task-member.dto';
import { RemoveTaskMember } from './dto/remove-task-member.dto';
export declare class TaskService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(createDto: CreateTaskDto, user: AuthenticatedUser): Promise<{
        id: number;
        uuid: string;
        title: string;
        priority: number;
        instructions: string;
        taskStartFrom: Date;
        taskEndOn: Date;
        hasExtendedDate: boolean;
        extendedDate: Date;
        reasonOfExtension: string;
        addedById: number;
        closedById: number;
        status: number;
        addedDate: Date;
        isDeleted: boolean;
        order: number;
        projectId: number;
        type: number;
    }>;
    findAll(filters: Prisma.TaskWhereInput, pagination: Pagination, sorting: TaskSortingDto): Prisma.PrismaPromise<{
        id: number;
        status: number;
        addedDate: Date;
        _count: {
            Resources: number;
        };
        title: string;
        order: number;
        uuid: string;
        TaskMembers: {
            User: {
                id: number;
                uuid: string;
                firstName: string;
                lastName: string;
                profile: string;
            };
        }[];
        AddedBy: {
            id: number;
            email: string;
            uuid: string;
            firstName: string;
            lastName: string;
            profile: string;
        };
        priority: number;
        taskStartFrom: Date;
        taskEndOn: Date;
        ClosedBy: {
            id: number;
            uuid: string;
            firstName: string;
            lastName: string;
            profile: string;
        };
    }[]>;
    findOne(id: number): Promise<{
        TaskMembers: {
            User: {
                id: number;
                email: string;
                uuid: string;
                firstName: string;
                lastName: string;
                profile: string;
            };
        }[];
        AddedBy: {
            id: number;
            email: string;
            uuid: string;
            firstName: string;
            lastName: string;
            profile: string;
        };
        Resources: {
            id: number;
            name: string;
            addedDate: Date;
            uuid: string;
            file: string;
            path: string;
            fileType: string;
        }[];
        ClosedBy: {
            id: number;
            uuid: string;
            firstName: string;
            lastName: string;
            profile: string;
        };
    } & {
        id: number;
        uuid: string;
        title: string;
        priority: number;
        instructions: string;
        taskStartFrom: Date;
        taskEndOn: Date;
        hasExtendedDate: boolean;
        extendedDate: Date;
        reasonOfExtension: string;
        addedById: number;
        closedById: number;
        status: number;
        addedDate: Date;
        isDeleted: boolean;
        order: number;
        projectId: number;
        type: number;
    }>;
    update(id: number, updateDto: UpdateTaskDto): Promise<{
        TaskMembers: {
            id: number;
            userId: number;
            taskId: number;
        }[];
    } & {
        id: number;
        uuid: string;
        title: string;
        priority: number;
        instructions: string;
        taskStartFrom: Date;
        taskEndOn: Date;
        hasExtendedDate: boolean;
        extendedDate: Date;
        reasonOfExtension: string;
        addedById: number;
        closedById: number;
        status: number;
        addedDate: Date;
        isDeleted: boolean;
        order: number;
        projectId: number;
        type: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        uuid: string;
        title: string;
        priority: number;
        instructions: string;
        taskStartFrom: Date;
        taskEndOn: Date;
        hasExtendedDate: boolean;
        extendedDate: Date;
        reasonOfExtension: string;
        addedById: number;
        closedById: number;
        status: number;
        addedDate: Date;
        isDeleted: boolean;
        order: number;
        projectId: number;
        type: number;
    }>;
    removeTaskFile(id: number, user: AuthenticatedUser): Promise<{
        id: number;
        uuid: string;
        documentType: string;
        title: string;
        file: string;
        fileType: string;
        name: string;
        path: string;
        description: string;
        order: number;
        comments: string;
        visibility: import(".prisma/client").$Enums.FileVisibility;
        projectId: number;
        taskId: number;
        isTemp: boolean;
        status: number;
        isDeleted: boolean;
        isDefault: boolean;
        isProcessing: boolean;
        backgroundId: number;
        addedDate: Date;
        modifiedDate: Date;
        deletedDate: Date;
        addedById: number;
        deletedById: number;
        modifiedById: number;
        projectConversationId: number;
        permitId: number;
        fileSize: number;
    }>;
    applyFilters(filters: TaskFilters, user: AuthenticatedUser, hasGlobalPermission: boolean): Prisma.TaskWhereInput;
    countRecords(filters: Prisma.TaskWhereInput): Prisma.PrismaPromise<number>;
    updateTaskOrder(id: number, updateDto: UpdateTaskOrderDto): Promise<void>;
    handleTaskFiles(uploadPropertyFiles: UploadTaskFiles, files: Array<Express.Multer.File>, user: AuthenticatedUser): Promise<{
        id: number;
        name: string;
        uuid: string;
        file: string;
        path: string;
        projectId: number;
        isTemp: boolean;
    }[]>;
    updateTaskMember(updateProjectMember: UpdateTaskMember): Promise<{
        TaskMembers: {
            id: number;
            userId: number;
            taskId: number;
        }[];
    } & {
        id: number;
        uuid: string;
        title: string;
        priority: number;
        instructions: string;
        taskStartFrom: Date;
        taskEndOn: Date;
        hasExtendedDate: boolean;
        extendedDate: Date;
        reasonOfExtension: string;
        addedById: number;
        closedById: number;
        status: number;
        addedDate: Date;
        isDeleted: boolean;
        order: number;
        projectId: number;
        type: number;
    }>;
    removeTaskMember(removeTaskMember: RemoveTaskMember): Prisma.PrismaPromise<Prisma.BatchPayload>;
}
