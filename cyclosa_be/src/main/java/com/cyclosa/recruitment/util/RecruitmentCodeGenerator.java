package com.cyclosa.recruitment.util;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class RecruitmentCodeGenerator {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyyMM");

    public static String generateCode(String prefix, long currentCount) {
        String yearMonth = LocalDate.now().format(DATE_FORMAT);
        return String.format("%s-%s-%04d", prefix, yearMonth, currentCount + 1);
    }
}
