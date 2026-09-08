package org.techhub.repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import org.techhub.constants.AssessmentResultQueries;
import org.techhub.dto.response.AssessmentResultResponse;
import org.techhub.model.AssessmentResult;

@Repository
public class AssessmentResultRepository {

    private final JdbcTemplate jdbcTemplate;


    // ============================================================
    // CONSTRUCTOR
    // ============================================================

    public AssessmentResultRepository(
            JdbcTemplate jdbcTemplate) {

        this.jdbcTemplate = jdbcTemplate;
    }


    // ============================================================
    // SAVE RESULT AND RETURN GENERATED RESULT ID
    // ============================================================

    public int save(AssessmentResult result) {

        KeyHolder keyHolder =
                new GeneratedKeyHolder();


        jdbcTemplate.update(connection -> {

            var preparedStatement =
                    connection.prepareStatement(
                            AssessmentResultQueries.INSERT_RESULT,
                            new String[]{"result_id"}
                    );


            preparedStatement.setInt(
                    1,
                    result.getUserId()
            );


            preparedStatement.setInt(
                    2,
                    result.getTotalQuestions()
            );


            preparedStatement.setInt(
                    3,
                    result.getCorrectAnswers()
            );


            preparedStatement.setInt(
                    4,
                    result.getWrongAnswers()
            );


            preparedStatement.setInt(
                    5,
                    result.getUnanswered()
            );


            preparedStatement.setBigDecimal(
                    6,
                    result.getPercentage()
            );


            return preparedStatement;

        }, keyHolder);


        Number key =
                keyHolder.getKey();


        if (key == null) {

            return 0;
        }


        return key.intValue();
    }


    // ============================================================
    // FIND RESULT BY USER ID
    // ============================================================

    public List<AssessmentResult> findByUserId(
            int userId) {

        return jdbcTemplate.query(

                AssessmentResultQueries.FIND_BY_USER_ID,

                (rs, rowNum) -> mapResult(rs),

                userId
        );
    }


    // ============================================================
    // FIND MY RESULTS
    // ============================================================

    public List<AssessmentResultResponse> findResultsByUserId(
            int userId) {

        return jdbcTemplate.query(

                AssessmentResultQueries.FIND_RESULTS_BY_USER_ID,

                (rs, rowNum) -> mapResponse(rs),

                userId
        );
    }


    // ============================================================
    // FIND RESULT BY ID
    // ============================================================

    public AssessmentResult findById(
            int resultId) {

        List<AssessmentResult> results =
                jdbcTemplate.query(

                        AssessmentResultQueries.FIND_BY_ID,

                        (rs, rowNum) -> mapResult(rs),

                        resultId
                );


        if (results.isEmpty()) {

            return null;
        }


        return results.get(0);
    }


    // ============================================================
    // FIND ALL RESULTS
    // ============================================================

    public List<AssessmentResult> findAllResults() {

        return jdbcTemplate.query(

                AssessmentResultQueries.FIND_ALL_RESULTS,

                (rs, rowNum) -> mapResult(rs)
        );
    }


    // ============================================================
    // FIND ALL RESULTS WITH USER
    // ============================================================

    public List<AssessmentResultResponse>
    findAllResultsWithUser() {

        return jdbcTemplate.query(

                AssessmentResultQueries.FIND_ALL_RESULTS_WITH_USER,

                (rs, rowNum) -> mapResponse(rs)
        );
    }


    // ============================================================
    // MAP RESULT
    // ============================================================

    private AssessmentResult mapResult(
            ResultSet rs) throws SQLException {

        AssessmentResult result =
                new AssessmentResult();


        result.setResultId(
                rs.getInt("result_id")
        );


        result.setUserId(
                rs.getInt("user_id")
        );


        result.setTotalQuestions(
                rs.getInt("total_questions")
        );


        result.setCorrectAnswers(
                rs.getInt("correct_answers")
        );


        result.setWrongAnswers(
                rs.getInt("wrong_answers")
        );


        result.setUnanswered(
                rs.getInt("unanswered")
        );


        result.setPercentage(
                rs.getBigDecimal("percentage")
        );


        if (rs.getTimestamp("completed_at") != null) {

            result.setCompletedAt(
                    rs.getTimestamp("completed_at")
                            .toLocalDateTime()
            );
        }


        return result;
    }


    // ============================================================
    // MAP RESPONSE
    // ============================================================

    private AssessmentResultResponse mapResponse(
            ResultSet rs) throws SQLException {

        AssessmentResultResponse response =
                new AssessmentResultResponse();


        response.setResultId(
                rs.getInt("result_id")
        );


        response.setUserId(
                rs.getInt("user_id")
        );


        response.setUserName(
                rs.getString("name")
        );


        response.setEmail(
                rs.getString("email")
        );


        response.setTotalQuestions(
                rs.getInt("total_questions")
        );


        response.setCorrectAnswers(
                rs.getInt("correct_answers")
        );


        response.setWrongAnswers(
                rs.getInt("wrong_answers")
        );


        response.setUnanswered(
                rs.getInt("unanswered")
        );


        response.setPercentage(
                rs.getBigDecimal("percentage")
        );


        if (rs.getTimestamp("completed_at") != null) {

            response.setCompletedAt(
                    rs.getTimestamp("completed_at")
                            .toLocalDateTime()
            );
        }


        return response;
    }
}