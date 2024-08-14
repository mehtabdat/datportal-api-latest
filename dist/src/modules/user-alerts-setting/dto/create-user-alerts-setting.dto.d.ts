import { Prisma } from "@prisma/client";
export declare class CreateUserAlertsSettingDto implements Prisma.UserAlertsSettingUncheckedCreateInput {
    alertsTypeId?: number;
    desktop?: boolean;
    mobile?: boolean;
    email?: boolean;
    app?: boolean;
}
