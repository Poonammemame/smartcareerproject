/* ============================================================
   PATHFINDER - TAKE ASSESSMENT
   ============================================================ */

console.log("======================================");
console.log("takeAssessment.js LOADED");
console.log("======================================");


/* ============================================================
   CONFIGURATION
============================================================ */

window.API_BASE_URL = window.API_BASE_URL || (typeof getApiBaseUrl === "function" ? getApiBaseUrl() : "http://localhost:8090/api");

var ASSESSMENT_STATUS_API =
    (typeof API_ENDPOINTS !== "undefined" && API_ENDPOINTS.ASSESSMENT)
        ? API_ENDPOINTS.ASSESSMENT.STATUS
        : window.API_BASE_URL + "/assessment/status/";

var QUESTION_API =
    (typeof API_ENDPOINTS !== "undefined" && API_ENDPOINTS.QUESTION)
        ? API_ENDPOINTS.QUESTION.ALL
        : window.API_BASE_URL + "/question/all";

var RESULT_API =
    (typeof API_ENDPOINTS !== "undefined" && API_ENDPOINTS.RESULT)
        ? API_ENDPOINTS.RESULT.SAVE
        : window.API_BASE_URL + "/result/save";


/*
 * EXACT ASSESSMENT STRUCTURE
 *
 * Aptitude            = 10
 * Logical Reasoning   = 10
 * Communication       = 10
 * Technical Skills    = 10
 *
 * TOTAL                = 40
 */

const TOTAL_ASSESSMENT_QUESTIONS = 40;

const QUESTIONS_PER_SECTION = 10;


/*
 * Assessment duration
 * 40 minutes = 2400 seconds
 */

const ASSESSMENT_DURATION = 40 * 60;


/* ============================================================
   GLOBAL VARIABLES
============================================================ */

let questions = [];

let currentQuestionIndex = 0;

let answers = [];

let remainingSeconds =
    ASSESSMENT_DURATION;

let timerInterval = null;

let assessmentStarted = false;

let assessmentSubmitted = false;

let userId = null;

let token = null;

let assessmentAssigned = false;


/* ============================================================
   DOM READY
============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "Assessment page loaded"
        );

        initializeAssessment();

    }
);


/* ============================================================
   INITIALIZE ASSESSMENT
============================================================ */

function initializeAssessment() {

    token =
        (typeof getAuthToken === "function" ? getAuthToken() : null) ||
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");


    console.log(
        "TOKEN:",
        token ? "FOUND" : "NOT FOUND"
    );


    userId =
        getUserId();


    console.log(
        "USER ID:",
        userId
    );


    if (!token) {

        showError(
            "Authentication Required",
            "Please login before taking the assessment."
        );

        disableAssessment();

        return;

    }


    if (!userId) {

        showError(
            "User Not Found",
            "Unable to identify the logged-in user."
        );

        disableAssessment();

        return;

    }


    disableAssessment();

    setupAgreement();

    setupButtons();

    checkAssessmentAssignment();

}


/* ============================================================
   GET USER ID
============================================================ */

function getUserId() {

    if (typeof getLoggedInUserId === "function") {
        const id = getLoggedInUserId();
        if (id) return id;
    }

    let id =
        localStorage.getItem("userId") ||
        sessionStorage.getItem("userId");


    if (!id) {

        const userData =
            localStorage.getItem("user") ||
            sessionStorage.getItem("user");


        if (userData) {

            try {

                const user =
                    JSON.parse(userData);


                id =
                    user.userId ||
                    user.id ||
                    user.user_id;

            }

            catch (error) {

                console.error(
                    "Unable to parse user data:",
                    error
                );

            }

        }

    }


    return id;

}


/* ============================================================
   SETUP AGREEMENT
============================================================ */

function setupAgreement() {

    const agreeCheck =
        document.getElementById(
            "agreeCheck"
        );


    const startBtn =
        document.getElementById(
            "startBtn"
        );


    if (
        !agreeCheck ||
        !startBtn
    ) {

        console.error(
            "Agreement elements not found"
        );

        return;

    }


    agreeCheck.addEventListener(
        "change",
        function () {
            if (!assessmentAssigned) {
                this.checked = false;
                startBtn.disabled = true;
                if (typeof Swal !== "undefined") {
                    Swal.fire({
                        icon: "warning",
                        title: "Assessment Not Assigned",
                        text: "This assessment has not been assigned by an administrator yet.",
                        confirmButtonColor: "#4361ee"
                    });
                }
                return;
            }
            startBtn.disabled = !this.checked;
        }
    );

    const agreementContainer = agreeCheck.closest(".agreement");
    if (agreementContainer) {
        agreementContainer.style.cursor = "pointer";
        agreementContainer.addEventListener("click", function (e) {
            if (e.target !== agreeCheck) {
                if (agreeCheck.disabled) return;
                agreeCheck.checked = !agreeCheck.checked;
                agreeCheck.dispatchEvent(new Event("change"));
            }
        });
    }
}


/* ============================================================
   CHECK ASSESSMENT ASSIGNMENT
============================================================ */

