import { baseApi } from "@/store/base-api-rtk";
import type { ApiResponse, PageData } from "@/types/api.types";
import type {
  Notification,
  UnreadCountResponse,
  BroadcastResponse,
  BroadcastNotificationRequest,
  NotificationFilterParams,
} from "../types/notification.types";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<
      PageData<Notification>,
      NotificationFilterParams | void
    >({
      query: (params) => {
        const queryParams: Record<string, unknown> = {};

        // Quy chuẩn §4.2: Chuyển đổi 1-based UI sang 0-based Backend
        if (params?.page && params.page > 0) {
          queryParams.page = params.page - 1;
        } else {
          queryParams.page = 0;
        }

        if (params?.size) {
          queryParams.size = params.size;
        }

        if (params?.read !== undefined && params.read !== null) {
          queryParams.read = params.read;
        }

        if (params?.type) {
          queryParams.type = params.type;
        }

        return {
          url: "/notifications",
          method: "GET",
          params: queryParams,
        };
      },
      transformResponse: (res: ApiResponse<PageData<Notification>>) => res.data,
      providesTags: ["Notification"],
    }),

    getUnreadCount: builder.query<UnreadCountResponse, void>({
      query: () => ({
        url: "/notifications/unread-count",
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<UnreadCountResponse>) => res.data,
      providesTags: ["NotificationUnreadCount"],
    }),

    markAsRead: builder.mutation<Notification, string>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/read`,
        method: "POST",
      }),
      transformResponse: (res: ApiResponse<Notification>) => res.data,
      invalidatesTags: ["Notification", "NotificationUnreadCount"],
    }),

    markAllAsRead: builder.mutation<{ updatedCount: number }, void>({
      query: () => ({
        url: "/notifications/read-all",
        method: "POST",
      }),
      transformResponse: (res: ApiResponse<{ updatedCount: number }>) => res.data,
      invalidatesTags: ["Notification", "NotificationUnreadCount"],
    }),

    deleteNotification: builder.mutation<void, string>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notification", "NotificationUnreadCount"],
    }),

    broadcastNotification: builder.mutation<
      BroadcastResponse,
      BroadcastNotificationRequest
    >({
      query: (body) => ({
        url: "/notifications/broadcast",
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<BroadcastResponse>) => res.data,
      invalidatesTags: ["Notification", "NotificationUnreadCount"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useBroadcastNotificationMutation,
} = notificationApi;

