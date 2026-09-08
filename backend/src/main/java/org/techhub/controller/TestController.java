package org.techhub.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class TestController {

    private final PasswordEncoder passwordEncoder;

    public TestController(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/user")
    public String userTest(Authentication authentication) {

        return "JWT authentication successful. Logged in user: "
                + authentication.getName();
    }

    @GetMapping("/admin-password")
    public String generateAdminPassword() {

        return passwordEncoder.encode("Admin@123");
    }
}