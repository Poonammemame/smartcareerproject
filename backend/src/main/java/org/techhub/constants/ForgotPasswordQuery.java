package org.techhub.constants;

public class ForgotPasswordQuery {

    private ForgotPasswordQuery() {
        // Prevent object creation
    }


    // ============================================================
    // CHECK EMAIL
    // ============================================================

    public static final String CHECK_EMAIL =
            "SELECT COUNT(*) " +
            "FROM users " +
            "WHERE LOWER(email) = LOWER(?)";


    // ============================================================
    // UPDATE PASSWORD
    // ============================================================

    public static final String UPDATE_PASSWORD =
            "UPDATE users " +
            "SET password = ? " +
            "WHERE LOWER(email) = LOWER(?)";
}