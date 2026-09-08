package org.techhub.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSettings {

    private int settingId;

    private int userId;

    private boolean emailNotifications;

    private boolean assessmentNotifications;

    private boolean careerNotifications;

    private String theme;
}