package com.cyclosa.career.service;

import com.cyclosa.career.dto.request.AddTalentPoolEntryRequest;
import com.cyclosa.career.dto.request.TalentPoolFilter;
import com.cyclosa.career.dto.response.NineBoxGridResponse;
import com.cyclosa.career.dto.response.TalentPoolEntryResponse;
import com.cyclosa.career.entity.InternalTalentPoolEntry;
import com.cyclosa.career.enums.TalentTag;
import com.cyclosa.career.exception.CareerErrorCode;
import com.cyclosa.career.mapper.TalentPoolMapper;
import com.cyclosa.career.repository.InternalTalentPoolRepository;
import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.response.PageData;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.employee.entity.Employee;
import com.cyclosa.employee.repository.EmployeeRepository;
import com.cyclosa.organization.repository.CompanyRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TalentPoolService {

    private final InternalTalentPoolRepository talentPoolRepository;
    private final TalentPoolMapper talentPoolMapper;
    private final EmployeeRepository employeeRepository;
    private final CompanyRepository companyRepository;

    public PageData<TalentPoolEntryResponse> getTalentPoolEntries(TalentPoolFilter filter) {
        UUID companyId = resolveCurrentCompanyId();
        PageRequest pageRequest = PageRequest.of(
                filter.getPage(),
                filter.getSize(),
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Specification<InternalTalentPoolEntry> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("companyId"), companyId));

            if (filter.getTag() != null) {
                predicates.add(cb.equal(root.get("tag"), filter.getTag()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<InternalTalentPoolEntry> page = talentPoolRepository.findAll(spec, pageRequest);
        List<TalentPoolEntryResponse> items = talentPoolMapper.toResponseList(page.getContent());

        if (filter.getDepartmentId() != null) {
            items = items.stream()
                    .filter(i -> {
                        Employee emp = employeeRepository.findById(i.getEmployeeId()).orElse(null);
                        return emp != null && emp.getCurrentDepartment() != null
                                && filter.getDepartmentId().equals(emp.getCurrentDepartment().getId());
                    })
                    .collect(Collectors.toList());
        }

        return PageData.of(page, items);
    }

    public List<TalentPoolEntryResponse> getEmployeeTalentTags(UUID employeeId) {
        List<InternalTalentPoolEntry> list = talentPoolRepository.findAllByEmployeeId(employeeId);
        return talentPoolMapper.toResponseList(list);
    }

    @Transactional
    public TalentPoolEntryResponse addTalentPoolEntry(AddTalentPoolEntryRequest request) {
        UUID companyId = resolveCurrentCompanyId();

        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new AppException(CareerErrorCode.EMPLOYEE_NOT_FOUND));

        if (talentPoolRepository.existsByEmployeeIdAndTag(request.getEmployeeId(), request.getTag())) {
            throw new AppException(CareerErrorCode.TALENT_TAG_ALREADY_ASSIGNED);
        }

        InternalTalentPoolEntry entry = InternalTalentPoolEntry.builder()
                .employee(employee)
                .tag(request.getTag())
                .reason(request.getReason())
                .build();
        entry.setCompanyId(companyId);

        InternalTalentPoolEntry saved = talentPoolRepository.save(entry);
        log.info("Assigned talent tag {} to employee {}", request.getTag(), employee.getEmployeeCode());
        return talentPoolMapper.toResponse(saved);
    }

    @Transactional
    public void removeTalentPoolEntry(UUID id) {
        InternalTalentPoolEntry entry = talentPoolRepository.findById(id)
                .orElseThrow(() -> new AppException(CareerErrorCode.TALENT_ENTRY_NOT_FOUND));
        talentPoolRepository.delete(entry);
        log.info("Removed talent pool entry {}", id);
    }

    public NineBoxGridResponse getNineBoxGrid() {
        UUID companyId = resolveCurrentCompanyId();
        List<InternalTalentPoolEntry> allEntries = talentPoolRepository.findAllByCompanyIdWithEmployee(companyId);
        List<TalentPoolEntryResponse> dtoList = talentPoolMapper.toResponseList(allEntries);

        // Pre-create 9 cells definition
        Map<String, NineBoxGridResponse.NineBoxCell> cellMap = new LinkedHashMap<>();

        // High Potential row
        cellMap.put("ROUGH_DIAMOND", NineBoxGridResponse.NineBoxCell.builder()
                .boxCode("ROUGH_DIAMOND").title("Kim cương thô").performanceLevel("LOW").potentialLevel("HIGH")
                .candidateCount(0).candidates(new ArrayList<>()).build());
        cellMap.put("FUTURE_STAR", NineBoxGridResponse.NineBoxCell.builder()
                .boxCode("FUTURE_STAR").title("Ngôi sao tương lai").performanceLevel("MEDIUM").potentialLevel("HIGH")
                .candidateCount(0).candidates(new ArrayList<>()).build());
        cellMap.put("STAR", NineBoxGridResponse.NineBoxCell.builder()
                .boxCode("STAR").title("Ngôi sao lãnh đạo").performanceLevel("HIGH").potentialLevel("HIGH")
                .candidateCount(0).candidates(new ArrayList<>()).build());

        // Medium Potential row
        cellMap.put("INCONSISTENT", NineBoxGridResponse.NineBoxCell.builder()
                .boxCode("INCONSISTENT").title("Biến động").performanceLevel("LOW").potentialLevel("MEDIUM")
                .candidateCount(0).candidates(new ArrayList<>()).build());
        cellMap.put("CORE_PLAYER", NineBoxGridResponse.NineBoxCell.builder()
                .boxCode("CORE_PLAYER").title("Trụ cột cốt lõi").performanceLevel("MEDIUM").potentialLevel("MEDIUM")
                .candidateCount(0).candidates(new ArrayList<>()).build());
        cellMap.put("HIGH_PERFORMER", NineBoxGridResponse.NineBoxCell.builder()
                .boxCode("HIGH_PERFORMER").title("Chuyên gia hiệu suất").performanceLevel("HIGH").potentialLevel("MEDIUM")
                .candidateCount(0).candidates(new ArrayList<>()).build());

        // Low Potential row
        cellMap.put("UNDERPERFORMER", NineBoxGridResponse.NineBoxCell.builder()
                .boxCode("UNDERPERFORMER").title("Cần cải thiện").performanceLevel("LOW").potentialLevel("LOW")
                .candidateCount(0).candidates(new ArrayList<>()).build());
        cellMap.put("SPECIALIST", NineBoxGridResponse.NineBoxCell.builder()
                .boxCode("SPECIALIST").title("Chuyên viên ổn định").performanceLevel("MEDIUM").potentialLevel("LOW")
                .candidateCount(0).candidates(new ArrayList<>()).build());
        cellMap.put("SOLID_PERFORMER", NineBoxGridResponse.NineBoxCell.builder()
                .boxCode("SOLID_PERFORMER").title("Đáng tin cậy").performanceLevel("HIGH").potentialLevel("LOW")
                .candidateCount(0).candidates(new ArrayList<>()).build());

        // Classify candidates into 9 cells based on TalentTag
        for (TalentPoolEntryResponse item : dtoList) {
            String targetBox = mapTagToBox(item.getTag());
            NineBoxGridResponse.NineBoxCell cell = cellMap.get(targetBox);
            if (cell != null) {
                cell.getCandidates().add(item);
                cell.setCandidateCount(cell.getCandidates().size());
            }
        }

        return NineBoxGridResponse.builder()
                .cells(new ArrayList<>(cellMap.values()))
                .build();
    }

    private String mapTagToBox(TalentTag tag) {
        if (tag == null) return "CORE_PLAYER";
        return switch (tag) {
            case HIPO -> "FUTURE_STAR";
            case KEY_TALENT -> "STAR";
            case LEADERSHIP_POTENTIAL -> "STAR";
            case TECH_EXPERT -> "HIGH_PERFORMER";
        };
    }

    private UUID resolveCurrentCompanyId() {
        return SecurityUtils.getCurrentUserCompanyIdOptional()
                .orElseGet(() -> companyRepository.findAll().stream()
                        .findFirst()
                        .map(c -> c.getId())
                        .orElse(null));
    }
}
