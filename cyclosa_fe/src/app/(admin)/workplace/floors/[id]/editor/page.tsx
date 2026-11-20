"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Compass,
  ArrowLeft,
  Grid,
  CheckCircle2,
  AlertCircle,
  Armchair,
  Save,
  Send,
  Plus,
  Trash2,
  Copy,
  ZoomIn,
  ZoomOut,
  Sliders,
  SquareDashedBottom,
  Video,
  Coffee,
  DoorClosed,
  Maximize2,
  Minimize2,
  Move,
  Focus,
  RefreshCw,
  Pencil,
  Edit3,
  Palette,
  Users,
  ShieldAlert,
  Scaling,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useGetFloorMapQuery,
  useSaveFloorLayoutMutation,
  usePublishFloorPlanMutation,
  type FloorMapSeat,
  type FloorMapObject,
  type FloorMapZone,
} from "@/features/workplace";

export interface EditorCanvasObject {
  id: string;
  name: string;
  type: "ZONE" | "CLUSTER" | "SEAT" | "MEETING_ROOM" | "FACILITY";
  x: number;
  y: number;
  w: number;
  h: number;
  rotation: number;
  seatType?: "HOT_DESK" | "FIXED_DESK" | "VIP";
  status?: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE" | "BLOCKED";
  zoneId?: string;
  color?: string;
  capacity?: number; // Sức chứa vận hành thực tế (VD: 21 ghế)
  maxCapacityCeiling?: number; // Trần thiết kế vật lý kiến trúc (VD: 30 ghế)
}

