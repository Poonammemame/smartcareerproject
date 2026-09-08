/* ============================================================
   PATHFINDER - MANAGE RECOMMENDATIONS
   ADMIN JAVASCRIPT
============================================================ */

console.log("======================================");
console.log("manageRecommendations.js LOADED");
console.log("======================================");


/* ============================================================
   CONFIGURATION
============================================================ */

var API_BASE_URL = window.API_BASE_URL || (typeof getApiBaseUrl === "function" ? getApiBaseUrl() : "http://localhost:8090/api");

var ALL_RECOMMENDATIONS_API =
    (typeof API_ENDPOINTS !== "undefined" && API_ENDPOINTS.RECOMMENDATION)
        ? API_ENDPOINTS.RECOMMENDATION.ALL
        : API_BASE_URL + "/recommendation/all";


/* ============================================================
   GLOBAL VARIABLES
============================================================ */

var jwtToken = null;

var allRecommendations = [];

var filteredRecommendations = [];


/* ============================================================
   GET JWT TOKEN
============================================================ */

function getJwtToken() {

    var keys = [
        "jwtToken",
        "token",
        "jwt",
        "accessToken",
        "adminToken",
        "authToken",
        "admin_token",
        "access_token"
    ];

    var i;
    var token;

    /* LOCAL STORAGE */

    for (i = 0; i < keys.length; i++) {

        try {

            token = localStorage.getItem(keys[i]);

            if (token && token.trim() !== "") {

                console.log(
                    "JWT found in localStorage: " + keys[i]
                );

                return normalizeToken(token);
            }

        } catch (error) {

            console.log("Local storage error:", error);

        }
    }


    /* SESSION STORAGE */

    for (i = 0; i < keys.length; i++) {

        try {

            token = sessionStorage.getItem(keys[i]);

            if (token && token.trim() !== "") {

                console.log(
                    "JWT found in sessionStorage: " + keys[i]
                );

                return normalizeToken(token);
            }

        } catch (error) {

            console.log("Session storage error:", error);

        }
    }


    console.error("JWT token not found");

    return null;
}


/* ============================================================
   NORMALIZE TOKEN
============================================================ */

function normalizeToken(token) {

    if (!token) {
        return null;
    }

    token = String(token).trim();

    if (token.toLowerCase().indexOf("bearer ") === 0) {

        token = token.substring(7).trim();

    }

    return token;
}


/* ============================================================
   DOM READY
============================================================ */

document.addEventListener("DOMContentLoaded", function () {

    console.log("Manage Recommendations Page Loaded");

    jwtToken = getJwtToken();

    if (!jwtToken) {

        showError(
            "Admin login session not found. Please login again."
        );

        return;
    }

    initializePage();

});


/* ============================================================
   INITIALIZE PAGE
============================================================ */

function initializePage() {

    var refreshButton =
        document.getElementById(
            "refreshRecommendationsBtn"
        );

    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            loadRecommendations
        );

    }


    var retryButton =
        document.getElementById(
            "retryRecommendationsBtn"
        );

    if (retryButton) {

        retryButton.addEventListener(
            "click",
            loadRecommendations
        );

    }


    var searchInput =
        document.getElementById(
            "recommendationSearch"
        );

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            applyFilters
        );

    }


    var matchFilter =
        document.getElementById(
            "matchFilter"
        );

    if (matchFilter) {

        matchFilter.addEventListener(
            "change",
            applyFilters
        );

    }


    var careerFilter =
        document.getElementById(
            "careerFilter"
        );

    if (careerFilter) {

        careerFilter.addEventListener(
            "change",
            applyFilters
        );

    }


    var clearButton =
        document.getElementById(
            "clearFiltersBtn"
        );

    if (clearButton) {

        clearButton.addEventListener(
            "click",
            clearFilters
        );

    }


    loadRecommendations();
}


/* ============================================================
   LOAD RECOMMENDATIONS
============================================================ */

