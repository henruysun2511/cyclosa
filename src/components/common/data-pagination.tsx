import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PAGE_SIZE_OPTIONS } from "@/features/products/constants/product.constants";
import type { PaginationData, PaginationMeta } from "@/types/api.types";

interface DataPaginationProps {
  meta?: PaginationMeta;
  pagination?: PaginationData;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export function DataPagination({
  meta,
  pagination,
  onPageChange,
  onPageSizeChange,
}: DataPaginationProps) {
  // Normalize parameters: nếu dùng pagination (0-based) thì đổi sang 1-based cho UI
  const currentPage = pagination ? pagination.page + 1 : (meta?.page ?? 1);
  const pageSize = pagination ? pagination.size : (meta?.limit ?? 10);
  const totalItems = pagination ? pagination.total : (meta?.total ?? 0);
  const totalPages = pagination ? pagination.pages : (meta?.totalPages ?? 1);

  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  const handlePrev = () => {
    if (currentPage > 1) {
      // Nếu pagination chuẩn backend thì trả về 0-based, còn meta thì 1-based
      onPageChange(pagination ? currentPage - 2 : currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(pagination ? currentPage : currentPage + 1);
    }
  };

  const handleFirst = () => {
    onPageChange(pagination ? 0 : 1);
  };

  const handleLast = () => {
    onPageChange(pagination ? totalPages - 1 : totalPages);
  };

  return (
    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row py-2">
      <p className="text-sm text-muted-foreground">
        Hiển thị <span className="font-medium text-foreground">{start}</span>–
        <span className="font-medium text-foreground">{end}</span> trong{" "}
        <span className="font-medium text-foreground">{totalItems}</span> bản ghi
      </p>

      <div className="flex items-center gap-4">
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Mỗi trang:
            </span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => onPageSizeChange(Number(v))}
            >
              <SelectTrigger className="h-8 w-18">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleFirst}
            disabled={currentPage <= 1}
            title="Trang đầu"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handlePrev}
            disabled={currentPage <= 1}
            title="Trang trước"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-sm font-medium px-2">
            Trang {currentPage} / {Math.max(totalPages, 1)}
          </span>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleNext}
            disabled={currentPage >= totalPages}
            title="Trang sau"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleLast}
            disabled={currentPage >= totalPages}
            title="Trang cuối"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
