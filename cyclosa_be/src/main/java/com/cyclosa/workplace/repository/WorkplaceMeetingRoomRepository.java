package com.cyclosa.workplace.repository;

import com.cyclosa.workplace.entity.WorkplaceMeetingRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface WorkplaceMeetingRoomRepository extends JpaRepository<WorkplaceMeetingRoom, UUID> {
}
