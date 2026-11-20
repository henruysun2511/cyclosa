package com.cyclosa.organization.service;

import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.response.PageData;
import com.cyclosa.common.util.PageableUtils;
import com.cyclosa.organization.dto.request.CreateJobTitleRequest;
import com.cyclosa.organization.dto.request.JobTitleFilterRequest;
import com.cyclosa.organization.dto.request.UpdateJobTitleRequest;
import com.cyclosa.organization.dto.response.JobTitleResponse;
import com.cyclosa.organization.entity.JobTitle;
import com.cyclosa.organization.exception.OrganizationErrorCode;
import com.cyclosa.organization.mapper.JobTitleMapper;
import com.cyclosa.organization.repository.CompanyRepository;
import com.cyclosa.organization.repository.JobTitleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class JobTitleService {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("code", "name", "createdAt");

    private final JobTitleRepository jobTitleRepository;
    private final CompanyRepository companyRepository;
    private final JobTitleMapper jobTitleMapper;

    public PageData<JobTitleResponse> getJobTitles(JobTitleFilterRequest filter) {
        UUID companyId = filter.getCompanyId() != null ? filter.getCompanyId() : resolveCurrentCompanyId();
        if (companyId != null) {
            verifyCompanyExists(companyId);
        }
        String kw = PageableUtils.normalizeKeyword(filter.getKeyword());
        Pageable pageable = filter.toPageable("createdAt", ALLOWED_SORT_FIELDS);
        Page<JobTitle> page = jobTitleRepository.search(companyId, kw, pageable);
        return PageData.of(page, jobTitleMapper::toResponse);
    }

    public List<JobTitleResponse> getAllJobTitlesByCompany(UUID companyId) {
        UUID targetCompanyId = companyId != null ? companyId : resolveCurrentCompanyId();
        if (targetCompanyId != null) {
            verifyCompanyExists(targetCompanyId);
        }
        return jobTitleRepository.findAllByCompanyId(targetCompanyId).stream()
                .map(jobTitleMapper::toResponse)
                .toList();
    }

    public JobTitleResponse getJobTitleById(UUID id) {
        JobTitle jobTitle = findJobTitleOrThrow(id);
        return jobTitleMapper.toResponse(jobTitle);
    }

    @Transactional
    public JobTitleResponse createJobTitle(CreateJobTitleRequest request) {
        verifyCompanyExists(request.getCompanyId());

        if (jobTitleRepository.existsByCompanyIdAndCode(request.getCompanyId(), request.getCode())) {
            throw new AppException(OrganizationErrorCode.JOB_TITLE_CODE_EXISTS);
        }

        JobTitle jobTitle = jobTitleMapper.toEntity(request);
        jobTitle.setCode(request.getCode().toUpperCase().trim());
        jobTitle.setName(request.getName().trim());

        jobTitle = jobTitleRepository.save(jobTitle);
        log.info("Đã tạo mới chức danh: id={}, code={}", jobTitle.getId(), jobTitle.getCode());
        return jobTitleMapper.toResponse(jobTitle);
    }

    @Transactional
    public JobTitleResponse updateJobTitle(UUID id, UpdateJobTitleRequest request) {
        JobTitle jobTitle = findJobTitleOrThrow(id);
        jobTitleMapper.updateEntityFromDto(request, jobTitle);
        jobTitle.setName(request.getName().trim());

        jobTitle = jobTitleRepository.save(jobTitle);
        log.info("Đã cập nhật chức danh: id={}", jobTitle.getId());
        return jobTitleMapper.toResponse(jobTitle);
    }

    @Transactional
    public void deleteJobTitle(UUID id) {
        JobTitle jobTitle = findJobTitleOrThrow(id);
        jobTitleRepository.delete(jobTitle);
        log.info("Đã xóa mềm chức danh: id={}", id);
    }

    public JobTitle findJobTitleOrThrow(UUID id) {
        return jobTitleRepository.findById(id)
                .orElseThrow(() -> new AppException(OrganizationErrorCode.JOB_TITLE_NOT_FOUND));
    }

    public Optional<JobTitle> findJobTitleEntityById(UUID id) {
        return jobTitleRepository.findById(id);
    }

    private void verifyCompanyExists(UUID companyId) {
        if (!companyRepository.existsById(companyId)) {
            throw new AppException(OrganizationErrorCode.COMPANY_NOT_FOUND);
        }
    }

    private UUID resolveCurrentCompanyId() {
        return com.cyclosa.common.util.SecurityUtils.getCurrentUserCompanyIdOptional()
                .orElseGet(() -> companyRepository.findAll().stream()
                        .findFirst()
                        .map(c -> c.getId())
                        .orElse(null));
    }
}
