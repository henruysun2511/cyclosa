"use client";

import React, { useState } from "react";
import { Bell, CheckCheck, Megaphone, Send } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { DataPagination } from "@/components/common/data-pagination";
import { Button } from "@/components/ui/button";
import { PermissionGuard } from "@/features/authorization/components/permission-guard";
import { PERMISSIONS } from "@/features/authorization/constants/permission.constants";
import {
  useNotificationFilters,
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  NotificationFilters,
  NotificationList,
  BroadcastNotificationDialog,
} from "@/features/notification";

export default function NotificationsPage() {
  const [broadcastOpen, setBroadcastOpen] = useState(false);

  const { tab, page, queryParams, setTab, setPage, setSize } =
    useNotificationFilters();

  const { data: countData } = useGetUnreadCountQuery();
  const { data: listData, isLoading } = useGetNotificationsQuery(queryParams);

  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead, { isLoading: isMarkingAll }] = useMarkAllAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const unreadCount = countData?.unreadCount ?? 0;
  const notifications = listData?.items ?? [];
  const pagination = listData?.pagination;

  const handleMarkRead = async (id: string) => {
    try {
      await markAsRead(id).unwrap();
    } catch {
      // Ignored
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead().unwrap();
      toast.success("Đã đánh dấu tất cả thông báo là đã đọc");
    } catch {
      toast.error("Không thể đánh dấu tất cả thông báo đã đọc");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id).unwrap();
      toast.success("Đã xóa thông báo khỏi hòm thư");
    } catch {
      toast.error("Không thể xóa thông báo");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header chuẩn CYCLOSA */}
      <PageHeader
        icon={<Bell className="h-6 w-6 text-primary" />}
        title="Trung tâm Thông báo"
        breadcrumbs={[{ label: "Thông báo" }]}
        action={
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                disabled={isMarkingAll}
                onClick={handleMarkAllRead}
                className="text-xs h-9 gap-1.5"
              >
                <CheckCheck className="h-4 w-4" />
                <span>Đọc tất cả ({unreadCount})</span>
              </Button>
            )}

            <PermissionGuard permission={PERMISSIONS.NOTIFICATION.BROADCAST}>
              <Button
                size="sm"
                onClick={() => setBroadcastOpen(true)}
                className="text-xs h-9 gap-1.5"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Phát thông báo</span>
              </Button>
            </PermissionGuard>
          </div>
        }
      />

      {/* Tabs phân loại thông báo */}
      <NotificationFilters
        activeTab={tab}
        onTabChange={setTab}
        unreadCount={unreadCount}
      />

      {/* Danh sách thông báo */}
      <NotificationList
        notifications={notifications}
        isLoading={isLoading}
        onMarkRead={handleMarkRead}
        onDelete={handleDelete}
      />

      {/* Phân trang chuẩn 0-based/1-based của CYCLOSA */}
      {pagination && pagination.pages > 1 && (
        <div className="pt-2">
          <DataPagination
            pagination={pagination}
            onPageChange={setPage}
            onPageSizeChange={setSize}
          />
        </div>
      )}

      {/* Modal Phát thông báo toàn công ty (Chỉ Admin mở được) */}
      <BroadcastNotificationDialog
        open={broadcastOpen}
        onOpenChange={setBroadcastOpen}
      />
    </div>
  );
}

