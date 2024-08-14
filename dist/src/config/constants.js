"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeekDays = exports.LeaveType = exports.GenericEmailDomains = exports.Departments = exports.ActionStatus = exports.CarReservationRequestStatus = exports.LeaveRequestStatus = exports.CashAdvanceRequestStatus = exports.ReimbursementStatus = exports.EnquiryStatus = exports.UserType = exports.OrganizationType = exports.TaskType = exports.Priority = exports.TaskStatus = exports.ProjectRole = exports.TransactionRecordType = exports.TransactionStatus = exports.KnownSMSGateways = exports.AlertsTypeSlug = exports.AuthTokenStatus = exports.PropertyNotificationType = exports.SubscriptionsType = exports.safeModeBackupKeys = exports.safeModeUser = exports.ejsTemplateDefaults = exports.CountryStatus = exports.PagesStatus = exports.EnquirySource = exports.QuotationStatus = exports.ClientType = exports.LeadsStatus = exports.BlogsCategoryStatus = exports.BlogsStatus = exports.BlogsCategory = exports.UserStatus = exports.FileStatus = exports.OrganizationStatus = exports.DataFilterType = exports.USER_SIGNUP_SOURCE_TYPES = exports.HOSTS = exports.VAT_RATE = exports.ImagesThresholdForBlogs = exports.defaultYallahAlternateEmail = exports.REDIS_DB_NAME = exports.defaultYallahEmail = exports.TEST_PHONE = exports.TEST_EMAIL = exports.SYSTEM_USERS = exports.SUPER_ADMIN = void 0;
exports.PermitClientStatus = exports.PermitFinanceStatus = exports.OrganizationPolicy = exports.FeedbackRatingRange = exports.FeedbackType = exports.KnownProjectStatus = exports.ResourcesLocation = exports.BiometricsJobStatus = exports.InvoiceStatus = exports.MilestoneStatus = exports.CompanyAssetType = exports.SupervisionPaymentSchedule = exports.AttendanceStatus = exports.AttendanceEntryType = exports.BiometricsEntryType = exports.InvoiceType = exports.QuotationType = void 0;
exports.SUPER_ADMIN = "SUPER-ADMIN";
exports.SYSTEM_USERS = "SYSTEM-USERS";
exports.TEST_EMAIL = "yogen@yallahproperty.ae";
exports.TEST_PHONE = "509826068";
exports.defaultYallahEmail = "yogen@yallahproperty.ae";
exports.REDIS_DB_NAME = "LIVE_DAT-Portal-Redis-DB";
exports.defaultYallahAlternateEmail = "yogen.pokhrel@datconsultancy.com";
exports.ImagesThresholdForBlogs = 15;
exports.VAT_RATE = 5;
exports.HOSTS = {
    serverDomain: "http://localhost:5556",
    activeFrontendDomains: [
        "https://portal.datconsultancy.com"
    ],
    defaultFrontendDomain: "https://portal.datconsultancy.com",
    defaultAdminDomain: "https://portal.datconsultancy.com",
    country: {
        AE: "https://portal.datconsultancy.com",
        IN: "https://portal.datconsultancy.com"
    }
};
var USER_SIGNUP_SOURCE_TYPES;
(function (USER_SIGNUP_SOURCE_TYPES) {
    USER_SIGNUP_SOURCE_TYPES["google"] = "google";
    USER_SIGNUP_SOURCE_TYPES["apple"] = "apple";
    USER_SIGNUP_SOURCE_TYPES["email"] = "email";
    USER_SIGNUP_SOURCE_TYPES["phone"] = "phone";
    USER_SIGNUP_SOURCE_TYPES["organization"] = "organization";
    USER_SIGNUP_SOURCE_TYPES["yallahAdmins"] = "yallahAdmins";
    USER_SIGNUP_SOURCE_TYPES["organization_bulk_upload"] = "organization_bulk_upload";
})(USER_SIGNUP_SOURCE_TYPES = exports.USER_SIGNUP_SOURCE_TYPES || (exports.USER_SIGNUP_SOURCE_TYPES = {}));
var DataFilterType;
(function (DataFilterType) {
    DataFilterType["equals"] = "equals";
    DataFilterType["like"] = "like";
    DataFilterType["greaterThan"] = "gt";
    DataFilterType["greaterThanEquals"] = "gte";
    DataFilterType["not"] = "not";
    DataFilterType["in"] = "in";
    DataFilterType["notIn"] = "notIn";
})(DataFilterType = exports.DataFilterType || (exports.DataFilterType = {}));
var OrganizationStatus;
(function (OrganizationStatus) {
    OrganizationStatus[OrganizationStatus["active"] = 1] = "active";
    OrganizationStatus[OrganizationStatus["suspended"] = 2] = "suspended";
    OrganizationStatus[OrganizationStatus["pending verification"] = 3] = "pending verification";
    OrganizationStatus[OrganizationStatus["waiting for documents"] = 4] = "waiting for documents";
})(OrganizationStatus = exports.OrganizationStatus || (exports.OrganizationStatus = {}));
var FileStatus;
(function (FileStatus) {
    FileStatus[FileStatus["Waiting for verification"] = 1] = "Waiting for verification";
    FileStatus[FileStatus["Additional documents required"] = 2] = "Additional documents required";
    FileStatus[FileStatus["Rejected"] = 3] = "Rejected";
    FileStatus[FileStatus["Verified"] = 4] = "Verified";
})(FileStatus = exports.FileStatus || (exports.FileStatus = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus[UserStatus["active"] = 1] = "active";
    UserStatus[UserStatus["suspended"] = 2] = "suspended";
})(UserStatus = exports.UserStatus || (exports.UserStatus = {}));
var BlogsCategory;
(function (BlogsCategory) {
    BlogsCategory[BlogsCategory["Blog"] = 1] = "Blog";
    BlogsCategory[BlogsCategory["News"] = 2] = "News";
})(BlogsCategory = exports.BlogsCategory || (exports.BlogsCategory = {}));
var BlogsStatus;
(function (BlogsStatus) {
    BlogsStatus[BlogsStatus["Not Published, Verification Required"] = 1] = "Not Published, Verification Required";
    BlogsStatus[BlogsStatus["Modification Required"] = 2] = "Modification Required";
    BlogsStatus[BlogsStatus["Requested for Verification"] = 3] = "Requested for Verification";
    BlogsStatus[BlogsStatus["Verified & Published"] = 4] = "Verified & Published";
})(BlogsStatus = exports.BlogsStatus || (exports.BlogsStatus = {}));
var BlogsCategoryStatus;
(function (BlogsCategoryStatus) {
    BlogsCategoryStatus[BlogsCategoryStatus["Not Published, Verification Required"] = 1] = "Not Published, Verification Required";
    BlogsCategoryStatus[BlogsCategoryStatus["Modification Required"] = 2] = "Modification Required";
    BlogsCategoryStatus[BlogsCategoryStatus["Requested for Verification"] = 3] = "Requested for Verification";
    BlogsCategoryStatus[BlogsCategoryStatus["Verified & Published"] = 4] = "Verified & Published";
})(BlogsCategoryStatus = exports.BlogsCategoryStatus || (exports.BlogsCategoryStatus = {}));
var LeadsStatus;
(function (LeadsStatus) {
    LeadsStatus[LeadsStatus["new"] = 1] = "new";
    LeadsStatus[LeadsStatus["in_progress"] = 2] = "in_progress";
    LeadsStatus[LeadsStatus["unqualified"] = 3] = "unqualified";
    LeadsStatus[LeadsStatus["confirmed"] = 4] = "confirmed";
    LeadsStatus[LeadsStatus["canceled"] = 5] = "canceled";
    LeadsStatus[LeadsStatus["invalid_request"] = 6] = "invalid_request";
    LeadsStatus[LeadsStatus["spam"] = 7] = "spam";
})(LeadsStatus = exports.LeadsStatus || (exports.LeadsStatus = {}));
var ClientType;
(function (ClientType) {
    ClientType[ClientType["company"] = 1] = "company";
    ClientType[ClientType["individual"] = 2] = "individual";
})(ClientType = exports.ClientType || (exports.ClientType = {}));
var QuotationStatus;
(function (QuotationStatus) {
    QuotationStatus[QuotationStatus["created"] = 1] = "created";
    QuotationStatus[QuotationStatus["submitted"] = 2] = "submitted";
    QuotationStatus[QuotationStatus["confirmed"] = 3] = "confirmed";
    QuotationStatus[QuotationStatus["rejected"] = 4] = "rejected";
    QuotationStatus[QuotationStatus["revised"] = 5] = "revised";
    QuotationStatus[QuotationStatus["invoiced"] = 6] = "invoiced";
})(QuotationStatus = exports.QuotationStatus || (exports.QuotationStatus = {}));
var EnquirySource;
(function (EnquirySource) {
    EnquirySource["manual"] = "manual";
    EnquirySource["whatsapp"] = "whatsapp";
    EnquirySource["dubaiapprovals.com"] = "dubaiapprovals.com";
    EnquirySource["abudhabiapprovals.com"] = "abudhabiapprovals.com";
    EnquirySource["datconsultancy.com"] = "datconsultancy.com";
    EnquirySource["luxedesign.ae"] = "luxedesign.ae";
    EnquirySource["phone"] = "phone";
    EnquirySource["email"] = "email";
    EnquirySource["facebook"] = "facebook";
    EnquirySource["tiktok"] = "tiktok";
    EnquirySource["instagram"] = "instagram";
    EnquirySource["facebook_reels"] = "facebook_reels";
    EnquirySource["linkedIn"] = "linkedIn";
    EnquirySource["twitter"] = "twitter";
    EnquirySource["other"] = "other";
})(EnquirySource = exports.EnquirySource || (exports.EnquirySource = {}));
var PagesStatus;
(function (PagesStatus) {
    PagesStatus[PagesStatus["Not Published, Verification Required"] = 1] = "Not Published, Verification Required";
    PagesStatus[PagesStatus["Modification Required"] = 2] = "Modification Required";
    PagesStatus[PagesStatus["Requested for Verification"] = 3] = "Requested for Verification";
    PagesStatus[PagesStatus["Verified & Published"] = 4] = "Verified & Published";
})(PagesStatus = exports.PagesStatus || (exports.PagesStatus = {}));
var CountryStatus;
(function (CountryStatus) {
    CountryStatus[CountryStatus["active"] = 1] = "active";
    CountryStatus[CountryStatus["InActive"] = 2] = "InActive";
})(CountryStatus = exports.CountryStatus || (exports.CountryStatus = {}));
exports.ejsTemplateDefaults = {
    frontendDomain: "https://portal.datconsultancy.com/",
    facebookUrl: "https://www.facebook.com/DATengineeringConsultancy",
    linkedInUrl: "https://www.linkedin.com/company/dat-architects-engineers/",
    instagramUrl: "https://www.instagram.com/dat.architects/",
    unsubscribeUrl: "",
    emailTitle: "",
    hideFooter: false,
    notificationPreferences: "https://portal.datconsultancy.com/profile?tab=manage_notifications",
    companyAddress: "Opus Tower By Omniyat, Office B803 Business Bay, Dubai"
};
exports.safeModeUser = "info@theproranker.com";
exports.safeModeBackupKeys = [
    "!4Kp#7Lw9$2S&8R*5",
    "@2Fg%8Xy6^Qz1Vc3O*",
    "9T!h6Bf4Ae7Gj1Pq5R",
    "3p$l7w*2zQ9h6aF4xE",
    "5m#Nc1v3x4oP7Lr2S@W",
];
var SubscriptionsType;
(function (SubscriptionsType) {
    SubscriptionsType["news_and_blogs"] = "news_and_blogs";
})(SubscriptionsType = exports.SubscriptionsType || (exports.SubscriptionsType = {}));
var PropertyNotificationType;
(function (PropertyNotificationType) {
    PropertyNotificationType["new_alerts"] = "new_alerts";
    PropertyNotificationType["expired"] = "expired";
    PropertyNotificationType["insufficient_credits_to_recharge"] = "insufficient_credits_to_recharge";
})(PropertyNotificationType = exports.PropertyNotificationType || (exports.PropertyNotificationType = {}));
var AuthTokenStatus;
(function (AuthTokenStatus) {
    AuthTokenStatus[AuthTokenStatus["active"] = 1] = "active";
    AuthTokenStatus[AuthTokenStatus["expired"] = 2] = "expired";
    AuthTokenStatus[AuthTokenStatus["used"] = 3] = "used";
})(AuthTokenStatus = exports.AuthTokenStatus || (exports.AuthTokenStatus = {}));
var AlertsTypeSlug;
(function (AlertsTypeSlug) {
    AlertsTypeSlug["properties"] = "properties";
    AlertsTypeSlug["propertyDocuments"] = "propertyDocuments";
    AlertsTypeSlug["emailLeads"] = "emailLeads";
})(AlertsTypeSlug = exports.AlertsTypeSlug || (exports.AlertsTypeSlug = {}));
var KnownSMSGateways;
(function (KnownSMSGateways) {
    KnownSMSGateways["SMS-ALA"] = "SMS-ALA";
    KnownSMSGateways["SMS-ALA-TEST"] = "SMS-ALA-TEST";
    KnownSMSGateways["SMS-COUNTRY"] = "SMS-COUNTRY";
    KnownSMSGateways["SMS-COUNTRY-TEST"] = "SMS-COUNTRY-TEST";
})(KnownSMSGateways = exports.KnownSMSGateways || (exports.KnownSMSGateways = {}));
exports.TransactionStatus = Object.freeze({
    sent_to_client: 1,
    pending_payment: 2,
    paid: 3,
    canceled: 4
});
exports.TransactionRecordType = Object.freeze({
    government_fees: 1,
    invoice_transaction: 2
});
exports.ProjectRole = Object.freeze({
    projectIncharge: 1,
    supportEngineers: 2
});
exports.TaskStatus = Object.freeze({
    toDo: 1,
    inProgress: 2,
    done: 3
});
exports.Priority = Object.freeze({
    high: 1,
    medium: 2,
    normal: 3
});
exports.TaskType = Object.freeze({
    normal: 1,
    techSupport: 2
});
var OrganizationType;
(function (OrganizationType) {
    OrganizationType[OrganizationType["own"] = 1] = "own";
    OrganizationType[OrganizationType["branch"] = 2] = "branch";
    OrganizationType[OrganizationType["partner"] = 3] = "partner";
})(OrganizationType = exports.OrganizationType || (exports.OrganizationType = {}));
var UserType;
(function (UserType) {
    UserType[UserType["employee"] = 1] = "employee";
    UserType[UserType["client"] = 2] = "client";
})(UserType = exports.UserType || (exports.UserType = {}));
var EnquiryStatus;
(function (EnquiryStatus) {
    EnquiryStatus[EnquiryStatus["New"] = 1] = "New";
    EnquiryStatus[EnquiryStatus["Qualified"] = 2] = "Qualified";
    EnquiryStatus[EnquiryStatus["Unqualified"] = 3] = "Unqualified";
    EnquiryStatus[EnquiryStatus["Spam"] = 4] = "Spam";
})(EnquiryStatus = exports.EnquiryStatus || (exports.EnquiryStatus = {}));
var ReimbursementStatus;
(function (ReimbursementStatus) {
    ReimbursementStatus[ReimbursementStatus["submitted"] = 1] = "submitted";
    ReimbursementStatus[ReimbursementStatus["approved"] = 2] = "approved";
    ReimbursementStatus[ReimbursementStatus["rejected"] = 3] = "rejected";
    ReimbursementStatus[ReimbursementStatus["partially_approved"] = 4] = "partially_approved";
    ReimbursementStatus[ReimbursementStatus["paid_and_closed"] = 5] = "paid_and_closed";
    ReimbursementStatus[ReimbursementStatus["withdrawn"] = 6] = "withdrawn";
})(ReimbursementStatus = exports.ReimbursementStatus || (exports.ReimbursementStatus = {}));
var CashAdvanceRequestStatus;
(function (CashAdvanceRequestStatus) {
    CashAdvanceRequestStatus[CashAdvanceRequestStatus["submitted"] = 1] = "submitted";
    CashAdvanceRequestStatus[CashAdvanceRequestStatus["approved"] = 2] = "approved";
    CashAdvanceRequestStatus[CashAdvanceRequestStatus["rejected"] = 3] = "rejected";
    CashAdvanceRequestStatus[CashAdvanceRequestStatus["partially_approved"] = 4] = "partially_approved";
    CashAdvanceRequestStatus[CashAdvanceRequestStatus["paid_and_closed"] = 5] = "paid_and_closed";
    CashAdvanceRequestStatus[CashAdvanceRequestStatus["withdrawn"] = 6] = "withdrawn";
})(CashAdvanceRequestStatus = exports.CashAdvanceRequestStatus || (exports.CashAdvanceRequestStatus = {}));
var LeaveRequestStatus;
(function (LeaveRequestStatus) {
    LeaveRequestStatus[LeaveRequestStatus["new"] = 1] = "new";
    LeaveRequestStatus[LeaveRequestStatus["submitted"] = 2] = "submitted";
    LeaveRequestStatus[LeaveRequestStatus["request_modification"] = 3] = "request_modification";
    LeaveRequestStatus[LeaveRequestStatus["in_progress"] = 4] = "in_progress";
    LeaveRequestStatus[LeaveRequestStatus["approved"] = 5] = "approved";
    LeaveRequestStatus[LeaveRequestStatus["rejected"] = 6] = "rejected";
    LeaveRequestStatus[LeaveRequestStatus["withdrawn"] = 7] = "withdrawn";
})(LeaveRequestStatus = exports.LeaveRequestStatus || (exports.LeaveRequestStatus = {}));
var CarReservationRequestStatus;
(function (CarReservationRequestStatus) {
    CarReservationRequestStatus[CarReservationRequestStatus["submitted"] = 1] = "submitted";
    CarReservationRequestStatus[CarReservationRequestStatus["in_progress"] = 2] = "in_progress";
    CarReservationRequestStatus[CarReservationRequestStatus["approved"] = 3] = "approved";
    CarReservationRequestStatus[CarReservationRequestStatus["rejected"] = 4] = "rejected";
    CarReservationRequestStatus[CarReservationRequestStatus["withdrawn"] = 5] = "withdrawn";
})(CarReservationRequestStatus = exports.CarReservationRequestStatus || (exports.CarReservationRequestStatus = {}));
var ActionStatus;
(function (ActionStatus) {
    ActionStatus[ActionStatus["New / No Action Yet"] = 1] = "New / No Action Yet";
    ActionStatus[ActionStatus["Approved"] = 2] = "Approved";
    ActionStatus[ActionStatus["Rejected"] = 3] = "Rejected";
    ActionStatus[ActionStatus["Partially Approved"] = 4] = "Partially Approved";
})(ActionStatus = exports.ActionStatus || (exports.ActionStatus = {}));
var Departments;
(function (Departments) {
    Departments["hr"] = "hr";
    Departments["finance"] = "finance";
    Departments["softwareEngineering"] = "softwareEngineering";
    Departments["techSupport"] = "tech-support";
})(Departments = exports.Departments || (exports.Departments = {}));
exports.GenericEmailDomains = Object.freeze([
    "gmail.com",
    "hotmail.com",
    "outlook.com",
    "yahoo.com",
    "icloud.com",
    "aol.com",
    "protonmail.com",
    "zoho.com",
    "gmx.com",
    "mail.com",
    "yandex.com",
    "tutanota.com",
    "fastmail.com",
    "hushmail.com",
    "mailinator.com",
    "guerrillamail.com",
    "emirates.net.ae",
    "etisalat.ae",
    "du.ae"
]);
var LeaveType;
(function (LeaveType) {
    LeaveType["annual-leave"] = "annual-leave";
    LeaveType["sick-leave"] = "sick-leave";
    LeaveType["maternity-parental-leave"] = "maternity-parental-leave";
    LeaveType["short-leave"] = "short-leave";
    LeaveType["unpaid-leave"] = "unpaid-leave";
    LeaveType["bereavement-leave"] = "bereavement-leave";
    LeaveType["others"] = "others";
})(LeaveType = exports.LeaveType || (exports.LeaveType = {}));
var WeekDays;
(function (WeekDays) {
    WeekDays[WeekDays["sunday"] = 0] = "sunday";
    WeekDays[WeekDays["monday"] = 1] = "monday";
    WeekDays[WeekDays["tuesday"] = 2] = "tuesday";
    WeekDays[WeekDays["wednesday"] = 3] = "wednesday";
    WeekDays[WeekDays["thursday"] = 4] = "thursday";
    WeekDays[WeekDays["friday"] = 5] = "friday";
    WeekDays[WeekDays["saturday"] = 6] = "saturday";
})(WeekDays = exports.WeekDays || (exports.WeekDays = {}));
var QuotationType;
(function (QuotationType) {
    QuotationType[QuotationType["auto"] = 1] = "auto";
    QuotationType[QuotationType["manual"] = 2] = "manual";
})(QuotationType = exports.QuotationType || (exports.QuotationType = {}));
var InvoiceType;
(function (InvoiceType) {
    InvoiceType[InvoiceType["auto"] = 1] = "auto";
    InvoiceType[InvoiceType["manual"] = 2] = "manual";
})(InvoiceType = exports.InvoiceType || (exports.InvoiceType = {}));
;
var BiometricsEntryType;
(function (BiometricsEntryType) {
    BiometricsEntryType[BiometricsEntryType["auto"] = 1] = "auto";
    BiometricsEntryType[BiometricsEntryType["manual"] = 2] = "manual";
    BiometricsEntryType[BiometricsEntryType["bulk"] = 3] = "bulk";
    BiometricsEntryType[BiometricsEntryType["force"] = 4] = "force";
})(BiometricsEntryType = exports.BiometricsEntryType || (exports.BiometricsEntryType = {}));
var AttendanceEntryType;
(function (AttendanceEntryType) {
    AttendanceEntryType[AttendanceEntryType["auto"] = 1] = "auto";
    AttendanceEntryType[AttendanceEntryType["manual"] = 2] = "manual";
})(AttendanceEntryType = exports.AttendanceEntryType || (exports.AttendanceEntryType = {}));
var AttendanceStatus;
(function (AttendanceStatus) {
    AttendanceStatus[AttendanceStatus["complete"] = 1] = "complete";
    AttendanceStatus[AttendanceStatus["incomplete"] = 2] = "incomplete";
    AttendanceStatus[AttendanceStatus["late"] = 3] = "late";
    AttendanceStatus[AttendanceStatus["absent"] = 4] = "absent";
    AttendanceStatus[AttendanceStatus["off"] = 5] = "off";
})(AttendanceStatus = exports.AttendanceStatus || (exports.AttendanceStatus = {}));
var SupervisionPaymentSchedule;
(function (SupervisionPaymentSchedule) {
    SupervisionPaymentSchedule[SupervisionPaymentSchedule["Monthly - Month End"] = 1] = "Monthly - Month End";
    SupervisionPaymentSchedule[SupervisionPaymentSchedule["Monthly - Month start"] = 2] = "Monthly - Month start";
    SupervisionPaymentSchedule[SupervisionPaymentSchedule["Quaterly"] = 3] = "Quaterly";
    SupervisionPaymentSchedule[SupervisionPaymentSchedule["Biannually"] = 4] = "Biannually";
    SupervisionPaymentSchedule[SupervisionPaymentSchedule["Annually"] = 5] = "Annually";
})(SupervisionPaymentSchedule = exports.SupervisionPaymentSchedule || (exports.SupervisionPaymentSchedule = {}));
var CompanyAssetType;
(function (CompanyAssetType) {
    CompanyAssetType[CompanyAssetType["other"] = 1] = "other";
    CompanyAssetType[CompanyAssetType["computer"] = 2] = "computer";
    CompanyAssetType[CompanyAssetType["sim_card"] = 3] = "sim_card";
    CompanyAssetType[CompanyAssetType["mobile"] = 4] = "mobile";
    CompanyAssetType[CompanyAssetType["car"] = 5] = "car";
})(CompanyAssetType = exports.CompanyAssetType || (exports.CompanyAssetType = {}));
var MilestoneStatus;
(function (MilestoneStatus) {
    MilestoneStatus[MilestoneStatus["not_completed"] = 1] = "not_completed";
    MilestoneStatus[MilestoneStatus["completed"] = 2] = "completed";
    MilestoneStatus[MilestoneStatus["invoice_generated"] = 3] = "invoice_generated";
    MilestoneStatus[MilestoneStatus["invoice_sent"] = 4] = "invoice_sent";
    MilestoneStatus[MilestoneStatus["invoice_paid"] = 5] = "invoice_paid";
    MilestoneStatus[MilestoneStatus["invoice_canceled"] = 6] = "invoice_canceled";
})(MilestoneStatus = exports.MilestoneStatus || (exports.MilestoneStatus = {}));
var InvoiceStatus;
(function (InvoiceStatus) {
    InvoiceStatus[InvoiceStatus["generated"] = 1] = "generated";
    InvoiceStatus[InvoiceStatus["sent"] = 2] = "sent";
    InvoiceStatus[InvoiceStatus["paid"] = 3] = "paid";
    InvoiceStatus[InvoiceStatus["canceled"] = 4] = "canceled";
})(InvoiceStatus = exports.InvoiceStatus || (exports.InvoiceStatus = {}));
var BiometricsJobStatus;
(function (BiometricsJobStatus) {
    BiometricsJobStatus[BiometricsJobStatus["new"] = 1] = "new";
    BiometricsJobStatus[BiometricsJobStatus["processing"] = 2] = "processing";
    BiometricsJobStatus[BiometricsJobStatus["completed"] = 3] = "completed";
    BiometricsJobStatus[BiometricsJobStatus["failed"] = 4] = "failed";
    BiometricsJobStatus[BiometricsJobStatus["rollback"] = 5] = "rollback";
    BiometricsJobStatus[BiometricsJobStatus["force_stopped"] = 6] = "force_stopped";
})(BiometricsJobStatus = exports.BiometricsJobStatus || (exports.BiometricsJobStatus = {}));
exports.ResourcesLocation = Object.freeze({
    "biometrics-bulk-upload": "biometrics-bulk-upload",
    "car-reservation-request": "car-reservation-request",
    "cash-advance": "cash-advance",
    "invoice": "invoice",
    "leave-request": "leave-request",
    "organization": "organization",
    "projects": "projects",
    "quotation": "quotation",
    "reimbursements": "reimbursements",
    "task": "task",
    "user": "user",
    "enquiry": "enquiry",
    "transaction": "transaction",
    "permits": "permits",
    "payroll": "payroll",
    "selfie": "selfie"
});
var KnownProjectStatus;
(function (KnownProjectStatus) {
    KnownProjectStatus["new"] = "new";
    KnownProjectStatus["completed"] = "completed";
    KnownProjectStatus["canceled"] = "canceled";
    KnownProjectStatus["ready_for_submission"] = "ready_for_submission";
    KnownProjectStatus["approved"] = "approved";
})(KnownProjectStatus = exports.KnownProjectStatus || (exports.KnownProjectStatus = {}));
var FeedbackType;
(function (FeedbackType) {
    FeedbackType[FeedbackType["website"] = 1] = "website";
    FeedbackType[FeedbackType["project"] = 2] = "project";
    FeedbackType[FeedbackType["page"] = 3] = "page";
})(FeedbackType = exports.FeedbackType || (exports.FeedbackType = {}));
var FeedbackRatingRange;
(function (FeedbackRatingRange) {
    FeedbackRatingRange[FeedbackRatingRange["Smooth Sailing"] = 5] = "Smooth Sailing";
    FeedbackRatingRange[FeedbackRatingRange["User-Friendly"] = 4] = "User-Friendly";
    FeedbackRatingRange[FeedbackRatingRange["Neutral Ground"] = 3] = "Neutral Ground";
    FeedbackRatingRange[FeedbackRatingRange["Bumpy Ride"] = 2] = "Bumpy Ride";
    FeedbackRatingRange[FeedbackRatingRange["Frustrating"] = 1] = "Frustrating";
})(FeedbackRatingRange = exports.FeedbackRatingRange || (exports.FeedbackRatingRange = {}));
exports.OrganizationPolicy = Object.freeze({
    trialPeriod: 30,
    areHolidaysPaidInTrialPeriod: false,
    attendanceGraceTime: 0.083,
    lateGraceTime: 0.5
});
var PermitFinanceStatus;
(function (PermitFinanceStatus) {
    PermitFinanceStatus[PermitFinanceStatus["pending_payment"] = 1] = "pending_payment";
    PermitFinanceStatus[PermitFinanceStatus["paid"] = 2] = "paid";
    PermitFinanceStatus[PermitFinanceStatus["canceled"] = 3] = "canceled";
})(PermitFinanceStatus = exports.PermitFinanceStatus || (exports.PermitFinanceStatus = {}));
var PermitClientStatus;
(function (PermitClientStatus) {
    PermitClientStatus[PermitClientStatus["to_be_sent"] = 1] = "to_be_sent";
    PermitClientStatus[PermitClientStatus["sent"] = 2] = "sent";
})(PermitClientStatus = exports.PermitClientStatus || (exports.PermitClientStatus = {}));
//# sourceMappingURL=constants.js.map