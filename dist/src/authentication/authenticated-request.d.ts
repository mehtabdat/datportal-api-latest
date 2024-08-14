import { Request } from "express";
import { AuthenticatedResetToken, AuthenticatedUser, AuthenticatedUserEmail, AuthenticatedUserPhone } from "./jwt-payload";
export type AuthenticatedRequest = Request & {
    user: AuthenticatedUser;
};
export type AuthenticatedPhoneSignupRequest = Request & {
    user: AuthenticatedUserPhone;
};
export type AuthenticatedEmailSignupRequest = Request & {
    user: AuthenticatedUserEmail;
};
export type AuthenticatedPasswordResetRequest = Request & {
    user: AuthenticatedResetToken;
};
