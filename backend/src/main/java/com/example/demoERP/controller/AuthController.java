
package com.example.demoERP.controller;

import com.example.demoERP.config.JwtUtil;
import com.example.demoERP.dto.LoginRequestDto;
import com.example.demoERP.pojo.EmployeePojo;
import com.example.demoERP.pojo.RolePojo;
import com.example.demoERP.repository.EmployeeRepository;
import com.example.demoERP.repository.RoleRepository;

import lombok.AllArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final EmployeeRepository employeeRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    // Register API
    @PostMapping("/register")
    public ResponseEntity<String> register(
            @RequestBody LoginRequestDto request) {

        if (employeeRepository.findByUsername(request.getUsername())
                .isPresent()) {

            return ResponseEntity.badRequest()
                    .body("Username already taken");
        }

        if (request.getUsername() == null
                || request.getUsername().isBlank()
                || request.getPassword() == null
                || request.getPassword().isBlank()) {

            return ResponseEntity.badRequest()
                    .body("Username and password are required");
        }

        if (request.getRoles() == null || request.getRoles().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("At least one role is required");
        }

        EmployeePojo employee = new EmployeePojo();

        employee.setUsername(request.getUsername());
        employee.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        List<RolePojo> roles = new ArrayList<>();

        for (Long roleId : request.getRoles()) {

            RolePojo role = roleRepository.findById(roleId)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Role not found: " + roleId
                            )
                    );

            roles.add(role);
        }

        employee.setRoles(roles);
        employeeRepository.save(employee);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Registration successful");
    }

    // Login API
    @PostMapping("/login")
    public ResponseEntity<String> login(
            @RequestBody LoginRequestDto request) {

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );

            String token = jwtUtil.generateToken(
                    request.getUsername()
            );

            return ResponseEntity.ok(token);

        } catch (Exception e) {
            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }
}
