package org.techhub.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import org.techhub.dto.response.UserProfileResponse;
import org.techhub.model.UserProfile;
import org.techhub.service.UserProfileService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/profile")

@Tag(
        name = "User Profile",
        description = "User profile management APIs"
)
public class UserProfileController {

    private final UserProfileService userProfileService;

    public UserProfileController(
            UserProfileService userProfileService) {

        this.userProfileService = userProfileService;
    }

    // ==========================================
    // GET LOGGED-IN USER EMAIL
    // ==========================================

    private String getLoggedInEmail() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        return authentication.getName();
    }

    // ==========================================
    // USER - SAVE PROFILE
    // POST /profile/save
    // ==========================================

    @PostMapping("/save")
    @Operation(
            summary = "Save user profile",
            description = "Saves the profile of the currently logged-in user"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Profile saved successfully"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Profile already exists"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized"
            )
    })
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<String> saveProfile(
            @RequestBody UserProfile profile) {

        String email = getLoggedInEmail();

        int result =
                userProfileService.saveProfile(
                        email,
                        profile
                );

        if (result > 0) {

            return ResponseEntity.ok(
                    "Profile saved successfully"
            );
        }

        return ResponseEntity.badRequest()
                .body("Profile already exists for this user");
    }

    // ==========================================
    // USER - GET OWN PROFILE
    // GET /profile
    // ==========================================

    @GetMapping
    @Operation(
            summary = "Get own profile",
            description = "Retrieves the profile of the currently logged-in user"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Profile retrieved successfully"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Profile not found"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized"
            )
    })
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<UserProfile> getProfile() {

        String email = getLoggedInEmail();

        UserProfile profile =
                userProfileService.getProfile(email);

        if (profile == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(profile);
    }

    // ==========================================
    // USER - UPDATE OWN PROFILE
    // PUT /profile/update
    // ==========================================

    @PutMapping("/update")
    @Operation(
            summary = "Update own profile",
            description = "Updates the profile of the currently logged-in user"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Profile updated successfully"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Profile not found"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized"
            )
    })
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<String> updateProfile(
            @RequestBody UserProfile profile) {

        String email = getLoggedInEmail();

        int result =
                userProfileService.updateProfile(
                        email,
                        profile
                );

        if (result > 0) {

            return ResponseEntity.ok(
                    "Profile updated successfully"
            );
        }

        return ResponseEntity.badRequest()
                .body("Profile not found");
    }

    // ==========================================
    // USER - DELETE OWN PROFILE
    // DELETE /profile/delete
    // ==========================================

    @DeleteMapping("/delete")
    @Operation(
            summary = "Delete own profile",
            description = "Deletes the profile of the currently logged-in user"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Profile deleted successfully"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Profile not found"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized"
            )
    })
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<String> deleteProfile() {

        String email = getLoggedInEmail();

        int result =
                userProfileService.deleteProfile(email);

        if (result > 0) {

            return ResponseEntity.ok(
                    "Profile deleted successfully"
            );
        }

        return ResponseEntity.badRequest()
                .body("Profile not found");
    }

    // ==========================================
    // ADMIN - GET ALL PROFILES
    // GET /profile/all
    // ==========================================

    @GetMapping("/all")
    @Operation(
            summary = "Get all user profiles",
            description = "Retrieves all user profiles for administrator"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Profiles retrieved successfully"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized"
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Access denied"
            )
    })
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<List<UserProfileResponse>> getAllProfiles() {

        return ResponseEntity.ok(
                userProfileService.getAllProfiles()
        );
    }
}