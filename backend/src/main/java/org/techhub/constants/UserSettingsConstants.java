package org.techhub.constants;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class UserSettingsConstants {

    // =========================================================
    // API
    // =========================================================

    public static final String SETTINGS_API =
            "/settings";


    // =========================================================
    // DEFAULT SETTINGS
    // =========================================================

    public static final boolean DEFAULT_EMAIL_NOTIFICATIONS = true;

    public static final boolean DEFAULT_ASSESSMENT_NOTIFICATIONS = true;

    public static final boolean DEFAULT_CAREER_NOTIFICATIONS = true;

    public static final String DEFAULT_THEME = "light";


    // =========================================================
    // THEMES
    // =========================================================

    public static final String THEME_LIGHT = "light";

    public static final String THEME_DARK = "dark";

    public static final String THEME_SYSTEM = "system";


    // =========================================================
    // VALIDATION
    // =========================================================

    public static final int MIN_PASSWORD_LENGTH = 6;

    public static final String EMAIL_REGEX =
            "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";


    // =========================================================
    // SUCCESS MESSAGES
    // =========================================================

    public static final String SETTINGS_UPDATED =
            "Settings updated successfully";

    public static final String EMAIL_UPDATED =
            "Email updated successfully. Please login again.";

    public static final String PASSWORD_UPDATED =
            "Password changed successfully. Please login again.";


    // =========================================================
    // ERROR MESSAGES
    // =========================================================

    public static final String USER_NOT_FOUND =
            "User not found";

    public static final String INVALID_SETTINGS =
            "Invalid settings data";

    public static final String INVALID_THEME =
            "Invalid theme";

    public static final String EMAIL_EMPTY =
            "Email cannot be empty";

    public static final String INVALID_EMAIL =
            "Invalid email address";

    public static final String EMAIL_ALREADY_REGISTERED =
            "Email is already registered";

    public static final String EMAIL_UPDATE_FAILED =
            "Failed to update email";

    public static final String PASSWORD_FIELDS_REQUIRED =
            "All password fields are required";

    public static final String PASSWORD_MISMATCH =
            "New password and confirm password do not match";

    public static final String PASSWORD_TOO_SHORT =
            "Password must contain at least 6 characters";

    public static final String CURRENT_PASSWORD_INCORRECT =
            "Current password is incorrect";

    public static final String PASSWORD_SAME =
            "New password must be different from current password";

    public static final String PASSWORD_UPDATE_FAILED =
            "Failed to change password";


    // =========================================================
    // SQL QUERIES
    // =========================================================

    public static final String FIND_USER_ID_BY_EMAIL =
            "SELECT user_id " +
            "FROM users " +
            "WHERE email = ?";


    public static final String GET_USER_DETAILS =
            "SELECT user_id, name, email " +
            "FROM users " +
            "WHERE email = ?";


    public static final String GET_SETTINGS =
            "SELECT setting_id, user_id, " +
            "email_notifications, " +
            "assessment_notifications, " +
            "career_notifications, " +
            "theme " +
            "FROM user_settings " +
            "WHERE user_id = ?";


    public static final String CHECK_SETTINGS_EXIST =
            "SELECT COUNT(*) " +
            "FROM user_settings " +
            "WHERE user_id = ?";


    public static final String INSERT_SETTINGS =
            "INSERT INTO user_settings " +
            "(user_id, email_notifications, " +
            "assessment_notifications, " +
            "career_notifications, theme) " +
            "VALUES (?, ?, ?, ?, ?)";


    public static final String UPDATE_SETTINGS =
            "UPDATE user_settings SET " +
            "email_notifications = ?, " +
            "assessment_notifications = ?, " +
            "career_notifications = ?, " +
            "theme = ? " +
            "WHERE user_id = ?";


    public static final String GET_PASSWORD_BY_USER_ID =
            "SELECT password " +
            "FROM users " +
            "WHERE user_id = ?";


    public static final String UPDATE_PASSWORD =
            "UPDATE users " +
            "SET password = ? " +
            "WHERE user_id = ?";


    public static final String CHECK_EMAIL_EXISTS =
            "SELECT COUNT(*) " +
            "FROM users " +
            "WHERE email = ? " +
            "AND user_id <> ?";


    public static final String UPDATE_EMAIL =
            "UPDATE users " +
            "SET email = ? " +
            "WHERE user_id = ?";
}