package org.techhub.repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import org.techhub.constants.QuestionQueries;
import org.techhub.dto.request.QuestionRequest;
import org.techhub.dto.response.QuestionResponse;

@Repository
public class QuestionRepository {

    private final JdbcTemplate jdbcTemplate;


    // ============================================================
    // CONSTRUCTOR
    // ============================================================

    public QuestionRepository(
            JdbcTemplate jdbcTemplate) {

        this.jdbcTemplate = jdbcTemplate;
    }


    // ============================================================
    // ADD QUESTION
    // ============================================================

    public int addQuestion(
            QuestionRequest request) {

        return jdbcTemplate.update(
                QuestionQueries.INSERT_QUESTION,

                request.getQuestionText(),
                request.getOptionA(),
                request.getOptionB(),
                request.getOptionC(),
                request.getOptionD(),
                request.getCorrectAnswer(),
                request.getCategory(),
                request.getDifficulty(),
                request.getStatus()
        );
    }


    // ============================================================
    // GET LAST INSERTED QUESTION
    // ============================================================

    public QuestionResponse getLastInsertedQuestion() {

        List<QuestionResponse> result =
                jdbcTemplate.query(
                        QuestionQueries.FIND_LAST_INSERTED,
                        this::mapRow
                );

        if (result.isEmpty()) {
            return null;
        }

        return result.get(0);
    }


    // ============================================================
    // GET ALL QUESTIONS
    // ============================================================

    public List<QuestionResponse> getAllQuestions() {

        return jdbcTemplate.query(
                QuestionQueries.FIND_ALL,
                this::mapRow
        );
    }


    // ============================================================
    // GET QUESTION BY ID
    // ============================================================

    public QuestionResponse getQuestionById(
            Integer id) {

        List<QuestionResponse> result =
                jdbcTemplate.query(
                        QuestionQueries.FIND_BY_ID,
                        this::mapRow,
                        id
                );

        if (result.isEmpty()) {
            return null;
        }

        return result.get(0);
    }


    // ============================================================
    // UPDATE QUESTION
    // ============================================================

    public int updateQuestion(
            Integer id,
            QuestionRequest request) {

        return jdbcTemplate.update(
                QuestionQueries.UPDATE_QUESTION,

                request.getQuestionText(),
                request.getOptionA(),
                request.getOptionB(),
                request.getOptionC(),
                request.getOptionD(),
                request.getCorrectAnswer(),
                request.getCategory(),
                request.getDifficulty(),
                request.getStatus(),
                id
        );
    }


    // ============================================================
    // DELETE QUESTION
    // ============================================================

    public int deleteQuestion(
            Integer id) {

        return jdbcTemplate.update(
                QuestionQueries.DELETE_QUESTION,
                id
        );
    }


    // ============================================================
    // UPDATE STATUS
    // ============================================================

    public int updateStatus(
            Integer id,
            String status) {

        return jdbcTemplate.update(
                QuestionQueries.UPDATE_STATUS,
                status,
                id
        );
    }


    // ============================================================
    // TOTAL QUESTIONS
    // ============================================================

    public int getTotalQuestions() {

        Integer count =
                jdbcTemplate.queryForObject(
                        QuestionQueries.COUNT_TOTAL,
                        Integer.class
                );

        return count != null ? count : 0;
    }


    // ============================================================
    // CATEGORY COUNT
    // ============================================================

    public int getCategoryCount(
            String category) {

        Integer count =
                jdbcTemplate.queryForObject(
                        QuestionQueries.COUNT_BY_CATEGORY,
                        Integer.class,
                        category
                );

        return count != null ? count : 0;
    }


    // ============================================================
    // DIFFICULTY COUNT
    // ============================================================

    public int getDifficultyCount(
            String difficulty) {

        Integer count =
                jdbcTemplate.queryForObject(
                        QuestionQueries.COUNT_BY_DIFFICULTY,
                        Integer.class,
                        difficulty
                );

        return count != null ? count : 0;
    }


    // ============================================================
    // STATUS COUNT
    // ============================================================

    public int getStatusCount(
            String status) {

        Integer count =
                jdbcTemplate.queryForObject(
                        QuestionQueries.COUNT_BY_STATUS,
                        Integer.class,
                        status
                );

        return count != null ? count : 0;
    }


    // ============================================================
    // GET QUESTIONS BY DIFFICULTY
    // ============================================================

    public List<QuestionResponse> getByDifficulty(
            String difficulty) {

        return jdbcTemplate.query(
                QuestionQueries.FIND_BY_DIFFICULTY,
                this::mapRow,
                difficulty
        );
    }


    // ============================================================
    // GET QUESTIONS BY CATEGORY
    // ============================================================

    public List<QuestionResponse> getByCategory(
            String category) {

        return jdbcTemplate.query(
                QuestionQueries.FIND_BY_CATEGORY,
                this::mapRow,
                category
        );
    }


    // ============================================================
    // ROW MAPPER
    // ============================================================

    private QuestionResponse mapRow(
            ResultSet rs,
            int rowNum)
            throws SQLException {

        QuestionResponse response =
                new QuestionResponse();

        response.setQuestionId(
                rs.getInt("question_id")
        );

        response.setQuestionText(
                rs.getString("question_text")
        );

        response.setOptionA(
                rs.getString("option_a")
        );

        response.setOptionB(
                rs.getString("option_b")
        );

        response.setOptionC(
                rs.getString("option_c")
        );

        response.setOptionD(
                rs.getString("option_d")
        );

        response.setCorrectAnswer(
                rs.getString("correct_answer")
        );

        response.setCategory(
                rs.getString("category")
        );

        response.setDifficulty(
                rs.getString("difficulty")
        );

        response.setStatus(
                rs.getString("status")
        );

        if (rs.getTimestamp("created_at") != null) {

            response.setCreatedAt(
                    rs.getTimestamp("created_at")
                            .toLocalDateTime()
            );
        }

        if (rs.getTimestamp("updated_at") != null) {

            response.setUpdatedAt(
                    rs.getTimestamp("updated_at")
                            .toLocalDateTime()
            );
        }

        return response;
    }
}