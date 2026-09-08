package org.techhub.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.techhub.model.Career;
import org.techhub.service.CareerService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;


@RestController
@RequestMapping("/career")



@Tag(
    name = "Career Management",
    description = "APIs for managing career information"
)
public class CareerController {


    private final CareerService careerService;


    public CareerController(
            CareerService careerService) {

        this.careerService = careerService;
    }


    // ============================================================
    // ADD CAREER
    // ============================================================

    @Operation(
        summary = "Add a new career",
        description = "Creates and stores a new career in the database."
    )

    @ApiResponses({

        @ApiResponse(
            responseCode = "200",
            description = "Career added successfully"
        ),

        @ApiResponse(
            responseCode = "400",
            description = "Failed to add career"
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

    @PostMapping("/add")

    public ResponseEntity<String> addCareer(

            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Career details",
                required = true,
                content = @Content(
                    schema = @Schema(
                        implementation = Career.class
                    )
                )
            )

            @RequestBody Career career) {


        int result =
                careerService.saveCareer(career);


        if (result > 0) {

            return ResponseEntity.ok(
                "Career added successfully"
            );
        }


        return ResponseEntity
                .badRequest()
                .body(
                    "Failed to add career"
                );
    }


    // ============================================================
    // GET ALL CAREERS
    // ============================================================

    @Operation(
        summary = "Get all careers",
        description = "Returns all careers stored in the database."
    )

    @ApiResponses({

        @ApiResponse(
            responseCode = "200",
            description = "Careers retrieved successfully"
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

    @GetMapping("/all")

    public ResponseEntity<List<Career>> getAllCareers() {

        return ResponseEntity.ok(
            careerService.getAllCareers()
        );
    }


    // ============================================================
    // GET CAREER BY ID
    // ============================================================

    @Operation(
        summary = "Get career by ID",
        description = "Returns a specific career using its career ID."
    )

    @ApiResponses({

        @ApiResponse(
            responseCode = "200",
            description = "Career found"
        ),

        @ApiResponse(
            responseCode = "404",
            description = "Career not found"
        ),

        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized"
        )
    })

    @GetMapping("/{id}")

    public ResponseEntity<Career> getCareerById(

            @Parameter(
                description = "Career ID",
                example = "1",
                required = true
            )

            @PathVariable Integer id) {


        return careerService
                .getCareerById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                    ResponseEntity
                        .notFound()
                        .build()
                );
    }


    // ============================================================
    // SEARCH CAREER
    // ============================================================

    @Operation(
        summary = "Search careers",
        description = "Searches careers by career name."
    )

    @ApiResponses({

        @ApiResponse(
            responseCode = "200",
            description = "Search completed successfully"
        ),

        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized"
        )
    })

    @GetMapping("/search/{name}")

    public ResponseEntity<List<Career>> searchCareer(

            @Parameter(
                description = "Career name or keyword",
                example = "Java"
            )

            @PathVariable String name) {


        return ResponseEntity.ok(
            careerService.searchCareer(name)
        );
    }


    // ============================================================
    // UPDATE CAREER
    // ============================================================

    @Operation(
        summary = "Update career",
        description = "Updates an existing career using career ID."
    )

    @ApiResponses({

        @ApiResponse(
            responseCode = "200",
            description = "Career updated successfully"
        ),

        @ApiResponse(
            responseCode = "400",
            description = "Career not found or update failed"
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

    @PutMapping("/update")

    public ResponseEntity<String> updateCareer(

            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Updated career details",
                required = true,
                content = @Content(
                    schema = @Schema(
                        implementation = Career.class
                    )
                )
            )

            @RequestBody Career career) {


        int result =
                careerService.updateCareer(career);


        if (result > 0) {

            return ResponseEntity.ok(
                "Career updated successfully"
            );
        }


        return ResponseEntity
                .badRequest()
                .body(
                    "Career not found or update failed"
                );
    }


    // ============================================================
    // DELETE CAREER
    // ============================================================

    @Operation(
        summary = "Delete career",
        description = "Deletes a career using career ID."
    )

    @ApiResponses({

        @ApiResponse(
            responseCode = "200",
            description = "Career deleted successfully"
        ),

        @ApiResponse(
            responseCode = "400",
            description = "Career not found or delete failed"
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

    @DeleteMapping("/delete/{id}")

    public ResponseEntity<String> deleteCareer(

            @Parameter(
                description = "Career ID to delete",
                example = "1",
                required = true
            )

            @PathVariable Integer id) {


        int result =
                careerService.deleteCareer(id);


        if (result > 0) {

            return ResponseEntity.ok(
                "Career deleted successfully"
            );
        }


        return ResponseEntity
                .badRequest()
                .body(
                    "Career not found or delete failed"
                );
    }


    // ============================================================
    // TOTAL CAREERS
    // ============================================================

    @Operation(
        summary = "Get total number of careers",
        description = "Returns the total number of careers stored in the database."
    )

    @ApiResponses({

        @ApiResponse(
            responseCode = "200",
            description = "Total careers retrieved successfully"
        ),

        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized"
        )
    })

    @GetMapping("/total")

    public ResponseEntity<Integer> getTotalCareers() {

        return ResponseEntity.ok(
            careerService.getTotalCareers()
        );
    }
}