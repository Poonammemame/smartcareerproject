package org.techhub.dto.request;

import java.math.BigDecimal;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SubjectResultRequest {

    private String subject;

    private int totalQuestions;

    private int correctAnswers;

    private int wrongAnswers;

    private int unanswered;

    private BigDecimal percentage;
}