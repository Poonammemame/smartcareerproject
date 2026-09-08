package org.techhub.controller;

import java.util.List;

import org.techhub.model.User;
import org.techhub.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/user")

@Tag(name = "User Management", description = "Admin APIs for managing users")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ==========================================
    // GET ALL USERS
    // ==========================================

    @Operation(summary = "Get all users")
    @ApiResponse(responseCode = "200", description = "Users retrieved successfully")
    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {

        return ResponseEntity.ok(userService.getAllUsers());
    }

    // ==========================================
    // GET USER BY ID
    // ==========================================

    @Operation(summary = "Get user by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User found"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/search/{id}")
    public ResponseEntity<?> getUserById(@PathVariable int id) {

        User user = userService.getUserById(id);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found");
        }

        return ResponseEntity.ok(user);
    }

    // ==========================================
    // DELETE USER
    // ==========================================

    @Operation(summary = "Delete user")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User deleted"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable int id) {

        boolean deleted = userService.deleteUser(id);

        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found");
        }

        return ResponseEntity.ok("User deleted successfully");
    }

    // ==========================================
    // UPDATE USER STATUS
    // ==========================================

    @Operation(summary = "Update user status")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Status updated"),
            @ApiResponse(responseCode = "400", description = "Invalid status"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PutMapping("/status/{id}/{status}")
    public ResponseEntity<String> updateStatus(
            @PathVariable int id,
            @PathVariable String status) {

        if (!status.equalsIgnoreCase("ACTIVE")
                && !status.equalsIgnoreCase("INACTIVE")) {

            return ResponseEntity.badRequest()
                    .body("Status must be ACTIVE or INACTIVE");
        }

        boolean updated = userService.updateUserStatus(
                id,
                status.toUpperCase());

        if (!updated) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found");
        }

        return ResponseEntity.ok("User status updated successfully");
    }

    // ==========================================
    // TOTAL USERS
    // ==========================================

    @Operation(summary = "Get total number of users")
    @ApiResponse(responseCode = "200", description = "Total users returned")
    @GetMapping("/total")
    public ResponseEntity<Integer> countUsers() {

        return ResponseEntity.ok(userService.countUsers());
    }
}