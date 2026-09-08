package org.techhub.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import org.techhub.dto.request.AssessmentResultRequest;
import org.techhub.dto.response.AssessmentResultResponse;
import org.techhub.model.AssessmentResult;
import org.techhub.model.User;
import org.techhub.repository.UserRepository;
import org.techhub.service.AssessmentResultService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;


@RestController
@RequestMapping("/result")



@Tag(
        name = "Assessment Results",
        description = "APIs for assessment results"
)

public class AssessmentResultController {


    private final AssessmentResultService resultService;

    private final UserRepository userRepository;


    // ============================================================
    // CONSTRUCTOR
    // ============================================================

    public AssessmentResultController(

            AssessmentResultService resultService,

            UserRepository userRepository) {

        this.resultService =
                resultService;

        this.userRepository =
                userRepository;
    }


    // ============================================================
    // SAVE COMPLETE RESULT
    // ============================================================

    @PostMapping("/save")

    @Operation(
            summary = "Save complete assessment result"
    )

    @SecurityRequirement(
            name = "bearerAuth"
    )

    public ResponseEntity<?> saveResult(

            @RequestBody AssessmentResultRequest request,

            Authentication authentication) {


        // ========================================================
        // GET LOGGED-IN USER
        // ========================================================

        int userId =
                getUserId(authentication);


        // ========================================================
        // VALIDATE REQUEST
        // ========================================================

        if (request == null) {

            return ResponseEntity.badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Request is required"
                            )
                    );
        }


        // ========================================================
        // CREATE MAIN RESULT
        // ========================================================

        AssessmentResult result =
                new AssessmentResult();


        result.setUserId(
                userId
        );


        result.setTotalQuestions(
                request.getTotalQuestions()
        );


        result.setCorrectAnswers(
                request.getCorrectAnswers()
        );


        result.setWrongAnswers(
                request.getWrongAnswers()
        );


        result.setUnanswered(
                request.getUnanswered()
        );


        result.setPercentage(
                request.getPercentage()
        );


        // ========================================================
        // SAVE MAIN + SUBJECT RESULTS
        // ========================================================

        int resultId =
                resultService.saveCompleteResult(

                        result,

                        request.getSubjectResults()
                );


        // ========================================================
        // RESPONSE
        // ========================================================

        return ResponseEntity.ok(

                Map.of(

                        "message",
                        "Assessment result saved successfully",

                        "resultId",
                        resultId
                )
        );
    }


    // ============================================================
    // GET MY RESULTS
    // ============================================================

    @GetMapping("/my")

    @Operation(
            summary = "Get my assessment results"
    )

    @SecurityRequirement(
            name = "bearerAuth"
    )

    public ResponseEntity<List<AssessmentResultResponse>>
    getMyResults(

            Authentication authentication) {


        int userId =
                getUserId(authentication);


        return ResponseEntity.ok(

                resultService.getMyResults(
                        userId
                )
        );
    }


    // ============================================================
    // GET ALL RESULTS
    // ADMIN ONLY
    // ============================================================

    @GetMapping("/all")

    @Operation(
            summary = "Get all assessment results"
    )

    @SecurityRequirement(
            name = "bearerAuth"
    )

    public ResponseEntity<List<AssessmentResultResponse>>
    getAllResults() {


        return ResponseEntity.ok(

                resultService
                        .getAllResultsWithUser()
        );
    }


    // ============================================================
    // GET RESULT BY ID
    // USER = OWN RESULT ONLY
    // ADMIN = ANY RESULT
    // ============================================================

    @GetMapping("/{resultId:\\d+}")

    @Operation(
            summary = "Get assessment result by ID"
    )

    @SecurityRequirement(
            name = "bearerAuth"
    )

    public ResponseEntity<AssessmentResult>
    getResultById(

            @PathVariable Integer resultId,

            Authentication authentication) {


        // ========================================================
        // FIND RESULT
        // ========================================================

        AssessmentResult result =
                resultService.getById(
                        resultId
                );


        if (result == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }


        // ========================================================
        // ADMIN CAN VIEW ANY RESULT
        // ========================================================

        if (
                authentication != null
                &&
                authentication.getAuthorities()
                        .stream()
                        .anyMatch(
                                authority ->
                                        authority.getAuthority()
                                                .equals("ROLE_ADMIN")
                        )
        ) {

            return ResponseEntity.ok(
                    result
            );
        }


        // ========================================================
        // USER OWNERSHIP CHECK
        // ========================================================

        int loggedInUserId =
                getUserId(authentication);


        if (
                result.getUserId()
                        != loggedInUserId
        ) {

            throw new AccessDeniedException(
                    "You cannot access this result"
            );
        }


        // ========================================================
        // RETURN OWN RESULT
        // ========================================================

        return ResponseEntity.ok(
                result
        );
    }


    // ============================================================
    // GET USER ID FROM JWT
    // ============================================================

    private int getUserId(
            Authentication authentication) {


        if (authentication == null) {

            throw new AccessDeniedException(
                    "Authentication is required"
            );
        }


        String email =
                authentication.getName();


        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(

                                () ->
                                        new AccessDeniedException(
                                                "User not found"
                                        )
                        );


        return user.getUserId();
    }
}