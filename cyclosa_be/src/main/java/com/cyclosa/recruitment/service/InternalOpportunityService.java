package com.cyclosa.recruitment.service;

import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.response.PageData;
import com.cyclosa.recruitment.dto.InternalOpportunityDto;
import com.cyclosa.recruitment.entity.InternalOpportunity;
import com.cyclosa.recruitment.entity.InternalOpportunityApplication;
import com.cyclosa.recruitment.enums.InternalOpportunityStatus;
import com.cyclosa.recruitment.exception.RecruitmentErrorCode;
import com.cyclosa.recruitment.mapper.InternalOpportunityMapper;
import com.cyclosa.recruitment.repository.InternalOpportunityApplicationRepository;
import com.cyclosa.recruitment.repository.InternalOpportunityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
public class InternalOpportunityService {

    private final InternalOpportunityRepository opportunityRepository;
    private final InternalOpportunityApplicationRepository applicationRepository;
    private final InternalOpportunityMapper opportunityMapper;

    @Transactional
    public InternalOpportunityDto.Response createOpportunity(InternalOpportunityDto.CreateRequest dto) {
        InternalOpportunity entity = opportunityMapper.toEntity(dto);
        entity.setStatus(InternalOpportunityStatus.OPEN);

        InternalOpportunity saved = opportunityRepository.save(entity);
        return opportunityMapper.toResponse(saved);
    }

    @Transactional
    public InternalOpportunityDto.ApplicationResponse applyInternal(UUID opportunityId, InternalOpportunityDto.ApplyRequest dto) {
        InternalOpportunity opportunity = opportunityRepository.findById(opportunityId)
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.INTERNAL_OPPORTUNITY_NOT_FOUND));

        if (opportunity.getStatus() != InternalOpportunityStatus.OPEN) {
            throw new AppException(RecruitmentErrorCode.JOB_OPENING_CLOSED);
        }

        if (applicationRepository.existsByOpportunity_IdAndEmployeeId(opportunityId, dto.getEmployeeId())) {
            throw new AppException(RecruitmentErrorCode.APPLICATION_ALREADY_EXISTS);
        }

        InternalOpportunityApplication application = InternalOpportunityApplication.builder()
                .opportunity(opportunity)
                .employeeId(dto.getEmployeeId())
                .motivation(dto.getMotivationLetter())
                .status("SUBMITTED")
                .build();

        InternalOpportunityApplication saved = applicationRepository.save(application);
        InternalOpportunityDto.ApplicationResponse res = opportunityMapper.toApplicationResponse(saved);
        res.setEmployeeName("Employee " + dto.getEmployeeId().toString().substring(0, 8));
        return res;
    }

    @Transactional(readOnly = true)
    public InternalOpportunityDto.Response getOpportunityById(UUID id) {
        InternalOpportunity entity = opportunityRepository.findById(id)
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.INTERNAL_OPPORTUNITY_NOT_FOUND));
        return opportunityMapper.toResponse(entity);
    }

    @Transactional(readOnly = true)
    public PageData<InternalOpportunityDto.Response> searchOpportunities(InternalOpportunityDto.FilterRequest filter) {
        PageRequest pageRequest = PageRequest.of(
                filter.getPage(),
                filter.getSize(),
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Page<InternalOpportunity> page = opportunityRepository.findAll(pageRequest);
        return PageData.of(page, opportunityMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public List<InternalOpportunityDto.ApplicationResponse> listApplicationsByOpportunity(UUID opportunityId) {
        return applicationRepository.findByOpportunity_Id(opportunityId).stream()
                .map(opportunityMapper::toApplicationResponse)
                .toList();
    }
}
