/* ============================================================
   PATHFINDER - USER DASHBOARD
   ============================================================ */

console.log("======================================");
console.log("userDashboard.js LOADED");
console.log("======================================");


/* ============================================================
   CONFIGURATION
============================================================ */

var API_BASE_URL = window.API_BASE_URL || (typeof getApiBaseUrl === "function" ? getApiBaseUrl() : "http://localhost:8090/api");

var RESULT_API =
    (typeof API_ENDPOINTS !== "undefined" && API_ENDPOINTS.RESULT)
        ? API_ENDPOINTS.RESULT.BY_ID.replace(/\/$/, "")
        : API_BASE_URL + "/result";

var MY_RESULT_API =
    (typeof API_ENDPOINTS !== "undefined" && API_ENDPOINTS.RESULT)
        ? API_ENDPOINTS.RESULT.MY
        : RESULT_API + "/my";

var RECOMMENDATION_API =
    (typeof API_ENDPOINTS !== "undefined" && API_ENDPOINTS.RECOMMENDATION)
        ? API_BASE_URL + "/recommendation"
        : API_BASE_URL + "/recommendation";

var MY_RECOMMENDATION_API =
    (typeof API_ENDPOINTS !== "undefined" && API_ENDPOINTS.RECOMMENDATION)
        ? API_ENDPOINTS.RECOMMENDATION.MY
        : RECOMMENDATION_API + "/my";

var PROFILE_API =
    (typeof API_ENDPOINTS !== "undefined" && API_ENDPOINTS.PROFILE)
        ? API_ENDPOINTS.PROFILE.BASE
        : API_BASE_URL + "/profile";


/* ============================================================
   GLOBAL VARIABLES
============================================================ */

let jwtToken = null;

let latestResult = null;

let latestRecommendation = null;


/* ============================================================
   DOM READY
============================================================ */

document.addEventListener("DOMContentLoaded", function () {

    console.log("======================================");
    console.log("User Dashboard Loaded");
    console.log("======================================");


    /* =====================================================
       GET JWT TOKEN
    ===================================================== */

    jwtToken =
        localStorage.getItem("token");


    console.log(
        "JWT Token:",
        jwtToken ? "AVAILABLE" : "NOT AVAILABLE"
    );


    /* =====================================================
       LOAD LOGIN USER NAME
       FROM LOCAL STORAGE
    ===================================================== */

    loadLoginUserName();


    /* =====================================================
       TOKEN CHECK
    ===================================================== */

    if (!jwtToken) {

        console.warn(
            "No JWT token found."
        );

        return;
    }


    /* =====================================================
       LOAD ALL DASHBOARD DATA
    ===================================================== */

    loadDashboardData();

});


/* ============================================================
   LOAD LOGIN USER NAME
   FROM LOCAL STORAGE
============================================================ */

function loadLoginUserName() {

    console.log("======================================");
    console.log("LOADING LOGIN USER NAME");
    console.log("======================================");


    const userName =
        localStorage.getItem("name");


    console.log(
        "LocalStorage Name:",
        userName
    );


    const welcomeUserName =
        document.getElementById(
            "welcomeUserName"
        );


    if (!welcomeUserName) {

        console.warn(
            "welcomeUserName element not found."
        );

        return;
    }


    /* =====================================================
       USER NAME FOUND
    ===================================================== */

    if (userName && userName.trim() !== "") {
        welcomeUserName.textContent = userName.trim();
        console.log("Welcome User Name Updated:", userName);
    } else {
        const token = localStorage.getItem("token");
        if (token) {
            const settingsUrl = (typeof API_ENDPOINTS !== "undefined" && API_ENDPOINTS.SETTINGS)
                ? API_ENDPOINTS.SETTINGS.MY
                : (API_BASE_URL + "/settings/my");

            fetch(settingsUrl, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                }
            })
            .then(function(res) { if (res.ok) return res.json(); })
            .then(function(data) {
                if (data && data.name) {
                    localStorage.setItem("name", data.name);
                    if (data.email) localStorage.setItem("email", data.email);
                    if (data.userId) localStorage.setItem("userId", data.userId);
                    welcomeUserName.textContent = data.name;
                } else {
                    welcomeUserName.textContent = "User";
                }
            })
            .catch(function() {
                welcomeUserName.textContent = "User";
            });
        } else {
            welcomeUserName.textContent = "User";
        }
    }
}


