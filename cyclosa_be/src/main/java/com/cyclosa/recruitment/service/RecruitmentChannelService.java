package com.cyclosa.recruitment.service;

import com.cyclosa.common.exception.AppException;
import com.cyclosa.recruitment.dto.JobPostingDto;
import com.cyclosa.recruitment.dto.RecruitmentChannelDto;
import com.cyclosa.recruitment.entity.JobOpening;
import com.cyclosa.recruitment.entity.JobPosting;
import com.cyclosa.recruitment.entity.RecruitmentChannel;
import com.cyclosa.recruitment.enums.JobPostingStatus;
import com.cyclosa.recruitment.exception.RecruitmentErrorCode;
import com.cyclosa.recruitment.repository.JobOpeningRepository;
import com.cyclosa.recruitment.repository.JobPostingRepository;
import com.cyclosa.recruitment.repository.RecruitmentChannelRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecruitmentChannelService {

    private final RecruitmentChannelRepository channelRepository;
    private final JobPostingRepository postingRepository;
    private final JobOpeningRepository jobOpeningRepository;

    @Transactional(readOnly = true)
    public List<RecruitmentChannelDto.Response> listActiveChannels() {
        return channelRepository.findByIsActiveTrue().stream()
                .map(this::mapChannelToResponse)
                .toList();
    }

    @Transactional
    public RecruitmentChannelDto.Response createChannel(RecruitmentChannelDto.CreateRequest dto) {
        if (channelRepository.existsByChannelCode(dto.getCode())) {
            throw new AppException(RecruitmentErrorCode.RECRUITMENT_CHANNEL_CODE_DUPLICATED);
        }

        RecruitmentChannel channel = RecruitmentChannel.builder()
                .companyId(UUID.randomUUID())
                .name(dto.getName())
                .channelCode(dto.getCode().toUpperCase())
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .build();

        RecruitmentChannel saved = channelRepository.save(channel);
        return mapChannelToResponse(saved);
    }

    @Transactional
    public JobPostingDto.Response createJobPosting(JobPostingDto.CreateRequest dto) {
        JobOpening jobOpening = jobOpeningRepository.findById(dto.getJobOpeningId())
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.JOB_OPENING_NOT_FOUND));

        RecruitmentChannel channel = channelRepository.findById(dto.getChannelId())
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.RECRUITMENT_CHANNEL_NOT_FOUND));

        JobPosting posting = JobPosting.builder()
                .jobOpening(jobOpening)
                .channel(channel)
                .externalUrl(dto.getExternalPostingUrl())
                .postedAt(LocalDateTime.now())
                .expiresAt(dto.getExpiresAt())
                .status(JobPostingStatus.PUBLISHED)
                .build();

        JobPosting saved = postingRepository.save(posting);
        return mapPostingToResponse(saved, jobOpening.getTitle(), channel.getName());
    }

    @Transactional(readOnly = true)
    public List<JobPostingDto.Response> listPostingsByJobOpening(UUID jobOpeningId) {
        JobOpening jobOpening = jobOpeningRepository.findById(jobOpeningId)
                .orElseThrow(() -> new AppException(RecruitmentErrorCode.JOB_OPENING_NOT_FOUND));

        return postingRepository.findByJobOpening_Id(jobOpeningId).stream()
                .map(p -> mapPostingToResponse(p, jobOpening.getTitle(), p.getChannel() != null ? p.getChannel().getName() : ""))
                .toList();
    }

    private RecruitmentChannelDto.Response mapChannelToResponse(RecruitmentChannel entity) {
        return RecruitmentChannelDto.Response.builder()
                .id(entity.getId())
                .name(entity.getName())
                .code(entity.getChannelCode())
                .channelType("ONLINE")
                .websiteUrl(null)
                .isActive(entity.getIsActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    private JobPostingDto.Response mapPostingToResponse(JobPosting entity, String jobTitle, String channelName) {
        return JobPostingDto.Response.builder()
                .id(entity.getId())
                .jobOpeningId(entity.getJobOpening() != null ? entity.getJobOpening().getId() : null)
                .jobOpeningTitle(jobTitle)
                .channelId(entity.getChannel() != null ? entity.getChannel().getId() : null)
                .channelName(channelName)
                .externalPostingUrl(entity.getExternalUrl())
                .postedAt(entity.getPostedAt())
                .expiresAt(entity.getExpiresAt())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
