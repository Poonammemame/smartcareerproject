package org.techhub.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.techhub.model.AssessmentAssignment;
import org.techhub.service.AssessmentAssignmentService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/assessment")

@Tag(
        name = "Assessment Assignment",
        description = "APIs for assigning and checking online assessments"
)
public class AssessmentAssignmentController {

    private final AssessmentAssignmentService service;

    public AssessmentAssignmentController(
            AssessmentAssignmentService service) {

        this.service = service;
    }

    // =====================================================
    // ASSIGN ASSESSMENT
    // ADMIN
    // PUT /assessment/assign/{userId}
    // =====================================================

    @PutMapping("/assign/{userId}")
    @Operation(
            summary = "Assign assessment to user",
            description = "Assigns an assessment to a specific user"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Assessment assigned successfully"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Assessment is already assigned"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized"
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Admin access required"
            )
    })
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<String> assignAssessment(
            @PathVariable int userId) {

        int rows =
                service.assignAssessment(userId);

        if (rows > 0) {

            return ResponseEntity.ok(
                    "Assessment assigned successfully"
            );
        }

        return ResponseEntity.badRequest().body(
                "Assessment is already assigned to this user"
        );
    }

    // =====================================================
    // CHECK USER ASSIGNMENT
    // USER + ADMIN
    // GET /assessment/status/{userId}
    // =====================================================

    @GetMapping("/status/{userId}")
    @Operation(
            summary = "Check assessment assignment status",
            description = "Checks whether an assessment has been assigned to a user"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Assignment status retrieved successfully"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized"
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Access denied"
            )
    })
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Boolean> checkStatus(
            @PathVariable int userId) {

        return ResponseEntity.ok(
                service.isAssigned(userId)
        );
    }

    // =====================================================
    // USER ASSIGNMENTS
    // USER + ADMIN
    // GET /assessment/user/{userId}
    // =====================================================

    @GetMapping("/user/{userId}")
    @Operation(
            summary = "Get user assessment assignments",
            description = "Retrieves assessment assignments for a specific user"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Assignments retrieved successfully"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized"
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Access denied"
            )
    })
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<List<AssessmentAssignment>> getUserAssignments(
            @PathVariable int userId) {

        return ResponseEntity.ok(
                service.getByUserId(userId)
        );
    }

    // =====================================================
    // ALL ASSIGNMENTS
    // ADMIN
    // GET /assessment/all
    // =====================================================

    @GetMapping("/all")
    @Operation(
            summary = "Get all assessment assignments",
            description = "Retrieves all assessment assignments for administrators"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "All assignments retrieved successfully"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized"
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Admin access required"
            )
    })
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<List<AssessmentAssignment>> getAll() {

        return ResponseEntity.ok(
                service.getAll()
        );
    }
 // =====================================================
 // COMPLETE ASSESSMENT
 // USER
 // PUT /assessment/complete/{assignmentId}
 // =====================================================

 @PutMapping("/complete/{assignmentId}")
 @Operation(
         summary = "Complete assessment assignment",
         description = "Marks an assigned assessment as completed"
 )
 @ApiResponses({
         @ApiResponse(
                 responseCode = "200",
                 description = "Assessment marked as completed"
         ),
         @ApiResponse(
                 responseCode = "400",
                 description = "Unable to update assessment"
         ),
         @ApiResponse(
                 responseCode = "401",
                 description = "Unauthorized"
         )
 })
 @SecurityRequirement(name = "bearerAuth")
 public ResponseEntity<String> completeAssessment(
         @PathVariable int assignmentId) {

     int result =
             service.updateStatus(
                     assignmentId,
                     "COMPLETED"
             );

     if (result > 0) {

         return ResponseEntity.ok(
                 "Assessment completed successfully"
         );
     }

     return ResponseEntity.badRequest().body(
             "Unable to complete assessment"
     );
 }
}