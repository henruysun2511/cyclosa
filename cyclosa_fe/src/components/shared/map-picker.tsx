"use client";

import React, { useState } from "react";
import { MapPin, Navigation, Plus, Minus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface MapCoordinates {
  lat: number;
  lng: number;
  radiusMeters: number;
}

export interface MapPickerProps {
  value?: MapCoordinates;
  onChange?: (coords: MapCoordinates) => void;
  disabled?: boolean;
  className?: string;
}

export function MapPicker({
  value = { lat: 21.028511, lng: 105.854444, radiusMeters: 200 },
  onChange,
  disabled = false,
  className,
}: MapPickerProps) {
  const [coords, setCoords] = useState<MapCoordinates>(value);

  const updateRadius = (newRadius: number) => {
    const updated = { ...coords, radiusMeters: newRadius };
    setCoords(updated);
    onChange?.(updated);
  };

  const updateLat = (newLat: number) => {
    const updated = { ...coords, lat: newLat };
    setCoords(updated);
    onChange?.(updated);
  };

  const updateLng = (newLng: number) => {
    const updated = { ...coords, lng: newLng };
    setCoords(updated);
    onChange?.(updated);
  };

  return (
    <div className={cn("space-y-4 rounded-lg border border-border bg-white p-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Navigation className="h-5 w-5 text-primary" />
          <h4 className="font-semibold text-sm text-foreground">Tọa độ GPS & Bán kính chấm công</h4>
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          Bán kính: <strong className="text-foreground">{coords.radiusMeters} mét</strong>
        </span>
      </div>

      {/* Simulated Map Viewport */}
      <div className="relative w-full h-64 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center select-none">
        {/* Map Grid Pattern */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(#94a3b8 1px, transparent 1px), radial-gradient(#cbd5e1 1px, #f8fafc 1px)",
            backgroundSize: "24px 24px",
            backgroundPosition: "0 0, 12px 12px",
          }}
        />

        {/* Map Streets Mock lines */}
        <svg className="absolute inset-0 w-full h-full stroke-slate-300 fill-none" strokeWidth="2.5">
          <path d="M-20 80 Q 200 120 400 60 T 800 150" />
          <path d="M120 -20 Q 150 180 220 350" />
          <path d="M380 -20 L 320 350" />
          <path d="M-20 220 L 800 210" strokeDasharray="6 4" />
        </svg>

        {/* Geofencing Radius Circle */}
        <div
          className="relative z-10 rounded-full border-2 border-primary bg-primary/15 flex items-center justify-center transition-all duration-300 shadow-md"
          style={{
            width: `${Math.min(240, Math.max(80, coords.radiusMeters * 0.6))}px`,
            height: `${Math.min(240, Math.max(80, coords.radiusMeters * 0.6))}px`,
          }}
        >
          {/* Center Pin Marker */}
          <div className="flex flex-col items-center">
            <div className="h-7 w-7 rounded-full bg-rose-500 text-white shadow-lg flex items-center justify-center animate-bounce">
              <MapPin className="h-4 w-4" />
            </div>
            <span className="mt-1 px-2 py-0.5 rounded bg-slate-900/80 text-white text-2xs font-medium whitespace-nowrap shadow-xs">
              Trụ sở chi nhánh
            </span>
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute right-3 bottom-3 z-20 flex flex-col gap-1 bg-white rounded-md border border-slate-200 shadow-xs p-1">
          <button
            type="button"
            className="p-1 hover:bg-slate-100 rounded text-slate-600"
            onClick={() => updateRadius(Math.min(1000, coords.radiusMeters + 50))}
            disabled={disabled}
            title="Tăng bán kính"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="p-1 hover:bg-slate-100 rounded text-slate-600"
            onClick={() => updateRadius(Math.max(50, coords.radiusMeters - 50))}
            disabled={disabled}
            title="Giảm bán kính"
          >
            <Minus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Coordinate & Radius Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label className="text-xs font-medium text-muted-foreground">Vĩ độ (Latitude)</Label>
          <Input
            type="number"
            step="0.000001"
            value={coords.lat}
            disabled={disabled}
            onChange={(e) => updateLat(parseFloat(e.target.value) || 0)}
            className="h-8 font-mono text-xs"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-medium text-muted-foreground">Kinh độ (Longitude)</Label>
          <Input
            type="number"
            step="0.000001"
            value={coords.lng}
            disabled={disabled}
            onChange={(e) => updateLng(parseFloat(e.target.value) || 0)}
            className="h-8 font-mono text-xs"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-medium text-muted-foreground">Bán kính hợp lệ (mét)</Label>
          <Input
            type="number"
            step="10"
            min="20"
            max="2000"
            value={coords.radiusMeters}
            disabled={disabled}
            onChange={(e) => updateRadius(parseInt(e.target.value) || 100)}
            className="h-8 font-mono text-xs"
          />
        </div>
      </div>
    </div>
  );
}