function checkAssessmentAssignment() {

    console.log(
        "Checking assessment assignment..."
    );


    const url =
        ASSESSMENT_STATUS_API +
        userId;


    console.log(
        "ASSIGNMENT STATUS URL:",
        url
    );


    const cleanToken = (typeof normalizeAuthToken === "function")
        ? normalizeAuthToken(token)
        : (token ? token.replace(/^Bearer\s+/i, "") : "");

    fetch(
        url,
        {

            method: "GET",

            headers: {

                "Authorization":
                    "Bearer " + cleanToken,

                "Accept":
                    "application/json",

                "Content-Type":
                    "application/json"

            }

        }
    )

    .then(
        function (response) {

            console.log(
                "Assignment Status:",
                response.status
            );


            if (
                response.status === 401
            ) {

                throw new Error(
                    "Your session has expired. Please login again."
                );

            }


            if (
                response.status === 403
            ) {

                throw new Error(
                    "You do not have permission to check the assessment."
                );

            }


            if (
                response.status === 404
            ) {

                throw new Error(
                    "Assessment status API was not found."
                );

            }


            if (!response.ok) {

                throw new Error(
                    "Unable to check assessment assignment."
                );

            }


            return response.json();

        }
    )

    .then(
        function (assigned) {

            console.log(
                "Assignment Response:",
                assigned
            );


            assessmentAssigned =
                assigned === true;


            if (
                assessmentAssigned
            ) {

                handleAssignedAssessment();

            }

            else {

                handleUnassignedAssessment();

            }

        }
    )

    .catch(
        function (error) {

            console.warn(
                "Assignment check error (enforcing admin assignment):",
                error
            );

            assessmentAssigned = false;

            updateAssignmentBadge(
                "pending",
                "Pending Admin Assignment"
            );

            disableAssessment();

        }
    );

}


/* ============================================================
   HANDLE ASSIGNED ASSESSMENT
============================================================ */

function handleAssignedAssessment() {

    console.log(
        "ASSESSMENT ASSIGNED"
    );

    assessmentAssigned = true;

    updateAssignmentBadge(
        "assigned",
        "Assessment Assigned"
    );


    const startBtn =
        document.getElementById(
            "startBtn"
        );


    const agreeCheck =
        document.getElementById(
            "agreeCheck"
        );


    if (agreeCheck) {
        agreeCheck.disabled = false;
        agreeCheck.checked = false;
    }

    if (startBtn) {
        startBtn.disabled = true;
        startBtn.innerHTML = '<i class="fa-solid fa-play"></i> Start Assessment';
    }

}


/* ============================================================
   HANDLE UNASSIGNED ASSESSMENT
============================================================ */

function handleUnassignedAssessment() {

    console.warn(
        "ASSESSMENT NOT ASSIGNED BY ADMIN"
    );

    assessmentAssigned = false;

    updateAssignmentBadge(
        "pending",
        "Pending Admin Assignment"
    );

    disableAssessment();

    const startBtn =
        document.getElementById("startBtn");

    if (startBtn) {
        startBtn.disabled = true;
        startBtn.innerHTML = '<i class="fa-solid fa-lock"></i> Waiting for Admin Assignment';
    }

    const agreeCheck =
        document.getElementById("agreeCheck");

    if (agreeCheck) {
        agreeCheck.checked = false;
        agreeCheck.disabled = true;
    }

    if (typeof Swal !== "undefined") {
        Swal.fire({
            icon: "warning",
            title: "Assessment Not Assigned",
            text: "Your assessment has not been assigned by the administrator yet. You can only start the test after an Admin assigns it to your account.",
            confirmButtonText: "Return to Dashboard",
            confirmButtonColor: "#4361ee",
            allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "userDashboard.jsp";
            }
        });
    } else {
        alert("Your assessment has not been assigned by the administrator yet. Please wait for an Admin to assign it.");
        window.location.href = "userDashboard.jsp";
    }

}


/* ============================================================
   UPDATE ASSIGNMENT BADGE
============================================================ */

function updateAssignmentBadge(
    type,
    text
) {

    const badge =
        document.getElementById(
            "assignmentBadge"
        );


    if (!badge) {

        return;

    }


    if (
        type === "assigned"
    ) {

        badge.innerHTML = `
            <i class="fa-solid fa-circle-check"></i>
            ${text}
        `;


        badge.className =
            "assignment-badge assigned";

    }

    else if (
        type === "pending"
    ) {

        badge.innerHTML = `
            <i class="fa-solid fa-clock"></i>
            ${text}
        `;


        badge.className =
            "assignment-badge pending";

    }

    else {

        badge.innerHTML = `
            <i class="fa-solid fa-circle-exclamation"></i>
            ${text}
        `;


        badge.className =
            "assignment-badge error";

    }

}


/* ============================================================
   DISABLE ASSESSMENT
============================================================ */

function disableAssessment() {

    const startBtn =
        document.getElementById(
            "startBtn"
        );


    const agreeCheck =
        document.getElementById(
            "agreeCheck"
        );


    if (startBtn) {

        startBtn.disabled =
            true;

    }


    if (agreeCheck) {

        agreeCheck.disabled =
            true;

    }

}


/* ============================================================
   SETUP BUTTONS
============================================================ */

function setupButtons() {

    const startBtn =
        document.getElementById(
            "startBtn"
        );


    const prevBtn =
        document.getElementById(
            "prevBtn"
        );


    const nextBtn =
        document.getElementById(
            "nextBtn"
        );


    const form =
        document.getElementById(
            "assessmentForm"
        );


    if (startBtn) {

        startBtn.addEventListener(
            "click",
            function () {

                startAssessment();

            }
        );

    }


    if (prevBtn) {

        prevBtn.addEventListener(
            "click",
            function () {

                previousQuestion();

            }
        );

    }


    if (nextBtn) {

        nextBtn.addEventListener(
            "click",
            function () {

                nextQuestion();

            }
        );

    }


    if (form) {

        form.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                submitAssessment(false);

            }
        );

    }

}


/* ============================================================
   START ASSESSMENT
============================================================ */

