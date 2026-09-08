package org.techhub.constants;

public class SubjectResultQueries {

    private SubjectResultQueries() {
    }


    // ============================================================
    // INSERT SUBJECT RESULT
    // ============================================================

    public static final String INSERT_SUBJECT_RESULT = """
        INSERT INTO subject_result
        (
            result_id,
            subject,
            total_questions,
            correct_answers,
            wrong_answers,
            unanswered,
            percentage
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """;


    // ============================================================
    // FIND SUBJECT RESULTS BY RESULT ID
    // ============================================================

    public static final String FIND_BY_RESULT_ID = """
        SELECT
            subject_result_id,
            result_id,
            subject,
            total_questions,
            correct_answers,
            wrong_answers,
            unanswered,
            percentage
        FROM subject_result
        WHERE result_id = ?
        ORDER BY subject_result_id
        """;


    // ============================================================
    // FIND SUBJECT RESULT BY ID
    // ============================================================

    public static final String FIND_BY_ID = """
        SELECT
            subject_result_id,
            result_id,
            subject,
            total_questions,
            correct_answers,
            wrong_answers,
            unanswered,
            percentage
        FROM subject_result
        WHERE subject_result_id = ?
        """;


    // ============================================================
    // DELETE BY RESULT ID
    // ============================================================

    public static final String DELETE_BY_RESULT_ID = """
        DELETE FROM subject_result
        WHERE result_id = ?
        """;
}