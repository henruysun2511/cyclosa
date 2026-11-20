package com.cyclosa.workplace.entity;

import com.cyclosa.auth.entity.User;
import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.employee.entity.Employee;
import com.cyclosa.workplace.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "workplace_room_bookings", indexes = {
        @Index(name = "idx_workplace_room_book_room_time", columnList = "meeting_room_id, start_time, end_time"),
        @Index(name = "idx_workplace_room_book_organizer", columnList = "organizer_employee_id"),
        @Index(name = "idx_workplace_room_book_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkplaceRoomBooking extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meeting_room_id", nullable = false)
    private WorkplaceFloorObject meetingRoom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_employee_id", nullable = false)
    private Employee organizerEmployee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_user_id", nullable = false)
    private User createdByUser;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "attendee_count", nullable = false)
    @Builder.Default
    private Integer attendeeCount = 1;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private BookingStatus status = BookingStatus.CONFIRMED;

    @Column(name = "checked_in_at")
    private LocalDateTime checkedInAt;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
}
