package com.cyclosa.workplace.repository;

import com.cyclosa.workplace.entity.WorkplaceDeskBooking;
import com.cyclosa.workplace.enums.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WorkplaceDeskBookingRepository extends JpaRepository<WorkplaceDeskBooking, UUID> {
    Optional<WorkplaceDeskBooking> findBySeatIdAndBookingDateAndStatusNot(UUID seatId, LocalDate bookingDate, BookingStatus status);
    Optional<WorkplaceDeskBooking> findByEmployeeIdAndBookingDateAndStatusNot(UUID employeeId, LocalDate bookingDate, BookingStatus status);

    boolean existsBySeatIdAndBookingDateAndStatusNot(UUID seatId, LocalDate bookingDate, BookingStatus status);
    boolean existsByEmployeeIdAndBookingDateAndStatusNot(UUID employeeId, LocalDate bookingDate, BookingStatus status);

    List<WorkplaceDeskBooking> findByEmployeeIdOrderByBookingDateDesc(UUID employeeId);

    Page<WorkplaceDeskBooking> findAllByOrderByBookingDateDesc(Pageable pageable);

    @Query("SELECT b FROM WorkplaceDeskBooking b " +
            "JOIN b.seat s " +
            "JOIN s.seatRow r " +
            "JOIN r.zone z " +
            "WHERE (:bookingDate IS NULL OR b.bookingDate = :bookingDate) " +
            "AND (:floorId IS NULL OR z.floor.id = :floorId) " +
            "AND (:employeeId IS NULL OR b.employee.id = :employeeId) " +
            "AND (:status IS NULL OR b.status = :status)")
    Page<WorkplaceDeskBooking> findBookingsFiltered(
            @Param("bookingDate") LocalDate bookingDate,
            @Param("floorId") UUID floorId,
            @Param("employeeId") UUID employeeId,
            @Param("status") BookingStatus status,
            Pageable pageable
    );
}
