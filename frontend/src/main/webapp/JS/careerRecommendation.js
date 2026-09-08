/* ============================================================
   PATHFINDER - CAREER RECOMMENDATION
   ============================================================ */

console.log("======================================");
console.log("careerRecommendation.js LOADED");
console.log("======================================");


/* ============================================================
   CONFIGURATION
============================================================ */

window.API_BASE_URL = window.API_BASE_URL || (typeof getApiBaseUrl === "function" ? getApiBaseUrl() : "http://localhost:8090/api");

/* ============================================================
   ASSESSMENT RESULT APIs
============================================================ */

var RESULT_API =
    (typeof API_ENDPOINTS !== "undefined" && API_ENDPOINTS.RESULT)
        ? API_ENDPOINTS.RESULT.BY_ID.replace(/\/$/, "")
        : window.API_BASE_URL + "/result";

var MY_RESULT_API =
    (typeof API_ENDPOINTS !== "undefined" && API_ENDPOINTS.RESULT)
        ? API_ENDPOINTS.RESULT.MY
        : RESULT_API + "/my";

/* ============================================================
   RECOMMENDATION APIs
============================================================ */

var RECOMMENDATION_API =
    (typeof API_ENDPOINTS !== "undefined" && API_ENDPOINTS.RECOMMENDATION)
        ? window.API_BASE_URL + "/recommendation"
        : window.API_BASE_URL + "/recommendation";

var MY_RECOMMENDATION_API =
    (typeof API_ENDPOINTS !== "undefined" && API_ENDPOINTS.RECOMMENDATION)
        ? API_ENDPOINTS.RECOMMENDATION.MY
        : RECOMMENDATION_API + "/my";

var GENERATE_RECOMMENDATION_API =
    (typeof API_ENDPOINTS !== "undefined" && API_ENDPOINTS.RECOMMENDATION)
        ? API_ENDPOINTS.RECOMMENDATION.GENERATE
        : RECOMMENDATION_API + "/generate";

/* ============================================================
   USER PROFILE API
============================================================ */

var PROFILE_API =
    (typeof API_ENDPOINTS !== "undefined" && API_ENDPOINTS.PROFILE)
        ? API_ENDPOINTS.PROFILE.BASE
        : window.API_BASE_URL + "/profile";


/* ============================================================
   GLOBAL VARIABLES
============================================================ */

let jwtToken = null;

let latestResult = null;

let subjectResults = [];

let profileSkills = [];

let backendRecommendation = null;


/* ============================================================
   DOM READY
============================================================ */

document.addEventListener("DOMContentLoaded", function () {

    console.log("Career Recommendation Page Loaded");


    jwtToken =
        localStorage.getItem("token");


    console.log(
        "JWT Token Available:",
        jwtToken ? "YES" : "NO"
    );


    if (!jwtToken) {

        showPageError(
            "Login session not found. Please login again."
        );

        return;
    }


    loadCareerRecommendation();


    const retryButton =
        document.getElementById(
            "retryRecommendationBtn"
        );


    if (retryButton) {

        retryButton.addEventListener(
            "click",
            function () {

                loadCareerRecommendation();

            }
        );

    }

});


/* ============================================================
   MAIN LOAD FUNCTION
============================================================ */

function loadCareerRecommendation() {

    console.log("======================================");
    console.log("STARTING CAREER RECOMMENDATION LOAD");
    console.log("======================================");


    showLoading();


    jwtToken =
        localStorage.getItem("token");


    if (!jwtToken) {

        showPageError(
            "Login session not found. Please login again."
        );

        return;

    }


    /*
     * STEP 1
     * LOAD ASSESSMENT RESULT
     */

    fetch(
        MY_RESULT_API,
        {

            method: "GET",

            headers: {

                "Authorization":
                    "Bearer " + jwtToken,

                "Content-Type":
                    "application/json"

            }

        }
    )

    .then(function (response) {

        console.log(
            "Assessment Result API Status:",
            response.status
        );


        if (response.status === 404) {

            const noAssessmentErr =
                new Error("NO_ASSESSMENT_FOUND");

            noAssessmentErr.isNoAssessment =
                true;

            throw noAssessmentErr;

        }


        if (response.status === 401) {

            throw new Error(
                "Your session has expired. Please login again."
            );

        }


        if (response.status === 403) {

            throw new Error(
                "You are not authorized to view assessment results."
            );

        }


        if (!response.ok) {

            throw new Error(
                "Unable to load assessment result. HTTP " +
                response.status
            );

        }


        return response.json();

    })


    .then(function (data) {

        console.log(
            "Assessment Results:",
            data
        );


        let resultRecord = null;
        if (Array.isArray(data)) {
            if (data.length > 0) {
                resultRecord = data[0];
            }
        } else if (data && typeof data === "object") {
            const hasData = getValue(data, "resultId", "result_id") ||
                            getValue(data, "totalQuestions", "total_questions");
            if (hasData) {
                resultRecord = data;
            }
        }

        if (!resultRecord) {
            const noAssessmentErr =
                new Error("NO_ASSESSMENT_FOUND");
            noAssessmentErr.isNoAssessment =
                true;
            throw noAssessmentErr;
        }

        /*
         * Latest result (first record in DESC sorted list)
         */
        latestResult = resultRecord;

        console.log(
            "Latest Assessment Result:",
            latestResult
        );


        const resultId =
            getValue(
                latestResult,
                "resultId",
                "result_id"
            );


        console.log(
            "Latest Result ID:",
            resultId
        );


        /*
         * STEP 2
         * LOAD SUBJECT RESULTS
         */

        if (
            resultId !== null &&
            resultId !== undefined &&
            resultId !== ""
        ) {

            return loadSubjectResults(
                resultId
            );

        }


        console.warn(
            "Result ID not found."
        );


        return [];

    })


    .then(function (subjects) {

        if (Array.isArray(subjects)) {

            subjectResults =
                subjects;


            console.log(
                "Actual Subject Results:",
                subjectResults
            );


            if (subjectResults.length > 0) {

                updateSubjectScores(
                    subjectResults
                );

            }

        }


        /*
         * STEP 3
         * LOAD USER PROFILE
         */

        return loadUserProfile();

    })


    .then(function () {

        /*
         * STEP 4
         * LOAD BACKEND RECOMMENDATION
         *
         * If recommendation does not exist,
         * generate it automatically.
         */

        return loadOrGenerateBackendRecommendation();

    })


    .then(function (recommendation) {

        console.log(
            "Backend Recommendation:",
            recommendation
        );


        if (!recommendation) {

            throw new Error(
                "Unable to generate career recommendation."
            );

        }


        backendRecommendation =
            recommendation;


        /*
         * STEP 5
         * DISPLAY BACKEND RECOMMENDATION
         */

        displayBackendRecommendation(
            recommendation
        );


        /*
         * SHOW PAGE
         */

        showCareerContent();


        console.log(
            "Career recommendation displayed successfully."
        );

    })


    .catch(function (error) {

        console.error(
            "Career Recommendation Error:",
            error
        );

        if (error.isNoAssessment || (error.message && error.message.includes("NO_ASSESSMENT_FOUND"))) {
            showEmptyState();
            return;
        }

        showPageError(
            error.message ||
            "Unable to load career recommendation."
        );

    });

}


