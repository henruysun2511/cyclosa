package com.cyclosa.audit.aop;

import com.cyclosa.audit.enums.AuditAction;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Annotation đánh dấu phương thức nghiệp vụ cần tự động ghi nhật ký kiểm toán.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Auditable {

    /**
     * Hành động nghiệp vụ thực hiện.
     */
    AuditAction action();

    /**
     * Tên loại thực thể bị tác động (vd: EMPLOYEE, CONTRACT, WORKFLOW_REQUEST).
     */
    String entityType();

    /**
     * Biểu thức SpEL để trích xuất entityId từ tham số hoặc kết quả trả về (vd: "#id", "#result.id").
     */
    String entityIdExpression() default "";

    /**
     * Mô tả tóm tắt hành vi.
     */
    String description() default "";
}