function startAssessment() {

    console.log(
        "Starting assessment..."
    );

    if (!assessmentAssigned) {
        if (typeof Swal !== "undefined") {
            Swal.fire({
                icon: "warning",
                title: "Assessment Not Assigned",
                text: "Your assessment has not been assigned by an administrator yet.",
                confirmButtonColor: "#4361ee"
            });
        } else {
            alert("Assessment has not been assigned by an administrator yet.");
        }
        return;
    }

    const agreeCheck =
        document.getElementById(
            "agreeCheck"
        );


    if (!agreeCheck || !agreeCheck.checked) {
        if (typeof Swal !== "undefined") {
            Swal.fire({
                icon: "warning",
                title: "Please Agree to Instructions",
                text: "Please click the checkbox to agree to the assessment instructions before starting.",
                confirmButtonColor: "#4361ee"
            });
        } else {
            alert("Please click the checkbox to agree to the assessment instructions before starting.");
        }
        return;
    }


    if (assessmentStarted) {

        return;

    }


    assessmentStarted =
        true;


    currentQuestionIndex =
        0;


    answers = [];


    localStorage.removeItem(
        "assessmentAnswers"
    );


    loadQuestions();

}


/* ============================================================
   LOAD QUESTIONS
============================================================ */

function loadQuestions() {

    console.log(
        "Loading assessment questions..."
    );


    console.log(
        "QUESTION API:",
        QUESTION_API
    );


    const cleanToken = (typeof normalizeAuthToken === "function")
        ? normalizeAuthToken(token)
        : (token ? token.replace(/^Bearer\s+/i, "") : "");

    fetch(
        QUESTION_API,
        {

            method: "GET",

            headers: {

                "Authorization":
                    "Bearer " + cleanToken,

                "Accept":
                    "application/json",

                "Content-Type":
                    "application/json"

            }

        }
    )

    .then(
        function (response) {

            console.log(
                "Question API Status:",
                response.status
            );


            if (
                response.status === 401
            ) {

                throw new Error(
                    "Your login session has expired. Please login again."
                );

            }


            if (
                response.status === 403
            ) {

                throw new Error(
                    "You do not have permission to access assessment questions."
                );

            }


            if (!response.ok) {

                throw new Error(
                    "Unable to load questions."
                );

            }


            return response.json();

        }
    )

    .then(
        function (data) {

            console.log(
                "QUESTIONS RESPONSE:",
                data
            );


            if (!Array.isArray(data)) {

                throw new Error(
                    "Invalid question response received from server."
                );

            }


            /* =================================================
               ONLY ACTIVE QUESTIONS
            ================================================= */

            const activeQuestions =
                data.filter(
                    function (question) {

                        return (
                            !question.status ||
                            String(
                                question.status
                            ).toUpperCase() === "ACTIVE"
                        );

                    }
                );


            console.log(
                "ACTIVE QUESTIONS:",
                activeQuestions.length
            );


            /* =================================================
               GET EXACTLY 10 FROM EACH SECTION
            ================================================= */

            const aptitude =
                getQuestionsBySection(
                    activeQuestions,
                    "aptitude",
                    QUESTIONS_PER_SECTION
                );


            const logical =
                getQuestionsBySection(
                    activeQuestions,
                    "logical",
                    QUESTIONS_PER_SECTION
                );


            const communication =
                getQuestionsBySection(
                    activeQuestions,
                    "communication",
                    QUESTIONS_PER_SECTION
                );


            const technical =
                getQuestionsBySection(
                    activeQuestions,
                    "technical",
                    QUESTIONS_PER_SECTION
                );


            console.log(
                "APTITUDE:",
                aptitude.length
            );


            console.log(
                "LOGICAL:",
                logical.length
            );


            console.log(
                "COMMUNICATION:",
                communication.length
            );


            console.log(
                "TECHNICAL:",
                technical.length
            );


            /* =================================================
               VALIDATE EACH SECTION
            ================================================= */

            if (
                aptitude.length !==
                QUESTIONS_PER_SECTION
            ) {

                throw new Error(
                    "Aptitude section must contain exactly 10 questions. Found: " +
                    aptitude.length
                );

            }


            if (
                logical.length !==
                QUESTIONS_PER_SECTION
            ) {

                throw new Error(
                    "Logical Reasoning section must contain exactly 10 questions. Found: " +
                    logical.length
                );

            }


            if (
                communication.length !==
                QUESTIONS_PER_SECTION
            ) {

                throw new Error(
                    "Communication section must contain exactly 10 questions. Found: " +
                    communication.length
                );

            }


            if (
                technical.length !==
                QUESTIONS_PER_SECTION
            ) {

                throw new Error(
                    "Technical Skills section must contain exactly 10 questions. Found: " +
                    technical.length
                );

            }


            /* =================================================
               COMBINE EXACTLY 40
            ================================================= */

            questions = [

                ...aptitude,

                ...logical,

                ...communication,

                ...technical

            ];


            /* =================================================
               FINAL SAFETY CHECK
            ================================================= */

            if (
                questions.length !==
                TOTAL_ASSESSMENT_QUESTIONS
            ) {

                throw new Error(
                    "Assessment must contain exactly 40 questions. Found: " +
                    questions.length
                );

            }


            console.log(
                "======================================"
            );


            console.log(
                "FINAL QUESTIONS:",
                questions.length
            );


            console.log(
                "Aptitude:",
                aptitude.length
            );


            console.log(
                "Logical Reasoning:",
                logical.length
            );


            console.log(
                "Communication:",
                communication.length
            );


            console.log(
                "Technical Skills:",
                technical.length
            );


            console.log(
                "======================================"
            );


            /* =================================================
               CREATE ANSWER ARRAY
            ================================================= */

            answers =
                new Array(
                    TOTAL_ASSESSMENT_QUESTIONS
                ).fill(null);


            restoreAnswers();


            updateTotalQuestion();


            /* =================================================
               HIDE INSTRUCTIONS
            ================================================= */

            const instructionSection =
                document.getElementById(
                    "instructionSection"
                );


            if (instructionSection) {

                instructionSection.style.display =
                    "none";

            }


            /* =================================================
               SHOW ASSESSMENT
            ================================================= */

            const assessmentSection =
                document.getElementById(
                    "assessmentSection"
                );


            if (assessmentSection) {

                assessmentSection.style.display =
                    "block";

            }


            /* =================================================
               SHOW FIRST QUESTION
            ================================================= */

            showQuestion();


            /* =================================================
               START TIMER
            ================================================= */

            startTimer();


            if (assessmentSection) {

                assessmentSection.scrollIntoView({

                    behavior:
                        "smooth",

                    block:
                        "start"

                });

            }

        }
    )

    .catch(
        function (error) {

            console.error(
                "Question Loading Error:",
                error
            );


            assessmentStarted =
                false;


            showError(
                "Question Loading Failed",
                error.message
            );

        }
    );

}


