package org.techhub.service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.techhub.model.LearningResource;
import org.techhub.model.Recommendation;
import org.techhub.model.User;
import org.techhub.repository.LearningResourceRepository;
import org.techhub.repository.RecommendationRepository;
import org.techhub.repository.UserRepository;

@Service
public class LearningResourceService {

    private final LearningResourceRepository learningResourceRepository;
    private final RecommendationRepository recommendationRepository;
    private final UserRepository userRepository;

    public LearningResourceService(
            LearningResourceRepository learningResourceRepository,
            RecommendationRepository recommendationRepository,
            UserRepository userRepository) {
        this.learningResourceRepository = learningResourceRepository;
        this.recommendationRepository = recommendationRepository;
        this.userRepository = userRepository;
    }

    public int saveResource(LearningResource resource) {
        return learningResourceRepository.save(resource);
    }

    public int updateResource(LearningResource resource) {
        return learningResourceRepository.update(resource);
    }

    public List<LearningResource> getAllResources() {
        return learningResourceRepository.findAll();
    }

    public List<LearningResource> getResourcesByCareerId(Integer careerId) {
        return learningResourceRepository.findByCareerId(careerId);
    }

    public List<LearningResource> getResourcesByCareerAndStage(Integer careerId, Integer stageNumber) {
        return learningResourceRepository.findByCareerIdAndStage(careerId, stageNumber);
    }

    public List<LearningResource> getMyResources(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return Collections.emptyList();
        }

        List<Recommendation> recommendations =
                recommendationRepository.findByUserId(userOpt.get().getUserId());

        if (recommendations.isEmpty()) {
            // Default to Skill Development (careerId = 7)
            return learningResourceRepository.findByCareerId(7);
        }

        Integer careerId = recommendations.get(0).getCareerId();
        List<LearningResource> resources = learningResourceRepository.findByCareerId(careerId);
        if (resources.isEmpty()) {
            // Fallback to Skill Development
            return learningResourceRepository.findByCareerId(7);
        }
        return resources;
    }

    public Optional<LearningResource> getResourceById(Integer id) {
        return learningResourceRepository.findById(id);
    }

    public int deleteResource(Integer id) {
        return learningResourceRepository.deleteById(id);
    }

    public int getTotalResources() {
        return learningResourceRepository.count();
    }
}
