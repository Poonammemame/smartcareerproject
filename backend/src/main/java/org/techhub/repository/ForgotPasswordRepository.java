package org.techhub.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import org.techhub.constants.ForgotPasswordQuery;

@Repository
public class ForgotPasswordRepository {


    // ============================================================
    // JDBC TEMPLATE
    // ============================================================

    private final JdbcTemplate jdbcTemplate;


    // ============================================================
    // CONSTRUCTOR
    // ============================================================

    public ForgotPasswordRepository(
            JdbcTemplate jdbcTemplate) {

        this.jdbcTemplate = jdbcTemplate;
    }


    // ============================================================
    // CHECK EMAIL EXISTS
    // ============================================================

    public boolean isEmailExists(
            String email) {

        Integer count =
                jdbcTemplate.queryForObject(
                        ForgotPasswordQuery.CHECK_EMAIL,
                        Integer.class,
                        email
                );


        return count != null
                && count > 0;
    }


    // ============================================================
    // UPDATE PASSWORD
    // ============================================================

    public int updatePassword(
            String email,
            String encryptedPassword) {

        return jdbcTemplate.update(
                ForgotPasswordQuery.UPDATE_PASSWORD,
                encryptedPassword,
                email
        );
    }
}