/* ============================================================
   LOAD SUBJECT RESULTS
   GET /result/subject/{resultId}
============================================================ */

function loadSubjectResults(resultId) {

    const url =
        RESULT_API +
        "/subject/" +
        encodeURIComponent(resultId);


    console.log(
        "Calling Subject Result API:",
        url
    );


    return fetch(
        url,
        {

            method: "GET",

            headers: {

                "Authorization":
                    "Bearer " + jwtToken,

                "Content-Type":
                    "application/json"

            }

        }
    )

    .then(function (response) {

        console.log(
            "Subject Result API Status:",
            response.status
        );


        if (response.status === 401) {

            throw new Error(
                "Your session has expired. Please login again."
            );

        }


        if (response.status === 403) {

            console.warn(
                "Subject result access denied."
            );

            return [];

        }


        if (response.status === 404) {

            console.warn(
                "Subject results not found."
            );

            return [];

        }


        if (!response.ok) {

            console.warn(
                "Subject result API failed."
            );

            return [];

        }


        return response.json();

    })


    .then(function (data) {

        console.log(
            "ACTUAL SUBJECT RESULTS:",
            data
        );


        if (!Array.isArray(data)) {

            console.warn(
                "Subject result response is not an array:",
                data
            );

            return [];

        }


        return data;

    })


    .catch(function (error) {

        console.error(
            "Subject Result Loading Error:",
            error
        );


        return [];

    });

}


/* ============================================================
   LOAD USER PROFILE
   GET /profile
============================================================ */

function loadUserProfile() {

    console.log("======================================");
    console.log("Loading logged-in user profile...");
    console.log("Profile API:", PROFILE_API);
    console.log("======================================");


    jwtToken =
        localStorage.getItem("token");


    if (!jwtToken) {

        console.warn(
            "JWT token not available for profile."
        );

        return Promise.resolve();

    }


    return fetch(
        PROFILE_API,
        {

            method: "GET",

            headers: {

                "Authorization":
                    "Bearer " + jwtToken,

                "Content-Type":
                    "application/json"

            }

        }
    )

    .then(function (response) {

        console.log(
            "Profile API Status:",
            response.status
        );


        if (response.status === 401) {

            console.warn(
                "Profile API: Session expired."
            );

            return null;

        }


        if (response.status === 403) {

            console.warn(
                "Profile API: Access denied."
            );

            return null;

        }


        if (response.status === 404) {

            console.warn(
                "Profile not found."
            );

            return null;

        }


        if (!response.ok) {

            console.warn(
                "Unable to load profile."
            );

            return null;

        }


        return response.json();

    })


    .then(function (profile) {

        console.log(
            "USER PROFILE:",
            profile
        );


        if (!profile) {

            console.warn(
                "No profile data received."
            );

            return;

        }


        const skillsValue =
            getValue(
                profile,
                "technicalSkills",
                "technical_skills"
            );


        console.log(
            "PROFILE TECHNICAL SKILLS:",
            skillsValue
        );


        if (
            skillsValue === null ||
            skillsValue === undefined ||
            String(skillsValue).trim() === ""
        ) {

            profileSkills = [];

            return;

        }


        profileSkills =
            parseProfileSkills(
                skillsValue
            );


        console.log(
            "PARSED PROFILE SKILLS:",
            profileSkills
        );

    })


    .catch(function (error) {

        console.error(
            "Profile Loading Error:",
            error
        );

    });

}


/* ============================================================
   LOAD OR GENERATE BACKEND RECOMMENDATION
============================================================ */

function loadOrGenerateBackendRecommendation() {

    console.log("======================================");
    console.log("LOADING BACKEND RECOMMENDATION");
    console.log("API:", MY_RECOMMENDATION_API);
    console.log("======================================");


    jwtToken =
        localStorage.getItem("token");


    if (!jwtToken) {

        return Promise.reject(
            new Error(
                "Login session not found."
            )
        );

    }


    /*
     * First try existing recommendation
     */
    return fetchMyRecommendation()
        .then(function (rec) {
            console.log("Existing Backend Recommendation:", rec);

            if (rec && (rec.careerName || rec.career_name || rec.matchPercentage || rec.match_percentage || rec.recommendationId || rec.recommendation_id)) {
                console.log("Existing recommendation found.");
                return rec;
            }

            console.log("No existing recommendation found. Generating new...");
            return generateBackendRecommendation();
        });
}

