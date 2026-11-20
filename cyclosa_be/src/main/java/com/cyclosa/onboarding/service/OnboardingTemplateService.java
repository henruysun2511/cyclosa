package com.cyclosa.onboarding.service;

import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.response.PageData;
import com.cyclosa.onboarding.dto.OnboardingTemplateDto;
import com.cyclosa.onboarding.entity.OnboardingChecklistTemplate;
import com.cyclosa.onboarding.entity.OnboardingTemplateItem;
import com.cyclosa.onboarding.exception.OnboardingErrorCode;
import com.cyclosa.onboarding.mapper.OnboardingMapper;
import com.cyclosa.onboarding.repository.OnboardingChecklistTemplateRepository;
import com.cyclosa.onboarding.repository.specification.OnboardingTemplateSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class OnboardingTemplateService {

    private final OnboardingChecklistTemplateRepository templateRepository;
    private final OnboardingMapper mapper;

    @Transactional(readOnly = true)
    public PageData<OnboardingTemplateDto.Response> searchTemplates(OnboardingTemplateDto.FilterRequest filter) {
        PageRequest pageRequest = PageRequest.of(
                filter.getPage(),
                filter.getSize(),
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Page<OnboardingChecklistTemplate> page = templateRepository.findAll(
                OnboardingTemplateSpecification.withFilters(
                        filter.getCompanyId(),
                        filter.getDepartmentId(),
                        filter.getJobTitleId(),
                        filter.getIsActive(),
                        filter.getKeyword()
                ),
                pageRequest
        );

        return PageData.of(page, mapper::toResponse);
    }

    @Transactional(readOnly = true)
    public OnboardingTemplateDto.Response getById(UUID id) {
        OnboardingChecklistTemplate entity = templateRepository.findById(id)
                .orElseThrow(() -> new AppException(OnboardingErrorCode.TEMPLATE_NOT_FOUND));
        return mapper.toResponse(entity);
    }

    @Transactional
    public OnboardingTemplateDto.Response create(OnboardingTemplateDto.CreateRequest request) {
        OnboardingChecklistTemplate entity = mapper.toEntity(request);
        OnboardingChecklistTemplate saved = templateRepository.save(entity);
        log.info("Đã tạo mẫu checklist hội nhập id='{}' name='{}'", saved.getId(), saved.getName());
        return mapper.toResponse(saved);
    }

    @Transactional
    public OnboardingTemplateDto.Response update(UUID id, OnboardingTemplateDto.UpdateRequest request) {
        OnboardingChecklistTemplate entity = templateRepository.findById(id)
                .orElseThrow(() -> new AppException(OnboardingErrorCode.TEMPLATE_NOT_FOUND));

        entity.setName(request.getName().trim());
        entity.setDepartmentId(request.getDepartmentId());
        entity.setJobTitleId(request.getJobTitleId());
        if (request.getIsActive() != null) {
            entity.setIsActive(request.getIsActive());
        }

        OnboardingChecklistTemplate saved = templateRepository.save(entity);
        return mapper.toResponse(saved);
    }

    @Transactional
    public OnboardingTemplateDto.Response updateItems(UUID id, OnboardingTemplateDto.UpdateItemsRequest request) {
        OnboardingChecklistTemplate template = templateRepository.findById(id)
                .orElseThrow(() -> new AppException(OnboardingErrorCode.TEMPLATE_NOT_FOUND));

        template.getItems().clear();

        List<OnboardingTemplateItem> newItems = new ArrayList<>();
        for (OnboardingTemplateDto.ItemRequest ir : request.getItems()) {
            OnboardingTemplateItem item = mapper.toEntity(ir);
            item.setTemplate(template);
            newItems.add(item);
        }
        template.getItems().addAll(newItems);

        OnboardingChecklistTemplate saved = templateRepository.save(template);
        log.info("Đã cập nhật danh sách {} hạng mục cho mẫu checklist id={}", newItems.size(), id);
        return mapper.toResponse(saved);
    }

    @Transactional
    public OnboardingTemplateDto.Response deactivate(UUID id) {
        OnboardingChecklistTemplate entity = templateRepository.findById(id)
                .orElseThrow(() -> new AppException(OnboardingErrorCode.TEMPLATE_NOT_FOUND));

        entity.setIsActive(false);
        OnboardingChecklistTemplate saved = templateRepository.save(entity);
        log.info("Đã ngừng kích hoạt mẫu checklist id={}", id);
        return mapper.toResponse(saved);
    }
}