/* ============================================================
   MAIN DASHBOARD LOAD
============================================================ */

function loadDashboardData() {

    console.log(
        "Loading dashboard data..."
    );


    /* =====================================================
       LOAD USER PROFILE
       Used for profile completion
    ===================================================== */

    loadUserProfile();


    /* =====================================================
       LOAD ASSESSMENT RESULT
    ===================================================== */

    loadAssessmentResult();


    /* =====================================================
       LOAD CAREER RECOMMENDATION
    ===================================================== */

    loadCareerRecommendation();


    /* =====================================================
       CHECK ASSESSMENT ASSIGNMENT
    ===================================================== */

    checkAssessmentAssignment();

}


/* ============================================================
   LOAD USER PROFILE
   Used only for PROFILE COMPLETION
============================================================ */

function loadUserProfile() {

    jwtToken =
        localStorage.getItem("token");


    if (!jwtToken) {
        return;
    }


    fetch(
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
            "Profile Status:",
            response.status
        );


        if (response.status === 401) {

            throw new Error(
                "Session expired."
            );

        }


        if (!response.ok) {

            throw new Error(
                "Profile API failed."
            );

        }


        return response.json();

    })

    .then(function (profile) {

        console.log(
            "Dashboard Profile:",
            profile
        );


        /*
         * USER NAME IS NOT FETCHED HERE.
         *
         * USER NAME COMES FROM LOCAL STORAGE.
         *
         * PROFILE API IS USED ONLY FOR
         * PROFILE COMPLETION.
         */

        calculateProfileCompletion(
            profile
        );

    })

    .catch(function (error) {

        console.warn(
            "Profile loading failed:",
            error
        );

    });

}


/* ============================================================
   PROFILE COMPLETION
============================================================ */

function calculateProfileCompletion(profile) {

    if (!profile) {
        return;
    }


    const fields = [

        "education",

        "college",

        "graduationYear",

        "graduation_year",

        "technicalSkills",

        "technical_skills",

        "interests",

        "experienceLevel",

        "experience_level",

        "careerGoal",

        "career_goal"

    ];


    let completed = 0;

    let checked = 0;


    const checkedNames = [];


    fields.forEach(function (field) {

        /*
         * Avoid counting duplicate
         * camelCase / snake_case fields
         */

        const normalized =
            field
                .toLowerCase()
                .replace(/_/g, "");


        if (
            checkedNames.includes(
                normalized
            )
        ) {

            return;

        }


        checkedNames.push(
            normalized
        );


        const value =
            profile[field];


        checked++;


        if (
            value !== null &&
            value !== undefined &&
            String(value).trim() !== ""
        ) {

            completed++;

        }

    });


    let percentage = 0;


    if (checked > 0) {

        percentage =
            Math.round(
                (completed / checked) * 100
            );

    }


    /*
     * Keep between 0 and 100
     */

    percentage =
        Math.max(
            0,
            Math.min(
                percentage,
                100
            )
        );


    setText(
        "profileCompletion",
        percentage + "%"
    );


    console.log(
        "Profile Completion:",
        percentage + "%"
    );

}


/* ============================================================
   LOAD ASSESSMENT RESULT
============================================================ */

