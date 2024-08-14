"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequiredDocumentsChecklist = exports.OrganizationStandardsForScoring = exports.OrganizationScoringPoints = exports.OrganizationScoringStandards = exports.OrganizationDocumentsTypes = void 0;
var OrganizationDocumentsTypes;
(function (OrganizationDocumentsTypes) {
    OrganizationDocumentsTypes["Emirates ID / password"] = "emirates_id_or_password";
    OrganizationDocumentsTypes["Trade Liscense"] = "trade_liscense";
    OrganizationDocumentsTypes["Supporting documents"] = "supporting_documents";
    OrganizationDocumentsTypes["other"] = "other";
})(OrganizationDocumentsTypes = exports.OrganizationDocumentsTypes || (exports.OrganizationDocumentsTypes = {}));
exports.OrganizationScoringStandards = {
    "phone": "phone",
    "email": "email",
    "description": "description",
    "officeRegistrationNumber": "officeRegistrationNumber"
};
exports.OrganizationScoringPoints = {
    "email": 10,
    "phone": 10,
    "description": 10,
    "officeRegistrationNumber": 10
};
exports.OrganizationStandardsForScoring = {
    "description": 300,
};
exports.RequiredDocumentsChecklist = ["trade_liscense"];
//# sourceMappingURL=organization.enum.js.map