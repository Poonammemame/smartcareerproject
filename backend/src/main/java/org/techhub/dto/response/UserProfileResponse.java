package org.techhub.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {

    private Integer profileId;

    private Integer userId;

    private String fullName;

    private String email;

    private String education;

    private String college;

    private Integer graduationYear;

    private String technicalSkills;

    private String interests;

    private String experienceLevel;

    private String careerGoal;

    private String assessmentStatus;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}