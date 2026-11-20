package com.cyclosa.workplace.repository;

import com.cyclosa.workplace.entity.WorkplaceRoomBooking;
import com.cyclosa.workplace.enums.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface WorkplaceRoomBookingRepository extends JpaRepository<WorkplaceRoomBooking, UUID> {

    @Query("SELECT COUNT(b) > 0 FROM WorkplaceRoomBooking b " +
            "WHERE b.meetingRoom.id = :roomId " +
            "AND b.status <> :cancelledStatus " +
            "AND (:bookingId IS NULL OR b.id <> :bookingId) " +
            "AND (b.startTime < :endTime AND b.endTime > :startTime)")
    boolean existsTimeConflict(
            @Param("roomId") UUID roomId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("cancelledStatus") BookingStatus cancelledStatus,
            @Param("bookingId") UUID bookingId
    );

    List<WorkplaceRoomBooking> findByOrganizerEmployeeIdOrderByStartTimeDesc(UUID employeeId);

    Page<WorkplaceRoomBooking> findAllByOrderByStartTimeDesc(Pageable pageable);

    @Query(value = "SELECT b FROM WorkplaceRoomBooking b " +
            "WHERE (:roomId IS NULL OR b.meetingRoom.id = :roomId) " +
            "AND (cast(:startTime as timestamp) IS NULL OR b.startTime >= :startTime) " +
            "AND (cast(:endTime as timestamp) IS NULL OR b.endTime <= :endTime) " +
            "AND (:status IS NULL OR b.status = :status) " +
            "ORDER BY b.startTime DESC",
           countQuery = "SELECT COUNT(b) FROM WorkplaceRoomBooking b " +
            "WHERE (:roomId IS NULL OR b.meetingRoom.id = :roomId) " +
            "AND (cast(:startTime as timestamp) IS NULL OR b.startTime >= :startTime) " +
            "AND (cast(:endTime as timestamp) IS NULL OR b.endTime <= :endTime) " +
            "AND (:status IS NULL OR b.status = :status)")
    Page<WorkplaceRoomBooking> findRoomBookingsFiltered(
            @Param("roomId") UUID roomId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("status") BookingStatus status,
            Pageable pageable
    );
}
