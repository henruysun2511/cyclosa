package com.cyclosa.career.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Dữ liệu đồ thị mạng thăng tiến đa chiều")
public class CareerGraphResponse {

    private List<Node> nodes;
    private List<Edge> edges;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Node {
        private String id;
        private String label;
        private String code;
        private boolean isCurrent;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Edge {
        private String id;
        private String source;
        private String target;
        private BigDecimal minYears;
        private String requirements;
    }
}
