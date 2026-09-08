package org.techhub.dto.request;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationRequest {

    private Integer userId;

    private Integer careerId;

    private BigDecimal matchPercentage;

    private String reason;
}