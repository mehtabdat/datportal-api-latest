"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskPermissionSet = void 0;
var TaskPermissionSet;
(function (TaskPermissionSet) {
    TaskPermissionSet["CREATE"] = "createTask";
    TaskPermissionSet["UPDATE"] = "updateTask";
    TaskPermissionSet["DELETE"] = "deleteTask";
    TaskPermissionSet["DELETE_FILE"] = "deleteTaskFiles";
    TaskPermissionSet["DELETE_OWN_FILE"] = "deleteTaskOwnFiles";
    TaskPermissionSet["READ"] = "readTask";
    TaskPermissionSet["UPDATE_ANY_TASK"] = "updateAnyTask";
    TaskPermissionSet["READ_ALL_TASK"] = "readAllTask";
    TaskPermissionSet["DELETE_ANY_TASK"] = "deleteAnyTask";
    TaskPermissionSet["TECH_SUPPORT"] = "manageTechSupportTask";
})(TaskPermissionSet = exports.TaskPermissionSet || (exports.TaskPermissionSet = {}));
//# sourceMappingURL=task.permissions.js.map