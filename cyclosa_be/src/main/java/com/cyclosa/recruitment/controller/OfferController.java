package com.cyclosa.recruitment.controller;

import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.response.PageData;
import com.cyclosa.recruitment.dto.OfferDto;
import com.cyclosa.recruitment.service.OfferService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/recruitment/offers")
@RequiredArgsConstructor
@Tag(name = "Offer", description = "Quản lý lời mời nhận việc (Offer Letter)")
public class OfferController {

    private final OfferService offerService;

    @PostMapping
    @PreAuthorize("@perm.has('recruitment.offer.manage')")
    @RequirePermission("recruitment.offer.manage")
    @Operation(summary = "Tạo mới thư mời nhận việc cho ứng viên")
    public ResponseEntity<ApiResponse<OfferDto.Response>> createOffer(
            @Valid @RequestBody OfferDto.CreateRequest request
    ) {
        OfferDto.Response response = offerService.createOffer(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(response, "Tạo thư mời nhận việc thành công"));
    }

    @PostMapping("/{id}/send")
    @PreAuthorize("@perm.has('recruitment.offer.manage')")
    @RequirePermission("recruitment.offer.manage")
    @Operation(summary = "Gửi thư mời nhận việc đến ứng viên")
    public ResponseEntity<ApiResponse<OfferDto.Response>> sendOffer(
            @PathVariable UUID id
    ) {
        OfferDto.Response response = offerService.sendOffer(id);
        return ResponseEntity.ok(ApiResponse.ok(response, "Đã gửi thư mời nhận việc đến ứng viên"));
    }

    @PostMapping("/{id}/accept")
    @PreAuthorize("@perm.has('recruitment.offer.manage')")
    @RequirePermission("recruitment.offer.manage")
    @Operation(summary = "Xác nhận ứng viên đã đồng ý nhận việc (chuyển trạng thái sang HIRED)")
    public ResponseEntity<ApiResponse<OfferDto.Response>> acceptOffer(
            @PathVariable UUID id
    ) {
        OfferDto.Response response = offerService.acceptOffer(id);
        return ResponseEntity.ok(ApiResponse.ok(response, "Ứng viên đã chấp thuận thư mời nhận việc"));
    }

    @PostMapping("/{id}/onboard")
    @PreAuthorize("@perm.has('recruitment.offer.manage')")
    @RequirePermission("recruitment.offer.manage")
    @Operation(summary = "Tiếp nhận nhân sự 1-click: Tự động tạo hồ sơ nhân viên và kích hoạt tiến trình Onboarding")
    public ResponseEntity<ApiResponse<OfferDto.ConvertToEmployeeResponse>> convertOfferToEmployee(
            @PathVariable UUID id
    ) {
        OfferDto.ConvertToEmployeeResponse response = offerService.convertOfferToEmployee(id);
        return ResponseEntity.ok(ApiResponse.ok(response, "Tiếp nhận nhân sự và kích hoạt Onboarding thành công"));
    }

    @PostMapping("/{id}/decline")
    @PreAuthorize("@perm.has('recruitment.offer.manage')")
    @RequirePermission("recruitment.offer.manage")
    @Operation(summary = "Ghi nhận ứng viên từ chối nhận việc")
    public ResponseEntity<ApiResponse<OfferDto.Response>> declineOffer(
            @PathVariable UUID id,
            @Valid @RequestBody OfferDto.UpdateStatusRequest request
    ) {
        OfferDto.Response response = offerService.declineOffer(id, request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Đã ghi nhận ứng viên từ chối nhận việc"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("@perm.has('recruitment.offer.manage')")
    @RequirePermission("recruitment.offer.manage")
    @Operation(summary = "Xem chi tiết thư mời nhận việc và phụ cấp")
    public ResponseEntity<ApiResponse<OfferDto.Response>> getOfferById(
            @PathVariable UUID id
    ) {
        OfferDto.Response response = offerService.getOfferById(id);
        return ResponseEntity.ok(ApiResponse.ok(response, "Lấy thông tin thư mời nhận việc thành công"));
    }

    @GetMapping
    @PreAuthorize("@perm.has('recruitment.offer.manage')")
    @RequirePermission("recruitment.offer.manage")
    @Operation(summary = "Tìm kiếm và phân trang danh sách thư mời nhận việc")
    public ResponseEntity<ApiResponse<PageData<OfferDto.Response>>> searchOffers(
            @ModelAttribute OfferDto.FilterRequest filter
    ) {
        PageData<OfferDto.Response> response = offerService.searchOffers(filter);
        return ResponseEntity.ok(ApiResponse.ok(response, "Lấy danh sách thư mời nhận việc thành công"));
    }
}