function loadRecommendations() {

    console.log("Loading recommendations...");

    showLoading();

    jwtToken = getJwtToken();

    if (!jwtToken) {

        showError(
            "Admin login session not found. Please login again."
        );

        return;
    }


    fetch(
        ALL_RECOMMENDATIONS_API,
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
                "Your admin session has expired. Please login again."
            );
        }


        if (response.status === 403) {

            throw new Error(
                "You are not authorized to view recommendations."
            );
        }


        if (response.status === 404) {

            throw new Error(
                "Recommendation API endpoint was not found."
            );
        }


        if (!response.ok) {

            throw new Error(
                "Unable to load recommendations. HTTP " +
                response.status
            );
        }


        return response.json();

    })

    .then(function (data) {

        console.log(
            "Recommendations API Response:",
            data
        );


        /* ----------------------------------------------------
           NORMALIZE RESPONSE
        ---------------------------------------------------- */

        if (Array.isArray(data)) {

            allRecommendations = data;

        }

        else if (
            data &&
            Array.isArray(data.data)
        ) {

            allRecommendations = data.data;

        }

        else if (
            data &&
            Array.isArray(data.recommendations)
        ) {

            allRecommendations = data.recommendations;

        }

        else if (
            data &&
            Array.isArray(data.content)
        ) {

            allRecommendations = data.content;

        }

        else {

            throw new Error(
                "Invalid recommendation response received from server."
            );
        }


        console.log(
            "Total Recommendations:",
            allRecommendations.length
        );


        updateStatistics(
            allRecommendations
        );


        populateCareerFilter(
            allRecommendations
        );


        filteredRecommendations =
            allRecommendations.slice();


        renderRecommendations(
            filteredRecommendations
        );

    })

    .catch(function (error) {

        console.error(
            "Load Recommendations Error:",
            error
        );

        showError(
            error.message ||
            "Unable to load recommendations."
        );

    });

}


/* ============================================================
   UPDATE STATISTICS
============================================================ */

function updateStatistics(recommendations) {

    var total = recommendations.length;

    var excellent = 0;

    var good = 0;

    var needsImprovement = 0;

    var i;
    var percentage;


    for (i = 0; i < recommendations.length; i++) {

        percentage =
            getPercentage(
                recommendations[i]
            );


        if (percentage >= 80) {

            excellent++;

        }

        else if (percentage >= 60) {

            good++;

        }

        else {

            needsImprovement++;

        }
    }


    setText(
        "totalRecommendations",
        total
    );


    setText(
        "excellentRecommendations",
        excellent
    );


    setText(
        "goodRecommendations",
        good
    );


    setText(
        "needsImprovementRecommendations",
        needsImprovement
    );

}


/* ============================================================
   CAREER FILTER
============================================================ */

function populateCareerFilter(recommendations) {

    var select =
        document.getElementById(
            "careerFilter"
        );

    if (!select) {
        return;
    }


    var careers = [];

    var i;

    var career;


    for (i = 0; i < recommendations.length; i++) {

        career =
            getValue(
                recommendations[i],
                "careerName",
                "career_name",
                "career",
                "recommendedCareer",
                "recommended_career"
            );


        if (
            career &&
            careers.indexOf(String(career)) === -1
        ) {

            careers.push(
                String(career)
            );

        }
    }


    careers.sort();


    select.innerHTML =
        '<option value="all">All Careers</option>';


    for (i = 0; i < careers.length; i++) {

        var option =
            document.createElement("option");

        option.value =
            careers[i];

        option.textContent =
            careers[i];

        select.appendChild(option);
    }

}


/* ============================================================
   APPLY FILTERS
============================================================ */

