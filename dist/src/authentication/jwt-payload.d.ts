export type Organization = {
    id: number;
    uuid: string;
    name: string;
    logo: string;
    status: number;
};
export type UserRoles = {
    ids: Array<number>;
    slugs: Array<string>;
};
export type AuthenticatedUser = {
    userEmail: string;
    userId: number;
    userUid: string;
    roles: UserRoles;
    litmitAccessTo: number[];
    department?: {
        id: number;
        title: string;
        slug: string;
    };
    organization?: Organization;
};
export declare class AuthenticatedUserPhone {
    phone: string;
    phoneCode: string;
    userAgent?: string;
}
export declare class AuthenticatedUserEmail {
    email: string;
    userAgent?: string;
}
export declare class AuthenticatedResetToken {
    uuid: string;
}
