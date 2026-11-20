"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { bookRoomSchema, type BookRoomValues } from "../../schemas/workplace.schema";
import { useGetMeetingRoomsQuery } from "../../api/workplace-api";

interface RoomBookingFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: BookRoomValues) => Promise<void>;
  isSubmitting?: boolean;
}

export function RoomBookingFormDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
}: RoomBookingFormDialogProps) {
  const { data: meetingRooms = [] } = useGetMeetingRoomsQuery();

  const form = useForm<BookRoomValues>({
    resolver: zodResolver(bookRoomSchema),
    defaultValues: {
      meetingRoomId: "",
      title: "",
      attendeeCount: 4,
      startTime: "",
      endTime: "",
      description: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        meetingRoomId: meetingRooms[0]?.id || "",
        title: "",
        attendeeCount: 4,
        startTime: "",
        endTime: "",
        description: "",
      });
    }
  }, [open, form, meetingRooms]);

  const handleSubmit = async (values: BookRoomValues) => {
    await onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Đặt phòng họp thay mặt
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="meetingRoomId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">Chọn phòng họp *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Chọn phòng họp...">
                          {(val: string) => {
                            if (!val) return "Chọn phòng họp...";
                            const r = meetingRooms.find((item) => item.id === val);
                            return r ? `${r.name} (${r.floorName || "Chung"})` : "Chọn phòng họp...";
                          }}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {meetingRooms.map((room) => (
                        <SelectItem
                          key={room.id}
                          value={room.id}
                          label={`${room.name} (${room.floorName || "Chung"})`}
                        >
                          {room.name} ({room.floorName || "Chung"}) {room.capacity ? `• ${room.capacity} chỗ` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">Tiêu đề / Mục đích cuộc họp *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: Họp giao ban Khối Kỹ thuật & R&D..."
                      className="h-9"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="attendeeCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">Số người dự kiến</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={100}
                      className="h-9"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">Thời gian bắt đầu *</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        className="h-9 text-xs"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">Thời gian kết thúc *</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        className="h-9 text-xs"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">Ghi chú / Yêu cầu chuẩn bị</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ghi chú thêm về thiết bị micro, camera hội nghị trực tuyến..."
                      className="resize-none text-xs min-h-[70px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                Xác nhận đặt phòng
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
