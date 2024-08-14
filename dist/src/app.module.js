"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./authentication/auth.module");
const authorization_module_1 = require("./authorization/authorization.module");
const blogs_category_module_1 = require("./modules/blogs-category/blogs-category.module");
const blogs_module_1 = require("./modules/blogs/blogs.module");
const country_module_1 = require("./modules/country/country.module");
const faqs_category_module_1 = require("./modules/faqs-category/faqs-category.module");
const faqs_module_1 = require("./modules/faqs/faqs.module");
const organization_module_1 = require("./modules/organization/organization.module");
const role_module_1 = require("./modules/role/role.module");
const site_pages_content_module_1 = require("./modules/site-pages-content/site-pages-content.module");
const site_pages_section_module_1 = require("./modules/site-pages-section/site-pages-section.module");
const site_pages_module_1 = require("./modules/site-pages/site-pages.module");
const static_page_seo_module_1 = require("./modules/static-page-seo/static-page-seo.module");
const system_logs_module_1 = require("./modules/system-logs/system-logs.module");
const user_module_1 = require("./modules/user/user.module");
const prisma_module_1 = require("./prisma.module");
const authorities_module_1 = require("./modules/authorities/authorities.module");
const department_module_1 = require("./modules/department/department.module");
const project_module_1 = require("./modules/project/project.module");
const project_state_module_1 = require("./modules/project-state/project-state.module");
const project_type_module_1 = require("./modules/project-type/project-type.module");
const system_modules_module_1 = require("./modules/system-modules/system-modules.module");
const permissions_module_1 = require("./modules/permissions/permissions.module");
const resources_module_1 = require("./modules/resources/resources.module");
const diary_module_1 = require("./modules/diary/diary.module");
const task_module_1 = require("./modules/task/task.module");
const project_components_module_1 = require("./modules/project-components/project-components.module");
const notification_module_1 = require("./modules/notification/notification.module");
const enquiry_module_1 = require("./modules/enquiry/enquiry.module");
const reimbursement_module_1 = require("./modules/reimbursement/reimbursement.module");
const cash_advance_module_1 = require("./modules/cash-advance/cash-advance.module");
const leads_module_1 = require("./modules/leads/leads.module");
const quotation_module_1 = require("./modules/quotation/quotation.module");
const leave_request_module_1 = require("./modules/leave-request/leave-request.module");
const car_reservation_request_module_1 = require("./modules/car-reservation/car-reservation-request.module");
const company_asset_module_1 = require("./modules/company-asset/company-asset.module");
const client_module_1 = require("./modules/client/client.module");
const invoice_module_1 = require("./modules/invoice/invoice.module");
const biometrics_module_1 = require("./modules/biometrics/biometrics.module");
const biometrics_job_module_1 = require("./modules/biometrics-job/biometrics-job.module");
const constants_1 = require("./config/constants");
const event_emitter_1 = require("@nestjs/event-emitter");
const bull_1 = require("@nestjs/bull");
const bulk_upload_format_module_1 = require("./modules/bulk-upload-format/bulk-upload-format.module");
const file_convertor_module_1 = require("./modules/file-convertor/file-convertor.module");
const feedback_module_1 = require("./modules/feedback/feedback.module");
const attendance_module_1 = require("./modules/attendance/attendance.module");
const public_holiday_module_1 = require("./modules/public-holiday/public-holiday.module");
const alerts_type_module_1 = require("./modules/alerts-type/alerts-type.module");
const user_alerts_setting_module_1 = require("./modules/user-alerts-setting/user-alerts-setting.module");
const leave_type_module_1 = require("./modules/leave-type/leave-type.module");
const dashboard_elements_module_1 = require("./modules/dashboard-elements/dashboard-elements.module");
const permits_module_1 = require("./modules/permits/permits.module");
const chat_module_1 = require("./modules/chat/chat.module");
const transactions_module_1 = require("./modules/transactions/transactions.module");
const xero_accounting_module_1 = require("./modules/xero-accounting/xero-accounting.module");
const payroll_cycle_module_1 = require("./modules/payroll-cycle/payroll-cycle.module");
const payroll_module_1 = require("./modules/payroll/payroll.module");
const schedule_1 = require("@nestjs/schedule");
const redis_service_1 = require("./modules/redis/redis.service");
const leave_credit_module_1 = require("./modules/leave-credit/leave-credit.module");
const account_module_1 = require("./modules/account/account.module");
const product_module_1 = require("./modules/product/product.module");
const tax_rate_module_1 = require("./modules/tax-rate/tax-rate.module");
const branding_theme_module_1 = require("./modules/branding-theme/branding-theme.module");
const working_hours_module_1 = require("./modules/working-hours/working-hours.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            bull_1.BullModule.forRoot(constants_1.REDIS_DB_NAME, {
                redis: {
                    host: 'localhost',
                    port: 6379,
                    password: "ASD67adkjad76788ASD",
                    db: Number(process.env.REDIS_DB)
                },
            }),
            event_emitter_1.EventEmitterModule.forRoot(),
            schedule_1.ScheduleModule.forRoot(),
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            authorization_module_1.AuthorizationModule,
            system_logs_module_1.SystemLogsModule,
            organization_module_1.OrganizationModule,
            blogs_module_1.BlogsModule,
            blogs_category_module_1.BlogsCategoryModule,
            country_module_1.CountryModule,
            faqs_category_module_1.FaqsCategoryModule,
            faqs_module_1.FaqsModule,
            role_module_1.RoleModule,
            site_pages_module_1.SitePagesModule,
            site_pages_section_module_1.SitePagesSectionModule,
            site_pages_content_module_1.SitePagesContentModule,
            static_page_seo_module_1.StaticPageSeoModule,
            system_modules_module_1.SystemModulesModule,
            authorities_module_1.AuthoritiesModule,
            department_module_1.DepartmentModule,
            project_type_module_1.ProjectTypeModule,
            project_state_module_1.ProjectStateModule,
            project_module_1.ProjectModule,
            permissions_module_1.PermissionsModule,
            resources_module_1.ResourcesModule,
            diary_module_1.DiaryModule,
            task_module_1.TaskModule,
            project_components_module_1.ProjectComponentsModule,
            notification_module_1.NotificationModule,
            enquiry_module_1.EnquiryModule,
            leads_module_1.LeadsModule,
            reimbursement_module_1.ReimbursementModule,
            cash_advance_module_1.CashAdvanceModule,
            quotation_module_1.QuotationModule,
            leave_request_module_1.LeaveRequestModule,
            car_reservation_request_module_1.CarReservationModule,
            company_asset_module_1.CompanyAssetModule,
            client_module_1.ClientModule,
            invoice_module_1.InvoiceModule,
            biometrics_module_1.BiometricsModule,
            biometrics_job_module_1.BiometricsJobModule,
            bulk_upload_format_module_1.BulkUploadFormatModule,
            file_convertor_module_1.FileConvertorModule,
            feedback_module_1.FeedbackModule,
            attendance_module_1.AttendanceModule,
            public_holiday_module_1.PublicHolidayModule,
            alerts_type_module_1.AlertsTypeModule,
            user_alerts_setting_module_1.UserAlertsSettingModule,
            leave_type_module_1.LeaveTypeModule,
            dashboard_elements_module_1.DashboardElementsModule,
            permits_module_1.PermitsModule,
            chat_module_1.ChatModule,
            transactions_module_1.TransactionsModule,
            xero_accounting_module_1.XeroAccountingModule,
            payroll_cycle_module_1.PayrollCycleModule,
            payroll_module_1.PayrollModule,
            leave_credit_module_1.LeaveCreditModule,
            account_module_1.AccountModule,
            product_module_1.ProductModule,
            tax_rate_module_1.TaxRateModule,
            branding_theme_module_1.BrandingThemeModule,
            working_hours_module_1.WorkingHoursModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, redis_service_1.RedisService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map