/* ============================================================
   FETCH MY RECOMMENDATION HELPER
   GET /recommendation/my
============================================================ */

function fetchMyRecommendation() {
    jwtToken = localStorage.getItem("token");
    if (!jwtToken) {
        return Promise.reject(new Error("Login session not found."));
    }

    return fetch(MY_RECOMMENDATION_API, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + jwtToken,
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    })
    .then(function(res) {
        if (res.status === 401) throw new Error("Session expired. Please login again.");
        if (res.status === 404) return null;
        if (!res.ok) return null;
        return res.json();
    })
    .then(function(data) {
        if (!data) return null;
        if (Array.isArray(data)) return data.length > 0 ? data[0] : null;
        if (typeof data === "object") return data;
        return null;
    })
    .catch(function(e) {
        console.warn("fetchMyRecommendation:", e);
        return null;
    });
}


/* ============================================================
   LOAD RECOMMENDATION
   GET /recommendation/my
============================================================ */

function loadRecommendation() {

    console.log("Loading career recommendation...");

    showLoading();

    jwtToken = getJwtToken();

    if (!jwtToken) {

        showError(
            "User login session not found. Please login again."
        );

        return;
    }


    fetch(
        MY_RECOMMENDATION_API,
        {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + jwtToken,
                "Accept": "application/json"
            }
        }
    )

    .then(function (response) {

        console.log(
            "Recommendation API Status:",
            response.status
        );


        if (response.status === 401) {

            throw new Error(
                "Your login session has expired. Please login again."
            );
        }


        if (response.status === 403) {

            throw new Error(
                "You are not authorized to view this recommendation."
            );
        }


        if (response.status === 404) {

            console.log(
                "Recommendation not found. Generating new recommendation..."
            );

            return generateRecommendation();
        }


        if (!response.ok) {

            throw new Error(
                "Unable to load career recommendation. HTTP " +
                response.status
            );
        }


        return response.json();

    })

    .then(function (data) {

        console.log(
            "Recommendation API Response:",
            data
        );


        if (!data) {

            console.log(
                "Empty recommendation response. Generating new..."
            );

            return generateRecommendation();
        }


        handleRecommendationResponse(data);

    })

    .catch(function (error) {

        console.error(
            "Load Recommendation Error:",
            error
        );

        showError(
            error.message ||
            "Unable to load career recommendation."
        );

    });

}


/* ============================================================
   GENERATE RECOMMENDATION
   POST /recommendation/generate
============================================================ */

function generateBackendRecommendation() {

    console.log("======================================");
    console.log("GENERATING CAREER RECOMMENDATION");
    console.log("API:", GENERATE_RECOMMENDATION_API);
    console.log("======================================");


    jwtToken =
        localStorage.getItem("token");


    if (!jwtToken) {

        return Promise.reject(
            new Error(
                "Login session not found."
            )
        );

    }


    return fetch(
        GENERATE_RECOMMENDATION_API,
        {

            method: "POST",

            headers: {

                "Authorization":
                    "Bearer " + jwtToken,

                "Content-Type":
                    "application/json"

            }

        }
    )

    .then(function (response) {

        console.log(
            "Generate Recommendation API Status:",
            response.status
        );


        return response.text()

            .then(function (message) {

                console.log(
                    "Generate Recommendation Response:",
                    message
                );


                if (response.status === 401) {

                    throw new Error(
                        "Your session has expired. Please login again."
                    );

                }


                if (response.status === 403) {

                    throw new Error(
                        "You are not authorized to generate recommendation."
                    );

                }


                if (!response.ok) {

                    throw new Error(
                        message ||
                        "Failed to generate career recommendation."
                    );

                }


                return message;

            });

    })


    .then(function () {

        console.log(
            "Recommendation generated successfully."
        );


        /*
         * After generation,
         * fetch saved recommendation.
         */

        return fetchMyRecommendation();

    })


    .then(function (recommendations) {

        console.log(
            "Recommendations After Generation:",
            recommendations
        );


        if (
            !Array.isArray(recommendations) ||
            recommendations.length === 0
        ) {

            throw new Error(
                "Recommendation was generated but no saved recommendation was found."
            );

        }


        /*
         * First recommendation is the best recommendation.
         */

        return recommendations[0];

    });

}


/* ============================================================
   DISPLAY BACKEND RECOMMENDATION
============================================================ */

