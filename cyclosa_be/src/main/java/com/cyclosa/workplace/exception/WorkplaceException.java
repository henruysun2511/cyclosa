package com.cyclosa.workplace.exception;

import com.cyclosa.common.exception.AppException;

public class WorkplaceException extends AppException {
    public WorkplaceException(WorkplaceErrorCode errorCode) {
        super(errorCode);
    }

    public WorkplaceException(WorkplaceErrorCode errorCode, String customMessage) {
        super(errorCode, customMessage);
    }
}
