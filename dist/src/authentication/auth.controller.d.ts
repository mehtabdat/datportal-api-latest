import { ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { AuthService } from './auth.service';
import { AuthenticatedEmailSignupRequest, AuthenticatedPasswordResetRequest, AuthenticatedPhoneSignupRequest, AuthenticatedRequest } from './authenticated-request';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { PhoneSignupDto, EmailSignupDto } from './dto/signup.dto';
import { UserLoginDto } from "./dto/user-login.dto";
import { ValidateUserEmail } from './dto/validate-user-email.dto';
import { PasswordResetDto } from './dto/password-reset-dto';
import { ResetUserPassword } from './dto/reset-user-password.dto';
import { ChangeUserPassword } from './dto/change-user-password.dto';
import { ValidateUserOtp } from './dto/validate-user-otp.dto';
import { UpdateUserEmailRequest, ValidateUserEmailOtp } from './dto/update-user-credentials.dto';
import { SystemLogger } from 'src/modules/system-logs/system-logger.service';
import { GoogleTokenVerificationDto } from './dto/google-token-verification.dto';
import { GoogleAuthService } from './google-auth.service';
import { LoginAsUser } from './dto/login-as-user.dto';
import { AuthorizationService } from 'src/authorization/authorization.service';
import { Request } from 'express';
export declare class AuthController {
    private readonly authService;
    private readonly systemLogger;
    private readonly googleAuthService;
    private readonly authorizationService;
    constructor(authService: AuthService, systemLogger: SystemLogger, googleAuthService: GoogleAuthService, authorizationService: AuthorizationService);
    login(userLoginDto: UserLoginDto, req: Request): Promise<ResponseSuccess | ResponseError>;
    loggedInAs(loginAsUser: LoginAsUser, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    googleAuth(req: any): Promise<ResponseSuccess | ResponseError>;
    googleAuthVerify(tokenData: GoogleTokenVerificationDto, req: any): Promise<ResponseSuccess | ResponseError>;
    googleAuthCallback(req: any): Promise<{
        message: string;
        statusCode: number;
        data: {
            userData: any;
            token: {
                access_token: string;
                refresh_token: string;
            };
        };
    }>;
    refresh(req: AuthenticatedRequest, refreshToken: RefreshTokenDto): Promise<ResponseSuccess | ResponseError>;
    refreshAdmin(req: AuthenticatedRequest, refreshToken: RefreshTokenDto): Promise<ResponseSuccess | ResponseError>;
    logout(req: AuthenticatedRequest, refreshToken: RefreshTokenDto): Promise<ResponseSuccess | ResponseError>;
    phoneSignup(signupDto: PhoneSignupDto, req: AuthenticatedPhoneSignupRequest): Promise<ResponseSuccess | ResponseError>;
    emailSignup(signupDto: EmailSignupDto, req: AuthenticatedEmailSignupRequest): Promise<ResponseSuccess | ResponseError>;
    emailLookup(validateUserEmail: ValidateUserEmail, req: any): Promise<ResponseSuccess | ResponseError>;
    sendPasswordResetLink(passwordResetDto: PasswordResetDto, req: any): Promise<ResponseSuccess | ResponseError>;
    resetUserPassword(updateUserPassword: ResetUserPassword, req: AuthenticatedPasswordResetRequest): Promise<ResponseSuccess | ResponseError>;
    changeUserPassword(changeUserPassword: ChangeUserPassword, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    sendCredentialsResetCode(req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    validateUser(validateUserOtp: ValidateUserOtp, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    sendOtpEmail(updateUserEmail: UpdateUserEmailRequest, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    validateAndUpdateUserEmail(validateUserEmailOtp: ValidateUserEmailOtp, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
}
