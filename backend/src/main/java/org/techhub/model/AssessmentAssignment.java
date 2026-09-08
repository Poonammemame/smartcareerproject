package org.techhub.model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentAssignment {

    private int assignmentId;
    private int userId;
    private String status;
    private LocalDateTime assignedAt;
}