package org.techhub.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private Integer userId;

    private String name;

    private String email;

    private String role;

    private String status;

    private String token;
}