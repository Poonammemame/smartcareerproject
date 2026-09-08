package org.techhub.repository;

import java.util.Optional;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import org.techhub.constants.AdminQueries;
import org.techhub.model.Admin;

@Repository
public class AdminRepository {

    private final JdbcTemplate jdbcTemplate;

    public AdminRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Optional<Admin> findByEmail(String email) {

        return jdbcTemplate.query(
                AdminQueries.FIND_ADMIN_BY_EMAIL,
                (rs, rowNum) -> {

                    Admin admin = new Admin();

                    admin.setAdminId(
                            rs.getInt("admin_id"));

                    admin.setName(
                            rs.getString("name"));

                    admin.setEmail(
                            rs.getString("email"));

                    admin.setPassword(
                            rs.getString("password"));

                    admin.setStatus(
                            rs.getString("status"));

                    return admin;
                },
                email
        ).stream().findFirst();
    }
}