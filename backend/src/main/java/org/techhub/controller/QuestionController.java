package org.techhub.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.techhub.dto.request.QuestionRequest;
import org.techhub.dto.response.QuestionResponse;
import org.techhub.service.QuestionService;

@RestController
@RequestMapping("/question")



@Tag(
        name = "Question Management",
        description = "APIs for managing assessment questions"
)

@SecurityRequirement(name = "bearerAuth")
public class QuestionController {

    private final QuestionService questionService;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public QuestionController(
            QuestionService questionService) {

        this.questionService =
                questionService;
    }


    // =========================================================
    // ADD QUESTION
    // POST /question/add
    // =========================================================

    @Operation(
            summary = "Add question",
            description = "Admin can add a new assessment question"
    )

    @PostMapping("/add")
    public ResponseEntity<?> addQuestion(
            @RequestBody QuestionRequest request) {

        QuestionResponse response =
                questionService.addQuestion(request);

        if (response == null) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Question could not be added");
        }

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // =========================================================
    // GET ALL QUESTIONS
    // GET /question/all
    // =========================================================

    @Operation(
            summary = "Get all questions",
            description = "Returns all assessment questions"
    )

    @GetMapping("/all")
    public ResponseEntity<List<QuestionResponse>>
            getAllQuestions() {

        return ResponseEntity.ok(
                questionService.getAllQuestions()
        );
    }


    // =========================================================
    // GET QUESTION BY ID
    // GET /question/search/{id}
    // =========================================================

    @Operation(
            summary = "Get question by ID",
            description = "Find an assessment question using question ID"
    )

    @GetMapping("/search/{id}")
    public ResponseEntity<?> getQuestionById(
            @PathVariable Integer id) {

        QuestionResponse response =
                questionService.getQuestionById(id);

        if (response == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Question not found");
        }

        return ResponseEntity.ok(response);
    }


    // =========================================================
    // UPDATE QUESTION
    // PUT /question/update?id=1
    // =========================================================

    @Operation(
            summary = "Update question",
            description = "Admin can update an existing assessment question"
    )

    @PutMapping("/update")
    public ResponseEntity<?> updateQuestion(
            @RequestParam Integer id,
            @RequestBody QuestionRequest request) {

        QuestionResponse response =
                questionService.updateQuestion(
                        id,
                        request
                );

        if (response == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Question not found");
        }

        return ResponseEntity.ok(response);
    }


    // =========================================================
    // DELETE QUESTION
    // DELETE /question/delete/{id}
    // =========================================================

    @Operation(
            summary = "Delete question",
            description = "Delete an assessment question using question ID"
    )

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteQuestion(
            @PathVariable Integer id) {

        boolean deleted =
                questionService.deleteQuestion(id);

        if (!deleted) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Question not found");
        }

        return ResponseEntity.ok(
                "Question deleted successfully"
        );
    }


    // =========================================================
    // UPDATE STATUS
    // PUT /question/status/{id}/{status}
    // =========================================================

    @Operation(
            summary = "Update question status",
            description = "Activate or deactivate a question"
    )

    @PutMapping("/status/{id}/{status}")
    public ResponseEntity<?> updateStatus(
            @PathVariable Integer id,
            @PathVariable String status) {

        if (!status.equals("ACTIVE") &&
                !status.equals("INACTIVE")) {

            return ResponseEntity
                    .badRequest()
                    .body("Invalid status");
        }

        boolean updated =
                questionService.updateStatus(
                        id,
                        status
                );

        if (!updated) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Question not found");
        }

        return ResponseEntity.ok(
                "Question status updated successfully"
        );
    }


    // =========================================================
    // TOTAL QUESTIONS
    // GET /question/total
    // =========================================================

    @Operation(
            summary = "Get total questions",
            description = "Returns total number of questions"
    )

    @GetMapping("/total")
    public ResponseEntity<Integer>
            getTotalQuestions() {

        return ResponseEntity.ok(
                questionService.getTotalQuestions()
        );
    }


    // =========================================================
    // APTITUDE COUNT
    // GET /question/count/aptitude
    // =========================================================

    @Operation(
            summary = "Get aptitude question count",
            description = "Returns total aptitude questions"
    )

    @GetMapping("/count/aptitude")
    public ResponseEntity<Integer>
            getAptitudeCount() {

        return ResponseEntity.ok(
                questionService.getAptitudeCount()
        );
    }


    // =========================================================
    // LOGICAL COUNT
    // GET /question/count/logical
    // =========================================================

    @Operation(
            summary = "Get logical question count",
            description = "Returns total logical reasoning questions"
    )

    @GetMapping("/count/logical")
    public ResponseEntity<Integer>
            getLogicalCount() {

        return ResponseEntity.ok(
                questionService.getLogicalCount()
        );
    }


    // =========================================================
    // TECHNICAL COUNT
    // GET /question/count/technical
    // =========================================================

    @Operation(
            summary = "Get technical question count",
            description = "Returns total technical questions"
    )

    @GetMapping("/count/technical")
    public ResponseEntity<Integer>
            getTechnicalCount() {

        return ResponseEntity.ok(
                questionService.getTechnicalCount()
        );
    }


    // =========================================================
    // COMMUNICATION COUNT
    // GET /question/count/communication
    // =========================================================

    @Operation(
            summary = "Get communication question count",
            description = "Returns total communication questions"
    )

    @GetMapping("/count/communication")
    public ResponseEntity<Integer>
            getCommunicationCount() {

        return ResponseEntity.ok(
                questionService.getCommunicationCount()
        );
    }


    // =========================================================
    // EASY QUESTIONS
    // GET /question/easy
    // =========================================================

    @Operation(
            summary = "Get easy questions",
            description = "Returns all easy-level questions"
    )

    @GetMapping("/easy")
    public ResponseEntity<List<QuestionResponse>>
            getEasyQuestions() {

        return ResponseEntity.ok(
                questionService.getEasyQuestions()
        );
    }


    // =========================================================
    // MEDIUM QUESTIONS
    // GET /question/medium
    // =========================================================

    @Operation(
            summary = "Get medium questions",
            description = "Returns all medium-level questions"
    )

    @GetMapping("/medium")
    public ResponseEntity<List<QuestionResponse>>
            getMediumQuestions() {

        return ResponseEntity.ok(
                questionService.getMediumQuestions()
        );
    }


    // =========================================================
    // HARD QUESTIONS
    // GET /question/hard
    // =========================================================

    @Operation(
            summary = "Get hard questions",
            description = "Returns all hard-level questions"
    )

    @GetMapping("/hard")
    public ResponseEntity<List<QuestionResponse>>
            getHardQuestions() {

        return ResponseEntity.ok(
                questionService.getHardQuestions()
        );
    }


    // =========================================================
    // QUESTIONS BY CATEGORY
    // GET /question/category/{category}
    // =========================================================

    @Operation(
            summary = "Get questions by category",
            description = "Returns questions for a specific category"
    )

    @GetMapping("/category/{category}")
    public ResponseEntity<List<QuestionResponse>>
            getByCategory(
                    @PathVariable String category) {

        return ResponseEntity.ok(
                questionService.getByCategory(category)
        );
    }
}