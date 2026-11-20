package com.cyclosa.recruitment.service;

import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.response.PageData;
import com.cyclosa.recruitment.dto.ApplicationDto;
import com.cyclosa.recruitment.entity.Application;
import com.cyclosa.recruitment.entity.ApplicationStageTransition;
import com.cyclosa.recruitment.entity.Candidate;
import com.cyclosa.recruitment.entity.JobOpening;
import com.cyclosa.recruitment.enums.ApplicationStage;
import com.cyclosa.recruitment.enums.JobOpeningStatus;
import com.cyclosa.recruitment.exception.RecruitmentErrorCode;
import com.cyclosa.recruitment.mapper.ApplicationMapper;
import com.cyclosa.recruitment.repository.ApplicationRepository;
import com.cyclosa.recruitment.repository.ApplicationStageTransitionRepository;
import com.cyclosa.recruitment.repository.CandidateRepository;
import com.cyclosa.recruitment.repository.JobOpeningRepository;
import com.cyclosa.recruitment.repository.specification.ApplicationSpecification;
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
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ApplicationStageTransitionRepository transitionRepository;
    private final JobOpeningRepository jobOpeningRepository;
    private final CandidateRepository candidateRepository;
    private final ApplicationMapper applicationMapper;

    @Transactional
    public ApplicationDto.Response createApplication(ApplicationDto.CreateRequest dto) {
        JobOpening jobOpening = jobOpeningRepository.findById(dto.getJobOpeningId())
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.JOB_OPENING_NOT_FOUND));

        if (jobOpening.getStatus() == JobOpeningStatus.CLOSED) {
            throw new AppException(RecruitmentErrorCode.JOB_OPENING_CLOSED);
        }

        Candidate candidate = candidateRepository.findById(dto.getCandidateId())
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.CANDIDATE_NOT_FOUND));

        if (applicationRepository.existsByJobOpening_IdAndCandidate_Id(dto.getJobOpeningId(), dto.getCandidateId())) {
            throw new AppException(RecruitmentErrorCode.APPLICATION_ALREADY_EXISTS);
        }

        Application application = applicationMapper.toEntity(dto);
        application.setJobOpening(jobOpening);
        application.setCandidate(candidate);
        application.setCurrentStage(ApplicationStage.APPLIED);
        application.setAppliedAt(LocalDateTime.now());

        Application saved = applicationRepository.save(application);

        transitionRepository.save(ApplicationStageTransition.builder()
                .application(saved)
                .fromStage(null)
                .toStage(ApplicationStage.APPLIED)
                .transitionedAt(LocalDateTime.now())
                .note("Ứng viên nộp hồ sơ ứng tuyển mới")
                .build());

        log.info("Đã tạo hồ sơ ứng tuyển id={} cho ứng viên {}", saved.getId(), candidate.getFullName());
        return mapToResponseWithDetails(saved, jobOpening, candidate);
    }

    @Transactional
    public ApplicationDto.Response updateStage(UUID id, ApplicationDto.UpdateStageRequest dto) {
        Application entity = applicationRepository.findById(id)
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.APPLICATION_NOT_FOUND));

        ApplicationStage previousStage = entity.getCurrentStage();
        entity.setCurrentStage(dto.getToStage());
        Application saved = applicationRepository.save(entity);

        transitionRepository.save(ApplicationStageTransition.builder()
                .application(saved)
                .fromStage(previousStage)
                .toStage(dto.getToStage())
                .transitionedAt(LocalDateTime.now())
                .note(dto.getReason())
                .build());

        return getApplicationById(saved.getId());
    }

    @Transactional
    public ApplicationDto.Response rejectApplication(UUID id, ApplicationDto.RejectRequest dto) {
        Application entity = applicationRepository.findById(id)
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.APPLICATION_NOT_FOUND));

        entity.setRejectionReason(dto.getReason());
        Application saved = applicationRepository.save(entity);

        transitionRepository.save(ApplicationStageTransition.builder()
                .application(saved)
                .fromStage(entity.getCurrentStage())
                .toStage(entity.getCurrentStage())
                .transitionedAt(LocalDateTime.now())
                .note("Từ chối ứng viên: " + (dto.getReason() != null ? dto.getReason() : ""))
                .build());

        return getApplicationById(saved.getId());
    }

    @Transactional
    public ApplicationDto.Response withdrawApplication(UUID id, String reason) {
        Application entity = applicationRepository.findById(id)
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.APPLICATION_NOT_FOUND));

        entity.setRejectionReason("Ứng viên rút hồ sơ: " + (reason != null ? reason : ""));
        Application saved = applicationRepository.save(entity);

        return getApplicationById(saved.getId());
    }

    @Transactional(readOnly = true)
    public ApplicationDto.Response getApplicationById(UUID id) {
        Application entity = applicationRepository.findById(id)
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.APPLICATION_NOT_FOUND));

        return mapToResponseWithDetails(entity, entity.getJobOpening(), entity.getCandidate());
    }

    @Transactional(readOnly = true)
    public PageData<ApplicationDto.Response> searchApplications(ApplicationDto.FilterRequest filter) {
        PageRequest pageRequest = PageRequest.of(
                filter.getPage(),
                filter.getSize(),
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Page<Application> page = applicationRepository.findAll(
                ApplicationSpecification.withFilters(
                        filter.getCompanyId(),
                        filter.getJobOpeningId(),
                        filter.getCandidateId(),
                        filter.getCurrentStage(),
                        filter.getIsRejected(),
                        filter.getIsWithdrawn(),
                        filter.getMinAiScore(),
                        filter.getKeyword()
                ),
                pageRequest
        );

        return PageData.of(page, a -> mapToResponseWithDetails(a, a.getJobOpening(), a.getCandidate()));
    }

    private ApplicationDto.Response mapToResponseWithDetails(Application app, JobOpening jo, Candidate c) {
        ApplicationDto.Response res = applicationMapper.toResponse(app);
        if (jo != null) {
            res.setJobOpeningTitle(jo.getTitle());
        }
        if (c != null) {
            res.setCandidateName(c.getFullName());
            res.setCandidateEmail(c.getEmail());
            res.setCandidatePhone(c.getPhone());
        }
        return res;
    }
}
