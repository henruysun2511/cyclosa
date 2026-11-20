package com.cyclosa.recruitment.repository;

import com.cyclosa.recruitment.entity.RecruitmentChannel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RecruitmentChannelRepository extends JpaRepository<RecruitmentChannel, UUID> {

    Optional<RecruitmentChannel> findByChannelCode(String channelCode);

    boolean existsByCompanyIdAndChannelCode(UUID companyId, String channelCode);

    boolean existsByChannelCode(String channelCode);

    List<RecruitmentChannel> findByIsActiveTrue();
}
