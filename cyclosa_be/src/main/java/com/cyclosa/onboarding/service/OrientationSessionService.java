package com.cyclosa.onboarding.service;

import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.response.PageData;
import com.cyclosa.onboarding.dto.OrientationSessionDto;
import com.cyclosa.onboarding.entity.OnboardingTask;
import com.cyclosa.onboarding.entity.OrientationSession;
import com.cyclosa.onboarding.enums.OnboardingTaskStatus;
import com.cyclosa.onboarding.enums.OrientationSessionStatus;
import com.cyclosa.onboarding.exception.OnboardingErrorCode;
import com.cyclosa.onboarding.mapper.OnboardingMapper;
import com.cyclosa.onboarding.repository.OnboardingTaskRepository;
import com.cyclosa.onboarding.repository.OrientationSessionRepository;
import com.cyclosa.onboarding.repository.specification.OrientationSessionSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrientationSessionService {

    private final OrientationSessionRepository sessionRepository;
    private final OnboardingTaskRepository taskRepository;
    private final OnboardingMapper mapper;

    @Transactional(readOnly = true)
    public PageData<OrientationSessionDto.Response> searchSessions(OrientationSessionDto.FilterRequest filter) {
        PageRequest pageRequest = PageRequest.of(
                filter.getPage(),
                filter.getSize(),
                Sort.by(Sort.Direction.DESC, "startTime")
        );

        Page<OrientationSession> page = sessionRepository.findAll(
                OrientationSessionSpecification.withFilters(
                        filter.getCompanyId(),
                        filter.getStatus(),
                        filter.getFrom(),
                        filter.getTo(),
                        filter.getKeyword()
                ),
                pageRequest
        );

        return PageData.of(page, session -> {
            OrientationSessionDto.Response res = mapper.toResponse(session);
            List<OnboardingTask> tasks = taskRepository.findByOrientationSession_Id(session.getId());
            res.setAttendeeCount(tasks.size());
            return res;
        });
    }

    @Transactional(readOnly = true)
    public OrientationSessionDto.Response getById(UUID id) {
        OrientationSession entity = sessionRepository.findById(id)
                .orElseThrow(() -> new AppException(OnboardingErrorCode.ORIENTATION_SESSION_NOT_FOUND));
        OrientationSessionDto.Response res = mapper.toResponse(entity);
        List<OnboardingTask> tasks = taskRepository.findByOrientationSession_Id(entity.getId());
        res.setAttendeeCount(tasks.size());
        return res;
    }

    @Transactional
    public OrientationSessionDto.Response create(OrientationSessionDto.CreateRequest request) {
        OrientationSession entity = mapper.toEntity(request);
        entity.setStatus(OrientationSessionStatus.SCHEDULED);
        OrientationSession saved = sessionRepository.save(entity);
        log.info("Đã lên lịch buổi đào tạo định hướng id='{}' title='{}'", saved.getId(), saved.getTitle());
        return mapper.toResponse(saved);
    }

    @Transactional
    public OrientationSessionDto.Response update(UUID id, OrientationSessionDto.UpdateRequest request) {
        OrientationSession entity = sessionRepository.findById(id)
                .orElseThrow(() -> new AppException(OnboardingErrorCode.ORIENTATION_SESSION_NOT_FOUND));

        if (entity.getStatus() == OrientationSessionStatus.COMPLETED) {
            throw new AppException(OnboardingErrorCode.ORIENTATION_SESSION_ALREADY_COMPLETED);
        }

        entity.setTitle(request.getTitle().trim());
        entity.setDescription(request.getDescription());
        entity.setStartTime(request.getStartTime());
        entity.setEndTime(request.getEndTime());
        entity.setLocation(request.getLocation().trim());
        entity.setTrainerEmployeeId(request.getTrainerEmployeeId());

        OrientationSession saved = sessionRepository.save(entity);
        return mapper.toResponse(saved);
    }

    @Transactional
    public OrientationSessionDto.Response complete(UUID id) {
        OrientationSession entity = sessionRepository.findById(id)
                .orElseThrow(() -> new AppException(OnboardingErrorCode.ORIENTATION_SESSION_NOT_FOUND));

        entity.setStatus(OrientationSessionStatus.COMPLETED);
        OrientationSession saved = sessionRepository.save(entity);
        log.info("Xác nhận hoàn thành buổi đào tạo id={}", id);
        return mapper.toResponse(saved);
    }

    @Transactional
    public OrientationSessionDto.Response cancel(UUID id) {
        OrientationSession entity = sessionRepository.findById(id)
                .orElseThrow(() -> new AppException(OnboardingErrorCode.ORIENTATION_SESSION_NOT_FOUND));

        entity.setStatus(OrientationSessionStatus.CANCELLED);
        OrientationSession saved = sessionRepository.save(entity);
        log.info("Đã hủy buổi đào tạo định hướng id={}", id);
        return mapper.toResponse(saved);
    }

    @Transactional
    public void recordAttendance(UUID id, OrientationSessionDto.AttendanceRequest request) {
        OrientationSession session = sessionRepository.findById(id)
                .orElseThrow(() -> new AppException(OnboardingErrorCode.ORIENTATION_SESSION_NOT_FOUND));

        List<OnboardingTask> tasks = taskRepository.findByOrientationSession_IdAndProcess_EmployeeIdIn(
                id, request.getEmployeeIds()
        );

        LocalDateTime now = LocalDateTime.now();
        for (OnboardingTask task : tasks) {
            task.setStatus(OnboardingTaskStatus.COMPLETED);
            task.setCompletedAt(now);
            taskRepository.save(task);
        }

        log.info("Đã điểm danh cho {} nhân viên trong buổi đào tạo id={}", tasks.size(), id);
    }
}

