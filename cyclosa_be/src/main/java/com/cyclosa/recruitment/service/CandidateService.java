package com.cyclosa.recruitment.service;

import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.response.PageData;
import com.cyclosa.recruitment.client.RecruitmentAiClient;
import com.cyclosa.recruitment.client.dto.AiClientDto;
import com.cyclosa.recruitment.dto.CandidateDto;
import com.cyclosa.recruitment.entity.Candidate;
import com.cyclosa.recruitment.entity.CandidateEducation;
import com.cyclosa.recruitment.entity.CandidateSkill;
import com.cyclosa.recruitment.entity.CandidateWorkExperience;
import com.cyclosa.recruitment.entity.TalentPoolEntry;
import com.cyclosa.recruitment.exception.RecruitmentErrorCode;
import com.cyclosa.recruitment.mapper.CandidateMapper;
import com.cyclosa.recruitment.repository.CandidateEducationRepository;
import com.cyclosa.recruitment.repository.CandidateRepository;
import com.cyclosa.recruitment.repository.CandidateSkillRepository;
import com.cyclosa.recruitment.repository.CandidateWorkExperienceRepository;
import com.cyclosa.recruitment.repository.TalentPoolEntryRepository;
import com.cyclosa.recruitment.repository.specification.CandidateSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CandidateService {

    private final CandidateRepository candidateRepository;
    private final CandidateWorkExperienceRepository experienceRepository;
    private final CandidateEducationRepository educationRepository;
    private final CandidateSkillRepository skillRepository;
    private final TalentPoolEntryRepository talentPoolRepository;
    private final CandidateMapper candidateMapper;
    private final RecruitmentAiClient aiClient;

    @Transactional
    public CandidateDto.Response createCandidate(CandidateDto.CreateRequest dto) {
        if (dto.getEmail() != null && !dto.getEmail().trim().isEmpty() && candidateRepository.existsByEmail(dto.getEmail().trim())) {
            throw new AppException(RecruitmentErrorCode.CANDIDATE_EMAIL_DUPLICATED);
        }

        Candidate candidate = candidateMapper.toEntity(dto);
        Candidate saved = candidateRepository.save(candidate);

        saveCandidateSubEntities(saved, dto.getWorkExperiences(), dto.getEducations(), dto.getSkills());

        if (!talentPoolRepository.existsByCandidate_Id(saved.getId())) {
            talentPoolRepository.save(TalentPoolEntry.builder()
                    .candidate(saved)
                    .tag("DIRECT_INPUT")
                    .addedByEmployeeId(dto.getCompanyId())
                    .addedAt(LocalDateTime.now())
                    .build());
        }

        return getCandidateById(saved.getId());
    }

    private void saveCandidateSubEntities(
            Candidate candidate,
            List<CandidateDto.ExperienceDto> experiences,
            List<CandidateDto.EducationDto> educations,
            List<CandidateDto.SkillDto> skills
    ) {
        if (experiences != null) {
            for (CandidateDto.ExperienceDto exp : experiences) {
                experienceRepository.save(CandidateWorkExperience.builder()
                        .candidate(candidate)
                        .companyName(exp.getCompanyName())
                        .position(exp.getJobTitle())
                        .startDate(exp.getStartDate())
                        .endDate(exp.getEndDate())
                        .description(exp.getDescription())
                        .build());
            }
        }

        if (educations != null) {
            for (CandidateDto.EducationDto edu : educations) {
                educationRepository.save(CandidateEducation.builder()
                        .candidate(candidate)
                        .institutionName(edu.getInstitution())
                        .degree(edu.getDegree() != null ? edu.getDegree() : "Cử nhân")
                        .major(edu.getFieldOfStudy() != null ? edu.getFieldOfStudy() : "")
                        .endYear(edu.getGraduationYear())
                        .gpa(edu.getGpa())
                        .build());
            }
        }

        if (skills != null) {
            for (CandidateDto.SkillDto skill : skills) {
                skillRepository.save(CandidateSkill.builder()
                        .candidate(candidate)
                        .skillName(skill.getSkillName())
                        .proficiencyLevel(skill.getProficiencyLevel())
                        .yearsExperience(skill.getYearsOfExperience())
                        .build());
            }
        }
    }

    @Transactional
    public CandidateDto.Response updateCandidate(UUID id, CandidateDto.UpdateRequest dto) {
        Candidate entity = candidateRepository.findById(id)
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.CANDIDATE_NOT_FOUND));

        candidateMapper.updateEntityFromDto(dto, entity);
        Candidate saved = candidateRepository.save(entity);

        if (dto.getWorkExperiences() != null) {
            experienceRepository.deleteByCandidate_Id(id);
        }
        if (dto.getEducations() != null) {
            educationRepository.deleteByCandidate_Id(id);
        }
        if (dto.getSkills() != null) {
            skillRepository.deleteByCandidate_Id(id);
        }

        saveCandidateSubEntities(saved, dto.getWorkExperiences(), dto.getEducations(), dto.getSkills());

        return getCandidateById(saved.getId());
    }

    @Transactional(readOnly = true)
    public CandidateDto.Response getCandidateById(UUID id) {
        Candidate entity = candidateRepository.findById(id)
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.CANDIDATE_NOT_FOUND));

        CandidateDto.Response response = candidateMapper.toResponse(entity);

        List<CandidateWorkExperience> experiences = experienceRepository.findByCandidate_IdOrderByStartDateDesc(id);
        response.setWorkExperiences(experiences.stream().map(candidateMapper::toExperienceDto).toList());

        List<CandidateEducation> educations = educationRepository.findByCandidate_Id(id);
        response.setEducations(educations.stream().map(candidateMapper::toEducationDto).toList());

        List<CandidateSkill> skills = skillRepository.findByCandidate_Id(id);
        response.setSkills(skills.stream().map(candidateMapper::toSkillDto).toList());

        return response;
    }

    @Transactional(readOnly = true)
    public PageData<CandidateDto.Response> searchCandidates(CandidateDto.FilterRequest filter) {
        PageRequest pageRequest = PageRequest.of(
                filter.getPage(),
                filter.getSize(),
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Page<Candidate> page = candidateRepository.findAll(
                CandidateSpecification.withFilters(
                        filter.getCompanyId(),
                        filter.getIsBlacklisted(),
                        filter.getKeyword()
                ),
                pageRequest
        );

        return PageData.of(page, candidateMapper::toResponse);
    }

    @Transactional
    public CandidateDto.Response blacklistCandidate(UUID id, String reason) {
        Candidate entity = candidateRepository.findById(id)
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.CANDIDATE_NOT_FOUND));
        return getCandidateById(entity.getId());
    }

    @Transactional
    public CandidateDto.Response unblacklistCandidate(UUID id) {
        Candidate entity = candidateRepository.findById(id)
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.CANDIDATE_NOT_FOUND));
        return getCandidateById(entity.getId());
    }

    public CandidateDto.CreateRequest parseCvWithAi(MultipartFile file, UUID companyId) {
        Optional<AiClientDto.CandidateParsedProfile> parsedOpt = aiClient.parseCv(file);

        if (parsedOpt.isEmpty()) {
            throw new AppException(RecruitmentErrorCode.AI_SERVICE_COMMUNICATION_ERROR);
        }

        AiClientDto.CandidateParsedProfile profile = parsedOpt.get();

        List<CandidateDto.ExperienceDto> experiences = new ArrayList<>();
        if (profile.getWorkExperiences() != null) {
            for (AiClientDto.WorkExperienceItem exp : profile.getWorkExperiences()) {
                experiences.add(CandidateDto.ExperienceDto.builder()
                        .companyName(exp.getCompanyName())
                        .jobTitle(exp.getJobTitle())
                        .isCurrent(exp.getIsCurrent())
                        .description(exp.getDescription())
                        .build());
            }
        }

        List<CandidateDto.EducationDto> educations = new ArrayList<>();
        if (profile.getEducations() != null) {
            for (AiClientDto.EducationItem edu : profile.getEducations()) {
                educations.add(CandidateDto.EducationDto.builder()
                        .institution(edu.getInstitution())
                        .degree(edu.getDegree())
                        .fieldOfStudy(edu.getFieldOfStudy())
                        .graduationYear(edu.getGraduationYear())
                        .gpa(edu.getGpa())
                        .build());
            }
        }

        List<CandidateDto.SkillDto> skills = new ArrayList<>();
        if (profile.getSkills() != null) {
            for (String skill : profile.getSkills()) {
                skills.add(CandidateDto.SkillDto.builder()
                        .skillName(skill)
                        .proficiencyLevel("INTERMEDIATE")
                        .build());
            }
        }

        return CandidateDto.CreateRequest.builder()
                .companyId(companyId)
                .fullName(profile.getFullName())
                .email(profile.getEmail())
                .phone(profile.getPhone())
                .address(profile.getAddress())
                .linkedinUrl(profile.getLinkedinUrl())
                .portfolioUrl(profile.getPortfolioUrl())
                .workExperiences(experiences)
                .educations(educations)
                .skills(skills)
                .build();
    }
}
