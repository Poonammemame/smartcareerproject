package org.techhub.model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {

    private Integer profileId;

    private Integer userId;

    private String education;

    private String college;

    private Integer graduationYear;

    private String technicalSkills;

    private String interests;

    private String experienceLevel;

    private String careerGoal;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}