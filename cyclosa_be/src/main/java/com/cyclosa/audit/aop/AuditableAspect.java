package com.cyclosa.audit.aop;

import com.cyclosa.audit.event.AuditLogEvent;
import com.cyclosa.common.util.SecurityUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.core.DefaultParameterNameDiscoverer;
import org.springframework.expression.EvaluationContext;
import org.springframework.expression.Expression;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.lang.reflect.Method;
import java.util.UUID;

/**
 * Aspect tự động đánh chặn các phương thức có @Auditable để chụp ngữ cảnh và phát AuditLogEvent.
 */
@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class AuditableAspect {

    private final ApplicationEventPublisher eventPublisher;
    private final SpelExpressionParser spelParser = new SpelExpressionParser();
    private final DefaultParameterNameDiscoverer parameterNameDiscoverer = new DefaultParameterNameDiscoverer();

    @Around("@annotation(auditable)")
    public Object auditMethod(ProceedingJoinPoint joinPoint, Auditable auditable) throws Throwable {
        Object result = joinPoint.proceed();

        try {
            MethodSignature signature = (MethodSignature) joinPoint.getSignature();
            Method method = signature.getMethod();
            Object[] args = joinPoint.getArgs();

            String entityId = extractEntityId(auditable.entityIdExpression(), method, args, result);
            UUID actorUserId = SecurityUtils.getCurrentUserIdOptional().orElse(null);

            String ipAddress = null;
            String userAgent = null;

            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                ipAddress = extractClientIp(request);
                userAgent = request.getHeader("User-Agent");
            }

            AuditLogEvent event = AuditLogEvent.builder()
                    .actorUserId(actorUserId)
                    .action(auditable.action())
                    .entityType(auditable.entityType())
                    .entityId(entityId != null ? entityId : "UNKNOWN")
                    .ipAddress(ipAddress)
                    .userAgent(userAgent)
                    .newValue(result)
                    .description(auditable.description())
                    .build();

            eventPublisher.publishEvent(event);
        } catch (Exception e) {
            log.warn("Không thể chụp và phát sự kiện @Auditable: {}", e.getMessage());
        }

        return result;
    }

    private String extractEntityId(String expressionStr, Method method, Object[] args, Object result) {
        if (expressionStr == null || expressionStr.isBlank()) {
            return null;
        }

        try {
            EvaluationContext context = new StandardEvaluationContext();
            String[] paramNames = parameterNameDiscoverer.getParameterNames(method);
            if (paramNames != null) {
                for (int i = 0; i < paramNames.length; i++) {
                    context.setVariable(paramNames[i], args[i]);
                }
            }
            context.setVariable("result", result);

            Expression expression = spelParser.parseExpression(expressionStr);
            Object value = expression.getValue(context);
            return value != null ? value.toString() : null;
        } catch (Exception e) {
            log.debug("Không thể trích xuất entityId qua SpEL '{}': {}", expressionStr, e.getMessage());
            return null;
        }
    }

    private String extractClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            String[] ips = xForwardedFor.split(",");
            return ips[0].trim();
        }
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isBlank()) {
            return xRealIp.trim();
        }
        return request.getRemoteAddr();
    }
}

