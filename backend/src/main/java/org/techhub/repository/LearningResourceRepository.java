package org.techhub.repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.techhub.model.LearningResource;

@Repository
public class LearningResourceRepository {

    private final JdbcTemplate jdbcTemplate;

    public LearningResourceRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public int save(LearningResource resource) {
        String sql = "INSERT INTO learning_resource (career_id, stage_number, stage_title, category, title, description, url, resource_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(
                sql,
                resource.getCareerId(),
                resource.getStageNumber(),
                resource.getStageTitle(),
                resource.getCategory(),
                resource.getTitle(),
                resource.getDescription(),
                resource.getUrl(),
                resource.getResourceType()
        );
    }

    public List<LearningResource> findAll() {
        String sql = "SELECT * FROM learning_resource ORDER BY career_id, stage_number, resource_id";
        return jdbcTemplate.query(sql, this::mapRow);
    }

    public List<LearningResource> findByCareerId(Integer careerId) {
        String sql = "SELECT * FROM learning_resource WHERE career_id = ? ORDER BY stage_number, resource_id";
        return jdbcTemplate.query(sql, this::mapRow, careerId);
    }

    public List<LearningResource> findByCareerIdAndStage(Integer careerId, Integer stageNumber) {
        String sql = "SELECT * FROM learning_resource WHERE career_id = ? AND stage_number = ? ORDER BY resource_id";
        return jdbcTemplate.query(sql, this::mapRow, careerId, stageNumber);
    }

    public Optional<LearningResource> findById(Integer resourceId) {
        String sql = "SELECT * FROM learning_resource WHERE resource_id = ?";
        List<LearningResource> list = jdbcTemplate.query(sql, this::mapRow, resourceId);
        return list.stream().findFirst();
    }

    public int update(LearningResource resource) {
        String sql = "UPDATE learning_resource SET career_id = ?, stage_number = ?, stage_title = ?, category = ?, title = ?, description = ?, url = ?, resource_type = ? WHERE resource_id = ?";
        return jdbcTemplate.update(
                sql,
                resource.getCareerId(),
                resource.getStageNumber(),
                resource.getStageTitle(),
                resource.getCategory(),
                resource.getTitle(),
                resource.getDescription(),
                resource.getUrl(),
                resource.getResourceType(),
                resource.getResourceId()
        );
    }

    public int deleteById(Integer resourceId) {
        String sql = "DELETE FROM learning_resource WHERE resource_id = ?";
        return jdbcTemplate.update(sql, resourceId);
    }

    public int count() {
        String sql = "SELECT COUNT(*) FROM learning_resource";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class);
        return count != null ? count : 0;
    }

    private LearningResource mapRow(ResultSet rs, int rowNum) throws SQLException {
        LearningResource r = new LearningResource();
        r.setResourceId(rs.getInt("resource_id"));
        r.setCareerId(rs.getInt("career_id"));
        r.setStageNumber(rs.getInt("stage_number"));
        r.setStageTitle(rs.getString("stage_title"));
        r.setCategory(rs.getString("category"));
        r.setTitle(rs.getString("title"));
        r.setDescription(rs.getString("description"));
        r.setUrl(rs.getString("url"));
        r.setResourceType(rs.getString("resource_type"));
        if (rs.getTimestamp("created_at") != null) {
            r.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        }
        return r;
    }
}
