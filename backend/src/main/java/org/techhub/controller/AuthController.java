package org.techhub.controller;

import org.techhub.dto.request.LoginRequest;

import org.techhub.dto.request.RegisterRequest;
import org.techhub.dto.request.ForgotPasswordRequest;
import org.techhub.dto.request.VerifyOtpRequest;
import org.techhub.dto.request.ResetPasswordRequest;

import org.techhub.dto.response.LoginResponse;

import org.techhub.service.AuthService;
import org.techhub.service.ForgotPasswordService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Tag(
        name = "Authentication",
        description = "User registration, login and password recovery APIs"
)
public class AuthController {

    private final AuthService authService;

    private final ForgotPasswordService forgotPasswordService;


    // ============================================================
    // CONSTRUCTOR
    // ============================================================

    public AuthController(
            AuthService authService,
            ForgotPasswordService forgotPasswordService) {

        this.authService =
                authService;

        this.forgotPasswordService =
                forgotPasswordService;
    }


    // ============================================================
    // REGISTER
    // ============================================================

    @PostMapping("/register")
    @Operation(
            summary = "Register new user",
            description = "Creates a new user account"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "User registered successfully"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid registration data"
            )
    })
    public ResponseEntity<String> register(
            @Valid @RequestBody RegisterRequest request) {

        String message =
                authService.register(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(message);
    }


    // ============================================================
    // LOGIN
    // ============================================================

    @PostMapping("/login")
    @Operation(
            summary = "User login",
            description =
                    "Authenticates the user and returns a JWT token"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Login successful"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Invalid email or password"
            )
    })
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        LoginResponse response =
                authService.login(request);

        return ResponseEntity.ok(response);
    }


    // ============================================================
    // FORGOT PASSWORD
    // ============================================================

    @PostMapping("/forgot-password")
    @Operation(
            summary = "Request password reset OTP",
            description =
                    "Checks the registered email and generates a "
                    + "password reset OTP"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "OTP generated successfully"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid email"
            )
    })
    public ResponseEntity<String> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        String message =
                forgotPasswordService.sendOtp(request);

        return ResponseEntity.ok(message);
    }


    // ============================================================
    // VERIFY OTP
    // ============================================================

    @PostMapping("/verify-otp")
    @Operation(
            summary = "Verify password reset OTP",
            description =
                    "Verifies the OTP generated for password reset"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "OTP verified successfully"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid or expired OTP"
            )
    })
    public ResponseEntity<String> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request) {

        String message =
                forgotPasswordService.verifyOtp(request);

        return ResponseEntity.ok(message);
    }


    // ============================================================
    // RESET PASSWORD
    // ============================================================

    @PostMapping("/reset-password")
    @Operation(
            summary = "Reset password",
            description =
                    "Updates the user's password after OTP verification"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Password reset successfully"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Unable to reset password"
            )
    })
    public ResponseEntity<String> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        String message =
                forgotPasswordService.resetPassword(request);

        return ResponseEntity.ok(message);
    }
}