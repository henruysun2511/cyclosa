export type SeatType = "DEDICATED" | "HOT_DESK" | "VISITOR";
export type SeatStatus = "IN_SERVICE" | "MAINTENANCE" | "BLOCKED";
export type SeatShape = "RECTANGLE" | "ROUND";
export type RowLayoutType = "SINGLE_ROW" | "POD_4_FACING" | "POD_6_FACING";
export type FloorPlanStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type BookingStatus = "CONFIRMED" | "CHECKED_IN" | "CANCELLED";
export type IssueSeverity = "LOW" | "MEDIUM" | "HIGH";
export type WorkplaceIssueType = "ELECTRICAL" | "FURNITURE" | "AIR_CONDITIONING" | "HARDWARE" | "CLEANING" | "OTHER";
export type WorkplaceIssueStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED";

export interface WorkplaceSite {
  id: string;
  branchId: string;
  branchName: string;
  code: string;
  name: string;
  address: string;
  description?: string;
  floorCount: number;
  totalSeats?: number;
  createdAt: string;
}

export interface WorkplaceFloor {
  id: string;
  siteId: string;
  siteName: string;
  floorNumber: number;
  name: string;
  description?: string;
  zoneCount: number;
  seatCount: number;
  publishedPlanVersion?: string;
  createdAt: string;
}

export interface WorkplaceFloorPlan {
  id: string;
  floorId: string;
  versionNo: number;
  backgroundFileUrl?: string;
  canvasWidth: number;
  canvasHeight: number;
  scaleMetersPerPx: number;
  status: FloorPlanStatus;
  layoutData?: string;
  createdAt: string;
}

export interface BoundaryPoint {
  pointOrder: number;
  x: number;
  y: number;
}

export interface FloorMapZone {
  id: string;
  name: string;
  departmentId?: string;
  departmentName?: string;
  colorHex?: string;
  capacity?: number;
  maxCapacityCeiling?: number;
  boundaryPoints: BoundaryPoint[];
}

export interface FloorMapSeatRow {
  id: string;
  zoneId: string;
  code: string;
  layoutType: RowLayoutType;
  x: number;
  y: number;
  rotationDegrees: number;
}

export interface FloorMapSeat {
  id: string;
  seatRowId: string;
  seatCode: string;
  seatType: SeatType;
  status: SeatStatus;
  x: number;
  y: number;
  shape: SeatShape;
  width: number;
  height: number;
  rotationDegrees: number;
  qrToken: string;
  currentOccupantName?: string;
  currentOccupantEmployeeId?: string;
  currentOccupantAvatar?: string;
  amenities: string[];
}

export interface FloorMapObject {
  id: string;
  objectType: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotationDegrees: number;
  qrToken?: string;
  capacity?: number;
  maxCapacityCeiling?: number;
  floorName?: string;
  description?: string;
}

export type WorkplaceFloorObject = FloorMapObject;

export interface FloorMapData {
  floorId: string;
  floorName: string;
  floorNumber: number;
  activePlan?: WorkplaceFloorPlan;
  zones: FloorMapZone[];
  seatRows: FloorMapSeatRow[];
  seats: FloorMapSeat[];
  objects: FloorMapObject[];
}

export interface WorkplaceSeatDetail {
  id: string;
  seatRowId: string;
  seatRowCode: string;
  zoneId: string;
  zoneName: string;
  floorId: string;
  floorName: string;
  siteId: string;
  siteName: string;
  seatCode: string;
  seatType: SeatType;
  status: SeatStatus;
  x: number;
  y: number;
  shape: SeatShape;
  width: number;
  height: number;
  rotationDegrees: number;
  qrToken: string;
  currentEmployeeId?: string;
  currentEmployeeName?: string;
  currentEmployeeCode?: string;
  currentEmployeeDepartment?: string;
  currentEmployeeAvatar?: string;
  amenities: { id: string; name: string; iconName?: string }[];
  linkedAssets: { id: string; assetId: string; assetCode: string; assetName: string; serialNumber?: string }[];
}

export interface SeatAssignment {
  id: string;
  seatId: string;
  seatCode: string;
  floorName: string;
  siteName: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  departmentName?: string;
  avatarUrl?: string;
  assignedAt: string;
  releasedAt?: string;
  note?: string;
}

export interface DeskBooking {
  id: string;
  seatId: string;
  seatCode: string;
  floorName: string;
  siteName: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  bookingDate: string;
  status: BookingStatus;
  checkedInAt?: string;
  cancelledAt?: string;
  qrToken: string;
  note?: string;
}

export interface RoomBooking {
  id: string;
  meetingRoomId: string;
  roomName: string;
  capacity: number;
  floorName: string;
  siteName: string;
  organizerEmployeeId: string;
  organizerName: string;
  title: string;
  attendeeCount: number;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  checkedInAt?: string;
  description?: string;
}

export interface WorkplaceIssue {
  id: string;
  reporterEmployeeId: string;
  reporterName: string;
  issueType: WorkplaceIssueType;
  severity: IssueSeverity;
  title: string;
  description: string;
  seatId?: string;
  seatCode?: string;
  floorObjectId?: string;
  floorObjectName?: string;
  floorId?: string;
  floorName?: string;
  locationX?: number;
  locationY?: number;
  status: WorkplaceIssueStatus;
  assignedToEmployeeId?: string;
  assignedToName?: string;
  resolutionNote?: string;
  reportedAt: string;
  resolvedAt?: string;
}

export interface EmployeeLocation {
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  departmentName?: string;
  avatarUrl?: string;
  siteId: string;
  siteName: string;
  floorId: string;
  floorName: string;
  floorNumber: number;
  seatId: string;
  seatCode: string;
  x: number;
  y: number;
  seatType: string;
}

export interface WorkplaceReport {
  totalSeats: number;
  dedicatedSeats: number;
  hotDesks: number;
  assignedSeats: number;
  occupiedHotDesksToday: number;
  averageOccupancyRate: number;
  openIssuesCount: number;
  dailyTrend: { dayOfWeek: string; bookingCount: number; rate: number }[];
}

export interface QrResolutionResponse {
  targetType?: string;
  tokenType?: string;
  type?: string;
  id?: string;
  targetId?: string;
  name: string;
  code: string;
  floorId?: string;
  floorName?: string;
  siteName?: string;
  zoneName?: string;
  status?: string;
  currentOccupantName?: string;
  details?: Record<string, any>;
}

export interface NavigationRouteResponse {
  totalDistanceMeters: number;
  estimatedWalkingMinutes: number;
  waypoints: { x: number; y: number }[];
}

export interface WorkplaceAmenity {
  id: string;
  name: string;
  iconName?: string;
  description?: string;
  seatCount?: number;
  createdAt?: string;
}