function applyFilters() {

    var searchInput =
        document.getElementById(
            "recommendationSearch"
        );

    var matchFilter =
        document.getElementById(
            "matchFilter"
        );

    var careerFilter =
        document.getElementById(
            "careerFilter"
        );


    var search =
        searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";


    var match =
        matchFilter
            ? matchFilter.value
            : "all";


    var career =
        careerFilter
            ? careerFilter.value
            : "all";


    filteredRecommendations =
        allRecommendations.filter(
            function (recommendation) {

                var candidateName =
                    String(
                        getValue(
                            recommendation,
                            "candidateName",
                            "candidate_name",
                            "name",
                            "userName",
                            "user_name"
                        ) || ""
                    ).toLowerCase();


                var email =
                    String(
                        getValue(
                            recommendation,
                            "email",
                            "candidateEmail",
                            "candidate_email",
                            "userEmail",
                            "user_email"
                        ) || ""
                    ).toLowerCase();


                var careerName =
                    String(
                        getValue(
                            recommendation,
                            "careerName",
                            "career_name",
                            "career",
                            "recommendedCareer",
                            "recommended_career"
                        ) || ""
                    );


                var percentage =
                    getPercentage(
                        recommendation
                    );


                var matchType =
                    getMatchFilterValue(
                        percentage
                    );


                var searchMatch =
                    search === "" ||
                    candidateName.indexOf(search) !== -1 ||
                    email.indexOf(search) !== -1 ||
                    careerName.toLowerCase().indexOf(search) !== -1;


                var matchMatch =
                    match === "all" ||
                    match === matchType;


                var careerMatch =
                    career === "all" ||
                    careerName === career;


                return (
                    searchMatch &&
                    matchMatch &&
                    careerMatch
                );

            }
        );


    renderRecommendations(
        filteredRecommendations
    );

}


/* ============================================================
   CLEAR FILTERS
============================================================ */

function clearFilters() {

    var searchInput =
        document.getElementById(
            "recommendationSearch"
        );

    var matchFilter =
        document.getElementById(
            "matchFilter"
        );

    var careerFilter =
        document.getElementById(
            "careerFilter"
        );


    if (searchInput) {

        searchInput.value = "";

    }


    if (matchFilter) {

        matchFilter.value = "all";

    }


    if (careerFilter) {

        careerFilter.value = "all";

    }


    filteredRecommendations =
        allRecommendations.slice();


    renderRecommendations(
        filteredRecommendations
    );

}


/* ============================================================
   RENDER TABLE
============================================================ */

function renderRecommendations(recommendations) {

    var loading =
        document.getElementById(
            "recommendationsLoading"
        );

    var error =
        document.getElementById(
            "recommendationsError"
        );

    var empty =
        document.getElementById(
            "recommendationsEmpty"
        );

    var wrapper =
        document.getElementById(
            "recommendationsTableWrapper"
        );

    var tbody =
        document.getElementById(
            "recommendationsTableBody"
        );


    if (loading) {
        loading.style.display = "none";
    }


    if (error) {
        error.style.display = "none";
    }


    if (tbody) {
        tbody.innerHTML = "";
    }


    var count =
        recommendations
            ? recommendations.length
            : 0;


    setText(
        "recommendationCount",
        count +
        (
            count === 1
                ? " Recommendation"
                : " Recommendations"
        )
    );


    if (
        !recommendations ||
        recommendations.length === 0
    ) {

        if (wrapper) {
            wrapper.style.display = "none";
        }

        if (empty) {
            empty.style.display = "flex";
        }

        return;
    }


    if (empty) {
        empty.style.display = "none";
    }


    if (wrapper) {
        wrapper.style.display = "block";
    }


    var i;

    for (i = 0; i < recommendations.length; i++) {

        var row =
            createRecommendationRow(
                recommendations[i],
                i
            );


        if (tbody) {

            tbody.appendChild(row);

        }
    }

}


/* ============================================================
   CREATE TABLE ROW
   EXACTLY 5 COLUMNS
============================================================ */

