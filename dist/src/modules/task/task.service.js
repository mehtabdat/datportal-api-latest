"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var TaskService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma.service");
const common_2 = require("../../helpers/common");
const file_upload_utils_1 = require("../../helpers/file-upload.utils");
const constants_1 = require("../../config/constants");
let TaskService = TaskService_1 = class TaskService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(TaskService_1.name);
    }
    async create(createDto, user) {
        let { assignedTo } = createDto, rest = __rest(createDto, ["assignedTo"]);
        let recordData = rest;
        if (createDto.taskStartFrom) {
            recordData.taskStartFrom = new Date(createDto.taskStartFrom);
        }
        if (createDto.taskEndOn) {
            recordData.taskEndOn = new Date(createDto.taskEndOn);
        }
        if (recordData.type === constants_1.TaskType.techSupport) {
            assignedTo = [];
            let allTechSupportUsers = await this.prisma.user.findMany({ where: {
                    status: constants_1.UserStatus.active,
                    Department: {
                        slug: constants_1.Departments.techSupport
                    }
                },
                select: { id: true }
            });
            allTechSupportUsers.forEach((ele) => {
                assignedTo.push(ele.id);
            });
        }
        return this.prisma.task.create({
            data: Object.assign(Object.assign({}, recordData), { addedById: user.userId }),
        })
            .then(async (data) => {
            if (assignedTo && assignedTo.length > 0) {
                let dt = [];
                let uniqueUserIds = [];
                assignedTo.forEach((ele) => {
                    if (uniqueUserIds.includes(ele)) {
                        return;
                    }
                    else {
                        uniqueUserIds.push(ele);
                        dt.push({
                            userId: ele,
                            taskId: data.id
                        });
                    }
                });
                await this.prisma.taskMembers.createMany({
                    data: dt
                }).catch(err => {
                    this.logger.error("Error while adding task members");
                });
            }
            await this.prisma.task.update({
                where: {
                    id: data.id
                },
                data: {
                    order: data.id
                }
            });
            return data;
        })
            .catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    findAll(filters, pagination, sorting) {
        let skip = (pagination.perPage * (pagination.page - 1));
        let take = pagination.perPage;
        let __sorter = { [sorting.sortByField]: sorting.sortOrder };
        let records = this.prisma.task.findMany({
            where: filters,
            skip: skip,
            take: take,
            select: {
                id: true,
                uuid: true,
                title: true,
                addedDate: true,
                taskStartFrom: true,
                taskEndOn: true,
                priority: true,
                status: true,
                order: true,
                _count: {
                    select: {
                        Resources: {
                            where: {
                                isDeleted: false
                            }
                        }
                    }
                },
                AddedBy: {
                    select: {
                        firstName: true,
                        lastName: true,
                        id: true,
                        uuid: true,
                        profile: true,
                        email: true
                    }
                },
                ClosedBy: {
                    select: {
                        firstName: true,
                        lastName: true,
                        id: true,
                        uuid: true,
                        profile: true
                    }
                },
                TaskMembers: {
                    select: {
                        User: {
                            select: {
                                firstName: true,
                                lastName: true,
                                profile: true,
                                id: true,
                                uuid: true
                            }
                        }
                    }
                }
            },
            orderBy: __sorter
        });
        return records;
    }
    findOne(id) {
        return this.prisma.task.findUnique({
            where: {
                id: id
            },
            include: {
                Resources: {
                    where: {
                        isDeleted: false
                    },
                    select: {
                        file: true,
                        fileType: true,
                        path: true,
                        name: true,
                        id: true,
                        uuid: true,
                        addedDate: true
                    }
                },
                AddedBy: {
                    select: {
                        firstName: true,
                        lastName: true,
                        id: true,
                        uuid: true,
                        profile: true,
                        email: true
                    }
                },
                ClosedBy: {
                    select: {
                        firstName: true,
                        lastName: true,
                        id: true,
                        uuid: true,
                        profile: true
                    }
                },
                TaskMembers: {
                    select: {
                        User: {
                            select: {
                                firstName: true,
                                lastName: true,
                                profile: true,
                                id: true,
                                uuid: true,
                                email: true
                            }
                        }
                    }
                }
            },
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    update(id, updateDto) {
        let { assignedTo, type } = updateDto, rest = __rest(updateDto, ["assignedTo", "type"]);
        let recordData = rest;
        if (updateDto.taskStartFrom) {
            recordData.taskStartFrom = new Date(updateDto.taskStartFrom);
        }
        if (updateDto.taskEndOn) {
            recordData.taskEndOn = new Date(updateDto.taskEndOn);
        }
        return this.prisma.task.update({
            data: recordData,
            where: {
                id: id
            },
            include: {
                TaskMembers: true
            }
        })
            .then(async (data) => {
            if (assignedTo && assignedTo.length > 0) {
                let dt = [];
                let toDelete = [];
                let newUserIds = [];
                assignedTo.forEach((taskUser) => {
                    let isExisting = data.TaskMembers.find((ele) => ele.userId === taskUser);
                    if (!isExisting) {
                        newUserIds.push(taskUser);
                        dt.push({
                            userId: taskUser,
                            taskId: data.id
                        });
                    }
                });
                data.TaskMembers.forEach((ele) => {
                    if (!assignedTo.includes(ele.userId)) {
                        toDelete.push(ele.userId);
                    }
                });
                await this.prisma.taskMembers.createMany({
                    data: dt
                }).catch(err => {
                    this.logger.error("Error while adding task members");
                });
            }
            return data;
        })
            .catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    remove(id) {
        return this.prisma.task.update({
            data: {
                isDeleted: true
            },
            where: {
                id: id
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    removeTaskFile(id, user) {
        return this.prisma.fileManagement.update({
            data: {
                isDeleted: true,
                deletedById: user.userId,
                deletedDate: new Date()
            },
            where: {
                id: id
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    applyFilters(filters, user, hasGlobalPermission) {
        let condition = {
            isDeleted: false
        };
        if (hasGlobalPermission === false) {
            condition = Object.assign(Object.assign({}, condition), { OR: [
                    {
                        TaskMembers: {
                            some: {
                                userId: user.userId
                            }
                        }
                    },
                    {
                        addedById: user.userId
                    }
                ] });
        }
        if (Object.entries(filters).length > 0) {
            if (filters.status) {
                condition = Object.assign(Object.assign({}, condition), { status: filters.status });
            }
            if (filters.taskType) {
                condition = Object.assign(Object.assign({}, condition), { type: filters.taskType });
            }
            if (filters.type) {
                if (filters.type === 'assignedTask') {
                    if (filters.userIds) {
                        condition = Object.assign(Object.assign({}, condition), { addedById: user.userId, TaskMembers: {
                                some: {
                                    userId: {
                                        in: filters.userIds
                                    }
                                }
                            } });
                    }
                    else {
                        condition = Object.assign(Object.assign({}, condition), { addedById: user.userId });
                    }
                }
                else if (filters.type === 'myTask') {
                    condition = Object.assign(Object.assign({}, condition), { TaskMembers: {
                            some: {
                                userId: user.userId
                            }
                        } });
                }
            }
        }
        return condition;
    }
    countRecords(filters) {
        return this.prisma.task.count({
            where: filters
        });
    }
    async updateTaskOrder(id, updateDto) {
        let record = await this.prisma.task.findUnique({
            where: {
                id: id
            }
        });
        let currentOrderTask = await this.prisma.task.findFirst({
            where: {
                status: record.status
            },
            orderBy: {
                order: 'asc'
            },
            skip: updateDto.order
        });
        if (!currentOrderTask) {
            currentOrderTask = { order: 9999 };
        }
        let hasIncreasePosition = true;
        if (currentOrderTask.order > record.order) {
            hasIncreasePosition = false;
        }
        if (hasIncreasePosition) {
            await this.prisma.task.updateMany({
                where: {
                    status: record.status,
                    order: {
                        gte: currentOrderTask.order
                    },
                    NOT: {
                        id: id
                    }
                },
                data: {
                    order: {
                        increment: 1
                    }
                }
            });
            await this.prisma.task.update({
                where: {
                    id: id
                },
                data: {
                    order: currentOrderTask.order
                }
            });
        }
        else {
            await this.prisma.task.updateMany({
                where: {
                    status: record.status,
                    order: {
                        lte: currentOrderTask.order
                    },
                    NOT: {
                        id: id
                    }
                },
                data: {
                    order: {
                        decrement: 1
                    }
                }
            });
            await this.prisma.task.update({
                where: {
                    id: id
                },
                data: {
                    order: currentOrderTask.order
                }
            });
        }
    }
    async handleTaskFiles(uploadPropertyFiles, files, user) {
        let property = await this.prisma.task.findUnique({
            where: {
                id: uploadPropertyFiles.taskId
            }
        });
        if (!property) {
            throw new common_1.NotFoundException({ message: "Task with the provided taskId not Found", statusCode: 400 });
        }
        let insertedIds = [];
        let insertData = files.map((ele, index) => {
            let uuid = (0, common_2.generateUUID)();
            insertedIds.push(uuid);
            let newRecord = {
                uuid: uuid,
                documentType: "taskFiles",
                title: ele.originalname,
                name: ele.originalname,
                file: ele.filename,
                fileType: ele.mimetype,
                path: (0, file_upload_utils_1.extractRelativePathFromFullPath)(ele.path),
                isTemp: false,
                status: constants_1.FileStatus.Verified,
                addedById: user.userId,
                visibility: client_1.FileVisibility.organization,
                taskId: uploadPropertyFiles.taskId,
                fileSize: ele.size / 1024
            };
            return newRecord;
        });
        if (insertData.length > 0) {
            await this.prisma.fileManagement.createMany({
                data: insertData
            }).catch((err) => {
                this.logger.error("Error on " + this.constructor.name + "Custom Error code: ERR437 \n Error code : " + err.code + " \n Error message : " + err.message);
                let errorResponse = { message: err.message, statusCode: 404, data: {} };
                throw errorResponse;
            });
            return this.prisma.fileManagement.findMany({
                where: {
                    uuid: {
                        in: insertedIds
                    }
                },
                select: {
                    id: true,
                    uuid: true,
                    file: true,
                    name: true,
                    isTemp: true,
                    projectId: true,
                    path: true
                }
            }).catch((err) => {
                this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
                let errorResponse = { message: err.message, statusCode: 404, data: {} };
                throw errorResponse;
            });
        }
        else {
            return [];
        }
    }
    async updateTaskMember(updateProjectMember) {
        const { assignedTo } = updateProjectMember;
        let data = await this.prisma.task.findFirst({
            where: {
                id: updateProjectMember.taskId,
                isDeleted: false
            },
            include: {
                TaskMembers: true
            }
        });
        if (!data) {
            throw {
                message: "No Task Found, or this task might have been removed",
                statusCode: 404
            };
        }
        if (assignedTo && assignedTo.length > 0) {
            let dt = [];
            let newUserIds = [];
            assignedTo.forEach((taskUser) => {
                let isExisting = data.TaskMembers.find((ele) => ele.userId === taskUser);
                if (!isExisting) {
                    newUserIds.push(taskUser);
                    dt.push({
                        userId: taskUser,
                        taskId: data.id
                    });
                }
            });
            if (dt.length > 0) {
                await this.prisma.taskMembers.createMany({
                    data: dt
                }).catch(err => {
                    this.logger.error("Error while adding task members");
                });
                data = await this.prisma.task.findFirst({
                    where: {
                        id: updateProjectMember.taskId,
                        isDeleted: false
                    },
                    include: {
                        TaskMembers: true
                    }
                });
            }
        }
        return data;
    }
    removeTaskMember(removeTaskMember) {
        return this.prisma.taskMembers.deleteMany({
            where: {
                taskId: removeTaskMember.taskId,
                userId: removeTaskMember.userId
            }
        });
    }
};
TaskService = TaskService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TaskService);
exports.TaskService = TaskService;
//# sourceMappingURL=task.service.js.map