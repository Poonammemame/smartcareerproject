package org.techhub.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.techhub.dto.request.AdminLoginRequest;
import org.techhub.dto.response.AdminLoginResponse;
import org.techhub.exception.CustomException;
import org.techhub.model.Admin;
import org.techhub.repository.AdminRepository;
import org.techhub.security.JwtService;

@Service
public class AdminService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AdminService(
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AdminLoginResponse login(
            AdminLoginRequest request) {

        Admin admin =
                adminRepository
                        .findByEmail(request.getEmail())
                        .orElseThrow(() ->
                                new CustomException(
                                        "Invalid admin email or password"
                                )
                        );

        if (!"ACTIVE".equalsIgnoreCase(
                admin.getStatus())) {

            throw new CustomException(
                    "Admin account is inactive"
            );
        }

        if (!passwordEncoder.matches(
                request.getPassword(),
                admin.getPassword())) {

            throw new CustomException(
                    "Invalid admin email or password"
            );
        }

        // ==========================================
        // ADMIN JWT
        // ==========================================

        String token =
                jwtService.generateToken(
                        admin.getEmail(),
                        "ADMIN"
                );

        return new AdminLoginResponse(
                admin.getAdminId(),
                admin.getName(),
                admin.getEmail(),
                "ADMIN",
                admin.getStatus(),
                token
        );
    }
}