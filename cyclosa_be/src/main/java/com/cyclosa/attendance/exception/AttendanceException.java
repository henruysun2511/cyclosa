package com.cyclosa.attendance.exception;

import com.cyclosa.common.exception.AppException;

public class AttendanceException extends AppException {

    public AttendanceException(AttendanceErrorCode errorCode) {
        super(errorCode);
    }

    public AttendanceException(AttendanceErrorCode errorCode, String customMessage) {
        super(errorCode, customMessage);
    }
}