function displayBackendRecommendation(
    recommendation
) {

    if (!recommendation) {

        showPageError(
            "Recommendation data is empty."
        );

        return;

    }


    console.log(
        "======================================"
    );

    console.log(
        "DISPLAYING BACKEND RECOMMENDATION"
    );

    console.log(
        "======================================"
    );


    /*
     * ==========================================
     * BACKEND VALUES
     * ==========================================
     */

    const careerName =
        getValue(
            recommendation,
            "careerName",
            "career_name"
        ) ||
        "Career Recommendation";


    const description =
        getValue(
            recommendation,
            "description"
        ) ||
        "Career recommendation based on your assessment.";


    const matchPercentage =
        Number(
            getValue(
                recommendation,
                "matchPercentage",
                "match_percentage"
            ) || 0
        );


    const reason =
        getValue(
            recommendation,
            "reason"
        ) ||
        "This career matches your assessment profile.";


    const requiredSkills =
        getValue(
            recommendation,
            "requiredSkills",
            "required_skills"
        ) ||
        "";


    console.log(
        "Career:",
        careerName
    );


    console.log(
        "Description:",
        description
    );


    console.log(
        "Match Percentage:",
        matchPercentage
    );


    console.log(
        "Reason:",
        reason
    );


    console.log(
        "Required Skills:",
        requiredSkills
    );


    /*
     * ==========================================
     * TOP CAREER
     * ==========================================
     */

    setText(
        "recommendedCareer",
        careerName
    );


    setText(
        "careerDescription",
        description
    );


    setText(
        "matchPercentage",
        formatPercentage(
            matchPercentage
        ) + "%"
    );


    setText(
        "matchLevel",
        getMatchLabel(
            matchPercentage
        )
    );


    /*
     * ==========================================
     * TAGS
     * ==========================================
     */

    setText(
        "careerCategoryTag",
        careerName
    );


    setText(
        "careerEducationTag",
        getMatchLabel(
            matchPercentage
        )
    );


    /*
     * ==========================================
     * CAREER ICON
     * ==========================================
     */

    const icon =
        document.querySelector(
            "#careerMainIcon i"
        );


    if (icon) {

        icon.className =
            "fa-solid " +
            getCareerIcon(
                careerName
            );

    }


    /*
     * ==========================================
     * SCORE CIRCLE
     * ==========================================
     */

    updateScoreCircle(
        matchPercentage
    );


    /*
     * ==========================================
     * ASSESSMENT SCORES
     * ==========================================
     */

    const assessmentPercentage =
        getAssessmentPercentage();


    console.log(
        "Assessment Percentage:",
        assessmentPercentage
    );


    /*
     * ==========================================
     * SUBJECT DATA
     * ==========================================
     */

    if (
        subjectResults.length === 0
    ) {

        /*
         * IMPORTANT:
         * These values are only fallback display
         * when backend subject API has no data.
         *
         * No fake data when actual subject results exist.
         */

        updateSkillProfile(
            assessmentPercentage
        );


        updateRecommendationReasons(
            assessmentPercentage
        );

    }


    /*
     * ==========================================
     * RECOMMENDATION REASON
     * ==========================================
     */

    updateBackendReason(
        reason
    );


    /*
     * ==========================================
     * STRENGTHS
     * ==========================================
     */

    updateStrengths(
        assessmentPercentage
    );


    /*
     * ==========================================
     * SKILL GAP
     * ==========================================
     */

    updateSkillGapFromRecommendation(
        requiredSkills
    );


    /*
     * ==========================================
     * ALTERNATIVE CAREERS
     * ==========================================
     */

    updateAlternativeCareers(
        matchPercentage,
        careerName
    );

}


/* ============================================================
   GET ASSESSMENT PERCENTAGE
============================================================ */

function getAssessmentPercentage() {

    if (!latestResult) {

        return 0;

    }


    let percentage =
        Number(
            getValue(
                latestResult,
                "percentage",
                "percentage_score"
            ) || 0
        );


    const totalQuestions =
        Number(
            getValue(
                latestResult,
                "totalQuestions",
                "total_questions"
            ) || 0
        );


    const correctAnswers =
        Number(
            getValue(
                latestResult,
                "correctAnswers",
                "correct_answers"
            ) || 0
        );


    if (
        percentage <= 0 &&
        totalQuestions > 0
    ) {

        percentage =
            (
                correctAnswers /
                totalQuestions
            ) * 100;

    }


    return Math.round(
        percentage * 100
    ) / 100;

}


/* ============================================================
   GET CAREER ICON
============================================================ */

function getCareerIcon(
    careerName
) {

    const name =
        String(
            careerName || ""
        ).toLowerCase();


    if (name.includes("web")) {

        return "fa-globe";

    }


    if (
        name.includes("software") ||
        name.includes("developer")
    ) {

        return "fa-code";

    }


    if (
        name.includes("java")
    ) {

        return "fa-coffee";

    }


    if (
        name.includes("data")
    ) {

        return "fa-chart-column";

    }


    if (
        name.includes("qa") ||
        name.includes("tester") ||
        name.includes("testing")
    ) {

        return "fa-bug";

    }


    if (
        name.includes("system")
    ) {

        return "fa-server";

    }


    if (
        name.includes("support")
    ) {

        return "fa-headset";

    }


    return "fa-laptop-code";

}


/* ============================================================
   UPDATE SCORE CIRCLE
============================================================ */

function updateScoreCircle(
    percentage
) {

    const circle =
        document.getElementById(
            "scoreCircle"
        );


    if (!circle) {

        console.warn(
            "scoreCircle element not found."
        );

        return;

    }


    const safePercentage =
        Math.max(
            0,
            Math.min(
                Number(percentage) || 0,
                100
            )
        );


    circle.style.setProperty(
        "--score",
        safePercentage
    );


    circle.style.setProperty(
        "--score-percent",
        safePercentage + "%"
    );


    circle.setAttribute(
        "data-score",
        safePercentage
    );


    const degrees =
        safePercentage * 3.6;


    circle.style.background =
        "conic-gradient(" +
        "var(--primary-color, #2563eb) 0deg " +
        degrees +
        "deg, " +
        "var(--circle-track, #e8edf5) " +
        degrees +
        "deg 360deg" +
        ")";


    circle.style.position =
        "relative";


    circle.style.borderRadius =
        "50%";


    circle.setAttribute(
        "data-score-angle",
        degrees
    );


    console.log(
        "Score Circle:",
        safePercentage + "%",
        "| Angle:",
        degrees + "deg"
    );

}


/* ============================================================
   UPDATE ACTUAL SUBJECT SCORES
============================================================ */