function createRecommendationRow(
    recommendation,
    index
) {

    var row =
        document.createElement("tr");


    var candidateName =
        getValue(
            recommendation,
            "candidateName",
            "candidate_name",
            "name",
            "userName",
            "user_name"
        );


    var email =
        getValue(
            recommendation,
            "email",
            "candidateEmail",
            "candidate_email",
            "userEmail",
            "user_email"
        );


    var career =
        getValue(
            recommendation,
            "careerName",
            "career_name",
            "career",
            "recommendedCareer",
            "recommended_career"
        );


    var percentage =
        getPercentage(
            recommendation
        );


    var matchLevel =
        getValue(
            recommendation,
            "matchLevel",
            "match_level",
            "level"
        );


    if (!matchLevel) {

        matchLevel =
            getMatchLabel(
                percentage
            );

    }


    var assessment =
        getAssessmentScore(
            recommendation
        );


    var candidateHtml = "";


    if (candidateName) {

        candidateHtml +=
            "<strong>" +
            escapeHtml(candidateName) +
            "</strong>";

    }


    if (email) {

        candidateHtml +=
            "<span>" +
            escapeHtml(email) +
            "</span>";

    }


    if (!candidateHtml) {

        candidateHtml =
            "<strong>Candidate</strong>";

    }


    var careerText =
        career
            ? escapeHtml(career)
            : "-";


    row.innerHTML =
        "<td>" +

            "<div class='candidate-cell'>" +

                "<div class='candidate-avatar'>" +
                    "<i class='fa-solid fa-user'></i>" +
                "</div>" +

                "<div class='candidate-info'>" +
                    candidateHtml +
                "</div>" +

            "</div>" +

        "</td>" +


        "<td>" +

            "<div class='career-cell'>" +

                "<strong>" +
                    careerText +
                "</strong>" +

            "</div>" +

        "</td>" +


        "<td>" +

            "<span class='match-badge " +
                getMatchClass(percentage) +
            "'>" +

                formatPercentage(percentage) +
                "%" +

            "</span>" +

            "<small class='match-level'>" +

                escapeHtml(matchLevel) +

            "</small>" +

        "</td>" +


        "<td>" +

            "<strong class='assessment-score'>" +
                escapeHtml(assessment) +
            "</strong>" +

        "</td>" +


        "<td>" +

            "<button " +
                "type='button' " +
                "class='view-recommendation-btn' " +
                "data-index='" + index + "'>" +

                "<i class='fa-solid fa-eye'></i>" +
                " View" +

            "</button>" +

        "</td>";


    var viewButton =
        row.querySelector(
            ".view-recommendation-btn"
        );


    if (viewButton) {

        viewButton.addEventListener(
            "click",
            function () {

                var selected =
                    filteredRecommendations[index];


                if (selected) {

                    showRecommendationModal(
                        selected
                    );

                }

            }
        );

    }


    return row;
}


/* ============================================================
   SHOW MODAL
============================================================ */

function showRecommendationModal(recommendation) {

    var candidateName =
        getValue(
            recommendation,
            "candidateName",
            "candidate_name",
            "name",
            "userName",
            "user_name"
        );


    var career =
        getValue(
            recommendation,
            "careerName",
            "career_name",
            "career",
            "recommendedCareer",
            "recommended_career"
        );


    var description =
        getValue(
            recommendation,
            "description",
            "careerDescription",
            "career_description"
        );


    var percentage =
        getPercentage(
            recommendation
        );


    var matchLevel =
        getValue(
            recommendation,
            "matchLevel",
            "match_level",
            "level"
        );


    if (!matchLevel) {

        matchLevel =
            getMatchLabel(
                percentage
            );

    }


    var assessment =
        getAssessmentScore(
            recommendation
        );


    setText(
        "modalCandidateName",
        candidateName || "Candidate"
    );


    setText(
        "modalCareerName",
        career || "-"
    );


    setText(
        "modalCareerDescription",
        description ||
        "Career recommendation based on candidate assessment."
    );


    setText(
        "modalMatchPercentage",
        formatPercentage(percentage) + "%"
    );


    setText(
        "modalMatchLevel",
        matchLevel
    );


    setText(
        "modalAssessmentScore",
        assessment
    );


    var icon =
        document.getElementById(
            "modalCareerIcon"
        );


    if (icon) {

        icon.className =
            "fa-solid " +
            getCareerIcon(career);

    }


    var modalElement =
        document.getElementById(
            "recommendationDetailsModal"
        );


    if (
        modalElement &&
        typeof bootstrap !== "undefined"
    ) {

        var modal =
            bootstrap.Modal.getOrCreateInstance(
                modalElement
            );

        modal.show();

    }

}


