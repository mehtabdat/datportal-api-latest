-- CreateEnum
CREATE TYPE "TokenTypes" AS ENUM ('accessToken', 'refreshToken', 'signuptoken', 'emailSignupToken', 'phoneSignupToken', 'resetPasswordToken', 'changeUserPhoneEmailToken');

-- CreateEnum
CREATE TYPE "ModulesVisibility" AS ENUM ('organization', 'system');

-- CreateEnum
CREATE TYPE "SMSType" AS ENUM ('T', 'P');

-- CreateEnum
CREATE TYPE "SavedSearchesVisibility" AS ENUM ('self', 'global', 'organization');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('broadcast', 'user');

-- CreateTable
CREATE TABLE "Country" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "isoCode" VARCHAR(100) NOT NULL,
    "vat" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "shortName" VARCHAR(200) NOT NULL,
    "displayName" VARCHAR(200),
    "phoneCode" VARCHAR(5),
    "flag" VARCHAR(250),
    "status" INTEGER DEFAULT 2,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "addedBy" INTEGER,
    "modifiedDate" TIMESTAMP(3),
    "modifiedBy" INTEGER,
    "deletedDate" TIMESTAMP(3),
    "deletedBy" INTEGER,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedDate" TIMESTAMP(3),
    "deletedDate" TIMESTAMP(3),
    "addedBy" INTEGER,
    "modifiedBy" INTEGER,
    "deletedBy" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" SERIAL NOT NULL,
    "uuid" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "email" VARCHAR(255),
    "phone" VARCHAR(20),
    "phoneCode" VARCHAR(5),
    "whatsapp" VARCHAR(20),
    "address" TEXT,
    "locationMap" TEXT,
    "logo" VARCHAR(255),
    "countryId" INTEGER,
    "city" VARCHAR(255),
    "status" INTEGER NOT NULL DEFAULT 4,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedDate" TIMESTAMP(3),
    "deletedDate" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "addedBy" INTEGER,
    "modifiedBy" INTEGER,
    "deletedBy" INTEGER,
    "seoTitle" VARCHAR(255),
    "seoDescription" VARCHAR(500),

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "uuid" VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20),
    "phoneCode" VARCHAR(5),
    "whatsapp" VARCHAR(20),
    "email" VARCHAR(255),
    "displayOrgContact" BOOLEAN NOT NULL DEFAULT false,
    "address" VARCHAR(255),
    "preferences" VARCHAR(255),
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "agentVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "password" VARCHAR(255),
    "profile" VARCHAR(255),
    "isAvatar" BOOLEAN NOT NULL DEFAULT false,
    "resetToken" TEXT,
    "resetTokenValidity" TIMESTAMP(3),
    "status" INTEGER NOT NULL DEFAULT 1,
    "userCountry" JSONB,
    "userSignupSource" VARCHAR(50),
    "userSignupDeviceAgent" VARCHAR(255),
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedDate" TIMESTAMP(3),
    "deletedDate" TIMESTAMP(3),
    "addedBy" INTEGER,
    "modifiedBy" INTEGER,
    "deletedBy" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "organizationId" INTEGER,
    "seoTitle" VARCHAR(255),
    "seoDescription" VARCHAR(500),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMeta" (
    "id" SERIAL NOT NULL,
    "key" VARCHAR(255) NOT NULL,
    "value" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UserMeta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthTokens" (
    "id" SERIAL NOT NULL,
    "tokenType" "TokenTypes" NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER,
    "userAgent" VARCHAR(255),
    "userIP" VARCHAR(50),
    "status" INTEGER NOT NULL DEFAULT 1,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedDate" TIMESTAMP(3),

    CONSTRAINT "AuthTokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Modules" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "icon" VARCHAR(100),
    "isMenuItem" BOOLEAN NOT NULL DEFAULT true,
    "visibility" "ModulesVisibility" NOT NULL DEFAULT 'system',
    "order" INTEGER NOT NULL DEFAULT 99,
    "url" VARCHAR(255),
    "description" TEXT,

    CONSTRAINT "Modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permissions" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "action" VARCHAR(255) NOT NULL,
    "icon" VARCHAR(100),
    "moduleId" INTEGER NOT NULL,
    "visibility" "ModulesVisibility" NOT NULL DEFAULT 'organization',
    "condition" JSONB,
    "url" VARCHAR(255),
    "isMenuItem" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 99,
    "description" TEXT,

    CONSTRAINT "Permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermissions" (
    "id" SERIAL NOT NULL,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "addedBy" INTEGER,
    "roleId" INTEGER NOT NULL,
    "permissionsId" INTEGER NOT NULL,

    CONSTRAINT "RolePermissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaticPageSEO" (
    "id" SERIAL NOT NULL,
    "seoTitle" VARCHAR(255) NOT NULL,
    "seoDescription" VARCHAR(500) NOT NULL,
    "image" VARCHAR(255),
    "isDefault" INTEGER NOT NULL DEFAULT 0,
    "sitePageId" INTEGER,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedDate" TIMESTAMP(3),
    "modifiedById" INTEGER,

    CONSTRAINT "StaticPageSEO_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemLogs" (
    "id" SERIAL NOT NULL,
    "table" VARCHAR(100),
    "tableColumnKey" VARCHAR(100),
    "tableColumnValue" VARCHAR(100),
    "valueType" VARCHAR(50),
    "actionType" VARCHAR(255),
    "message" VARCHAR(255),
    "endPoint" VARCHAR(100),
    "controllerName" VARCHAR(100),
    "data" JSONB,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "addedById" INTEGER,

    CONSTRAINT "SystemLogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Leads" (
    "id" SERIAL NOT NULL,
    "uuid" VARCHAR(255),
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100),
    "phone" VARCHAR(100),
    "phoneCode" VARCHAR(10),
    "message" VARCHAR(500),
    "reference" VARCHAR(100),
    "source" VARCHAR(100),
    "userAgent" VARCHAR(255),
    "userIP" VARCHAR(50),
    "status" INTEGER NOT NULL DEFAULT 1,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hasReplied" BOOLEAN NOT NULL DEFAULT false,
    "timeDifference" INTEGER DEFAULT 43200,
    "repliedDate" TIMESTAMP(3),
    "modifiedDate" TIMESTAMP(3),
    "modifiedById" INTEGER,

    CONSTRAINT "Leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FaqsCategory" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "parentId" INTEGER,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "forAdminpanel" BOOLEAN NOT NULL DEFAULT false,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,

    CONSTRAINT "FaqsCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faqs" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "faqsCategoryId" INTEGER NOT NULL,
    "forAdminpanel" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,

    CONSTRAINT "Faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SitePages" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SitePages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PagesSection" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "hasMultipleItems" BOOLEAN NOT NULL DEFAULT true,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PagesSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageSectionRelation" (
    "id" SERIAL NOT NULL,
    "sitePageId" INTEGER NOT NULL,
    "pageSectionId" INTEGER NOT NULL,

    CONSTRAINT "PageSectionRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PagesContent" (
    "id" SERIAL NOT NULL,
    "pageSectionId" INTEGER NOT NULL,
    "image" VARCHAR(255),
    "imageAlt" VARCHAR(255),
    "isDefault" INTEGER NOT NULL DEFAULT 0,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "addedById" INTEGER,
    "modifiedDate" TIMESTAMP(3),
    "modifiedById" INTEGER,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "title" VARCHAR(255) NOT NULL,
    "highlight" TEXT,
    "description" TEXT,

    CONSTRAINT "PagesContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogsCategory" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "highlight" TEXT,
    "description" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "seoTitle" VARCHAR(255),
    "seoDescription" VARCHAR(500),
    "image" VARCHAR(255),
    "imageAlt" VARCHAR(255),
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedDate" TIMESTAMP(3),
    "deletedDate" TIMESTAMP(3),
    "addedById" INTEGER,
    "modifiedById" INTEGER,
    "deletedById" INTEGER,

    CONSTRAINT "BlogsCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blogs" (
    "id" SERIAL NOT NULL,
    "blogCategoryId" INTEGER,
    "category" INTEGER NOT NULL DEFAULT 1,
    "slug" VARCHAR(255) NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "seoTitle" VARCHAR(255),
    "seoDescription" VARCHAR(500),
    "image" VARCHAR(255),
    "imageAlt" VARCHAR(255),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedDate" TIMESTAMP(3),
    "deletedDate" TIMESTAMP(3),
    "addedById" INTEGER,
    "modifiedById" INTEGER,
    "deletedById" INTEGER,
    "title" VARCHAR(255) NOT NULL,
    "highlight" TEXT,
    "description" TEXT,

    CONSTRAINT "Blogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogImages" (
    "id" SERIAL NOT NULL,
    "uuid" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255),
    "file" VARCHAR(255) NOT NULL,
    "fileType" VARCHAR(100),
    "videoPreview" VARCHAR(255),
    "path" VARCHAR(500),
    "blogId" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "BlogImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MailSentLogs" (
    "id" SERIAL NOT NULL,
    "subject" VARCHAR(255) NOT NULL,
    "calleFunction" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL,
    "data" JSONB,
    "template" VARCHAR(255),
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MailSentLogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OtpCodes" (
    "id" SERIAL NOT NULL,
    "phoneCode" VARCHAR(10),
    "phone" VARCHAR(20),
    "email" VARCHAR(50),
    "otp" VARCHAR(10),
    "status" INTEGER NOT NULL DEFAULT 1,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deviceType" VARCHAR(50),
    "deviceId" VARCHAR(50),
    "deviceVersion" VARCHAR(20),
    "userAgent" VARCHAR(255),
    "userIP" VARCHAR(50),
    "attempts" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "OtpCodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emailLookupsLog" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(50),
    "status" INTEGER NOT NULL DEFAULT 1,
    "userAgent" VARCHAR(255),
    "userIP" VARCHAR(50),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "emailLookupsLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertsType" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "forAdminpanel" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlertsType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAlertsSetting" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "alertsTypeId" INTEGER,
    "desktop" BOOLEAN NOT NULL DEFAULT true,
    "mobile" BOOLEAN NOT NULL DEFAULT false,
    "email" BOOLEAN NOT NULL DEFAULT true,
    "app" BOOLEAN NOT NULL DEFAULT true,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedDate" TIMESTAMP(3),

    CONSTRAINT "UserAlertsSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAlerts" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "filters" JSONB,
    "interval" INTEGER NOT NULL DEFAULT 1,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedDate" TIMESTAMP(3),
    "lastSent" TIMESTAMP(3),
    "isPublished" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UserAlerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAlertsSentLog" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "sentTo" VARCHAR(255) NOT NULL,
    "userId" INTEGER NOT NULL,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAlertsSentLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SmsConfiguration" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "gateway" VARCHAR(255),
    "appId" VARCHAR(255),
    "appPassword" VARCHAR(255),
    "senderId" VARCHAR(255),
    "senderIdType" "SMSType" NOT NULL DEFAULT 'P',
    "test" BOOLEAN NOT NULL DEFAULT false,
    "priority" INTEGER NOT NULL DEFAULT 9,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "countryId" INTEGER,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "addedById" INTEGER,

    CONSTRAINT "SmsConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SmsLogs" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "gateway" VARCHAR(255) NOT NULL,
    "number" VARCHAR(255),
    "message" TEXT,
    "status" VARCHAR(100) DEFAULT 'sent',
    "remarks" VARCHAR(255),
    "error" TEXT,
    "transactionId" VARCHAR(255),
    "referenceId" VARCHAR(255),
    "sentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,

    CONSTRAINT "SmsLogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentGateway" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "gatewayURL" VARCHAR(255),
    "gatewayPublicKey" VARCHAR(500),
    "gatewayPrivateKey" VARCHAR(500),
    "storeId" TEXT,
    "test" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "countryId" INTEGER,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "addedById" INTEGER,
    "modifiedDate" TIMESTAMP(3),
    "modifiedById" INTEGER,
    "deletedDate" TIMESTAMP(3),
    "deletedById" INTEGER,

    CONSTRAINT "PaymentGateway_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transactions" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "organizationId" INTEGER,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currencyCode" VARCHAR(100),
    "transactionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transactionType" INTEGER NOT NULL DEFAULT 1,
    "recordType" INTEGER NOT NULL DEFAULT 1,
    "status" INTEGER NOT NULL DEFAULT 1,
    "cartId" VARCHAR(255),
    "transactionReference" VARCHAR(255),
    "transactionUrl" VARCHAR(255),
    "transactionData" JSONB,
    "transactionStatus" VARCHAR(255),
    "transactionCode" INTEGER,
    "transactionMessage" VARCHAR(255),
    "paymentGatewayId" INTEGER,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "addedById" INTEGER,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedSearches" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "userId" INTEGER,
    "filters" JSONB,
    "icon" VARCHAR(255),
    "forAdminpanel" BOOLEAN NOT NULL DEFAULT true,
    "visibility" "SavedSearchesVisibility" NOT NULL DEFAULT 'self',
    "organizationId" INTEGER,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedDate" TIMESTAMP(3),
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SavedSearches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notifications" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(255),
    "icon" VARCHAR(255),
    "message" VARCHAR(500),
    "link" VARCHAR(255),
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedDate" TIMESTAMP(3),
    "read" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER,
    "type" "NotificationType" NOT NULL DEFAULT 'user',
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Country_isoCode_key" ON "Country"("isoCode");

-- CreateIndex
CREATE UNIQUE INDEX "Role_title_key" ON "Role"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Role_slug_key" ON "Role"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_uuid_key" ON "Organization"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_email_key" ON "Organization"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_uuid_key" ON "User"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_userId_roleId_key" ON "UserRole"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "UserMeta_key_userId_key" ON "UserMeta"("key", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Modules_slug_key" ON "Modules"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Permissions_action_moduleId_key" ON "Permissions"("action", "moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermissions_roleId_permissionsId_key" ON "RolePermissions"("roleId", "permissionsId");

-- CreateIndex
CREATE UNIQUE INDEX "StaticPageSEO_sitePageId_key" ON "StaticPageSEO"("sitePageId");

-- CreateIndex
CREATE UNIQUE INDEX "Leads_uuid_key" ON "Leads"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "FaqsCategory_slug_key" ON "FaqsCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Faqs_slug_key" ON "Faqs"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SitePages_slug_key" ON "SitePages"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PagesSection_slug_key" ON "PagesSection"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PagesSection_title_key" ON "PagesSection"("title");

-- CreateIndex
CREATE UNIQUE INDEX "PageSectionRelation_sitePageId_pageSectionId_key" ON "PageSectionRelation"("sitePageId", "pageSectionId");

-- CreateIndex
CREATE UNIQUE INDEX "BlogsCategory_slug_key" ON "BlogsCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Blogs_slug_key" ON "Blogs"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BlogImages_uuid_key" ON "BlogImages"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "AlertsType_slug_key" ON "AlertsType"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "UserAlertsSetting_userId_alertsTypeId_key" ON "UserAlertsSetting"("userId", "alertsTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "SmsConfiguration_slug_senderIdType_key" ON "SmsConfiguration"("slug", "senderIdType");

-- CreateIndex
CREATE UNIQUE INDEX "SmsLogs_uuid_key" ON "SmsLogs"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentGateway_slug_key" ON "PaymentGateway"("slug");

-- AddForeignKey
ALTER TABLE "Country" ADD CONSTRAINT "Country_addedBy_fkey" FOREIGN KEY ("addedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Country" ADD CONSTRAINT "Country_modifiedBy_fkey" FOREIGN KEY ("modifiedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Country" ADD CONSTRAINT "Country_deletedBy_fkey" FOREIGN KEY ("deletedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_addedBy_fkey" FOREIGN KEY ("addedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_modifiedBy_fkey" FOREIGN KEY ("modifiedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_deletedBy_fkey" FOREIGN KEY ("deletedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_addedBy_fkey" FOREIGN KEY ("addedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_modifiedBy_fkey" FOREIGN KEY ("modifiedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_deletedBy_fkey" FOREIGN KEY ("deletedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_addedBy_fkey" FOREIGN KEY ("addedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_modifiedBy_fkey" FOREIGN KEY ("modifiedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_deletedBy_fkey" FOREIGN KEY ("deletedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMeta" ADD CONSTRAINT "UserMeta_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthTokens" ADD CONSTRAINT "AuthTokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permissions" ADD CONSTRAINT "Permissions_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermissions" ADD CONSTRAINT "RolePermissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermissions" ADD CONSTRAINT "RolePermissions_permissionsId_fkey" FOREIGN KEY ("permissionsId") REFERENCES "Permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermissions" ADD CONSTRAINT "RolePermissions_addedBy_fkey" FOREIGN KEY ("addedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaticPageSEO" ADD CONSTRAINT "StaticPageSEO_sitePageId_fkey" FOREIGN KEY ("sitePageId") REFERENCES "SitePages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaticPageSEO" ADD CONSTRAINT "StaticPageSEO_modifiedById_fkey" FOREIGN KEY ("modifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemLogs" ADD CONSTRAINT "SystemLogs_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "Leads_modifiedById_fkey" FOREIGN KEY ("modifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FaqsCategory" ADD CONSTRAINT "FaqsCategory_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "FaqsCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Faqs" ADD CONSTRAINT "Faqs_faqsCategoryId_fkey" FOREIGN KEY ("faqsCategoryId") REFERENCES "FaqsCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageSectionRelation" ADD CONSTRAINT "PageSectionRelation_sitePageId_fkey" FOREIGN KEY ("sitePageId") REFERENCES "SitePages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageSectionRelation" ADD CONSTRAINT "PageSectionRelation_pageSectionId_fkey" FOREIGN KEY ("pageSectionId") REFERENCES "PagesSection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PagesContent" ADD CONSTRAINT "PagesContent_pageSectionId_fkey" FOREIGN KEY ("pageSectionId") REFERENCES "PagesSection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PagesContent" ADD CONSTRAINT "PagesContent_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PagesContent" ADD CONSTRAINT "PagesContent_modifiedById_fkey" FOREIGN KEY ("modifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogsCategory" ADD CONSTRAINT "BlogsCategory_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogsCategory" ADD CONSTRAINT "BlogsCategory_modifiedById_fkey" FOREIGN KEY ("modifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogsCategory" ADD CONSTRAINT "BlogsCategory_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blogs" ADD CONSTRAINT "Blogs_blogCategoryId_fkey" FOREIGN KEY ("blogCategoryId") REFERENCES "BlogsCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blogs" ADD CONSTRAINT "Blogs_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blogs" ADD CONSTRAINT "Blogs_modifiedById_fkey" FOREIGN KEY ("modifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blogs" ADD CONSTRAINT "Blogs_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogImages" ADD CONSTRAINT "BlogImages_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAlertsSetting" ADD CONSTRAINT "UserAlertsSetting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAlertsSetting" ADD CONSTRAINT "UserAlertsSetting_alertsTypeId_fkey" FOREIGN KEY ("alertsTypeId") REFERENCES "AlertsType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAlerts" ADD CONSTRAINT "UserAlerts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SmsConfiguration" ADD CONSTRAINT "SmsConfiguration_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SmsConfiguration" ADD CONSTRAINT "SmsConfiguration_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentGateway" ADD CONSTRAINT "PaymentGateway_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentGateway" ADD CONSTRAINT "PaymentGateway_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentGateway" ADD CONSTRAINT "PaymentGateway_modifiedById_fkey" FOREIGN KEY ("modifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentGateway" ADD CONSTRAINT "PaymentGateway_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_paymentGatewayId_fkey" FOREIGN KEY ("paymentGatewayId") REFERENCES "PaymentGateway"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedSearches" ADD CONSTRAINT "SavedSearches_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
