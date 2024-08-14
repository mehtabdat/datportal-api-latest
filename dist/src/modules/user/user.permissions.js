"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPermissionSet = void 0;
var UserPermissionSet;
(function (UserPermissionSet) {
    UserPermissionSet["CREATE"] = "createUser";
    UserPermissionSet["UPDATE"] = "updateUser";
    UserPermissionSet["DELETE"] = "deleteUser";
    UserPermissionSet["READ"] = "readUser";
    UserPermissionSet["READ_AUTH_TOKENS_ISSUED"] = "readAuthTokensIssued";
    UserPermissionSet["ADD_USER_ROLE"] = "addUserRole";
    UserPermissionSet["ADD_USER_COUNTRY"] = "addUserCountry";
    UserPermissionSet["MANAGE_ALL"] = "manageAllUser";
    UserPermissionSet["REMOVE_USER_COUNTRY"] = "removeUserCountry";
    UserPermissionSet["LOGIN_AS_OTHER_USER"] = "loginAsOtherUser";
})(UserPermissionSet = exports.UserPermissionSet || (exports.UserPermissionSet = {}));
//# sourceMappingURL=user.permissions.js.map