/* ============================================================
   GET PERCENTAGE
============================================================ */

function getPercentage(recommendation) {

    if (!recommendation) {
        return 0;
    }


    var value =
        getValue(
            recommendation,
            "matchPercentage",
            "match_percentage",
            "percentage",
            "matchScore",
            "match_score"
        );


    var percentage =
        Number(value);


    if (
        isFinite(percentage) &&
        percentage > 0 &&
        percentage <= 1
    ) {

        percentage =
            percentage * 100;

    }


    if (
        !isFinite(percentage) ||
        percentage <= 0
    ) {

        var correct =
            Number(
                getValue(
                    recommendation,
                    "correctAnswers",
                    "correct_answers",
                    "correct"
                ) || 0
            );


        var total =
            Number(
                getValue(
                    recommendation,
                    "totalQuestions",
                    "total_questions",
                    "total"
                ) || 0
            );


        if (total > 0) {

            percentage =
                (correct / total) * 100;

        }

        else {

            percentage = 0;

        }

    }


    percentage =
        Math.max(
            0,
            Math.min(
                100,
                percentage
            )
        );


    return Math.round(
        percentage * 100
    ) / 100;

}


/* ============================================================
   ASSESSMENT SCORE
============================================================ */

function getAssessmentScore(recommendation) {

    if (!recommendation) {
        return "0%";
    }


    var score =
        getValue(
            recommendation,
            "assessmentScore",
            "assessment_score",
            "assessmentPercentage",
            "assessment_percentage"
        );


    if (
        score !== null &&
        score !== undefined &&
        score !== ""
    ) {

        var numericScore =
            Number(score);


        if (isFinite(numericScore)) {

            if (
                numericScore > 0 &&
                numericScore <= 1
            ) {

                numericScore =
                    numericScore * 100;

            }


            return (
                formatPercentage(
                    numericScore
                ) + "%"
            );

        }

    }


    var correct =
        getValue(
            recommendation,
            "correctAnswers",
            "correct_answers",
            "correct"
        );


    var total =
        getValue(
            recommendation,
            "totalQuestions",
            "total_questions",
            "total"
        );


    if (
        correct !== null &&
        total !== null &&
        Number(total) > 0
    ) {

        var percentage =
            (
                Number(correct) /
                Number(total)
            ) * 100;


        return (
            formatPercentage(
                percentage
            ) + "%"
        );

    }


    return (
        formatPercentage(
            getPercentage(recommendation)
        ) + "%"
    );

}


/* ============================================================
   MATCH FILTER VALUE
============================================================ */

function getMatchFilterValue(percentage) {

    if (percentage >= 80) {
        return "excellent";
    }


    if (percentage >= 60) {
        return "good";
    }


    if (percentage >= 40) {
        return "moderate";
    }


    return "developing";
}


/* ============================================================
   MATCH CLASS
============================================================ */

function getMatchClass(percentage) {

    return getMatchFilterValue(
        percentage
    );

}


/* ============================================================
   MATCH LABEL
============================================================ */