function loadAssessmentResult() {

    jwtToken =
        localStorage.getItem("token");


    if (!jwtToken) {
        return;
    }


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
            "Assessment Result Status:",
            response.status
        );


        if (response.status === 401) {

            throw new Error(
                "Session expired."
            );

        }


        if (!response.ok) {

            throw new Error(
                "Assessment result API failed."
            );

        }


        return response.json();

    })

    .then(function (data) {

        console.log(
            "Dashboard Assessment Results:",
            data
        );


        if (
            !Array.isArray(data) ||
            data.length === 0
        ) {

            console.log(
                "No assessment result available."
            );


            setText(
                "assessmentStatus",
                "Pending"
            );


            setText(
                "resultScore",
                "--"
            );


            return;

        }


        /* =====================================================
           GET LATEST RESULT (data is sorted DESC by completed_at)
        ===================================================== */

        latestResult = Array.isArray(data) ? data[0] : data;

        console.log(
            "Latest Dashboard Result:",
            latestResult
        );


        /* =====================================================
           ASSESSMENT STATUS
        ===================================================== */

        setText(
            "assessmentStatus",
            "Completed"
        );


        /* =====================================================
           SCORE
        ===================================================== */

        const percentage =
            getAssessmentPercentage(
                latestResult
            );


        setText(
            "resultScore",
            formatPercentage(
                percentage
            ) + "%"
        );


        /* =====================================================
           PROGRESS
        ===================================================== */

        setText(
            "progressPercent",
            formatPercentage(
                percentage
            ) + "%"
        );


        /* =====================================================
           QUESTION COUNT
        ===================================================== */

        const totalQuestions =
            Number(
                getValue(
                    latestResult,
                    "totalQuestions",
                    "total_questions"
                ) || 40
            );


        const correctAnswers =
            Number(
                getValue(
                    latestResult,
                    "correctAnswers",
                    "correct_answers"
                ) || 0
            );


        setText(
            "questionCount",
            correctAnswers +
            " / " +
            totalQuestions
        );


        /* =====================================================
           ASSESSMENT TITLE
        ===================================================== */

        setText(
            "assessmentTitle",
            "Assessment Completed"
        );


        setText(
            "assessmentDescription",
            "Your assessment has been completed. View your career recommendation to explore suitable career paths."
        );


        /* =====================================================
           PROGRESS CIRCLE
        ===================================================== */

        updateProgressCircle(
            percentage
        );


        console.log(
            "Dashboard Assessment Percentage:",
            percentage
        );

    })

    .catch(function (error) {

        console.warn(
            "Assessment Result Error:",
            error
        );

    });

}


/* ============================================================
   GET ASSESSMENT PERCENTAGE
============================================================ */

