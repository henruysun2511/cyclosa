"use client";

import React, { useState } from "react";
import { Loader2, Globe, ExternalLink, Share2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetRecruitmentChannelsQuery } from "../../api/recruitment-api";
import type { JobOpeningDto, PublishJobPostingPayload } from "../../types/recruitment.types";

interface JobPostingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobOpening: JobOpeningDto | null;
  onSubmit: (payload: PublishJobPostingPayload) => Promise<void>;
  isLoading?: boolean;
}

export function JobPostingDialog({
  open,
  onOpenChange,
  jobOpening,
  onSubmit,
  isLoading = false,
}: JobPostingDialogProps) {
  const { data: channels = [] } = useGetRecruitmentChannelsQuery();
  const [selectedChannelId, setSelectedChannelId] = useState("");
  const [postingUrl, setPostingUrl] = useState("");
  const [externalPostingId, setExternalPostingId] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  if (!jobOpening) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChannelId) return;

    await onSubmit({
      jobOpeningId: jobOpening.id,
      channelId: selectedChannelId,
      postingUrl: postingUrl || undefined,
      externalPostingId: externalPostingId || undefined,
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <Share2 className="h-4 w-4 text-primary" />
            Đăng tin tuyển dụng đa kênh
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Xuất bản vị trí <strong className="text-foreground">{jobOpening.title}</strong> ({jobOpening.code}) lên các sàn việc làm và mạng xã hội.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Chọn kênh tuyển dụng */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">
              Kênh tuyển dụng đối tác <span className="text-destructive">*</span>
            </Label>
            <Select value={selectedChannelId} onValueChange={(val) => setSelectedChannelId(val || "")}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Chọn kênh đăng tin (TopCV, LinkedIn...)">
                  {channels.find((c) => c.id === selectedChannelId)?.name || "Chọn kênh đăng tin"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {channels.length === 0 ? (
                  <>
                    <SelectItem value="chan_topcv" className="text-xs">
                      TopCV Vietnam (Tự động API)
                    </SelectItem>
                    <SelectItem value="chan_linkedin" className="text-xs">
                      LinkedIn Jobs Partner
                    </SelectItem>
                    <SelectItem value="chan_vietnamworks" className="text-xs">
                      VietnamWorks Navigos
                    </SelectItem>
                    <SelectItem value="chan_internal" className="text-xs">
                      Cổng việc làm Nội bộ CYCLOSA
                    </SelectItem>
                  </>
                ) : (
                  channels.map((chan) => (
                    <SelectItem key={chan.id} value={chan.id} className="text-xs">
                      {chan.name} ({chan.code})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Đường link bài đăng */}
          <div className="space-y-1.5">
            <Label htmlFor="postingUrl" className="text-xs font-medium">
              Đường dẫn bài đăng công khai (URL)
            </Label>
            <Input
              id="postingUrl"
              placeholder="https://topcv.vn/viec-lam/..."
              value={postingUrl}
              onChange={(e) => setPostingUrl(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          {/* Mã tin đăng ngoài */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="externalId" className="text-xs font-medium">
                Mã định danh ngoài (nếu có)
              </Label>
              <Input
                id="externalId"
                placeholder="VD: TOPCV-90812"
                value={externalPostingId}
                onChange={(e) => setExternalPostingId(e.target.value)}
                className="h-9 text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="expiresAt" className="text-xs font-medium">
                Hạn tin đăng
              </Label>
              <Input
                id="expiresAt"
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="h-9 text-xs"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!selectedChannelId || isLoading}
              className="h-9 text-xs bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  <span>Đang đăng...</span>
                </>
              ) : (
                <span>Xuất bản tin đăng</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
