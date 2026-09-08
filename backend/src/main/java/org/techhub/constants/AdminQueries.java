package org.techhub.constants;

public final class AdminQueries {

    private AdminQueries() {
    }

    public static final String FIND_ADMIN_BY_EMAIL = """
            SELECT admin_id,
                   name,
                   email,
                   password,
                   status
            FROM admin
            WHERE email = ?
            """;
}