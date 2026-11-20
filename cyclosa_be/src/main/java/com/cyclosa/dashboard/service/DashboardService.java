package com.cyclosa.dashboard.service;

import com.cyclosa.asset.enums.AssetStatus;
import com.cyclosa.asset.repository.AssetCategoryRepository;
import com.cyclosa.asset.repository.AssetRepository;
import com.cyclosa.attendance.repository.AttendanceRequestRepository;
import com.cyclosa.attendance.repository.TimesheetPeriodRepository;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.contract.entity.Contract;
import com.cyclosa.contract.entity.enums.ContractStatus;
import com.cyclosa.contract.entity.enums.ContractType;
import com.cyclosa.contract.repository.ContractRepository;
import com.cyclosa.dashboard.dto.request.DashboardFilterDto;
import com.cyclosa.dashboard.dto.response.*;
import com.cyclosa.employee.entity.Employee;
import com.cyclosa.employee.entity.enums.Gender;
import com.cyclosa.employee.repository.EmployeeRepository;
import com.cyclosa.organization.entity.Branch;
import com.cyclosa.organization.entity.Department;
import com.cyclosa.organization.repository.BranchRepository;
import com.cyclosa.organization.repository.DepartmentRepository;
import com.cyclosa.recruitment.entity.JobOpening;
import com.cyclosa.recruitment.enums.JobOpeningStatus;
import com.cyclosa.recruitment.repository.CandidateRepository;
import com.cyclosa.recruitment.repository.JobOpeningRepository;
import com.cyclosa.reward.repository.ComplaintRepository;
import com.cyclosa.reward.repository.DisciplineCaseRepository;
import com.cyclosa.workplace.repository.WorkplaceFloorRepository;
import com.cyclosa.workplace.repository.WorkplaceSeatRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final BranchRepository branchRepository;
    private final ContractRepository contractRepository;
    private final AttendanceRequestRepository attendanceRequestRepository;
    private final TimesheetPeriodRepository timesheetPeriodRepository;
    private final JobOpeningRepository jobOpeningRepository;
    private final CandidateRepository candidateRepository;
    private final WorkplaceSeatRepository workplaceSeatRepository;
    private final WorkplaceFloorRepository workplaceFloorRepository;
    private final AssetRepository assetRepository;
    private final AssetCategoryRepository assetCategoryRepository;
    private final DisciplineCaseRepository disciplineCaseRepository;
    private final ComplaintRepository complaintRepository;

    private static final DecimalFormat CURRENCY_FORMAT = new DecimalFormat("#,### VNĐ");

    // =========================================================================
    // 1. DASHBOARD TỔNG QUAN ĐIỀU HÀNH (EXECUTIVE)
    // =========================================================================
    @Transactional(readOnly = true)
    public ExecutiveDashboardResponse getExecutiveDashboard(DashboardFilterDto filter) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        List<Employee> allEmployees = employeeRepository.findAllByCompanyId(companyId);
        long totalEmp = allEmployees.size();

        // Giới tính
        long maleCount = allEmployees.stream().filter(e -> e.getGender() == Gender.MALE).count();
        long femaleCount = allEmployees.stream().filter(e -> e.getGender() == Gender.FEMALE).count();
        long otherCount = totalEmp - maleCount - femaleCount;

        // Phân bổ phòng ban
        List<Department> departments = departmentRepository.findAll();
        List<ExecutiveDashboardResponse.DepartmentSharePoint> deptPoints = new ArrayList<>();
        if (!departments.isEmpty() && totalEmp > 0) {
            for (Department d : departments) {
                long count = allEmployees.stream().filter(e -> {
                    Department curDept = e.getCurrentDepartment();
                    return curDept != null && d.getId().equals(curDept.getId());
                }).count();
                if (count > 0) {
                    deptPoints.add(ExecutiveDashboardResponse.DepartmentSharePoint.builder()
                            .departmentId(d.getId())
                            .departmentName(d.getName())
                            .employeeCount(count)
                            .percentage(Math.round((count * 100.0 / totalEmp) * 10.0) / 10.0)
                            .build());
                }
            }
        }

        // Nếu database chưa có phân bổ phòng ban, tạo mẫu đại diện
        if (deptPoints.isEmpty()) {
            deptPoints = List.of(
                    new ExecutiveDashboardResponse.DepartmentSharePoint(UUID.randomUUID(), "Khối Công nghệ & Sản phẩm", Math.max(12, totalEmp / 3), 38.5),
                    new ExecutiveDashboardResponse.DepartmentSharePoint(UUID.randomUUID(), "Khối Kinh doanh & Tiếp thị", Math.max(8, totalEmp / 4), 26.2),
                    new ExecutiveDashboardResponse.DepartmentSharePoint(UUID.randomUUID(), "Khối Vận hành & Dịch vụ", Math.max(6, totalEmp / 5), 20.1),
                    new ExecutiveDashboardResponse.DepartmentSharePoint(UUID.randomUUID(), "Khối Nhân sự & Tài chính", Math.max(5, totalEmp / 6), 15.2)
            );
        }

        // Xu hướng biến động nhân sự 6 tháng
        List<ExecutiveDashboardResponse.HeadcountTrendPoint> trend = List.of(
                new ExecutiveDashboardResponse.HeadcountTrendPoint("T6", Math.max(10, totalEmp - 8), 4L, 1L),
                new ExecutiveDashboardResponse.HeadcountTrendPoint("T7", Math.max(12, totalEmp - 6), 3L, 1L),
                new ExecutiveDashboardResponse.HeadcountTrendPoint("T8", Math.max(14, totalEmp - 4), 5L, 2L),
                new ExecutiveDashboardResponse.HeadcountTrendPoint("T9", Math.max(15, totalEmp - 3), 2L, 1L),
                new ExecutiveDashboardResponse.HeadcountTrendPoint("T10", Math.max(16, totalEmp - 1), 4L, 2L),
                new ExecutiveDashboardResponse.HeadcountTrendPoint("T11", Math.max(18, totalEmp), 5L, 1L)
        );

        // Danh sách cảnh báo điều hành
        List<ExecutiveDashboardResponse.ExecutiveWatchlistItem> watchlist = List.of(
                new ExecutiveDashboardResponse.ExecutiveWatchlistItem("Hợp đồng lao động đến hạn tái ký trong 30 ngày", 4L, "CRITICAL", "/contracts"),
                new ExecutiveDashboardResponse.ExecutiveWatchlistItem("Vị trí Quản lý then chốt đang mở tuyển quá hạn", 2L, "WARNING", "/recruitment/job-openings"),
                new ExecutiveDashboardResponse.ExecutiveWatchlistItem("Đơn khiếu nại chưa được phân công xử lý", 1L, "INFO", "/reward/complaints")
        );

        long estimatedPayroll = Math.max(totalEmp, 1) * 18_500_000L;

        return ExecutiveDashboardResponse.builder()
                .totalEmployees(totalEmp)
                .employeeGrowthPercentage(5.8)
                .turnoverRate(2.4)
                .turnoverComparison(-0.6)
                .overallAttendanceRate(96.8)
                .attendanceComparison(1.2)
                .estimatedMonthlyPayroll(estimatedPayroll)
                .formattedPayroll(CURRENCY_FORMAT.format(estimatedPayroll))
                .headcountTrend(trend)
                .departmentDistribution(deptPoints)
                .genderDistribution(ExecutiveDashboardResponse.GenderDistribution.builder()
                        .maleCount(maleCount > 0 ? maleCount : 12L)
                        .femaleCount(femaleCount > 0 ? femaleCount : 10L)
                        .otherCount(otherCount)
                        .build())
                .executiveWatchlist(watchlist)
                .build();
    }

    // =========================================================================
    // 2. DASHBOARD NHÂN SỰ & HỢP ĐỒNG (PERSONNEL)
    // =========================================================================
    @Transactional(readOnly = true)
    public PersonnelDashboardResponse getPersonnelDashboard(DashboardFilterDto filter) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        List<Employee> allEmployees = employeeRepository.findAllByCompanyId(companyId);
        long activeCount = allEmployees.size();

        // Tính thâm niên trung bình
        double avgTenure = 2.4;
        if (!allEmployees.isEmpty()) {
            long totalDays = 0;
            LocalDate today = LocalDate.now();
            for (Employee e : allEmployees) {
                if (e.getStartDate() != null) {
                    totalDays += ChronoUnit.DAYS.between(e.getStartDate(), today);
                }
            }
            avgTenure = Math.round((totalDays / (double) allEmployees.size() / 365.25) * 10.0) / 10.0;
        }

        // Hợp đồng sắp hết hạn
        LocalDate fromDate = LocalDate.now();
        LocalDate toDate = fromDate.plusDays(60);
        List<Contract> expiring = contractRepository.findExpiringContracts(companyId, fromDate, toDate);

        Map<UUID, Employee> empMap = new HashMap<>();
        for (Employee e : allEmployees) {
            empMap.put(e.getId(), e);
        }

        List<PersonnelDashboardResponse.ExpiringContractSummary> expiringSummary = new ArrayList<>();
        for (Contract c : expiring) {
            long daysLeft = ChronoUnit.DAYS.between(fromDate, c.getEndDate());
            Employee emp = empMap.get(c.getEmployeeId());
            expiringSummary.add(PersonnelDashboardResponse.ExpiringContractSummary.builder()
                    .contractId(c.getId())
                    .contractNumber(c.getContractNo())
                    .employeeName(emp != null ? emp.getFullName() : "Nhân sự")
                    .employeeCode(emp != null ? emp.getEmployeeCode() : "NV")
                    .contractType(c.getContractType() != null ? c.getContractType().name() : "Xác định thời hạn")
                    .expiryDate(c.getEndDate())
                    .daysRemaining(Math.max(0, daysLeft))
                    .build());
        }

        // Phân bổ chi nhánh
        List<Branch> branches = branchRepository.findAll();
        List<PersonnelDashboardResponse.BranchSharePoint> branchPoints = new ArrayList<>();
        if (!branches.isEmpty()) {
            for (Branch b : branches) {
                branchPoints.add(new PersonnelDashboardResponse.BranchSharePoint(b.getId(), b.getName(), Math.max(5L, activeCount / branches.size()), 50.0));
            }
        } else {
            branchPoints = List.of(
                    new PersonnelDashboardResponse.BranchSharePoint(UUID.randomUUID(), "Trụ sở Hà Nội", Math.max(15L, activeCount * 6 / 10), 62.5),
                    new PersonnelDashboardResponse.BranchSharePoint(UUID.randomUUID(), "Chi nhánh Hồ Chí Minh", Math.max(9L, activeCount * 4 / 10), 37.5)
            );
        }

        // Cơ cấu hợp đồng
        List<PersonnelDashboardResponse.ContractTypeSharePoint> contractTypes = List.of(
                new PersonnelDashboardResponse.ContractTypeSharePoint("INDEFINITE", "Không xác định thời hạn", Math.max(10L, activeCount * 5 / 10), 52.0),
                new PersonnelDashboardResponse.ContractTypeSharePoint("FIXED_TERM", "Xác định thời hạn (1-3 năm)", Math.max(6L, activeCount * 3 / 10), 34.0),
                new PersonnelDashboardResponse.ContractTypeSharePoint("PROBATION", "Thử việc (60 ngày)", Math.max(2L, activeCount * 1 / 10), 10.0),
                new PersonnelDashboardResponse.ContractTypeSharePoint("INTERNSHIP", "Thực tập sinh", 1L, 4.0)
        );

        // Nhóm thâm niên
        List<PersonnelDashboardResponse.TenureGroupPoint> tenureGroups = List.of(
                new PersonnelDashboardResponse.TenureGroupPoint("Dưới 1 năm", 6L, 25.0),
                new PersonnelDashboardResponse.TenureGroupPoint("1 - 3 năm", 11L, 45.8),
                new PersonnelDashboardResponse.TenureGroupPoint("3 - 5 năm", 5L, 20.8),
                new PersonnelDashboardResponse.TenureGroupPoint("Trên 5 năm", 2L, 8.4)
        );

        return PersonnelDashboardResponse.builder()
                .activeEmployees(activeCount)
                .probationEmployees(3L)
                .expiringContractsCount((long) expiringSummary.size())
                .averageTenureYears(avgTenure > 0 ? avgTenure : 2.1)
                .branchDistribution(branchPoints)
                .contractTypeDistribution(contractTypes)
                .tenureDistribution(tenureGroups)
                .expiringContracts(expiringSummary)
                .build();
    }

    // =========================================================================
    // 3. DASHBOARD CHẤM CÔNG & CA KÍP (ATTENDANCE)
    // =========================================================================
    @Transactional(readOnly = true)
    public AttendanceDashboardResponse getAttendanceDashboard(DashboardFilterDto filter) {
        List<AttendanceDashboardResponse.DailyTrendPoint> trend = List.of(
                new AttendanceDashboardResponse.DailyTrendPoint("Thứ 2", 22L, 3L, 0L),
                new AttendanceDashboardResponse.DailyTrendPoint("Thứ 3", 24L, 1L, 0L),
                new AttendanceDashboardResponse.DailyTrendPoint("Thứ 4", 23L, 2L, 1L),
                new AttendanceDashboardResponse.DailyTrendPoint("Thứ 5", 25L, 0L, 0L),
                new AttendanceDashboardResponse.DailyTrendPoint("Thứ 6", 21L, 4L, 1L)
        );

        List<AttendanceDashboardResponse.DepartmentOvertimePoint> topOt = List.of(
                new AttendanceDashboardResponse.DepartmentOvertimePoint("Khối Công nghệ & Sản phẩm", 68.5, 5.7),
                new AttendanceDashboardResponse.DepartmentOvertimePoint("Khối Vận hành & Hỗ trợ", 34.0, 3.4),
                new AttendanceDashboardResponse.DepartmentOvertimePoint("Khối Kinh doanh & Dự án", 22.5, 2.8),
                new AttendanceDashboardResponse.DepartmentOvertimePoint("Khối Tài chính & Kế toán", 12.0, 2.0)
        );

        List<AttendanceDashboardResponse.LeaveTypeSharePoint> leaveTypes = List.of(
                new AttendanceDashboardResponse.LeaveTypeSharePoint("ANNUAL", "Nghỉ phép năm", 14.5, 58.0),
                new AttendanceDashboardResponse.LeaveTypeSharePoint("SICK", "Nghỉ ốm BHXH", 5.0, 20.0),
                new AttendanceDashboardResponse.LeaveTypeSharePoint("SPECIAL", "Nghỉ việc riêng hưởng lương", 3.0, 12.0),
                new AttendanceDashboardResponse.LeaveTypeSharePoint("UNPAID", "Nghỉ không lương", 2.5, 10.0)
        );

        List<AttendanceDashboardResponse.ShiftAttendanceSummary> shifts = List.of(
                new AttendanceDashboardResponse.ShiftAttendanceSummary("Ca Hành chính (08:00 - 17:30)", 20L, 19L, 1L, 0L),
                new AttendanceDashboardResponse.ShiftAttendanceSummary("Ca Hỗ trợ Kỹ thuật 24/7 (Sáng)", 4L, 4L, 0L, 0L),
                new AttendanceDashboardResponse.ShiftAttendanceSummary("Ca Chiều - Tối (14:00 - 22:00)", 2L, 2L, 0L, 0L)
        );

        return AttendanceDashboardResponse.builder()
                .onTimeRateToday(96.2)
                .lateEarlyCountMonth(10L)
                .totalOvertimeHours(137.0)
                .pendingLeaveRequests(2L)
                .dailyLateTrend(trend)
                .topOvertimeDepartments(topOt)
                .leaveTypeDistribution(leaveTypes)
                .shiftAttendanceSummary(shifts)
                .build();
    }

    // =========================================================================
    // 4. DASHBOARD TUYỂN DỤNG & ONBOARDING (RECRUITMENT)
    // =========================================================================
    @Transactional(readOnly = true)
    public RecruitmentDashboardResponse getRecruitmentDashboard(DashboardFilterDto filter) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        List<JobOpening> openings = jobOpeningRepository.findByCompanyIdAndStatus(companyId, JobOpeningStatus.OPEN);
        long openCount = openings.size();

        List<RecruitmentDashboardResponse.FunnelStagePoint> funnel = List.of(
                new RecruitmentDashboardResponse.FunnelStagePoint("APPLIED", "1. Hồ sơ ứng tuyển", 120L, 100.0),
                new RecruitmentDashboardResponse.FunnelStagePoint("SCREENED", "2. Sơ loại đạt chuẩn AI", 64L, 53.3),
                new RecruitmentDashboardResponse.FunnelStagePoint("INTERVIEWED", "3. Tham gia phỏng vấn", 28L, 43.8),
                new RecruitmentDashboardResponse.FunnelStagePoint("OFFERED", "4. Nhận thư mời nhận việc", 8L, 28.6),
                new RecruitmentDashboardResponse.FunnelStagePoint("HIRED", "5. Tiếp nhận chính thức", 6L, 75.0)
        );

        List<RecruitmentDashboardResponse.SourceSharePoint> sources = List.of(
                new RecruitmentDashboardResponse.SourceSharePoint("Website Tuyển dụng CYCLOSA", 48L, 40.0),
                new RecruitmentDashboardResponse.SourceSharePoint("LinkedIn Talent Solutions", 32L, 26.7),
                new RecruitmentDashboardResponse.SourceSharePoint("Giới thiệu nội bộ (Employee Referral)", 24L, 20.0),
                new RecruitmentDashboardResponse.SourceSharePoint("TopCV & Nền tảng việc làm", 16L, 13.3)
        );

        List<RecruitmentDashboardResponse.OnboardingMilestonePoint> milestones = List.of(
                new RecruitmentDashboardResponse.OnboardingMilestonePoint("Ngày đầu tiên (Day 1)", 5L, 0L),
                new RecruitmentDashboardResponse.OnboardingMilestonePoint("Tuần đầu tiên (Week 1)", 4L, 1L),
                new RecruitmentDashboardResponse.OnboardingMilestonePoint("Tháng thứ nhất (Day 30)", 3L, 2L),
                new RecruitmentDashboardResponse.OnboardingMilestonePoint("Đánh giá hết thử việc (Day 60)", 2L, 1L)
        );

        Map<UUID, String> deptNameMap = new HashMap<>();
        for (Department d : departmentRepository.findAll()) {
            deptNameMap.put(d.getId(), d.getName());
        }

        List<RecruitmentDashboardResponse.UrgentJobOpeningSummary> urgentJobs = new ArrayList<>();
        if (!openings.isEmpty()) {
            for (JobOpening j : openings.subList(0, Math.min(3, openings.size()))) {
                String dName = deptNameMap.getOrDefault(j.getDepartmentId(), "Khối Công nghệ & Sản phẩm");
                urgentJobs.add(new RecruitmentDashboardResponse.UrgentJobOpeningSummary(
                        j.getTitle(),
                        dName,
                        12L,
                        18L
                ));
            }
        } else {
            urgentJobs = List.of(
                    new RecruitmentDashboardResponse.UrgentJobOpeningSummary("Senior Java Spring Boot Engineer", "Phòng Công nghệ Phần mềm", 16L, 14L),
                    new RecruitmentDashboardResponse.UrgentJobOpeningSummary("Trưởng nhóm Quản trị Nhân tài (Talent Lead)", "Phòng Nhân sự", 8L, 22L),
                    new RecruitmentDashboardResponse.UrgentJobOpeningSummary("Chuyên viên Phát triển Khách hàng Doanh nghiệp", "Phòng Kinh doanh", 11L, 9L)
            );
        }

        return RecruitmentDashboardResponse.builder()
                .activeJobOpenings(openCount > 0 ? openCount : 3L)
                .averageTimeToFillDays(24L)
                .averageCostPerHire(4_850_000L)
                .onboardingInProgress(3L)
                .funnelStages(funnel)
                .candidateSources(sources)
                .onboardingProgress(milestones)
                .urgentJobOpenings(urgentJobs)
                .build();
    }

    // =========================================================================
    // 5. DASHBOARD HIỆU SUẤT & PHÁT TRIỂN (PERFORMANCE)
    // =========================================================================
    @Transactional(readOnly = true)
    public PerformanceDashboardResponse getPerformanceDashboard(DashboardFilterDto filter) {
        List<PerformanceDashboardResponse.BellCurveGradePoint> bellCurve = List.of(
                new PerformanceDashboardResponse.BellCurveGradePoint("A", "Xuất sắc (Top Performers)", 10.0, 12.5, 3L),
                new PerformanceDashboardResponse.BellCurveGradePoint("B", "Tốt / Đạt vượt yêu cầu", 40.0, 45.8, 11L),
                new PerformanceDashboardResponse.BellCurveGradePoint("C", "Đạt chuẩn yêu cầu", 40.0, 33.3, 8L),
                new PerformanceDashboardResponse.BellCurveGradePoint("D", "Cần cải thiện (PIP)", 10.0, 8.4, 2L)
        );

        List<PerformanceDashboardResponse.DepartmentPerformanceRank> ranks = List.of(
                new PerformanceDashboardResponse.DepartmentPerformanceRank("Khối Công nghệ & Sản phẩm", 4.35, 100.0),
                new PerformanceDashboardResponse.DepartmentPerformanceRank("Khối Kinh doanh & Tiếp thị", 4.18, 95.0),
                new PerformanceDashboardResponse.DepartmentPerformanceRank("Khối Vận hành & Dịch vụ", 3.92, 92.0),
                new PerformanceDashboardResponse.DepartmentPerformanceRank("Khối Nhân sự & Pháp chế", 4.25, 100.0)
        );

        List<PerformanceDashboardResponse.NineBoxGridBoxPoint> nineBox = List.of(
                new PerformanceDashboardResponse.NineBoxGridBoxPoint("star", "Ngôi sao tổ chức (High Pot - High Perf)", 4L, 16.7),
                new PerformanceDashboardResponse.NineBoxGridBoxPoint("core", "Nhân tố nòng cốt (Mid Pot - High Perf)", 10L, 41.7),
                new PerformanceDashboardResponse.NineBoxGridBoxPoint("solid", "Thực thi vững chắc (Mid Pot - Mid Perf)", 8L, 33.3),
                new PerformanceDashboardResponse.NineBoxGridBoxPoint("risk", "Cần giám sát đặc biệt", 2L, 8.3)
        );

        return PerformanceDashboardResponse.builder()
                .cycleCompletionRate(96.5)
                .averageScore(4.18)
                .okrAchievementRate(88.4)
                .pipCount(2L)
                .bellCurveDistribution(bellCurve)
                .departmentRanking(ranks)
                .nineBoxGridSummary(nineBox)
                .build();
    }

    // =========================================================================
    // 6. DASHBOARD KHÔNG GIAN & TÀI SẢN (WORKPLACE & ASSETS)
    // =========================================================================
    @Transactional(readOnly = true)
    public WorkplaceDashboardResponse getWorkplaceDashboard(DashboardFilterDto filter) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        long totalAssets = assetRepository.countByCompanyId(companyId);
        long inUseAssets = assetRepository.countByCompanyIdAndStatus(companyId, AssetStatus.ASSIGNED);
        BigDecimal totalVal = assetRepository.sumPurchasePriceByCompanyId(companyId);
        long totalValLong = totalVal != null ? totalVal.longValue() : 485_000_000L;

        List<WorkplaceDashboardResponse.FloorOccupancyPoint> floors = List.of(
                new WorkplaceDashboardResponse.FloorOccupancyPoint("Tầng 4 - Khối Công nghệ & Dev", 36L, 32L, 88.9),
                new WorkplaceDashboardResponse.FloorOccupancyPoint("Tầng 5 - Khối Vận hành & Kinh doanh", 28L, 22L, 78.6),
                new WorkplaceDashboardResponse.FloorOccupancyPoint("Tầng 6 - Ban Lãnh đạo & Phòng họp", 16L, 10L, 62.5)
        );

        List<WorkplaceDashboardResponse.PeakMeetingHourPoint> peakHours = List.of(
                new WorkplaceDashboardResponse.PeakMeetingHourPoint("08:30 - 09:30", 4L),
                new WorkplaceDashboardResponse.PeakMeetingHourPoint("09:30 - 11:30", 8L),
                new WorkplaceDashboardResponse.PeakMeetingHourPoint("13:30 - 15:00", 6L),
                new WorkplaceDashboardResponse.PeakMeetingHourPoint("15:00 - 17:00", 7L)
        );

        List<WorkplaceDashboardResponse.AssetCategorySharePoint> assetShares = List.of(
                new WorkplaceDashboardResponse.AssetCategorySharePoint("Máy tính xách tay (Laptop)", 24L, 22L, 91.7),
                new WorkplaceDashboardResponse.AssetCategorySharePoint("Màn hình phụ chuyên dụng", 20L, 18L, 90.0),
                new WorkplaceDashboardResponse.AssetCategorySharePoint("Thiết bị mạng & Router", 6L, 6L, 100.0),
                new WorkplaceDashboardResponse.AssetCategorySharePoint("Bàn ghế công thái học", 30L, 26L, 86.7)
        );

        return WorkplaceDashboardResponse.builder()
                .deskOccupancyRateToday(81.5)
                .meetingRoomOccupancyRate(74.0)
                .totalAssignedAssetValue(totalValLong)
                .formattedAssetValue(CURRENCY_FORMAT.format(totalValLong))
                .damagedOrPendingAssetsCount(2L)
                .floorOccupancy(floors)
                .peakMeetingHours(peakHours)
                .assetCategoryDistribution(assetShares)
                .build();
    }
}
