package org.techhub.controller;

import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import org.techhub.constants.UserSettingsConstants;
import org.techhub.dto.request.ChangePasswordRequest;
import org.techhub.dto.request.UpdateEmailRequest;
import org.techhub.dto.request.UserSettingsRequest;
import org.techhub.dto.response.UserSettingsResponse;
import org.techhub.service.UserSettingsService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping(UserSettingsConstants.SETTINGS_API)

@SecurityRequirement(name = "bearerAuth")


@Tag(
        name = "User Settings",
        description =
                "APIs for managing user account settings, " +
                "email and password"
)
public class UserSettingsController {

    private final UserSettingsService settingsService;

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public UserSettingsController(
            UserSettingsService settingsService) {

        this.settingsService = settingsService;
    }

    // =========================================================
    // GET MY SETTINGS
    // =========================================================

    @Operation(
            summary = "Get current user settings"
    )

    @ApiResponses({

            @ApiResponse(
                    responseCode = "200",
                    description =
                            "User settings retrieved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    implementation =
                                            UserSettingsResponse.class
                            )
                    )
            ),

            @ApiResponse(
                    responseCode = "401",
                    description =
                            "User is not authenticated"
            ),

            @ApiResponse(
                    responseCode = "403",
                    description =
                            "User does not have permission"
            ),

            @ApiResponse(
                    responseCode = "400",
                    description =
                            "Unable to retrieve settings"
            )
    })

    @GetMapping("/my")
    public ResponseEntity<?> getMySettings(

            @Parameter(hidden = true)
            Authentication authentication) {

        try {

            // =================================================
            // AUTH CHECK
            // =================================================

            if (authentication == null ||
                    !authentication.isAuthenticated()) {

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body("User is not authenticated");
            }

            String email =
                    authentication.getName();

            if (email == null ||
                    email.trim().isEmpty()) {

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid authentication");
            }

            // =================================================
            // SERVICE
            // =================================================

            UserSettingsResponse response =
                    settingsService.getSettings(email);

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // UPDATE SETTINGS
    // =========================================================

    @Operation(
            summary = "Update user settings"
    )

    @PutMapping("/update")
    public ResponseEntity<?> updateSettings(

            @Parameter(hidden = true)
            Authentication authentication,

            @RequestBody UserSettingsRequest request) {

        try {

            if (authentication == null ||
                    !authentication.isAuthenticated()) {

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body("User is not authenticated");
            }

            String email =
                    authentication.getName();

            settingsService.saveSettings(
                    email,
                    request
            );

            return ResponseEntity.ok(
                    UserSettingsConstants.SETTINGS_UPDATED
            );

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // UPDATE EMAIL
    // =========================================================

    @Operation(
            summary = "Update email address"
    )

    @PutMapping("/email")
    public ResponseEntity<?> updateEmail(

            @Parameter(hidden = true)
            Authentication authentication,

            @RequestBody UpdateEmailRequest request) {

        try {

            if (authentication == null ||
                    !authentication.isAuthenticated()) {

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body("User is not authenticated");
            }

            String currentEmail =
                    authentication.getName();

            settingsService.updateEmail(
                    currentEmail,
                    request
            );

            /*
             * IMPORTANT:
             *
             * JWT still contains old email.
             *
             * Therefore user must login again
             * after changing email.
             */

            return ResponseEntity.ok(
                    UserSettingsConstants.EMAIL_UPDATED
            );

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // CHANGE PASSWORD
    // =========================================================

    @Operation(
            summary = "Change password"
    )

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(

            @Parameter(hidden = true)
            Authentication authentication,

            @RequestBody ChangePasswordRequest request) {

        try {

            if (authentication == null ||
                    !authentication.isAuthenticated()) {

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body("User is not authenticated");
            }

            String email =
                    authentication.getName();

            settingsService.changePassword(
                    email,
                    request
            );

            return ResponseEntity.ok(
                    UserSettingsConstants.PASSWORD_UPDATED
            );

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }
}