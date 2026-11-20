package com.cyclosa.recruitment.service;

import com.cyclosa.common.exception.AppException;
import com.cyclosa.recruitment.client.RecruitmentAiClient;
import com.cyclosa.recruitment.client.dto.AiClientDto;
import com.cyclosa.recruitment.entity.AiScreeningLog;
import com.cyclosa.recruitment.entity.Application;
import com.cyclosa.recruitment.entity.Candidate;
import com.cyclosa.recruitment.entity.CandidateSkill;
import com.cyclosa.recruitment.entity.CandidateWorkExperience;
import com.cyclosa.recruitment.entity.JobOpening;
import com.cyclosa.recruitment.exception.RecruitmentErrorCode;
import com.cyclosa.recruitment.repository.AiScreeningLogRepository;
import com.cyclosa.recruitment.repository.ApplicationRepository;
import com.cyclosa.recruitment.repository.CandidateSkillRepository;
import com.cyclosa.recruitment.repository.CandidateWorkExperienceRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiScreeningService {

    private final ApplicationRepository applicationRepository;
    private final CandidateWorkExperienceRepository experienceRepository;
    private final CandidateSkillRepository skillRepository;
    private final AiScreeningLogRepository screeningLogRepository;
    private final RecruitmentAiClient aiClient;
    private final ObjectMapper objectMapper;

    @Transactional
    public AiClientDto.CvScreenResponse screenApplication(UUID applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.APPLICATION_NOT_FOUND));

        JobOpening jobOpening = application.getJobOpening();
        Candidate candidate = application.getCandidate();

        String cvText = buildCandidateCvSummary(candidate);

        AiClientDto.CvScreenRequest request = AiClientDto.CvScreenRequest.builder()
                .jobTitle(jobOpening.getTitle())
                .jobDescription(jobOpening.getDescription() != null ? jobOpening.getDescription() : "")
                .jobRequirements(jobOpening.getRequirements() != null ? jobOpening.getRequirements() : "")
                .requirements(jobOpening.getRequirements() != null ? jobOpening.getRequirements() : "")
                .cvText(cvText)
                .cvUrl(candidate.getResumeUrl())
                .aiScreeningConsent(true)
                .build();

        Optional<AiClientDto.CvScreenResponse> resultOpt = aiClient.screenCv(request);
        if (resultOpt.isEmpty()) {
            throw new AppException(RecruitmentErrorCode.AI_SERVICE_COMMUNICATION_ERROR);
        }

        AiClientDto.CvScreenResponse result = resultOpt.get();

        application.setAiMatchScore(BigDecimal.valueOf(result.getMatchingScore()));
        application.setAiMatchReasoning(result.getSummary());
        application.setAiScreenedAt(LocalDateTime.now());
        applicationRepository.save(application);

        try {
            screeningLogRepository.save(AiScreeningLog.builder()
                    .applicationId(application.getId())
                    .redactedInput(cvText)
                    .aiOutput(objectMapper.writeValueAsString(result))
                    .modelName("gemini-1.5-pro")
                    .build());
        } catch (Exception e) {
            log.error("Lỗi khi tuần tự hóa JSON kết quả AI screening: {}", e.getMessage());
        }

        return result;
    }

    private String buildCandidateCvSummary(Candidate candidate) {
        StringBuilder sb = new StringBuilder();
        sb.append("Ứng viên: ").append(candidate.getFullName()).append("\n");

        List<CandidateSkill> skills = skillRepository.findByCandidate_Id(candidate.getId());
        if (!skills.isEmpty()) {
            sb.append("Kỹ năng: ");
            skills.forEach(s -> sb.append(s.getSkillName()).append(", "));
            sb.append("\n");
        }

        List<CandidateWorkExperience> experiences = experienceRepository.findByCandidate_IdOrderByStartDateDesc(candidate.getId());
        if (!experiences.isEmpty()) {
            sb.append("Kinh nghiệm làm việc:\n");
            for (CandidateWorkExperience exp : experiences) {
                sb.append("- ").append(exp.getPosition()).append(" tại ").append(exp.getCompanyName());
                if (exp.getDescription() != null) {
                    sb.append(": ").append(exp.getDescription());
                }
                sb.append("\n");
            }
        }

        return sb.toString();
    }
}
