package org.techhub.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSettingsResponse {

    private int userId;

    private String name;

    private String email;

    private boolean emailNotifications;

    private boolean assessmentNotifications;

    private boolean careerNotifications;

    private String theme;
}