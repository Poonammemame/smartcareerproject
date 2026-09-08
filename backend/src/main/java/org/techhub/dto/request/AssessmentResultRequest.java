package org.techhub.dto.request;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AssessmentResultRequest {

    private int totalQuestions;

    private int correctAnswers;

    private int wrongAnswers;

    private int unanswered;

    private BigDecimal percentage;

    private List<SubjectResultRequest> subjectResults;
}