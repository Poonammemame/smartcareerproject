// ============================================================
// AuthService.java
// ============================================================

package org.techhub.service;

import org.techhub.dto.request.LoginRequest;
import org.techhub.dto.request.RegisterRequest;
import org.techhub.dto.response.LoginResponse;
import org.techhub.exception.CustomException;
import org.techhub.model.User;
import org.techhub.repository.UserRepository;
import org.techhub.security.JwtService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // ==========================================
    // REGISTER
    // ==========================================

    public String register(RegisterRequest request) {

        log.info(
                "Registration request received for: {}",
                request.getEmail()
        );

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {

            log.warn(
                    "Email already registered: {}",
                    request.getEmail()
            );

            throw new CustomException(
                    "Email already registered"
            );
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        user.setRole("USER");
        user.setStatus("ACTIVE");

        int result = userRepository.save(user);

        if (result <= 0) {
            throw new CustomException(
                    "User registration failed"
            );
        }

        log.info(
                "User registered successfully: {}",
                request.getEmail()
        );

        return "User registered successfully";
    }

    // ==========================================
    // LOGIN
    // ==========================================

    public LoginResponse login(LoginRequest request) {

        log.info(
                "Login attempt for: {}",
                request.getEmail()
        );

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new CustomException(
                                "Invalid email or password"
                        )
                );

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            log.warn(
                    "Invalid password for: {}",
                    request.getEmail()
            );

            throw new CustomException(
                    "Invalid email or password"
            );
        }

        if (!"ACTIVE".equalsIgnoreCase(
                user.getStatus())) {

            throw new CustomException(
                    "User account is inactive"
            );
        }

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole()
        );

        LoginResponse response = new LoginResponse();

        response.setUserId(user.getUserId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setStatus(user.getStatus());
        response.setToken(token);

        log.info(
                "Login successful for: {}",
                request.getEmail()
        );

        return response;
    }
}