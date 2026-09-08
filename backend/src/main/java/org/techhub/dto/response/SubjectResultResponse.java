package org.techhub.dto.response;

import java.math.BigDecimal;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SubjectResultResponse {

    private int subjectResultId;

    private int resultId;

    private String subject;

    private int totalQuestions;

    private int correctAnswers;

    private int wrongAnswers;

    private int unanswered;

    private BigDecimal percentage;
}