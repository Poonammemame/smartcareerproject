package org.techhub.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import org.techhub.model.Recommendation;
import org.techhub.model.User;
import org.techhub.repository.UserRepository;
import org.techhub.service.CareerRecommendationService;
import org.techhub.service.RecommendationService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;


@RestController
@RequestMapping("/recommendation")


@Tag(
        name = "Career Recommendation",
        description = "APIs for generating and managing career recommendations"
)

@SecurityRequirement(name = "bearerAuth")
public class RecommendationController {


    private final RecommendationService recommendationService;

    private final UserRepository userRepository;

    private final CareerRecommendationService
            careerRecommendationService;


    public RecommendationController(
            RecommendationService recommendationService,
            UserRepository userRepository,
            CareerRecommendationService careerRecommendationService) {

        this.recommendationService =
                recommendationService;

        this.userRepository =
                userRepository;

        this.careerRecommendationService =
                careerRecommendationService;
    }


    // =========================================================
    // GET LOGGED-IN USER EMAIL
    // =========================================================

    private String getLoggedInEmail() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        return authentication.getName();
    }


    // =========================================================
    // SAVE RECOMMENDATION
    // =========================================================

    @Operation(
            summary = "Save career recommendation",
            description =
                    "Saves a career recommendation for a user."
    )

    @ApiResponses({

        @ApiResponse(
                responseCode = "200",
                description =
                        "Recommendation saved successfully"
        ),

        @ApiResponse(
                responseCode = "400",
                description =
                        "Failed to save recommendation"
        ),

        @ApiResponse(
                responseCode = "401",
                description =
                        "Unauthorized"
        ),

        @ApiResponse(
                responseCode = "403",
                description =
                        "Access denied"
        )

    })

    @PostMapping("/save")
    public ResponseEntity<String> saveRecommendation(

            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description =
                            "Recommendation information",
                    required = true,
                    content = @Content(
                            schema =
                            @Schema(
                                    implementation =
                                    Recommendation.class
                            )
                    )
            )

            @RequestBody Recommendation recommendation) {


        int result =
                recommendationService
                        .saveRecommendation(
                                recommendation
                        );


        if (result > 0) {

            return ResponseEntity.ok(
                    "Recommendation saved successfully"
            );
        }


        return ResponseEntity
                .badRequest()
                .body(
                        "Failed to save recommendation"
                );
    }


    // =========================================================
    // GET MY RECOMMENDATIONS
    // =========================================================

    @Operation(
            summary = "Get my recommendations",
            description =
                    "Returns all career recommendations "
                    + "belonging to the currently logged-in user."
    )

    @ApiResponses({

        @ApiResponse(
                responseCode = "200",
                description =
                        "Recommendations retrieved successfully"
        ),

        @ApiResponse(
                responseCode = "401",
                description =
                        "Unauthorized"
        ),

        @ApiResponse(
                responseCode = "403",
                description =
                        "Access denied"
        )

    })

    @GetMapping("/my")
    public ResponseEntity<List<Recommendation>>
            getMyRecommendations() {


        String email =
                getLoggedInEmail();


        List<Recommendation> recommendations =
                recommendationService
                        .getByEmail(email);


        return ResponseEntity.ok(
                recommendations
        );
    }


    // =========================================================
    // GET RECOMMENDATION BY ID
    // =========================================================

    @Operation(
            summary = "Get recommendation by ID",
            description =
                    "Returns a specific career recommendation "
                    + "using its recommendation ID."
    )

    @ApiResponses({

        @ApiResponse(
                responseCode = "200",
                description =
                        "Recommendation found"
        ),

        @ApiResponse(
                responseCode = "404",
                description =
                        "Recommendation not found"
        ),

        @ApiResponse(
                responseCode = "401",
                description =
                        "Unauthorized"
        ),

        @ApiResponse(
                responseCode = "403",
                description =
                        "Access denied"
        )

    })

    @GetMapping("/{id}")
    public ResponseEntity<Recommendation> getById(

            @Parameter(
                    description =
                            "Recommendation ID",
                    required = true,
                    example = "1"
            )

            @PathVariable Integer id) {


        return recommendationService
                .getById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }


    // =========================================================
    // GET ALL RECOMMENDATIONS
    // =========================================================

    @Operation(
            summary = "Get all recommendations",
            description =
                    "Returns all career recommendations. "
                    + "This endpoint is intended for administrators."
    )

    @ApiResponses({

        @ApiResponse(
                responseCode = "200",
                description =
                        "All recommendations retrieved successfully"
        ),

        @ApiResponse(
                responseCode = "401",
                description =
                        "Unauthorized"
        ),

        @ApiResponse(
                responseCode = "403",
                description =
                        "Admin access required"
        )

    })

    @GetMapping("/all")
    public ResponseEntity<List<Recommendation>> getAll() {


        return ResponseEntity.ok(
                recommendationService.getAll()
        );
    }


    // =========================================================
    // GENERATE AUTOMATIC RECOMMENDATION
    // =========================================================

    @Operation(
            summary = "Generate career recommendation",
            description =
                    "Automatically generates a career recommendation "
                    + "for the logged-in user based on the user's "
                    + "career profile and assessment performance."
    )

    @ApiResponses({

        @ApiResponse(
                responseCode = "200",
                description =
                        "Career recommendation generated successfully"
        ),

        @ApiResponse(
                responseCode = "400",
                description =
                        "Failed to generate recommendation"
        ),

        @ApiResponse(
                responseCode = "401",
                description =
                        "Unauthorized"
        ),

        @ApiResponse(
                responseCode = "403",
                description =
                        "User access required"
        )

    })

    @PostMapping("/generate")
    public ResponseEntity<String>
            generateRecommendation(
                    Authentication authentication) {


        String email =
                authentication.getName();


        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found: "
                                        + email
                                )
                        );


        int result =
                careerRecommendationService
                        .generateRecommendation(
                                user.getUserId()
                        );


        if (result > 0) {

            return ResponseEntity.ok(
                    "Career recommendation generated successfully"
            );
        }


        return ResponseEntity
                .badRequest()
                .body(
                        "Failed to generate recommendation"
                );
    }
}