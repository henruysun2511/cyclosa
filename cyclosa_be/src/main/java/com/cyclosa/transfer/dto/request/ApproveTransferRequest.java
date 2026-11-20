package com.cyclosa.transfer.dto.request;

import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApproveTransferRequest {

    @Size(max = 1000, message = "Ý kiến phê duyệt tối đa 1000 ký tự")
    private String notes;
}
