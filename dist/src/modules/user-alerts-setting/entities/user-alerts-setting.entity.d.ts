import { UserAlertsSetting as __UserAlertsSetting } from "@prisma/client";
export declare class UserAlertsSetting implements Partial<__UserAlertsSetting> {
    id: number;
    userId: number | null;
    alertsTypeId: number | null;
    desktop: boolean;
    mobile: boolean;
    email: boolean;
    app: boolean;
    addedDate: Date;
    modifiedDate: Date | null;
}