function updateSubjectScores(
    subjects
) {

    if (
        !Array.isArray(subjects) ||
        subjects.length === 0
    ) {

        console.warn(
            "No subject results available."
        );

        return;

    }


    console.log(
        "Updating ACTUAL subject scores:",
        subjects
    );


    let technicalScore = null;

    let logicalScore = null;

    let aptitudeScore = null;

    let communicationScore = null;


    subjects.forEach(
        function (subject) {

            const name =
                String(
                    getValue(
                        subject,
                        "subject",
                        "subjectName",
                        "subject_name",
                        "section"
                    ) || ""
                ).toLowerCase();


            let score =
                Number(
                    getValue(
                        subject,
                        "percentage",
                        "percentage_score",
                        "score",
                        "marks"
                    ) || 0
                );


            const total =
                Number(
                    getValue(
                        subject,
                        "totalQuestions",
                        "total_questions"
                    ) || 0
                );


            const correct =
                Number(
                    getValue(
                        subject,
                        "correctAnswers",
                        "correct_answers"
                    ) || 0
                );


            if (
                score <= 0 &&
                total > 0
            ) {

                score =
                    (
                        correct /
                        total
                    ) * 100;

            }


            score =
                Math.round(
                    score * 100
                ) / 100;


            console.log(
                "Subject:",
                name,
                "| Score:",
                score
            );


            if (
                name.includes("technical")
            ) {

                technicalScore =
                    score;

            }


            else if (
                name.includes("logical") ||
                name.includes("reason")
            ) {

                logicalScore =
                    score;

            }


            else if (
                name.includes("aptitude")
            ) {

                aptitudeScore =
                    score;

            }


            else if (
                name.includes("communication")
            ) {

                communicationScore =
                    score;

            }

        }
    );


    if (technicalScore !== null) {

        setSubjectScore(
            "technicalScore",
            technicalScore
        );


        setSkillPercentage(
            "technicalPercentage",
            "technicalProgress",
            technicalScore
        );

    }


    if (logicalScore !== null) {

        setSubjectScore(
            "logicalScore",
            logicalScore
        );


        setSkillPercentage(
            "logicalPercentage",
            "logicalProgress",
            logicalScore
        );

    }


    if (aptitudeScore !== null) {

        setSubjectScore(
            "aptitudeScore",
            aptitudeScore
        );


        setSkillPercentage(
            "aptitudePercentage",
            "aptitudeProgress",
            aptitudeScore
        );

    }


    if (communicationScore !== null) {

        setSubjectScore(
            "communicationScore",
            communicationScore
        );


        setSkillPercentage(
            "communicationPercentage",
            "communicationProgress",
            communicationScore
        );

    }


    updateReasonDescription(
        "technicalReason",
        technicalScore
    );


    updateReasonDescription(
        "logicalReason",
        logicalScore
    );


    updateReasonDescription(
        "aptitudeReason",
        aptitudeScore
    );


    updateReasonDescription(
        "communicationReason",
        communicationScore
    );

}


/* ============================================================
   SET SUBJECT SCORE
============================================================ */

function setSubjectScore(
    elementId,
    score
) {

    setText(
        elementId,
        formatPercentage(score) + "%"
    );

}


/* ============================================================
   SET SKILL PERCENTAGE
============================================================ */

function setSkillPercentage(
    percentageId,
    progressId,
    score
) {

    setText(
        percentageId,
        formatPercentage(score) + "%"
    );


    const progress =
        document.getElementById(
            progressId
        );


    if (progress) {

        progress.style.width =
            Math.max(
                0,
                Math.min(
                    Number(score) || 0,
                    100
                )
            ) + "%";

    }

}


/* ============================================================
   REASON DESCRIPTION
============================================================ */

function updateReasonDescription(
    elementId,
    score
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) {

        return;

    }


    if (score === null) {

        element.textContent =
            "Subject-wise performance data is not available.";

        return;

    }


    if (score >= 80) {

        element.textContent =
            "Excellent performance in this area. This is one of your strongest skills.";

    }


    else if (score >= 60) {

        element.textContent =
            "Good performance in this area. Continue improving to build stronger career readiness.";

    }


    else if (score >= 40) {

        element.textContent =
            "Your performance is developing. Regular practice can significantly improve this skill.";

    }


    else {

        element.textContent =
            "This area needs improvement. Focused practice and learning can strengthen your foundation.";

    }

}


/* ============================================================
   DEFAULT SKILL PROFILE
   ONLY USED WHEN SUBJECT API IS EMPTY
============================================================ */

function updateSkillProfile(
    overallPercentage
) {

    const aptitude =
        Math.max(
            0,
            overallPercentage - 5
        );


    const logical =
        Math.min(
            100,
            overallPercentage + 3
        );


    const technical =
        Math.min(
            100,
            overallPercentage + 5
        );


    const communication =
        Math.max(
            0,
            overallPercentage - 10
        );


    setSkillPercentage(
        "aptitudePercentage",
        "aptitudeProgress",
        aptitude
    );


    setSkillPercentage(
        "logicalPercentage",
        "logicalProgress",
        logical
    );


    setSkillPercentage(
        "technicalPercentage",
        "technicalProgress",
        technical
    );


    setSkillPercentage(
        "communicationPercentage",
        "communicationProgress",
        communication
    );

}


/* ============================================================
   DEFAULT RECOMMENDATION REASONS
   ONLY USED WHEN SUBJECT API IS EMPTY
============================================================ */

function updateRecommendationReasons(
    percentage
) {

    setSubjectScore(
        "technicalScore",
        Math.min(
            100,
            percentage + 5
        )
    );


    setSubjectScore(
        "logicalScore",
        Math.min(
            100,
            percentage + 3
        )
    );


    setSubjectScore(
        "aptitudeScore",
        Math.max(
            0,
            percentage - 5
        )
    );


    setSubjectScore(
        "communicationScore",
        Math.max(
            0,
            percentage - 10
        )
    );

}


/* ============================================================
   BACKEND RECOMMENDATION REASON
============================================================ */

