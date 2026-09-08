package org.techhub.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import org.techhub.constants.SubjectResultQueries;
import org.techhub.model.SubjectResult;

@Repository
public class SubjectResultRepository {

    private final JdbcTemplate jdbcTemplate;


    // ============================================================
    // CONSTRUCTOR
    // ============================================================

    public SubjectResultRepository(
            JdbcTemplate jdbcTemplate) {

        this.jdbcTemplate = jdbcTemplate;
    }


    // ============================================================
    // SAVE
    // ============================================================

    public int save(
            SubjectResult subjectResult) {

        return jdbcTemplate.update(

                SubjectResultQueries.INSERT_SUBJECT_RESULT,

                subjectResult.getResultId(),

                subjectResult.getSubject(),

                subjectResult.getTotalQuestions(),

                subjectResult.getCorrectAnswers(),

                subjectResult.getWrongAnswers(),

                subjectResult.getUnanswered(),

                subjectResult.getPercentage()
        );
    }


    // ============================================================
    // FIND BY RESULT ID
    // ============================================================

    public List<SubjectResult> findByResultId(
            int resultId) {

        return jdbcTemplate.query(

                SubjectResultQueries.FIND_BY_RESULT_ID,

                (rs, rowNum) -> {

                    SubjectResult result =
                            new SubjectResult();


                    result.setSubjectResultId(
                            rs.getInt(
                                    "subject_result_id"
                            )
                    );


                    result.setResultId(
                            rs.getInt(
                                    "result_id"
                            )
                    );


                    result.setSubject(
                            rs.getString(
                                    "subject"
                            )
                    );


                    result.setTotalQuestions(
                            rs.getInt(
                                    "total_questions"
                            )
                    );


                    result.setCorrectAnswers(
                            rs.getInt(
                                    "correct_answers"
                            )
                    );


                    result.setWrongAnswers(
                            rs.getInt(
                                    "wrong_answers"
                            )
                    );


                    result.setUnanswered(
                            rs.getInt(
                                    "unanswered"
                            )
                    );


                    result.setPercentage(
                            rs.getBigDecimal(
                                    "percentage"
                            )
                    );


                    return result;
                },

                resultId
        );
    }


    // ============================================================
    // FIND BY SUBJECT RESULT ID
    // ============================================================

    public Optional<SubjectResult> findById(
            int subjectResultId) {

        List<SubjectResult> results =
                jdbcTemplate.query(

                        SubjectResultQueries.FIND_BY_ID,

                        (rs, rowNum) -> {

                            SubjectResult result =
                                    new SubjectResult();


                            result.setSubjectResultId(
                                    rs.getInt(
                                            "subject_result_id"
                                    )
                            );


                            result.setResultId(
                                    rs.getInt(
                                            "result_id"
                                    )
                            );


                            result.setSubject(
                                    rs.getString(
                                            "subject"
                                    )
                            );


                            result.setTotalQuestions(
                                    rs.getInt(
                                            "total_questions"
                                    )
                            );


                            result.setCorrectAnswers(
                                    rs.getInt(
                                            "correct_answers"
                                    )
                            );


                            result.setWrongAnswers(
                                    rs.getInt(
                                            "wrong_answers"
                                    )
                            );


                            result.setUnanswered(
                                    rs.getInt(
                                            "unanswered"
                                    )
                            );


                            result.setPercentage(
                                    rs.getBigDecimal(
                                            "percentage"
                                    )
                            );


                            return result;
                        },

                        subjectResultId
                );


        return results.stream()
                .findFirst();
    }


    // ============================================================
    // DELETE BY RESULT ID
    // ============================================================

    public int deleteByResultId(
            int resultId) {

        return jdbcTemplate.update(

                SubjectResultQueries.DELETE_BY_RESULT_ID,

                resultId
        );
    }
}