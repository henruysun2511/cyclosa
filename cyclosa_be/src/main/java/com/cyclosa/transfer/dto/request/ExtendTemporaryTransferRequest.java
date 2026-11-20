package com.cyclosa.transfer.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExtendTemporaryTransferRequest {

    @NotNull(message = "Ngày kết thúc mới không được để trống")
    private LocalDate newEndDate;

    @Size(max = 1000, message = "Lý do gia hạn tối đa 1000 ký tự")
    private String notes;
}
