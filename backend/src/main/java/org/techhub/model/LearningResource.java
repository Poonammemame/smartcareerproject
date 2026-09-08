package org.techhub.model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LearningResource {

    private Integer resourceId;
    private Integer careerId;
    private Integer stageNumber;
    private String stageTitle;
    private String category;
    private String title;
    private String description;
    private String url;
    private String resourceType; // 'doc', 'video', 'practice', 'cheatsheet'
    private LocalDateTime createdAt;
}
