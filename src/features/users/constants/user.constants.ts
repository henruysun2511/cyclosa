export const USER_ENDPOINTS = {
  USERS: "/users",
  RESEND_ACTIVATION: (userId: string) => `/users/${userId}/resend-activation`,
  LOCK: (userId: string) => `/users/${userId}/lock`,
  UNLOCK: (userId: string) => `/users/${userId}/unlock`,
  ROLE_ASSIGNMENTS: (userId: string) => `/users/${userId}/role-assignments`,
  REVOKE_ROLE_ASSIGNMENT: (assignmentId: string) => `/role-assignments/${assignmentId}`,
  EFFECTIVE_PERMISSIONS: (userId: string) => `/users/${userId}/effective-permissions`,
} as const;

export const USER_STATUS = {
  ACTIVE: "ACTIVE",
  PENDING_ACTIVATION: "PENDING_ACTIVATION",
  LOCKED: "LOCKED",
} as const;

export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  ACTIVE: "Đang hoạt động",
  PENDING_ACTIVATION: "Chờ kích hoạt",
  LOCKED: "Đã bị khóa",
};

export const USER_STATUS_BADGE_VARIANTS: Record<
  UserStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  ACTIVE: "default",
  PENDING_ACTIVATION: "secondary",
  LOCKED: "destructive",
};

