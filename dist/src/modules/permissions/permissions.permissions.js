"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissionSets = exports.PermissionsPermissionSet = void 0;
const country_permissions_1 = require("../country/country.permissions");
const role_permissions_1 = require("../role/role.permissions");
const system_modules_permissions_1 = require("../system-modules/system-modules.permissions");
const user_permissions_1 = require("../user/user.permissions");
const organization_permissions_1 = require("../organization/organization.permissions");
const sms_permissions_1 = require("../sms/sms.permissions");
const blogs_permissions_1 = require("../blogs/blogs-permissions");
const payment_gateway_permissions_1 = require("../payment-gateway/payment-gateway.permissions");
const saved_searches_permissions_1 = require("../saved-searches/saved-searches.permissions");
const static_page_seo_permissions_1 = require("../static-page-seo/static-page-seo.permissions");
const site_pages_permissions_1 = require("../site-pages/site-pages.permissions");
const site_pages_section_permissions_1 = require("../site-pages-section/site-pages-section.permissions");
const site_pages_content_permissions_1 = require("../site-pages-content/site-pages-content.permissions");
const transactions_permissions_1 = require("../transactions/transactions.permissions");
const alerts_type_permissions_1 = require("../alerts-type/alerts-type.permissions");
const blogs_category_permissions_1 = require("../blogs-category/blogs-category.permissions");
const faqs_category_permissions_1 = require("../faqs-category/faqs-category.permissions");
const faqs_permissions_1 = require("../faqs/faqs.permissions");
const leads_permissions_1 = require("../leads/leads.permissions");
const project_permissions_1 = require("../project/project.permissions");
const task_permissions_1 = require("../task/task.permissions");
const authorities_permissions_1 = require("../authorities/authorities.permissions");
const project_state_permissions_1 = require("../project-state/project-state.permissions");
const project_type_permissions_1 = require("../project-type/project-type.permissions");
const department_permissions_1 = require("../department/department.permissions");
const diary_permissions_1 = require("../diary/diary.permissions");
const project_component_permissions_1 = require("../project-components/project-component.permissions");
const enquiry_permissions_1 = require("../enquiry/enquiry.permissions");
const reimbursement_permissions_1 = require("../reimbursement/reimbursement.permissions");
const leave_request_permissions_1 = require("../leave-request/leave-request.permissions");
const cash_advance_permissions_1 = require("../cash-advance/cash-advance.permissions");
const quotation_permissions_1 = require("../quotation/quotation.permissions");
const invoice_permissions_1 = require("../invoice/invoice.permissions");
const client_permissions_1 = require("../client/client.permissions");
const company_asset_permissions_1 = require("../company-asset/company-asset.permissions");
const biometrics_permissions_1 = require("../biometrics/biometrics.permissions");
const biometrics_job_permissions_1 = require("../biometrics-job/biometrics-job.permissions");
const bulk_upload_format_permissions_1 = require("../bulk-upload-format/bulk-upload-format.permissions");
const feedback_permissions_1 = require("../feedback/feedback.permissions");
const system_logs_permissions_1 = require("../system-logs/system-logs.permissions");
const car_reservation_request_permissions_1 = require("../car-reservation/car-reservation-request.permissions");
const attendance_permissions_1 = require("../attendance/attendance.permissions");
const mail_permissions_1 = require("../../mail/mail.permissions");
const notification_permissions_1 = require("../notification/notification.permissions");
const dashboard_elements_permissions_1 = require("../dashboard-elements/dashboard-elements.permissions");
const permits_permissions_1 = require("../permits/permits.permissions");
const leave_type_permissions_1 = require("../leave-type/leave-type.permissions");
const payroll_permissions_1 = require("../payroll/payroll.permissions");
const payroll_cycle_permissions_1 = require("../payroll-cycle/payroll-cycle.permissions");
const xero_accounting_pwemissions_1 = require("../xero-accounting/xero-accounting.pwemissions");
const account_permissions_1 = require("../account/account.permissions");
const product_permissions_1 = require("../product/product.permissions");
const tax_rate_permissions_1 = require("../tax-rate/tax-rate.permissions");
const branding_theme_permissions_1 = require("../branding-theme/branding-theme.permissions");
const working_hours_permissions_1 = require("../working-hours/working-hours.permissions");
var PermissionsPermissionSet;
(function (PermissionsPermissionSet) {
    PermissionsPermissionSet["CREATE"] = "createPermissions";
    PermissionsPermissionSet["UPDATE"] = "updatePermissions";
    PermissionsPermissionSet["DELETE"] = "deletePermissions";
    PermissionsPermissionSet["READ"] = "readPermissions";
    PermissionsPermissionSet["GRANT"] = "grantPrivilegesToRole";
    PermissionsPermissionSet["REVOKE"] = "revokePrivilegesFromRole";
    PermissionsPermissionSet["READ_ROLE_PERMISSIONS"] = "readRolePermissions";
    PermissionsPermissionSet["VIEW_PERMISSIONS_LIST"] = "viewPermissonsList";
})(PermissionsPermissionSet = exports.PermissionsPermissionSet || (exports.PermissionsPermissionSet = {}));
exports.permissionSets = {
    "role": role_permissions_1.RolePermissionSet,
    "user": user_permissions_1.UserPermissionSet,
    "country": country_permissions_1.CountryPermissionSet,
    "systemModules": system_modules_permissions_1.SystemModulesPermissionSet,
    "organization": organization_permissions_1.OrganizationPermissionSet,
    "permissions": PermissionsPermissionSet,
    "sms": sms_permissions_1.SMSPermissionSet,
    "blogs": blogs_permissions_1.BlogsPermissionSet,
    "paymentGateway": payment_gateway_permissions_1.PaymentGatewayPermissionSet,
    "savedSearches": saved_searches_permissions_1.SavedSearchesPermissionSet,
    "staticPageSeo": static_page_seo_permissions_1.StaticPageSEOPermissionSet,
    "sitePages": site_pages_permissions_1.SitePagesPermissionSet,
    "sitePagesSection": site_pages_section_permissions_1.SitePagesSectionPermissionSet,
    "sitePagesContent": site_pages_content_permissions_1.SitePagesContentPermissionSet,
    "transaction": transactions_permissions_1.TransactionPermissionSet,
    "alertsType": alerts_type_permissions_1.AlertsTypePermissionSet,
    "blogsCategory": blogs_category_permissions_1.BlogsCategoryPermissionSet,
    "faqsCategory": faqs_category_permissions_1.FaqsCategoryPermissionSet,
    "faqs": faqs_permissions_1.FaqsPermissionSet,
    "leads": leads_permissions_1.LeadsPermissionSet,
    "enquiry": enquiry_permissions_1.EnquiryPermissionSet,
    "project": project_permissions_1.ProjectPermissionSet,
    "task": task_permissions_1.TaskPermissionSet,
    "authority": authorities_permissions_1.AuthoritiesPermissionSet,
    "department": department_permissions_1.DepartmentPermissionSet,
    "projectState": project_state_permissions_1.ProjectStatePermissionSet,
    "projectType": project_type_permissions_1.ProjectTypePermissionSet,
    "diary": diary_permissions_1.DairyPermissionSet,
    "projectComponent": project_component_permissions_1.ProjectComponentPermissionSet,
    "reimbursement": reimbursement_permissions_1.ReimbursementPermissionSet,
    "leaveRequest": leave_request_permissions_1.LeaveRequestPermissionSet,
    "cashAdvanceRequest": cash_advance_permissions_1.CashAdvancePermissionSet,
    "quotation": quotation_permissions_1.QuotationPermissionSet,
    "invoice": invoice_permissions_1.InvoicePermissionSet,
    "client": client_permissions_1.ClientPermissionSet,
    "companyAsset": company_asset_permissions_1.CompanyAssetPermissionSet,
    "biometrics": biometrics_permissions_1.BiometricsPermissionSet,
    "biometricsBulkUpload": biometrics_job_permissions_1.BiometricsJobPermissionSet,
    "bulkUploadFormat": bulk_upload_format_permissions_1.BulkUploadFormatPermissionSet,
    "feedback": feedback_permissions_1.FeedbackPermissionSet,
    "systemLogs": system_logs_permissions_1.SystemLogsPermissionSet,
    "carReservation": car_reservation_request_permissions_1.CarReservationRequestPermissionSet,
    "attendance": attendance_permissions_1.AttendancePermissionSet,
    "email": mail_permissions_1.MailPermissionSet,
    "announcement": notification_permissions_1.NotificationPermissionSet,
    "dashboardElement": dashboard_elements_permissions_1.DashboardElementPermissionSet,
    "permit": permits_permissions_1.PermitPermissionSet,
    "leave-type": leave_type_permissions_1.LeaveTypePermissionSet,
    "payroll": payroll_permissions_1.PayrollPermissionSet,
    "payrollCycle": payroll_cycle_permissions_1.PayrollCyclePermissionSet,
    "xeroAccounting": xero_accounting_pwemissions_1.XeroAccountingPermissionSet,
    "account": account_permissions_1.AccountPermissionSet,
    "product": product_permissions_1.ProductPermissionSet,
    "taxRate": tax_rate_permissions_1.TaxRatePermissionSet,
    "brandingTheme": branding_theme_permissions_1.BrandingThemePermissionSet,
    "workingHour": working_hours_permissions_1.WorkingHourPermissionSet
};
//# sourceMappingURL=permissions.permissions.js.map