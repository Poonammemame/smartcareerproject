package org.techhub.constants;

public final class AssessmentAssignmentQueries {

    private AssessmentAssignmentQueries() {
    }


    // ============================================================
    // ASSIGN ASSESSMENT
    // ============================================================

    public static final String ASSIGN_ASSESSMENT = """
            INSERT INTO assessment_assignment
            (
                user_id,
                status
            )
            VALUES (?, 'ASSIGNED')
            """;


    // ============================================================
    // CHECK IF ASSESSMENT IS ASSIGNED
    // ============================================================

    public static final String CHECK_ASSIGNED = """
            SELECT COUNT(*)
            FROM assessment_assignment
            WHERE user_id = ?
            AND status = 'ASSIGNED'
            """;


    // ============================================================
    // FIND ASSIGNMENT BY USER ID
    // ============================================================

    public static final String FIND_BY_USER_ID = """
            SELECT
                assignment_id,
                user_id,
                status,
                assigned_at
            FROM assessment_assignment
            WHERE user_id = ?
            ORDER BY assigned_at DESC
            """;


    // ============================================================
    // FIND ALL ASSIGNMENTS
    // ADMIN
    // ============================================================

    public static final String FIND_ALL = """
            SELECT
                assignment_id,
                user_id,
                status,
                assigned_at
            FROM assessment_assignment
            ORDER BY assigned_at DESC
            """;


    // ============================================================
    // UPDATE STATUS
    // ASSIGNED → COMPLETED
    // ============================================================

    public static final String UPDATE_STATUS = """
            UPDATE assessment_assignment
            SET status = ?
            WHERE assignment_id = ?
            """;


    // ============================================================
    // FIND ACTIVE ASSIGNMENT
    // ============================================================

    public static final String FIND_ACTIVE_BY_USER_ID = """
            SELECT
                assignment_id,
                user_id,
                status,
                assigned_at
            FROM assessment_assignment
            WHERE user_id = ?
            AND status = 'ASSIGNED'
            ORDER BY assigned_at DESC
            LIMIT 1
            """;


    // ============================================================
    // COUNT ASSIGNED ASSESSMENTS
    // ============================================================

    public static final String COUNT_ASSIGNED = """
            SELECT COUNT(*)
            FROM assessment_assignment
            WHERE status = 'ASSIGNED'
            """;


    // ============================================================
    // COUNT COMPLETED ASSESSMENTS
    // ============================================================

    public static final String COUNT_COMPLETED = """
            SELECT COUNT(*)
            FROM assessment_assignment
            WHERE status = 'COMPLETED'
            """;
}