package com.cyclosa.workplace.controller;

import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.workplace.dto.response.DeskBookingResponse;
import com.cyclosa.workplace.dto.response.RoomBookingResponse;
import com.cyclosa.workplace.dto.response.WorkplaceIssueResponse;
import com.cyclosa.workplace.dto.response.WorkplaceSeatDetailResponse;
import com.cyclosa.workplace.service.WorkplaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/me/workplace")
@RequiredArgsConstructor
public class MyWorkplaceController {

    private final WorkplaceService workplaceService;

    @GetMapping("/seat")
    public ResponseEntity<ApiResponse<WorkplaceSeatDetailResponse>> getMySeat() {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.ok(workplaceService.getMyDedicatedSeat(currentUserId)));
    }

    @GetMapping("/desk-bookings")
    public ResponseEntity<ApiResponse<List<DeskBookingResponse>>> getMyDeskBookings() {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.ok(workplaceService.getMyDeskBookings(currentUserId)));
    }

    @GetMapping("/room-bookings")
    public ResponseEntity<ApiResponse<List<RoomBookingResponse>>> getMyRoomBookings() {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.ok(workplaceService.getMyRoomBookings(currentUserId)));
    }

    @GetMapping("/issues")
    public ResponseEntity<ApiResponse<List<WorkplaceIssueResponse>>> getMyIssues() {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.ok(workplaceService.getMyIssues(currentUserId)));
    }
}
