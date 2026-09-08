package org.techhub.constants;

public class RecommendationQueries {

    // ==========================================
    // INSERT RECOMMENDATION
    // ==========================================

    public static final String INSERT_RECOMMENDATION = """
        INSERT INTO recommendation
        (
            user_id,
            career_id,
            match_percentage,
            reason,
            recommended_at
        )
        VALUES (?, ?, ?, ?, NOW())
        """;


    // ==========================================
    // FIND BY USER ID
    // ==========================================

    public static final String FIND_BY_USER_ID = """
        SELECT
            r.recommendation_id,
            r.user_id,
            u.name AS user_name,
            r.career_id,
            c.career_name,
            c.description,
            c.required_skills,
            r.match_percentage,
            r.reason,
            r.recommended_at

        FROM recommendation r

        INNER JOIN users u
            ON r.user_id = u.user_id

        INNER JOIN career c
            ON r.career_id = c.career_id

        WHERE r.user_id = ?

        ORDER BY
            r.match_percentage DESC,
            r.recommended_at DESC
        """;


    // ==========================================
    // FIND BY RECOMMENDATION ID
    // ==========================================

    public static final String FIND_BY_ID = """
        SELECT
            r.recommendation_id,
            r.user_id,
            u.name AS user_name,
            r.career_id,
            c.career_name,
            c.description,
            c.required_skills,
            r.match_percentage,
            r.reason,
            r.recommended_at

        FROM recommendation r

        INNER JOIN users u
            ON r.user_id = u.user_id

        INNER JOIN career c
            ON r.career_id = c.career_id

        WHERE r.recommendation_id = ?
        """;


    // ==========================================
    // FIND ALL
    // ==========================================

    public static final String FIND_ALL = """
        SELECT
            r.recommendation_id,
            r.user_id,
            u.name AS user_name,
            r.career_id,
            c.career_name,
            c.description,
            c.required_skills,
            r.match_percentage,
            r.reason,
            r.recommended_at

        FROM recommendation r

        INNER JOIN users u
            ON r.user_id = u.user_id

        INNER JOIN career c
            ON r.career_id = c.career_id

        ORDER BY
            r.match_percentage DESC,
            r.recommended_at DESC
        """;


    // ==========================================
    // DELETE USER RECOMMENDATIONS
    // ==========================================

    public static final String DELETE_BY_USER_ID = """
        DELETE FROM recommendation
        WHERE user_id = ?
        """;


    private RecommendationQueries() {
    }
}