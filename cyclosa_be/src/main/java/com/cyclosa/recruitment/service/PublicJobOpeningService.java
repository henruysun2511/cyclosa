package com.cyclosa.recruitment.service;

import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.response.PageData;
import com.cyclosa.media.dto.response.CloudinaryMediaResponse;
import com.cyclosa.media.service.CloudinaryService;
import com.cyclosa.recruitment.dto.ApplicationDto;
import com.cyclosa.recruitment.dto.PublicJobOpeningDto;
import com.cyclosa.recruitment.entity.*;
import com.cyclosa.recruitment.enums.ApplicationStage;
import com.cyclosa.recruitment.enums.JobOpeningStatus;
import com.cyclosa.recruitment.exception.RecruitmentErrorCode;
import com.cyclosa.recruitment.mapper.ApplicationMapper;
import com.cyclosa.recruitment.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import jakarta.persistence.criteria.Predicate;

@Slf4j
@Service
@RequiredArgsConstructor
public class PublicJobOpeningService {

    private final JobOpeningRepository jobOpeningRepository;
    private final CandidateRepository candidateRepository;
    private final ApplicationRepository applicationRepository;
    private final ApplicationStageTransitionRepository transitionRepository;
    private final ApplicationMapper applicationMapper;
    private final CloudinaryService cloudinaryService;
    private final AiScreeningService aiScreeningService;

    @Transactional(readOnly = true)
    public PageData<PublicJobOpeningDto.Response> getPublishedOpenings(String keyword, UUID departmentId, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Specification<JobOpening> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("status"), JobOpeningStatus.OPEN));

            if (departmentId != null) {
                predicates.add(cb.equal(root.get("departmentId"), departmentId));
            }

            if (keyword != null && !keyword.isBlank()) {
                String pattern = "%" + keyword.trim().toLowerCase() + "%";
                Predicate titlePred = cb.like(cb.lower(root.get("title")), pattern);
                Predicate locPred = cb.like(cb.lower(root.get("workLocation")), pattern);
                Predicate descPred = cb.like(cb.lower(root.get("description")), pattern);
                predicates.add(cb.or(titlePred, locPred, descPred));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<JobOpening> pagedResult = jobOpeningRepository.findAll(spec, pageRequest);
        return PageData.of(pagedResult, this::toPublicResponse);
    }

    @Transactional(readOnly = true)
    public PublicJobOpeningDto.Response getOpeningBySlug(String slug) {
        JobOpening opening = jobOpeningRepository.findByLandingSlug(slug)
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.JOB_OPENING_NOT_FOUND));

        if (opening.getStatus() != JobOpeningStatus.OPEN) {
            throw new AppException(RecruitmentErrorCode.JOB_OPENING_CLOSED);
        }

        return toPublicResponse(opening);
    }

    @Transactional
    public ApplicationDto.Response applyBySlug(String slug, PublicJobOpeningDto.ApplyRequest request, MultipartFile cvFile) {
        JobOpening opening = jobOpeningRepository.findByLandingSlug(slug)
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.JOB_OPENING_NOT_FOUND));

        if (opening.getStatus() != JobOpeningStatus.OPEN) {
            throw new AppException(RecruitmentErrorCode.JOB_OPENING_CLOSED);
        }

        String email = request.getEmail().trim().toLowerCase();
        Optional<Candidate> candidateOpt = candidateRepository.findByEmail(email);

        Candidate candidate;
        if (candidateOpt.isPresent()) {
            candidate = candidateOpt.get();
            if (applicationRepository.existsByJobOpening_IdAndCandidate_Id(opening.getId(), candidate.getId())) {
                throw new AppException(RecruitmentErrorCode.APPLICATION_ALREADY_EXISTS);
            }
            candidate.setFullName(request.getFullName().trim());
            candidate.setPhone(request.getPhone().trim());
            candidate.setAiScreeningConsent(Boolean.TRUE.equals(request.getAiScreeningConsent()));
        } else {
            candidate = Candidate.builder()
                    .fullName(request.getFullName().trim())
                    .email(email)
                    .phone(request.getPhone().trim())
                    .aiScreeningConsent(Boolean.TRUE.equals(request.getAiScreeningConsent()))
                    .build();
        }

        if (cvFile != null && !cvFile.isEmpty()) {
            CloudinaryMediaResponse uploadedDoc = cloudinaryService.uploadDocument(cvFile, "cyclosa/resumes");
            candidate.setResumeUrl(uploadedDoc.getSecureUrl());
        } else if (request.getResumeUrl() != null && !request.getResumeUrl().isBlank()) {
            candidate.setResumeUrl(request.getResumeUrl().trim());
        }

        candidate = candidateRepository.save(candidate);

        Application application = Application.builder()
                .jobOpening(opening)
                .candidate(candidate)
                .currentStage(ApplicationStage.APPLIED)
                .appliedAt(LocalDateTime.now())
                .build();

        Application savedApp = applicationRepository.save(application);

        transitionRepository.save(ApplicationStageTransition.builder()
                .application(savedApp)
                .fromStage(null)
                .toStage(ApplicationStage.APPLIED)
                .transitionedAt(LocalDateTime.now())
                .note("Ứng viên nộp trực tuyến qua Landing Page tuyển dụng")
                .build());

        // Bất đồng bộ / an toàn kích hoạt chấm điểm AI nếu ứng viên đồng ý
        if (Boolean.TRUE.equals(request.getAiScreeningConsent())) {
            try {
                aiScreeningService.screenApplication(savedApp.getId());
            } catch (Exception e) {
                log.warn("Không thể sàng lọc AI tức thì cho đơn ứng tuyển id={}: {}", savedApp.getId(), e.getMessage());
            }
        }

        log.info("Ứng viên {} nộp hồ sơ thành công vào vị trí slug={}", candidate.getFullName(), slug);
        ApplicationDto.Response response = applicationMapper.toResponse(savedApp);
        response.setJobOpeningTitle(opening.getTitle());
        response.setCandidateName(candidate.getFullName());
        response.setCandidateEmail(candidate.getEmail());
        response.setCandidatePhone(candidate.getPhone());
        return response;
    }

    private PublicJobOpeningDto.Response toPublicResponse(JobOpening opening) {
        return PublicJobOpeningDto.Response.builder()
                .id(opening.getId())
                .title(opening.getTitle())
                .companyId(opening.getCompanyId())
                .departmentId(opening.getDepartmentId())
                .departmentName(opening.getDepartmentId() != null ? "Phòng ban chuyên trách" : "Khối Công nghệ & Vận hành")
                .workLocation(opening.getWorkLocation() != null ? opening.getWorkLocation() : "Hà Nội")
                .employmentType("FULL_TIME")
                .workplaceType("HYBRID")
                .salaryBandMin(opening.getSalaryBandMin())
                .salaryBandMax(opening.getSalaryBandMax())
                .isSalaryNegotiable(opening.getIsSalaryNegotiable() != null ? opening.getIsSalaryNegotiable() : true)
                .deadlineDate(opening.getDeadlineDate())
                .description(opening.getDescription())
                .requirements(opening.getRequirements())
                .benefits(opening.getBenefits())
                .landingSlug(opening.getLandingSlug())
                .status(opening.getStatus())
                .publishedAt(opening.getCreatedAt())
                .targetQuantity(opening.getRequiredQuantity())
                .build();
    }
}

