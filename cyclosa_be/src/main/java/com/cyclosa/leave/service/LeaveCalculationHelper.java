package com.cyclosa.leave.service;

import com.cyclosa.leave.dto.response.LeavePreviewResponse;
import com.cyclosa.leave.enums.DayPortion;
import com.cyclosa.leave.exception.LeaveErrorCode;
import com.cyclosa.common.exception.AppException;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.MonthDay;
import java.util.*;

@Component
public class LeaveCalculationHelper {

    // Các ngày lễ cố định theo Dương lịch tại Việt Nam:
    // 01/01: Tết Dương lịch
    // 30/04: Ngày Giải phóng miền Nam
    // 01/05: Ngày Quốc tế Lao động
    // 02/09: Quốc khánh (kèm 01/09 hoặc 03/09 theo luật)
    private static final Set<MonthDay> FIXED_PUBLIC_HOLIDAYS = Set.of(
            MonthDay.of(1, 1),
            MonthDay.of(4, 30),
            MonthDay.of(5, 1),
            MonthDay.of(9, 1),
            MonthDay.of(9, 2),
            MonthDay.of(9, 3)
    );

    // Bảng tra cứu ngày lễ Âm lịch cố định (Giỗ Tổ Hùng Vương 10/03 AL, Tết Nguyên Đán 29/12 -> 05/01 AL)
    // Map từ năm Dương lịch sang các ngày nghỉ lễ cụ thể (tính sẵn cho các năm 2024, 2025, 2026, 2027)
    private static final Map<Integer, Set<LocalDate>> VARIABLE_HOLIDAYS_BY_YEAR = new HashMap<>();

    static {
        // 2025
        VARIABLE_HOLIDAYS_BY_YEAR.put(2025, Set.of(
                LocalDate.of(2025, 1, 27),
                LocalDate.of(2025, 1, 28),
                LocalDate.of(2025, 1, 29),
                LocalDate.of(2025, 1, 30),
                LocalDate.of(2025, 1, 31),
                LocalDate.of(2025, 4, 7) // Giỗ Tổ
        ));

        // 2026
        VARIABLE_HOLIDAYS_BY_YEAR.put(2026, Set.of(
                LocalDate.of(2026, 2, 16),
                LocalDate.of(2026, 2, 17),
                LocalDate.of(2026, 2, 18),
                LocalDate.of(2026, 2, 19),
                LocalDate.of(2026, 2, 20),
                LocalDate.of(2026, 4, 26) // Giỗ Tổ
        ));

        // 2027
        VARIABLE_HOLIDAYS_BY_YEAR.put(2027, Set.of(
                LocalDate.of(2027, 2, 5),
                LocalDate.of(2027, 2, 6),
                LocalDate.of(2027, 2, 7),
                LocalDate.of(2027, 2, 8),
                LocalDate.of(2027, 2, 9),
                LocalDate.of(2027, 4, 16) // Giỗ Tổ
        ));
    }

    public record CalculationResult(
            BigDecimal daysCount,
            int weekendDays,
            int holidayDays,
            List<LocalDate> holidayDates
    ) {}

    public CalculationResult calculateLeaveDays(LocalDate startDate, LocalDate endDate, DayPortion dayPortion) {
        if (startDate == null || endDate == null) {
            throw new AppException(LeaveErrorCode.INVALID_LEAVE_DATE_RANGE);
        }

        if (startDate.isAfter(endDate)) {
            throw new AppException(LeaveErrorCode.INVALID_LEAVE_DATE_RANGE);
        }

        if (dayPortion != DayPortion.FULL_DAY && !startDate.equals(endDate)) {
            throw new AppException(LeaveErrorCode.INVALID_HALF_DAY_PORTION);
        }

        // Trường hợp nghỉ nửa ngày trong 1 ngày
        if (dayPortion != DayPortion.FULL_DAY) {
            if (isWeekend(startDate) || isPublicHoliday(startDate)) {
                return new CalculationResult(BigDecimal.ZERO, isWeekend(startDate) ? 1 : 0, isPublicHoliday(startDate) ? 1 : 0,
                        isPublicHoliday(startDate) ? List.of(startDate) : Collections.emptyList());
            }
            return new CalculationResult(new BigDecimal("0.5"), 0, 0, Collections.emptyList());
        }

        int weekendCount = 0;
        int holidayCount = 0;
        int workingDays = 0;
        List<LocalDate> holidays = new ArrayList<>();

        LocalDate current = startDate;
        while (!current.isAfter(endDate)) {
            if (isWeekend(current)) {
                weekendCount++;
            } else if (isPublicHoliday(current)) {
                holidayCount++;
                holidays.add(current);
            } else {
                workingDays++;
            }
            current = current.plusDays(1);
        }

        return new CalculationResult(
                BigDecimal.valueOf(workingDays),
                weekendCount,
                holidayCount,
                holidays
        );
    }

    public boolean isWeekend(LocalDate date) {
        DayOfWeek dow = date.getDayOfWeek();
        return dow == DayOfWeek.SATURDAY || dow == DayOfWeek.SUNDAY;
    }

    public boolean isPublicHoliday(LocalDate date) {
        MonthDay md = MonthDay.of(date.getMonth(), date.getDayOfMonth());
        if (FIXED_PUBLIC_HOLIDAYS.contains(md)) {
            return true;
        }

        Set<LocalDate> yearHolidays = VARIABLE_HOLIDAYS_BY_YEAR.get(date.getYear());
        return yearHolidays != null && yearHolidays.contains(date);
    }
}

