package org.techhub.repository;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import org.techhub.constants.UserProfileQueries;
import org.techhub.dto.response.UserProfileResponse;
import org.techhub.model.UserProfile;

@Repository
public class UserProfileRepository {

    private final JdbcTemplate jdbcTemplate;

    public UserProfileRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }


    // ==========================================
    // INSERT PROFILE
    // ==========================================

    public int save(UserProfile profile) {

        return jdbcTemplate.update(
                UserProfileQueries.INSERT_PROFILE,

                profile.getUserId(),
                profile.getEducation(),
                profile.getCollege(),
                profile.getGraduationYear(),
                profile.getTechnicalSkills(),
                profile.getInterests(),
                profile.getExperienceLevel(),
                profile.getCareerGoal()
        );
    }


    // ==========================================
    // FIND PROFILE BY USER ID
    // ==========================================

    public UserProfile findByUserId(int userId) {

        List<UserProfile> profiles = jdbcTemplate.query(
                UserProfileQueries.FIND_BY_USER_ID,

                (rs, rowNum) -> {

                    UserProfile profile = new UserProfile();

                    profile.setProfileId(
                            rs.getInt("profile_id")
                    );

                    profile.setUserId(
                            rs.getInt("user_id")
                    );

                    profile.setEducation(
                            rs.getString("education")
                    );

                    profile.setCollege(
                            rs.getString("college")
                    );

                    profile.setGraduationYear(
                            rs.getInt("graduation_year")
                    );

                    profile.setTechnicalSkills(
                            rs.getString("technical_skills")
                    );

                    profile.setInterests(
                            rs.getString("interests")
                    );

                    profile.setExperienceLevel(
                            rs.getString("experience_level")
                    );

                    profile.setCareerGoal(
                            rs.getString("career_goal")
                    );

                    // ==================================
                    // TIMESTAMP → LocalDateTime
                    // ==================================

                    if (rs.getTimestamp("created_at") != null) {

                        profile.setCreatedAt(
                                rs.getTimestamp("created_at")
                                        .toLocalDateTime()
                        );
                    }

                    if (rs.getTimestamp("updated_at") != null) {

                        profile.setUpdatedAt(
                                rs.getTimestamp("updated_at")
                                        .toLocalDateTime()
                        );
                    }

                    return profile;
                },

                userId
        );

        // No profile found
        if (profiles.isEmpty()) {
            return null;
        }

        return profiles.get(0);
    }


    // ==========================================
    // UPDATE PROFILE
    // ==========================================

    public int update(UserProfile profile) {

        return jdbcTemplate.update(
                UserProfileQueries.UPDATE_PROFILE,

                profile.getEducation(),
                profile.getCollege(),
                profile.getGraduationYear(),
                profile.getTechnicalSkills(),
                profile.getInterests(),
                profile.getExperienceLevel(),
                profile.getCareerGoal(),
                profile.getUserId()
        );
    }


    // ==========================================
    // DELETE PROFILE
    // ==========================================

    public int deleteByUserId(int userId) {

        return jdbcTemplate.update(
                UserProfileQueries.DELETE_PROFILE,
                userId
        );
    }
    
 // ==========================================
 // GET ALL PROFILES
 // ADMIN
 // ==========================================

 public List<UserProfileResponse> getAllProfiles() {

     return jdbcTemplate.query(
             UserProfileQueries.FIND_ALL_PROFILES,

             (rs, rowNum) -> {

                 UserProfileResponse response =
                         new UserProfileResponse();

                 response.setProfileId(
                         rs.getInt("profile_id")
                 );

                 response.setUserId(
                         rs.getInt("user_id")
                 );

                 response.setFullName(
                	        rs.getString("full_name")
                	);

                 response.setEmail(
                         rs.getString("email")
                 );

                 response.setEducation(
                         rs.getString("education")
                 );

                 response.setCollege(
                         rs.getString("college")
                 );

                 response.setGraduationYear(
                         rs.getInt("graduation_year")
                 );

                 response.setTechnicalSkills(
                         rs.getString("technical_skills")
                 );

                 response.setInterests(
                         rs.getString("interests")
                 );

                 response.setExperienceLevel(
                         rs.getString("experience_level")
                 );

                 response.setCareerGoal(
                         rs.getString("career_goal")
                 );
                 response.setAssessmentStatus(
                	        rs.getString("assessment_status")
                	);

                 if (rs.getTimestamp("created_at") != null) {

                     response.setCreatedAt(
                             rs.getTimestamp("created_at")
                                     .toLocalDateTime()
                     );
                 }

                 if (rs.getTimestamp("updated_at") != null) {

                     response.setUpdatedAt(
                             rs.getTimestamp("updated_at")
                                     .toLocalDateTime()
                     );
                 }

                 return response;
             }
     );
 }
}