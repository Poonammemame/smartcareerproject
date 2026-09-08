package org.techhub.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import org.techhub.model.AssessmentResult;
import org.techhub.model.SubjectResult;
import org.techhub.model.User;
import org.techhub.repository.UserRepository;
import org.techhub.service.AssessmentResultService;
import org.techhub.service.SubjectResultService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;


@RestController
@RequestMapping("/result/subject")



@Tag(
        name = "Subject Results",
        description = "Section-wise assessment results"
)

public class SubjectResultController {


    private final SubjectResultService subjectResultService;

    private final AssessmentResultService assessmentResultService;

    private final UserRepository userRepository;


    // ============================================================
    // CONSTRUCTOR
    // ============================================================

    public SubjectResultController(

            SubjectResultService subjectResultService,

            AssessmentResultService assessmentResultService,

            UserRepository userRepository) {

        this.subjectResultService =
                subjectResultService;

        this.assessmentResultService =
                assessmentResultService;

        this.userRepository =
                userRepository;
    }


    // ============================================================
    // GET SUBJECT RESULTS BY RESULT ID
    //
    // USER  -> OWN RESULT ONLY
    // ADMIN -> ANY RESULT
    // ============================================================

    @GetMapping("/{resultId:\\d+}")

    @Operation(
            summary = "Get subject-wise results",
            description =
                    "Returns section-wise results for an assessment result. "
                    + "Users can access only their own results. "
                    + "Admins can access any result."
    )

    @SecurityRequirement(
            name = "bearerAuth"
    )

    public ResponseEntity<List<SubjectResult>>
    getByResultId(

            @PathVariable int resultId,

            Authentication authentication) {


        // ========================================================
        // AUTHENTICATION CHECK
        // ========================================================

        if (authentication == null) {

            throw new AccessDeniedException(
                    "Authentication is required"
            );
        }


        // ========================================================
        // FIND MAIN ASSESSMENT RESULT
        // ========================================================

        AssessmentResult assessmentResult =
                assessmentResultService
                        .getById(
                                resultId
                        );


        // ========================================================
        // RESULT NOT FOUND
        // ========================================================

        if (assessmentResult == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }


        // ========================================================
        // CHECK ADMIN ROLE
        // ========================================================

        boolean isAdmin =
                authentication
                        .getAuthorities()
                        .stream()
                        .anyMatch(

                                authority ->
                                        authority
                                                .getAuthority()
                                                .equals(
                                                        "ROLE_ADMIN"
                                                )
                        );


        // ========================================================
        // USER OWNERSHIP CHECK
        //
        // ADMIN can access any result.
        //
        // USER can access only their own result.
        // ========================================================

        if (!isAdmin) {


            int userId =
                    getUserId(
                            authentication
                    );


            if (
                    assessmentResult
                            .getUserId()
                            != userId
            ) {

                throw new AccessDeniedException(
                        "You cannot access this result"
                );
            }
        }


        // ========================================================
        // GET SUBJECT RESULTS
        // ========================================================

        List<SubjectResult> results =
                subjectResultService
                        .getByResultId(
                                resultId
                        );


        // ========================================================
        // RETURN SUBJECT RESULTS
        // ========================================================

        return ResponseEntity.ok(
                results
        );
    }


    // ============================================================
    // GET USER ID FROM JWT
    // ============================================================

    private int getUserId(
            Authentication authentication) {


        // ========================================================
        // AUTHENTICATION CHECK
        // ========================================================

        if (authentication == null) {

            throw new AccessDeniedException(
                    "Authentication is required"
            );
        }


        // ========================================================
        // GET EMAIL FROM JWT
        // ========================================================

        String email =
                authentication.getName();


        // ========================================================
        // FIND USER
        // ========================================================

        User user =
                userRepository
                        .findByEmail(
                                email
                        )
                        .orElseThrow(

                                () ->
                                        new AccessDeniedException(
                                                "User not found"
                                        )
                        );


        // ========================================================
        // RETURN USER ID
        // ========================================================

        return user.getUserId();
    }
}