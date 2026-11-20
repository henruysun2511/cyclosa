package com.cyclosa.recruitment.service;

import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.response.PageData;
import com.cyclosa.notification.enums.NotificationType;
import com.cyclosa.notification.event.SendNotificationEvent;
import com.cyclosa.recruitment.dto.RecruitmentRequestDto;
import com.cyclosa.recruitment.entity.RecruitmentRequest;
import com.cyclosa.recruitment.enums.RecruitmentRequestStatus;
import com.cyclosa.recruitment.exception.RecruitmentErrorCode;
import com.cyclosa.recruitment.mapper.RecruitmentRequestMapper;
import com.cyclosa.recruitment.repository.RecruitmentRequestRepository;
import com.cyclosa.recruitment.repository.specification.RecruitmentRequestSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecruitmentRequestService {

    private final RecruitmentRequestRepository requestRepository;
    private final RecruitmentRequestMapper requestMapper;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public RecruitmentRequestDto.Response createRequest(UUID requesterId, RecruitmentRequestDto.CreateRequest dto) {
        RecruitmentRequest entity = requestMapper.toEntity(dto);
        entity.setRequestedByEmployeeId(requesterId);
        entity.setStatus(RecruitmentRequestStatus.PENDING_APPROVAL);

        RecruitmentRequest saved = requestRepository.save(entity);
        log.info("Đã tạo yêu cầu tuyển dụng mới id={} bởi requester {}", saved.getId(), requesterId);
        return requestMapper.toResponse(saved);
    }

    @Transactional
    public RecruitmentRequestDto.Response updateRequest(UUID id, RecruitmentRequestDto.UpdateRequest dto) {
        RecruitmentRequest entity = requestRepository.findById(id)
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.RECRUITMENT_REQUEST_NOT_FOUND));

        if (entity.getStatus() != RecruitmentRequestStatus.PENDING_APPROVAL && entity.getStatus() != RecruitmentRequestStatus.REJECTED) {
            throw new AppException(RecruitmentErrorCode.RECRUITMENT_REQUEST_NOT_EDITABLE);
        }

        requestMapper.updateEntityFromDto(dto, entity);
        RecruitmentRequest saved = requestRepository.save(entity);
        return requestMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public RecruitmentRequestDto.Response getRequestById(UUID id) {
        RecruitmentRequest entity = requestRepository.findById(id)
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.RECRUITMENT_REQUEST_NOT_FOUND));
        return requestMapper.toResponse(entity);
    }

    @Transactional(readOnly = true)
    public PageData<RecruitmentRequestDto.Response> searchRequests(RecruitmentRequestDto.FilterRequest filter) {
        PageRequest pageRequest = PageRequest.of(
                filter.getPage(),
                filter.getSize(),
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Page<RecruitmentRequest> page = requestRepository.findAll(
                RecruitmentRequestSpecification.withFilters(
                        filter.getCompanyId(),
                        filter.getDepartmentId(),
                        filter.getPositionId(),
                        filter.getStatus(),
                        filter.getKeyword()
                ),
                pageRequest
        );

        return PageData.of(page, requestMapper::toResponse);
    }

    @Transactional
    public RecruitmentRequestDto.Response submitForApproval(UUID id) {
        RecruitmentRequest entity = requestRepository.findById(id)
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.RECRUITMENT_REQUEST_NOT_FOUND));

        entity.setStatus(RecruitmentRequestStatus.PENDING_APPROVAL);
        RecruitmentRequest saved = requestRepository.save(entity);

        if (entity.getRequestedByEmployeeId() != null) {
            eventPublisher.publishEvent(SendNotificationEvent.ofSingle(
                    entity.getRequestedByEmployeeId(),
                    NotificationType.SYSTEM,
                    "Yêu cầu tuyển dụng đang chờ phê duyệt",
                    "Yêu cầu tuyển dụng đã được gửi lên cấp phê duyệt.",
                    "/recruitment/requests/" + entity.getId()
            ));
        }

        return requestMapper.toResponse(saved);
    }

    @Transactional
    public RecruitmentRequestDto.Response approveRequest(UUID id) {
        RecruitmentRequest entity = requestRepository.findById(id)
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.RECRUITMENT_REQUEST_NOT_FOUND));

        if (entity.getStatus() != RecruitmentRequestStatus.PENDING_APPROVAL) {
            throw new AppException(RecruitmentErrorCode.RECRUITMENT_REQUEST_NOT_EDITABLE);
        }

        entity.setStatus(RecruitmentRequestStatus.APPROVED);
        RecruitmentRequest saved = requestRepository.save(entity);

        if (entity.getRequestedByEmployeeId() != null) {
            eventPublisher.publishEvent(SendNotificationEvent.ofSingle(
                    entity.getRequestedByEmployeeId(),
                    NotificationType.SYSTEM,
                    "Yêu cầu tuyển dụng đã được phê duyệt",
                    "Yêu cầu tuyển dụng của bạn đã được duyệt thành công.",
                    "/recruitment/requests/" + entity.getId()
            ));
        }

        return requestMapper.toResponse(saved);
    }

    @Transactional
    public RecruitmentRequestDto.Response rejectRequest(UUID id, String reason) {
        RecruitmentRequest entity = requestRepository.findById(id)
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.RECRUITMENT_REQUEST_NOT_FOUND));

        if (entity.getStatus() != RecruitmentRequestStatus.PENDING_APPROVAL) {
            throw new AppException(RecruitmentErrorCode.RECRUITMENT_REQUEST_NOT_EDITABLE);
        }

        entity.setStatus(RecruitmentRequestStatus.REJECTED);
        RecruitmentRequest saved = requestRepository.save(entity);

        if (entity.getRequestedByEmployeeId() != null) {
            eventPublisher.publishEvent(SendNotificationEvent.ofSingle(
                    entity.getRequestedByEmployeeId(),
                    NotificationType.SYSTEM,
                    "Yêu cầu tuyển dụng đã bị từ chối",
                    "Yêu cầu tuyển dụng đã bị từ chối. Lý do: " + (reason != null ? reason : "Không có"),
                    "/recruitment/requests/" + entity.getId()
            ));
        }

        return requestMapper.toResponse(saved);
    }

    @Transactional
    public void deleteRequest(UUID id) {
        RecruitmentRequest entity = requestRepository.findById(id)
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.RECRUITMENT_REQUEST_NOT_FOUND));
        requestRepository.delete(entity);
    }
}
