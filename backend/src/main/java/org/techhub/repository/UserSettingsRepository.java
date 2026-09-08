package org.techhub.repository;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.techhub.constants.UserSettingsConstants;
import org.techhub.model.UserSettings;

@Repository
public class UserSettingsRepository {

    private final JdbcTemplate jdbcTemplate;

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public UserSettingsRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // =========================================================
    // FIND USER ID BY EMAIL
    // =========================================================

    public Integer findUserIdByEmail(String email) {

        if (email == null || email.trim().isEmpty()) {
            return null;
        }

        try {

            return jdbcTemplate.queryForObject(
                    UserSettingsConstants.FIND_USER_ID_BY_EMAIL,
                    Integer.class,
                    email.trim()
            );

        } catch (EmptyResultDataAccessException e) {

            return null;
        }
    }

    // =========================================================
    // GET USER DETAILS
    // =========================================================

    public UserSettingsResponseData getUserDetails(String email) {

        if (email == null || email.trim().isEmpty()) {
            return null;
        }

        try {

            return jdbcTemplate.queryForObject(

                    UserSettingsConstants.GET_USER_DETAILS,

                    (rs, rowNum) -> {

                        UserSettingsResponseData data =
                                new UserSettingsResponseData();

                        data.setUserId(
                                rs.getInt("user_id")
                        );

                        data.setName(
                                rs.getString("name")
                        );

                        data.setEmail(
                                rs.getString("email")
                        );

                        return data;
                    },

                    email.trim()
            );

        } catch (EmptyResultDataAccessException e) {

            return null;
        }
    }

    // =========================================================
    // GET SETTINGS
    // =========================================================

    public UserSettings getSettings(int userId) {

        try {

            return jdbcTemplate.queryForObject(

                    UserSettingsConstants.GET_SETTINGS,

                    (rs, rowNum) -> {

                        UserSettings settings =
                                new UserSettings();

                        settings.setSettingId(
                                rs.getInt("setting_id")
                        );

                        settings.setUserId(
                                rs.getInt("user_id")
                        );

                        settings.setEmailNotifications(
                                rs.getBoolean(
                                        "email_notifications"
                                )
                        );

                        settings.setAssessmentNotifications(
                                rs.getBoolean(
                                        "assessment_notifications"
                                )
                        );

                        settings.setCareerNotifications(
                                rs.getBoolean(
                                        "career_notifications"
                                )
                        );

                        settings.setTheme(
                                rs.getString("theme")
                        );

                        return settings;
                    },

                    userId
            );

        } catch (EmptyResultDataAccessException e) {

            return null;
        }
    }

    // =========================================================
    // CHECK SETTINGS EXIST
    // =========================================================

    public boolean settingsExist(int userId) {

        Integer count =
                jdbcTemplate.queryForObject(

                        UserSettingsConstants
                                .CHECK_SETTINGS_EXIST,

                        Integer.class,

                        userId
                );

        return count != null && count > 0;
    }

    // =========================================================
    // INSERT SETTINGS
    // =========================================================

    public int insertSettings(
            int userId,
            boolean emailNotifications,
            boolean assessmentNotifications,
            boolean careerNotifications,
            String theme) {

        return jdbcTemplate.update(

                UserSettingsConstants.INSERT_SETTINGS,

                userId,
                emailNotifications,
                assessmentNotifications,
                careerNotifications,
                theme
        );
    }

    // =========================================================
    // UPDATE SETTINGS
    // =========================================================

    public int updateSettings(
            int userId,
            boolean emailNotifications,
            boolean assessmentNotifications,
            boolean careerNotifications,
            String theme) {

        return jdbcTemplate.update(

                UserSettingsConstants.UPDATE_SETTINGS,

                emailNotifications,
                assessmentNotifications,
                careerNotifications,
                theme,
                userId
        );
    }

    // =========================================================
    // GET PASSWORD
    // =========================================================

    public String getPasswordByUserId(int userId) {

        try {

            return jdbcTemplate.queryForObject(

                    UserSettingsConstants
                            .GET_PASSWORD_BY_USER_ID,

                    String.class,

                    userId
            );

        } catch (EmptyResultDataAccessException e) {

            return null;
        }
    }

    // =========================================================
    // UPDATE PASSWORD
    // =========================================================

    public int updatePassword(
            int userId,
            String encodedPassword) {

        return jdbcTemplate.update(

                UserSettingsConstants.UPDATE_PASSWORD,

                encodedPassword,
                userId
        );
    }

    // =========================================================
    // CHECK EMAIL EXISTS
    // =========================================================

    public boolean emailExists(
            String email,
            int currentUserId) {

        Integer count =
                jdbcTemplate.queryForObject(

                        UserSettingsConstants
                                .CHECK_EMAIL_EXISTS,

                        Integer.class,

                        email,
                        currentUserId
                );

        return count != null && count > 0;
    }

    // =========================================================
    // UPDATE EMAIL
    // =========================================================

    public int updateEmail(
            int userId,
            String newEmail) {

        return jdbcTemplate.update(

                UserSettingsConstants.UPDATE_EMAIL,

                newEmail,
                userId
        );
    }

    // =========================================================
    // USER RESPONSE DATA
    // =========================================================

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserSettingsResponseData {

        private int userId;

        private String name;

        private String email;
    }
}