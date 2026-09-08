package org.techhub.service;

import java.util.List;

import org.springframework.stereotype.Service;

import org.techhub.dto.response.UserProfileResponse;
import org.techhub.model.User;
import org.techhub.model.UserProfile;
import org.techhub.repository.UserProfileRepository;
import org.techhub.repository.UserRepository;

@Service
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;

    private final UserRepository userRepository;


    // ============================================================
    // CONSTRUCTOR
    // ============================================================

    public UserProfileService(
            UserProfileRepository userProfileRepository,
            UserRepository userRepository) {

        this.userProfileRepository =
                userProfileRepository;

        this.userRepository =
                userRepository;
    }


    // ============================================================
    // CREATE PROFILE
    // ============================================================

    public int saveProfile(
            String email,
            UserProfile profile) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        // Set logged-in user's ID
        profile.setUserId(
                user.getUserId()
        );

        // Check whether profile already exists
        UserProfile existingProfile =
                userProfileRepository.findByUserId(
                        user.getUserId()
                );

        if (existingProfile != null) {
            return 0;
        }

        return userProfileRepository.save(
                profile
        );
    }


    // ============================================================
    // GET LOGGED-IN USER PROFILE
    // ============================================================

    public UserProfile getProfile(
            String email) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        return userProfileRepository.findByUserId(
                user.getUserId()
        );
    }


    // ============================================================
    // UPDATE PROFILE
    // ============================================================

    public int updateProfile(
            String email,
            UserProfile profile) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        // Set logged-in user's ID
        profile.setUserId(
                user.getUserId()
        );

        return userProfileRepository.update(
                profile
        );
    }


    // ============================================================
    // DELETE LOGGED-IN USER PROFILE
    // ============================================================

    public int deleteProfile(
            String email) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        return userProfileRepository.deleteByUserId(
                user.getUserId()
        );
    }


    // ============================================================
    // GET ALL PROFILES
    // ADMIN
    // ============================================================

    public List<UserProfileResponse> getAllProfiles() {

        return userProfileRepository.getAllProfiles();
    }
}