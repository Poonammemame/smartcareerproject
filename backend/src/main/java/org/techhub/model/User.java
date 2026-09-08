package org.techhub.model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    private Integer userId;

    private String name;

    private String email;

    private String password;

    private String role;

    private String status;

    private LocalDateTime createdAt;
}