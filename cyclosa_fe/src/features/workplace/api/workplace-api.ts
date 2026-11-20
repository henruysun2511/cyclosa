import { baseApi } from "@/store/base-api-rtk";
import type { ApiResponse, PageData } from "@/types/api.types";
import type {
  WorkplaceSite,
  WorkplaceFloor,
  WorkplaceFloorPlan,
  FloorMapData,
  WorkplaceSeatDetail,
  SeatAssignment,
  DeskBooking,
  RoomBooking,
  WorkplaceIssue,
  EmployeeLocation,
  WorkplaceReport,
  SeatStatus,
  WorkplaceFloorObject,
  QrResolutionResponse,
  NavigationRouteResponse,
  WorkplaceAmenity,
} from "../types/workplace.types";

export const workplaceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Sites & Floors
    getSites: builder.query<PageData<WorkplaceSite>, { branchId?: string; search?: string; page?: number; size?: number }>({
      query: (params) => ({
        url: "/workplace/sites",
        params: {
          ...params,
          page: params?.page ? params.page - 1 : 0,
        },
      }),
      transformResponse: (response: ApiResponse<PageData<WorkplaceSite>>) => response.data,
      providesTags: ["Workplace"],
    }),
    getSiteById: builder.query<WorkplaceSite, string>({
      query: (id) => `/workplace/sites/${id}`,
      transformResponse: (response: ApiResponse<WorkplaceSite>) => response.data,
      providesTags: ["Workplace"],
    }),
    createSite: builder.mutation<WorkplaceSite, { branchId: string; code: string; name: string; address: string; description?: string }>({
      query: (body) => ({ url: "/workplace/sites", method: "POST", body }),
      invalidatesTags: ["Workplace"],
    }),
    updateSite: builder.mutation<WorkplaceSite, { id: string; name: string; address: string; description?: string }>({
      query: ({ id, ...body }) => ({ url: `/workplace/sites/${id}`, method: "PUT", body }),
      invalidatesTags: ["Workplace"],
    }),
    deleteSite: builder.mutation<void, string>({
      query: (id) => ({ url: `/workplace/sites/${id}`, method: "DELETE" }),
      invalidatesTags: ["Workplace"],
    }),
    getFloorsBySiteId: builder.query<WorkplaceFloor[], string>({
      query: (siteId) => `/workplace/sites/${siteId}/floors`,
      transformResponse: (response: ApiResponse<WorkplaceFloor[]>) => response.data,
      providesTags: ["Workplace"],
    }),
    createFloor: builder.mutation<WorkplaceFloor, { siteId: string; floorNumber: number; name: string; description?: string }>({
      query: ({ siteId, ...body }) => ({ url: `/workplace/sites/${siteId}/floors`, method: "POST", body }),
      invalidatesTags: ["Workplace"],
    }),
    updateFloor: builder.mutation<WorkplaceFloor, { id: string; name: string; description?: string }>({
      query: ({ id, ...body }) => ({ url: `/workplace/floors/${id}`, method: "PUT", body }),
      invalidatesTags: ["Workplace"],
    }),
    deleteFloor: builder.mutation<void, string>({
      query: (id) => ({ url: `/workplace/floors/${id}`, method: "DELETE" }),
      invalidatesTags: ["Workplace"],
    }),

    // Floor Map & Plans
    getFloorPlans: builder.query<WorkplaceFloorPlan[], string>({
      query: (floorId) => `/workplace/floors/${floorId}/plans`,
      transformResponse: (response: ApiResponse<WorkplaceFloorPlan[]>) => response.data,
      providesTags: ["Workplace"],
    }),
    createFloorPlan: builder.mutation<WorkplaceFloorPlan, { floorId: string; versionNo: number; backgroundFileUrl?: string; canvasWidth?: number; canvasHeight?: number; scaleMetersPerPx?: number }>({
      query: ({ floorId, ...body }) => ({ url: `/workplace/floors/${floorId}/plans`, method: "POST", body }),
      invalidatesTags: ["Workplace"],
    }),
    getFloorMap: builder.query<FloorMapData, string>({
      query: (floorId) => `/workplace/floors/${floorId}/map`,
      transformResponse: (response: ApiResponse<FloorMapData>) => response.data,
      providesTags: ["Workplace"],
    }),
    saveFloorLayout: builder.mutation<
      FloorMapData,
      {
        floorId: string;
        canvasWidth?: number;
        canvasHeight?: number;
        scaleMetersPerPx?: number;
        layoutJson?: string;
        objects: any[];
      }
    >({
      query: ({ floorId, ...body }) => ({
        url: `/workplace/floors/${floorId}/layout`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiResponse<FloorMapData>) => response.data,
      invalidatesTags: ["Workplace"],
    }),
    publishFloorPlan: builder.mutation<WorkplaceFloorPlan, string>({
      query: (planId) => ({ url: `/workplace/floor-plans/${planId}/publish`, method: "POST" }),
      invalidatesTags: ["Workplace"],
    }),
    archiveFloorPlan: builder.mutation<WorkplaceFloorPlan, string>({
      query: (planId) => ({ url: `/workplace/floor-plans/${planId}/archive`, method: "POST" }),
      invalidatesTags: ["Workplace"],
    }),

    // Zones & Rows
    createZone: builder.mutation<any, { floorId: string; name: string; departmentId?: string; colorHex?: string }>({
      query: ({ floorId, ...body }) => ({ url: `/workplace/floors/${floorId}/zones`, method: "POST", body }),
      invalidatesTags: ["Workplace"],
    }),
    deleteZone: builder.mutation<void, string>({
      query: (zoneId) => ({ url: `/workplace/zones/${zoneId}`, method: "DELETE" }),
      invalidatesTags: ["Workplace"],
    }),
    createSeatRow: builder.mutation<any, { zoneId: string; code: string; layoutType: string; x?: number; y?: number; rotationDegrees?: number }>({
      query: ({ zoneId, ...body }) => ({ url: `/workplace/zones/${zoneId}/seat-rows`, method: "POST", body }),
      invalidatesTags: ["Workplace"],
    }),
    deleteSeatRow: builder.mutation<void, string>({
      query: (rowId) => ({ url: `/workplace/seat-rows/${rowId}`, method: "DELETE" }),
      invalidatesTags: ["Workplace"],
    }),
    generateSeatsForRow: builder.mutation<WorkplaceSeatDetail[], string>({
      query: (rowId) => ({ url: `/workplace/seat-rows/${rowId}/generate-seats`, method: "POST" }),
      invalidatesTags: ["Workplace"],
    }),

    // Seats & Assignments
    getSeats: builder.query<PageData<WorkplaceSeatDetail>, { floorId?: string; zoneId?: string; seatType?: string; status?: string; search?: string; page?: number; size?: number }>({
      query: (params) => ({
        url: "/workplace/seats",
        params: {
          ...params,
          page: params?.page ? params.page - 1 : 0,
        },
      }),
      transformResponse: (response: ApiResponse<PageData<WorkplaceSeatDetail>>) => response.data,
      providesTags: ["Workplace"],
    }),
    getSeatById: builder.query<WorkplaceSeatDetail, string>({
      query: (id) => `/workplace/seats/${id}`,
      transformResponse: (response: ApiResponse<WorkplaceSeatDetail>) => response.data,
      providesTags: ["Workplace"],
    }),
    createSeat: builder.mutation<WorkplaceSeatDetail, { seatRowId: string; seatCode: string; seatType?: string; status?: string; x?: number; y?: number; shape?: string; width?: number; height?: number; rotationDegrees?: number }>({
      query: (body) => ({ url: "/workplace/seats", method: "POST", body }),
      invalidatesTags: ["Workplace"],
    }),
    updateSeatStatus: builder.mutation<WorkplaceSeatDetail, { seatId: string; status: SeatStatus }>({
      query: ({ seatId, status }) => ({ url: `/workplace/seats/${seatId}/status`, method: "PATCH", params: { status } }),
      invalidatesTags: ["Workplace"],
    }),
    deleteSeat: builder.mutation<void, string>({
      query: (seatId) => ({ url: `/workplace/seats/${seatId}`, method: "DELETE" }),
      invalidatesTags: ["Workplace"],
    }),
    getSeatAssignments: builder.query<PageData<SeatAssignment>, { floorId?: string; employeeId?: string; activeOnly?: boolean; search?: string; page?: number; size?: number }>({
      query: (params) => ({
        url: "/workplace/seat-assignments",
        params: {
          ...params,
          page: params?.page ? params.page - 1 : 0,
        },
      }),
      transformResponse: (response: ApiResponse<PageData<SeatAssignment>>) => response.data,
      providesTags: ["Workplace"],
    }),
    assignSeat: builder.mutation<SeatAssignment, { seatId: string; employeeId: string; note?: string }>({
      query: (body) => ({ url: "/workplace/seat-assignments", method: "POST", body }),
      invalidatesTags: ["Workplace"],
    }),
    releaseSeat: builder.mutation<void, string>({
      query: (assignmentId) => ({ url: `/workplace/seat-assignments/${assignmentId}/release`, method: "POST" }),
      invalidatesTags: ["Workplace"],
    }),

    // Desk Bookings (Hot-desking)
    getAvailableHotDesks: builder.query<WorkplaceSeatDetail[], { date: string; floorId: string }>({
      query: (params) => ({ url: "/workplace/desk-bookings/availability", params }),
      transformResponse: (response: ApiResponse<WorkplaceSeatDetail[]>) => response.data,
      providesTags: ["Workplace"],
    }),
    bookDesk: builder.mutation<DeskBooking, { seatId: string; bookingDate: string; note?: string }>({
      query: (body) => ({ url: "/workplace/desk-bookings", method: "POST", body }),
      invalidatesTags: ["Workplace"],
    }),
    checkInDesk: builder.mutation<DeskBooking, { bookingId: string; qrToken: string }>({
      query: ({ bookingId, qrToken }) => ({ url: `/workplace/desk-bookings/${bookingId}/check-in`, method: "POST", params: { qrToken } }),
      invalidatesTags: ["Workplace"],
    }),
    cancelDeskBooking: builder.mutation<void, string>({
      query: (bookingId) => ({ url: `/workplace/desk-bookings/${bookingId}/cancel`, method: "POST" }),
      invalidatesTags: ["Workplace"],
    }),
    getDeskBookings: builder.query<PageData<DeskBooking>, { date?: string; floorId?: string; employeeId?: string; page?: number; size?: number }>({
      query: (params) => ({
        url: "/workplace/desk-bookings",
        params: {
          ...params,
          page: params?.page ? params.page - 1 : 0,
        },
      }),
      transformResponse: (response: ApiResponse<PageData<DeskBooking>>) => response.data,
      providesTags: ["Workplace"],
    }),
    getMyDeskBookings: builder.query<DeskBooking[], void>({
      query: () => "/workplace/desk-bookings/my-bookings",
      transformResponse: (response: ApiResponse<DeskBooking[]>) => response.data,
      providesTags: ["Workplace"],
    }),
    getMySeat: builder.query<WorkplaceSeatDetail | null, void>({
      query: () => "/workplace/seat-assignments/my-seat",
      transformResponse: (response: ApiResponse<WorkplaceSeatDetail | null>) => response.data,
      providesTags: ["Workplace"],
    }),

    // Meeting Rooms
    getRoomBookings: builder.query<PageData<RoomBooking>, { roomId?: string; startTime?: string; endTime?: string; page?: number; size?: number }>({
      query: (params) => ({
        url: "/workplace/room-bookings",
        params: {
          ...params,
          page: params?.page ? params.page - 1 : 0,
        },
      }),
      transformResponse: (response: ApiResponse<PageData<RoomBooking>>) => response.data,
      providesTags: ["Workplace"],
    }),
    bookRoom: builder.mutation<RoomBooking, { meetingRoomId: string; title: string; attendeeCount: number; startTime: string; endTime: string; description?: string }>({
      query: (body) => ({ url: "/workplace/room-bookings", method: "POST", body }),
      invalidatesTags: ["Workplace"],
    }),
    checkInRoom: builder.mutation<RoomBooking, string>({
      query: (bookingId) => ({ url: `/workplace/room-bookings/${bookingId}/check-in`, method: "POST" }),
      invalidatesTags: ["Workplace"],
    }),
    cancelRoomBooking: builder.mutation<void, string>({
      query: (bookingId) => ({ url: `/workplace/room-bookings/${bookingId}/cancel`, method: "POST" }),
      invalidatesTags: ["Workplace"],
    }),
    getMyRoomBookings: builder.query<RoomBooking[], void>({
      query: () => "/workplace/room-bookings/my-bookings",
      transformResponse: (response: ApiResponse<RoomBooking[]>) => response.data,
      providesTags: ["Workplace"],
    }),
    getMeetingRooms: builder.query<WorkplaceFloorObject[], { floorId?: string } | void>({
      query: (params) => ({
        url: "/workplace/meeting-rooms",
        params: params || undefined,
      }),
      transformResponse: (response: ApiResponse<WorkplaceFloorObject[]>) => response.data,
      providesTags: ["Workplace"],
    }),

    // Issues
    getIssues: builder.query<PageData<WorkplaceIssue>, { status?: string; severity?: string; floorId?: string; search?: string; page?: number; size?: number }>({
      query: (params) => ({
        url: "/workplace/issues",
        params: {
          ...params,
          page: params?.page ? params.page - 1 : 0,
        },
      }),
      transformResponse: (response: ApiResponse<PageData<WorkplaceIssue>>) => response.data,
      providesTags: ["Workplace"],
    }),
    getIssueById: builder.query<WorkplaceIssue, string>({
      query: (issueId) => `/workplace/issues/${issueId}`,
      transformResponse: (response: ApiResponse<WorkplaceIssue>) => response.data,
      providesTags: ["Workplace"],
    }),
    reportIssue: builder.mutation<WorkplaceIssue, { issueType: string; severity?: string; title: string; description: string; seatId?: string; floorObjectId?: string; floorId?: string; locationX?: number; locationY?: number }>({
      query: (body) => ({ url: "/workplace/issues", method: "POST", body }),
      invalidatesTags: ["Workplace"],
    }),
    assignIssue: builder.mutation<WorkplaceIssue, { issueId: string; assignedEmployeeId: string }>({
      query: ({ issueId, assignedEmployeeId }) => ({ url: `/workplace/issues/${issueId}/assign`, method: "PUT", params: { assignedEmployeeId } }),
      invalidatesTags: ["Workplace"],
    }),
    startIssue: builder.mutation<WorkplaceIssue, string>({
      query: (issueId) => ({ url: `/workplace/issues/${issueId}/start`, method: "POST" }),
      invalidatesTags: ["Workplace"],
    }),
    resolveIssue: builder.mutation<WorkplaceIssue, { issueId: string; resolutionNote?: string }>({
      query: ({ issueId, resolutionNote }) => ({ url: `/workplace/issues/${issueId}/resolve`, method: "POST", params: { resolutionNote } }),
      invalidatesTags: ["Workplace"],
    }),
    getMyIssues: builder.query<WorkplaceIssue[], void>({
      query: () => "/workplace/issues/my-issues",
      transformResponse: (response: ApiResponse<WorkplaceIssue[]>) => response.data,
      providesTags: ["Workplace"],
    }),

    // Reports, QR & Location
    getEmployeeLocation: builder.query<EmployeeLocation | null, string>({
      query: (employeeId) => `/workplace/employees/${employeeId}/location`,
      transformResponse: (response: ApiResponse<EmployeeLocation | null>) => response.data,
    }),
    // Tạm thời bỏ API báo cáo tối ưu không gian:
    // getUtilizationReport: builder.query<WorkplaceReport, { floorId?: string }>({
    //   query: (params) => ({ url: "/workplace/reports/utilization", params }),
    //   transformResponse: (response: ApiResponse<WorkplaceReport>) => response.data,
    //   providesTags: ["Workplace"],
    // }),
    calculateRoute: builder.query<NavigationRouteResponse, { floorId: string; startX: number; startY: number; endX: number; endY: number }>({
      query: (params) => ({ url: "/workplace/navigation/route", params }),
      transformResponse: (response: ApiResponse<NavigationRouteResponse>) => response.data,
    }),
    resolveQr: builder.query<QrResolutionResponse, string>({
      query: (token) => ({ url: "/workplace/qr/resolve", params: { token } }),
      transformResponse: (response: ApiResponse<QrResolutionResponse>) => response.data,
    }),

    // Amenities
    getAmenities: builder.query<WorkplaceAmenity[], void>({
      query: () => "/workplace/amenities",
      transformResponse: (response: ApiResponse<WorkplaceAmenity[]>) => response.data,
      providesTags: ["Workplace"],
    }),
    createAmenity: builder.mutation<WorkplaceAmenity, { name: string; iconName?: string; description?: string }>({
      query: (body) => ({ url: "/workplace/amenities", method: "POST", body }),
      invalidatesTags: ["Workplace"],
    }),
    deleteAmenity: builder.mutation<void, string>({
      query: (amenityId) => ({ url: `/workplace/amenities/${amenityId}`, method: "DELETE" }),
      invalidatesTags: ["Workplace"],
    }),
  }),
});

