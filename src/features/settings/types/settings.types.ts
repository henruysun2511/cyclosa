import type { UserProfileResponse } from "@/features/auth/types/auth.types";

export type { UserProfileResponse };

export interface UpdateProfileFormValues {
  username: string;
  avatarUrl?: string;
}

export interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export type SettingsTab = "profile" | "security";
