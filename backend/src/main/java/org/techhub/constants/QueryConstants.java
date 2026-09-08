package org.techhub.constants;

public final class QueryConstants {

    private QueryConstants() {
    }

    public static final String INSERT_USER =
            """
            INSERT INTO users
            (name, email, password, role, status)
            VALUES (?, ?, ?, ?, ?)
            """;

    public static final String FIND_BY_EMAIL =
            """
            SELECT user_id, name, email, password,
                   role, status, created_at
            FROM users
            WHERE email = ?
            """;

    public static final String FIND_BY_ID =
            """
            SELECT user_id, name, email, password,
                   role, status, created_at
            FROM users
            WHERE user_id = ?
            """;

    public static final String EMAIL_EXISTS =
            """
            SELECT COUNT(*)
            FROM users
            WHERE email = ?
            """;
}