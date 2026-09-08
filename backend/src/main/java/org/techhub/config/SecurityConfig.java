package org.techhub.config;

import org.techhub.security.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    // ============================================================
    // JWT FILTER
    // ============================================================

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }


    // ============================================================
    // PASSWORD ENCODER
    // ============================================================

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }


    // ============================================================
    // SECURITY FILTER CHAIN
    // ============================================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

            // ====================================================
            // CSRF
            // ====================================================

            .csrf(csrf -> csrf.disable())


            // ====================================================
            // CORS
            // ====================================================

            .cors(cors -> {
            })


            // ====================================================
            // SESSION
            // JWT APPLICATION = STATELESS
            // ====================================================

            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )


            // ====================================================
            // AUTHORIZATION
            // ====================================================

            .authorizeHttpRequests(auth -> auth


                // =================================================
                // CORS PREFLIGHT
                // =================================================

                .requestMatchers(
                    HttpMethod.OPTIONS,
                    "/**"
                ).permitAll()


                // =================================================
                // PUBLIC AUTH
                // =================================================

                .requestMatchers(
                    "/auth/register",
                    "/auth/login",

                    // Forgot Password
                    "/auth/forgot-password",
                    "/auth/verify-otp",
                    "/auth/reset-password",

                    // Admin Login
                    "/admin/login"
                ).permitAll()


                // =================================================
                // SWAGGER
                // =================================================

                .requestMatchers(
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/v3/api-docs/**"
                ).permitAll()


                // =================================================
                // JSP / STATIC FILES
                // =================================================

                .requestMatchers(
                    "/",
                    "/index.jsp",
                    "/login.jsp",
                    "/register.jsp",
                    "/adminLogin.jsp",

                    "/CSS/**",
                    "/JS/**",

                    "/css/**",
                    "/js/**",

                    "/images/**",
                    "/favicon.ico"
                ).permitAll()


                // =================================================
                // QUESTION APIs
                // =================================================

                .requestMatchers(
                    HttpMethod.GET,
                    "/question/**"
                ).hasAnyRole(
                    "USER",
                    "ADMIN"
                )

                .requestMatchers(
                    HttpMethod.POST,
                    "/question/**"
                ).hasRole("ADMIN")

                .requestMatchers(
                    HttpMethod.PUT,
                    "/question/**"
                ).hasRole("ADMIN")

                .requestMatchers(
                    HttpMethod.DELETE,
                    "/question/**"
                ).hasRole("ADMIN")


                // =================================================
                // USER APIs
                // =================================================

                .requestMatchers(
                    "/user/**"
                ).hasRole("ADMIN")


                // =================================================
                // ADMIN APIs
                // =================================================

                .requestMatchers(
                    "/admin/**"
                ).hasRole("ADMIN")


                // =================================================
                // PROFILE APIs
                // =================================================

                .requestMatchers(
                    HttpMethod.GET,
                    "/profile/all"
                ).hasRole("ADMIN")

                .requestMatchers(
                    "/profile/admin/**"
                ).hasRole("ADMIN")

                .requestMatchers(
                    HttpMethod.GET,
                    "/profile"
                ).hasRole("USER")

                .requestMatchers(
                    HttpMethod.POST,
                    "/profile/save"
                ).hasRole("USER")

                .requestMatchers(
                    HttpMethod.PUT,
                    "/profile/update"
                ).hasRole("USER")

                .requestMatchers(
                    HttpMethod.DELETE,
                    "/profile/delete"
                ).hasRole("USER")

                .requestMatchers(
                    "/profile/my",
                    "/profile/user/**"
                ).hasRole("USER")


                // =================================================
                // ASSESSMENT APIs
                // =================================================

                .requestMatchers(
                    HttpMethod.PUT,
                    "/assessment/assign/**"
                ).hasRole("ADMIN")

                .requestMatchers(
                    HttpMethod.GET,
                    "/assessment/all"
                ).hasRole("ADMIN")

                .requestMatchers(
                    HttpMethod.GET,
                    "/assessment/status/**"
                ).hasAnyRole(
                    "USER",
                    "ADMIN"
                )

                .requestMatchers(
                    HttpMethod.GET,
                    "/assessment/user/**"
                ).hasAnyRole(
                    "USER",
                    "ADMIN"
                )


                // =================================================
                // RESULT APIs
                // =================================================

                .requestMatchers(
                    HttpMethod.POST,
                    "/result/save"
                ).hasRole("USER")

                .requestMatchers(
                    HttpMethod.GET,
                    "/result/my"
                ).hasRole("USER")

                .requestMatchers(
                    HttpMethod.GET,
                    "/result/all"
                ).hasRole("ADMIN")

                .requestMatchers(
                    HttpMethod.GET,
                    "/result/subject/**"
                ).hasAnyRole(
                    "USER",
                    "ADMIN"
                )

                .requestMatchers(
                    HttpMethod.GET,
                    "/result/*"
                ).hasAnyRole(
                    "USER",
                    "ADMIN"
                )


                // =================================================
                // CAREER APIs
                // =================================================

                // -------------------------------------------------
                // GET ALL CAREERS & CAREER BY ID (PUBLIC)
                // -------------------------------------------------

                .requestMatchers(
                    HttpMethod.GET,
                    "/career/all",
                    "/career/search/**",
                    "/career/*"
                ).permitAll()


                // -------------------------------------------------
                // TOTAL CAREERS
                // ADMIN ONLY
                // -------------------------------------------------

                .requestMatchers(
                    HttpMethod.GET,
                    "/career/total"
                ).hasRole("ADMIN")


                // -------------------------------------------------
                // ADD CAREER
                // ADMIN ONLY
                // -------------------------------------------------

                .requestMatchers(
                    HttpMethod.POST,
                    "/career/add"
                ).hasRole("ADMIN")


                // -------------------------------------------------
                // UPDATE CAREER
                // ADMIN ONLY
                // -------------------------------------------------

                .requestMatchers(
                    HttpMethod.PUT,
                    "/career/update"
                ).hasRole("ADMIN")


                // -------------------------------------------------
                // DELETE CAREER
                // ADMIN ONLY
                // -------------------------------------------------

                .requestMatchers(
                    HttpMethod.DELETE,
                    "/career/delete/**"
                ).hasRole("ADMIN")


                // =================================================
                // RECOMMENDATION APIs
                // =================================================

                .requestMatchers(
                    HttpMethod.POST,
                    "/recommendation/generate"
                ).hasRole("USER")

                .requestMatchers(
                    HttpMethod.GET,
                    "/recommendation/my"
                ).hasRole("USER")

                .requestMatchers(
                    HttpMethod.GET,
                    "/recommendation/all"
                ).hasRole("ADMIN")

                .requestMatchers(
                    HttpMethod.GET,
                    "/recommendation/*"
                ).hasAnyRole(
                    "USER",
                    "ADMIN"
                )

                .requestMatchers(
                    HttpMethod.POST,
                    "/recommendation/save"
                ).hasAnyRole(
                    "USER",
                    "ADMIN"
                )


                // =================================================
                // LEARNING RESOURCE APIs
                // =================================================

                .requestMatchers(
                    HttpMethod.GET,
                    "/resource/all",
                    "/resource/career/**",
                    "/resource/*"
                ).permitAll()

                .requestMatchers(
                    HttpMethod.GET,
                    "/resource/my"
                ).hasRole("USER")

                .requestMatchers(
                    HttpMethod.POST,
                    "/resource/**"
                ).hasRole("ADMIN")

                .requestMatchers(
                    HttpMethod.PUT,
                    "/resource/**"
                ).hasRole("ADMIN")

                .requestMatchers(
                    HttpMethod.DELETE,
                    "/resource/**"
                ).hasRole("ADMIN")


                // =================================================
                // USER SETTINGS
                // =================================================

                .requestMatchers(
                    HttpMethod.GET,
                    "/settings/my"
                ).hasRole("USER")

                .requestMatchers(
                    HttpMethod.PUT,
                    "/settings/update"
                ).hasRole("USER")

                .requestMatchers(
                    HttpMethod.PUT,
                    "/settings/email"
                ).hasRole("USER")

                .requestMatchers(
                    HttpMethod.PUT,
                    "/settings/password"
                ).hasRole("USER")


                // =================================================
                // EVERYTHING ELSE
                // =================================================

                .anyRequest().authenticated()
            )


            // ====================================================
            // JWT FILTER
            // ====================================================

            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );


        return http.build();
    }
}