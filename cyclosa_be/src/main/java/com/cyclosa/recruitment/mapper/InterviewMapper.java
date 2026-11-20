package com.cyclosa.recruitment.mapper;

import com.cyclosa.recruitment.dto.InterviewDto;
import com.cyclosa.recruitment.entity.Interview;
import com.cyclosa.recruitment.entity.InterviewPanelist;
import com.cyclosa.recruitment.enums.InterviewFormat;
import com.cyclosa.recruitment.enums.InterviewStatus;
import org.springframework.stereotype.Component;

@Component
public class InterviewMapper {

    public Interview toEntity(InterviewDto.ScheduleRequest request) {
        if (request == null) {
            return null;
        }

        return Interview.builder()
                .scheduledStart(request.getStartTime())
                .scheduledEnd(request.getEndTime())
                .format(request.getFormat() != null ? request.getFormat() : InterviewFormat.ONLINE)
                .locationOrLink(request.getMeetingLink() != null ? request.getMeetingLink() : (request.getLocation() != null ? request.getLocation() : ""))
                .status(InterviewStatus.SCHEDULED)
                .build();
    }

    public InterviewDto.Response toResponse(Interview entity) {
        if (entity == null) {
            return null;
        }

        return InterviewDto.Response.builder()
                .id(entity.getId())
                .companyId(null)
                .interviewCode(entity.getId() != null ? "INT-" + entity.getId().toString().substring(0, 8).toUpperCase() : null)
                .applicationId(entity.getApplication() != null ? entity.getApplication().getId() : null)
                .roundId(entity.getInterviewRound() != null ? entity.getInterviewRound().getId() : null)
                .title("Phỏng vấn " + (entity.getInterviewRound() != null ? entity.getInterviewRound().getName() : ""))
                .startTime(entity.getScheduledStart())
                .endTime(entity.getScheduledEnd())
                .format(entity.getFormat())
                .location(entity.getLocationOrLink())
                .meetingLink(entity.getLocationOrLink())
                .status(entity.getStatus())
                .cancellationReason(entity.getCancellationReason())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public InterviewDto.PanelistResponse toPanelistResponse(InterviewPanelist entity) {
        if (entity == null) {
            return null;
        }

        return InterviewDto.PanelistResponse.builder()
                .id(entity.getId())
                .interviewerId(entity.getEmployeeId())
                .isLead(entity.getIsLeadInterviewer())
                .hasSubmittedScorecard(false)
                .build();
    }
}
