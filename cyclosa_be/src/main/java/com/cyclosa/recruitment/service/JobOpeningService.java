package com.cyclosa.recruitment.service;

import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.response.PageData;
import com.cyclosa.recruitment.dto.JobOpeningDto;
import com.cyclosa.recruitment.entity.InterviewCriterion;
import com.cyclosa.recruitment.entity.InterviewQuestion;
import com.cyclosa.recruitment.entity.InterviewRound;
import com.cyclosa.recruitment.entity.JobOpening;
import com.cyclosa.recruitment.entity.RecruitmentRequest;
import com.cyclosa.recruitment.enums.InterviewRoundType;
import com.cyclosa.recruitment.enums.JobOpeningStatus;
import com.cyclosa.recruitment.enums.RecruitmentRequestStatus;
import com.cyclosa.recruitment.exception.RecruitmentErrorCode;
import com.cyclosa.recruitment.mapper.JobOpeningMapper;
import com.cyclosa.recruitment.repository.InterviewCriterionRepository;
import com.cyclosa.recruitment.repository.InterviewQuestionRepository;
import com.cyclosa.recruitment.repository.InterviewRoundRepository;
import com.cyclosa.recruitment.repository.JobOpeningRepository;
import com.cyclosa.recruitment.repository.RecruitmentRequestRepository;
import com.cyclosa.recruitment.repository.specification.JobOpeningSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class JobOpeningService {

    private final JobOpeningRepository jobOpeningRepository;
    private final InterviewRoundRepository roundRepository;
    private final InterviewCriterionRepository criterionRepository;
    private final InterviewQuestionRepository questionRepository;
    private final RecruitmentRequestRepository requestRepository;
    private final JobOpeningMapper jobOpeningMapper;

    @Transactional
    public JobOpeningDto.Response createJobOpening(JobOpeningDto.CreateRequest dto) {
        if (dto.getRecruitmentRequestId() != null) {
            RecruitmentRequest request = requestRepository.findById(dto.getRecruitmentRequestId())
                    .orElseThrow(() -> new AppException(RecruitmentErrorCode.RECRUITMENT_REQUEST_NOT_FOUND));
            if (request.getStatus() != RecruitmentRequestStatus.APPROVED) {
                throw new AppException(RecruitmentErrorCode.RECRUITMENT_REQUEST_NOT_EDITABLE);
            }
        }

        JobOpening entity = jobOpeningMapper.toEntity(dto);
        JobOpening saved = jobOpeningRepository.save(entity);

        if (dto.getInterviewRounds() != null && !dto.getInterviewRounds().isEmpty()) {
            for (JobOpeningDto.RoundConfigRequest roundDto : dto.getInterviewRounds()) {
                saveRoundWithDetails(saved, roundDto);
            }
        } else {
            createDefaultRounds(saved);
        }

        return getJobOpeningById(saved.getId());
    }

    private void createDefaultRounds(JobOpening jobOpening) {
        InterviewRound round1 = InterviewRound.builder()
                .jobOpening(jobOpening)
                .roundNo(1)
                .name("Phỏng vấn sơ loại HR")
                .roundType(InterviewRoundType.HR)
                .build();
        InterviewRound savedRound1 = roundRepository.save(round1);

        criterionRepository.save(InterviewCriterion.builder()
                .interviewRound(savedRound1)
                .name("Giao tiếp & Thái độ")
                .weight(BigDecimal.valueOf(40))
                .maxScore(100)
                .build());
        criterionRepository.save(InterviewCriterion.builder()
                .interviewRound(savedRound1)
                .name("Động lực làm việc")
                .weight(BigDecimal.valueOf(60))
                .maxScore(100)
                .build());

        InterviewRound round2 = InterviewRound.builder()
                .jobOpening(jobOpening)
                .roundNo(2)
                .name("Phỏng vấn kỹ thuật & Chuyên môn")
                .roundType(InterviewRoundType.TECHNICAL)
                .build();
        InterviewRound savedRound2 = roundRepository.save(round2);

        criterionRepository.save(InterviewCriterion.builder()
                .interviewRound(savedRound2)
                .name("Năng lực chuyên môn & Kỹ năng kỹ thuật")
                .weight(BigDecimal.valueOf(60))
                .maxScore(100)
                .build());
        criterionRepository.save(InterviewCriterion.builder()
                .interviewRound(savedRound2)
                .name("Khả năng giải quyết vấn đề")
                .weight(BigDecimal.valueOf(40))
                .maxScore(100)
                .build());
    }

    private void saveRoundWithDetails(JobOpening jobOpening, JobOpeningDto.RoundConfigRequest roundDto) {
        InterviewRound round = InterviewRound.builder()
                .jobOpening(jobOpening)
                .roundNo(roundDto.getRoundOrder())
                .name(roundDto.getName())
                .roundType(roundDto.getRoundType())
                .description(roundDto.getDescription())
                .build();
        InterviewRound savedRound = roundRepository.save(round);

        if (roundDto.getCriteria() != null) {
            for (JobOpeningDto.CriterionRequest c : roundDto.getCriteria()) {
                criterionRepository.save(InterviewCriterion.builder()
                        .interviewRound(savedRound)
                        .name(c.getName())
                        .description(c.getDescription())
                        .weight(c.getWeight() != null ? c.getWeight() : BigDecimal.valueOf(100))
                        .maxScore(c.getMaxScore() != null ? c.getMaxScore() : 100)
                        .build());
            }
        }

        if (roundDto.getQuestions() != null) {
            for (JobOpeningDto.QuestionRequest q : roundDto.getQuestions()) {
                questionRepository.save(InterviewQuestion.builder()
                        .interviewRound(savedRound)
                        .questionText(q.getQuestionText())
                        .expectedAnswerGuideline(q.getSampleAnswer())
                        .isAiGenerated(false)
                        .build());
            }
        }
    }

    @Transactional
    public JobOpeningDto.Response updateJobOpening(UUID id, JobOpeningDto.UpdateRequest dto) {
        JobOpening entity = jobOpeningRepository.findById(id)
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.JOB_OPENING_NOT_FOUND));

        if (entity.getStatus() == JobOpeningStatus.CLOSED) {
            throw new AppException(RecruitmentErrorCode.JOB_OPENING_CLOSED);
        }

        jobOpeningMapper.updateEntityFromDto(dto, entity);
        JobOpening saved = jobOpeningRepository.save(entity);
        return getJobOpeningById(saved.getId());
    }

    @Transactional
    public JobOpeningDto.Response publishJobOpening(UUID id) {
        JobOpening entity = jobOpeningRepository.findById(id)
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.JOB_OPENING_NOT_FOUND));

        if (entity.getStatus() == JobOpeningStatus.CLOSED) {
            throw new AppException(RecruitmentErrorCode.JOB_OPENING_CLOSED);
        }

        entity.setStatus(JobOpeningStatus.OPEN);
        JobOpening saved = jobOpeningRepository.save(entity);
        return getJobOpeningById(saved.getId());
    }

    @Transactional
    public JobOpeningDto.Response closeJobOpening(UUID id) {
        JobOpening entity = jobOpeningRepository.findById(id)
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.JOB_OPENING_NOT_FOUND));

        entity.setStatus(JobOpeningStatus.CLOSED);
        entity.setDeadlineDate(LocalDate.now());

        JobOpening saved = jobOpeningRepository.save(entity);
        return getJobOpeningById(saved.getId());
    }

    @Transactional(readOnly = true)
    public JobOpeningDto.Response getJobOpeningById(UUID id) {
        JobOpening entity = jobOpeningRepository.findById(id)
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.JOB_OPENING_NOT_FOUND));

        JobOpeningDto.Response response = jobOpeningMapper.toResponse(entity);

        List<InterviewRound> rounds = roundRepository.findByJobOpening_IdOrderByRoundNoAsc(id);
        List<JobOpeningDto.RoundResponse> roundResponses = new ArrayList<>();

        for (InterviewRound round : rounds) {
            JobOpeningDto.RoundResponse rDto = jobOpeningMapper.toRoundResponse(round);
            List<InterviewCriterion> criteria = criterionRepository.findByInterviewRound_Id(round.getId());
            rDto.setCriteria(criteria.stream().map(jobOpeningMapper::toCriterionResponse).toList());

            List<InterviewQuestion> questions = questionRepository.findByInterviewRound_Id(round.getId());
            rDto.setQuestions(questions.stream().map(jobOpeningMapper::toQuestionResponse).toList());

            roundResponses.add(rDto);
        }

        response.setInterviewRounds(roundResponses);
        return response;
    }

    @Transactional(readOnly = true)
    public PageData<JobOpeningDto.Response> searchJobOpenings(JobOpeningDto.FilterRequest filter) {
        PageRequest pageRequest = PageRequest.of(
                filter.getPage(),
                filter.getSize(),
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Page<JobOpening> page = jobOpeningRepository.findAll(
                JobOpeningSpecification.withFilters(
                        filter.getCompanyId(),
                        filter.getDepartmentId(),
                        filter.getStatus(),
                        filter.getEmploymentType(),
                        filter.getKeyword()
                ),
                pageRequest
        );

        return PageData.of(page, jobOpeningMapper::toResponse);
    }

    @Transactional
    public void deleteJobOpening(UUID id) {
        JobOpening entity = jobOpeningRepository.findById(id)
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.JOB_OPENING_NOT_FOUND));
        jobOpeningRepository.delete(entity);
    }
}