export default function FloorPlanEditorPage() {
  const router = useRouter();
  const params = useParams();
  const floorId = (params?.id as string) || "";

  // State các đối tượng vẽ trên sơ đồ
  const [editorObjects, setEditorObjects] = useState<EditorCanvasObject[]>([]);
  const [selectedEditorObjectId, setSelectedEditorObjectId] = useState<string>("");
  const [editorZoom, setEditorZoom] = useState<number>(100);
  const [snapToGrid, setSnapToGrid] = useState<boolean>(true);
  const [isEditorInitialized, setIsEditorInitialized] = useState<boolean>(false);

  // State kéo thả chuột đối tượng (Drag & Drop)
  const [draggingObjectId, setDraggingObjectId] = useState<string | null>(null);
  const [dragStartPos, setDragStartPos] = useState<{
    mouseX: number;
    mouseY: number;
    origX: number;
    origY: number;
  } | null>(null);

  // State co giãn kích thước trực tiếp trên Canvas (Resize Handles)
  const [resizingObjectId, setResizingObjectId] = useState<string | null>(null);
  const [resizeHandle, setResizeHandle] = useState<"se" | "sw" | "ne" | "nw" | "e" | "s" | null>(null);
  const [resizeStartPos, setResizeStartPos] = useState<{
    mouseX: number;
    mouseY: number;
    origX: number;
    origY: number;
    origW: number;
    origH: number;
  } | null>(null);

  // State điều hướng không gian vô hạn (Pan & Fullscreen)
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 40, y: 30 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // State chỉnh sửa tên & thuộc tính nhanh (Double-click hoặc Toolbar)
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState<boolean>(false);
  const [renamingObject, setRenamingObject] = useState<{
    id: string;
    name: string;
    type: string;
    capacity: number;
    maxCapacityCeiling: number;
    currentSeatsCount: number;
    color: string;
    seatType: string;
  } | null>(null);

  // RTK Query: Sơ đồ mặt bằng 2D của tầng
  const {
    data: mapData,
    isLoading: isMapLoading,
    refetch: refetchMap,
  } = useGetFloorMapQuery(floorId, {
    skip: !floorId,
  });

  const [saveFloorLayout, { isLoading: isSavingLayout }] = useSaveFloorLayoutMutation();
  const [publishFloorPlan, { isLoading: isPublishingPlan }] = usePublishFloorPlanMutation();

  // Khởi tạo đối tượng từ mapData (Database)
  useEffect(() => {
    if (!mapData || isEditorInitialized) return;

    // Dọn dẹp bản nháp tạm trong localStorage nếu có
    const draftCacheKey = `cyclosa_floor_editor_draft_${floorId}`;
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(draftCacheKey);
      } catch (e) {
        // ignore
      }
    }

    // 1. Nếu bản vẽ hiện tại có layoutData JSON lưu trong CSDL, khôi phục trực tiếp
    if (mapData.activePlan?.layoutData) {
      try {
        const parsed = JSON.parse(mapData.activePlan.layoutData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEditorObjects(parsed);
          setSelectedEditorObjectId(parsed[0]?.id || "");
          setIsEditorInitialized(true);
          return;
        }
      } catch (e) {
        console.warn("Không parse được layoutData từ database, nạp từ thực thể:", e);
      }
    }

    const loaded: EditorCanvasObject[] = [];

    // Nạp Zones
    if (mapData.zones && mapData.zones.length > 0) {
      mapData.zones.forEach((z) => {
        let x = 60;
        let y = 60;
        let w = 340;
        let h = 240;

        if (z.boundaryPoints && z.boundaryPoints.length >= 4) {
          const xs = z.boundaryPoints.map((p) => p.x);
          const ys = z.boundaryPoints.map((p) => p.y);
          const minX = Math.min(...xs);
          const maxX = Math.max(...xs);
          const minY = Math.min(...ys);
          const maxY = Math.max(...ys);
          if (maxX > minX && maxY > minY) {
            x = minX;
            y = minY;
            w = maxX - minX;
            h = maxY - minY;
          }
        }

        loaded.push({
          id: z.id,
          name: z.name,
          type: "ZONE",
          x,
          y,
          w,
          h,
          rotation: 0,
          color: z.colorHex || "#3B82F6",
          capacity: z.capacity || 16,
          maxCapacityCeiling: z.maxCapacityCeiling || 24,
        });
      });
    }

    // Nạp Seats
    if (mapData.seats && mapData.seats.length > 0) {
      mapData.seats.forEach((seat) => {
        loaded.push({
          id: seat.id,
          name: seat.seatCode,
          type: "SEAT",
          x: seat.x,
          y: seat.y,
          w: seat.width || 56,
          h: seat.height || 44,
          rotation: seat.rotationDegrees || 0,
          seatType: seat.seatType === "DEDICATED" ? "FIXED_DESK" : "HOT_DESK",
          status: seat.currentOccupantName
            ? "OCCUPIED"
            : seat.status === "MAINTENANCE"
            ? "MAINTENANCE"
            : seat.status === "BLOCKED"
            ? "BLOCKED"
            : "AVAILABLE",
          zoneId: seat.seatRowId,
        });
      });
    }

    // Nạp Objects
    const defaultFallbackObjects = [
      {
        id: "room_meeting_1",
        objectType: "MEETING_ROOM",
        name: "Phòng họp Innovation",
        x: 350,
        y: 340,
        width: 280,
        height: 160,
        rotationDegrees: 0,
        capacity: 16,
      },
      {
        id: "room_pantry_1",
        objectType: "PANTRY",
        name: "Khu vực Pantry & Cafe",
        x: 690,
        y: 340,
        width: 240,
        height: 160,
        rotationDegrees: 0,
        capacity: 12,
      },
    ];

    const objectsToLoad =
      mapData.objects && mapData.objects.length > 0 ? mapData.objects : defaultFallbackObjects;

    objectsToLoad.forEach((obj: any) => {
      loaded.push({
        id: obj.id,
        name: obj.name,
        type: obj.objectType === "MEETING_ROOM" ? "MEETING_ROOM" : "FACILITY",
        x: obj.x,
        y: obj.y,
        w: obj.width,
        h: obj.height,
        rotation: obj.rotationDegrees || 0,
        status: "AVAILABLE",
        capacity: obj.capacity || 10,
        maxCapacityCeiling: obj.maxCapacityCeiling || (obj.objectType === "MEETING_ROOM" ? 30 : 20),
      });
    });

    setEditorObjects(loaded);
    setSelectedEditorObjectId(loaded[0]?.id || "");
    setIsEditorInitialized(true);
  }, [mapData, floorId, isEditorInitialized]);

  if (isMapLoading) {
    return (
      <div className="space-y-6 pb-12 p-6">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-[650px] w-full rounded-2xl" />
      </div>
    );
  }

  const floorName = mapData?.floorName || `Tầng ${mapData?.floorNumber || ""}`;
  const activePlan = mapData?.activePlan;
  const activeEditorObject = editorObjects.find((o) => o.id === selectedEditorObjectId) || null;

  // ── HANDLERS THAO TÁC BIÊN TẬP ──
  const handleUpdateEditorObject = (fields: Partial<EditorCanvasObject>) => {
    if (!activeEditorObject) return;
    setEditorObjects((prev) =>
      prev.map((o) => (o.id === activeEditorObject.id ? { ...o, ...fields } : o))
    );
  };

  const handleOpenRename = (obj: EditorCanvasObject) => {
    setSelectedEditorObjectId(obj.id);
    const seatsInside = editorObjects.filter(
      (s) =>
        s.type === "SEAT" &&
        s.x + s.w / 2 >= obj.x &&
        s.x + s.w / 2 <= obj.x + obj.w &&
        s.y + s.h / 2 >= obj.y &&
        s.y + s.h / 2 <= obj.y + obj.h
    ).length;

    const defaultCeiling =
      obj.maxCapacityCeiling ||
      (obj.type === "ZONE" ? 24 : obj.name.toLowerCase().includes("phonebooth") ? 2 : 30);
    const currentCap = obj.capacity || (obj.type === "ZONE" ? 16 : 10);

    setRenamingObject({
      id: obj.id,
      name: obj.name,
      type: obj.type,
      capacity: currentCap,
      maxCapacityCeiling: defaultCeiling,
      currentSeatsCount: seatsInside,
      color: obj.color || "#3B82F6",
      seatType: obj.seatType || "HOT_DESK",
    });
    setIsRenameDialogOpen(true);
  };

  const handleSaveRename = () => {
    if (!renamingObject) return;
    const trimmedName = renamingObject.name.trim();
    if (!trimmedName) {
      toast.warning("Tên / Mã đối tượng không được để trống!");
      return;
    }

    const newCap = Number(renamingObject.capacity) || 1;
    const ceiling = Number(renamingObject.maxCapacityCeiling) || 30;

    if (renamingObject.type === "ZONE" || renamingObject.type === "MEETING_ROOM") {
      // 1. Kiểm tra trần thiết kế vật lý tối đa: Không cho phép chỉnh lớn hơn trần
      if (newCap > ceiling) {
        toast.error(
          `⚠️ Không thể lưu! Sức chứa vận hành (${newCap} ghế) vượt quá trần thiết kế vật lý tối đa của phòng (${ceiling} ghế). Bạn chỉ có thể chỉnh nhỏ hơn hoặc bằng ${ceiling} ghế.`
        );
        return;
      }

      // 2. Kiểm tra số ghế đang có: Không cho phép hạ thấp hơn số ghế đang xếp thực tế
      if (newCap < renamingObject.currentSeatsCount) {
        toast.error(
          `⚠️ Không thể lưu! Hiện đang có ${renamingObject.currentSeatsCount} ghế bên trong "${renamingObject.name}". Bạn không thể hạ sức chứa xuống dưới ${renamingObject.currentSeatsCount} ghế (hãy di chuyển bớt ghế ra ngoài trước).`
        );
        return;
      }
    }

    setEditorObjects((prev) =>
      prev.map((o) =>
        o.id === renamingObject.id
          ? {
              ...o,
              name: trimmedName,
              capacity: newCap,
              maxCapacityCeiling: ceiling,
              color: renamingObject.color,
              seatType: renamingObject.seatType as any,
            }
          : o
      )
    );
    setIsRenameDialogOpen(false);
    toast.success(`Đã cập nhật "${trimmedName}" thành công!`);
  };

  const handleStartResize = (
    e: React.MouseEvent,
    obj: EditorCanvasObject,
    handle: "se" | "sw" | "ne" | "nw" | "e" | "s"
  ) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    setSelectedEditorObjectId(obj.id);
    setResizingObjectId(obj.id);
    setResizeHandle(handle);
    setResizeStartPos({
      mouseX: e.clientX,
      mouseY: e.clientY,
      origX: obj.x,
      origY: obj.y,
      origW: obj.w,
      origH: obj.h,
    });
  };

  const handleAddEditorObject = (type: EditorCanvasObject["type"], subType?: string) => {
    const newId = `obj_${Date.now()}`;
    let newObj: EditorCanvasObject = {
      id: newId,
      name: "Đối tượng mới",
      type,
      x: 120,
      y: 120,
      w: 80,
      h: 60,
      rotation: 0,
    };

    if (type === "SEAT") {
      newObj = {
        ...newObj,
        name: `W${mapData?.floorNumber || "12"}-${Math.floor(10 + Math.random() * 90)}`,
        w: 56,
        h: 44,
        seatType: "HOT_DESK",
        status: "AVAILABLE",
      };
    } else if (type === "ZONE") {
      newObj = {
        ...newObj,
        name: "Phân khu mới (Zone)",
        w: 320,
        h: 220,
        color: "#10B981",
        capacity: 16,
        maxCapacityCeiling: 24,
      };
    } else if (type === "MEETING_ROOM") {
      newObj = {
        ...newObj,
        name: subType === "phonebooth" ? "Phonebooth Focus" : "Phòng Họp Mới",
        w: subType === "phonebooth" ? 80 : 220,
        h: subType === "phonebooth" ? 70 : 140,
        status: "AVAILABLE",
        capacity: subType === "phonebooth" ? 1 : 10,
        maxCapacityCeiling: subType === "phonebooth" ? 2 : 30,
      };
    } else if (type === "FACILITY") {
      newObj = {
        ...newObj,
        name: subType || "Tiện ích văn phòng",
        w: 120,
        h: 80,
      };
    }

    setEditorObjects((prev) => [...prev, newObj]);
    setSelectedEditorObjectId(newId);
    toast.success(`Đã thêm ${newObj.name} vào sơ đồ!`);
  };

  const handleAddBulkSeats = (rows: number, cols: number) => {
    const newSeats: EditorCanvasObject[] = [];
    const startX = 140;
    const startY = 140;
    const spacingX = 75;
    const spacingY = 65;
    const floorPrefix = mapData?.floorNumber || "12";

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const id = `seat_bulk_${Date.now()}_${r}_${c}`;
        const seatNum = String(r * cols + c + 1).padStart(2, "0");
        newSeats.push({
          id,
          name: `W${floorPrefix}-${seatNum}`,
          type: "SEAT",
          x: startX + c * spacingX,
          y: startY + r * spacingY,
          w: 56,
          h: 44,
          rotation: 0,
          seatType: "HOT_DESK",
          status: "AVAILABLE",
        });
      }
    }
    setEditorObjects((prev) => [...prev, ...newSeats]);
    toast.success(`Đã tạo cụm ${rows * cols} bàn làm việc (Ma trận ${rows}×${cols}) thành công!`);
  };

  const handleDuplicateEditorObject = () => {
    if (!activeEditorObject) return;
    const cloneId = `obj_${Date.now()}`;
    const clone: EditorCanvasObject = {
      ...activeEditorObject,
      id: cloneId,
      name: `${activeEditorObject.name} (Copy)`,
      x: activeEditorObject.x + 20,
      y: activeEditorObject.y + 20,
    };
    setEditorObjects((prev) => [...prev, clone]);
    setSelectedEditorObjectId(cloneId);
    toast.info(`Đã nhân bản ${activeEditorObject.name}`);
  };

  const handleDeleteEditorObject = () => {
    if (!activeEditorObject) return;
    setEditorObjects((prev) => prev.filter((o) => o.id !== activeEditorObject.id));
    setSelectedEditorObjectId("");
    toast.info("Đã xóa đối tượng khỏi sơ đồ");
  };

  const handleSaveEditorDraft = async () => {
    try {
      await saveFloorLayout({
        floorId,
        layoutJson: JSON.stringify(editorObjects),
        objects: editorObjects,
      }).unwrap();

      const draftCacheKey = `cyclosa_floor_editor_draft_${floorId}`;
      if (typeof window !== "undefined") {
        localStorage.removeItem(draftCacheKey);
      }
      toast.success(
        `Đã lưu toàn bộ bản nháp sơ đồ ${floorName} vào cơ sở dữ liệu thành công!`
      );
      refetchMap();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể lưu sơ đồ vào cơ sở dữ liệu.");
    }
  };

  const handlePublishDraftPlan = async () => {
    if (!activePlan?.id) {
      toast.warning("Chưa có bản nháp nào cần phát hành.");
      return;
    }
    try {
      // Trước khi publish, tự động lưu lại toàn bộ đối tượng vào database
      await saveFloorLayout({
        floorId,
        layoutJson: JSON.stringify(editorObjects),
        objects: editorObjects,
      }).unwrap();

      await publishFloorPlan(activePlan.id).unwrap();
      const draftCacheKey = `cyclosa_floor_editor_draft_${floorId}`;
      if (typeof window !== "undefined") {
        localStorage.removeItem(draftCacheKey);
      }
      toast.success(`Đã phát hành sơ đồ v${activePlan.versionNo} thành bản chính thức trong cơ sở dữ liệu!`);
      refetchMap();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể phát hành bản vẽ.");
    }
  };

  // ── XỬ LÝ KÉO THẢ (DRAG & DROP) BẰNG CHUỘT TRÊN SƠ ĐỒ CANVAS ──
  const handleStartDrag = (e: React.MouseEvent, obj: EditorCanvasObject) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    setSelectedEditorObjectId(obj.id);
    setDraggingObjectId(obj.id);
    setDragStartPos({
      mouseX: e.clientX,
      mouseY: e.clientY,
      origX: obj.x,
      origY: obj.y,
    });
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && !draggingObjectId) {
      setIsPanning(true);
      setPanStart({
        x: e.clientX - panOffset.x,
        y: e.clientY - panOffset.y,
      });
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    // 0. Co giãn kích thước đối tượng trực tiếp qua Resize Handles (Góc & Cạnh)
    if (resizingObjectId && resizeStartPos && resizeHandle) {
      const scale = editorZoom / 100;
      const deltaX = (e.clientX - resizeStartPos.mouseX) / scale;
      const deltaY = (e.clientY - resizeStartPos.mouseY) / scale;

      const obj = editorObjects.find((o) => o.id === resizingObjectId);
      const minW = obj?.type === "SEAT" ? 44 : 100;
      const minH = obj?.type === "SEAT" ? 36 : 70;

      let newX = resizeStartPos.origX;
      let newY = resizeStartPos.origY;
      let newW = resizeStartPos.origW;
      let newH = resizeStartPos.origH;

      if (resizeHandle === "se" || resizeHandle === "e") {
        newW = Math.max(minW, Math.round(resizeStartPos.origW + deltaX));
      }
      if (resizeHandle === "se" || resizeHandle === "s") {
        newH = Math.max(minH, Math.round(resizeStartPos.origH + deltaY));
      }
      if (resizeHandle === "sw") {
        const potentialW = Math.max(minW, Math.round(resizeStartPos.origW - deltaX));
        newX = resizeStartPos.origX + (resizeStartPos.origW - potentialW);
        newW = potentialW;
        newH = Math.max(minH, Math.round(resizeStartPos.origH + deltaY));
      }
      if (resizeHandle === "ne") {
        newW = Math.max(minW, Math.round(resizeStartPos.origW + deltaX));
        const potentialH = Math.max(minH, Math.round(resizeStartPos.origH - deltaY));
        newY = resizeStartPos.origY + (resizeStartPos.origH - potentialH);
        newH = potentialH;
      }
      if (resizeHandle === "nw") {
        const potentialW = Math.max(minW, Math.round(resizeStartPos.origW - deltaX));
        const potentialH = Math.max(minH, Math.round(resizeStartPos.origH - deltaY));
        newX = resizeStartPos.origX + (resizeStartPos.origW - potentialW);
        newY = resizeStartPos.origY + (resizeStartPos.origH - potentialH);
        newW = potentialW;
        newH = potentialH;
      }

      if (snapToGrid) {
        newW = Math.round(newW / 10) * 10;
        newH = Math.round(newH / 10) * 10;
        newX = Math.round(newX / 10) * 10;
        newY = Math.round(newY / 10) * 10;
      }

      setEditorObjects((prev) =>
        prev.map((o) =>
          o.id === resizingObjectId ? { ...o, x: newX, y: newY, w: newW, h: newH } : o
        )
      );
      return;
    }

    // 1. Kéo thả từng đối tượng
    if (draggingObjectId && dragStartPos) {
      const scale = editorZoom / 100;
      const deltaX = (e.clientX - dragStartPos.mouseX) / scale;
      const deltaY = (e.clientY - dragStartPos.mouseY) / scale;

      let newX = Math.round(dragStartPos.origX + deltaX);
      let newY = Math.round(dragStartPos.origY + deltaY);

      if (snapToGrid) {
        newX = Math.round(newX / 10) * 10;
        newY = Math.round(newY / 10) * 10;
      }

      newX = Math.max(0, Math.min(newX, 3900));
      newY = Math.max(0, Math.min(newY, 2900));

      setEditorObjects((prev) =>
        prev.map((o) => (o.id === draggingObjectId ? { ...o, x: newX, y: newY } : o))
      );
      return;
    }

    // 2. Kéo rê nền (Pan toàn bộ không gian)
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleCanvasMouseUp = () => {
    // 0. Kết thúc co giãn kích thước
    if (resizingObjectId) {
      const resized = editorObjects.find((o) => o.id === resizingObjectId);
      if (resized) {
        toast.info(`Đã điều chỉnh kích thước "${resized.name}": ${resized.w} × ${resized.h} px`);
      }
      setResizingObjectId(null);
      setResizeHandle(null);
      setResizeStartPos(null);
      return;
    }
    if (draggingObjectId && dragStartPos) {
      const draggedSeat = editorObjects.find((o) => o.id === draggingObjectId);
      if (draggedSeat && draggedSeat.type === "SEAT") {
        const centerX = draggedSeat.x + draggedSeat.w / 2;
        const centerY = draggedSeat.y + draggedSeat.h / 2;

        // Tìm phân khu hoặc phòng họp mà chiếc ghế đang nằm trong
        const targetContainer = editorObjects.find(
          (c) =>
            (c.type === "ZONE" || c.type === "MEETING_ROOM") &&
            centerX >= c.x &&
            centerX <= c.x + c.w &&
            centerY >= c.y &&
            centerY <= c.y + c.h
        );

        if (targetContainer) {
          // Đếm số ghế KHÁC đang có trong khu này
          const otherSeatsInContainer = editorObjects.filter(
            (s) =>
              s.type === "SEAT" &&
              s.id !== draggedSeat.id &&
              s.x + s.w / 2 >= targetContainer.x &&
              s.x + s.w / 2 <= targetContainer.x + targetContainer.w &&
              s.y + s.h / 2 >= targetContainer.y &&
              s.y + s.h / 2 <= targetContainer.y + targetContainer.h
          );

          const maxCapacity =
            targetContainer.capacity || (targetContainer.type === "ZONE" ? 16 : 10);

          if (otherSeatsInContainer.length >= maxCapacity) {
            // ĐÃ ĐẦY SỨC CHỨA -> BÁO LỖI VÀ CHẶN (HOÀN TÁC VỀ VỊ TRÍ CŨ)
            toast.error(
              `⚠️ Khu vực "${targetContainer.name}" đã đạt sức chứa tối đa (${otherSeatsInContainer.length}/${maxCapacity} ghế). Hệ thống đã chặn và đưa ghế ${draggedSeat.name} về lại vị trí cũ!`
            );
            setEditorObjects((prev) =>
              prev.map((o) =>
                o.id === draggedSeat.id
                  ? { ...o, x: dragStartPos.origX, y: dragStartPos.origY }
                  : o
              )
            );
            setDraggingObjectId(null);
            setDragStartPos(null);
            setIsPanning(false);
            return;
          } else {
            // Còn chỗ -> Cập nhật zoneId và thông báo
            const wasInDifferentZone = draggedSeat.zoneId !== targetContainer.id;
            setEditorObjects((prev) =>
              prev.map((o) =>
                o.id === draggedSeat.id ? { ...o, zoneId: targetContainer.id } : o
              )
            );
            if (wasInDifferentZone) {
              toast.success(
                `✓ Đã thêm bàn "${draggedSeat.name}" vào "${targetContainer.name}" (${otherSeatsInContainer.length + 1}/${maxCapacity} ghế)`
              );
            }
          }
        } else {
          // Thả ở ngoài mọi khu vực -> Ghế trở thành ghế tự do, cập nhật giảm số lượng khu cũ
          if (draggedSeat.zoneId) {
            const oldZone = editorObjects.find((z) => z.id === draggedSeat.zoneId);
            setEditorObjects((prev) =>
              prev.map((o) => (o.id === draggedSeat.id ? { ...o, zoneId: undefined } : o))
            );
            toast.info(
              `Đã đưa bàn "${draggedSeat.name}" ra khỏi ${oldZone ? `"${oldZone.name}"` : "khu vực cũ"} về khu tự do.`
            );
          }
        }
      }
      setDraggingObjectId(null);
      setDragStartPos(null);
    }
    if (isPanning) {
      setIsPanning(false);
    }
  };

  const handleResetView = () => {
    setPanOffset({ x: 60, y: 40 });
    setEditorZoom(100);
    toast.info("Đã căn giữa sơ đồ mặt bằng");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ── 1. Page Header: Nút Quay lại & Lưu / Phát hành ───────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <Button asChild variant="outline" size="sm" className="h-8 gap-1 text-xs">
              <Link href={`/workplace/floors/${floorId}`}>
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Quay lại Mặt bằng Tầng</span>
              </Link>
            </Button>

            <h1 className="text-xl font-bold tracking-tight flex items-center gap-2 text-foreground">
              <Compass className="w-5 h-5 text-primary shrink-0" />
              <span>Bộ biên tập Bản vẽ Mặt bằng: {floorName}</span>
            </h1>

            {activePlan?.status === "PUBLISHED" ? (
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>v{activePlan.versionNo} chính thức</span>
              </Badge>
            ) : (
              <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-xs gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Bản nháp v{activePlan?.versionNo || 1} (Đang biên tập)</span>
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Kéo thả chuột di chuyển bàn ghế, thêm cụm bàn làm việc, phân khu và phòng họp theo tỉ lệ không gian vô hạn
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={handleSaveEditorDraft}
            disabled={isSavingLayout}
            className="h-9 gap-1.5 bg-background shadow-xs hover:bg-muted text-xs"
          >
            <Save className={cn("h-4 w-4 text-amber-600", isSavingLayout && "animate-spin")} />
            <span>{isSavingLayout ? "Đang lưu CSDL..." : "Lưu bản nháp (Database)"}</span>
          </Button>

          <Button
            size="sm"
            onClick={handlePublishDraftPlan}
            disabled={isPublishingPlan}
            className="h-9 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-xs text-xs"
          >
            <Send className="h-4 w-4" />
            <span>{isPublishingPlan ? "Đang phát hành..." : "Phát hành chính thức"}</span>
          </Button>
        </div>
      </div>

      {/* ── 2. INFINITE CANVAS: KHÔNG GIAN BẢN VẼ VÔ HẠN ─────────────────────── */}
      <div
        className={cn(
          "border border-border bg-card shadow-xs overflow-hidden transition-all duration-200",
          isFullscreen
            ? "fixed inset-0 z-50 bg-background h-screen w-screen flex flex-col rounded-none"
            : "rounded-2xl flex flex-col h-[680px]"
        )}
      >
        {/* Header Canvas Controls */}
        <div className="py-2.5 px-4 border-b border-border bg-muted/20 flex items-center justify-between flex-wrap gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-primary" />
              <span>Infinite Floor Plan Studio (3800 × 2600 px)</span>
            </span>
            <span className="text-[10px] text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded-full">
              {editorObjects.filter((o) => o.type === "SEAT").length} bàn
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium hidden sm:inline-flex items-center gap-1.5">
              <Move className="w-3.5 h-3.5" />
              <span>Bấm giữ chuột vào nền để Pan • Bấm vào bàn để kéo thả di chuyển</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs px-2 gap-1 bg-background"
              onClick={handleResetView}
              title="Căn giữa sơ đồ về góc nhìn ban đầu"
            >
              <Focus className="h-3.5 w-3.5" />
              <span>Căn giữa</span>
            </Button>

            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7"
              onClick={() => setEditorZoom((z) => Math.max(z - 15, 30))}
              title="Thu nhỏ sơ đồ"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <span className="text-[11px] font-mono font-medium px-1 text-muted-foreground min-w-[38px] text-center">
              {editorZoom}%
            </span>
            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7"
              onClick={() => setEditorZoom((z) => Math.min(z + 15, 180))}
              title="Phóng to sơ đồ"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>

            <Button
              size="sm"
              variant={snapToGrid ? "default" : "outline"}
              className="h-7 text-xs ml-1 px-2.5 gap-1"
              onClick={() => setSnapToGrid(!snapToGrid)}
              title="Bắt dính vào bước nhảy lưới 10px khi kéo thả"
            >
              <Grid className="h-3 w-3" />
              <span>Lưới 10px</span>
            </Button>

            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? "Thu nhỏ màn hình" : "Mở rộng toàn màn hình"}
            >
              {isFullscreen ? (
                <Minimize2 className="h-3.5 w-3.5" />
              ) : (
                <Maximize2 className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </div>

        {/* Viewport Không gian làm việc vô tận */}
        <div
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
          className={cn(
            "flex-1 overflow-hidden relative select-none bg-slate-100/90 dark:bg-slate-950/70",
            isPanning ? "cursor-grabbing" : "cursor-grab"
          )}
        >
          {/* Thước đo / Chỉ báo không gian ở góc dưới */}
          <div className="absolute bottom-3 left-3 bg-background/85 backdrop-blur-xs border border-border/70 rounded-lg px-2.5 py-1 text-[10px] font-mono text-muted-foreground z-30 shadow-xs flex items-center gap-2">
            <span>Góc nhìn: X:{panOffset.x} Y:{panOffset.y}</span>
            <span>•</span>
            <span>Tỉ lệ: {editorZoom}%</span>
            <span>•</span>
            <span>Không gian vô hạn: 3800 × 2600 px</span>
          </div>

          {/* Bản vẽ không gian cực rộng mở không giới hạn */}
          <div
            className="absolute origin-top-left transition-transform duration-75"
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${editorZoom / 100})`,
              width: "3800px",
              height: "2600px",
              backgroundImage:
                "radial-gradient(circle, rgba(148, 163, 184, 0.4) 1.2px, transparent 1.2px)",
              backgroundSize: "24px 24px",
              backgroundColor: "rgba(255, 255, 255, 0.65)",
            }}
          >
            {/* Đường bao ranh giới kiến trúc tầng */}
            <div className="absolute inset-8 border-2 border-dashed border-slate-300 dark:border-slate-700/80 rounded-3xl pointer-events-none" />

            {editorObjects.map((obj) => {
              const isSelected = selectedEditorObjectId === obj.id;
              const isDragging = draggingObjectId === obj.id;

              // Thanh công cụ nổi tiện lợi trên đầu đối tượng đang chọn
              const renderFloatingToolbar = () => {
                if (!isSelected || isDragging || resizingObjectId) return null;
                return (
                  <div
                    className="absolute -top-11 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-slate-900/95 text-white px-2.5 py-1 rounded-lg shadow-xl z-50 text-[10.5px] border border-slate-700 pointer-events-auto backdrop-blur-sm animate-fadeIn"
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <span className="font-mono font-semibold max-w-[110px] truncate text-slate-200">{obj.name}</span>
                    <span className="text-slate-600">|</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenRename(obj);
                      }}
                      className="px-1.5 py-0.5 hover:text-emerald-400 hover:bg-slate-800 rounded transition-colors flex items-center gap-1 font-medium text-emerald-400"
                      title="Đổi tên & Sức chứa (Nhấp đúp chuột)"
                    >
                      <Pencil className="w-3 h-3" />
                      <span>Sửa</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicateEditorObject();
                      }}
                      className="p-1 hover:text-blue-400 hover:bg-slate-800 rounded transition-colors"
                      title="Nhân bản đối tượng"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEditorObject();
                      }}
                      className="p-1 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                      title="Xóa đối tượng"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              };

              // Điểm neo co giãn kích thước trực tiếp (Interactive Resize Handles)
              const renderResizeHandles = () => {
                if (!isSelected || isDragging) return null;
                return (
                  <>
                    {/* 4 Góc co giãn */}
                    <div
                      onMouseDown={(e) => handleStartResize(e, obj, "nw")}
                      className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-primary rounded-xs cursor-nwse-resize z-40 hover:scale-125 shadow-xs transition-transform"
                      title="Kéo co giãn Tây Bắc"
                    />
                    <div
                      onMouseDown={(e) => handleStartResize(e, obj, "ne")}
                      className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-primary rounded-xs cursor-nesw-resize z-40 hover:scale-125 shadow-xs transition-transform"
                      title="Kéo co giãn Đông Bắc"
                    />
                    <div
                      onMouseDown={(e) => handleStartResize(e, obj, "sw")}
                      className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-primary rounded-xs cursor-nesw-resize z-40 hover:scale-125 shadow-xs transition-transform"
                      title="Kéo co giãn Tây Nam"
                    />
                    <div
                      onMouseDown={(e) => handleStartResize(e, obj, "se")}
                      className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-primary text-white border-2 border-white rounded-xs cursor-nwse-resize z-40 hover:scale-125 shadow-xs transition-transform flex items-center justify-center font-bold text-[8px]"
                      title="Kéo co giãn góc Đông Nam (Phóng to / Thu nhỏ)"
                    />
                    {/* 2 Cạnh co giãn */}
                    <div
                      onMouseDown={(e) => handleStartResize(e, obj, "e")}
                      className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-2 h-4 bg-white border-2 border-primary rounded-xs cursor-ew-resize z-40 hover:scale-125 shadow-xs transition-transform"
                      title="Kéo giãn chiều rộng"
                    />
                    <div
                      onMouseDown={(e) => handleStartResize(e, obj, "s")}
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-2 bg-white border-2 border-primary rounded-xs cursor-ns-resize z-40 hover:scale-125 shadow-xs transition-transform"
                      title="Kéo giãn chiều cao"
                    />
                  </>
                );
              };

              // 1. Phân khu (ZONE)
              if (obj.type === "ZONE") {
                const seatsInThisZone = editorObjects.filter(
                  (s) =>
                    s.type === "SEAT" &&
                    s.x + s.w / 2 >= obj.x &&
                    s.x + s.w / 2 <= obj.x + obj.w &&
                    s.y + s.h / 2 >= obj.y &&
                    s.y + s.h / 2 <= obj.y + obj.h
                );
                const maxCap = obj.capacity || 16;
                const isFull = seatsInThisZone.length >= maxCap;

                return (
                  <div
                    key={obj.id}
                    onMouseDown={(e) => handleStartDrag(e, obj)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      handleOpenRename(obj);
                    }}
                    className={cn(
                      "absolute border-2 border-dashed rounded-xl cursor-grab active:cursor-grabbing transition-all flex flex-col justify-between p-2.5 group",
                      isSelected
                        ? "border-primary ring-2 ring-primary/50 bg-primary/5 z-10 shadow-sm"
                        : isFull
                        ? "border-rose-400 bg-rose-50/20"
                        : "border-blue-400/80 bg-blue-50/20 hover:border-blue-500",
                      isDragging && "cursor-grabbing ring-3 ring-primary shadow-xl z-50 opacity-90",
                      resizingObjectId === obj.id && "ring-2 ring-primary border-primary"
                    )}
                    style={{
                      left: `${obj.x}px`,
                      top: `${obj.y}px`,
                      width: `${obj.w}px`,
                      height: `${obj.h}px`,
                      transform: `rotate(${obj.rotation}deg)`,
                      borderColor: isFull ? "#f43f5e" : obj.color || "#3B82F6",
                    }}
                    title="Kéo di chuyển • Co giãn góc SE • Nhấp đúp đổi tên & sức chứa"
                  >
                    {renderFloatingToolbar()}
                    {renderResizeHandles()}

                    {/* Thước đo kích thước thời gian thực khi co giãn */}
                    {resizingObjectId === obj.id && (
                      <div className="absolute -top-7 right-0 bg-slate-900 text-white font-mono text-[9px] px-1.5 py-0.5 rounded shadow z-50 whitespace-nowrap border border-slate-700 animate-pulse">
                        {obj.w} × {obj.h} px
                      </div>
                    )}

                    {isSelected && (
                      <div className="absolute -bottom-6 left-2 bg-slate-900/90 text-white text-[9px] font-mono px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap z-50 pointer-events-none">
                        X:{obj.x} Y:{obj.y}
                      </div>
                    )}
                    <div className="flex items-center justify-between gap-1 pointer-events-none">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border shadow-2xs truncate"
                          style={{
                            color: isFull ? "#e11d48" : obj.color || "#3B82F6",
                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                            borderColor: `${obj.color}40` || "#3B82F640",
                          }}
                        >
                          {obj.name}
                        </span>
                      </div>
                      <span
                        className={cn(
                          "text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold border shadow-2xs shrink-0",
                          isFull
                            ? "bg-rose-100 text-rose-700 border-rose-300"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        )}
                      >
                        {seatsInThisZone.length}/{maxCap} ghế {isFull && "• ĐẦY"}
                        <span className="opacity-60 ml-1 font-normal font-sans">(Trần: {obj.maxCapacityCeiling || 24})</span>
                      </span>
                    </div>
                    <span className="text-[9px] text-muted-foreground font-mono self-end pointer-events-none">
                      {obj.w}×{obj.h} px
                    </span>
                  </div>
                );
              }

              // 2. Bàn làm việc (SEAT)
              if (obj.type === "SEAT") {
                let statusBg = "bg-emerald-500 border-emerald-600 text-white";
                if (obj.status === "OCCUPIED") {
                  statusBg = "bg-blue-600 border-blue-700 text-white";
                } else if (obj.status === "MAINTENANCE") {
                  statusBg = "bg-amber-500 border-amber-600 text-white";
                } else if (obj.status === "BLOCKED") {
                  statusBg = "bg-rose-500 border-rose-600 text-white";
                }

                return (
                  <div
                    key={obj.id}
                    onMouseDown={(e) => handleStartDrag(e, obj)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      handleOpenRename(obj);
                    }}
                    className={cn(
                      "absolute rounded-lg border-2 flex flex-col items-center justify-center p-1 cursor-grab active:cursor-grabbing transition-all shadow-xs z-20 hover:scale-105",
                      statusBg,
                      isSelected && "ring-3 ring-primary ring-offset-2 scale-105 z-30 shadow-md",
                      isDragging && "cursor-grabbing ring-3 ring-primary ring-offset-2 scale-110 z-50 shadow-2xl opacity-90",
                      resizingObjectId === obj.id && "ring-2 ring-primary"
                    )}
                    style={{
                      left: `${obj.x}px`,
                      top: `${obj.y}px`,
                      width: `${obj.w}px`,
                      height: `${obj.h}px`,
                      transform: `rotate(${obj.rotation}deg)`,
                    }}
                    title="Kéo di chuyển • Co giãn góc • Nhấp đúp để đổi mã bàn"
                  >
                    {renderFloatingToolbar()}
                    {renderResizeHandles()}

                    {/* Thước đo khi co giãn */}
                    {resizingObjectId === obj.id && (
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white font-mono text-[9px] px-1.5 py-0.5 rounded shadow z-50 whitespace-nowrap border border-slate-700 animate-pulse">
                        {obj.w}×{obj.h}
                      </div>
                    )}

                    <span className="text-[9px] font-bold font-mono leading-none pointer-events-none">{obj.name}</span>
                    <span className="text-[7.5px] opacity-85 mt-0.5 pointer-events-none">
                      {obj.seatType === "HOT_DESK" ? "Hot" : "Fix"}
                    </span>
                  </div>
                );
              }

              // 3. Phòng họp (MEETING_ROOM)
              if (obj.type === "MEETING_ROOM") {
                const seatsInThisRoom = editorObjects.filter(
                  (s) =>
                    s.type === "SEAT" &&
                    s.x + s.w / 2 >= obj.x &&
                    s.x + s.w / 2 <= obj.x + obj.w &&
                    s.y + s.h / 2 >= obj.y &&
                    s.y + s.h / 2 <= obj.y + obj.h
                );
                const roomMaxCap = obj.capacity || 10;
                const isRoomFull = seatsInThisRoom.length >= roomMaxCap;

                return (
                  <div
                    key={obj.id}
                    onMouseDown={(e) => handleStartDrag(e, obj)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      handleOpenRename(obj);
                    }}
                    className={cn(
                      "absolute rounded-2xl border-2 p-3 flex flex-col justify-between cursor-grab active:cursor-grabbing transition-all bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-400 text-foreground shadow-xs z-20 hover:border-indigo-500",
                      isSelected && "ring-3 ring-primary ring-offset-2 z-30 shadow-md",
                      isRoomFull && "border-rose-400 bg-rose-50/30",
                      isDragging && "cursor-grabbing ring-3 ring-primary ring-offset-2 z-50 shadow-2xl opacity-90 scale-[1.02]",
                      resizingObjectId === obj.id && "ring-2 ring-primary border-primary"
                    )}
                    style={{
                      left: `${obj.x}px`,
                      top: `${obj.y}px`,
                      width: `${obj.w}px`,
                      height: `${obj.h}px`,
                      transform: `rotate(${obj.rotation}deg)`,
                    }}
                    title="Kéo di chuyển • Co giãn góc SE • Nhấp đúp để đổi tên & sức chứa"
                  >
                    {renderFloatingToolbar()}
                    {renderResizeHandles()}

                    {/* Thước đo khi co giãn */}
                    {resizingObjectId === obj.id && (
                      <div className="absolute -top-7 right-0 bg-slate-900 text-white font-mono text-[9px] px-1.5 py-0.5 rounded shadow z-50 whitespace-nowrap border border-slate-700 animate-pulse">
                        {obj.w} × {obj.h} px
                      </div>
                    )}

                    {isSelected && (
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-[9px] font-mono px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap z-50 pointer-events-none">
                        X:{obj.x} Y:{obj.y}
                      </div>
                    )}
                    <div className="flex items-center justify-between gap-1.5 pointer-events-none">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Video className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span className="text-[11px] font-bold truncate">{obj.name}</span>
                      </div>
                      <span
                        className={cn(
                          "text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold border shrink-0",
                          isRoomFull
                            ? "bg-rose-100 text-rose-700 border-rose-300"
                            : "bg-background/80 text-foreground border-border"
                        )}
                      >
                        {seatsInThisRoom.length}/{roomMaxCap} ghế {isRoomFull && "• ĐẦY"}
                        <span className="opacity-60 ml-1 font-normal font-sans">(Trần: {obj.maxCapacityCeiling || 30})</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-muted-foreground pt-1 border-t border-border/40 pointer-events-none">
                      <span>{isRoomFull ? "⚠️ Đã đủ ghế" : "Sức chứa tối đa"}</span>
                      <span className="font-mono">{obj.w}×{obj.h}</span>
                    </div>
                  </div>
                );
              }

              // 4. Tiện ích (FACILITY)
              return (
                <div
                  key={obj.id}
                  onMouseDown={(e) => handleStartDrag(e, obj)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    handleOpenRename(obj);
                  }}
                  className={cn(
                    "absolute rounded-2xl border-2 p-3 flex flex-col justify-between cursor-grab active:cursor-grabbing transition-all bg-amber-50/80 dark:bg-amber-950/40 border-amber-400 text-foreground shadow-xs z-20 hover:border-amber-500",
                    isSelected && "ring-3 ring-primary ring-offset-2 z-30 shadow-md",
                    isDragging && "cursor-grabbing ring-3 ring-primary ring-offset-2 z-50 shadow-2xl opacity-90 scale-[1.02]",
                    resizingObjectId === obj.id && "ring-2 ring-primary border-primary"
                  )}
                  style={{
                    left: `${obj.x}px`,
                    top: `${obj.y}px`,
                    width: `${obj.w}px`,
                    height: `${obj.h}px`,
                    transform: `rotate(${obj.rotation}deg)`,
                  }}
                  title="Kéo di chuyển • Co giãn góc • Nhấp đúp để đổi tên tiện ích"
                >
                  {renderFloatingToolbar()}
                  {renderResizeHandles()}

                  {/* Thước đo khi co giãn */}
                  {resizingObjectId === obj.id && (
                    <div className="absolute -top-7 right-0 bg-slate-900 text-white font-mono text-[9px] px-1.5 py-0.5 rounded shadow z-50 whitespace-nowrap border border-slate-700 animate-pulse">
                      {obj.w} × {obj.h} px
                    </div>
                  )}

                  {isSelected && (
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-[9px] font-mono px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap z-50 pointer-events-none">
                      X:{obj.x} Y:{obj.y}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 pointer-events-none">
                    <Coffee className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="text-[11px] font-bold truncate">{obj.name}</span>
                  </div>
                  <span className="text-[9px] text-muted-foreground font-mono self-end pointer-events-none">
                    {obj.w}×{obj.h} px
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 3. PANEL BỘ CÔNG CỤ VẼ & BẢNG THUỘC TÍNH (INSPECTOR) ───────────── */}
      <Card className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* CỘT TRÁI: PALETTE THƯ VIỆN THÊM ĐỐI TƯỢNG (5 cols) */}
            <div className="lg:col-span-5 space-y-4 border-r border-border/70 pr-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-primary" />
                  <span>Thư viện công cụ vẽ</span>
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Bấm để chèn nhanh bàn làm việc, cụm bàn hoặc phân khu lên Canvas ở trên
                </p>
              </div>

              {/* Nhóm 1: Bàn làm việc & Cụm bàn */}
              <div className="space-y-2">
                <span className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Bàn làm việc & Cụm bàn
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddEditorObject("SEAT")}
                    className="h-8 text-xs justify-start border-border bg-background shadow-2xs gap-1.5"
                  >
                    <Armchair className="w-3.5 h-3.5 text-emerald-600" />
                    <span>+ Thêm 1 bàn lẻ</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddBulkSeats(2, 4)}
                    className="h-8 text-xs justify-start border-border bg-background shadow-2xs gap-1.5"
                  >
                    <Grid className="w-3.5 h-3.5 text-purple-600" />
                    <span>+ Cụm 8 bàn (2×4)</span>
                  </Button>
                </div>
              </div>

              {/* Nhóm 2: Phân khu & Phòng họp */}
              <div className="space-y-2">
                <span className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Phân khu & Không gian họp
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddEditorObject("ZONE")}
                    className="h-8 text-xs justify-start border-dashed border-border bg-background shadow-2xs gap-1.5"
                  >
                    <SquareDashedBottom className="w-3.5 h-3.5 text-blue-600" />
                    <span>+ Thêm Phân khu</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddEditorObject("MEETING_ROOM")}
                    className="h-8 text-xs justify-start border-border bg-background shadow-2xs gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5 text-indigo-600" />
                    <span>+ Phòng họp</span>
                  </Button>
                </div>
              </div>

              {/* Nhóm 3: Tiện ích & Phonebooth */}
              <div className="space-y-2">
                <span className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Tiện ích & Phonebooth
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddEditorObject("MEETING_ROOM", "phonebooth")}
                    className="h-8 text-xs justify-start border-border bg-background shadow-2xs gap-1.5"
                  >
                    <DoorClosed className="w-3.5 h-3.5 text-amber-600" />
                    <span>+ Phonebooth Focus</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddEditorObject("FACILITY", "Pantry & Cafe")}
                    className="h-8 text-xs justify-start border-border bg-background shadow-2xs gap-1.5"
                  >
                    <Coffee className="w-3.5 h-3.5 text-orange-600" />
                    <span>+ Pantry & Cafe</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* CỘT PHẢI: BẢNG ĐIỀU KHIỂN THUỘC TÍNH (INSPECTOR) (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-primary" />
                  <span>Thuộc tính đối tượng đang chọn</span>
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Điều chỉnh tọa độ, kích thước, góc xoay hoặc loại chỗ ngồi của đối tượng đã chọn trên sơ đồ
                </p>
              </div>

              {activeEditorObject ? (
                <div className="p-3.5 rounded-xl border border-border/80 bg-muted/20 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-2">
                    <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                      <Armchair className="w-3.5 h-3.5" />
                      <span>Đang chọn: {activeEditorObject.name}</span>
                    </span>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {activeEditorObject.type}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Pencil className="w-3 h-3 text-primary" />
                          <span>Tên / Mã đối tượng</span>
                        </span>
                        <span className="text-[10px] text-primary/80">Nhấp đúp sơ đồ để sửa</span>
                      </Label>
                      <Input
                        value={activeEditorObject.name}
                        onChange={(e) => handleUpdateEditorObject({ name: e.target.value })}
                        className="h-8 text-xs font-semibold bg-background"
                        placeholder="VD: Phân khu Marketing, W12-01..."
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Góc xoay (°)</Label>
                      <div className="flex gap-1">
                        {[0, 90, 180, 270].map((deg) => (
                          <Button
                            key={deg}
                            type="button"
                            size="sm"
                            variant={activeEditorObject.rotation === deg ? "default" : "outline"}
                            onClick={() => handleUpdateEditorObject({ rotation: deg })}
                            className="flex-1 h-8 text-[11px] font-mono"
                          >
                            {deg}°
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="space-y-1">
                      <Label className="text-[10.5px] text-muted-foreground">Tọa độ X</Label>
                      <Input
                        type="number"
                        value={activeEditorObject.x}
                        onChange={(e) =>
                          handleUpdateEditorObject({ x: parseInt(e.target.value) || 0 })
                        }
                        className="h-8 text-xs font-mono bg-background"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10.5px] text-muted-foreground">Tọa độ Y</Label>
                      <Input
                        type="number"
                        value={activeEditorObject.y}
                        onChange={(e) =>
                          handleUpdateEditorObject({ y: parseInt(e.target.value) || 0 })
                        }
                        className="h-8 text-xs font-mono bg-background"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10.5px] text-muted-foreground">Chiều rộng (W)</Label>
                      <Input
                        type="number"
                        value={activeEditorObject.w}
                        onChange={(e) =>
                          handleUpdateEditorObject({ w: parseInt(e.target.value) || 10 })
                        }
                        className="h-8 text-xs font-mono bg-background"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10.5px] text-muted-foreground">Chiều cao (H)</Label>
                      <Input
                        type="number"
                        value={activeEditorObject.h}
                        onChange={(e) =>
                          handleUpdateEditorObject({ h: parseInt(e.target.value) || 10 })
                        }
                        className="h-8 text-xs font-mono bg-background"
                      />
                    </div>
                  </div>

                  {/* Sức chứa và màu sắc nếu là ZONE hoặc MEETING_ROOM */}
                  {(activeEditorObject.type === "ZONE" || activeEditorObject.type === "MEETING_ROOM") && (
                    <div className="space-y-3 pt-2 border-t border-border/40">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-[11px] text-muted-foreground flex items-center justify-between">
                            <span className="flex items-center gap-1.5 font-medium text-foreground">
                              <Users className="w-3.5 h-3.5 text-primary" />
                              <span>Sức chứa vận hành (Max)</span>
                            </span>
                            <span className="text-[10px] font-mono text-primary font-semibold">
                              Hiện có: {editorObjects.filter((s) => s.type === "SEAT" && s.x + s.w/2 >= activeEditorObject.x && s.x + s.w/2 <= activeEditorObject.x + activeEditorObject.w && s.y + s.h/2 >= activeEditorObject.y && s.y + s.h/2 <= activeEditorObject.y + activeEditorObject.h).length} ghế
                            </span>
                          </Label>
                          <Input
                            type="number"
                            min={1}
                            max={activeEditorObject.maxCapacityCeiling || 30}
                            value={activeEditorObject.capacity || (activeEditorObject.type === "ZONE" ? 16 : 10)}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 1;
                              const ceiling = activeEditorObject.maxCapacityCeiling || (activeEditorObject.type === "ZONE" ? 24 : 30);
                              if (val > ceiling) {
                                toast.error(`Không được vượt quá trần thiết kế vật lý (${ceiling} ghế)!`);
                                return;
                              }
                              handleUpdateEditorObject({ capacity: val });
                            }}
                            className="h-8 text-xs font-mono bg-background font-semibold"
                          />
                          <span className="text-[10px] text-muted-foreground block">
                            Cho phép chỉnh nhỏ hơn trần (VD: từ 30 xuống 21).
                          </span>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-[11px] text-muted-foreground flex items-center gap-1.5 font-medium text-foreground">
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                            <span>Trần thiết kế tối đa (Cố định)</span>
                          </Label>
                          <Input
                            type="number"
                            min={activeEditorObject.capacity || 1}
                            max={100}
                            value={activeEditorObject.maxCapacityCeiling || (activeEditorObject.type === "ZONE" ? 24 : 30)}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 1;
                              handleUpdateEditorObject({ maxCapacityCeiling: val });
                            }}
                            className="h-8 text-xs font-mono bg-muted/30 font-semibold"
                          />
                          <span className="text-[10px] text-muted-foreground block">
                            Trần tối đa theo diện tích/PCCC. Không thể xếp vượt số này.
                          </span>
                        </div>
                      </div>

                      {activeEditorObject.type === "ZONE" && (
                        <div className="space-y-1">
                          <Label className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                            <Palette className="w-3.5 h-3.5 text-primary" />
                            <span>Màu viền phân khu</span>
                          </Label>
                          <div className="flex items-center gap-1.5 pt-1">
                            {[
                              { hex: "#10B981", label: "Xanh lá" },
                              { hex: "#3B82F6", label: "Xanh dương" },
                              { hex: "#6366F1", label: "Tím Indigo" },
                              { hex: "#F59E0B", label: "Cam Vàng" },
                              { hex: "#EC4899", label: "Hồng" },
                              { hex: "#64748B", label: "Xám" },
                            ].map((c) => (
                              <button
                                key={c.hex}
                                type="button"
                                onClick={() => handleUpdateEditorObject({ color: c.hex })}
                                className={cn(
                                  "w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 shadow-xs",
                                  activeEditorObject.color === c.hex
                                    ? "ring-2 ring-primary ring-offset-2 scale-110 border-white"
                                    : "border-transparent"
                                )}
                                style={{ backgroundColor: c.hex }}
                                title={c.label}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Loại bàn nếu là SEAT */}
                  {activeEditorObject.type === "SEAT" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="space-y-1">
                        <Label className="text-[11px] text-muted-foreground">Loại bàn làm việc</Label>
                        <Select
                          value={activeEditorObject.seatType || "HOT_DESK"}
                          onValueChange={(val) =>
                            handleUpdateEditorObject({
                              seatType: val as EditorCanvasObject["seatType"],
                            })
                          }
                        >
                          <SelectTrigger className="w-full h-8 px-2.5 rounded-lg border border-border bg-background text-xs">
                            <SelectValue placeholder="Chọn loại bàn" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="HOT_DESK">HOT_DESK (Bàn linh hoạt)</SelectItem>
                            <SelectItem value="FIXED_DESK">FIXED_DESK (Bàn cố định)</SelectItem>
                            <SelectItem value="VIP">VIP_DESK (Lãnh đạo)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-[11px] text-muted-foreground">Trạng thái bàn</Label>
                        <Select
                          value={activeEditorObject.status || "AVAILABLE"}
                          onValueChange={(val) =>
                            handleUpdateEditorObject({
                              status: val as EditorCanvasObject["status"],
                            })
                          }
                        >
                          <SelectTrigger className="w-full h-8 px-2.5 rounded-lg border border-border bg-background text-xs">
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AVAILABLE">Sẵn sàng sử dụng</SelectItem>
                            <SelectItem value="OCCUPIED">Đang có người ngồi</SelectItem>
                            <SelectItem value="MAINTENANCE">Đang bảo trì</SelectItem>
                            <SelectItem value="BLOCKED">Bị khóa tạm thời</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* Nút Thao tác: Nhân bản & Xóa */}
                  <div className="pt-2 border-t border-border/50 flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleDuplicateEditorObject}
                        className="h-8 text-xs gap-1 border-border bg-background"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        <span>Nhân bản</span>
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleDeleteEditorObject}
                        className="h-8 text-xs gap-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Xóa đối tượng</span>
                      </Button>
                    </div>

                    <span className="text-[10px] text-muted-foreground">
                      Thay đổi được áp dụng ngay trên sơ đồ Canvas phía trên
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-8 border border-dashed rounded-xl bg-muted/10 text-center space-y-2">
                  <Sliders className="w-8 h-8 mx-auto text-muted-foreground/40" />
                  <p className="text-xs font-medium text-foreground">
                    Chưa chọn đối tượng nào trên sơ đồ
                  </p>
                  <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
                    Click vào bất kỳ bàn, phân khu hoặc phòng họp trên sơ đồ Canvas ở trên để điều chỉnh thuộc tính, tọa độ và góc xoay.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── DIALOG CHỈNH SỬA TÊN & SỨC CHỨA NHANH (DOUBLE-CLICK HOẶC FLOATING TOOLBAR) ── */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
              <Pencil className="w-4 h-4 text-primary" />
              <span>
                Đổi tên / Thuộc tính{" "}
                {renamingObject?.type === "ZONE"
                  ? "Phân khu"
                  : renamingObject?.type === "MEETING_ROOM"
                  ? "Phòng họp"
                  : renamingObject?.type === "SEAT"
                  ? "Bàn làm việc"
                  : "Tiện ích"}
              </span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Nhập tên mới hoặc điều chỉnh sức chứa tối đa. Nhấn Enter để lưu nhanh.
            </DialogDescription>
          </DialogHeader>

          {renamingObject && (
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Tên / Mã đối tượng</Label>
                <Input
                  value={renamingObject.name}
                  onChange={(e) =>
                    setRenamingObject({ ...renamingObject, name: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSaveRename();
                    }
                  }}
                  autoFocus
                  placeholder="Nhập tên khu vực / phòng / mã bàn..."
                  className="h-9 text-sm font-medium"
                />
              </div>

              {(renamingObject.type === "ZONE" || renamingObject.type === "MEETING_ROOM") && (
                <div className="space-y-3 p-3 rounded-xl border border-border/80 bg-muted/20">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-primary" />
                      <span>Cấu hình giới hạn sức chứa</span>
                    </span>
                    <Badge variant="outline" className="text-[10.5px] font-mono bg-background">
                      Đang chứa: <strong>{renamingObject.currentSeatsCount}</strong> ghế
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold text-foreground">
                        Sức chứa vận hành (Max)
                      </Label>
                      <Input
                        type="number"
                        min={renamingObject.currentSeatsCount || 1}
                        max={renamingObject.maxCapacityCeiling}
                        value={renamingObject.capacity}
                        onChange={(e) =>
                          setRenamingObject({
                            ...renamingObject,
                            capacity: Math.max(1, parseInt(e.target.value) || 1),
                          })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleSaveRename();
                          }
                        }}
                        className="h-8 text-xs font-mono font-bold bg-background"
                      />
                      <span className="text-[9.5px] text-muted-foreground block">
                        Có thể chỉnh nhỏ hơn (VD: từ 30 xuống 21).
                      </span>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" />
                        <span>Trần thiết kế tối đa</span>
                      </Label>
                      <Input
                        type="number"
                        min={renamingObject.capacity}
                        max={100}
                        value={renamingObject.maxCapacityCeiling}
                        onChange={(e) =>
                          setRenamingObject({
                            ...renamingObject,
                            maxCapacityCeiling: Math.max(1, parseInt(e.target.value) || 1),
                          })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleSaveRename();
                          }
                        }}
                        className="h-8 text-xs font-mono font-bold bg-background"
                      />
                      <span className="text-[9.5px] text-muted-foreground block">
                        Trần cố định vật lý (VD: 30 ghế). Không thể vượt quá.
                      </span>
                    </div>
                  </div>

                  <div className="text-[10px] text-muted-foreground pt-1 border-t border-border/50">
                    💡 <em>Bạn được phép chỉnh sức chứa vận hành nhỏ hơn trần ({renamingObject.capacity} ≤ {renamingObject.maxCapacityCeiling}), nhưng hệ thống sẽ chặn không cho phép đặt vượt trần (không thể đặt {renamingObject.maxCapacityCeiling + 1}) hoặc nhỏ hơn số ghế đang xếp thực tế ({renamingObject.currentSeatsCount}).</em>
                  </div>
                </div>
              )}

              {renamingObject.type === "ZONE" && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Màu viền phân khu</Label>
                  <div className="flex items-center gap-2 pt-1">
                    {[
                      { hex: "#10B981", label: "Xanh lá" },
                      { hex: "#3B82F6", label: "Xanh dương" },
                      { hex: "#6366F1", label: "Tím Indigo" },
                      { hex: "#F59E0B", label: "Cam Vàng" },
                      { hex: "#EC4899", label: "Hồng" },
                      { hex: "#64748B", label: "Xám" },
                    ].map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() =>
                          setRenamingObject({ ...renamingObject, color: c.hex })
                        }
                        className={cn(
                          "w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 shadow-xs",
                          renamingObject.color === c.hex
                            ? "ring-2 ring-primary ring-offset-2 scale-110 border-white"
                            : "border-transparent"
                        )}
                        style={{ backgroundColor: c.hex }}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>
              )}

              {renamingObject.type === "SEAT" && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Loại bàn làm việc</Label>
                  <Select
                    value={renamingObject.seatType || "HOT_DESK"}
                    onValueChange={(val) =>
                      setRenamingObject((prev) =>
                        prev ? { ...prev, seatType: val || "HOT_DESK" } : null
                      )
                    }
                  >
                    <SelectTrigger className="w-full h-9 text-xs">
                      <SelectValue placeholder="Chọn loại bàn" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HOT_DESK">HOT_DESK (Bàn linh hoạt)</SelectItem>
                      <SelectItem value="FIXED_DESK">FIXED_DESK (Bàn cố định)</SelectItem>
                      <SelectItem value="VIP">VIP_DESK (Lãnh đạo)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsRenameDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSaveRename}
              className="gap-1.5 bg-primary text-primary-foreground"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Lưu thay đổi</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