function updateBackendReason(
    reason
) {

    const technicalReason =
        document.getElementById(
            "technicalReason"
        );


    if (technicalReason) {

        technicalReason.textContent =
            reason;

    }

}


/* ============================================================
   UPDATE STRENGTHS
============================================================ */

function updateStrengths(
    percentage
) {

    const container =
        document.getElementById(
            "strengthList"
        );


    if (!container) {

        console.warn(
            "strengthList container not found."
        );

        return;

    }


    container.innerHTML = "";


    let strengths = [];


    if (percentage >= 80) {

        strengths = [

            {
                icon: "fa-code",

                title:
                    "Strong Technical Foundation",

                text:
                    "Your assessment shows strong technical understanding and a good foundation for technical careers.",

                score:
                    Math.min(
                        100,
                        percentage + 5
                    )
            },


            {
                icon: "fa-brain",

                title:
                    "Excellent Problem Solving",

                text:
                    "You demonstrate strong logical thinking and the ability to approach technical problems effectively.",

                score:
                    Math.min(
                        100,
                        percentage + 2
                    )
            },


            {
                icon: "fa-lightbulb",

                title:
                    "High Learning Potential",

                text:
                    "Your overall performance indicates strong potential to learn advanced technologies and adapt to new environments.",

                score:
                    percentage
            }

        ];

    }


    else if (percentage >= 60) {

        strengths = [

            {
                icon: "fa-laptop-code",

                title:
                    "Good Technical Foundation",

                text:
                    "You have a solid technical base and are ready to strengthen your practical development skills.",

                score:
                    percentage
            },


            {
                icon: "fa-puzzle-piece",

                title:
                    "Problem Solving Ability",

                text:
                    "Your results indicate a good ability to understand problems and apply logical approaches.",

                score:
                    Math.min(
                        100,
                        percentage + 3
                    )
            },


            {
                icon: "fa-arrow-trend-up",

                title:
                    "Strong Growth Potential",

                text:
                    "With regular projects and practice, your current skills can develop into strong career-ready abilities.",

                score:
                    Math.min(
                        100,
                        percentage + 5
                    )
            }

        ];

    }


    else if (percentage >= 40) {

        strengths = [

            {
                icon: "fa-lightbulb",

                title:
                    "Learning Potential",

                text:
                    "You have a developing foundation. Consistent learning can help improve your technical confidence.",

                score:
                    percentage
            },


            {
                icon: "fa-book-open",

                title:
                    "Skill Development Opportunity",

                text:
                    "Your current performance gives you a clear starting point for improving programming and problem-solving skills.",

                score:
                    Math.min(
                        100,
                        percentage + 5
                    )
            },


            {
                icon: "fa-chart-line",

                title:
                    "Room for Growth",

                text:
                    "Regular coding practice, projects and revision can significantly improve your assessment performance.",

                score:
                    Math.min(
                        100,
                        percentage + 8
                    )
            }

        ];

    }


    else {

        strengths = [

            {
                icon: "fa-seedling",

                title:
                    "Growth Potential",

                text:
                    "Your current result is a starting point. Building a consistent learning routine can improve your technical foundation.",

                score:
                    percentage
            },


            {
                icon: "fa-book",

                title:
                    "Learning Opportunity",

                text:
                    "There is an opportunity to strengthen programming, aptitude and logical reasoning fundamentals.",

                score:
                    Math.min(
                        100,
                        percentage + 5
                    )
            },


            {
                icon: "fa-rocket",

                title:
                    "Future Improvement",

                text:
                    "With regular practice and hands-on projects, you can make meaningful progress in future assessments.",

                score:
                    Math.min(
                        100,
                        percentage + 10
                    )
            }

        ];

    }


    strengths.forEach(
        function (
            strength,
            index
        ) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "strength-item";


            if (percentage >= 80) {

                item.classList.add(
                    "strength-excellent"
                );

            }

            else if (percentage >= 60) {

                item.classList.add(
                    "strength-good"
                );

            }

            else if (percentage >= 40) {

                item.classList.add(
                    "strength-developing"
                );

            }

            else {

                item.classList.add(
                    "strength-foundation"
                );

            }


            const safeScore =
                Math.max(
                    0,
                    Math.min(
                        Number(
                            strength.score
                        ) || 0,
                        100
                    )
                );


            item.innerHTML =

                '<div class="strength-number">' +

                    String(
                        index + 1
                    ).padStart(
                        2,
                        "0"
                    ) +

                '</div>' +


                '<div class="strength-icon">' +

                    '<i class="fa-solid ' +

                    escapeHtml(
                        strength.icon
                    ) +

                    '"></i>' +

                '</div>' +


                '<div class="strength-content">' +

                    '<div class="strength-title-row">' +

                        '<h3>' +

                            escapeHtml(
                                strength.title
                            ) +

                        '</h3>' +


                        '<span class="strength-score">' +

                            formatPercentage(
                                safeScore
                            ) +

                            '%' +

                        '</span>' +

                    '</div>' +


                    '<p>' +

                        escapeHtml(
                            strength.text
                        ) +

                    '</p>' +


                    '<div class="strength-meter">' +

                        '<div class="strength-meter-track">' +

                            '<div class="strength-meter-fill" ' +

                            'style="width:' +

                            safeScore +

                            '%;"></div>' +

                        '</div>' +

                    '</div>' +

                '</div>';


            container.appendChild(
                item
            );

        }
    );


    addStrengthStyles();

}


/* ============================================================
   STRENGTH STYLES
============================================================ */

