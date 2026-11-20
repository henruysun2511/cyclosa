package com.cyclosa.recruitment.controller;

import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.recruitment.dto.JobPostingDto;
import com.cyclosa.recruitment.dto.RecruitmentChannelDto;
import com.cyclosa.recruitment.service.RecruitmentChannelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/recruitment/channels")
@RequiredArgsConstructor
@Tag(name = "Recruitment Channel", description = "Quản lý kênh tuyển dụng & tin đăng ngoài")
public class RecruitmentChannelController {

    private final RecruitmentChannelService channelService;

    @GetMapping
    @PreAuthorize("@perm.has('recruitment.job.view')")
    @RequirePermission("recruitment.job.view")
    @Operation(summary = "Lấy danh sách các kênh tuyển dụng đang hoạt động")
    public ResponseEntity<ApiResponse<List<RecruitmentChannelDto.Response>>> listActiveChannels() {
        List<RecruitmentChannelDto.Response> response = channelService.listActiveChannels();
        return ResponseEntity.ok(ApiResponse.ok(response, "Lấy danh sách kênh tuyển dụng thành công"));
    }

    @PostMapping
    @PreAuthorize("@perm.has('recruitment.job.manage')")
    @RequirePermission("recruitment.job.manage")
    @Operation(summary = "Tạo mới kênh tuyển dụng")
    public ResponseEntity<ApiResponse<RecruitmentChannelDto.Response>> createChannel(
            @Valid @RequestBody RecruitmentChannelDto.CreateRequest request
    ) {
        RecruitmentChannelDto.Response response = channelService.createChannel(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(response, "Tạo kênh tuyển dụng thành công"));
    }

    @PostMapping("/postings")
    @PreAuthorize("@perm.has('recruitment.job.manage')")
    @RequirePermission("recruitment.job.manage")
    @Operation(summary = "Đăng tin tuyển dụng lên kênh ngoài")
    public ResponseEntity<ApiResponse<JobPostingDto.Response>> createJobPosting(
            @Valid @RequestBody JobPostingDto.CreateRequest request
    ) {
        JobPostingDto.Response response = channelService.createJobPosting(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(response, "Đăng tin tuyển dụng lên kênh thành công"));
    }

    @GetMapping("/postings/job/{jobOpeningId}")
    @PreAuthorize("@perm.has('recruitment.job.view')")
    @RequirePermission("recruitment.job.view")
    @Operation(summary = "Lấy danh sách kênh đã đăng của một vị trí tuyển dụng")
    public ResponseEntity<ApiResponse<List<JobPostingDto.Response>>> listPostingsByJobOpening(
            @PathVariable UUID jobOpeningId
    ) {
        List<JobPostingDto.Response> response = channelService.listPostingsByJobOpening(jobOpeningId);
        return ResponseEntity.ok(ApiResponse.ok(response, "Lấy danh sách bài đăng thành công"));
    }
}
