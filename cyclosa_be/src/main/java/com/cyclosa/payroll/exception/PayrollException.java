package com.cyclosa.payroll.exception;

import com.cyclosa.common.exception.AppException;

public class PayrollException extends AppException {

    public PayrollException(PayrollErrorCode errorCode) {
        super(errorCode);
    }

    public PayrollException(PayrollErrorCode errorCode, String customMessage) {
        super(errorCode, customMessage);
    }
}