function getAssessmentPercentage(result) {

    if (!result) {
        return 0;
    }


    let percentage =
        Number(
            getValue(
                result,
                "percentage",
                "percentage_score"
            ) || 0
        );


    const totalQuestions =
        Number(
            getValue(
                result,
                "totalQuestions",
                "total_questions"
            ) || 0
        );


    const correctAnswers =
        Number(
            getValue(
                result,
                "correctAnswers",
                "correct_answers"
            ) || 0
        );


    /*
     * If backend does not provide
     * percentage, calculate it.
     */

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
   UPDATE ASSESSMENT PROGRESS CIRCLE
============================================================ */

function updateProgressCircle(
    percentage
) {

    const circle =
        document.getElementById(
            "progressCircle"
        );


    if (!circle) {

        console.warn(
            "progressCircle not found."
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


    const degrees =
        safePercentage * 3.6;


    circle.style.background =
        "conic-gradient(" +

        "#2563eb 0deg " +

        degrees +

        "deg, " +

        "#e8edf5 " +

        degrees +

        "deg 360deg)";


    circle.style.setProperty(
        "--progress",
        safePercentage + "%"
    );

}


/* ============================================================
   LOAD CAREER RECOMMENDATION
============================================================ */

function loadCareerRecommendation() {

    console.log("======================================");
    console.log("LOADING DASHBOARD CAREER");
    console.log(
        "API:",
        MY_RECOMMENDATION_API
    );
    console.log("======================================");


    jwtToken =
        localStorage.getItem("token");


    if (!jwtToken) {

        console.warn(
            "JWT token not available."
        );

        return;

    }


    fetch(
        MY_RECOMMENDATION_API,
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
            "Dashboard Recommendation Status:",
            response.status
        );


        if (response.status === 401) {

            throw new Error(
                "Session expired. Please login again."
            );

        }


        if (response.status === 403) {

            throw new Error(
                "You are not authorized to view recommendation."
            );

        }


        if (response.status === 404) {

            console.warn(
                "Recommendation not found."
            );

            return [];

        }


        if (!response.ok) {

            throw new Error(
                "Recommendation API failed. HTTP " +
                response.status
            );

        }


        return response.json();

    })

    .then(function (data) {

        console.log(
            "Dashboard Recommendation:",
            data
        );

        let rec = null;
        if (Array.isArray(data) && data.length > 0) {
            rec = data[0];
        } else if (data && typeof data === "object" && (data.careerName || data.career_name || data.matchPercentage || data.match_percentage || data.recommendationId || data.recommendation_id)) {
            rec = data;
        }

        if (!rec) {
            console.warn(
                "No career recommendation found."
            );
            return;
        }

        /* =====================================================
           FIRST RECOMMENDATION
        ===================================================== */

        latestRecommendation = rec;


        console.log(
            "FIRST RECOMMENDATION:",
            latestRecommendation
        );


        /* =====================================================
           CAREER NAME
        ===================================================== */

        const careerName =
            getValue(
                latestRecommendation,
                "careerName",
                "career_name"
            );


        /* =====================================================
           MATCH PERCENTAGE
        ===================================================== */

        const matchPercentage =
            Number(
                getValue(
                    latestRecommendation,
                    "matchPercentage",
                    "match_percentage"
                ) || 0
            );


        /* =====================================================
           DESCRIPTION
        ===================================================== */

        const description =
            getValue(
                latestRecommendation,
                "description"
            ) ||
            "Career recommendation based on your assessment.";


        /* =====================================================
           REASON
        ===================================================== */

        const reason =
            getValue(
                latestRecommendation,
                "reason"
            ) ||
            description;


        console.log(
            "Dashboard Career:",
            careerName
        );


        console.log(
            "Dashboard Match:",
            matchPercentage
        );


        console.log(
            "Dashboard Description:",
            description
        );


        console.log(
            "Dashboard Reason:",
            reason
        );


        /* =====================================================
           UPDATE CAREER STAT CARD
        ===================================================== */

        const careerMatch =
            document.getElementById(
                "careerMatch"
            );


        console.log(
            "careerMatch element:",
            careerMatch
        );


        if (careerMatch) {

            careerMatch.textContent =
                careerName ||
                "Career Recommendation";


            careerMatch.style.display =
                "block";


            careerMatch.style.visibility =
                "visible";


            careerMatch.style.opacity =
                "1";

        }


        /* =====================================================
           UPDATE CAREER INSIGHT TITLE
        ===================================================== */

        const recommendationTitle =
            document.getElementById(
                "recommendationTitle"
            );


        console.log(
            "recommendationTitle element:",
            recommendationTitle
        );


        if (recommendationTitle) {

            recommendationTitle.textContent =
                careerName ||
                "Career Recommendation";

        }


        /* =====================================================
           UPDATE CAREER DESCRIPTION
        ===================================================== */

        const recommendationText =
            document.getElementById(
                "recommendationText"
            );


        if (recommendationText) {

            recommendationText.textContent =
                reason;

        }


        /* =====================================================
           UPDATE MATCH PERCENTAGE
        ===================================================== */

        const matchElement =
            document.getElementById(
                "matchPercentage"
            );


        if (matchElement) {

            matchElement.textContent =
                formatPercentage(
                    matchPercentage
                ) + "%";


            matchElement.style.display =
                "block";


            matchElement.style.visibility =
                "visible";


            matchElement.style.opacity =
                "1";

        }


        /* =====================================================
           UPDATE DASHBOARD STATUS
        ===================================================== */

        updateDashboardStatus(
            careerName
        );


        console.log("======================================");
        console.log(
            "CAREER DISPLAY UPDATED"
        );
        console.log(
            "Career:",
            careerName
        );
        console.log(
            "Match:",
            matchPercentage + "%"
        );
        console.log("======================================");

    })

    .catch(function (error) {

        console.error(
            "Dashboard Career Recommendation Error:",
            error
        );

    });

}


/* ============================================================
   UPDATE DASHBOARD STATUS
============================================================ */

function updateDashboardStatus(
    careerName
) {

    const status =
        document.getElementById(
            "dashboardStatus"
        );


    if (!status) {
        return;
    }


    const span =
        status.querySelector(
            "span"
        );


    if (span) {

        span.textContent =
            careerName
                ? "Career Recommendation Ready"
                : "Profile Active";

    }

}


/* ============================================================
   FORMAT PERCENTAGE
============================================================ */

function formatPercentage(
    value
) {

    const number =
        Number(value);


    if (!Number.isFinite(number)) {

        return "0";

    }


    if (Number.isInteger(number)) {

        return String(number);

    }


    return number.toFixed(2);

}


/* ============================================================
   GET VALUE
   Supports camelCase + snake_case
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


    if (!element) {

        console.warn(
            "Element not found:",
            id
        );

        return;

    }


    element.textContent =
        value;

}


/* ============================================================
   CHECK ASSESSMENT ASSIGNMENT
============================================================ */

function checkAssessmentAssignment() {

    jwtToken = localStorage.getItem("token");

    let userId = null;
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
        try {
            const u = JSON.parse(storedUser);
            userId = u.userId || u.id;
        } catch (e) {}
    }
    if (!userId) {
        userId = localStorage.getItem("userId");
    }

    if (!jwtToken || !userId) {
        return;
    }

    const statusUrl =
        (typeof API_ENDPOINTS !== "undefined" && API_ENDPOINTS.ASSESSMENT)
            ? API_ENDPOINTS.ASSESSMENT.STATUS + userId
            : API_BASE_URL + "/assessment/status/" + userId;

    fetch(statusUrl, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + jwtToken,
            "Content-Type": "application/json"
        }
    })
    .then(function (res) {
        if (res.ok) {
            return res.json();
        }
        return false;
    })
    .then(function (isAssigned) {
        console.log("Assessment assignment status:", isAssigned);

        const startBtn = document.getElementById("startAssessmentBtn");
        const btnText = document.getElementById("startAssessmentBtnText");
        const icon = document.getElementById("startAssessmentIcon");
        const quickBtn = document.getElementById("quickTakeAssessmentBtn");
        const cardTitle = document.getElementById("assessmentTitle");
        const cardDesc = document.getElementById("assessmentDescription");

        if (latestResult) {
            return;
        }

        if (isAssigned !== true) {
            setText("assessmentStatus", "Not Assigned");

            if (cardTitle) {
                cardTitle.innerText = "Assessment Waiting for Admin Assignment";
            }
            if (cardDesc) {
                cardDesc.innerText = "Your online assessment has not been assigned by the administrator yet. You can take the assessment once an Admin assigns it to your account.";
            }

            const notAssignedHandler = function (e) {
                e.preventDefault();
                if (typeof Swal !== "undefined") {
                    Swal.fire({
                        icon: "info",
                        title: "Assessment Not Assigned",
                        text: "Your assessment has not been assigned by an administrator yet. Please wait for an Admin to assign it.",
                        confirmButtonColor: "#4361ee"
                    });
                } else {
                    alert("Your assessment has not been assigned by an administrator yet. Please wait for an Admin to assign it.");
                }
                return false;
            };

            if (startBtn) {
                startBtn.style.background = "#94a3b8";
                startBtn.style.cursor = "not-allowed";
                startBtn.onclick = notAssignedHandler;
            }
            if (icon) {
                icon.className = "fa-solid fa-lock";
            }
            if (btnText) {
                btnText.innerText = "Assessment Locked";
            }
            if (quickBtn) {
                quickBtn.onclick = notAssignedHandler;
            }
        } else {
            setText("assessmentStatus", "Assigned");

            if (cardTitle) {
                cardTitle.innerText = "Assessment Ready to Attempt";
            }
            if (cardDesc) {
                cardDesc.innerText = "Your assessment has been assigned by the administrator. Complete your 40-minute evaluation to discover suitable career recommendations.";
            }

            if (startBtn) {
                startBtn.style.background = "";
                startBtn.style.cursor = "pointer";
                startBtn.onclick = null;
            }
            if (icon) {
                icon.className = "fa-solid fa-play";
            }
            if (btnText) {
                btnText.innerText = "Start Assessment";
            }
            if (quickBtn) {
                quickBtn.onclick = null;
            }
        }
    })
    .catch(function (err) {
        console.warn("Could not check assignment status:", err);
    });

}


/* ============================================================
   INITIALIZED
============================================================ */

console.log(
    "User Dashboard JavaScript initialized successfully."
);