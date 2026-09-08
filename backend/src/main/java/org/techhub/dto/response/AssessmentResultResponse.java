package org.techhub.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AssessmentResultResponse {

    private int resultId;

    private int userId;

    private String userName;

    private String email;

    private int totalQuestions;

    private int correctAnswers;

    private int wrongAnswers;

    private int unanswered;

    private BigDecimal percentage;

    private LocalDateTime completedAt;
}