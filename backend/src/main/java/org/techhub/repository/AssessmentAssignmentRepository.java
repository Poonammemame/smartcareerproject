package org.techhub.repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import org.techhub.constants.AssessmentAssignmentQueries;
import org.techhub.model.AssessmentAssignment;

@Repository
public class AssessmentAssignmentRepository {

    private final JdbcTemplate jdbcTemplate;

    public AssessmentAssignmentRepository(
            JdbcTemplate jdbcTemplate) {

        this.jdbcTemplate = jdbcTemplate;
    }

    // =====================================================
    // ASSIGN ASSESSMENT
    // =====================================================

    public int assignAssessment(int userId) {

        return jdbcTemplate.update(
                AssessmentAssignmentQueries.ASSIGN_ASSESSMENT,
                userId
        );
    }

    // =====================================================
    // CHECK ASSIGNMENT
    // =====================================================

    public boolean isAssigned(int userId) {

        Integer count = jdbcTemplate.queryForObject(
                AssessmentAssignmentQueries.CHECK_ASSIGNED,
                Integer.class,
                userId
        );

        return count != null && count > 0;
    }

    // =====================================================
    // FIND BY USER
    // =====================================================

    public List<AssessmentAssignment> findByUserId(
            int userId) {

        return jdbcTemplate.query(
                AssessmentAssignmentQueries.FIND_BY_USER_ID,
                (rs, rowNum) -> mapAssignment(rs),
                userId
        );
    }

    // =====================================================
    // FIND ALL
    // =====================================================

    public List<AssessmentAssignment> findAll() {

        return jdbcTemplate.query(
                AssessmentAssignmentQueries.FIND_ALL,
                (rs, rowNum) -> mapAssignment(rs)
        );
    }

    // =====================================================
    // MAPPER
    // =====================================================

    private AssessmentAssignment mapAssignment(
            ResultSet rs) throws SQLException {

        AssessmentAssignment assignment =
                new AssessmentAssignment();

        assignment.setAssignmentId(
                rs.getInt("assignment_id")
        );

        assignment.setUserId(
                rs.getInt("user_id")
        );

        assignment.setStatus(
                rs.getString("status")
        );

        if (rs.getTimestamp("assigned_at") != null) {

            assignment.setAssignedAt(
                    rs.getTimestamp("assigned_at")
                            .toLocalDateTime()
            );
        }

        return assignment;
    }
 // =====================================================
 // UPDATE ASSIGNMENT STATUS
 // =====================================================

 public int updateStatus(
         int assignmentId,
         String status) {

     return jdbcTemplate.update(
             AssessmentAssignmentQueries.UPDATE_STATUS,
             status,
             assignmentId
     );
 }


 // =====================================================
 // FIND ACTIVE ASSIGNMENT
 // =====================================================

 public AssessmentAssignment findActiveByUserId(
         int userId) {

     List<AssessmentAssignment> list =
             jdbcTemplate.query(
                     AssessmentAssignmentQueries.FIND_ACTIVE_BY_USER_ID,
                     (rs, rowNum) -> mapAssignment(rs),
                     userId
             );

     if (list.isEmpty()) {
         return null;
     }

     return list.get(0);
 }
}