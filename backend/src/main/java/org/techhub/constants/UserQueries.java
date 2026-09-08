// ============================================================
// UserQueries.java
// ============================================================

package org.techhub.constants;

public final class UserQueries {

    private UserQueries() {
    }

    public static final String INSERT_USER = """
            INSERT INTO users
            (name, email, password, role, status)
            VALUES (?, ?, ?, ?, ?)
            """;

    public static final String FIND_BY_EMAIL = """
            SELECT user_id,
                   name,
                   email,
                   password,
                   role,
                   status,
                   created_at
            FROM users
            WHERE email = ?
            """;

    public static final String FIND_BY_ID = """
            SELECT user_id,
                   name,
                   email,
                   password,
                   role,
                   status,
                   created_at
            FROM users
            WHERE user_id = ?
            """;

    public static final String EXISTS_BY_EMAIL = """
            SELECT COUNT(*)
            FROM users
            WHERE email = ?
            """;

    public static final String FIND_ALL_USERS = """
            SELECT user_id,
                   name,
                   email,
                   role,
                   status,
                   created_at
            FROM users
            ORDER BY user_id DESC
            """;

    public static final String FIND_USER_BY_ID = """
            SELECT user_id,
                   name,
                   email,
                   role,
                   status,
                   created_at
            FROM users
            WHERE user_id = ?
            """;

    public static final String DELETE_USER = """
            DELETE FROM users
            WHERE user_id = ?
            """;

    public static final String UPDATE_USER_STATUS = """
            UPDATE users
            SET status = ?
            WHERE user_id = ?
            """;

    public static final String COUNT_USERS = """
            SELECT COUNT(*)
            FROM users
            """;
}