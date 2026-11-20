export type AssetStatus =
  | "AVAILABLE"
  | "ASSIGNED"
  | "IN_REPAIR"
  | "DAMAGED"
  | "DISPOSED";

export type AssetCondition =
  | "NEW"
  | "GOOD"
  | "FAIR"
  | "MAINTENANCE_REQUIRED"
  | "DAMAGED";

export interface AssetCategory {
  id: string;
  companyId: string;
  name: string;
  code: string;
  description?: string;
  assetCount?: number;
  createdAt: string;
}

export interface AssetSummary {
  id: string;
  companyId: string;
  assetCode: string;
  name: string;
  categoryId: string;
  categoryName: string;
  categoryCode: string;
  serialNumber?: string;
  model?: string;
  manufacturer?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  status: AssetStatus;
  conditionStatus: AssetCondition;
  location?: string;
  currentEmployeeId?: string;
  currentEmployeeCode?: string;
  currentEmployeeName?: string;
  currentDepartmentName?: string;
  assignedAt?: string;
  createdAt: string;
}

export interface AssetAssignment {
  id: string;
  assetId: string;
  assetCode: string;
  assetName: string;
  categoryName?: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  departmentName?: string;
  assignedAt: string;
  returnedAt?: string;
  conditionOnAssign?: AssetCondition;
  conditionOnReturn?: AssetCondition;
  notes?: string;
  active: boolean;
}

export interface AssetDetail extends AssetSummary {
  specifications?: string;
  notes?: string;
  currentAssignmentId?: string;
  currentAssignedAt?: string;
  assignments: AssetAssignment[];
  updatedAt?: string;
}

export interface AssetStatistics {
  totalAssets: number;
  assignedAssets: number;
  availableAssets: number;
  maintenanceAssets: number;
  totalValue: number;
}

export interface AssetFilterParams {
  keyword?: string;
  categoryId?: string;
  status?: AssetStatus | "ALL";
  conditionStatus?: AssetCondition | "ALL";
  assigned?: boolean;
  page?: number;
  size?: number;
}

export interface CreateAssetRequest {
  assetCode: string;
  categoryId: string;
  name: string;
  serialNumber?: string;
  model?: string;
  manufacturer?: string;
  specifications?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  conditionStatus?: AssetCondition;
  location?: string;
  notes?: string;
}

export interface UpdateAssetRequest {
  categoryId: string;
  name: string;
  serialNumber?: string;
  model?: string;
  manufacturer?: string;
  specifications?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  status?: AssetStatus;
  conditionStatus?: AssetCondition;
  location?: string;
  notes?: string;
}

export interface AssignAssetRequest {
  employeeId: string;
  assignedAt: string;
  conditionOnAssign?: AssetCondition;
  notes?: string;
}

export interface ReturnAssetRequest {
  returnedAt: string;
  conditionOnReturn?: AssetCondition;
  notes?: string;
}

export interface CreateAssetCategoryRequest {
  name: string;
  code: string;
  description?: string;
}

export interface UpdateAssetCategoryRequest {
  name: string;
  code: string;
  description?: string;
}
