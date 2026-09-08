package org.techhub.security;

import java.io.IOException;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

import org.springframework.stereotype.Component;

import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {


    private static final Logger logger =
            LoggerFactory.getLogger(
                    JwtAuthenticationFilter.class
            );


    private final JwtService jwtService;


    public JwtAuthenticationFilter(
            JwtService jwtService) {

        this.jwtService = jwtService;
    }


    // ============================================================
    // SKIP JWT FOR PUBLIC AUTH APIs
    // ============================================================

    @Override
    protected boolean shouldNotFilter(
            HttpServletRequest request) {

        String uri =
                request.getRequestURI();

        String contextPath =
                request.getContextPath();

        String path =
                uri.substring(
                        contextPath.length()
                );


        // ========================================================
        // PUBLIC AUTH ENDPOINTS
        // ========================================================

        if (path.equals("/auth/register")
                || path.equals("/auth/login")
                || path.equals("/auth/forgot-password")
                || path.equals("/auth/verify-otp")
                || path.equals("/auth/reset-password")
                || path.equals("/admin/login")) {

            return true;
        }


        // ========================================================
        // SWAGGER
        // ========================================================

        if (path.startsWith("/swagger-ui/")
                || path.equals("/swagger-ui.html")
                || path.startsWith("/v3/api-docs/")) {

            return true;
        }


        return false;
    }


    // ============================================================
    // JWT FILTER
    // ============================================================

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {


        String requestUri =
                request.getRequestURI();


        String authHeader =
                request.getHeader(
                        "Authorization"
                );


        logger.info(
                "JWT REQUEST: {} {}",
                request.getMethod(),
                requestUri
        );


        // ========================================================
        // NO AUTHORIZATION HEADER
        // ========================================================

        if (authHeader == null
                || !authHeader.startsWith("Bearer ")) {

            logger.warn(
                    "NO JWT TOKEN FOUND for {}",
                    requestUri
            );


            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }


        // ========================================================
        // EXTRACT TOKEN
        // ========================================================

        String token =
                authHeader.substring(7).trim();


        if (token.isEmpty()) {

            logger.warn(
                    "JWT TOKEN IS EMPTY"
            );


            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }


        try {


            // ====================================================
            // VALIDATE TOKEN
            // ====================================================

            if (!jwtService.isTokenValid(token)) {

                logger.warn(
                        "JWT TOKEN INVALID for {}",
                        requestUri
                );


                SecurityContextHolder
                        .clearContext();


                filterChain.doFilter(
                        request,
                        response
                );

                return;
            }


            // ====================================================
            // EXTRACT EMAIL
            // ====================================================

            String email =
                    jwtService.extractEmail(
                            token
                    );


            // ====================================================
            // EXTRACT ROLE
            // ====================================================

            String role =
                    jwtService.extractRole(
                            token
                    );


            logger.info(
                    "JWT EMAIL = {}",
                    email
            );


            logger.info(
                    "JWT ROLE = [{}]",
                    role
            );


            // ====================================================
            // CHECK EMAIL
            // ====================================================

            if (email == null
                    || email.trim().isEmpty()) {

                logger.warn(
                        "JWT EMAIL IS NULL"
                );


                SecurityContextHolder
                        .clearContext();


                filterChain.doFilter(
                        request,
                        response
                );

                return;
            }


            // ====================================================
            // CHECK ROLE
            // ====================================================

            if (role == null
                    || role.trim().isEmpty()) {

                logger.warn(
                        "JWT ROLE IS NULL for user {}",
                        email
                );


                SecurityContextHolder
                        .clearContext();


                filterChain.doFilter(
                        request,
                        response
                );

                return;
            }


            // ====================================================
            // NORMALIZE ROLE
            // ====================================================

            role =
                    role.trim()
                        .toUpperCase();


            String authorityRole;


            if (role.startsWith("ROLE_")) {

                authorityRole = role;

            } else {

                authorityRole =
                        "ROLE_" + role;
            }


            logger.info(
                    "FINAL SPRING AUTHORITY = [{}]",
                    authorityRole
            );


            // ====================================================
            // CREATE AUTHORITY
            // ====================================================

            SimpleGrantedAuthority authority =
                    new SimpleGrantedAuthority(
                            authorityRole
                    );


            // ====================================================
            // CREATE AUTHENTICATION
            // ====================================================

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            List.of(authority)
                    );


            authentication.setDetails(
                    new WebAuthenticationDetailsSource()
                            .buildDetails(request)
            );


            // ====================================================
            // SET SECURITY CONTEXT
            // ====================================================

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(
                            authentication
                    );


            logger.info(
                    "SECURITY CONTEXT SET: {} -> {}",
                    email,
                    authorityRole
            );


        } catch (Exception e) {

            logger.error(
                    "JWT AUTHENTICATION ERROR: {}",
                    e.getMessage(),
                    e
            );


            SecurityContextHolder
                    .clearContext();
        }


        // ========================================================
        // CONTINUE REQUEST
        // ========================================================

        filterChain.doFilter(
                request,
                response
        );
    }
}