/* ============================================================
   GET QUESTIONS BY SECTION
============================================================ */

function getQuestionsBySection(
    allQuestions,
    section,
    limit
) {

    const result = [];


    for (
        let i = 0;
        i < allQuestions.length;
        i++
    ) {

        const question =
            allQuestions[i];


        const category =
            getQuestionCategory(
                question
            );


        if (
            isCategoryMatch(
                category,
                section
            )
        ) {

            result.push(
                question
            );


            if (
                result.length ===
                limit
            ) {

                break;

            }

        }

    }


    return result;

}


/* ============================================================
   GET QUESTION CATEGORY
============================================================ */

function getQuestionCategory(
    question
) {

    if (!question) {

        return "";

    }


    return (

        question.category ||

        question.subject ||

        question.section ||

        question.questionCategory ||

        question.question_category ||

        ""

    )
        .toString()
        .trim();

}


/* ============================================================
   CATEGORY MATCH
============================================================ */

function isCategoryMatch(
    category,
    requiredSection
) {

    const value =
        String(category)
            .toLowerCase()
            .replace(
                /[^a-z]/g,
                ""
            );


    const required =
        String(requiredSection)
            .toLowerCase()
            .replace(
                /[^a-z]/g,
                ""
            );


    /* ========================================================
       APTITUDE
    ======================================================== */

    if (
        required === "aptitude"
    ) {

        return value.includes(
            "aptitude"
        );

    }


    /* ========================================================
       LOGICAL REASONING
    ======================================================== */

    if (
        required === "logical"
    ) {

        return (
            value.includes("logical") ||
            value.includes("reasoning")
        );

    }


    /* ========================================================
       COMMUNICATION
    ======================================================== */

    if (
        required === "communication"
    ) {

        return value.includes(
            "communication"
        );

    }


    /* ========================================================
       TECHNICAL
    ======================================================== */

    if (
        required === "technical"
    ) {

        return value.includes(
            "technical"
        );

    }


    return value === required;

}


/* ============================================================
   UPDATE TOTAL QUESTION
============================================================ */

function updateTotalQuestion() {

    const totalQuestion =
        document.getElementById(
            "totalQuestion"
        );


    if (totalQuestion) {

        totalQuestion.textContent =
            TOTAL_ASSESSMENT_QUESTIONS;

    }

}


/* ============================================================
   SHOW QUESTION
============================================================ */

function showQuestion() {

    if (
        !questions ||
        questions.length === 0
    ) {

        console.error(
            "No questions available"
        );

        return;

    }


    const question =
        questions[
            currentQuestionIndex
        ];


    if (!question) {

        console.error(
            "Question not found:",
            currentQuestionIndex
        );

        return;

    }


    const container =
        document.getElementById(
            "questionContainer"
        );


    if (!container) {

        console.error(
            "questionContainer not found"
        );

        return;

    }


    const questionNumber =
        currentQuestionIndex + 1;


    const total =
        TOTAL_ASSESSMENT_QUESTIONS;


    const currentQuestion =
        document.getElementById(
            "currentQuestion"
        );


    const totalQuestion =
        document.getElementById(
            "totalQuestion"
        );


    if (currentQuestion) {

        currentQuestion.textContent =
            questionNumber;

    }


    if (totalQuestion) {

        totalQuestion.textContent =
            total;

    }


    /* ========================================================
       PROGRESS
    ======================================================== */

    const progress =
        Math.round(
            (
                questionNumber /
                TOTAL_ASSESSMENT_QUESTIONS
            ) * 100
        );


    const progressBar =
        document.getElementById(
            "questionProgress"
        );


    const progressText =
        document.getElementById(
            "progressText"
        );


    if (progressBar) {

        progressBar.style.width =
            progress + "%";

    }


    if (progressText) {

        progressText.textContent =
            progress +
            "% Completed";

    }


    /* ========================================================
       OPTIONS
    ======================================================== */

    const options = [

        {
            key: "A",
            value: question.optionA
        },

        {
            key: "B",
            value: question.optionB
        },

        {
            key: "C",
            value: question.optionC
        },

        {
            key: "D",
            value: question.optionD
        }

    ];


    /* ========================================================
       BUILD QUESTION UI
    ======================================================== */

    let html = "";


    html += `
        <div class="modern-question-wrapper">

            <div class="question-category">
                ${escapeHtml(
                    getQuestionCategory(question) ||
                    "GENERAL"
                )}
            </div>

            <h2 class="modern-question-text">
                ${escapeHtml(
                    question.questionText ||
                    "Question not available"
                )}
            </h2>

            <div class="options-container">
    `;


    options.forEach(
        function (option) {

            if (
                option.value === null ||
                option.value === undefined ||
                option.value === ""
            ) {

                return;

            }


            html += `
                <label class="modern-option">

                    <input
                        type="radio"
                        name="answer"
                        value="${escapeHtml(option.key)}"
                        class="option-radio"
                    >

                    <span class="option-card">

                        <span class="option-letter">
                            ${option.key}
                        </span>

                        <span class="option-text">
                            ${escapeHtml(option.value)}
                        </span>

                        <span class="option-check">
                            <i class="fa-solid fa-check"></i>
                        </span>

                    </span>

                </label>
            `;

        }
    );


    html += `
            </div>

            <div class="question-hint">

                <i class="fa-solid fa-circle-info"></i>

                <span>
                    Select one answer before moving
                    to the next question.
                </span>

            </div>

        </div>
    `;


    container.innerHTML =
        html;


    /* ========================================================
       RESTORE ANSWER
    ======================================================== */

    const savedAnswer =
        answers[
            currentQuestionIndex
        ];


    if (savedAnswer) {

        const selected =
            document.querySelector(
                'input[name="answer"][value="' +
                savedAnswer +
                '"]'
            );


        if (selected) {

            selected.checked =
                true;

        }

    }


    /* ========================================================
       RADIO EVENTS
    ======================================================== */

    const radioButtons =
        document.querySelectorAll(
            'input[name="answer"]'
        );


    radioButtons.forEach(
        function (radio) {

            radio.addEventListener(
                "change",
                function () {

                    answers[
                        currentQuestionIndex
                    ] =
                        this.value;


                    saveAnswers();

                    updateOptionSelection();

                }
            );

        }
    );


    updateOptionSelection();

    updateNavigation();

}


