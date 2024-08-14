-- CreateTable
CREATE TABLE "DashboardElement" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DashboardElement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleDashboardElement" (
    "roleId" INTEGER NOT NULL,
    "dashboardElementId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 9
);

-- CreateIndex
CREATE UNIQUE INDEX "DashboardElement_slug_key" ON "DashboardElement"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "RoleDashboardElement_roleId_dashboardElementId_key" ON "RoleDashboardElement"("roleId", "dashboardElementId");

-- AddForeignKey
ALTER TABLE "RoleDashboardElement" ADD CONSTRAINT "RoleDashboardElement_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleDashboardElement" ADD CONSTRAINT "RoleDashboardElement_dashboardElementId_fkey" FOREIGN KEY ("dashboardElementId") REFERENCES "DashboardElement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
