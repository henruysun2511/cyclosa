package com.cyclosa.recruitment.mapper;

import com.cyclosa.recruitment.dto.CandidateDto;
import com.cyclosa.recruitment.entity.Candidate;
import com.cyclosa.recruitment.entity.CandidateEducation;
import com.cyclosa.recruitment.entity.CandidateSkill;
import com.cyclosa.recruitment.entity.CandidateWorkExperience;
import org.springframework.stereotype.Component;

@Component
public class CandidateMapper {

    public Candidate toEntity(CandidateDto.CreateRequest request) {
        if (request == null) {
            return null;
        }

        return Candidate.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone() != null ? request.getPhone() : "")
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .address(request.getAddress())
                .resumeUrl(request.getCvFileUrl())
                .aiScreeningConsent(true)
                .build();
    }

    public CandidateDto.Response toResponse(Candidate entity) {
        if (entity == null) {
            return null;
        }

        return CandidateDto.Response.builder()
                .id(entity.getId())
                .companyId(null)
                .candidateCode(entity.getId() != null ? "CAN-" + entity.getId().toString().substring(0, 8).toUpperCase() : null)
                .fullName(entity.getFullName())
                .email(entity.getEmail())
                .phone(entity.getPhone())
                .dateOfBirth(entity.getDateOfBirth())
                .gender(entity.getGender())
                .address(entity.getAddress())
                .cvFileUrl(entity.getResumeUrl())
                .originalCvFileName(null)
                .isBlacklisted(false)
                .blacklistReason(null)
                .notes(entity.getParsedProfile())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public void updateEntityFromDto(CandidateDto.UpdateRequest request, Candidate entity) {
        if (request == null || entity == null) {
            return;
        }

        if (request.getFullName() != null) entity.setFullName(request.getFullName());
        if (request.getEmail() != null) entity.setEmail(request.getEmail());
        if (request.getPhone() != null) entity.setPhone(request.getPhone());
        if (request.getDateOfBirth() != null) entity.setDateOfBirth(request.getDateOfBirth());
        if (request.getGender() != null) entity.setGender(request.getGender());
        if (request.getAddress() != null) entity.setAddress(request.getAddress());
        if (request.getCvFileUrl() != null) entity.setResumeUrl(request.getCvFileUrl());
    }

    public CandidateDto.ExperienceDto toExperienceDto(CandidateWorkExperience entity) {
        if (entity == null) return null;
        return CandidateDto.ExperienceDto.builder()
                .id(entity.getId())
                .companyName(entity.getCompanyName())
                .jobTitle(entity.getPosition())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .isCurrent(entity.getEndDate() == null)
                .description(entity.getDescription())
                .build();
    }

    public CandidateDto.EducationDto toEducationDto(CandidateEducation entity) {
        if (entity == null) return null;
        return CandidateDto.EducationDto.builder()
                .id(entity.getId())
                .institution(entity.getInstitutionName())
                .degree(entity.getDegree())
                .fieldOfStudy(entity.getMajor())
                .graduationYear(entity.getEndYear())
                .gpa(entity.getGpa())
                .build();
    }

    public CandidateDto.SkillDto toSkillDto(CandidateSkill entity) {
        if (entity == null) return null;
        return CandidateDto.SkillDto.builder()
                .id(entity.getId())
                .skillName(entity.getSkillName())
                .proficiencyLevel(entity.getProficiencyLevel())
                .yearsOfExperience(entity.getYearsExperience())
                .build();
    }
}
