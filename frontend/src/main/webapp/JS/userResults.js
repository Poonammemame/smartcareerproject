/* ============================================================
   PATHFINDER - USER RESULTS
   ============================================================ */

console.log("======================================");
console.log("userResults.js LOADED");
console.log("======================================");


/* ============================================================
   CONFIGURATION
============================================================ */

window.API_BASE_URL = window.API_BASE_URL || (typeof getApiBaseUrl === "function" ? getApiBaseUrl() : "http://localhost:8090/api");

var RESULT_API =
    (typeof API_ENDPOINTS !== "undefined" && API_ENDPOINTS.RESULT)
        ? API_ENDPOINTS.RESULT.BY_ID.replace(/\/$/, "")
        : window.API_BASE_URL + "/result";


/* ============================================================
   GLOBAL VARIABLES
============================================================ */

let token = null;
let resultData = null;
let subjectResults = [];


/* ============================================================
   DOM READY
============================================================ */

document.addEventListener("DOMContentLoaded", function () {

    console.log("My Results page loaded");

    initializeResults();

});


/* ============================================================
   STATE MANAGEMENT HELPERS
============================================================ */

function setCardVisibility(elementId, isVisible, displayType) {
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

function showLoadingState() {
    setCardVisibility("resultsLoading", true, "flex");
    setCardVisibility("noResultsContainer", false);
    setCardVisibility("resultsError", false);
    setCardVisibility("resultsContent", false);
    setCardVisibility("headerStatusBadge", false);
}

function showEmptyState() {
    setCardVisibility("resultsLoading", false);
    setCardVisibility("noResultsContainer", true, "flex");
    setCardVisibility("resultsError", false);
    setCardVisibility("resultsContent", false);
    setCardVisibility("headerStatusBadge", false);
}

function showErrorState(title, message) {
    setCardVisibility("resultsLoading", false);
    setCardVisibility("noResultsContainer", false);
    setCardVisibility("resultsContent", false);
    setCardVisibility("headerStatusBadge", false);

    const titleEl = document.getElementById("resultsErrorTitle");
    const msgEl = document.getElementById("resultsErrorMessage");
    if (titleEl && title) titleEl.textContent = title;
    if (msgEl && message) msgEl.textContent = message;

    setCardVisibility("resultsError", true, "flex");
}

function showContentState() {
    setCardVisibility("resultsLoading", false);
    setCardVisibility("noResultsContainer", false);
    setCardVisibility("resultsError", false);
    setCardVisibility("resultsContent", true, "block");
    setCardVisibility("headerStatusBadge", true, "inline-flex");
}


/* ============================================================
   INITIALIZE
============================================================ */

function initializeResults() {

    token = localStorage.getItem("token");

    console.log(
        "TOKEN:",
        token ? "FOUND" : "NOT FOUND"
    );


    if (!token) {

        showErrorState(
            "Authentication Required",
            "Please login before viewing your assessment results."
        );

        return;
    }


    loadUserResult();

}


/* ============================================================
   LOAD USER RESULT
   GET /result/my
============================================================ */

function loadUserResult() {

    showLoadingState();

    const url = RESULT_API + "/my";

    console.log("RESULT API:", url);


    fetch(url, {

        method: "GET",

        headers: {

            "Authorization": "Bearer " + token,

            "Content-Type": "application/json"

        }

    })

    .then(function (response) {

        console.log(
            "Result API Status:",
            response.status
        );


        if (response.status === 401) {

            throw new Error(
                "Your session has expired. Please login again."
            );

        }


        if (response.status === 403) {

            throw new Error(
                "You do not have permission to view your results."
            );

        }


        if (response.status === 404) {

            showEmptyState();
            return null;

        }


        if (!response.ok) {

            throw new Error(
                "Unable to load assessment result."
            );

        }


        return response.json();

    })

    .then(function (data) {

        if (data === null) {
            return;
        }

        console.log(
            "RAW RESULT DATA:",
            data
        );


        /* ====================================================
           HANDLE BOTH RESPONSE TYPES
           1. Array: [ {...}, {...} ]
           2. Single object: {...}
        ==================================================== */

        if (Array.isArray(data)) {

            if (data.length === 0) {

                showEmptyState();
                return;
            }

            resultData = data[0];

        }

        else if (
            data &&
            typeof data === "object"
        ) {

            const hasData = getValue(data, "resultId", "result_id") ||
                            getValue(data, "totalQuestions", "total_questions");

            if (!hasData) {
                showEmptyState();
                return;
            }

            resultData = data;

        }

        else {

            showEmptyState();
            return;
        }


        console.log(
            "LATEST RESULT:",
            resultData
        );


        /* ====================================================
           DISPLAY OVERALL RESULT
        ==================================================== */

        showContentState();
        displayOverallResult(resultData);


        /* ====================================================
           GET RESULT ID
        ==================================================== */

        const resultId = getValue(
            resultData,
            "resultId",
            "result_id"
        );


        console.log(
            "RESULT ID:",
            resultId
        );


        /* ====================================================
           LOAD SUBJECT RESULTS
        ==================================================== */

        if (
            resultId !== null &&
            resultId !== undefined &&
            resultId !== ""
        ) {

            loadSubjectResults(resultId);

        }

        else {

            console.warn(
                "Result ID not found."
            );

        }

    })

    .catch(function (error) {

        console.error(
            "Result Loading Error:",
            error
        );

        showErrorState(
            "Unable to Load Results",
            error.message || "Failed to load assessment data."
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
        "SUBJECT RESULT API:",
        url
    );


    fetch(url, {

        method: "GET",

        headers: {

            "Authorization":
                "Bearer " + token,

            "Content-Type":
                "application/json"

        }

    })

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

            throw new Error(
                "You do not have permission to view these results."
            );

        }


        if (response.status === 404) {

            console.warn(
                "Subject results not found."
            );

            return [];

        }


        if (!response.ok) {

            throw new Error(
                "Unable to load section-wise results."
            );

        }


        return response.json();

    })

    .then(function (data) {

        console.log(
            "SUBJECT RESULTS:",
            data
        );


        if (!Array.isArray(data)) {

            console.error(
                "Expected subject result array:",
                data
            );

            return;
        }


        subjectResults = data;


        displaySubjectResults(subjectResults);

    })

    .catch(function (error) {

        console.error(
            "Subject Result Loading Error:",
            error
        );

    });

}


