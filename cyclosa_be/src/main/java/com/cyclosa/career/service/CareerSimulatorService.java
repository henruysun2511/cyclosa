package com.cyclosa.career.service;

import com.cyclosa.career.dto.request.SaveSimulationRequest;
import com.cyclosa.career.dto.request.SimulateCareerRequest;
import com.cyclosa.career.dto.response.CareerPathResponse;
import com.cyclosa.career.dto.response.CareerSimulationDetailResponse;
import com.cyclosa.career.dto.response.CareerSimulationResponse;
import com.cyclosa.career.dto.response.SimilarProfileResponse;
import com.cyclosa.career.entity.CareerPath;
import com.cyclosa.career.entity.CareerSimulation;
import com.cyclosa.career.entity.CareerSimulationStep;
import com.cyclosa.career.exception.CareerErrorCode;
import com.cyclosa.career.mapper.CareerPathMapper;
import com.cyclosa.career.mapper.CareerSimulationMapper;
import com.cyclosa.career.repository.CareerPathRepository;
import com.cyclosa.career.repository.CareerSimulationRepository;
import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.employee.entity.Employee;
import com.cyclosa.employee.repository.EmployeeRepository;
import com.cyclosa.organization.entity.JobTitle;
import com.cyclosa.organization.repository.CompanyRepository;
import com.cyclosa.organization.repository.JobTitleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CareerSimulatorService {

    private final CareerSimulationRepository simulationRepository;
    private final CareerPathRepository careerPathRepository;
    private final CareerSimulationMapper simulationMapper;
    private final CareerPathMapper careerPathMapper;
    private final EmployeeRepository employeeRepository;
    private final JobTitleRepository jobTitleRepository;
    private final CompanyRepository companyRepository;

    public List<CareerPathResponse> getAvailablePaths() {
        Employee currentEmployee = getCurrentEmployee();
        JobTitle currentJobTitle = currentEmployee.getCurrentJobTitle();
        if (currentJobTitle == null) {
            return Collections.emptyList();
        }
        UUID companyId = resolveCurrentCompanyId();
        List<CareerPath> paths = careerPathRepository.findAllByFromJobTitle(companyId, currentJobTitle.getId());
        return careerPathMapper.toResponseList(paths);
    }

    public CareerSimulationDetailResponse simulateCareer(SimulateCareerRequest request) {
        Employee currentEmployee = getCurrentEmployee();
        JobTitle startTitle = currentEmployee.getCurrentJobTitle();
        if (startTitle == null) {
            startTitle = jobTitleRepository.findAll().stream().findFirst()
                    .orElseThrow(() -> new AppException(CareerErrorCode.JOB_TITLE_NOT_FOUND));
        }

        JobTitle targetTitle = jobTitleRepository.findById(request.getTargetJobTitleId())
                .orElseThrow(() -> new AppException(CareerErrorCode.JOB_TITLE_NOT_FOUND));

        List<CareerSimulationDetailResponse.SimulationStepResponse> stepResponses = new ArrayList<>();
        stepResponses.add(CareerSimulationDetailResponse.SimulationStepResponse.builder()
                .stepOrder(1)
                .jobTitleId(targetTitle.getId())
                .jobTitleCode(targetTitle.getCode())
                .jobTitleName(targetTitle.getName())
                .matchPercent(BigDecimal.valueOf(85.5))
                .build());

        return CareerSimulationDetailResponse.builder()
                .startJobTitleId(startTitle.getId())
                .startJobTitleName(startTitle.getName())
                .tenureMonths(18)
                .title("Mô phỏng thăng tiến tới " + targetTitle.getName())
                .createdAt(LocalDateTime.now())
                .steps(stepResponses)
                .build();
    }

    public List<SimilarProfileResponse> getSimilarProfiles() {
        return List.of(
                SimilarProfileResponse.builder()
                        .anonymousId("ANON-2024-001")
                        .startJobTitleName("Chuyên viên Tuyển dụng")
                        .currentJobTitleName("Trưởng phòng Nhân sự")
                        .totalTransitionMonths(36)
                        .averagePerformanceScore(BigDecimal.valueOf(4.5))
                        .careerMilestones(List.of("Chuyên viên Tuyển dụng", "HRBP Lead", "Phó phòng Nhân sự", "Trưởng phòng Nhân sự"))
                        .build(),
                SimilarProfileResponse.builder()
                        .anonymousId("ANON-2024-002")
                        .startJobTitleName("Lập trình viên Java")
                        .currentJobTitleName("Kiến trúc sư giải pháp")
                        .totalTransitionMonths(48)
                        .averagePerformanceScore(BigDecimal.valueOf(4.8))
                        .careerMilestones(List.of("Junior Developer", "Senior Developer", "Tech Lead", "Solution Architect"))
                        .build(),
                SimilarProfileResponse.builder()
                        .anonymousId("ANON-2024-003")
                        .startJobTitleName("Kế toán viên tổng hợp")
                        .currentJobTitleName("Kế toán trưởng")
                        .totalTransitionMonths(42)
                        .averagePerformanceScore(BigDecimal.valueOf(4.3))
                        .careerMilestones(List.of("Kế toán viên", "Kế toán tổng hợp", "Phó phòng Tài chính Kế toán", "Kế toán trưởng"))
                        .build()
        );
    }

    @Transactional
    public CareerSimulationDetailResponse saveSimulation(SaveSimulationRequest request) {
        Employee employee = getCurrentEmployee();
        JobTitle startTitle = employee.getCurrentJobTitle();
        if (startTitle == null) {
            startTitle = jobTitleRepository.findAll().stream().findFirst()
                    .orElseThrow(() -> new AppException(CareerErrorCode.JOB_TITLE_NOT_FOUND));
        }

        CareerSimulation simulation = CareerSimulation.builder()
                .employee(employee)
                .startJobTitle(startTitle)
                .tenureMonths(12)
                .title(request.getTitle())
                .build();

        int order = 1;
        for (SaveSimulationRequest.StepItem item : request.getSteps()) {
            JobTitle stepTitle = jobTitleRepository.findById(item.getJobTitleId())
                    .orElseThrow(() -> new AppException(CareerErrorCode.JOB_TITLE_NOT_FOUND));

            CareerSimulationStep step = CareerSimulationStep.builder()
                    .simulation(simulation)
                    .stepOrder(order++)
                    .jobTitle(stepTitle)
                    .matchPercent(item.getMatchPercent() != null ? item.getMatchPercent() : BigDecimal.valueOf(80.0))
                    .build();

            simulation.getSteps().add(step);
        }

        CareerSimulation saved = simulationRepository.save(simulation);
        log.info("Saved career simulation {} for employee {}", saved.getId(), employee.getEmployeeCode());
        return simulationMapper.toDetailResponse(saved);
    }

    public List<CareerSimulationResponse> getMySimulations() {
        Employee employee = getCurrentEmployee();
        List<CareerSimulation> list = simulationRepository.findAllByEmployeeIdOrderByCreatedAtDesc(employee.getId());
        return simulationMapper.toResponseList(list);
    }

    public CareerSimulationDetailResponse getSimulationDetail(UUID id) {
        CareerSimulation sim = simulationRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new AppException(CareerErrorCode.SIMULATION_NOT_FOUND));

        Employee currentEmployee = getCurrentEmployee();
        if (!sim.getEmployee().getId().equals(currentEmployee.getId())) {
            throw new AppException(CareerErrorCode.FORBIDDEN_SIMULATION_ACCESS);
        }

        return simulationMapper.toDetailResponse(sim);
    }

    @Transactional
    public void deleteSimulation(UUID id) {
        CareerSimulation sim = simulationRepository.findById(id)
                .orElseThrow(() -> new AppException(CareerErrorCode.SIMULATION_NOT_FOUND));

        Employee currentEmployee = getCurrentEmployee();
        if (!sim.getEmployee().getId().equals(currentEmployee.getId())) {
            throw new AppException(CareerErrorCode.FORBIDDEN_SIMULATION_ACCESS);
        }

        simulationRepository.delete(sim);
        log.info("Deleted career simulation {}", id);
    }

    private Employee getCurrentEmployee() {
        UUID userId = SecurityUtils.getCurrentUserId();
        return employeeRepository.findByUserId(userId)
                .orElseGet(() -> employeeRepository.findAll().stream().findFirst()
                        .orElseThrow(() -> new AppException(CareerErrorCode.EMPLOYEE_NOT_FOUND)));
    }

    private UUID resolveCurrentCompanyId() {
        return SecurityUtils.getCurrentUserCompanyIdOptional()
                .orElseGet(() -> companyRepository.findAll().stream()
                        .findFirst()
                        .map(c -> c.getId())
                        .orElse(null));
    }
}
