package org.techhub.constants;

public final class QuestionQueries {

    private QuestionQueries() {
    }

    // =========================================================
    // INSERT
    // =========================================================

    public static final String INSERT_QUESTION = """
            INSERT INTO question
            (
                question_text,
                option_a,
                option_b,
                option_c,
                option_d,
                correct_answer,
                category,
                difficulty,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;


    // =========================================================
    // FIND LAST INSERTED
    // =========================================================

    public static final String FIND_LAST_INSERTED = """
            SELECT
                question_id,
                question_text,
                option_a,
                option_b,
                option_c,
                option_d,
                correct_answer,
                category,
                difficulty,
                status,
                created_at,
                updated_at
            FROM question
            ORDER BY question_id DESC
            LIMIT 1
            """;


    // =========================================================
    // FIND ALL
    // =========================================================

    public static final String FIND_ALL = """
            SELECT
                question_id,
                question_text,
                option_a,
                option_b,
                option_c,
                option_d,
                correct_answer,
                category,
                difficulty,
                status,
                created_at,
                updated_at
            FROM question
            ORDER BY question_id DESC
            """;


    // =========================================================
    // FIND BY ID
    // =========================================================

    public static final String FIND_BY_ID = """
            SELECT
                question_id,
                question_text,
                option_a,
                option_b,
                option_c,
                option_d,
                correct_answer,
                category,
                difficulty,
                status,
                created_at,
                updated_at
            FROM question
            WHERE question_id = ?
            """;


    // =========================================================
    // UPDATE
    // =========================================================

    public static final String UPDATE_QUESTION = """
            UPDATE question
            SET
                question_text = ?,
                option_a = ?,
                option_b = ?,
                option_c = ?,
                option_d = ?,
                correct_answer = ?,
                category = ?,
                difficulty = ?,
                status = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE question_id = ?
            """;


    // =========================================================
    // DELETE
    // =========================================================

    public static final String DELETE_QUESTION = """
            DELETE FROM question
            WHERE question_id = ?
            """;


    // =========================================================
    // UPDATE STATUS
    // =========================================================

    public static final String UPDATE_STATUS = """
            UPDATE question
            SET
                status = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE question_id = ?
            """;


    // =========================================================
    // TOTAL
    // =========================================================

    public static final String COUNT_TOTAL = """
            SELECT COUNT(*)
            FROM question
            """;


    // =========================================================
    // CATEGORY COUNT
    // =========================================================

    public static final String COUNT_BY_CATEGORY = """
            SELECT COUNT(*)
            FROM question
            WHERE category = ?
            """;


    // =========================================================
    // DIFFICULTY COUNT
    // =========================================================

    public static final String COUNT_BY_DIFFICULTY = """
            SELECT COUNT(*)
            FROM question
            WHERE difficulty = ?
            """;


    // =========================================================
    // STATUS COUNT
    // =========================================================

    public static final String COUNT_BY_STATUS = """
            SELECT COUNT(*)
            FROM question
            WHERE status = ?
            """;


    // =========================================================
    // FIND BY DIFFICULTY
    // =========================================================

    public static final String FIND_BY_DIFFICULTY = """
            SELECT
                question_id,
                question_text,
                option_a,
                option_b,
                option_c,
                option_d,
                correct_answer,
                category,
                difficulty,
                status,
                created_at,
                updated_at
            FROM question
            WHERE difficulty = ?
            ORDER BY question_id
            """;


    // =========================================================
    // FIND BY CATEGORY
    // =========================================================

    public static final String FIND_BY_CATEGORY = """
            SELECT
                question_id,
                question_text,
                option_a,
                option_b,
                option_c,
                option_d,
                correct_answer,
                category,
                difficulty,
                status,
                created_at,
                updated_at
            FROM question
            WHERE category = ?
            ORDER BY question_id
            """;
}