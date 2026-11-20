package com.cyclosa.reward.mapper;

import com.cyclosa.reward.dto.request.CreateDisciplineCaseRequest;
import com.cyclosa.reward.dto.request.UpdateDisciplineCaseRequest;
import com.cyclosa.reward.dto.response.DisciplineCaseResponse;
import com.cyclosa.reward.dto.response.DisciplineEvidenceResponse;
import com.cyclosa.reward.dto.response.DisciplineParticipantResponse;
import com.cyclosa.reward.entity.DisciplineCase;
import com.cyclosa.reward.entity.DisciplineEvidence;
import com.cyclosa.reward.entity.DisciplineParticipant;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface DisciplineCaseMapper {

    @Mapping(target = "employee", ignore = true)
    @Mapping(target = "status", constant = "DRAFT")
    @Mapping(target = "participants", ignore = true)
    @Mapping(target = "evidences", ignore = true)
    DisciplineCase toEntity(CreateDisciplineCaseRequest request);

    @Mapping(target = "employee", ignore = true)
    @Mapping(target = "decidedByEmployee", ignore = true)
    @Mapping(target = "participants", ignore = true)
    @Mapping(target = "evidences", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(UpdateDisciplineCaseRequest request, @MappingTarget DisciplineCase entity);

    @Mapping(target = "employeeId", source = "employee.id")
    @Mapping(target = "employeeName", source = "employee.fullName")
    @Mapping(target = "employeeCode", source = "employee.employeeCode")
    @Mapping(target = "departmentName", ignore = true)
    @Mapping(target = "decidedByEmployeeId", source = "decidedByEmployee.id")
    @Mapping(target = "decidedByEmployeeName", source = "decidedByEmployee.fullName")
    DisciplineCaseResponse toResponse(DisciplineCase entity);

    List<DisciplineCaseResponse> toResponseList(List<DisciplineCase> entities);

    @Mapping(target = "employeeId", source = "employee.id")
    @Mapping(target = "employeeName", source = "employee.fullName")
    @Mapping(target = "employeeCode", source = "employee.employeeCode")
    @Mapping(target = "departmentName", ignore = true)
    DisciplineParticipantResponse toParticipantResponse(DisciplineParticipant entity);

    List<DisciplineParticipantResponse> toParticipantResponseList(List<DisciplineParticipant> entities);

    DisciplineEvidenceResponse toEvidenceResponse(DisciplineEvidence entity);

    List<DisciplineEvidenceResponse> toEvidenceResponseList(List<DisciplineEvidence> entities);
}
