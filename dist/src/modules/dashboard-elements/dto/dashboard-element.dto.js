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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardElementsSet = exports.DashboardElementSlugs = exports.DashboardElementResponseArray = exports.DashboardElementResponseObject = void 0;
const swagger_1 = require("@nestjs/swagger");
const dashboard_element_entity_1 = require("../entities/dashboard-element.entity");
const project_permissions_1 = require("../../project/project.permissions");
const user_permissions_1 = require("../../user/user.permissions");
const quotation_permissions_1 = require("../../quotation/quotation.permissions");
const invoice_permissions_1 = require("../../invoice/invoice.permissions");
const enquiry_permissions_1 = require("../../enquiry/enquiry.permissions");
const leads_permissions_1 = require("../../leads/leads.permissions");
const permits_permissions_1 = require("../../permits/permits.permissions");
const transactions_permissions_1 = require("../../transactions/transactions.permissions");
class DashboardElementResponseObject {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DashboardElementResponseObject.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DashboardElementResponseObject.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", dashboard_element_entity_1.DashboardElement)
], DashboardElementResponseObject.prototype, "data", void 0);
exports.DashboardElementResponseObject = DashboardElementResponseObject;
class DashboardElementResponseArray {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DashboardElementResponseArray.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DashboardElementResponseArray.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true }),
    __metadata("design:type", dashboard_element_entity_1.DashboardElement)
], DashboardElementResponseArray.prototype, "data", void 0);
exports.DashboardElementResponseArray = DashboardElementResponseArray;
var DashboardElementSlugs;
(function (DashboardElementSlugs) {
    DashboardElementSlugs["delayed_projects"] = "delayed_projects";
    DashboardElementSlugs["active_projects"] = "active_projects";
    DashboardElementSlugs["all_tasks"] = "all_tasks";
    DashboardElementSlugs["pending_project_as_support_engineer"] = "pending_project_as_support_engineer";
    DashboardElementSlugs["pending_project_as_project_incharge"] = "pending_project_as_project_incharge";
    DashboardElementSlugs["new_project"] = "new_project";
    DashboardElementSlugs["ready_for_submission"] = "ready_for_submission";
    DashboardElementSlugs["approved_projects"] = "approved_projects";
    DashboardElementSlugs["close_out_projects"] = "close_out_projects";
    DashboardElementSlugs["active_employees"] = "active_employees";
    DashboardElementSlugs["on_hold_projects"] = "on_hold_projects";
    DashboardElementSlugs["closed_projects"] = "closed_projects";
    DashboardElementSlugs["notification"] = "notification";
    DashboardElementSlugs["active_quotations"] = "active_quotations";
    DashboardElementSlugs["pending_invoices"] = "pending_invoices";
    DashboardElementSlugs["active_enquiries"] = "active_enquiries";
    DashboardElementSlugs["active_leads"] = "active_leads";
    DashboardElementSlugs["active_reimbursement"] = "active_reimbursement";
    DashboardElementSlugs["active_leave_request"] = "active_leave_request";
    DashboardElementSlugs["active_cash_advance_request"] = "active_cash_advance_request";
    DashboardElementSlugs["permits_expiring"] = "permits_expiring";
    DashboardElementSlugs["government_fees_to_collect"] = "government_fees_to_collect";
})(DashboardElementSlugs = exports.DashboardElementSlugs || (exports.DashboardElementSlugs = {}));
exports.DashboardElementsSet = Object.freeze({
    "delayed_projects": project_permissions_1.ProjectPermissionSet.READ,
    "active_projects": project_permissions_1.ProjectPermissionSet.READ,
    "all_tasks": null,
    "pending_project_as_support_engineer": project_permissions_1.ProjectPermissionSet.READ,
    "pending_project_as_project_incharge": project_permissions_1.ProjectPermissionSet.READ,
    "new_project": project_permissions_1.ProjectPermissionSet.READ,
    "ready_for_submission": project_permissions_1.ProjectPermissionSet.READ,
    "approved_projects": project_permissions_1.ProjectPermissionSet.READ,
    "close_out_projects": project_permissions_1.ProjectPermissionSet.READ,
    "active_employees": user_permissions_1.UserPermissionSet.READ,
    "ready_for_submission_projects": project_permissions_1.ProjectPermissionSet.READ,
    "on_hold_projects": project_permissions_1.ProjectPermissionSet.READ,
    "closed_projects": project_permissions_1.ProjectPermissionSet.READ,
    "notification": null,
    "active_quotations": quotation_permissions_1.QuotationPermissionSet.READ,
    "pending_invoices": invoice_permissions_1.InvoicePermissionSet.READ,
    "active_enquiries": enquiry_permissions_1.EnquiryPermissionSet.READ,
    "active_leads": leads_permissions_1.LeadsPermissionSet.READ,
    "permits_expiring": permits_permissions_1.PermitPermissionSet.READ,
    "government_fees_to_collect": transactions_permissions_1.TransactionPermissionSet.READ,
    "active_reimbursement": null,
    "active_leave_request": null,
    "active_cash_advance_request": null
});
//# sourceMappingURL=dashboard-element.dto.js.map