function addStrengthStyles() {

    if (
        document.getElementById(
            "pathfinderStrengthStyles"
        )
    ) {

        return;

    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "pathfinderStrengthStyles";


    style.textContent = `

        .strength-item {
            position: relative;
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 14px 15px;
            margin-bottom: 10px;
            background: #ffffff;
            border: 1px solid #edf1f7;
            border-radius: 12px;
            transition: all 0.2s ease;
        }

        .strength-item:hover {
            transform: translateY(-1px);
            box-shadow: 0 5px 18px rgba(15, 23, 42, 0.07);
            border-color: #dfe6f0;
        }

        .strength-number {
            min-width: 25px;
            font-size: 9px;
            font-weight: 800;
            color: #94a3b8;
            padding-top: 4px;
        }

        .strength-icon {
            width: 36px;
            height: 36px;
            min-width: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 10px;
            background: #f1f5ff;
            color: #2563eb;
            font-size: 14px;
        }

        .strength-content {
            flex: 1;
            min-width: 0;
        }

        .strength-title-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
        }

        .strength-content h3 {
            margin: 0;
            font-size: 12px;
            font-weight: 700;
            color: #172033;
        }

        .strength-content p {
            margin: 4px 0 8px;
            font-size: 10px;
            line-height: 1.45;
            color: #718096;
        }

        .strength-score {
            font-size: 10px;
            font-weight: 800;
            color: #2563eb;
            white-space: nowrap;
        }

        .strength-meter {
            width: 100%;
        }

        .strength-meter-track {
            width: 100%;
            height: 4px;
            background: #edf1f7;
            border-radius: 10px;
            overflow: hidden;
        }

        .strength-meter-fill {
            height: 100%;
            border-radius: 10px;
            background: #2563eb;
            transition: width 0.7s ease;
        }

        .strength-excellent .strength-icon {
            background: #ecfdf5;
            color: #059669;
        }

        .strength-excellent .strength-score {
            color: #059669;
        }

        .strength-excellent .strength-meter-fill {
            background: #059669;
        }

        .strength-good .strength-icon {
            background: #eff6ff;
            color: #2563eb;
        }

        .strength-good .strength-score {
            color: #2563eb;
        }

        .strength-developing .strength-icon {
            background: #fff7ed;
            color: #ea580c;
        }

        .strength-developing .strength-score {
            color: #ea580c;
        }

        .strength-developing .strength-meter-fill {
            background: #ea580c;
        }

        .strength-foundation .strength-icon {
            background: #fefce8;
            color: #ca8a04;
        }

        .strength-foundation .strength-score {
            color: #ca8a04;
        }

        .strength-foundation .strength-meter-fill {
            background: #ca8a04;
        }

        @media (max-width: 600px) {

            .strength-item {
                padding: 12px;
                gap: 9px;
            }

            .strength-number {
                display: none;
            }

            .strength-icon {
                width: 32px;
                height: 32px;
                min-width: 32px;
            }

            .strength-content h3 {
                font-size: 11px;
            }

            .strength-content p {
                font-size: 9px;
            }

        }

    `;


    document.head.appendChild(
        style
    );

}


/* ============================================================
   UPDATE SKILL GAP
   PROFILE SKILLS + BACKEND REQUIRED SKILLS
============================================================ */

function updateSkillGapFromRecommendation(
    requiredSkills
) {

    const currentContainer =
        document.getElementById(
            "currentSkills"
        );


    const improveContainer =
        document.getElementById(
            "improveSkills"
        );


    if (
        !currentContainer ||
        !improveContainer
    ) {

        return;

    }


    currentContainer.innerHTML = "";

    improveContainer.innerHTML = "";


    /*
     * CURRENT SKILLS
     */

    if (
        Array.isArray(profileSkills) &&
        profileSkills.length > 0
    ) {

        profileSkills.forEach(
            function (skill) {

                createSkillTag(
                    currentContainer,
                    skill
                );

            }
        );

    }

    else {

        createSkillTag(
            currentContainer,
            "No skills added in profile"
        );

    }


    /*
     * REQUIRED SKILLS
     */

    const required =
        parseProfileSkills(
            requiredSkills
        );


    /*
     * FIND MISSING SKILLS
     */

    const missingSkills =
        required.filter(
            function (requiredSkill) {

                return !profileSkills.some(
                    function (userSkill) {

                        const user =
                            userSkill
                                .toLowerCase()
                                .trim();


                        const requiredText =
                            requiredSkill
                                .toLowerCase()
                                .trim();


                        return (
                            user === requiredText ||
                            user.includes(
                                requiredText
                            ) ||
                            requiredText.includes(
                                user
                            )
                        );

                    }
                );

            }
        );


    if (
        missingSkills.length === 0
    ) {

        createSkillTag(
            improveContainer,
            "Your profile matches the required skills"
        );

    }

    else {

        missingSkills.forEach(
            function (skill) {

                createSkillTag(
                    improveContainer,
                    skill
                );

            }
        );

    }


    console.log(
        "Current Skills:",
        profileSkills
    );


    console.log(
        "Required Skills:",
        required
    );


    console.log(
        "Missing Skills:",
        missingSkills
    );

}


/* ============================================================
   PARSE PROFILE SKILLS
============================================================ */

function parseProfileSkills(
    skillsValue
) {

    if (
        skillsValue === null ||
        skillsValue === undefined
    ) {

        return [];

    }


    let text =
        String(
            skillsValue
        ).trim();


    if (!text) {

        return [];

    }


    text =
        text.replace(
            /[|;\n\r]+/g,
            ","
        );


    const skills =
        text
            .split(",")
            .map(
                function (skill) {

                    return skill.trim();

                }
            )
            .filter(
                function (skill) {

                    return skill.length > 0;

                }
            );


    const uniqueSkills = [];


    skills.forEach(
        function (skill) {

            const exists =
                uniqueSkills.some(
                    function (existingSkill) {

                        return (
                            existingSkill
                                .toLowerCase() ===
                            skill
                                .toLowerCase()
                        );

                    }
                );


            if (!exists) {

                uniqueSkills.push(
                    skill
                );

            }

        }
    );


    return uniqueSkills;

}


/* ============================================================
   CREATE SKILL TAG
============================================================ */

function createSkillTag(
    container,
    text
) {

    const tag =
        document.createElement(
            "span"
        );


    tag.className =
        "skill-tag";


    tag.textContent =
        text;


    container.appendChild(
        tag
    );

}


/* ============================================================
   ALTERNATIVE CAREERS
   UI ALTERNATIVES ONLY
   NO FAKE SCORE
============================================================ */

function updateAlternativeCareers(
    percentage,
    mainCareer
) {

    const container =
        document.getElementById(
            "alternativeCareers"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    /*
     * These are alternative career names only.
     *
     * We intentionally DO NOT generate
     * fake percentage scores here.
     */

    const careers = [

        {
            name:
                "Backend Developer",

            category:
                "Software Development",

            icon:
                "fa-server"
        },


        {
            name:
                "Java Developer",

            category:
                "Application Development",

            icon:
                "fa-coffee"
        },


        {
            name:
                "QA Engineer",

            category:
                "Software Testing",

            icon:
                "fa-bug"
        }

    ];


    careers.forEach(
        function (career) {

            if (
                career.name
                    .toLowerCase() ===
                String(
                    mainCareer
                ).toLowerCase()
            ) {

                return;

            }


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "alternative-card";


            card.innerHTML =

                '<div class="alternative-icon">' +

                    '<i class="fa-solid ' +

                    escapeHtml(
                        career.icon
                    ) +

                    '"></i>' +

                '</div>' +


                '<div class="alternative-info">' +

                    '<h3>' +

                        escapeHtml(
                            career.name
                        ) +

                    '</h3>' +

                    '<span>' +

                        escapeHtml(
                            career.category
                        ) +

                    '</span>' +

                '</div>';


            container.appendChild(
                card
            );

        }
    );

}


/* ============================================================
   MATCH LABEL
============================================================ */

function getMatchLabel(
    percentage
) {

    if (percentage >= 80) {

        return "Excellent Match";

    }


    if (percentage >= 60) {

        return "Good Match";

    }


    if (percentage >= 40) {

        return "Moderate Match";

    }


    return "Developing Match";

}


/* ============================================================
   STATE MANAGEMENT HELPERS
============================================================ */

function setCareerElementVisibility(elementId, isVisible, displayType) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const type = displayType || "flex";
    if (isVisible) {
        el.classList.remove("hidden-state");
        el.style.setProperty("display", type, "important");
    } else {
        el.classList.add("hidden-state");
        el.style.setProperty("display", "none", "important");
    }
}

function showLoading() {
    setCareerElementVisibility("careerLoading", true, "flex");
    setCareerElementVisibility("careerContent", false);
    setCareerElementVisibility("careerNoResults", false);
    setCareerElementVisibility("careerError", false);
    setCareerElementVisibility("recommendationStatus", false);
}

function showEmptyState() {
    setCareerElementVisibility("careerLoading", false);
    setCareerElementVisibility("careerContent", false);
    setCareerElementVisibility("careerNoResults", true, "flex");
    setCareerElementVisibility("careerError", false);
    setCareerElementVisibility("recommendationStatus", false);
}

function showCareerContent() {
    console.log("Showing career content...");
    setCareerElementVisibility("careerLoading", false);
    setCareerElementVisibility("careerNoResults", false);
    setCareerElementVisibility("careerError", false);
    setCareerElementVisibility("careerContent", true, "block");
    setCareerElementVisibility("recommendationStatus", true, "inline-flex");
}

function showPageError(message) {
    console.error("Career Page Error:", message);
    setCareerElementVisibility("careerLoading", false);
    setCareerElementVisibility("careerContent", false);
    setCareerElementVisibility("careerNoResults", false);
    setCareerElementVisibility("recommendationStatus", false);

    const errorMessage = document.getElementById("careerErrorMessage");
    if (errorMessage && message) {
        errorMessage.textContent = message;
    }

    setCareerElementVisibility("careerError", true, "flex");
}

const showError = showPageError;


/* ============================================================
   SET TEXT
============================================================ */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;

    }

}


