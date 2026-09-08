package org.techhub.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;

import org.techhub.model.AssessmentResult;
import org.techhub.model.Career;
import org.techhub.model.Recommendation;
import org.techhub.model.UserProfile;

import org.techhub.repository.AssessmentResultRepository;
import org.techhub.repository.CareerRepository;
import org.techhub.repository.RecommendationRepository;
import org.techhub.repository.UserProfileRepository;

@Service
public class CareerRecommendationService {

    private final CareerRepository careerRepository;

    private final RecommendationRepository recommendationRepository;

    private final UserProfileRepository userProfileRepository;

    private final AssessmentResultRepository assessmentResultRepository;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public CareerRecommendationService(

            CareerRepository careerRepository,

            RecommendationRepository recommendationRepository,

            UserProfileRepository userProfileRepository,

            AssessmentResultRepository assessmentResultRepository) {

        this.careerRepository =
                careerRepository;

        this.recommendationRepository =
                recommendationRepository;

        this.userProfileRepository =
                userProfileRepository;

        this.assessmentResultRepository =
                assessmentResultRepository;
    }


    // =========================================================
    // GENERATE RECOMMENDATION
    // =========================================================

    public int generateRecommendation(Integer userId) {

        System.out.println("======================================");
        System.out.println("GENERATING CAREER RECOMMENDATION");
        System.out.println("USER ID : " + userId);
        System.out.println("======================================");


        // -----------------------------------------------------
        // 1. GET USER PROFILE
        // -----------------------------------------------------

        UserProfile profile =
                userProfileRepository
                        .findByUserId(userId);


        if (profile == null) {

            System.out.println(
                    "User profile not found."
            );

            return 0;
        }


        // -----------------------------------------------------
        // 2. GET ASSESSMENT RESULTS
        // -----------------------------------------------------

        List<AssessmentResult> results =
                assessmentResultRepository
                        .findByUserId(userId);


        if (results == null ||
                results.isEmpty()) {

            System.out.println(
                    "No assessment result found."
            );

            return 0;
        }


        // -----------------------------------------------------
        // 3. GET LATEST RESULT
        // -----------------------------------------------------

        AssessmentResult latestResult =
                results.stream()
                        .max(
                            Comparator.comparing(
                                AssessmentResult::getResultId
                            )
                        )
                        .orElse(results.get(0));


        BigDecimal assessmentPercentage =
                latestResult.getPercentage();


        if (assessmentPercentage == null) {

            System.out.println(
                    "Assessment percentage is null."
            );

            return 0;
        }


        double percentage =
                assessmentPercentage.doubleValue();


        System.out.println(
                "Assessment Percentage : "
                + percentage
        );


        // -----------------------------------------------------
        // 4. GET ALL CAREERS
        // -----------------------------------------------------

        List<Career> careers =
                careerRepository.findAll();


        if (careers == null ||
                careers.isEmpty()) {

            System.out.println(
                    "No careers found."
            );

            return 0;
        }


        // -----------------------------------------------------
        // 5. DELETE OLD RECOMMENDATIONS
        // -----------------------------------------------------

        recommendationRepository
                .deleteByUserId(userId);


        // -----------------------------------------------------
        // 6. FIND BEST CAREER
        // -----------------------------------------------------

        Career bestCareer = null;

        BigDecimal bestMatch =
                BigDecimal.ZERO;


        for (Career career : careers) {

            BigDecimal match =
                    calculateMatchPercentage(
                            profile,
                            latestResult,
                            career
                    );


            System.out.println(
                    career.getCareerName()
                    + " = "
                    + match
                    + "%"
            );


            if (bestCareer == null ||
                    match.compareTo(bestMatch) > 0) {

                bestCareer = career;

                bestMatch = match;
            }
        }


        if (bestCareer == null) {

            return 0;
        }


        // -----------------------------------------------------
        // 7. CREATE RECOMMENDATION
        // -----------------------------------------------------

        Recommendation recommendation =
                new Recommendation();


        recommendation.setUserId(
                userId
        );


        recommendation.setCareerId(
                bestCareer.getCareerId()
        );


        recommendation.setMatchPercentage(
                bestMatch
        );


        recommendation.setReason(
                generateReason(
                        latestResult,
                        bestCareer,
                        bestMatch
                )
        );


        // -----------------------------------------------------
        // 8. SAVE ONLY BEST RECOMMENDATION
        // -----------------------------------------------------

        int saved =
                recommendationRepository
                        .save(
                                recommendation
                        );


        System.out.println(
                "======================================"
        );

        System.out.println(
                "BEST CAREER : "
                + bestCareer.getCareerName()
        );

        System.out.println(
                "CAREER ID   : "
                + bestCareer.getCareerId()
        );

        System.out.println(
                "MATCH       : "
                + bestMatch
                + "%"
        );

        System.out.println(
                "SAVE RESULT : "
                + saved
        );

        System.out.println(
                "======================================");


        return saved;
    }


    // =========================================================
    // CALCULATE MATCH PERCENTAGE
    // =========================================================