function getMatchLabel(percentage) {

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
   CAREER ICON
============================================================ */

function getCareerIcon(career) {

    var name =
        String(career || "").toLowerCase();


    if (name.indexOf("web") !== -1) {
        return "fa-globe";
    }


    if (
        name.indexOf("software") !== -1 ||
        name.indexOf("developer") !== -1
    ) {

        return "fa-code";

    }


    if (name.indexOf("java") !== -1) {
        return "fa-coffee";
    }


    if (name.indexOf("data") !== -1) {
        return "fa-chart-column";
    }


    if (
        name.indexOf("qa") !== -1 ||
        name.indexOf("tester") !== -1
    ) {

        return "fa-bug";

    }


    if (name.indexOf("system") !== -1) {
        return "fa-server";
    }


    if (name.indexOf("support") !== -1) {
        return "fa-headset";
    }


    if (name.indexOf("analyst") !== -1) {
        return "fa-chart-line";
    }


    if (name.indexOf("skill") !== -1) {
        return "fa-graduation-cap";
    }


    return "fa-laptop-code";
}


/* ============================================================
   FORMAT PERCENTAGE
============================================================ */

function formatPercentage(value) {

    var number =
        Number(value);


    if (!isFinite(number)) {
        return "0";
    }


    if (Math.floor(number) === number) {
        return String(number);
    }


    return number.toFixed(2);
}


/* ============================================================
   GET VALUE
============================================================ */

function getValue(object) {

    if (!object) {
        return null;
    }


    var i;
    var name;


    for (i = 1; i < arguments.length; i++) {

        name = arguments[i];


        if (
            name &&
            object[name] !== undefined &&
            object[name] !== null &&
            object[name] !== ""
        ) {

            return object[name];

        }

    }


    return null;
}


/* ============================================================
   SET TEXT
============================================================ */

function setText(id, value) {

    var element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }

}


/* ============================================================
   ESCAPE HTML
============================================================ */

function escapeHtml(text) {

    var div =
        document.createElement("div");


    div.textContent =
        text === null ||
        text === undefined
            ? ""
            : String(text);


    return div.innerHTML;
}


/* ============================================================
   SHOW LOADING
============================================================ */

function showLoading() {

    var loading =
        document.getElementById(
            "recommendationsLoading"
        );

    var error =
        document.getElementById(
            "recommendationsError"
        );

    var empty =
        document.getElementById(
            "recommendationsEmpty"
        );

    var wrapper =
        document.getElementById(
            "recommendationsTableWrapper"
        );


    if (loading) {
        loading.style.display = "flex";
    }


    if (error) {
        error.style.display = "none";
    }


    if (empty) {
        empty.style.display = "none";
    }


    if (wrapper) {
        wrapper.style.display = "none";
    }

}


/* ============================================================
   SHOW ERROR
============================================================ */

function showError(message) {

    console.error(
        "Recommendation Error:",
        message
    );


    var loading =
        document.getElementById(
            "recommendationsLoading"
        );

    var error =
        document.getElementById(
            "recommendationsError"
        );

    var empty =
        document.getElementById(
            "recommendationsEmpty"
        );

    var wrapper =
        document.getElementById(
            "recommendationsTableWrapper"
        );

    var errorMessage =
        document.getElementById(
            "recommendationErrorMessage"
        );


    if (loading) {
        loading.style.display = "none";
    }


    if (empty) {
        empty.style.display = "none";
    }


    if (wrapper) {
        wrapper.style.display = "none";
    }


    if (errorMessage) {

        errorMessage.textContent =
            message;

    }


    if (error) {

        error.style.display =
            "flex";

    }

}


/* ============================================================
   DEBUG AUTH
============================================================ */

function debugAuthStorage() {

    console.log(
        "========== AUTH STORAGE DEBUG =========="
    );


    var keys = [
        "jwtToken",
        "token",
        "jwt",
        "accessToken",
        "adminToken",
        "authToken",
        "admin_token",
        "access_token"
    ];


    var i;


    for (i = 0; i < keys.length; i++) {

        if (localStorage.getItem(keys[i])) {

            console.log(
                "localStorage:",
                keys[i],
                "FOUND"
            );

        }


        if (sessionStorage.getItem(keys[i])) {

            console.log(
                "sessionStorage:",
                keys[i],
                "FOUND"
            );

        }

    }


    console.log(
        "========================================"
    );

}


console.log(
    "Manage Recommendations JS initialized successfully."
);