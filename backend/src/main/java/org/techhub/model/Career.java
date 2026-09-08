package org.techhub.model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Career {

    private Integer careerId;

    private String careerName;

    private String description;

    private String requiredSkills;

    private LocalDateTime createdAt;
}