package org.techhub.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CareerResponse {

    private Integer careerId;

    private String careerName;

    private String description;

    private String requiredSkills;

    private LocalDateTime createdAt;
}