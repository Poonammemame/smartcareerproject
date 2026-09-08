package org.techhub.repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import org.techhub.constants.RecommendationQueries;
import org.techhub.model.Recommendation;

@Repository
public class RecommendationRepository {

    private final JdbcTemplate jdbcTemplate;

    public RecommendationRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }


    // ==========================================
    // SAVE
    // ==========================================

    public int save(Recommendation recommendation) {

        return jdbcTemplate.update(
                RecommendationQueries.INSERT_RECOMMENDATION,
                recommendation.getUserId(),
                recommendation.getCareerId(),
                recommendation.getMatchPercentage(),
                recommendation.getReason()
        );
    }


    // ==========================================
    // FIND BY USER
    // ==========================================

    public List<Recommendation> findByUserId(Integer userId) {

        return jdbcTemplate.query(
                RecommendationQueries.FIND_BY_USER_ID,
                this::mapRow,
                userId
        );
    }


    // ==========================================
    // FIND BY ID
    // ==========================================

    public Optional<Recommendation> findById(
            Integer recommendationId) {

        List<Recommendation> list =
                jdbcTemplate.query(
                        RecommendationQueries.FIND_BY_ID,
                        this::mapRow,
                        recommendationId
                );

        return list.stream().findFirst();
    }


    // ==========================================
    // FIND ALL
    // ==========================================

    public List<Recommendation> findAll() {

        return jdbcTemplate.query(
                RecommendationQueries.FIND_ALL,
                this::mapRow
        );
    }


    // ==========================================
    // DELETE BY USER
    // ==========================================

    public int deleteByUserId(Integer userId) {

        return jdbcTemplate.update(
                RecommendationQueries.DELETE_BY_USER_ID,
                userId
        );
    }


    // ==========================================
    // ROW MAPPER
    // ==========================================

    private Recommendation mapRow(
            ResultSet rs,
            int rowNum) throws SQLException {

        Recommendation recommendation =
                new Recommendation();

        recommendation.setRecommendationId(
                rs.getInt("recommendation_id")
        );

        recommendation.setUserId(
                rs.getInt("user_id")
        );

        recommendation.setUserName(
                rs.getString("user_name")
        );

        recommendation.setCareerId(
                rs.getInt("career_id")
        );

        recommendation.setCareerName(
                rs.getString("career_name")
        );

        recommendation.setDescription(
                rs.getString("description")
        );

        recommendation.setRequiredSkills(
                rs.getString("required_skills")
        );

        recommendation.setMatchPercentage(
                rs.getBigDecimal("match_percentage")
        );

        recommendation.setReason(
                rs.getString("reason")
        );

        if (rs.getTimestamp("recommended_at") != null) {

            recommendation.setRecommendedAt(
                    rs.getTimestamp("recommended_at")
                            .toLocalDateTime()
            );
        }

        return recommendation;
    }
}