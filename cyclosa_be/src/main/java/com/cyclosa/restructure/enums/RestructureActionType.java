package com.cyclosa.restructure.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum RestructureActionType {
    CREATE_DEPT("Thành lập phòng ban mới"),
    RENAME_DEPT("Đổi tên / đổi mã phòng ban"),
    MOVE_DEPT("Di chuyển vị trí phân cấp (Re-parenting)"),
    MERGE_DEPTS("Sáp nhập phòng ban"),
    SPLIT_DEPT("Chia tách phòng ban"),
    DISSOLVE_DEPT("Giải thể phòng ban"),
    REASSIGN_EMP("Điều chuyển nhân sự"),
    REASSIGN_MANAGER("Bổ nhiệm / Thay đổi Trưởng bộ phận");

    private final String description;
}
