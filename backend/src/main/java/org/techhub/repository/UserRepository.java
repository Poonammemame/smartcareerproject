// ============================================================
// UserRepository.java
// ============================================================

package org.techhub.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import org.techhub.constants.UserQueries;
import org.techhub.model.User;

@Repository
public class UserRepository {

    private final JdbcTemplate jdbcTemplate;

    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public int save(User user) {

        return jdbcTemplate.update(
                UserQueries.INSERT_USER,
                user.getName(),
                user.getEmail(),
                user.getPassword(),
                user.getRole(),
                user.getStatus()
        );
    }

    public Optional<User> findByEmail(String email) {

        List<User> users = jdbcTemplate.query(
                UserQueries.FIND_BY_EMAIL,
                (rs, rowNum) -> {

                    User user = new User();

                    user.setUserId(rs.getInt("user_id"));
                    user.setName(rs.getString("name"));
                    user.setEmail(rs.getString("email"));
                    user.setPassword(rs.getString("password"));
                    user.setRole(rs.getString("role"));
                    user.setStatus(rs.getString("status"));

                    if (rs.getTimestamp("created_at") != null) {
                        user.setCreatedAt(
                                rs.getTimestamp("created_at")
                                        .toLocalDateTime()
                        );
                    }

                    return user;
                },
                email
        );

        return users.stream().findFirst();
    }

    public Optional<User> findById(int userId) {

        List<User> users = jdbcTemplate.query(
                UserQueries.FIND_BY_ID,
                (rs, rowNum) -> {

                    User user = new User();

                    user.setUserId(rs.getInt("user_id"));
                    user.setName(rs.getString("name"));
                    user.setEmail(rs.getString("email"));
                    user.setPassword(rs.getString("password"));
                    user.setRole(rs.getString("role"));
                    user.setStatus(rs.getString("status"));

                    if (rs.getTimestamp("created_at") != null) {
                        user.setCreatedAt(
                                rs.getTimestamp("created_at")
                                        .toLocalDateTime()
                        );
                    }

                    return user;
                },
                userId
        );

        return users.stream().findFirst();
    }

    public List<User> findAllUsers() {

        return jdbcTemplate.query(
                UserQueries.FIND_ALL_USERS,
                (rs, rowNum) -> {

                    User user = new User();

                    user.setUserId(rs.getInt("user_id"));
                    user.setName(rs.getString("name"));
                    user.setEmail(rs.getString("email"));
                    user.setRole(rs.getString("role"));
                    user.setStatus(rs.getString("status"));

                    if (rs.getTimestamp("created_at") != null) {
                        user.setCreatedAt(
                                rs.getTimestamp("created_at")
                                        .toLocalDateTime()
                        );
                    }

                    return user;
                }
        );
    }

    public Optional<User> findUserById(int userId) {

        List<User> users = jdbcTemplate.query(
                UserQueries.FIND_USER_BY_ID,
                (rs, rowNum) -> {

                    User user = new User();

                    user.setUserId(rs.getInt("user_id"));
                    user.setName(rs.getString("name"));
                    user.setEmail(rs.getString("email"));
                    user.setRole(rs.getString("role"));
                    user.setStatus(rs.getString("status"));

                    if (rs.getTimestamp("created_at") != null) {
                        user.setCreatedAt(
                                rs.getTimestamp("created_at")
                                        .toLocalDateTime()
                        );
                    }

                    return user;
                },
                userId
        );

        return users.stream().findFirst();
    }

    public int deleteUser(int userId) {

        return jdbcTemplate.update(
                UserQueries.DELETE_USER,
                userId
        );
    }

    public int updateUserStatus(int userId, String status) {

        return jdbcTemplate.update(
                UserQueries.UPDATE_USER_STATUS,
                status,
                userId
        );
    }

    public int countUsers() {

        Integer count = jdbcTemplate.queryForObject(
                UserQueries.COUNT_USERS,
                Integer.class
        );

        return count != null ? count : 0;
    }
}