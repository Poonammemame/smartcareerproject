package org.techhub.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.techhub.constants.UserSettingsConstants;
import org.techhub.dto.request.ChangePasswordRequest;
import org.techhub.dto.request.UpdateEmailRequest;
import org.techhub.dto.request.UserSettingsRequest;
import org.techhub.dto.response.UserSettingsResponse;
import org.techhub.model.UserSettings;
import org.techhub.repository.UserSettingsRepository;

@Service
public class UserSettingsService {

    private final UserSettingsRepository repository;

    private final PasswordEncoder passwordEncoder;

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public UserSettingsService(
            UserSettingsRepository repository,
            PasswordEncoder passwordEncoder) {

        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    // =========================================================
    // GET SETTINGS
    // =========================================================

    public UserSettingsResponse getSettings(String email) {

        if (email == null || email.trim().isEmpty()) {

            throw new RuntimeException(
                    UserSettingsConstants.USER_NOT_FOUND
            );
        }

        UserSettingsRepository.UserSettingsResponseData user =
                repository.getUserDetails(email);

        // IMPORTANT
        // JWT email must exist in database.

        if (user == null) {

            throw new RuntimeException(
                    UserSettingsConstants.USER_NOT_FOUND
            );
        }

        int userId = user.getUserId();

        UserSettings settings =
                repository.getSettings(userId);

        // =====================================================
        // CREATE DEFAULT SETTINGS IF NOT PRESENT
        // =====================================================

        if (settings == null) {

            repository.insertSettings(
                    userId,

                    UserSettingsConstants
                            .DEFAULT_EMAIL_NOTIFICATIONS,

                    UserSettingsConstants
                            .DEFAULT_ASSESSMENT_NOTIFICATIONS,

                    UserSettingsConstants
                            .DEFAULT_CAREER_NOTIFICATIONS,

                    UserSettingsConstants
                            .DEFAULT_THEME
            );

            settings =
                    repository.getSettings(userId);
        }

        if (settings == null) {

            throw new RuntimeException(
                    UserSettingsConstants.INVALID_SETTINGS
            );
        }

        // =====================================================
        // RESPONSE
        // =====================================================

        UserSettingsResponse response =
                new UserSettingsResponse();

        response.setUserId(userId);

        response.setName(
                user.getName()
        );

        response.setEmail(
                user.getEmail()
        );

        response.setEmailNotifications(
                settings.isEmailNotifications()
        );

        response.setAssessmentNotifications(
                settings.isAssessmentNotifications()
        );

        response.setCareerNotifications(
                settings.isCareerNotifications()
        );

        response.setTheme(
                settings.getTheme()
        );

        return response;
    }

    // =========================================================
    // SAVE SETTINGS
    // =========================================================

    public void saveSettings(
            String email,
            UserSettingsRequest request) {

        if (request == null) {

            throw new RuntimeException(
                    UserSettingsConstants.INVALID_SETTINGS
            );
        }

        Integer userId =
                repository.findUserIdByEmail(email);

        if (userId == null) {

            throw new RuntimeException(
                    UserSettingsConstants.USER_NOT_FOUND
            );
        }

        String theme =
                request.getTheme();

        // =====================================================
        // DEFAULT THEME
        // =====================================================

        if (theme == null ||
                theme.trim().isEmpty()) {

            theme =
                    UserSettingsConstants.DEFAULT_THEME;
        }

        theme =
                theme.trim().toLowerCase();

        // =====================================================
        // VALIDATE THEME
        // =====================================================

        if (!theme.equals(
                UserSettingsConstants.THEME_LIGHT)

                &&

                !theme.equals(
                        UserSettingsConstants.THEME_DARK)

                &&

                !theme.equals(
                        UserSettingsConstants.THEME_SYSTEM)) {

            throw new RuntimeException(
                    UserSettingsConstants.INVALID_THEME
            );
        }

        // =====================================================
        // SAVE
        // =====================================================

        if (repository.settingsExist(userId)) {

            repository.updateSettings(

                    userId,

                    request.isEmailNotifications(),

                    request.isAssessmentNotifications(),

                    request.isCareerNotifications(),

                    theme
            );

        } else {

            repository.insertSettings(

                    userId,

                    request.isEmailNotifications(),

                    request.isAssessmentNotifications(),

                    request.isCareerNotifications(),

                    theme
            );
        }
    }

    // =========================================================
    // UPDATE EMAIL
    // =========================================================

    public void updateEmail(
            String currentEmail,
            UpdateEmailRequest request) {

        if (request == null ||
                request.getNewEmail() == null ||
                request.getNewEmail().trim().isEmpty()) {

            throw new RuntimeException(
                    UserSettingsConstants.EMAIL_EMPTY
            );
        }

        String newEmail =
                request.getNewEmail()
                        .trim()
                        .toLowerCase();

        // =====================================================
        // VALIDATE EMAIL
        // =====================================================

        if (!newEmail.matches(
                UserSettingsConstants.EMAIL_REGEX)) {

            throw new RuntimeException(
                    UserSettingsConstants.INVALID_EMAIL
            );
        }

        // =====================================================
        // FIND CURRENT USER
        // =====================================================

        Integer userId =
                repository.findUserIdByEmail(
                        currentEmail
                );

        if (userId == null) {

            throw new RuntimeException(
                    UserSettingsConstants.USER_NOT_FOUND
            );
        }

        // =====================================================
        // SAME EMAIL
        // =====================================================

        if (newEmail.equalsIgnoreCase(
                currentEmail)) {

            throw new RuntimeException(
                    "New email is same as current email"
            );
        }

        // =====================================================
        // CHECK DUPLICATE
        // =====================================================

        if (repository.emailExists(
                newEmail,
                userId)) {

            throw new RuntimeException(
                    UserSettingsConstants
                            .EMAIL_ALREADY_REGISTERED
            );
        }

        // =====================================================
        // UPDATE
        // =====================================================

        int result =
                repository.updateEmail(
                        userId,
                        newEmail
                );

        if (result <= 0) {

            throw new RuntimeException(
                    UserSettingsConstants
                            .EMAIL_UPDATE_FAILED
            );
        }
    }

    // =========================================================
    // CHANGE PASSWORD
    // =========================================================

    public void changePassword(
            String email,
            ChangePasswordRequest request) {

        if (request == null) {

            throw new RuntimeException(
                    UserSettingsConstants
                            .PASSWORD_FIELDS_REQUIRED
            );
        }

        if (request.getCurrentPassword() == null ||
                request.getNewPassword() == null ||
                request.getConfirmPassword() == null) {

            throw new RuntimeException(
                    UserSettingsConstants
                            .PASSWORD_FIELDS_REQUIRED
            );
        }

        // =====================================================
        // CONFIRM PASSWORD
        // =====================================================

        if (!request.getNewPassword().equals(
                request.getConfirmPassword())) {

            throw new RuntimeException(
                    UserSettingsConstants
                            .PASSWORD_MISMATCH
            );
        }

        // =====================================================
        // PASSWORD LENGTH
        // =====================================================

        if (request.getNewPassword().length()
                < UserSettingsConstants.MIN_PASSWORD_LENGTH) {

            throw new RuntimeException(
                    UserSettingsConstants
                            .PASSWORD_TOO_SHORT
            );
        }

        // =====================================================
        // FIND USER
        // =====================================================

        Integer userId =
                repository.findUserIdByEmail(email);

        if (userId == null) {

            throw new RuntimeException(
                    UserSettingsConstants.USER_NOT_FOUND
            );
        }

        // =====================================================
        // GET OLD PASSWORD
        // =====================================================

        String storedPassword =
                repository.getPasswordByUserId(userId);

        if (storedPassword == null ||
                storedPassword.trim().isEmpty()) {

            throw new RuntimeException(
                    UserSettingsConstants.USER_NOT_FOUND
            );
        }

        // =====================================================
        // VERIFY CURRENT PASSWORD
        // =====================================================

        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                storedPassword)) {

            throw new RuntimeException(
                    UserSettingsConstants
                            .CURRENT_PASSWORD_INCORRECT
            );
        }

        // =====================================================
        // SAME PASSWORD CHECK
        // =====================================================

        if (passwordEncoder.matches(
                request.getNewPassword(),
                storedPassword)) {

            throw new RuntimeException(
                    UserSettingsConstants.PASSWORD_SAME
            );
        }

        // =====================================================
        // ENCODE
        // =====================================================

        String encodedPassword =
                passwordEncoder.encode(
                        request.getNewPassword()
                );

        // =====================================================
        // UPDATE
        // =====================================================

        int result =
                repository.updatePassword(
                        userId,
                        encodedPassword
                );

        if (result <= 0) {

            throw new RuntimeException(
                    UserSettingsConstants
                            .PASSWORD_UPDATE_FAILED
            );
        }
    }
}