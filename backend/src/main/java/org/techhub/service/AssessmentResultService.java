package org.techhub.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.techhub.dto.request.AssessmentResultRequest;
import org.techhub.dto.request.SubjectResultRequest;
import org.techhub.dto.response.AssessmentResultResponse;
import org.techhub.model.AssessmentResult;
import org.techhub.model.SubjectResult;
import org.techhub.repository.AssessmentResultRepository;
import org.techhub.repository.SubjectResultRepository;

@Service
public class AssessmentResultService {


    private final AssessmentResultRepository resultRepository;

    private final SubjectResultRepository subjectResultRepository;


    // ============================================================
    // CONSTRUCTOR
    // ============================================================

    public AssessmentResultService(

            AssessmentResultRepository resultRepository,

            SubjectResultRepository subjectResultRepository) {

        this.resultRepository =
                resultRepository;

        this.subjectResultRepository =
                subjectResultRepository;
    }


    // ============================================================
    // SAVE COMPLETE ASSESSMENT RESULT
    // ============================================================

    @Transactional
    public int saveCompleteResult(

            AssessmentResult result,

            List<SubjectResultRequest> subjectResults) {


        // ========================================================
        // SAVE MAIN RESULT
        // ========================================================

        int resultId =
                resultRepository.save(
                        result
                );


        if (resultId <= 0) {

            throw new RuntimeException(
                    "Failed to save assessment result"
            );
        }


        // ========================================================
        // SAVE SUBJECT RESULTS
        // ========================================================

        if (subjectResults != null &&
                !subjectResults.isEmpty()) {


            for (
                    SubjectResultRequest request
                    : subjectResults) {


                SubjectResult subjectResult =
                        new SubjectResult();


                subjectResult.setResultId(
                        resultId
                );


                subjectResult.setSubject(
                        request.getSubject()
                );


                subjectResult.setTotalQuestions(
                        request.getTotalQuestions()
                );


                subjectResult.setCorrectAnswers(
                        request.getCorrectAnswers()
                );


                subjectResult.setWrongAnswers(
                        request.getWrongAnswers()
                );


                subjectResult.setUnanswered(
                        request.getUnanswered()
                );


                subjectResult.setPercentage(
                        request.getPercentage()
                );


                int rows =
                        subjectResultRepository.save(
                                subjectResult
                        );


                if (rows <= 0) {

                    throw new RuntimeException(
                            "Failed to save subject result: "
                                    + request.getSubject()
                    );
                }
            }
        }


        return resultId;
    }


    // ============================================================
    // OLD SAVE METHOD
    // ============================================================

    public int saveResult(
            AssessmentResult result) {

        return resultRepository.save(
                result
        );
    }


    // ============================================================
    // GET MY RESULTS
    // ============================================================

    public List<AssessmentResultResponse>
    getMyResults(int userId) {

        return resultRepository
                .findResultsByUserId(
                        userId
                );
    }


    // ============================================================
    // GET BY ID
    // ============================================================

    public AssessmentResult getById(
            int resultId) {

        return resultRepository.findById(
                resultId
        );
    }


    // ============================================================
    // GET ALL
    // ============================================================

    public List<AssessmentResultResponse>
    getAllResultsWithUser() {

        return resultRepository
                .findAllResultsWithUser();
    }


    // ============================================================
    // GET ALL MODEL RESULTS
    // ============================================================

    public List<AssessmentResult>
    getAllResults() {

        return resultRepository
                .findAllResults();
    }
}