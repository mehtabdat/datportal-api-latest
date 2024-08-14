"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectPermissionSet = void 0;
var ProjectPermissionSet;
(function (ProjectPermissionSet) {
    ProjectPermissionSet["CREATE"] = "createProject";
    ProjectPermissionSet["UPDATE"] = "updateProject";
    ProjectPermissionSet["UPDATE_PROJECT_MEMBERS"] = "modifyProjectMembers";
    ProjectPermissionSet["UPLOAD_PROJECT_FILES"] = "uploadProjectFiles";
    ProjectPermissionSet["DELETE_PROJECT_FILES"] = "deleteProjectFiles";
    ProjectPermissionSet["DELETE"] = "deleteProject";
    ProjectPermissionSet["READ"] = "readProject";
    ProjectPermissionSet["READ_PROJECT_REPORT"] = "readProjectReport";
    ProjectPermissionSet["REAL_ALL_PROJECT"] = "readAllProject";
    ProjectPermissionSet["UPDATE_ANY_PROJECT"] = "updateAnyProject";
    ProjectPermissionSet["DELETE_ANY_PROJECT"] = "deleteAnyProject";
    ProjectPermissionSet["HOLD_UNHOLD_PROJECT"] = "holdUnholdProject";
    ProjectPermissionSet["CHANGE_STATUS"] = "changeProjectStatus";
    ProjectPermissionSet["READ_FINANCE_REPORT"] = "readFinanceReport";
    ProjectPermissionSet["ADD_PROJECT_STATES"] = "addProjectStates";
})(ProjectPermissionSet = exports.ProjectPermissionSet || (exports.ProjectPermissionSet = {}));
//# sourceMappingURL=project.permissions.js.map