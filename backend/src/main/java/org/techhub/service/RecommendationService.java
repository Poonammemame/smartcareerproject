package org.techhub.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import org.techhub.model.Recommendation;
import org.techhub.repository.RecommendationRepository;
import org.techhub.repository.UserRepository;

@Service
public class RecommendationService {

    private final RecommendationRepository recommendationRepository;

    private final UserRepository userRepository;

    public RecommendationService(
            RecommendationRepository recommendationRepository,
            UserRepository userRepository) {

        this.recommendationRepository =
                recommendationRepository;

        this.userRepository =
                userRepository;
    }


    // ==========================================
    // SAVE RECOMMENDATION
    // ==========================================

    public int saveRecommendation(
            Recommendation recommendation) {

        return recommendationRepository.save(
                recommendation
        );
    }


    // ==========================================
    // GET MY RECOMMENDATIONS BY EMAIL
    // ==========================================

    public List<Recommendation> getByEmail(
            String email) {

        return userRepository
                .findByEmail(email)
                .map(user ->
                        recommendationRepository
                                .findByUserId(
                                        user.getUserId()
                                )
                )
                .orElse(List.of());
    }


    // ==========================================
    // GET BY ID
    // ==========================================

    public Optional<Recommendation> getById(
            Integer recommendationId) {

        return recommendationRepository
                .findById(recommendationId);
    }


    // ==========================================
    // GET ALL
    // ==========================================

    public List<Recommendation> getAll() {

        return recommendationRepository.findAll();
    }


    // ==========================================
    // DELETE USER RECOMMENDATIONS
    // ==========================================

    public int deleteByUserId(Integer userId) {

        return recommendationRepository
                .deleteByUserId(userId);
    }
}