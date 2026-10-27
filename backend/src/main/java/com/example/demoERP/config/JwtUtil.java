
package com.example.demoERP.config;

import com.example.demoERP.pojo.EmployeePojo;
import com.example.demoERP.pojo.RolePojo;
import com.example.demoERP.repository.EmployeeRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import lombok.AllArgsConstructor;

import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;

@Component
@AllArgsConstructor
public class JwtUtil {

    /*
     * Use a stable secret key of at least 64 bytes for HS512.
     * Set the JWT_SECRET environment variable before starting the app.
     */
    private static final String SECRET =
            "MySimpleSecretKeyForLearningJwt123456789012345678901234567890";

    private static final SecretKey SECRET_KEY =
            Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

    private static SecretKey createSecretKey() {

        if (SECRET == null || SECRET.getBytes(StandardCharsets.UTF_8).length < 64) {
            throw new IllegalStateException(
                    "Set JWT_SECRET to a secret of at least 64 bytes"
            );
        }

        return Keys.hmacShaKeyFor(
                SECRET.getBytes(StandardCharsets.UTF_8)
        );
    }

    private static final long JWT_EXPIRATION = 60 * 60 * 1000L;

    private final EmployeeRepository employeeRepository;

    // Generate token
    public String generateToken(String username) {

        EmployeePojo employee = employeeRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found")
                );

        List<String> roles = employee.getRoles()
                .stream()
                .map(RolePojo::getRole)
                .toList();

        return Jwts.builder()
                .setSubject(username)
                .claim("roles", roles)
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis() + JWT_EXPIRATION)
                )
                .signWith(SECRET_KEY)
                .compact();
    }

    // Extract username
    public String extractUsername(String token) {

        return extractAllClaims(token).getSubject();
    }

    // Extract roles
    public List<String> extractRoles(String token) {

        Object roles = extractAllClaims(token).get("roles");

        if (!(roles instanceof List<?> roleList)) {
            return List.of();
        }

        return roleList.stream()
                .filter(String.class::isInstance)
                .map(String.class::cast)
                .toList();
    }

    // Validate token
    public boolean isTokenValid(String token) {

        try {
            Claims claims = extractAllClaims(token);

            return claims.getSubject() != null
                    && claims.getExpiration() != null
                    && claims.getExpiration().after(new Date());

        } catch (Exception e) {
            return false;
        }
    }


    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

}
