package org.techhub.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationResponse {

    private Integer recommendationId;

    private Integer userId;

    private String userName;

    private Integer careerId;

    private String careerName;

    private String description;

    private String requiredSkills;

    private BigDecimal matchPercentage;

    private String reason;

    private LocalDateTime recommendedAt;
}