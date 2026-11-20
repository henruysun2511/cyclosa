package com.cyclosa.recruitment.service;

import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.response.PageData;
import com.cyclosa.notification.enums.NotificationType;
import com.cyclosa.notification.event.SendNotificationEvent;
import com.cyclosa.recruitment.client.RecruitmentAiClient;
import com.cyclosa.recruitment.client.dto.AiClientDto;
import com.cyclosa.recruitment.dto.InterviewDto;
import com.cyclosa.recruitment.entity.Application;
import com.cyclosa.recruitment.entity.Candidate;
import com.cyclosa.recruitment.entity.Interview;
import com.cyclosa.recruitment.entity.InterviewPanelist;
import com.cyclosa.recruitment.entity.InterviewRound;
import com.cyclosa.recruitment.enums.InterviewStatus;
import com.cyclosa.recruitment.exception.RecruitmentErrorCode;
import com.cyclosa.recruitment.mapper.InterviewMapper;
import com.cyclosa.recruitment.repository.ApplicationRepository;
import com.cyclosa.recruitment.repository.InterviewPanelistRepository;
import com.cyclosa.recruitment.repository.InterviewRepository;
import com.cyclosa.recruitment.repository.InterviewRoundRepository;
import com.cyclosa.recruitment.repository.specification.InterviewSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final InterviewPanelistRepository panelistRepository;
    private final InterviewRoundRepository roundRepository;
    private final ApplicationRepository applicationRepository;
    private final InterviewMapper interviewMapper;
    private final RecruitmentAiClient aiClient;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public InterviewDto.Response scheduleInterview(InterviewDto.ScheduleRequest dto) {
        Application app = applicationRepository.findById(dto.getApplicationId())
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.APPLICATION_NOT_FOUND));

        InterviewRound round = roundRepository.findById(dto.getRoundId())
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.INTERVIEW_ROUND_NOT_FOUND));

        Interview entity = interviewMapper.toEntity(dto);
        entity.setApplication(app);
        entity.setInterviewRound(round);
        entity.setStatus(InterviewStatus.SCHEDULED);

        Interview saved = interviewRepository.save(entity);

        List<UUID> interviewers = dto.getInterviewerIds();
        for (int i = 0; i < interviewers.size(); i++) {
            UUID interviewerId = interviewers.get(i);
            panelistRepository.save(InterviewPanelist.builder()
                    .interview(saved)
                    .employeeId(interviewerId)
                    .isLeadInterviewer(i == 0)
                    .build());
        }

        eventPublisher.publishEvent(SendNotificationEvent.builder()
                .targetUserIds(interviewers)
                .notificationType(NotificationType.SYSTEM)
                .title("Lịch phỏng vấn mới: " + round.getName())
                .content(String.format("Bạn có lịch phỏng vấn %s lúc %s.", round.getName(), saved.getScheduledStart()))
                .actionUrl("/recruitment/interviews/" + saved.getId())
                .build());

        return getInterviewById(saved.getId());
    }

    @Transactional
    public InterviewDto.Response rescheduleInterview(UUID id, InterviewDto.RescheduleRequest dto) {
        Interview entity = interviewRepository.findById(id)
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.INTERVIEW_NOT_FOUND));

        if (entity.getStatus() == InterviewStatus.COMPLETED || entity.getStatus() == InterviewStatus.CANCELLED) {
            throw new AppException(RecruitmentErrorCode.INVALID_INTERVIEW_STATUS);
        }

        entity.setScheduledStart(dto.getStartTime());
        entity.setScheduledEnd(dto.getEndTime());
        if (dto.getLocation() != null) entity.setLocationOrLink(dto.getLocation());
        if (dto.getMeetingLink() != null) entity.setLocationOrLink(dto.getMeetingLink());
        entity.setStatus(InterviewStatus.RESCHEDULED);

        Interview saved = interviewRepository.save(entity);

        List<InterviewPanelist> panelists = panelistRepository.findByInterview_Id(saved.getId());
        List<UUID> userIds = panelists.stream().map(InterviewPanelist::getEmployeeId).toList();

        eventPublisher.publishEvent(SendNotificationEvent.builder()
                .targetUserIds(userIds)
                .notificationType(NotificationType.SYSTEM)
                .title("Lịch phỏng vấn đã được dời lại")
                .content(String.format("Lịch phỏng vấn đã được dời sang %s. Lý do: %s",
                        saved.getScheduledStart(), dto.getReason() != null ? dto.getReason() : ""))
                .actionUrl("/recruitment/interviews/" + saved.getId())
                .build());

        return getInterviewById(saved.getId());
    }

    @Transactional
    public InterviewDto.Response cancelInterview(UUID id, InterviewDto.CancelRequest dto) {
        Interview entity = interviewRepository.findById(id)
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.INTERVIEW_NOT_FOUND));

        if (entity.getStatus() == InterviewStatus.COMPLETED) {
            throw new AppException(RecruitmentErrorCode.INVALID_INTERVIEW_STATUS);
        }

        entity.setStatus(InterviewStatus.CANCELLED);
        entity.setCancellationReason(dto.getReason());
        Interview saved = interviewRepository.save(entity);
        return getInterviewById(saved.getId());
    }

    @Transactional
    public InterviewDto.Response completeInterview(UUID id) {
        Interview entity = interviewRepository.findById(id)
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.INTERVIEW_NOT_FOUND));

        entity.setStatus(InterviewStatus.COMPLETED);
        Interview saved = interviewRepository.save(entity);
        return getInterviewById(saved.getId());
    }

    @Transactional(readOnly = true)
    public InterviewDto.Response getInterviewById(UUID id) {
        Interview entity = interviewRepository.findById(id)
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.INTERVIEW_NOT_FOUND));

        Application app = entity.getApplication();
        InterviewRound round = entity.getInterviewRound();
        Candidate candidate = app != null ? app.getCandidate() : null;

        InterviewDto.Response res = interviewMapper.toResponse(entity);
        if (app != null) {
            res.setApplicationCode(app.getId() != null ? "APP-" + app.getId().toString().substring(0, 8).toUpperCase() : null);
        }
        if (candidate != null) {
            res.setCandidateName(candidate.getFullName());
        }
        if (round != null) {
            res.setRoundName(round.getName());
        }

        List<InterviewPanelist> panelists = panelistRepository.findByInterview_Id(entity.getId());
        res.setPanelists(panelists.stream().map(p -> {
            InterviewDto.PanelistResponse pDto = interviewMapper.toPanelistResponse(p);
            pDto.setInterviewerName("Interviewer " + p.getEmployeeId().toString().substring(0, 8));
            return pDto;
        }).toList());

        return res;
    }

    @Transactional(readOnly = true)
    public PageData<InterviewDto.Response> searchInterviews(InterviewDto.FilterRequest filter) {
        PageRequest pageRequest = PageRequest.of(
                filter.getPage(),
                filter.getSize(),
                Sort.by(Sort.Direction.DESC, "scheduledStart")
        );

        Page<Interview> page = interviewRepository.findAll(
                InterviewSpecification.withFilters(
                        filter.getCompanyId(),
                        filter.getRoundId(),
                        filter.getApplicationId(),
                        filter.getStatus(),
                        filter.getFormat(),
                        filter.getFromDate(),
                        filter.getToDate(),
                        filter.getKeyword()
                ),
                pageRequest
        );

        return PageData.of(page, i -> getInterviewById(i.getId()));
    }

    public List<AiClientDto.QuestionResponse> generateQuestionsForRound(
            UUID roundId,
            String targetRole,
            String seniorityLevel,
            List<String> focusAreas,
            int count
    ) {
        AiClientDto.QuestionRequest request = AiClientDto.QuestionRequest.builder()
                .jobTitle(targetRole)
                .seniorityLevel(seniorityLevel != null ? seniorityLevel : "Mid-Level")
                .focusAreas(focusAreas != null ? focusAreas : List.of("Technical", "Problem Solving", "Teamwork"))
                .numQuestions(count > 0 ? count : 5)
                .build();

        return aiClient.generateQuestions(request);
    }
}
