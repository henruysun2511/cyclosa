package com.cyclosa.recruitment.mapper;

import com.cyclosa.recruitment.dto.ScorecardDto;
import com.cyclosa.recruitment.entity.InterviewContentFlag;
import com.cyclosa.recruitment.entity.InterviewScorecard;
import com.cyclosa.recruitment.entity.ScorecardScore;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class ScorecardMapper {

    public ScorecardDto.Response toResponse(InterviewScorecard entity) {
        if (entity == null) {
            return null;
        }

        return ScorecardDto.Response.builder()
                .id(entity.getId())
                .interviewId(entity.getInterview() != null ? entity.getInterview().getId() : null)
                .interviewerId(entity.getInterviewerEmployeeId())
                .interviewerName(null)
                .overallScore(BigDecimal.ZERO)
                .overallRecommendation(entity.getOverallRecommendation())
                .strengths("")
                .weaknesses("")
                .generalNotes(entity.getGeneralNotes())
                .status(entity.getStatus())
                .submittedAt(entity.getSubmittedAt())
                .build();
    }

    public ScorecardDto.ScoreItemResponse toScoreItemResponse(ScorecardScore entity) {
        if (entity == null) {
            return null;
        }

        return ScorecardDto.ScoreItemResponse.builder()
                .id(entity.getId())
                .criterionId(entity.getCriterion() != null ? entity.getCriterion().getId() : null)
                .criterionName(entity.getCriterion() != null ? entity.getCriterion().getName() : null)
                .score(entity.getScore())
                .comments(entity.getComment())
                .build();
    }

    public ScorecardDto.ContentFlagResponse toContentFlagResponse(InterviewContentFlag entity) {
        if (entity == null) {
            return null;
        }

        return ScorecardDto.ContentFlagResponse.builder()
                .id(entity.getId())
                .flagType("BIAS_WARNING")
                .flaggedContent(entity.getFlaggedContent())
                .suggestion(entity.getReason())
                .severity("MEDIUM")
                .build();
    }
}