    private BigDecimal calculateMatchPercentage(

            UserProfile profile,

            AssessmentResult result,

            Career career) {


        // -----------------------------------------------------
        // ASSESSMENT SCORE
        // -----------------------------------------------------

        BigDecimal assessmentPercentage =
                result.getPercentage();


        double assessmentScore = 0;


        if (assessmentPercentage != null) {

            assessmentScore =
                    assessmentPercentage.doubleValue();
        }


        // -----------------------------------------------------
        // SKILL MATCH
        // -----------------------------------------------------

        double skillMatch =
                calculateSkillMatch(

                        profile.getTechnicalSkills(),

                        career.getRequiredSkills()
                );


        // -----------------------------------------------------
        // INTEREST MATCH
        // -----------------------------------------------------

        double interestMatch =
                calculateInterestMatch(

                        profile.getInterests(),

                        career
                );


        // -----------------------------------------------------
        // WEIGHTED MATCH
        //
        // Assessment = 70%
        // Skills     = 20%
        // Interest   = 10%
        // -----------------------------------------------------

        double score =

                (assessmentScore * 0.70)

                +

                (skillMatch * 0.20)

                +

                (interestMatch * 0.10);


        // -----------------------------------------------------
        // LIMIT
        // -----------------------------------------------------

        if (score > 100) {

            score = 100;
        }


        if (score < 0) {

            score = 0;
        }


        return BigDecimal
                .valueOf(score)
                .setScale(
                        2,
                        RoundingMode.HALF_UP
                );
    }


    // =========================================================
    // CALCULATE TECHNICAL SKILL MATCH
    // =========================================================

    private double calculateSkillMatch(

            String userSkills,

            String requiredSkills) {


        if (userSkills == null ||
                requiredSkills == null) {

            return 0;
        }


        if (userSkills.trim().isEmpty() ||
                requiredSkills.trim().isEmpty()) {

            return 0;
        }


        String userSkillText =
                userSkills.toLowerCase();


        String[] skills =
                requiredSkills
                        .toLowerCase()
                        .split(",");


        int totalSkills = 0;

        int matchedSkills = 0;


        for (String skill : skills) {

            String requiredSkill =
                    skill.trim();


            if (requiredSkill.isEmpty()) {

                continue;
            }


            totalSkills++;


            if (userSkillText.contains(
                    requiredSkill)) {

                matchedSkills++;
            }
        }


        if (totalSkills == 0) {

            return 0;
        }


        return
                ((double) matchedSkills /
                        totalSkills)
                * 100;
    }


    // =========================================================
    // CALCULATE INTEREST MATCH
    // =========================================================

    private double calculateInterestMatch(

            String interests,

            Career career) {


        if (interests == null ||
                interests.trim().isEmpty()) {

            return 0;
        }


        String interestText =
                interests.toLowerCase();


        String careerName =
                career.getCareerName()
                        .toLowerCase();


        // -----------------------------------------------------
        // CAREER NAME MATCH
        // -----------------------------------------------------

        String[] careerWords =
                careerName.split(" ");


        for (String word : careerWords) {

            if (word.length() < 4) {

                continue;
            }


            if (interestText.contains(word)) {

                return 100;
            }
        }


        // -----------------------------------------------------
        // REQUIRED SKILLS MATCH
        // -----------------------------------------------------

        String requiredSkills =
                career.getRequiredSkills();


        if (requiredSkills == null) {

            return 0;
        }


        String[] skills =
                requiredSkills
                        .toLowerCase()
                        .split(",");


        int totalSkills = 0;

        int matchedSkills = 0;


        for (String skill : skills) {

            String requiredSkill =
                    skill.trim();


            if (requiredSkill.isEmpty()) {

                continue;
            }


            totalSkills++;


            if (interestText.contains(
                    requiredSkill)) {

                matchedSkills++;
            }
        }


        if (totalSkills == 0) {

            return 0;
        }


        return
                ((double) matchedSkills /
                        totalSkills)
                * 100;
    }


    // =========================================================
    // GENERATE REASON
    // =========================================================

    private String generateReason(

            AssessmentResult result,

            Career career,

            BigDecimal matchPercentage) {


        double percentage =
                matchPercentage.doubleValue();


        if (percentage >= 80) {

            return
                    "Excellent match. Your assessment "
                    + "performance, skills and interests strongly "
                    + "align with "
                    + career.getCareerName()
                    + ".";
        }


        if (percentage >= 60) {

            return
                    "Good match. You have a strong foundation "
                    + "for "
                    + career.getCareerName()
                    + ". Further practical skill development "
                    + "can improve your career readiness.";
        }


        if (percentage >= 40) {

            return
                    "Moderate match. You have some relevant "
                    + "skills for "
                    + career.getCareerName()
                    + ", but additional learning and practice "
                    + "are recommended.";
        }


        return
                "Developing match. Focus on improving your "
                + "technical, logical and practical skills "
                + "before pursuing "
                + career.getCareerName()
                + ".";
    }
}