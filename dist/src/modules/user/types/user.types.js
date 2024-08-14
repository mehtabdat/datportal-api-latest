"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDocumentsTypes = exports.UserUpdatedEvent = exports.UserMetaKeys = void 0;
var UserMetaKeys;
(function (UserMetaKeys) {
    UserMetaKeys["dateOfBirth"] = "dateOfBirth";
    UserMetaKeys["nationality"] = "nationality";
    UserMetaKeys["religion"] = "religion";
    UserMetaKeys["maritalStatus"] = "maritalStatus";
    UserMetaKeys["gender"] = "gender";
    UserMetaKeys["personalNumber"] = "personalNumber";
    UserMetaKeys["personalEmail"] = "personalEmail";
    UserMetaKeys["currentProfession"] = "currentProfession";
    UserMetaKeys["passportNumber"] = "passportNumber";
    UserMetaKeys["passportExpiryDate"] = "passportExpiryDate";
    UserMetaKeys["emergencyContactName"] = "emergencyContactName";
    UserMetaKeys["emergencyContactRelationship"] = "emergencyContactRelationship";
    UserMetaKeys["emergencyContactAddress"] = "emergencyContactAddress";
    UserMetaKeys["emergencyContactNumber"] = "emergencyContactNumber";
    UserMetaKeys["labourCardNumber"] = "labourCardNumber";
})(UserMetaKeys = exports.UserMetaKeys || (exports.UserMetaKeys = {}));
class UserUpdatedEvent {
}
exports.UserUpdatedEvent = UserUpdatedEvent;
var UserDocumentsTypes;
(function (UserDocumentsTypes) {
    UserDocumentsTypes["emiratesId"] = "emiratesId";
    UserDocumentsTypes["passport"] = "passport";
    UserDocumentsTypes["visa"] = "visa";
    UserDocumentsTypes["education_certificate"] = "education_certificate";
    UserDocumentsTypes["offer_letter"] = "offer_letter";
    UserDocumentsTypes["resume"] = "resume";
    UserDocumentsTypes["other"] = "other";
})(UserDocumentsTypes = exports.UserDocumentsTypes || (exports.UserDocumentsTypes = {}));
//# sourceMappingURL=user.types.js.map