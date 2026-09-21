import { Badge } from "@/components/ui/badge";
import {
  PRODUCT_STATUS_LABELS,
  PRODUCT_STATUS_VARIANTS,
} from "../constants/product.constants";
import type { ProductStatus } from "../types/product.types";

interface ProductStatusBadgeProps {
  status: ProductStatus;
}

export function ProductStatusBadge({ status }: ProductStatusBadgeProps) {
  return (
    <Badge variant={PRODUCT_STATUS_VARIANTS[status]}>
      {PRODUCT_STATUS_LABELS[status]}
    </Badge>
  );
}
