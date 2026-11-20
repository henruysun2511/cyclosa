"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { ApiError } from "@/types/api.types";

interface ErrorStateProps {
  error: ApiError | unknown;
  onRetry?: () => void;
}

function getErrorMessage(error: unknown): string {
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof (error as ApiError).message === "string"
  ) {
    return (error as ApiError).message;
  }
  return "Đã xảy ra lỗi. Vui lòng thử lại.";
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Lỗi</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>{getErrorMessage(error)}</span>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="ml-4 shrink-0"
          >
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
            Thử lại
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