/* ============================================================
   UPDATE OPTION SELECTION
============================================================ */

function updateOptionSelection() {

    const options =
        document.querySelectorAll(
            ".modern-option"
        );


    options.forEach(
        function (option) {

            const radio =
                option.querySelector(
                    ".option-radio"
                );


            const card =
                option.querySelector(
                    ".option-card"
                );


            if (!radio || !card) {

                return;

            }


            if (radio.checked) {

                card.classList.add(
                    "selected"
                );

            }

            else {

                card.classList.remove(
                    "selected"
                );

            }

        }
    );

}


/* ============================================================
   SAVE ANSWERS
============================================================ */

function saveAnswers() {

    try {

        localStorage.setItem(
            "assessmentAnswers",
            JSON.stringify(answers)
        );

    }

    catch (error) {

        console.error(
            "Unable to save answers:",
            error
        );

    }

}


/* ============================================================
   RESTORE ANSWERS
============================================================ */

function restoreAnswers() {

    const saved =
        localStorage.getItem(
            "assessmentAnswers"
        );


    if (!saved) {

        return;

    }


    try {

        const parsed =
            JSON.parse(saved);


        if (Array.isArray(parsed)) {

            for (
                let i = 0;
                i < parsed.length &&
                i < answers.length;
                i++
            ) {

                answers[i] =
                    parsed[i];

            }

        }


        console.log(
            "Previous answers restored"
        );

    }

    catch (error) {

        console.error(
            "Unable to restore answers:",
            error
        );

    }

}


/* ============================================================
   UPDATE NAVIGATION
============================================================ */

function updateNavigation() {

    const prevBtn =
        document.getElementById(
            "prevBtn"
        );


    const nextBtn =
        document.getElementById(
            "nextBtn"
        );


    const submitContainer =
        document.getElementById(
            "submitContainer"
        );


    if (prevBtn) {

        prevBtn.disabled =
            currentQuestionIndex === 0;

    }


    if (
        currentQuestionIndex ===
        questions.length - 1
    ) {

        if (nextBtn) {

            nextBtn.style.display =
                "none";

        }


        if (submitContainer) {

            submitContainer.style.display =
                "flex";

        }

    }

    else {

        if (nextBtn) {

            nextBtn.style.display =
                "flex";

        }


        if (submitContainer) {

            submitContainer.style.display =
                "none";

        }

    }

}


/* ============================================================
   NEXT QUESTION
============================================================ */

function nextQuestion() {

    if (
        !questions ||
        questions.length === 0
    ) {

        return;

    }


    const selectedAnswer =
        document.querySelector(
            'input[name="answer"]:checked'
        );


    if (selectedAnswer) {

        answers[
            currentQuestionIndex
        ] =
            selectedAnswer.value;

    }

    else {

        answers[
            currentQuestionIndex
        ] =
            null;

    }


    saveAnswers();


    if (
        currentQuestionIndex <
        questions.length - 1
    ) {

        currentQuestionIndex++;

        showQuestion();

    }

}


/* ============================================================
   PREVIOUS QUESTION
============================================================ */

function previousQuestion() {

    if (
        currentQuestionIndex <= 0
    ) {

        return;

    }


    const selectedAnswer =
        document.querySelector(
            'input[name="answer"]:checked'
        );


    if (selectedAnswer) {

        answers[
            currentQuestionIndex
        ] =
            selectedAnswer.value;

    }


    saveAnswers();


    currentQuestionIndex--;


    showQuestion();

}


/* ============================================================
   START TIMER
============================================================ */

