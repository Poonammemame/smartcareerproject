package org.techhub.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CareerRequest {

    private String careerName;

    private String description;

    private String requiredSkills;
}