/* ============================================================
   DISPLAY OVERALL RESULT
============================================================ */

function displayOverallResult(data) {

    if (!data) {

        console.error(
            "Result data is empty."
        );

        return;
    }


    /* ========================================================
       GET DATABASE VALUES
    ======================================================== */

    const totalQuestions = Number(
        getValue(
            data,
            "totalQuestions",
            "total_questions"
        ) || 0
    );


    const correctAnswers = Number(
        getValue(
            data,
            "correctAnswers",
            "correct_answers"
        ) || 0
    );


    const unanswered = Number(
        getValue(
            data,
            "unanswered",
            "unanswered_questions"
        ) || 0
    );


    /*
     * IMPORTANT:
     * Your database already contains wrong_answers.
     * Use it directly.
     */
    let wrongAnswers = Number(
        getValue(
            data,
            "wrongAnswers",
            "wrong_answers"
        ) || 0
    );


    let percentage = Number(
        getValue(
            data,
            "percentage",
            "percentage_score"
        ) || 0
    );


    /* ========================================================
       SAFETY CALCULATION
    ======================================================== */

    if (
        totalQuestions > 0 &&
        (
            correctAnswers +
            wrongAnswers +
            unanswered
        ) !== totalQuestions
    ) {

        wrongAnswers =
            totalQuestions -
            correctAnswers -
            unanswered;

    }


    /* ========================================================
       CALCULATE PERCENTAGE ONLY IF API VALUE IS MISSING
    ======================================================== */

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


    percentage =
        Math.round(
            percentage * 100
        ) / 100;


    console.log(
        "======================================"
    );

    console.log(
        "PROCESSED RESULT"
    );

    console.log(
        "Total:",
        totalQuestions
    );

    console.log(
        "Correct:",
        correctAnswers
    );

    console.log(
        "Wrong:",
        wrongAnswers
    );

    console.log(
        "Unanswered:",
        unanswered
    );

    console.log(
        "Percentage:",
        percentage
    );

    console.log(
        "======================================"
    );


    /* ========================================================
       OVERALL SCORE
    ======================================================== */

    const overallScore =
        document.getElementById(
            "overallScore"
        );


    if (overallScore) {

        overallScore.textContent =
            correctAnswers +
            " / " +
            totalQuestions;

    }


    /* ========================================================
       PERCENTAGE
    ======================================================== */

    const percentageElement =
        document.getElementById(
            "percentage"
        );


    if (percentageElement) {

        percentageElement.textContent =
            formatPercentage(percentage) +
            "%";

    }


    /* ========================================================
       CORRECT
    ======================================================== */

    const correctElement =
        document.getElementById(
            "correctAnswers"
        );


    if (correctElement) {

        correctElement.textContent =
            correctAnswers;

    }


    /* ========================================================
       WRONG
    ======================================================== */

    const wrongElement =
        document.getElementById(
            "wrongAnswers"
        );


    if (wrongElement) {

        wrongElement.textContent =
            wrongAnswers;

    }


    /* ========================================================
       UNANSWERED
    ======================================================== */

    const unansweredElement =
        document.getElementById(
            "unanswered"
        );


    if (unansweredElement) {

        unansweredElement.textContent =
            unanswered;

    }


    /* ========================================================
       TOTAL QUESTIONS

       Your JSP does not have an ID on total.
       So update the 4th performance card.
    ======================================================== */

    const performanceCards =
        document.querySelectorAll(
            ".performance-card"
        );


    if (
        performanceCards &&
        performanceCards.length >= 4
    ) {

        const totalElement =
            performanceCards[3].querySelector(
                "h3"
            );


        if (totalElement) {

            totalElement.textContent =
                totalQuestions;

        }

    }


    /* ========================================================
       PERFORMANCE LEVEL
    ======================================================== */

    const performance =
        getPerformanceLevel(
            percentage
        );


    /* ========================================================
       PERFORMANCE TEXT
    ======================================================== */

    const performanceText =
        document.getElementById(
            "performanceText"
        );


    if (performanceText) {

        performanceText.textContent =
            performance.title;

    }


    /* ========================================================
       PERFORMANCE LEVEL
    ======================================================== */

    const performanceLevel =
        document.getElementById(
            "performanceLevel"
        );


    if (performanceLevel) {

        performanceLevel.textContent =
            performance.level;

    }


    /* ========================================================
       DESCRIPTION
    ======================================================== */

    const performanceDescription =
        document.getElementById(
            "performanceDescription"
        );


    if (performanceDescription) {

        performanceDescription.textContent =
            performance.description;

    }


    /* ========================================================
       LEVEL BADGE
    ======================================================== */

    const levelBadge =
        document.querySelector(
            ".level-badge"
        );


    if (levelBadge) {

        levelBadge.textContent =
            formatPercentage(percentage) +
            "%";

    }


    /* ========================================================
       ASSESSMENT STATUS
    ======================================================== */

    const resultStatus =
        document.querySelector(
            ".result-status span"
        );


    if (resultStatus) {

        resultStatus.textContent =
            "Assessment Completed";

    }

}