function startTimer() {

    console.log(
        "Timer started"
    );


    if (timerInterval) {

        clearInterval(
            timerInterval
        );

    }


    remainingSeconds =
        ASSESSMENT_DURATION;


    updateTimerDisplay();


    timerInterval =
        setInterval(
            function () {

                remainingSeconds--;

                updateTimerDisplay();


                if (
                    remainingSeconds <= 0
                ) {

                    clearInterval(
                        timerInterval
                    );


                    timerInterval =
                        null;


                    autoSubmitAssessment();

                }

            },
            1000
        );

}


/* ============================================================
   UPDATE TIMER
============================================================ */

function updateTimerDisplay() {

    const timer =
        document.getElementById(
            "timer"
        );


    if (!timer) {

        return;

    }


    const minutes =
        Math.floor(
            remainingSeconds / 60
        );


    const seconds =
        remainingSeconds % 60;


    timer.textContent =
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0");


    if (
        remainingSeconds <= 300
    ) {

        timer.classList.add(
            "timer-warning"
        );

    }


    if (
        remainingSeconds <= 60
    ) {

        timer.classList.add(
            "timer-danger"
        );

    }

}


/* ============================================================
   AUTO SUBMIT
============================================================ */

function autoSubmitAssessment() {

    if (assessmentSubmitted) {

        return;

    }


    console.log(
        "Assessment time expired."
    );


    saveCurrentAnswer();


    if (
        typeof Swal !== "undefined"
    ) {

        Swal.fire({

            icon: "warning",

            title: "Time's Up!",

            text:
                "Your assessment time has expired. Your assessment will be submitted automatically.",

            confirmButtonText:
                "Submit"

        })
        .then(
            function () {

                submitAssessment(true);

            }
        );

    }

    else {

        submitAssessment(true);

    }

}


/* ============================================================
   SAVE CURRENT ANSWER
============================================================ */

function saveCurrentAnswer() {

    const selected =
        document.querySelector(
            'input[name="answer"]:checked'
        );


    if (selected) {

        answers[
            currentQuestionIndex
        ] =
            selected.value;

    }


    saveAnswers();

}


/* ============================================================
   SUBMIT ASSESSMENT
============================================================ */

function submitAssessment(
    automatic
) {

    if (assessmentSubmitted) {

        return;

    }


    saveCurrentAnswer();


    const answered =
        answeredCount();


    const unanswered =
        questions.length -
        answered;


    if (!automatic) {

        confirmSubmit(
            answered,
            unanswered
        );

        return;

    }


    performSubmission();

}


/* ============================================================
   CONFIRM SUBMIT
============================================================ */

function confirmSubmit(
    answeredCountValue,
    unansweredCountValue
) {

    if (
        typeof Swal === "undefined"
    ) {

        if (
            confirm(
                "Answered: " +
                answeredCountValue +
                " / " +
                questions.length +
                "\n\n" +
                "Unanswered: " +
                unansweredCountValue +
                "\n\n" +
                "Are you sure you want to submit?"
            )
        ) {

            performSubmission();

        }

        return;

    }


    Swal.fire({

        icon: "question",

        title: "Submit Assessment?",

        html:
            "Answered: <strong>" +
            answeredCountValue +
            "</strong> / <strong>" +
            questions.length +
            "</strong><br>" +

            "Unanswered: <strong>" +
            unansweredCountValue +
            "</strong><br><br>" +

            "Unanswered questions will be counted separately.<br>" +
            "Are you sure you want to submit?",

        showCancelButton: true,

        confirmButtonText:
            "Yes, Submit",

        cancelButtonText:
            "Continue Assessment",

        reverseButtons: true

    })
    .then(
        function (result) {

            if (
                result.isConfirmed
            ) {

                performSubmission();

            }

        }
    );

}


/* ============================================================
   PERFORM SUBMISSION
============================================================ */

