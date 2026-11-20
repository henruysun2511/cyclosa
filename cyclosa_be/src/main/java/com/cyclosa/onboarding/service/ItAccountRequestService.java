package com.cyclosa.onboarding.service;

import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.response.PageData;
import com.cyclosa.onboarding.dto.ItAccountRequestDto;
import com.cyclosa.onboarding.entity.ItAccountRequest;
import com.cyclosa.onboarding.entity.OnboardingTask;
import com.cyclosa.onboarding.enums.ItAccountRequestStatus;
import com.cyclosa.onboarding.enums.OnboardingTaskStatus;
import com.cyclosa.onboarding.exception.OnboardingErrorCode;
import com.cyclosa.onboarding.mapper.OnboardingMapper;
import com.cyclosa.onboarding.repository.ItAccountRequestRepository;
import com.cyclosa.onboarding.repository.OnboardingTaskRepository;
import com.cyclosa.onboarding.repository.specification.ItAccountRequestSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ItAccountRequestService {

    private final ItAccountRequestRepository requestRepository;
    private final OnboardingTaskRepository taskRepository;
    private final OnboardingMapper mapper;

    @Transactional(readOnly = true)
    public PageData<ItAccountRequestDto.Response> searchRequests(ItAccountRequestDto.FilterRequest filter) {
        PageRequest pageRequest = PageRequest.of(
                filter.getPage(),
                filter.getSize(),
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Page<ItAccountRequest> page = requestRepository.findAll(
                ItAccountRequestSpecification.withFilters(filter.getStatus()),
                pageRequest
        );

        return PageData.of(page, mapper::toResponse);
    }

    @Transactional
    public ItAccountRequestDto.Response provision(UUID id, ItAccountRequestDto.ProvisionRequest req) {
        ItAccountRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new AppException(OnboardingErrorCode.IT_REQUEST_NOT_FOUND));

        if (request.getStatus() != ItAccountRequestStatus.PENDING) {
            throw new AppException(OnboardingErrorCode.IT_REQUEST_ALREADY_PROCESSED);
        }

        LocalDateTime now = LocalDateTime.now();
        request.setStatus(ItAccountRequestStatus.PROVISIONED);
        request.setAccountIdentifier(req.getAccountIdentifier().trim());
        request.setHandledAt(now);
        request.setFailureReason(null);

        OnboardingTask task = request.getOnboardingTask();
        if (task != null) {
            task.setStatus(OnboardingTaskStatus.COMPLETED);
            task.setCompletedAt(now);
            taskRepository.save(task);
        }

        ItAccountRequest saved = requestRepository.save(request);
        log.info("IT Helpdesk đã cấp tài khoản identifier='{}' cho request id={}", req.getAccountIdentifier(), id);
        return mapper.toResponse(saved);
    }

    @Transactional
    public ItAccountRequestDto.Response fail(UUID id, ItAccountRequestDto.FailRequest req) {
        ItAccountRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new AppException(OnboardingErrorCode.IT_REQUEST_NOT_FOUND));

        if (request.getStatus() != ItAccountRequestStatus.PENDING) {
            throw new AppException(OnboardingErrorCode.IT_REQUEST_ALREADY_PROCESSED);
        }

        request.setStatus(ItAccountRequestStatus.FAILED);
        request.setFailureReason(req.getFailureReason().trim());
        request.setHandledAt(LocalDateTime.now());

        ItAccountRequest saved = requestRepository.save(request);
        log.warn("IT Helpdesk báo cáo thất bại cho request id={} reason='{}'", id, req.getFailureReason());
        return mapper.toResponse(saved);
    }
}

