export type NotificationType =
  | "WORKFLOW"
  | "CONTRACT"
  | "PAYROLL"
  | "ANNOUNCEMENT"
  | "SYSTEM"
  | "RECRUITMENT";

export interface Notification {
  id: string;
  notificationType: NotificationType;
  title: string;
  content: string;
  actionUrl?: string | null;
  createdAt: string;
  readAt?: string | null;
  isRead: boolean;
}

export interface UnreadCountResponse {
  unreadCount: number;
}

export interface BroadcastResponse {
  recipientsCount: number;
  broadcastAt: string;
}

export interface BroadcastNotificationRequest {
  title: string;
  content: string;
  actionUrl?: string;
}

export interface InternalNotificationRequest {
  userIds: string[];
  notificationType: NotificationType;
  title: string;
  content: string;
  actionUrl?: string;
}

export interface NotificationFilterParams {
  page?: number;
  size?: number;
  read?: boolean;
  type?: NotificationType;
}

export type NotificationTab =
  | "ALL"
  | "UNREAD"
  | "WORKFLOW"
  | "CONTRACT"
  | "PAYROLL"
  | "ANNOUNCEMENT"
  | "SYSTEM"
  | "RECRUITMENT";