function performSubmission() {

    if (assessmentSubmitted) {

        return;

    }


    /* ========================================================
       FINAL 40 QUESTION CHECK
    ======================================================== */

    if (
        questions.length !==
        TOTAL_ASSESSMENT_QUESTIONS
    ) {

        showError(
            "Invalid Assessment",
            "Assessment must contain exactly 40 questions."
        );

        return;

    }


    assessmentSubmitted =
        true;


    if (timerInterval) {

        clearInterval(
            timerInterval
        );

        timerInterval =
            null;

    }


    disableAssessmentControls();


    console.log(
        "Submitting assessment..."
    );


    let correctAnswers = 0;

    let wrongAnswers = 0;

    let unanswered = 0;


    /* ========================================================
       CALCULATE OVERALL RESULT
    ======================================================== */

    questions.forEach(
        function (question, index) {

            const selected =
                answers[index];


            if (
                selected === null ||
                selected === undefined ||
                selected === ""
            ) {

                unanswered++;

                return;

            }


            const correct =
                normalizeAnswer(
                    question.correctAnswer
                );


            const userAnswer =
                normalizeAnswer(
                    selected
                );


            if (
                userAnswer &&
                correct &&
                userAnswer === correct
            ) {

                correctAnswers++;

            }

            else {

                wrongAnswers++;

            }

        }
    );


    const totalQuestions =
        questions.length;


    /*
     * Safety calculation
     */

    unanswered =
        totalQuestions -
        correctAnswers -
        wrongAnswers;


    const percentage =
        totalQuestions > 0
            ? Math.round(
                (
                    correctAnswers /
                    totalQuestions
                ) * 100
            )
            : 0;


    /* ========================================================
       CALCULATE SUBJECT RESULTS
    ======================================================== */

    const subjectResults =
        calculateSubjectResults();


    console.log(
        "======================================"
    );


    console.log(
        "FINAL OVERALL RESULT:",
        {
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


    console.log(
        "FINAL SUBJECT RESULTS:",
        subjectResults
    );


    console.log(
        "======================================"
    );


    /* ========================================================
       FINAL RESULT DATA

       IMPORTANT:
       subjectResults IS NOW INCLUDED.
    ======================================================== */

    const resultData = {

        totalQuestions:
            totalQuestions,

        correctAnswers:
            correctAnswers,

        wrongAnswers:
            wrongAnswers,

        unanswered:
            unanswered,

        percentage:
            percentage,

        subjectResults:
            subjectResults

    };


    console.log(
        "RESULT REQUEST BODY:",
        JSON.stringify(
            resultData,
            null,
            2
        )
    );


    /* ========================================================
       SAVE RESULT LOCALLY
    ======================================================== */

    localStorage.setItem(
        "assessmentResult",
        JSON.stringify(
            resultData
        )
    );


    /* ========================================================
       SAVE RESULT TO BACKEND
    ======================================================== */

    saveResultToBackend(
        resultData
    );

}


/* ============================================================
   CALCULATE SUBJECT RESULTS

   EXACTLY:

   Aptitude            = 10
   Logical Reasoning   = 10
   Communication       = 10
   Technical Skills    = 10
============================================================ */

function calculateSubjectResults() {

    const subjects = {

        "Aptitude": {

            totalQuestions: 0,

            correctAnswers: 0,

            wrongAnswers: 0,

            unanswered: 0

        },

        "Logical Reasoning": {

            totalQuestions: 0,

            correctAnswers: 0,

            wrongAnswers: 0,

            unanswered: 0

        },

        "Communication": {

            totalQuestions: 0,

            correctAnswers: 0,

            wrongAnswers: 0,

            unanswered: 0

        },

        "Technical Skills": {

            totalQuestions: 0,

            correctAnswers: 0,

            wrongAnswers: 0,

            unanswered: 0

        }

    };


    /* ========================================================
       PROCESS ALL 40 QUESTIONS
    ======================================================== */

    questions.forEach(
        function (question, index) {

            const category =
                getQuestionCategory(
                    question
                );


            const subject =
                convertToSubjectName(
                    category
                );


            if (!subject) {

                console.warn(
                    "Unknown question category:",
                    category
                );

                return;

            }


            subjects[subject]
                .totalQuestions++;


            const selected =
                answers[index];


            /* ==================================================
               UNANSWERED
            ================================================== */

            if (
                selected === null ||
                selected === undefined ||
                selected === ""
            ) {

                subjects[subject]
                    .unanswered++;

                return;

            }


            /* ==================================================
               CHECK CORRECT ANSWER
            ================================================== */

            const correct =
                normalizeAnswer(
                    question.correctAnswer
                );


            const userAnswer =
                normalizeAnswer(
                    selected
                );


            if (
                userAnswer &&
                correct &&
                userAnswer === correct
            ) {

                subjects[subject]
                    .correctAnswers++;

            }

            else {

                subjects[subject]
                    .wrongAnswers++;

            }

        }
    );


    /* ========================================================
       CREATE FINAL SUBJECT ARRAY
    ======================================================== */

    const result = [];


    Object.keys(subjects)
        .forEach(
            function (subjectName) {

                const subject =
                    subjects[subjectName];


                /* ==================================================
                   SAFETY CALCULATION
                ================================================== */

                subject.wrongAnswers =
                    subject.totalQuestions -
                    subject.correctAnswers -
                    subject.unanswered;


                if (
                    subject.wrongAnswers < 0
                ) {

                    subject.wrongAnswers =
                        0;

                }


                /* ==================================================
                   SUBJECT PERCENTAGE
                ================================================== */

                const percentage =
                    subject.totalQuestions > 0
                        ? Math.round(
                            (
                                subject.correctAnswers /
                                subject.totalQuestions
                            ) * 100
                        )
                        : 0;


                result.push({

                    subject:
                        subjectName,

                    totalQuestions:
                        subject.totalQuestions,

                    correctAnswers:
                        subject.correctAnswers,

                    wrongAnswers:
                        subject.wrongAnswers,

                    unanswered:
                        subject.unanswered,

                    percentage:
                        percentage

                });

            }
        );


    return result;

}


/* ============================================================
   CONVERT CATEGORY TO STANDARD SUBJECT
============================================================ */

function convertToSubjectName(
    category
) {

    const value =
        String(
            category || ""
        )
        .toLowerCase()
        .replace(
            /[^a-z]/g,
            ""
        );


    if (
        value.includes(
            "aptitude"
        )
    ) {

        return "Aptitude";

    }


    if (
        value.includes(
            "logical"
        ) ||
        value.includes(
            "reasoning"
        )
    ) {

        return "Logical Reasoning";

    }


    if (
        value.includes(
            "communication"
        )
    ) {

        return "Communication";

    }


    if (
        value.includes(
            "technical"
        )
    ) {

        return "Technical Skills";

    }


    return null;

}


/* ============================================================
   ANSWERED COUNT
============================================================ */

function answeredCount() {

    return answers.filter(
        function (answer) {

            return (
                answer !== null &&
                answer !== undefined &&
                answer !== ""
            );

        }
    ).length;

}


/* ============================================================
   NORMALIZE ANSWER
============================================================ */

function normalizeAnswer(
    answer
) {

    if (
        answer === null ||
        answer === undefined
    ) {

        return "";

    }


    return String(answer)
        .trim()
        .toUpperCase();

}


/* ============================================================
   SAVE RESULT TO BACKEND
============================================================ */

function saveResultToBackend(
    resultData
) {

    console.log(
        "RESULT API:",
        RESULT_API
    );


    console.log(
        "SENDING RESULT:",
        JSON.stringify(
            resultData,
            null,
            2
        )
    );


    fetch(
        RESULT_API,
        {

            method: "POST",

            headers: {

                "Authorization":
                    "Bearer " + token,

                "Content-Type":
                    "application/json"

            },

            body:
                JSON.stringify(
                    resultData
                )

        }
    )

    .then(
        function (response) {

            console.log(
                "RESULT API STATUS:",
                response.status
            );


            if (
                response.status === 401
            ) {

                throw new Error(
                    "Your login session has expired. Please login again."
                );

            }


            if (
                response.status === 403
            ) {

                throw new Error(
                    "You do not have permission to save the assessment result."
                );

            }


            if (!response.ok) {

                return response.text()
                    .then(
                        function (message) {

                            console.error(
                                "Result API Error:",
                                message
                            );


                            throw new Error(
                                message ||
                                "Failed to save assessment result."
                            );

                        }
                    );

            }


            return response.text();

        }
    )

    .then(
        function (data) {

            console.log(
                "RESULT SAVED:",
                data
            );


            showSuccessAndResult(
                resultData
            );

        }
    )

    .catch(
        function (error) {

            console.error(
                "Result save error:",
                error
            );


            showError(
                "Result Save Failed",
                error.message
            );


            setTimeout(
                function () {

                    showResultPage(
                        resultData
                    );

                },
                2000
            );

        }
    );

}


/* ============================================================
   SHOW SUCCESS
============================================================ */

function showSuccessAndResult(
    resultData
) {

    if (
        typeof Swal === "undefined"
    ) {

        showResultPage(
            resultData
        );

        return;

    }


    Swal.fire({

        icon: "success",

        title: "Assessment Submitted",

        html:
            "<strong>" +
            resultData.correctAnswers +
            "</strong> correct answers out of <strong>" +
            resultData.totalQuestions +
            "</strong>.<br><br>" +

            "<strong>" +
            resultData.wrongAnswers +
            "</strong> wrong answers<br>" +

            "<strong>" +
            resultData.unanswered +
            "</strong> unanswered<br><br>" +

            "Score: <strong>" +
            resultData.percentage +
            "%</strong>",

        confirmButtonText:
            "View Result"

    })
    .then(
        function () {

            showResultPage(
                resultData
            );

        }
    );

}


/* ============================================================
   SHOW RESULT PAGE
============================================================ */

function showResultPage(
    resultData
) {

    const contextPath =
        getContextPath();


    window.location.href =
        (contextPath ? contextPath + "/" : "") +
        "userResults.jsp";

}


/* ============================================================
   GET CONTEXT PATH
============================================================ */

function getContextPath() {

    const path =
        window.location.pathname;


    const parts =
        path.split("/").filter(Boolean);


    if (
        parts.length > 0
    ) {

        if (parts[0].toLowerCase().endsWith(".jsp")) {
            return "";
        }

        return "/" + parts[0];

    }


    return "";

}


/* ============================================================
   DISABLE ASSESSMENT CONTROLS
============================================================ */

function disableAssessmentControls() {

    const prevBtn =
        document.getElementById(
            "prevBtn"
        );


    const nextBtn =
        document.getElementById(
            "nextBtn"
        );


    const submitBtn =
        document.getElementById(
            "submitBtn"
        );


    if (prevBtn) {

        prevBtn.disabled =
            true;

    }


    if (nextBtn) {

        nextBtn.disabled =
            true;

    }


    if (submitBtn) {

        submitBtn.disabled =
            true;

    }

}


/* ============================================================
   HTML ESCAPE
============================================================ */

function escapeHtml(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* ============================================================
   SWEET ALERT - ERROR
============================================================ */

function showError(
    title,
    message
) {

    if (
        typeof Swal !== "undefined"
    ) {

        Swal.fire({

            icon: "error",

            title: title,

            text: message,

            confirmButtonText:
                "OK"

        });

    }

    else {

        alert(
            title +
            "\n\n" +
            message
        );

    }

}


/* ============================================================
   SWEET ALERT - WARNING
============================================================ */

function showWarning(
    title,
    message
) {

    if (
        typeof Swal !== "undefined"
    ) {

        Swal.fire({

            icon: "warning",

            title: title,

            text: message,

            confirmButtonText:
                "OK"

        });

    }

    else {

        alert(
            title +
            "\n\n" +
            message
        );

    }

}


/* ============================================================
   SWEET ALERT - INFO
============================================================ */

function showInfo(
    title,
    message
) {

    if (
        typeof Swal !== "undefined"
    ) {

        Swal.fire({

            icon: "info",

            title: title,

            text: message,

            confirmButtonText:
                "OK"

        });

    }

    else {

        alert(
            title +
            "\n\n" +
            message
        );

    }

}


/* ============================================================
   PREVENT ACCIDENTAL REFRESH
============================================================ */

window.addEventListener(
    "beforeunload",
    function (event) {

        if (
            assessmentStarted &&
            !assessmentSubmitted
        ) {

            event.preventDefault();

            event.returnValue = "";

        }

    }
);


/* ============================================================
   PAGE VISIBILITY
============================================================ */

document.addEventListener(
    "visibilitychange",
    function () {

        if (
            document.hidden &&
            assessmentStarted &&
            !assessmentSubmitted
        ) {

            console.log(
                "Assessment page hidden"
            );

        }

    }
);


/* ============================================================
   END
============================================================ */

console.log(
    "takeAssessment.js READY"
);

console.log(
    "Assessment Configuration:",
    {
        totalQuestions:
            TOTAL_ASSESSMENT_QUESTIONS,

        questionsPerSection:
            QUESTIONS_PER_SECTION,

        durationMinutes:
            ASSESSMENT_DURATION / 60
    }
);