export const {
  useGetSitesQuery,
  useGetSiteByIdQuery,
  useCreateSiteMutation,
  useUpdateSiteMutation,
  useDeleteSiteMutation,
  useGetFloorsBySiteIdQuery,
  useCreateFloorMutation,
  useUpdateFloorMutation,
  useDeleteFloorMutation,
  useGetFloorPlansQuery,
  useCreateFloorPlanMutation,
  useGetFloorMapQuery,
  useSaveFloorLayoutMutation,
  usePublishFloorPlanMutation,
  useArchiveFloorPlanMutation,
  useCreateZoneMutation,
  useDeleteZoneMutation,
  useCreateSeatRowMutation,
  useDeleteSeatRowMutation,
  useGenerateSeatsForRowMutation,
  useGetSeatsQuery,
  useGetSeatByIdQuery,
  useCreateSeatMutation,
  useUpdateSeatStatusMutation,
  useDeleteSeatMutation,
  useGetSeatAssignmentsQuery,
  useAssignSeatMutation,
  useReleaseSeatMutation,
  useGetAvailableHotDesksQuery,
  useBookDeskMutation,
  useCheckInDeskMutation,
  useCancelDeskBookingMutation,
  useGetDeskBookingsQuery,
  useGetMyDeskBookingsQuery,
  useGetMySeatQuery,
  useGetRoomBookingsQuery,
  useGetMeetingRoomsQuery,
  useBookRoomMutation,
  useCheckInRoomMutation,
  useCancelRoomBookingMutation,
  useGetMyRoomBookingsQuery,
  useGetIssuesQuery,
  useGetIssueByIdQuery,
  useReportIssueMutation,
  useAssignIssueMutation,
  useStartIssueMutation,
  useResolveIssueMutation,
  useGetMyIssuesQuery,
  useGetEmployeeLocationQuery,
  // useGetUtilizationReportQuery, // Tạm thời bỏ
  useCalculateRouteQuery,
  useResolveQrQuery,
  useGetAmenitiesQuery,
  useCreateAmenityMutation,
  useDeleteAmenityMutation,
} = workplaceApi;
