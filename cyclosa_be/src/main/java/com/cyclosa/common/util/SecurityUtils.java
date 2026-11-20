package com.cyclosa.common.util;

import com.cyclosa.common.exception.AppException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Optional;
import java.util.UUID;

public final class SecurityUtils {

    private SecurityUtils() {}

    public static UUID currentUserId(Authentication auth) {
        if (auth == null || auth.getDetails() == null) {
            throw AppException.unauthorized();
        }
        try {
            return UUID.fromString(auth.getDetails().toString());
        } catch (IllegalArgumentException e) {
            throw AppException.unauthorized();
        }
    }

    public static Optional<UUID> getCurrentUserIdOptional() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getDetails() == null) {
            return Optional.empty();
        }
        try {
            return Optional.of(UUID.fromString(auth.getDetails().toString()));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public static UUID getCurrentUserId() {
        return getCurrentUserIdOptional()
                .orElseThrow(AppException::unauthorized);
    }

    public static Optional<UUID> getCurrentUserCompanyIdOptional() {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                String compHeader = request.getHeader("X-Company-Id");
                if (compHeader != null && !compHeader.isBlank()) {
                    return Optional.of(UUID.fromString(compHeader.trim()));
                }
            }
        } catch (Exception ignored) {
        }
        return Optional.empty();
    }

    public static final UUID DEFAULT_COMPANY_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");

    public static UUID getCurrentUserCompanyId() {
        return getCurrentUserCompanyIdOptional().orElse(DEFAULT_COMPANY_ID);
    }
}
