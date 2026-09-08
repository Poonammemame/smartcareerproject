package org.techhub.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.techhub.model.LearningResource;
import org.techhub.service.LearningResourceService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/resource")
@Tag(name = "Learning Resource Management", description = "APIs for career roadmap learning resources")
public class LearningResourceController {

    private final LearningResourceService learningResourceService;

    public LearningResourceController(LearningResourceService learningResourceService) {
        this.learningResourceService = learningResourceService;
    }

    @Operation(summary = "Get all learning resources")
    @GetMapping("/all")
    public ResponseEntity<List<LearningResource>> getAllResources() {
        return ResponseEntity.ok(learningResourceService.getAllResources());
    }

    @Operation(summary = "Get learning resources for logged in user's recommended career")
    @GetMapping("/my")
    public ResponseEntity<List<LearningResource>> getMyResources(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.ok(learningResourceService.getResourcesByCareerId(7));
        }
        return ResponseEntity.ok(learningResourceService.getMyResources(authentication.getName()));
    }

    @Operation(summary = "Get learning resources by Career ID")
    @GetMapping("/career/{careerId}")
    public ResponseEntity<List<LearningResource>> getResourcesByCareerId(@PathVariable Integer careerId) {
        return ResponseEntity.ok(learningResourceService.getResourcesByCareerId(careerId));
    }

    @Operation(summary = "Get learning resources by Career ID and Stage Number")
    @GetMapping("/career/{careerId}/stage/{stageNumber}")
    public ResponseEntity<List<LearningResource>> getResourcesByCareerAndStage(
            @PathVariable Integer careerId,
            @PathVariable Integer stageNumber) {
        return ResponseEntity.ok(learningResourceService.getResourcesByCareerAndStage(careerId, stageNumber));
    }

    @Operation(summary = "Get learning resource by ID")
    @GetMapping("/{id}")
    public ResponseEntity<LearningResource> getResourceById(@PathVariable Integer id) {
        return learningResourceService.getResourceById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "Add a new learning resource")
    @PostMapping("/add")
    public ResponseEntity<String> addResource(@RequestBody LearningResource resource) {
        int result = learningResourceService.saveResource(resource);
        if (result > 0) {
            return ResponseEntity.ok("Learning resource added successfully");
        }
        return ResponseEntity.badRequest().body("Failed to add learning resource");
    }

    @Operation(summary = "Update an existing learning resource")
    @PutMapping("/update")
    public ResponseEntity<String> updateResource(@RequestBody LearningResource resource) {
        int result = learningResourceService.updateResource(resource);
        if (result > 0) {
            return ResponseEntity.ok("Learning resource updated successfully");
        }
        return ResponseEntity.badRequest().body("Failed to update learning resource");
    }

    @Operation(summary = "Delete learning resource by ID")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteResource(@PathVariable Integer id) {
        int result = learningResourceService.deleteResource(id);
        if (result > 0) {
            return ResponseEntity.ok("Learning resource deleted successfully");
        }
        return ResponseEntity.badRequest().body("Failed to delete learning resource");
    }

    @Operation(summary = "Get total learning resources count")
    @GetMapping("/total")
    public ResponseEntity<Integer> getTotalResources() {
        return ResponseEntity.ok(learningResourceService.getTotalResources());
    }
}
