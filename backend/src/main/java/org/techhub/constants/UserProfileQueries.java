package org.techhub.constants;

public final class UserProfileQueries {

    private UserProfileQueries() {
    }

    // ==========================================
    // INSERT PROFILE
    // ==========================================

    public static final String INSERT_PROFILE = """
            INSERT INTO user_profile
            (
                user_id,
                education,
                college,
                graduation_year,
                technical_skills,
                interests,
                experience_level,
                career_goal
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """;


    // ==========================================
    // FIND PROFILE BY USER ID
    // ==========================================

    public static final String FIND_BY_USER_ID = """
            SELECT
                profile_id,
                user_id,
                education,
                college,
                graduation_year,
                technical_skills,
                interests,
                experience_level,
                career_goal,
                created_at,
                updated_at
            FROM user_profile
            WHERE user_id = ?
            """;


    // ==========================================
    // UPDATE PROFILE
    // ==========================================

    public static final String UPDATE_PROFILE = """
            UPDATE user_profile
            SET
                education = ?,
                college = ?,
                graduation_year = ?,
                technical_skills = ?,
                interests = ?,
                experience_level = ?,
                career_goal = ?
            WHERE user_id = ?
            """;


    // ==========================================
    // DELETE PROFILE
    // ==========================================

    public static final String DELETE_PROFILE = """
            DELETE FROM user_profile
            WHERE user_id = ?
            """;
    public static final String FIND_ALL_PROFILES = """
            SELECT
                p.profile_id,
                p.user_id,
                u.name AS full_name,
                u.email,

                p.education,
                p.college,
                p.graduation_year,
                p.technical_skills,
                p.interests,
                p.experience_level,
                p.career_goal,

                COALESCE(
                    aa.status,
                    'NOT_ASSIGNED'
                ) AS assessment_status,

                p.created_at,
                p.updated_at

            FROM user_profile p

            INNER JOIN users u
                ON p.user_id = u.user_id

            LEFT JOIN assessment_assignment aa
                ON p.user_id = aa.user_id

            ORDER BY p.created_at DESC
            """;


}