/* ============================================================
   DISPLAY SUBJECT RESULTS
============================================================ */

function displaySubjectResults(results) {

    if (
        !results ||
        results.length === 0
    ) {

        console.warn(
            "No subject results available."
        );

        return;
    }


    console.log(
        "Displaying subject results:",
        results
    );


    const subjectItems =
        document.querySelectorAll(
            ".subject-item"
        );


    if (
        !subjectItems ||
        subjectItems.length === 0
    ) {

        console.warn(
            "No .subject-item elements found."
        );

        return;
    }


    subjectItems.forEach(function (item) {

        const heading =
            item.querySelector(
                "h4"
            );


        if (!heading) {

            return;

        }


        const subjectName =
            heading.textContent.trim();


        console.log(
            "Searching subject:",
            subjectName
        );


        const matchedResult =
            findSubjectResult(
                results,
                subjectName
            );


        if (!matchedResult) {

            console.warn(
                "No API result found for:",
                subjectName
            );

            return;
        }


        /* ==================================================
           GET VALUES
        ================================================== */

        const totalQuestions = Number(
            getValue(
                matchedResult,
                "totalQuestions",
                "total_questions"
            ) || 0
        );


        const correctAnswers = Number(
            getValue(
                matchedResult,
                "correctAnswers",
                "correct_answers"
            ) || 0
        );


        const unanswered = Number(
            getValue(
                matchedResult,
                "unanswered",
                "unanswered_questions"
            ) || 0
        );


        let wrongAnswers = Number(
            getValue(
                matchedResult,
                "wrongAnswers",
                "wrong_answers"
            ) || 0
        );


        let percentage = Number(
            getValue(
                matchedResult,
                "percentage",
                "percentage_score"
            ) || 0
        );


        /* ==================================================
           SAFETY CALCULATION
        ================================================== */

        if (
            totalQuestions > 0 &&
            (
                correctAnswers +
                wrongAnswers +
                unanswered
            ) !== totalQuestions
        ) {

            wrongAnswers =
                totalQuestions -
                correctAnswers -
                unanswered;

        }


        /* ==================================================
           CALCULATE PERCENTAGE
        ================================================== */

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


        percentage =
            Math.round(
                percentage * 100
            ) / 100;


        /* ==================================================
           QUESTION COUNT
        ================================================== */

        const questionCount =
            item.querySelector(
                ".subject-info span"
            );


        if (questionCount) {

            questionCount.textContent =
                totalQuestions +
                (
                    totalQuestions === 1
                        ? " Question"
                        : " Questions"
                );

        }


        /* ==================================================
           PROGRESS BAR

           IMPORTANT:
           Your HTML uses:

           .subject-progress-bar

           NOT .subject-progress
        ================================================== */

        const progressBar =
            item.querySelector(
                ".subject-progress-bar"
            );


        if (progressBar) {

            progressBar.style.width =
                Math.min(
                    percentage,
                    100
                ) + "%";


            progressBar.setAttribute(
                "aria-valuenow",
                percentage
            );

        }


        /* ==================================================
           SCORE
        ================================================== */

        const score =
            item.querySelector(
                ".subject-score strong"
            );


        if (score) {

            score.textContent =
                formatPercentage(
                    percentage
                ) +
                "%";

        }


        console.log(
            "Subject updated:",
            {
                subject:
                    subjectName,

                totalQuestions:
                    totalQuestions,

                correctAnswers:
                    correctAnswers,

                wrongAnswers:
                    wrongAnswers,

                unanswered:
                    unanswered,

                percentage:
                    percentage
            }
        );

    });

}


