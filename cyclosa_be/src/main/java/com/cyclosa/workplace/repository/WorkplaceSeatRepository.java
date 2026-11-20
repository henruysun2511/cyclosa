package com.cyclosa.workplace.repository;

import com.cyclosa.workplace.entity.WorkplaceSeat;
import com.cyclosa.workplace.enums.SeatStatus;
import com.cyclosa.workplace.enums.SeatType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WorkplaceSeatRepository extends JpaRepository<WorkplaceSeat, UUID> {
    Optional<WorkplaceSeat> findBySeatCode(String seatCode);
    Optional<WorkplaceSeat> findByQrToken(String qrToken);
    boolean existsBySeatCode(String seatCode);
    boolean existsByQrToken(String qrToken);

    @Query("SELECT s FROM WorkplaceSeat s " +
            "JOIN s.seatRow r " +
            "JOIN r.zone z " +
            "WHERE z.floor.id = :floorId")
    List<WorkplaceSeat> findByFloorId(@Param("floorId") UUID floorId);

    @Query("SELECT s FROM WorkplaceSeat s " +
            "JOIN s.seatRow r " +
            "JOIN r.zone z " +
            "WHERE (:floorId IS NULL OR z.floor.id = :floorId) " +
            "AND (:zoneId IS NULL OR z.id = :zoneId) " +
            "AND (:seatType IS NULL OR s.seatType = :seatType) " +
            "AND (:status IS NULL OR s.status = :status)")
    Page<WorkplaceSeat> findSeatsFiltered(
            @Param("floorId") UUID floorId,
            @Param("zoneId") UUID zoneId,
            @Param("seatType") SeatType seatType,
            @Param("status") SeatStatus status,
            Pageable pageable
    );
}
