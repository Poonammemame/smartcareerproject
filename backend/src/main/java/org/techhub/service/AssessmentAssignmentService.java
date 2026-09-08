package org.techhub.service;

import java.util.List;

import org.springframework.stereotype.Service;

import org.techhub.model.AssessmentAssignment;
import org.techhub.repository.AssessmentAssignmentRepository;

@Service
public class AssessmentAssignmentService {

    private final AssessmentAssignmentRepository repository;

    public AssessmentAssignmentService(
            AssessmentAssignmentRepository repository) {

        this.repository = repository;
    }

    // =====================================================
    // ASSIGN
    // =====================================================

    public int assignAssessment(int userId) {

        if (repository.isAssigned(userId)) {

            return 0;
        }

        return repository.assignAssessment(userId);
    }

    // =====================================================
    // CHECK
    // =====================================================

    public boolean isAssigned(int userId) {

        return repository.isAssigned(userId);
    }

    // =====================================================
    // USER ASSIGNMENTS
    // =====================================================

    public List<AssessmentAssignment> getByUserId(
            int userId) {

        return repository.findByUserId(userId);
    }

    // =====================================================
    // ALL
    // =====================================================

    public List<AssessmentAssignment> getAll() {

        return repository.findAll();
    }
 // =====================================================
 // UPDATE STATUS
 // =====================================================

 public int updateStatus(
         int assignmentId,
         String status) {

     return repository.updateStatus(
             assignmentId,
             status
     );
 }


 // =====================================================
 // GET ACTIVE ASSIGNMENT
 // =====================================================

 public AssessmentAssignment getActiveAssignment(
         int userId) {

     return repository.findActiveByUserId(
             userId
     );
 }
}