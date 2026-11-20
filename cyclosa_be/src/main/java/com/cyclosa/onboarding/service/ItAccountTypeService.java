package com.cyclosa.onboarding.service;

import com.cyclosa.common.exception.AppException;
import com.cyclosa.onboarding.dto.ItAccountTypeDto;
import com.cyclosa.onboarding.entity.ItAccountType;
import com.cyclosa.onboarding.exception.OnboardingErrorCode;
import com.cyclosa.onboarding.mapper.OnboardingMapper;
import com.cyclosa.onboarding.repository.ItAccountTypeRepository;
import com.cyclosa.onboarding.repository.OnboardingTemplateItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ItAccountTypeService {

    private final ItAccountTypeRepository repository;
    private final OnboardingTemplateItemRepository itemRepository;
    private final OnboardingMapper mapper;

    @Transactional(readOnly = true)
    public List<ItAccountTypeDto.Response> getItAccountTypes(UUID companyId) {
        List<ItAccountType> list = companyId != null ? repository.findByCompanyId(companyId) : repository.findAll();
        return list.stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ItAccountTypeDto.Response getById(UUID id) {
        ItAccountType entity = repository.findById(id)
                .orElseThrow(() -> new AppException(OnboardingErrorCode.IT_ACCOUNT_TYPE_NOT_FOUND));
        return mapper.toResponse(entity);
    }

    @Transactional
    public ItAccountTypeDto.Response create(ItAccountTypeDto.CreateRequest request) {
        if (repository.existsByCompanyIdAndNameIgnoreCase(request.getCompanyId(), request.getName().trim())) {
            throw new AppException(OnboardingErrorCode.IT_ACCOUNT_TYPE_NAME_DUPLICATED);
        }
        ItAccountType entity = mapper.toEntity(request);
        ItAccountType saved = repository.save(entity);
        log.info("Đã tạo mới loại tài khoản CNTT id={} name='{}'", saved.getId(), saved.getName());
        return mapper.toResponse(saved);
    }

    @Transactional
    public ItAccountTypeDto.Response update(UUID id, ItAccountTypeDto.UpdateRequest request) {
        ItAccountType entity = repository.findById(id)
                .orElseThrow(() -> new AppException(OnboardingErrorCode.IT_ACCOUNT_TYPE_NOT_FOUND));

        if (!entity.getName().equalsIgnoreCase(request.getName().trim()) &&
                repository.existsByCompanyIdAndNameIgnoreCase(entity.getCompanyId(), request.getName().trim())) {
            throw new AppException(OnboardingErrorCode.IT_ACCOUNT_TYPE_NAME_DUPLICATED);
        }

        entity.setName(request.getName().trim());
        entity.setDescription(request.getDescription());
        ItAccountType saved = repository.save(entity);
        return mapper.toResponse(saved);
    }

    @Transactional
    public void delete(UUID id) {
        ItAccountType entity = repository.findById(id)
                .orElseThrow(() -> new AppException(OnboardingErrorCode.IT_ACCOUNT_TYPE_NOT_FOUND));

        if (itemRepository.existsByItAccountTypeId(id)) {
            throw new AppException(OnboardingErrorCode.IT_ACCOUNT_TYPE_IN_USE);
        }

        repository.delete(entity);
        log.info("Đã xóa loại tài khoản CNTT id={}", id);
    }
}

