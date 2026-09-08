package org.techhub.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSettingsRequest {

    private boolean emailNotifications;

    private boolean assessmentNotifications;

    private boolean careerNotifications;

    private String theme;
}