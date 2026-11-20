package com.cyclosa.payroll.service;

import com.cyclosa.employee.entity.Employee;
import com.cyclosa.employee.repository.EmployeeRepository;
import com.cyclosa.payroll.dto.request.ProcessPaymentResultRequest;
import com.cyclosa.payroll.dto.request.RetryPaymentRequest;
import com.cyclosa.payroll.dto.response.PayrollPaymentResponse;
import com.cyclosa.payroll.entity.PayrollPayment;
import com.cyclosa.payroll.enums.PaymentStatus;
import com.cyclosa.payroll.exception.PayrollErrorCode;
import com.cyclosa.payroll.exception.PayrollException;
import com.cyclosa.payroll.mapper.PayrollPaymentMapper;
import com.cyclosa.payroll.repository.PayrollPaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PayrollPaymentService {

    private final PayrollPaymentRepository payrollPaymentRepository;
    private final EmployeeRepository employeeRepository;
    private final PayrollPaymentMapper payrollPaymentMapper;

    @Transactional(readOnly = true)
    public List<PayrollPaymentResponse> getPaymentsByPeriod(UUID periodId) {
        List<PayrollPayment> payments = payrollPaymentRepository.findAllByPayrollPeriodId(periodId);
        List<PayrollPaymentResponse> responses = new ArrayList<>();

        for (PayrollPayment p : payments) {
            PayrollPaymentResponse resp = payrollPaymentMapper.toResponse(p);
            if (p.getPayrollRecord() != null) {
                employeeRepository.findById(p.getPayrollRecord().getEmployeeId()).ifPresent(emp -> {
                    resp.setEmployeeName(emp.getFullName());
                    resp.setEmployeeCode(emp.getEmployeeCode());
                });
            }
            responses.add(resp);
        }

        return responses;
    }

    @Transactional
    public PayrollPaymentResponse processPaymentResult(UUID paymentId, ProcessPaymentResultRequest request) {
        PayrollPayment payment = payrollPaymentRepository.findById(paymentId)
                .orElseThrow(() -> new PayrollException(PayrollErrorCode.PAYROLL_PAYMENT_NOT_FOUND));

        payment.setStatus(request.getStatus());
        payment.setBankReference(request.getTransactionRef());
        payment.setPaidAt(request.getPaidAt() != null ? request.getPaidAt() : LocalDateTime.now());
        payment.setFailureReason(request.getBankResponseMessage());

        PayrollPayment saved = payrollPaymentRepository.save(payment);
        return payrollPaymentMapper.toResponse(saved);
    }

    @Transactional
    public List<PayrollPaymentResponse> retryPayments(RetryPaymentRequest request) {
        List<PayrollPaymentResponse> results = new ArrayList<>();

        for (UUID id : request.getPaymentIds()) {
            PayrollPayment payment = payrollPaymentRepository.findById(id).orElse(null);
            if (payment != null && payment.getStatus() == PaymentStatus.REJECTED) {
                payment.setStatus(PaymentStatus.PENDING);
                payment.setFailureReason(null);
                payment = payrollPaymentRepository.save(payment);
                results.add(payrollPaymentMapper.toResponse(payment));
            }
        }

        return results;
    }
}