/* ============================================================
   GET VALUE
============================================================ */

function getValue(
    object,
    camelCaseName,
    snakeCaseName,
    alternativeName,
    fourthName
) {

    if (!object) {

        return null;

    }


    const names = [

        camelCaseName,
        snakeCaseName,
        alternativeName,
        fourthName

    ];


    for (
        let i = 0;
        i < names.length;
        i++
    ) {

        const name =
            names[i];


        if (
            name &&
            object[name] !== undefined &&
            object[name] !== null
        ) {

            return object[name];

        }

    }


    return null;

}


/* ============================================================
   FORMAT PERCENTAGE
============================================================ */

function formatPercentage(
    value
) {

    const number =
        Number(value);


    if (
        !Number.isFinite(number)
    ) {

        return "0";

    }


    if (
        Number.isInteger(number)
    ) {

        return String(number);

    }


    return number.toFixed(2);

}


/* ============================================================
   ESCAPE HTML
============================================================ */

function escapeHtml(
    text
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(text);


    return div.innerHTML;

}


/* ============================================================
   INITIALIZED
============================================================ */

console.log(
    "Career Recommendation JS initialized successfully."
);

console.log(
    "Backend-driven recommendation mode ENABLED."
);

console.log(
    "Automatic recommendation generation ENABLED."
);

console.log(
    "Fake subject scores DISABLED when actual subject data exists."
);

console.log(
    "Fake alternative career scores DISABLED."
);