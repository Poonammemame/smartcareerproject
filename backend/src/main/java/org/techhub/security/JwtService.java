package org.techhub.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    // =====================================================
    // JWT CONFIGURATION FROM application.properties
    // =====================================================

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long expirationTime;

    private final SecretKey key;

    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public JwtService(
            @Value("${jwt.secret}") String secretKey) {

        this.key = Keys.hmacShaKeyFor(
                secretKey.getBytes(StandardCharsets.UTF_8)
        );
    }

    // =====================================================
    // GENERATE TOKEN
    // =====================================================

    public String generateToken(
            String email,
            String role) {

        Date now = new Date();

        Date expiry =
                new Date(
                        now.getTime()
                                + expirationTime
                );

        return Jwts.builder()

                .subject(email)

                .claim(
                        "role",
                        role
                )

                .issuedAt(now)

                .expiration(expiry)

                .signWith(key)

                .compact();
    }

    // =====================================================
    // EXTRACT CLAIMS
    // =====================================================

    private Claims extractClaims(
            String token) {

        return Jwts.parser()

                .verifyWith(key)

                .build()

                .parseSignedClaims(token)

                .getPayload();
    }

    // =====================================================
    // EMAIL
    // =====================================================

    public String extractEmail(
            String token) {

        return extractClaims(token)
                .getSubject();
    }

    // =====================================================
    // ROLE
    // =====================================================

    public String extractRole(
            String token) {

        return extractClaims(token)
                .get("role", String.class);
    }

    // =====================================================
    // VALIDATE TOKEN
    // =====================================================

    public boolean isTokenValid(
            String token) {

        try {

            Claims claims =
                    extractClaims(token);

            Date expiration =
                    claims.getExpiration();

            return expiration != null
                    && expiration.after(
                            new Date()
                    );

        } catch (Exception e) {

            return false;
        }
    }
}