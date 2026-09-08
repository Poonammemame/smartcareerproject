package org.techhub.repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import org.techhub.constants.CareerQueries;
import org.techhub.model.Career;

@Repository
public class CareerRepository {

    private final JdbcTemplate jdbcTemplate;

    public CareerRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }


    // ==========================================
    // SAVE CAREER
    // ==========================================

    public int save(Career career) {

        return jdbcTemplate.update(
                CareerQueries.INSERT_CAREER,

                career.getCareerName(),
                career.getDescription(),
                career.getRequiredSkills()
        );
    }


    // ==========================================
    // FIND ALL CAREERS
    // ==========================================

    public List<Career> findAll() {

        return jdbcTemplate.query(
                CareerQueries.FIND_ALL,
                this::mapRow
        );
    }


    // ==========================================
    // FIND CAREER BY ID
    // ==========================================

    public Optional<Career> findById(Integer careerId) {

        List<Career> careers =
                jdbcTemplate.query(
                        CareerQueries.FIND_BY_ID,
                        this::mapRow,
                        careerId
                );

        return careers.stream().findFirst();
    }


    // ==========================================
    // SEARCH BY NAME
    // ==========================================

    public List<Career> searchByName(String careerName) {

        return jdbcTemplate.query(
                CareerQueries.SEARCH_BY_NAME,
                this::mapRow,
                "%" + careerName + "%"
        );
    }


    // ==========================================
    // UPDATE CAREER
    // ==========================================

    public int update(Career career) {

        return jdbcTemplate.update(
                CareerQueries.UPDATE_CAREER,

                career.getCareerName(),
                career.getDescription(),
                career.getRequiredSkills(),
                career.getCareerId()
        );
    }


    // ==========================================
    // DELETE CAREER
    // ==========================================

    public int deleteById(Integer careerId) {

        return jdbcTemplate.update(
                CareerQueries.DELETE_CAREER,
                careerId
        );
    }


    // ==========================================
    // COUNT CAREERS
    // ==========================================

    public int count() {

        Integer count =
                jdbcTemplate.queryForObject(
                        CareerQueries.COUNT_CAREERS,
                        Integer.class
                );

        return count != null ? count : 0;
    }


    // ==========================================
    // ROW MAPPER
    // ==========================================

    private Career mapRow(
            ResultSet rs,
            int rowNum) throws SQLException {

        Career career = new Career();

        career.setCareerId(
                rs.getInt("career_id")
        );

        career.setCareerName(
                rs.getString("career_name")
        );

        career.setDescription(
                rs.getString("description")
        );

        career.setRequiredSkills(
                rs.getString("required_skills")
        );

        if (rs.getTimestamp("created_at") != null) {

            career.setCreatedAt(
                    rs.getTimestamp("created_at")
                            .toLocalDateTime()
            );
        }

        return career;
    }
}