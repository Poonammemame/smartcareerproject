package org.techhub.constants;

public class AssessmentResultQueries {

    private AssessmentResultQueries() {
    }


    public static final String INSERT_RESULT = """
        INSERT INTO assessment_result
        (
            user_id,
            total_questions,
            correct_answers,
            wrong_answers,
            unanswered,
            percentage
        )
        VALUES (?, ?, ?, ?, ?, ?)
        """;


    public static final String FIND_BY_USER_ID = """
        SELECT
            result_id,
            user_id,
            total_questions,
            correct_answers,
            wrong_answers,
            unanswered,
            percentage,
            completed_at
        FROM assessment_result
        WHERE user_id = ?
        ORDER BY completed_at DESC
        """;


    public static final String FIND_RESULTS_BY_USER_ID = """
        SELECT
            ar.result_id,
            ar.user_id,
            u.name,
            u.email,
            ar.total_questions,
            ar.correct_answers,
            ar.wrong_answers,
            ar.unanswered,
            ar.percentage,
            ar.completed_at
        FROM assessment_result ar
        JOIN users u
            ON ar.user_id = u.user_id
        WHERE ar.user_id = ?
        ORDER BY ar.completed_at DESC
        """;


    public static final String FIND_BY_ID = """
        SELECT
            result_id,
            user_id,
            total_questions,
            correct_answers,
            wrong_answers,
            unanswered,
            percentage,
            completed_at
        FROM assessment_result
        WHERE result_id = ?
        """;


    public static final String FIND_ALL_RESULTS = """
        SELECT
            result_id,
            user_id,
            total_questions,
            correct_answers,
            wrong_answers,
            unanswered,
            percentage,
            completed_at
        FROM assessment_result
        ORDER BY completed_at DESC
        """;


    public static final String FIND_ALL_RESULTS_WITH_USER = """
        SELECT
            ar.result_id,
            ar.user_id,
            u.name,
            u.email,
            ar.total_questions,
            ar.correct_answers,
            ar.wrong_answers,
            ar.unanswered,
            ar.percentage,
            ar.completed_at
        FROM assessment_result ar
        JOIN users u
            ON ar.user_id = u.user_id
        ORDER BY ar.completed_at DESC
        """;
}