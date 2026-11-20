package com.cyclosa.recruitment.controller;

import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.response.PageData;
import com.cyclosa.recruitment.dto.ApplicationDto;
import com.cyclosa.recruitment.dto.PublicJobOpeningDto;
import com.cyclosa.recruitment.service.PublicJobOpeningService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/public/job-openings")
@RequiredArgsConstructor
@Tag(name = "Public Careers Portal", description = "Cổng thông tin tuyển dụng & ứng tuyển trực tuyến công khai cho ứng viên")
public class PublicJobOpeningController {

    private final PublicJobOpeningService publicJobOpeningService;

    @GetMapping
    @Operation(summary = "Xem danh sách việc làm đang mở tuyển công khai")
    public ResponseEntity<ApiResponse<PageData<PublicJobOpeningDto.Response>>> getPublishedOpenings(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) UUID departmentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageData<PublicJobOpeningDto.Response> result = publicJobOpeningService.getPublishedOpenings(keyword, departmentId, page, size);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách việc làm thành công"));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Xem chi tiết vị trí tuyển dụng theo URL slug công khai")
    public ResponseEntity<ApiResponse<PublicJobOpeningDto.Response>> getOpeningBySlug(
            @PathVariable String slug
    ) {
        PublicJobOpeningDto.Response result = publicJobOpeningService.getOpeningBySlug(slug);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy chi tiết vị trí tuyển dụng thành công"));
    }

    @PostMapping(value = "/{slug}/applications", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Ứng viên nộp hồ sơ trực tuyến kèm tệp CV qua Career Landing Page")
    public ResponseEntity<ApiResponse<ApplicationDto.Response>> applyWithFile(
            @PathVariable String slug,
            @Valid @ModelAttribute PublicJobOpeningDto.ApplyRequest request,
            @RequestParam(value = "cv", required = false) MultipartFile cvFile
    ) {
        ApplicationDto.Response result = publicJobOpeningService.applyBySlug(slug, request, cvFile);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(result, "Hồ sơ ứng tuyển của bạn đã được gửi thành công"));
    }

    @PostMapping(value = "/{slug}/apply")
    @Operation(summary = "Ứng viên nộp hồ sơ trực tuyến dạng JSON hoặc link CV")
    public ResponseEntity<ApiResponse<ApplicationDto.Response>> applyJson(
            @PathVariable String slug,
            @Valid @RequestBody PublicJobOpeningDto.ApplyRequest request
    ) {
        ApplicationDto.Response result = publicJobOpeningService.applyBySlug(slug, request, null);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(result, "Hồ sơ ứng tuyển của bạn đã được gửi thành công"));
    }
}

