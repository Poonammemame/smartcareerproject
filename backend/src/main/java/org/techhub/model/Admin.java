package org.techhub.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Admin {

    private Integer adminId;
    private String name;
    private String email;
    private String password;
    private String status;
}