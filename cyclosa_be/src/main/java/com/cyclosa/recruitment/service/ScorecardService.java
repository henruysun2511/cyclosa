package com.cyclosa.recruitment.service;

import com.cyclosa.common.exception.AppException;
import com.cyclosa.recruitment.client.RecruitmentAiClient;
import com.cyclosa.recruitment.client.dto.AiClientDto;
import com.cyclosa.recruitment.dto.ScorecardDto;
import com.cyclosa.recruitment.entity.Interview;
import com.cyclosa.recruitment.entity.InterviewContentFlag;
import com.cyclosa.recruitment.entity.InterviewCriterion;
import com.cyclosa.recruitment.entity.InterviewPanelist;
import com.cyclosa.recruitment.entity.InterviewScorecard;
import com.cyclosa.recruitment.entity.ScorecardScore;
import com.cyclosa.recruitment.enums.InterviewStatus;
import com.cyclosa.recruitment.enums.ScorecardStatus;
import com.cyclosa.recruitment.exception.RecruitmentErrorCode;
import com.cyclosa.recruitment.mapper.ScorecardMapper;
import com.cyclosa.recruitment.repository.InterviewContentFlagRepository;
import com.cyclosa.recruitment.repository.InterviewCriterionRepository;
import com.cyclosa.recruitment.repository.InterviewPanelistRepository;
import com.cyclosa.recruitment.repository.InterviewRepository;
import com.cyclosa.recruitment.repository.InterviewScorecardRepository;
import com.cyclosa.recruitment.repository.ScorecardScoreRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ScorecardService {

    private final InterviewScorecardRepository scorecardRepository;
    private final ScorecardScoreRepository scoreRepository;
    private final InterviewContentFlagRepository flagRepository;
    private final InterviewRepository interviewRepository;
    private final InterviewPanelistRepository panelistRepository;
    private final InterviewCriterionRepository criterionRepository;
    private final ScorecardMapper scorecardMapper;
    private final RecruitmentAiClient aiClient;

    @Transactional
    public ScorecardDto.Response submitScorecard(UUID interviewerId, ScorecardDto.SubmitScorecardRequest dto) {
        Interview interview = interviewRepository.findById(dto.getInterviewId())
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.INTERVIEW_NOT_FOUND));

        panelistRepository.findByInterview_IdAndEmployeeId(dto.getInterviewId(), interviewerId)
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.INTERVIEWER_NOT_ASSIGNED));

        if (scorecardRepository.findByInterview_IdAndInterviewerEmployeeId(dto.getInterviewId(), interviewerId).isPresent()) {
            throw new AppException(RecruitmentErrorCode.SCORECARD_ALREADY_SUBMITTED);
        }

        InterviewScorecard scorecard = InterviewScorecard.builder()
                .interview(interview)
                .interviewerEmployeeId(interviewerId)
                .overallRecommendation(dto.getOverallRecommendation())
                .generalNotes(dto.getGeneralNotes())
                .status(ScorecardStatus.SUBMITTED)
                .submittedAt(LocalDateTime.now())
                .build();

        InterviewScorecard savedScorecard = scorecardRepository.save(scorecard);

        for (ScorecardDto.ScoreItemRequest scoreItem : dto.getScores()) {
            InterviewCriterion criterion = criterionRepository.findById(scoreItem.getCriterionId())
                    .orElseThrow(() -> new AppException(RecruitmentErrorCode.CRITERION_NOT_FOUND));

            scoreRepository.save(ScorecardScore.builder()
                    .scorecard(savedScorecard)
                    .criterion(criterion)
                    .score(scoreItem.getScore())
                    .comment(scoreItem.getComments())
                    .build());
        }

        scanAndSaveAiFlags(interview, dto);

        long totalPanelists = panelistRepository.findByInterview_Id(dto.getInterviewId()).size();
        long submittedCount = scorecardRepository.countByInterview_IdAndStatus(dto.getInterviewId(), ScorecardStatus.SUBMITTED);

        if (submittedCount >= totalPanelists) {
            interview.setStatus(InterviewStatus.COMPLETED);
            interviewRepository.save(interview);
        }

        return getScorecardById(savedScorecard.getId());
    }

    private void scanAndSaveAiFlags(Interview interview, ScorecardDto.SubmitScorecardRequest dto) {
        StringBuilder commentsToScan = new StringBuilder();
        if (dto.getStrengths() != null) commentsToScan.append(dto.getStrengths()).append("\n");
        if (dto.getWeaknesses() != null) commentsToScan.append(dto.getWeaknesses()).append("\n");
        if (dto.getGeneralNotes() != null) commentsToScan.append(dto.getGeneralNotes()).append("\n");

        for (ScorecardDto.ScoreItemRequest s : dto.getScores()) {
            if (s.getComments() != null) commentsToScan.append(s.getComments()).append("\n");
        }

        if (!commentsToScan.isEmpty()) {
            Optional<AiClientDto.ContentScanResponse> scanOpt = aiClient.scanScorecard(
                    AiClientDto.ScorecardScanRequest.builder()
                            .comments(commentsToScan.toString())
                            .build()
            );

            if (scanOpt.isPresent() && Boolean.FALSE.equals(scanOpt.get().getIsClean())) {
                for (AiClientDto.FlaggedItem item : scanOpt.get().getFlaggedItems()) {
                    flagRepository.save(InterviewContentFlag.builder()
                            .interview(interview)
                            .flaggedContent(item.getForbiddenPhrase())
                            .reason(item.getSuggestion() != null ? item.getSuggestion() : "Nội dung có thể gây thiên vị")
                            .reviewStatus("PENDING")
                            .build());
                }
            }
        }
    }

    @Transactional(readOnly = true)
    public List<ScorecardDto.Response> getScorecardsByInterview(UUID interviewId, UUID currentUserId, boolean isHrAdmin) {
        List<InterviewScorecard> scorecards = scorecardRepository.findByInterview_Id(interviewId);

        boolean hasCurrentUserSubmitted = scorecards.stream()
                .anyMatch(s -> s.getInterviewerEmployeeId().equals(currentUserId) && s.getStatus() == ScorecardStatus.SUBMITTED);

        if (!isHrAdmin && !hasCurrentUserSubmitted) {
            throw new AppException(RecruitmentErrorCode.BLIND_GRADING_ACCESS_DENIED);
        }

        return scorecards.stream().map(s -> getScorecardById(s.getId())).toList();
    }

    @Transactional(readOnly = true)
    public ScorecardDto.Response getScorecardById(UUID id) {
        InterviewScorecard scorecard = scorecardRepository.findById(id)
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.SCORECARD_NOT_FOUND));

        ScorecardDto.Response res = scorecardMapper.toResponse(scorecard);
        res.setInterviewerName("Interviewer " + scorecard.getInterviewerEmployeeId().toString().substring(0, 8));

        List<ScorecardScore> scores = scoreRepository.findByScorecard_Id(id);
        res.setScores(scores.stream().map(s -> {
            ScorecardDto.ScoreItemResponse item = scorecardMapper.toScoreItemResponse(s);
            if (s.getCriterion() != null) {
                item.setCriterionName(s.getCriterion().getName());
                item.setMaxScore(java.math.BigDecimal.valueOf(s.getCriterion().getMaxScore()));
                item.setWeight(s.getCriterion().getWeight());
            }
            return item;
        }).toList());

        if (scorecard.getInterview() != null) {
            List<InterviewContentFlag> flags = flagRepository.findByInterview_Id(scorecard.getInterview().getId());
            res.setContentFlags(flags.stream().map(scorecardMapper::toContentFlagResponse).toList());
        }

        return res;
    }
}
