package org.techhub.constants;

public class CareerQueries {

    private CareerQueries() {
    }

    // ==========================================
    // INSERT CAREER
    // ==========================================

    public static final String INSERT_CAREER = """
        INSERT INTO career
        (
            career_name,
            description,
            required_skills
        )
        VALUES (?, ?, ?)
        """;


    // ==========================================
    // FIND ALL CAREERS
    // ==========================================

    public static final String FIND_ALL = """
        SELECT
            career_id,
            career_name,
            description,
            required_skills,
            created_at
        FROM career
        ORDER BY career_id
        """;


    // ==========================================
    // FIND CAREER BY ID
    // ==========================================

    public static final String FIND_BY_ID = """
        SELECT
            career_id,
            career_name,
            description,
            required_skills,
            created_at
        FROM career
        WHERE career_id = ?
        """;


    // ==========================================
    // SEARCH CAREER BY NAME
    // ==========================================

    public static final String SEARCH_BY_NAME = """
        SELECT
            career_id,
            career_name,
            description,
            required_skills,
            created_at
        FROM career
        WHERE career_name LIKE ?
        ORDER BY career_name
        """;


    // ==========================================
    // UPDATE CAREER
    // ==========================================

    public static final String UPDATE_CAREER = """
        UPDATE career
        SET
            career_name = ?,
            description = ?,
            required_skills = ?
        WHERE career_id = ?
        """;


    // ==========================================
    // DELETE CAREER
    // ==========================================

    public static final String DELETE_CAREER = """
        DELETE FROM career
        WHERE career_id = ?
        """;


    // ==========================================
    // COUNT CAREERS
    // ==========================================

    public static final String COUNT_CAREERS = """
        SELECT COUNT(*)
        FROM career
        """;
}