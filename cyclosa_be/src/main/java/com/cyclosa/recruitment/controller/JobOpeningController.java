package com.cyclosa.recruitment.controller;

import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.response.PageData;
import com.cyclosa.recruitment.dto.JobOpeningDto;
import com.cyclosa.recruitment.service.JobOpeningService;
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
@RequestMapping("/api/v1/recruitment/job-openings")
@RequiredArgsConstructor
@Tag(name = "Job Opening", description = "Quản lý tin đăng và vị trí tuyển dụng")
public class JobOpeningController {

    private final JobOpeningService jobOpeningService;

    @PostMapping
    @PreAuthorize("@perm.has('recruitment.job.manage')")
    @RequirePermission("recruitment.job.manage")
    @Operation(summary = "Tạo mới vị trí tuyển dụng kèm cấu hình các vòng phỏng vấn")
    public ResponseEntity<ApiResponse<JobOpeningDto.Response>> createJobOpening(
            @Valid @RequestBody JobOpeningDto.CreateRequest request
    ) {
        JobOpeningDto.Response response = jobOpeningService.createJobOpening(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(response, "Khởi tạo vị trí tuyển dụng thành công"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("@perm.has('recruitment.job.manage')")
    @RequirePermission("recruitment.job.manage")
    @Operation(summary = "Cập nhật thông tin vị trí tuyển dụng")
    public ResponseEntity<ApiResponse<JobOpeningDto.Response>> updateJobOpening(
            @PathVariable UUID id,
            @Valid @RequestBody JobOpeningDto.UpdateRequest request
    ) {
        JobOpeningDto.Response response = jobOpeningService.updateJobOpening(id, request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Cập nhật vị trí tuyển dụng thành công"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("@perm.has('recruitment.job.view')")
    @RequirePermission("recruitment.job.view")
    @Operation(summary = "Xem chi tiết vị trí tuyển dụng kèm bộ tiêu chí và câu hỏi các vòng")
    public ResponseEntity<ApiResponse<JobOpeningDto.Response>> getJobOpeningById(
            @PathVariable UUID id
    ) {
        JobOpeningDto.Response response = jobOpeningService.getJobOpeningById(id);
        return ResponseEntity.ok(ApiResponse.ok(response, "Lấy thông tin vị trí tuyển dụng thành công"));
    }

    @GetMapping
    @PreAuthorize("@perm.has('recruitment.job.view')")
    @RequirePermission("recruitment.job.view")
    @Operation(summary = "Tìm kiếm và phân trang danh sách vị trí tuyển dụng")
    public ResponseEntity<ApiResponse<PageData<JobOpeningDto.Response>>> searchJobOpenings(
            @ModelAttribute JobOpeningDto.FilterRequest filter
    ) {
        PageData<JobOpeningDto.Response> response = jobOpeningService.searchJobOpenings(filter);
        return ResponseEntity.ok(ApiResponse.ok(response, "Lấy danh sách vị trí tuyển dụng thành công"));
    }

    @PostMapping("/{id}/publish")
    @PreAuthorize("@perm.has('recruitment.job.manage')")
    @RequirePermission("recruitment.job.manage")
    @Operation(summary = "Công khai phát hành tin tuyển dụng")
    public ResponseEntity<ApiResponse<JobOpeningDto.Response>> publishJobOpening(
            @PathVariable UUID id
    ) {
        JobOpeningDto.Response response = jobOpeningService.publishJobOpening(id);
        return ResponseEntity.ok(ApiResponse.ok(response, "Đăng tải tin tuyển dụng thành công"));
    }

    @PostMapping("/{id}/close")
    @PreAuthorize("@perm.has('recruitment.job.manage')")
    @RequirePermission("recruitment.job.manage")
    @Operation(summary = "Đóng tin tuyển dụng")
    public ResponseEntity<ApiResponse<JobOpeningDto.Response>> closeJobOpening(
            @PathVariable UUID id
    ) {
        JobOpeningDto.Response response = jobOpeningService.closeJobOpening(id);
        return ResponseEntity.ok(ApiResponse.ok(response, "Đóng tin tuyển dụng thành công"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@perm.has('recruitment.job.manage')")
    @RequirePermission("recruitment.job.manage")
    @Operation(summary = "Xóa vị trí tuyển dụng")
    public ResponseEntity<ApiResponse<Void>> deleteJobOpening(@PathVariable UUID id) {
        jobOpeningService.deleteJobOpening(id);
        return ResponseEntity.ok(ApiResponse.noContent("Xóa vị trí tuyển dụng thành công"));
    }
}
