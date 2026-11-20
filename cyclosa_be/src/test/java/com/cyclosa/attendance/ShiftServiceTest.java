package com.cyclosa.attendance;

import com.cyclosa.attendance.dto.request.CreateShiftRequest;
import com.cyclosa.attendance.dto.response.ShiftResponse;
import com.cyclosa.attendance.entity.Shift;
import com.cyclosa.attendance.exception.AttendanceErrorCode;
import com.cyclosa.attendance.mapper.AttendanceMapper;
import com.cyclosa.attendance.repository.ShiftAssignmentRepository;
import com.cyclosa.attendance.repository.ShiftRepository;
import com.cyclosa.attendance.service.ShiftService;
import com.cyclosa.common.exception.AppException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.lang.reflect.Proxy;
import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.function.Function;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ShiftServiceTest {

    private final UUID companyId = UUID.randomUUID();
    private final UUID shiftId = UUID.randomUUID();

    @SuppressWarnings("unchecked")
    private <T> T createStub(Class<T> type, Map<String, Object> methods) {
        return (T) Proxy.newProxyInstance(type.getClassLoader(), new Class<?>[]{type}, (proxy, method, args) -> {
            if ("equals".equals(method.getName())) return proxy == args[0];
            if ("hashCode".equals(method.getName())) return System.identityHashCode(proxy);
            if ("toString".equals(method.getName())) return type.getSimpleName() + "Stub";
            if (methods != null && methods.containsKey(method.getName())) {
                Object val = methods.get(method.getName());
                if (val instanceof Function) {
                    return ((Function<Object[], Object>) val).apply(args);
                }
                return val;
            }
            if (method.getReturnType().equals(Optional.class)) return Optional.empty();
            if (method.getReturnType().equals(List.class)) return Collections.emptyList();
            if (method.getReturnType().equals(boolean.class)) return false;
            return null;
        });
    }

    @BeforeEach
    void setUp() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("X-Company-Id", companyId.toString());
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));
    }

    @AfterEach
    void tearDown() {
        RequestContextHolder.resetRequestAttributes();
    }

    @Test
    @DisplayName("Tạo mới ca làm việc thành công khi mã ca chưa tồn tại")
    void createShift_Success() {
        CreateShiftRequest req = new CreateShiftRequest();
        req.setCode("hc_01");
        req.setName("Ca hành chính");
        req.setStartTime(LocalTime.of(8, 0));
        req.setEndTime(LocalTime.of(17, 0));
        req.setWorkCredit(BigDecimal.ONE);

        Shift shift = Shift.builder()
                .code("HC_01")
                .name("Ca hành chính")
                .startTime(LocalTime.of(8, 0))
                .endTime(LocalTime.of(17, 0))
                .workCredit(BigDecimal.ONE)
                .build();
        shift.setId(shiftId);

        ShiftResponse shiftResp = ShiftResponse.builder()
                .id(shiftId)
                .code("HC_01")
                .name("Ca hành chính")
                .build();

        ShiftRepository shiftRepo = createStub(ShiftRepository.class, Map.of(
                "existsByCompanyIdAndCodeIgnoreCase", false,
                "save", shift
        ));
        ShiftAssignmentRepository saRepo = createStub(ShiftAssignmentRepository.class, Collections.emptyMap());
        AttendanceMapper mapper = createStub(AttendanceMapper.class, Map.of(
                "toEntity", shift,
                "toResponse", shiftResp
        ));

        ShiftService service = new ShiftService(shiftRepo, saRepo, mapper);

        ShiftResponse response = service.createShift(req);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(shiftId);
        assertThat(response.getCode()).isEqualTo("HC_01");
    }

    @Test
    @DisplayName("Ném lỗi khi tạo ca làm việc với mã đã tồn tại")
    void createShift_CodeDuplicated_ThrowsException() {
        CreateShiftRequest req = new CreateShiftRequest();
        req.setCode("HC_01");
        req.setName("Ca trùng");

        ShiftRepository shiftRepo = createStub(ShiftRepository.class, Map.of(
                "existsByCompanyIdAndCodeIgnoreCase", true
        ));
        ShiftAssignmentRepository saRepo = createStub(ShiftAssignmentRepository.class, Collections.emptyMap());
        AttendanceMapper mapper = createStub(AttendanceMapper.class, Collections.emptyMap());

        ShiftService service = new ShiftService(shiftRepo, saRepo, mapper);

        assertThatThrownBy(() -> service.createShift(req))
                .isInstanceOf(AppException.class)
                .hasFieldOrPropertyWithValue("errorCode", AttendanceErrorCode.SHIFT_CODE_DUPLICATED);
    }

    @Test
    @DisplayName("Ném lỗi không thể xóa ca làm việc khi đã có phân ca cho nhân viên")
    void deleteShift_Assigned_ThrowsException() {
        Shift shift = Shift.builder().code("HC_01").build();

        ShiftRepository shiftRepo = createStub(ShiftRepository.class, Map.of(
                "findByIdAndCompanyId", Optional.of(shift)
        ));
        ShiftAssignmentRepository saRepo = createStub(ShiftAssignmentRepository.class, Map.of(
                "existsByShiftId", true
        ));
        AttendanceMapper mapper = createStub(AttendanceMapper.class, Collections.emptyMap());

        ShiftService service = new ShiftService(shiftRepo, saRepo, mapper);

        assertThatThrownBy(() -> service.deleteShift(shiftId))
                .isInstanceOf(AppException.class)
                .hasFieldOrPropertyWithValue("errorCode", AttendanceErrorCode.CANNOT_DELETE_ASSIGNED_SHIFT);
    }

    @Test
    @DisplayName("Kích hoạt hoặc ngừng sử dụng ca làm việc thành công")
    void activateShift_Success() {
        Shift shift = Shift.builder().code("HC_01").isActive(false).build();
        AtomicBoolean saved = new AtomicBoolean(false);

        ShiftRepository shiftRepo = createStub(ShiftRepository.class, Map.of(
                "findByIdAndCompanyId", Optional.of(shift),
                "save", (Function<Object[], Object>) (args) -> {
                    saved.set(true);
                    return args[0];
                }
        ));
        ShiftAssignmentRepository saRepo = createStub(ShiftAssignmentRepository.class, Collections.emptyMap());
        AttendanceMapper mapper = createStub(AttendanceMapper.class, Collections.emptyMap());

        ShiftService service = new ShiftService(shiftRepo, saRepo, mapper);

        service.activateShift(shiftId, true);

        assertThat(shift.getIsActive()).isTrue();
        assertThat(saved.get()).isTrue();
    }
}
