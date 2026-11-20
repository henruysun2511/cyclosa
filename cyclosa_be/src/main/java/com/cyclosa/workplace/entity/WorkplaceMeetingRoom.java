package com.cyclosa.workplace.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "workplace_meeting_rooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkplaceMeetingRoom {

    @Id
    @Column(name = "floor_object_id")
    private UUID floorObjectId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "floor_object_id")
    private WorkplaceFloorObject floorObject;

    @Column(name = "capacity", nullable = false)
    @Builder.Default
    private Integer capacity = 6;

    @Column(name = "max_capacity_ceiling", nullable = false)
    @Builder.Default
    private Integer maxCapacityCeiling = 30;

    @Column(name = "has_projector", nullable = false)
    @Builder.Default
    private Boolean hasProjector = false;

    @Column(name = "has_video_conference", nullable = false)
    @Builder.Default
    private Boolean hasVideoConference = false;

    @Column(name = "has_whiteboard", nullable = false)
    @Builder.Default
    private Boolean hasWhiteboard = true;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
}