/* ============================================================
   FIND SUBJECT RESULT
============================================================ */

function findSubjectResult(
    results,
    subjectName
) {

    const normalizedName =
        normalizeSubjectName(
            subjectName
        );


    for (
        let i = 0;
        i < results.length;
        i++
    ) {

        const result =
            results[i];


        const apiSubject =
            getValue(
                result,
                "subject",
                "subjectName",
                "subject_name",
                "section"
            );


        if (!apiSubject) {

            continue;

        }


        const normalizedApiSubject =
            normalizeSubjectName(
                apiSubject
            );


        /* ====================================================
           EXACT MATCH
        ==================================================== */

        if (
            normalizedApiSubject ===
            normalizedName
        ) {

            return result;

        }


        /* ====================================================
           FALLBACK MATCH
        ==================================================== */

        if (
            normalizedApiSubject.includes(
                normalizedName
            ) ||
            normalizedName.includes(
                normalizedApiSubject
            )
        ) {

            return result;

        }

    }


    return null;

}


/* ============================================================
   NORMALIZE SUBJECT NAME
============================================================ */

function normalizeSubjectName(name) {

    if (!name) {

        return "";

    }


    return String(name)
        .toLowerCase()
        .replace(
            /[^a-z0-9]/g,
            ""
        );

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
   FORMAT PERCENTAGE
============================================================ */

function formatPercentage(value) {

    const number =
        Number(value);


    if (Number.isInteger(number)) {

        return String(number);

    }


    return number.toFixed(2);

}


/* ============================================================
   PERFORMANCE LEVEL
============================================================ */

function getPerformanceLevel(
    percentage
) {

    if (percentage >= 80) {

        return {

            title:
                "Excellent Performance",

            level:
                "Outstanding Candidate",

            description:
                "Excellent performance! Your assessment score shows strong skills across the evaluated areas."

        };

    }


    if (percentage >= 60) {

        return {

            title:
                "Good Performance",

            level:
                "Strong Candidate",

            description:
                "Your assessment score indicates good overall performance across the evaluated skill areas."

        };

    }


    if (percentage >= 40) {

        return {

            title:
                "Average Performance",

            level:
                "Developing Candidate",

            description:
                "You have demonstrated a developing skill level. Strengthening key areas can improve your career readiness."

        };

    }


    return {

        title:
            "Needs Improvement",

        level:
            "Skill Development Recommended",

        description:
            "Your results indicate that additional practice and skill development would help improve your career readiness."

    };

}


/* ============================================================
   SHOW ERROR
============================================================ */

function showError(
    title,
    message
) {
    if (typeof showErrorState === "function") {
        showErrorState(title, message);
    } else if (typeof Swal !== "undefined") {
        Swal.fire({
            icon: "error",
            title: title,
            text: message,
            confirmButtonText: "OK"
        });
    } else {
        console.error(title + ": " + message);
    }
}


/* ============================================================
   END
============================================================ */

console.log(
    "userResults.js READY"
);