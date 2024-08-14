export declare const SUPER_ADMIN = "SUPER-ADMIN";
export declare const SYSTEM_USERS = "SYSTEM-USERS";
export declare const TEST_EMAIL = "yogen@yallahproperty.ae";
export declare const TEST_PHONE = "509826068";
export declare const defaultYallahEmail = "yogen@yallahproperty.ae";
export declare const REDIS_DB_NAME = "LIVE_DAT-Portal-Redis-DB";
export declare const defaultYallahAlternateEmail = "yogen.pokhrel@datconsultancy.com";
export declare const ImagesThresholdForBlogs = 15;
export declare const VAT_RATE = 5;
export declare const HOSTS: {
    serverDomain: string;
    activeFrontendDomains: string[];
    defaultFrontendDomain: string;
    defaultAdminDomain: string;
    country: {
        AE: string;
        IN: string;
    };
};
export declare enum USER_SIGNUP_SOURCE_TYPES {
    "google" = "google",
    "apple" = "apple",
    "email" = "email",
    "phone" = "phone",
    "organization" = "organization",
    "yallahAdmins" = "yallahAdmins",
    "organization_bulk_upload" = "organization_bulk_upload"
}
export declare enum DataFilterType {
    "equals" = "equals",
    "like" = "like",
    "greaterThan" = "gt",
    "greaterThanEquals" = "gte",
    "not" = "not",
    "in" = "in",
    "notIn" = "notIn"
}
export declare enum OrganizationStatus {
    "active" = 1,
    "suspended" = 2,
    "pending verification" = 3,
    "waiting for documents" = 4
}
export declare enum FileStatus {
    "Waiting for verification" = 1,
    "Additional documents required" = 2,
    "Rejected" = 3,
    "Verified" = 4
}
export declare enum UserStatus {
    "active" = 1,
    "suspended" = 2
}
export declare enum BlogsCategory {
    "Blog" = 1,
    "News" = 2
}
export declare enum BlogsStatus {
    "Not Published, Verification Required" = 1,
    "Modification Required" = 2,
    "Requested for Verification" = 3,
    "Verified & Published" = 4
}
export declare enum BlogsCategoryStatus {
    "Not Published, Verification Required" = 1,
    "Modification Required" = 2,
    "Requested for Verification" = 3,
    "Verified & Published" = 4
}
export declare enum LeadsStatus {
    "new" = 1,
    "in_progress" = 2,
    "unqualified" = 3,
    "confirmed" = 4,
    "canceled" = 5,
    "invalid_request" = 6,
    "spam" = 7
}
export declare enum ClientType {
    company = 1,
    individual = 2
}
export declare enum QuotationStatus {
    "created" = 1,
    "submitted" = 2,
    "confirmed" = 3,
    "rejected" = 4,
    "revised" = 5,
    "invoiced" = 6
}
export declare enum EnquirySource {
    "manual" = "manual",
    "whatsapp" = "whatsapp",
    "dubaiapprovals.com" = "dubaiapprovals.com",
    "abudhabiapprovals.com" = "abudhabiapprovals.com",
    "datconsultancy.com" = "datconsultancy.com",
    "luxedesign.ae" = "luxedesign.ae",
    "phone" = "phone",
    "email" = "email",
    "facebook" = "facebook",
    "tiktok" = "tiktok",
    "instagram" = "instagram",
    "facebook_reels" = "facebook_reels",
    "linkedIn" = "linkedIn",
    "twitter" = "twitter",
    "other" = "other"
}
export declare enum PagesStatus {
    "Not Published, Verification Required" = 1,
    "Modification Required" = 2,
    "Requested for Verification" = 3,
    "Verified & Published" = 4
}
export declare enum CountryStatus {
    "active" = 1,
    "InActive" = 2
}
type SystemLogsDynamicAction = string & {
    forCompiler?: string;
};
export type SystemLogsActionType = "CREATE" | "READ" | "UPDATE" | "DELETE" | "LOGIN" | SystemLogsDynamicAction;
export declare const ejsTemplateDefaults: {
    frontendDomain: string;
    facebookUrl: string;
    linkedInUrl: string;
    instagramUrl: string;
    unsubscribeUrl: string;
    emailTitle: string;
    hideFooter: boolean;
    notificationPreferences: string;
    companyAddress: string;
};
export declare const safeModeUser = "info@theproranker.com";
export declare const safeModeBackupKeys: string[];
export declare enum SubscriptionsType {
    "news_and_blogs" = "news_and_blogs"
}
export declare enum PropertyNotificationType {
    "new_alerts" = "new_alerts",
    "expired" = "expired",
    "insufficient_credits_to_recharge" = "insufficient_credits_to_recharge"
}
export declare enum AuthTokenStatus {
    active = 1,
    expired = 2,
    used = 3
}
export declare enum AlertsTypeSlug {
    "properties" = "properties",
    "propertyDocuments" = "propertyDocuments",
    "emailLeads" = "emailLeads"
}
export declare enum KnownSMSGateways {
    "SMS-ALA" = "SMS-ALA",
    "SMS-ALA-TEST" = "SMS-ALA-TEST",
    "SMS-COUNTRY" = "SMS-COUNTRY",
    "SMS-COUNTRY-TEST" = "SMS-COUNTRY-TEST"
}
export declare const TransactionStatus: Readonly<{
    sent_to_client: 1;
    pending_payment: 2;
    paid: 3;
    canceled: 4;
}>;
export declare const TransactionRecordType: Readonly<{
    government_fees: 1;
    invoice_transaction: 2;
}>;
export declare const ProjectRole: Readonly<{
    projectIncharge: 1;
    supportEngineers: 2;
}>;
export declare const TaskStatus: Readonly<{
    toDo: 1;
    inProgress: 2;
    done: 3;
}>;
export declare const Priority: Readonly<{
    high: 1;
    medium: 2;
    normal: 3;
}>;
export declare const TaskType: Readonly<{
    normal: 1;
    techSupport: 2;
}>;
export declare enum OrganizationType {
    own = 1,
    branch = 2,
    partner = 3
}
export declare enum UserType {
    employee = 1,
    client = 2
}
export declare enum EnquiryStatus {
    "New" = 1,
    "Qualified" = 2,
    "Unqualified" = 3,
    "Spam" = 4
}
export declare enum ReimbursementStatus {
    "submitted" = 1,
    "approved" = 2,
    "rejected" = 3,
    "partially_approved" = 4,
    "paid_and_closed" = 5,
    "withdrawn" = 6
}
export declare enum CashAdvanceRequestStatus {
    "submitted" = 1,
    "approved" = 2,
    "rejected" = 3,
    "partially_approved" = 4,
    "paid_and_closed" = 5,
    "withdrawn" = 6
}
export declare enum LeaveRequestStatus {
    "new" = 1,
    "submitted" = 2,
    "request_modification" = 3,
    "in_progress" = 4,
    "approved" = 5,
    "rejected" = 6,
    "withdrawn" = 7
}
export declare enum CarReservationRequestStatus {
    "submitted" = 1,
    "in_progress" = 2,
    "approved" = 3,
    "rejected" = 4,
    "withdrawn" = 5
}
export declare enum ActionStatus {
    "New / No Action Yet" = 1,
    "Approved" = 2,
    "Rejected" = 3,
    "Partially Approved" = 4
}
export declare enum Departments {
    "hr" = "hr",
    "finance" = "finance",
    "softwareEngineering" = "softwareEngineering",
    "techSupport" = "tech-support"
}
export declare const GenericEmailDomains: readonly string[];
export declare enum LeaveType {
    "annual-leave" = "annual-leave",
    "sick-leave" = "sick-leave",
    "maternity-parental-leave" = "maternity-parental-leave",
    "short-leave" = "short-leave",
    "unpaid-leave" = "unpaid-leave",
    "bereavement-leave" = "bereavement-leave",
    "others" = "others"
}
export declare enum WeekDays {
    "sunday" = 0,
    "monday" = 1,
    "tuesday" = 2,
    "wednesday" = 3,
    "thursday" = 4,
    "friday" = 5,
    "saturday" = 6
}
export declare enum QuotationType {
    "auto" = 1,
    "manual" = 2
}
export declare enum InvoiceType {
    "auto" = 1,
    "manual" = 2
}
export declare enum BiometricsEntryType {
    "auto" = 1,
    "manual" = 2,
    "bulk" = 3,
    "force" = 4
}
export declare enum AttendanceEntryType {
    "auto" = 1,
    "manual" = 2
}
export declare enum AttendanceStatus {
    complete = 1,
    incomplete = 2,
    late = 3,
    absent = 4,
    off = 5
}
export declare enum SupervisionPaymentSchedule {
    "Monthly - Month End" = 1,
    "Monthly - Month start" = 2,
    "Quaterly" = 3,
    "Biannually" = 4,
    "Annually" = 5
}
export declare enum CompanyAssetType {
    "other" = 1,
    "computer" = 2,
    "sim_card" = 3,
    "mobile" = 4,
    "car" = 5
}
export declare enum MilestoneStatus {
    "not_completed" = 1,
    "completed" = 2,
    "invoice_generated" = 3,
    "invoice_sent" = 4,
    "invoice_paid" = 5,
    "invoice_canceled" = 6
}
export declare enum InvoiceStatus {
    "generated" = 1,
    "sent" = 2,
    "paid" = 3,
    "canceled" = 4
}
export declare enum BiometricsJobStatus {
    "new" = 1,
    "processing" = 2,
    "completed" = 3,
    "failed" = 4,
    "rollback" = 5,
    "force_stopped" = 6
}
export declare const ResourcesLocation: Readonly<{
    "biometrics-bulk-upload": "biometrics-bulk-upload";
    "car-reservation-request": "car-reservation-request";
    "cash-advance": "cash-advance";
    invoice: "invoice";
    "leave-request": "leave-request";
    organization: "organization";
    projects: "projects";
    quotation: "quotation";
    reimbursements: "reimbursements";
    task: "task";
    user: "user";
    enquiry: "enquiry";
    transaction: "transaction";
    permits: "permits";
    payroll: "payroll";
    selfie: "selfie";
}>;
export declare enum KnownProjectStatus {
    "new" = "new",
    "completed" = "completed",
    "canceled" = "canceled",
    "ready_for_submission" = "ready_for_submission",
    "approved" = "approved"
}
export declare enum FeedbackType {
    "website" = 1,
    "project" = 2,
    "page" = 3
}
export declare enum FeedbackRatingRange {
    "Smooth Sailing" = 5,
    "User-Friendly" = 4,
    "Neutral Ground" = 3,
    "Bumpy Ride" = 2,
    "Frustrating" = 1
}
export declare const OrganizationPolicy: Readonly<{
    trialPeriod: 30;
    areHolidaysPaidInTrialPeriod: false;
    attendanceGraceTime: 0.083;
    lateGraceTime: 0.5;
}>;
export declare enum PermitFinanceStatus {
    pending_payment = 1,
    paid = 2,
    canceled = 3
}
export declare enum PermitClientStatus {
    to_be_sent = 1,
    sent = 2
}
export {};
