package org.techhub.controller;

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<?> checkHealth() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "application", "PathFinder Career Intelligence Backend",
            "server", "Apache Tomcat 10.1",
            "database", "MySQL (pathfind)",
            "message", "Backend API is live and running successfully!"
        ));
    }
}