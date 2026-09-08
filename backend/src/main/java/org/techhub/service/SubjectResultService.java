package org.techhub.service;

import java.util.List;

import org.springframework.stereotype.Service;

import org.techhub.model.SubjectResult;
import org.techhub.repository.SubjectResultRepository;

@Service
public class SubjectResultService {


    private final SubjectResultRepository subjectResultRepository;


    // ============================================================
    // CONSTRUCTOR
    // ============================================================

    public SubjectResultService(
            SubjectResultRepository subjectResultRepository) {

        this.subjectResultRepository =
                subjectResultRepository;
    }


    // ============================================================
    // SAVE
    // ============================================================

    public int saveSubjectResult(
            SubjectResult subjectResult) {

        return subjectResultRepository.save(
                subjectResult
        );
    }


    // ============================================================
    // GET BY RESULT ID
    // ============================================================

    public List<SubjectResult> getByResultId(
            int resultId) {

        return subjectResultRepository
                .findByResultId(
                        resultId
                );
    }


    // ============================================================
    // GET BY ID
    // ============================================================

    public SubjectResult getById(
            int subjectResultId) {

        return subjectResultRepository
                .findById(
                        subjectResultId
                )
                .orElse(null);
    }


    // ============================================================
    // DELETE
    // ============================================================

    public int deleteByResultId(
            int resultId) {

        return subjectResultRepository
                .deleteByResultId(
                        resultId
                );
    }
}