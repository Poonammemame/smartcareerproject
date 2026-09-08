package org.techhub.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.techhub.dto.request.AdminLoginRequest;
import org.techhub.dto.response.AdminLoginResponse;
import org.techhub.service.AdminService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/admin")

@Tag(
        name = "Admin Authentication",
        description = "Admin authentication APIs"
)
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // ==========================================
    // ADMIN LOGIN
    // ==========================================

    @PostMapping("/login")
    @Operation(
            summary = "Admin login",
            description = "Authenticates an administrator and returns a JWT token"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Admin login successful"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Invalid admin credentials"
            )
    })
    public ResponseEntity<AdminLoginResponse> login(
            @RequestBody AdminLoginRequest request) {

        AdminLoginResponse response =
                adminService.login(request);

        return ResponseEntity.ok(response);
    }
}