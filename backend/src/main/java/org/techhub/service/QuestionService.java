package org.techhub.service;

import java.util.List;

import org.springframework.stereotype.Service;

import org.techhub.dto.request.QuestionRequest;
import org.techhub.dto.response.QuestionResponse;
import org.techhub.repository.QuestionRepository;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;


    // ============================================================
    // CONSTRUCTOR
    // ============================================================

    public QuestionService(
            QuestionRepository questionRepository) {

        this.questionRepository =
                questionRepository;
    }


    // ============================================================
    // ADD QUESTION
    // ============================================================

    public QuestionResponse addQuestion(
            QuestionRequest request) {

        if (request.getStatus() == null ||
                request.getStatus().isBlank()) {

            request.setStatus("ACTIVE");
        }

        int result =
                questionRepository.addQuestion(request);

        if (result == 0) {
            return null;
        }

        return questionRepository
                .getLastInsertedQuestion();
    }


    // ============================================================
    // GET ALL QUESTIONS
    // ============================================================

    public List<QuestionResponse> getAllQuestions() {

        return questionRepository
                .getAllQuestions();
    }


    // ============================================================
    // GET QUESTION BY ID
    // ============================================================

    public QuestionResponse getQuestionById(
            Integer id) {

        return questionRepository
                .getQuestionById(id);
    }


    // ============================================================
    // UPDATE QUESTION
    // ============================================================

    public QuestionResponse updateQuestion(
            Integer id,
            QuestionRequest request) {

        QuestionResponse existingQuestion =
                questionRepository
                        .getQuestionById(id);

        if (existingQuestion == null) {
            return null;
        }

        int result =
                questionRepository.updateQuestion(
                        id,
                        request
                );

        if (result == 0) {
            return null;
        }

        return questionRepository
                .getQuestionById(id);
    }


    // ============================================================
    // DELETE QUESTION
    // ============================================================

    public boolean deleteQuestion(
            Integer id) {

        int result =
                questionRepository
                        .deleteQuestion(id);

        return result > 0;
    }


    // ============================================================
    // UPDATE STATUS
    // ============================================================

    public boolean updateStatus(
            Integer id,
            String status) {

        int result =
                questionRepository.updateStatus(
                        id,
                        status
                );

        return result > 0;
    }


    // ============================================================
    // TOTAL QUESTIONS
    // ============================================================

    public int getTotalQuestions() {

        return questionRepository
                .getTotalQuestions();
    }


    // ============================================================
    // APTITUDE COUNT
    // ============================================================

    public int getAptitudeCount() {

        return questionRepository
                .getCategoryCount("APTITUDE");
    }


    // ============================================================
    // LOGICAL COUNT
    // ============================================================

    public int getLogicalCount() {

        return questionRepository
                .getCategoryCount("LOGICAL");
    }


    // ============================================================
    // TECHNICAL COUNT
    // ============================================================

    public int getTechnicalCount() {

        return questionRepository
                .getCategoryCount("TECHNICAL");
    }


    // ============================================================
    // COMMUNICATION COUNT
    // ============================================================

    public int getCommunicationCount() {

        return questionRepository
                .getCategoryCount("COMMUNICATION");
    }


    // ============================================================
    // EASY QUESTIONS
    // ============================================================

    public List<QuestionResponse> getEasyQuestions() {

        return questionRepository
                .getByDifficulty("EASY");
    }


    // ============================================================
    // MEDIUM QUESTIONS
    // ============================================================

    public List<QuestionResponse> getMediumQuestions() {

        return questionRepository
                .getByDifficulty("MEDIUM");
    }


    // ============================================================
    // HARD QUESTIONS
    // ============================================================

    public List<QuestionResponse> getHardQuestions() {

        return questionRepository
                .getByDifficulty("HARD");
    }


    // ============================================================
    // QUESTIONS BY CATEGORY
    // ============================================================

    public List<QuestionResponse> getByCategory(
            String category) {

        return questionRepository
                .getByCategory(category);
    }
}