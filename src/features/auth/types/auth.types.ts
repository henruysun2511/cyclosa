export interface LoginRequest {
  username: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  userId: string;
  email: string;
  roles: string[];
}

export type LoginResponse = AuthTokenResponse;

export interface UserProfileResponse {
  id: string;
  username?: string | null;
  email: string;
  status: "ACTIVE" | "PENDING_ACTIVATION" | "LOCKED" | "DEACTIVATED";
  roles: string[];
  lastLoginAt?: string | null;
  createdAt?: string | null;
}

export interface UpdateProfileRequest {
  username: string;
}

export interface ActivateAccountRequest {
  token: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
