package com.cyclosa.recruitment.service;

import com.cyclosa.audit.aop.Auditable;
import com.cyclosa.audit.enums.AuditAction;
import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.response.PageData;
import com.cyclosa.employee.dto.request.CreateEmployeeRequest;
import com.cyclosa.employee.dto.response.EmployeeDetailResponse;
import com.cyclosa.employee.entity.Employee;
import com.cyclosa.employee.entity.enums.EmploymentType;
import com.cyclosa.employee.entity.enums.Gender;
import com.cyclosa.employee.repository.EmployeeRepository;
import com.cyclosa.employee.service.EmployeeService;
import com.cyclosa.onboarding.dto.OnboardingProcessDto;
import com.cyclosa.onboarding.entity.OnboardingChecklistTemplate;
import com.cyclosa.onboarding.repository.OnboardingChecklistTemplateRepository;
import com.cyclosa.onboarding.repository.OnboardingProcessRepository;
import com.cyclosa.onboarding.service.OnboardingProcessService;
import com.cyclosa.organization.entity.Branch;
import com.cyclosa.organization.entity.JobLevel;
import com.cyclosa.organization.repository.BranchRepository;
import com.cyclosa.organization.repository.JobLevelRepository;
import com.cyclosa.payroll.dto.request.CreateSalaryHistoryRequest;
import com.cyclosa.payroll.enums.SalaryChangeReason;
import com.cyclosa.payroll.service.SalaryHistoryService;
import com.cyclosa.recruitment.dto.OfferDto;
import com.cyclosa.recruitment.entity.Application;
import com.cyclosa.recruitment.entity.Candidate;
import com.cyclosa.recruitment.entity.JobOpening;
import com.cyclosa.recruitment.entity.Offer;
import com.cyclosa.recruitment.entity.OfferAllowance;
import com.cyclosa.recruitment.enums.ApplicationStage;
import com.cyclosa.recruitment.enums.OfferStatus;
import com.cyclosa.recruitment.exception.RecruitmentErrorCode;
import com.cyclosa.recruitment.mapper.OfferMapper;
import com.cyclosa.recruitment.repository.ApplicationRepository;
import com.cyclosa.recruitment.repository.OfferAllowanceRepository;
import com.cyclosa.recruitment.repository.OfferRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class OfferService {

    private final OfferRepository offerRepository;
    private final OfferAllowanceRepository allowanceRepository;
    private final ApplicationRepository applicationRepository;
    private final OfferMapper offerMapper;

    private final EmployeeRepository employeeRepository;
    private final EmployeeService employeeService;
    private final SalaryHistoryService salaryHistoryService;
    private final BranchRepository branchRepository;
    private final JobLevelRepository jobLevelRepository;
    private final OnboardingProcessService onboardingProcessService;
    private final OnboardingChecklistTemplateRepository onboardingTemplateRepository;
    private final OnboardingProcessRepository onboardingProcessRepository;

    @Transactional
    @Auditable(
        action = AuditAction.CREATE,
        entityType = "RECRUITMENT_OFFER",
        entityIdExpression = "#result.id",
        description = "Tạo mới lời mời nhận việc (Offer) cho ứng viên"
    )
    public OfferDto.Response createOffer(OfferDto.CreateRequest dto) {
        Application application = applicationRepository.findById(dto.getApplicationId())
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.APPLICATION_NOT_FOUND));

        Offer entity = offerMapper.toEntity(dto);
        entity.setApplication(application);
        entity.setStatus(OfferStatus.DRAFT);

        Offer saved = offerRepository.save(entity);

        if (dto.getAllowances() != null) {
            for (OfferDto.AllowanceDto a : dto.getAllowances()) {
                allowanceRepository.save(OfferAllowance.builder()
                        .offer(saved)
                        .allowanceType(a.getName())
                        .amount(a.getAmount())
                        .notes(a.getTaxable() != null ? "taxable=" + a.getTaxable() : "")
                        .build());
            }
        }

        return getOfferById(saved.getId());
    }

    @Transactional
    @Auditable(
        action = AuditAction.PUBLISH,
        entityType = "RECRUITMENT_OFFER",
        entityIdExpression = "#id",
        description = "Gửi thư mời nhận việc (Offer) tới ứng viên"
    )
    public OfferDto.Response sendOffer(UUID id) {
        Offer entity = offerRepository.findById(id)
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.OFFER_NOT_FOUND));

        if (entity.getStatus() != OfferStatus.DRAFT && entity.getStatus() != OfferStatus.PENDING_APPROVAL) {
            throw new AppException(RecruitmentErrorCode.OFFER_NOT_EDITABLE);
        }

        entity.setStatus(OfferStatus.SENT);
        Offer saved = offerRepository.save(entity);

        if (saved.getApplication() != null) {
            saved.getApplication().setCurrentStage(ApplicationStage.OFFER);
            applicationRepository.save(saved.getApplication());
        }

        return getOfferById(saved.getId());
    }

    @Transactional
    @Auditable(
        action = AuditAction.APPROVE,
        entityType = "RECRUITMENT_OFFER",
        entityIdExpression = "#id",
        description = "Xác nhận ứng viên đồng ý nhận việc (Offer Accepted)"
    )
    public OfferDto.Response acceptOffer(UUID id) {
        Offer entity = offerRepository.findById(id)
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.OFFER_NOT_FOUND));

        if (entity.getStatus() != OfferStatus.SENT) {
            throw new AppException(RecruitmentErrorCode.OFFER_NOT_EDITABLE);
        }

        entity.setStatus(OfferStatus.ACCEPTED);
        Offer saved = offerRepository.save(entity);

        if (saved.getApplication() != null) {
            saved.getApplication().setCurrentStage(ApplicationStage.HIRED);
            applicationRepository.save(saved.getApplication());
        }

        return getOfferById(saved.getId());
    }

    @Transactional
    @Auditable(
        action = AuditAction.REJECT,
        entityType = "RECRUITMENT_OFFER",
        entityIdExpression = "#id",
        description = "Ghi nhận ứng viên từ chối lời mời nhận việc (Offer Declined)"
    )
    public OfferDto.Response declineOffer(UUID id, OfferDto.UpdateStatusRequest dto) {
        Offer entity = offerRepository.findById(id)
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.OFFER_NOT_FOUND));

        entity.setStatus(OfferStatus.DECLINED);
        entity.setDeclineReason(dto.getDeclineReason());
        entity.setDeclineNote(dto.getDeclineNotes());
        Offer saved = offerRepository.save(entity);

        return getOfferById(saved.getId());
    }

    @Transactional
    @Auditable(
        action = AuditAction.CREATE,
        entityType = "RECRUITMENT_OFFER",
        entityIdExpression = "#id",
        description = "Chuyển đổi thư mời nhận việc thành hồ sơ nhân viên và kích hoạt Onboarding"
    )
    public OfferDto.ConvertToEmployeeResponse convertOfferToEmployee(UUID id) {
        Offer offer = offerRepository.findById(id)
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.OFFER_NOT_FOUND));

        if (offer.getStatus() != OfferStatus.ACCEPTED) {
            throw new AppException(RecruitmentErrorCode.OFFER_NOT_ACCEPTED);
        }

        Application application = offer.getApplication();
        if (application == null) {
            throw new AppException(RecruitmentErrorCode.APPLICATION_NOT_FOUND);
        }

        Candidate candidate = application.getCandidate();
        if (candidate == null) {
            throw new AppException(RecruitmentErrorCode.CANDIDATE_NOT_FOUND);
        }

        JobOpening jobOpening = application.getJobOpening();
        if (jobOpening == null) {
            throw new AppException(RecruitmentErrorCode.JOB_OPENING_NOT_FOUND);
        }

        // Kiểm tra xem ứng viên đã được tạo nhân viên chưa
        if (employeeRepository.existsBySourceApplicationId(application.getId())) {
            Employee existing = employeeRepository.findBySourceApplicationId(application.getId()).orElse(null);
            UUID procId = null;
            if (existing != null) {
                procId = onboardingProcessRepository.findFirstByEmployeeIdOrderByCreatedAtDesc(existing.getId())
                        .map(com.cyclosa.onboarding.entity.OnboardingProcess::getId)
                        .orElse(null);
            }
            return OfferDto.ConvertToEmployeeResponse.builder()
                    .employeeId(existing != null ? existing.getId() : null)
                    .employeeCode(existing != null ? existing.getEmployeeCode() : "")
                    .employeeName(existing != null ? existing.getFullName() : candidate.getFullName())
                    .onboardingProcessId(procId)
                    .message("Hồ sơ nhân viên đã được tiếp nhận trước đó")
                    .build();
        }

        // Tách họ & tên
        String fullName = candidate.getFullName() != null ? candidate.getFullName().trim() : "Nhân viên";
        String lastName;
        String firstName;
        int lastSpace = fullName.lastIndexOf(' ');
        if (lastSpace > 0) {
            lastName = fullName.substring(0, lastSpace).trim();
            firstName = fullName.substring(lastSpace + 1).trim();
        } else {
            lastName = fullName;
            firstName = fullName;
        }

        // Xác định giới tính
        Gender gender = Gender.OTHER;
        if (candidate.getGender() != null) {
            try {
                gender = Gender.valueOf(candidate.getGender().trim().toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }

        // Xác định ngày sinh (mặc định 22 tuổi nếu chưa nhập)
        LocalDate dob = candidate.getDateOfBirth() != null ? candidate.getDateOfBirth() : LocalDate.now().minusYears(22);

        // Xác định chi nhánh làm việc
        List<Branch> branches = branchRepository.findAllByCompanyId(jobOpening.getCompanyId());
        UUID branchId = !branches.isEmpty() ? branches.get(0).getId() : null;
        if (branchId == null) {
            branchId = branchRepository.findAll().stream().findFirst().map(Branch::getId).orElse(null);
        }

        // Xác định cấp bậc (job level)
        List<JobLevel> jobLevels = jobLevelRepository.findAllByCompanyIdOrderByRankOrderAsc(jobOpening.getCompanyId());
        UUID jobLevelId = !jobLevels.isEmpty() ? jobLevels.get(0).getId() : null;
        if (jobLevelId == null) {
            jobLevelId = jobLevelRepository.findAll().stream().findFirst().map(JobLevel::getId).orElse(null);
        }

        LocalDate startDate = offer.getExpectedStartDate() != null ? offer.getExpectedStartDate() : LocalDate.now();
        LocalDate probationEndDate = startDate.plusMonths(2);

        CreateEmployeeRequest createRequest = CreateEmployeeRequest.builder()
                .companyId(jobOpening.getCompanyId())
                .lastName(lastName)
                .firstName(firstName)
                .dateOfBirth(dob)
                .gender(gender)
                .phone(candidate.getPhone() != null && !candidate.getPhone().isBlank() ? candidate.getPhone() : "0900000000")
                .personalEmail(candidate.getEmail())
                .address(candidate.getAddress())
                .startDate(startDate)
                .probationEndDate(probationEndDate)
                .sourceApplicationId(application.getId())
                .departmentId(jobOpening.getDepartmentId())
                .branchId(branchId)
                .jobTitleId(jobOpening.getJobTitleId())
                .jobLevelId(jobLevelId)
                .employmentType(EmploymentType.FULL_TIME)
                .createSystemUser(false)
                .build();

        EmployeeDetailResponse createdEmployee = employeeService.createEmployee(createRequest);
        UUID employeeId = createdEmployee.getId();

        // Ghi nhận mức lương khởi điểm vào SalaryHistory
        if (offer.getBaseSalary() != null) {
            try {
                salaryHistoryService.recordSalaryChange(CreateSalaryHistoryRequest.builder()
                        .employeeId(employeeId)
                        .newBaseSalary(offer.getBaseSalary())
                        .effectiveDate(startDate)
                        .reason(SalaryChangeReason.INITIAL)
                        .note("Lương khởi điểm tiếp nhận từ Thư mời nhận việc (Offer)")
                        .build());
            } catch (Exception e) {
                log.warn("Không thể tự động ghi nhận SalaryHistory ban đầu cho nhân viên {}: {}", employeeId, e.getMessage());
            }
        }

        // Tự động tìm Onboarding Template phù hợp và khởi tạo tiến trình Onboarding
        UUID onboardingProcessId = null;
        try {
            Optional<OnboardingChecklistTemplate> templateOpt = onboardingTemplateRepository
                    .findFirstByCompanyIdAndDepartmentIdAndJobTitleIdAndIsActiveTrue(
                            jobOpening.getCompanyId(), jobOpening.getDepartmentId(), jobOpening.getJobTitleId()
                    );
            if (templateOpt.isEmpty()) {
                templateOpt = onboardingTemplateRepository
                        .findFirstByCompanyIdAndDepartmentIdAndJobTitleIdIsNullAndIsActiveTrue(
                                jobOpening.getCompanyId(), jobOpening.getDepartmentId()
                        );
            }
            if (templateOpt.isEmpty()) {
                templateOpt = onboardingTemplateRepository
                        .findFirstByCompanyIdAndDepartmentIdIsNullAndJobTitleIdIsNullAndIsActiveTrue(
                                jobOpening.getCompanyId()
                        );
            }
            if (templateOpt.isEmpty()) {
                List<OnboardingChecklistTemplate> allTemplates = onboardingTemplateRepository.findByCompanyIdAndIsActiveTrue(jobOpening.getCompanyId());
                if (!allTemplates.isEmpty()) {
                    templateOpt = Optional.of(allTemplates.get(0));
                }
            }

            if (templateOpt.isPresent()) {
                OnboardingProcessDto.CreateRequest procRequest = OnboardingProcessDto.CreateRequest.builder()
                        .employeeId(employeeId)
                        .templateId(templateOpt.get().getId())
                        .build();
                OnboardingProcessDto.DetailResponse procResp = onboardingProcessService.createProcess(procRequest);
                if (procResp != null && procResp.getSummary() != null) {
                    onboardingProcessId = procResp.getSummary().getId();
                }
            } else {
                log.info("Không tìm thấy Onboarding Checklist Template nào đang hoạt động cho công ty {}", jobOpening.getCompanyId());
            }
        } catch (Exception e) {
            log.warn("Không thể tự động tạo OnboardingProcess cho nhân viên {}: {}", employeeId, e.getMessage());
        }

        // Cập nhật trạng thái Application sang HIRED nếu chưa
        if (application.getCurrentStage() != ApplicationStage.HIRED) {
            application.setCurrentStage(ApplicationStage.HIRED);
            applicationRepository.save(application);
        }

        return OfferDto.ConvertToEmployeeResponse.builder()
                .employeeId(employeeId)
                .employeeCode(createdEmployee.getEmployeeCode())
                .employeeName(createdEmployee.getLastName() + " " + createdEmployee.getFirstName())
                .onboardingProcessId(onboardingProcessId)
                .message("Tiếp nhận ứng viên thành nhân viên và kích hoạt tiến trình Onboarding thành công")
                .build();
    }

    @Transactional(readOnly = true)
    public OfferDto.Response getOfferById(UUID id) {
        Offer entity = offerRepository.findById(id)
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.OFFER_NOT_FOUND));

        Candidate candidate = entity.getApplication() != null ? entity.getApplication().getCandidate() : null;

        OfferDto.Response res = offerMapper.toResponse(entity);
        if (candidate != null) {
            res.setCandidateName(candidate.getFullName());
            res.setCandidateEmail(candidate.getEmail());
        }

        List<OfferAllowance> allowances = allowanceRepository.findByOffer_Id(id);
        res.setAllowances(allowances.stream().map(offerMapper::toAllowanceDto).toList());

        if (entity.getApplication() != null) {
            Optional<Employee> empOpt = employeeRepository.findBySourceApplicationId(entity.getApplication().getId());
            if (empOpt.isPresent()) {
                Employee emp = empOpt.get();
                res.setEmployeeId(emp.getId());
                res.setEmployeeCode(emp.getEmployeeCode());
                res.setIsConvertedToEmployee(true);
                onboardingProcessRepository.findFirstByEmployeeIdOrderByCreatedAtDesc(emp.getId())
                        .ifPresent(p -> res.setOnboardingProcessId(p.getId()));
            } else {
                res.setIsConvertedToEmployee(false);
            }
        }

        return res;
    }

    @Transactional(readOnly = true)
    public PageData<OfferDto.Response> searchOffers(OfferDto.FilterRequest filter) {
        PageRequest pageRequest = PageRequest.of(
                filter.getPage(),
                filter.getSize(),
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Page<Offer> page = offerRepository.findAll(pageRequest);
        return PageData.of(page, o -> getOfferById(o.getId()));
    }
}
