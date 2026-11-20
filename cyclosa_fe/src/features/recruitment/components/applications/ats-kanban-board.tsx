"use client";

import React, { useState } from "react";
import { ATS_PIPELINE_STAGES } from "../../constants/recruitment.constants";
import { AtsCandidateCard } from "./ats-candidate-card";
import type { ApplicationDto, ApplicationStage } from "../../types/recruitment.types";

interface AtsKanbanBoardProps {
  applications: ApplicationDto[];
  onMoveStage: (applicationId: string, newStage: ApplicationStage) => void;
  onOpenScorecard: (app: ApplicationDto) => void;
}

export function AtsKanbanBoard({
  applications,
  onMoveStage,
  onOpenScorecard,
}: AtsKanbanBoardProps) {
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<ApplicationStage | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    setDraggedAppId(id);
  };

  const handleDragOver = (e: React.DragEvent, stage: ApplicationStage) => {
    e.preventDefault();
    if (dragOverCol !== stage) {
      setDragOverCol(stage);
    }
  };

  const handleDragLeave = () => {
    setDragOverCol(null);
  };

  const handleDrop = (e: React.DragEvent, stage: ApplicationStage) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") || draggedAppId;
    if (id) {
      onMoveStage(id, stage);
    }
    setDraggedAppId(null);
    setDragOverCol(null);
  };

  return (
    <div className="overflow-x-auto pb-6">
      <div className="flex gap-4 min-w-[1400px]">
        {ATS_PIPELINE_STAGES.map((col) => {
          const colApps = applications.filter((app) => app.currentStage === col.id);
          const isOver = dragOverCol === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`flex-1 min-w-[220px] rounded-2xl border transition-all duration-200 flex flex-col max-h-[750px] ${
                isOver
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border bg-muted/20"
              }`}
            >
              {/* Column Header */}
              <div className="p-3.5 border-b border-border/70 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${col.accentColor}`} />
                  <span className="font-bold text-xs text-foreground">{col.label}</span>
                </div>
                <span
                  className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded-full ${col.badgeBg}`}
                >
                  {colApps.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                {colApps.length === 0 ? (
                  <div className="h-32 border border-dashed border-border/80 rounded-xl flex items-center justify-center text-center p-3 text-[11px] text-muted-foreground select-none">
                    Kéo thả hồ sơ vào đây
                  </div>
                ) : (
                  colApps.map((app) => (
                    <AtsCandidateCard
                      key={app.id}
                      application={app}
                      onOpenScorecard={onOpenScorecard}
                      onDragStart={handleDragStart}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

