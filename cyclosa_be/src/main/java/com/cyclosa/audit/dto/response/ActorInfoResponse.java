package com.cyclosa.audit.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Thông tin tác nhân thực hiện thao tác")
public class ActorInfoResponse {

    @Schema(description = "ID tài khoản người dùng")
    private UUID id;

    @Schema(description = "Họ và tên người thực hiện", example = "Lê Văn Cường")
    private String fullName;

    @Schema(description = "Email đăng nhập", example = "cuong.le@cyclosa.com")
    private String email;

    @Schema(description = "Đường dẫn ảnh đại diện")
    private String avatarUrl;

    @Schema(description = "Chức danh công việc", example = "Chuyên viên C&B")
    private String jobTitle;

    @Schema(description = "Phòng ban công tác", example = "Phòng Nhân sự")
    private String department;
}

