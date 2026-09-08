console.log("=================================");
console.log("manageQuestions.js loaded");
console.log("=================================");

/* ============================================================
   BACKEND API
============================================================ */

var API_BASE_URL = window.API_BASE_URL || (typeof getApiBaseUrl === "function" ? getApiBaseUrl() : "http://localhost:8090/api");

var QUESTION_API =
    (typeof API_ENDPOINTS !== "undefined" && API_ENDPOINTS.QUESTION)
        ? API_ENDPOINTS.QUESTION.ALL.replace(/\/all$/, "")
        : API_BASE_URL + "/question";

console.log("QUESTION API:", QUESTION_API);


/* ============================================================
   GLOBAL DATA
============================================================ */

let allQuestions = [];
let filteredQuestions = [];

let currentPage = 1;

const QUESTIONS_PER_PAGE = 10;


/* ============================================================
   PAGE LOAD
============================================================ */

document.addEventListener("DOMContentLoaded", function () {

    console.log("Manage Questions page loaded");

    loadQuestions();

    setupSearch();

    setupFilters();

    setupAddQuestionButton();

    setupModalEvents();

    setupPaginationEvents();

});


/* ============================================================
   TOKEN
============================================================ */

function getToken() {

    const token =
        localStorage.getItem("token");

    if (!token) {

        console.error("JWT token not found");

        showError(
            "Please login again."
        );

        return null;
    }

    return token;
}


/* ============================================================
   LOAD ALL QUESTIONS
============================================================ */

function loadQuestions() {

    console.log("==============================");
    console.log("Loading questions");
    console.log(
        "URL:",
        QUESTION_API + "/all"
    );
    console.log("==============================");

    const token = getToken();

    if (!token) {
        return;
    }

    showTableLoading();

    fetch(
        QUESTION_API + "/all",
        {
            method: "GET",

            headers: {
                "Authorization":
                    "Bearer " + token,

                "Content-Type":
                    "application/json",

                "Accept":
                    "application/json"
            }
        }
    )

    .then(function (response) {

        console.log(
            "Questions API status:",
            response.status
        );

        if (response.status === 401) {

            throw new Error(
                "Unauthorized. Please login again."
            );
        }

        if (response.status === 403) {

            throw new Error(
                "Access denied. Admin role required."
            );
        }

        if (!response.ok) {

            throw new Error(
                "Failed to load questions. HTTP " +
                response.status
            );
        }

        return response.json();
    })

    .then(function (data) {

        console.log(
            "Questions response:",
            data
        );

        if (!Array.isArray(data)) {

            throw new Error(
                "Invalid questions response"
            );
        }

        allQuestions = data;

        filteredQuestions =
            allQuestions.slice();

        currentPage = 1;

        updateCountsFromQuestions(
            allQuestions
        );

        displayQuestions(
            filteredQuestions
        );
    })

    .catch(function (error) {

        console.error(
            "Error loading questions:",
            error
        );

        hideLoading();

        showError(
            error.message
        );
    });
}


/* ============================================================
   SHOW TABLE LOADING
============================================================ */

function showTableLoading() {

    const tableBody =
        document.getElementById(
            "questionsTableBody"
        );

    const emptyState =
        document.getElementById(
            "emptyState"
        );

    if (!tableBody) {
        return;
    }

    if (emptyState) {
        emptyState.style.display = "none";
    }

    tableBody.innerHTML = `
        <tr id="loadingRow">
            <td colspan="7">
                <div class="question-loading">
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    Loading questions...
                </div>
            </td>
        </tr>
    `;
}


/* ============================================================
   DISPLAY QUESTIONS
============================================================ */

function displayQuestions(questions) {

    const tableBody =
        document.getElementById(
            "questionsTableBody"
        );

    const emptyState =
        document.getElementById(
            "emptyState"
        );

    if (!tableBody) {

        console.error(
            "questionsTableBody not found"
        );

        return;
    }

    tableBody.innerHTML = "";


    /* ========================================================
       EMPTY STATE
    ======================================================== */

    if (
        !questions ||
        questions.length === 0
    ) {

        if (emptyState) {

            emptyState.style.display =
                "block";
        }

        hidePagination();

        return;
    }


    if (emptyState) {

        emptyState.style.display =
            "none";
    }


    /* ========================================================
       TOTAL PAGES
    ======================================================== */

    const totalPages =
        Math.ceil(
            questions.length /
            QUESTIONS_PER_PAGE
        );


    if (currentPage > totalPages) {

        currentPage =
            totalPages;
    }


    if (currentPage < 1) {

        currentPage = 1;
    }


    /* ========================================================
       START / END INDEX
    ======================================================== */

    const startIndex =
        (currentPage - 1) *
        QUESTIONS_PER_PAGE;

    const endIndex =
        Math.min(
            startIndex +
            QUESTIONS_PER_PAGE,
            questions.length
        );


    /* ========================================================
       CURRENT PAGE QUESTIONS
    ======================================================== */

    const pageQuestions =
        questions.slice(
            startIndex,
            endIndex
        );


    /* ========================================================
       CREATE TABLE ROWS
    ======================================================== */

    pageQuestions.forEach(
        function (question, index) {

            const row =
                document.createElement("tr");


            const displayNumber =
                startIndex +
                index +
                1;


            const category =
                question.category ||
                "";


            const difficulty =
                question.difficulty ||
                "";


            const status =
                question.status ||
                "";


            const categoryClass =
                getCategoryClass(
                    category
                );


            const difficultyClass =
                getDifficultyClass(
                    difficulty
                );


            const statusClass =
                getStatusClass(
                    status
                );


            const statusUpper =
                status.toUpperCase();


            const statusIcon =
                statusUpper === "ACTIVE"
                    ? "fa-toggle-off"
                    : "fa-toggle-on";


            const statusText =
                statusUpper === "ACTIVE"
                    ? "Deactivate"
                    : "Activate";


            row.innerHTML = `

                <td>
                    ${displayNumber}
                </td>


                <td class="question-text">
                    ${escapeHtml(
                        question.questionText
                    )}
                </td>


                <td>
                    <span class="category-badge ${categoryClass}">
                        ${escapeHtml(category)}
                    </span>
                </td>


                <td>
                    <span class="difficulty-badge ${difficultyClass}">
                        ${escapeHtml(difficulty)}
                    </span>
                </td>


                <td>
                    <span class="correct-answer">
                        ${escapeHtml(
                            question.correctAnswer
                        )}
                    </span>
                </td>


                <td>
                    <span class="question-status ${statusClass}">
                        <i class="fa-solid fa-circle"></i>
                        ${escapeHtml(status)}
                    </span>
                </td>


                <td>
                    <div class="question-actions">

                        <button
                            type="button"
                            class="btn-edit"
                            onclick="editQuestion(
                                ${question.questionId}
                            )">

                            <i class="fa-solid fa-pen"></i>
                            Edit

                        </button>


                        <button
                            type="button"
                            class="btn-status"
                            onclick="toggleQuestionStatus(
                                ${question.questionId},
                                '${escapeJs(status)}'
                            )">

                            <i class="fa-solid ${statusIcon}"></i>
                            ${statusText}

                        </button>


                        <button
                            type="button"
                            class="btn-delete"
                            onclick="deleteQuestion(
                                ${question.questionId}
                            )">

                            <i class="fa-solid fa-trash"></i>
                            Delete

                        </button>

                    </div>
                </td>
            `;


            tableBody.appendChild(row);
        }
    );


    /* ========================================================
       UPDATE PAGINATION
    ======================================================== */

    updatePagination(
        questions.length
    );
}


/* ============================================================
   CATEGORY CLASS
============================================================ */

function getCategoryClass(category) {

    if (!category) {
        return "";
    }

    switch (
        category.toUpperCase()
    ) {

        case "APTITUDE":
            return "aptitude";

        case "LOGICAL":
            return "logical";

        case "COMMUNICATION":
            return "communication";

        case "TECHNICAL":
            return "technical";

        default:
            return "";
    }
}


/* ============================================================
   DIFFICULTY CLASS
============================================================ */

function getDifficultyClass(
    difficulty
) {

    if (!difficulty) {
        return "";
    }

    switch (
        difficulty.toUpperCase()
    ) {

        case "EASY":
            return "easy";

        case "MEDIUM":
            return "medium";

        case "HARD":
            return "hard";

        default:
            return "";
    }
}


/* ============================================================
   STATUS CLASS
============================================================ */

function getStatusClass(
    status
) {

    if (!status) {
        return "";
    }

    switch (
        status.toUpperCase()
    ) {

        case "ACTIVE":
            return "active";

        case "INACTIVE":
            return "inactive";

        default:
            return "";
    }
}


/* ============================================================
   HTML ESCAPE
============================================================ */

function escapeHtml(value) {

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
   JAVASCRIPT STRING ESCAPE
============================================================ */

function escapeJs(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";
    }

    return String(value)
        .replace(
            /\\/g,
            "\\\\"
        )
        .replace(
            /'/g,
            "\\'"
        );
}


/* ============================================================
   SEARCH
============================================================ */

function setupSearch() {

    const searchInput =
        document.getElementById(
            "searchQuestion"
        );

    if (!searchInput) {
        return;
    }

    searchInput.addEventListener(
        "input",
        function () {

            currentPage = 1;

            applyFilters();
        }
    );
}


/* ============================================================
   FILTERS
============================================================ */

function setupFilters() {

    const categoryFilter =
        document.getElementById(
            "categoryFilter"
        );

    const difficultyFilter =
        document.getElementById(
            "difficultyFilter"
        );

    const statusFilter =
        document.getElementById(
            "statusFilter"
        );


    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            function () {

                currentPage = 1;

                applyFilters();
            }
        );
    }


    if (difficultyFilter) {

        difficultyFilter.addEventListener(
            "change",
            function () {

                currentPage = 1;

                applyFilters();
            }
        );
    }


    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            function () {

                currentPage = 1;

                applyFilters();
            }
        );
    }
}


/* ============================================================
   APPLY FILTERS
============================================================ */

function applyFilters() {

    const searchInput =
        document.getElementById(
            "searchQuestion"
        );

    const categoryFilter =
        document.getElementById(
            "categoryFilter"
        );

    const difficultyFilter =
        document.getElementById(
            "difficultyFilter"
        );

    const statusFilter =
        document.getElementById(
            "statusFilter"
        );


    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const category =
        categoryFilter
            ? categoryFilter.value
                .toUpperCase()
            : "";


    const difficulty =
        difficultyFilter
            ? difficultyFilter.value
                .toUpperCase()
            : "";


    const status =
        statusFilter
            ? statusFilter.value
                .toUpperCase()
            : "";


    filteredQuestions =
        allQuestions.filter(
            function (question) {

                const text =
                    (
                        question.questionText ||
                        ""
                    ).toLowerCase();


                const questionCategory =
                    (
                        question.category ||
                        ""
                    ).toUpperCase();


                const questionDifficulty =
                    (
                        question.difficulty ||
                        ""
                    ).toUpperCase();


                const questionStatus =
                    (
                        question.status ||
                        ""
                    ).toUpperCase();


                const matchesSearch =
                    text.includes(search);


                const matchesCategory =
                    !category ||
                    questionCategory ===
                    category;


                const matchesDifficulty =
                    !difficulty ||
                    questionDifficulty ===
                    difficulty;


                const matchesStatus =
                    !status ||
                    questionStatus ===
                    status;


                return (
                    matchesSearch &&
                    matchesCategory &&
                    matchesDifficulty &&
                    matchesStatus
                );
            }
        );


    displayQuestions(
        filteredQuestions
    );
}


/* ============================================================
   PAGINATION EVENTS
============================================================ */

function setupPaginationEvents() {

    const previousButton =
        document.getElementById(
            "prevPageBtn"
        );

    const nextButton =
        document.getElementById(
            "nextPageBtn"
        );


    if (previousButton) {

        previousButton.addEventListener(
            "click",
            function () {

                if (currentPage > 1) {

                    currentPage--;

                    displayQuestions(
                        filteredQuestions
                    );
                }
            }
        );
    }


    if (nextButton) {

        nextButton.addEventListener(
            "click",
            function () {

                const totalPages =
                    Math.ceil(
                        filteredQuestions.length /
                        QUESTIONS_PER_PAGE
                    );


                if (
                    currentPage <
                    totalPages
                ) {

                    currentPage++;

                    displayQuestions(
                        filteredQuestions
                    );
                }
            }
        );
    }
}


/* ============================================================
   UPDATE PAGINATION
============================================================ */

function updatePagination(
    totalItems
) {

    const pagination =
        document.getElementById(
            "questionPagination"
        );


    const paginationStart =
        document.getElementById(
            "paginationStart"
        );


    const paginationEnd =
        document.getElementById(
            "paginationEnd"
        );


    const paginationTotal =
        document.getElementById(
            "paginationTotal"
        );


    const previousButton =
        document.getElementById(
            "prevPageBtn"
        );


    const nextButton =
        document.getElementById(
            "nextPageBtn"
        );


    const paginationNumbers =
        document.getElementById(
            "paginationNumbers"
        );


    if (!pagination) {
        return;
    }


    /* ========================================================
       NO RESULTS
    ======================================================== */

    if (
        totalItems === 0
    ) {

        pagination.style.display =
            "none";

        if (paginationStart) {
            paginationStart.textContent = "0";
        }

        if (paginationEnd) {
            paginationEnd.textContent = "0";
        }

        if (paginationTotal) {
            paginationTotal.textContent = "0";
        }

        if (paginationNumbers) {
            paginationNumbers.innerHTML = "";
        }

        return;
    }


    /* ========================================================
       SHOW PAGINATION
    ======================================================== */

    pagination.style.display =
        "flex";


    const totalPages =
        Math.ceil(
            totalItems /
            QUESTIONS_PER_PAGE
        );


    const startItem =
        (
            (currentPage - 1) *
            QUESTIONS_PER_PAGE
        ) + 1;


    const endItem =
        Math.min(
            currentPage *
            QUESTIONS_PER_PAGE,
            totalItems
        );


    /* ========================================================
       INFO
    ======================================================== */

    if (paginationStart) {

        paginationStart.textContent =
            startItem;
    }


    if (paginationEnd) {

        paginationEnd.textContent =
            endItem;
    }


    if (paginationTotal) {

        paginationTotal.textContent =
            totalItems;
    }


    /* ========================================================
       PREVIOUS BUTTON
    ======================================================== */

    if (previousButton) {

        previousButton.disabled =
            currentPage === 1;
    }


    /* ========================================================
       NEXT BUTTON
    ======================================================== */

    if (nextButton) {

        nextButton.disabled =
            currentPage === totalPages;
    }


    /* ========================================================
       PAGE NUMBERS
    ======================================================== */

    if (!paginationNumbers) {
        return;
    }


    paginationNumbers.innerHTML = "";


    const maxVisiblePages = 5;


    let startPage =
        Math.max(
            1,
            currentPage -
            Math.floor(
                maxVisiblePages / 2
            )
        );


    let endPage =
        Math.min(
            totalPages,
            startPage +
            maxVisiblePages -
            1
        );


    if (
        endPage -
        startPage +
        1 <
        maxVisiblePages
    ) {

        startPage =
            Math.max(
                1,
                endPage -
                maxVisiblePages +
                1
            );
    }


    /* ========================================================
       FIRST PAGE + ELLIPSIS
    ======================================================== */

    if (startPage > 1) {

        createPageButton(
            1,
            paginationNumbers
        );


        if (startPage > 2) {

            createEllipsis(
                paginationNumbers
            );
        }
    }


    /* ========================================================
       PAGE NUMBERS
    ======================================================== */

    for (
        let page = startPage;
        page <= endPage;
        page++
    ) {

        createPageButton(
            page,
            paginationNumbers
        );
    }


    /* ========================================================
       LAST PAGE + ELLIPSIS
    ======================================================== */

    if (endPage < totalPages) {

        if (
            endPage <
            totalPages - 1
        ) {

            createEllipsis(
                paginationNumbers
            );
        }


        createPageButton(
            totalPages,
            paginationNumbers
        );
    }
}


/* ============================================================
   CREATE PAGE BUTTON
============================================================ */

function createPageButton(
    page,
    container
) {

    const button =
        document.createElement(
            "button"
        );


    button.type =
        "button";


    button.className =
        "pagination-btn";


    button.textContent =
        page;


    if (
        page === currentPage
    ) {

        button.classList.add(
            "active"
        );
    }


    button.addEventListener(
        "click",
        function () {

            currentPage =
                page;

            displayQuestions(
                filteredQuestions
            );
        }
    );


    container.appendChild(
        button
    );
}


/* ============================================================
   CREATE ELLIPSIS
============================================================ */

function createEllipsis(
    container
) {

    const span =
        document.createElement(
            "span"
        );


    span.className =
        "pagination-ellipsis";


    span.textContent =
        "...";


    container.appendChild(
        span
    );
}


/* ============================================================
   HIDE PAGINATION
============================================================ */

function hidePagination() {

    const pagination =
        document.getElementById(
            "questionPagination"
        );


    if (pagination) {

        pagination.style.display =
            "none";
    }
}


/* ============================================================
   LOAD COUNTS
============================================================ */

function loadAllCounts() {

    /*
     * Counts are calculated from allQuestions
     * after /all is loaded.
     *
     * This avoids unnecessary API calls.
     */

    if (allQuestions.length > 0) {

        updateCountsFromQuestions(
            allQuestions
        );
    }
}


/* ============================================================
   UPDATE COUNTS
============================================================ */

function updateCountsFromQuestions(
    questions
) {

    let aptitude = 0;

    let logical = 0;

    let technical = 0;

    let communication = 0;


    questions.forEach(
        function (question) {

            const category =
                (
                    question.category ||
                    ""
                ).toUpperCase();


            if (
                category ===
                "APTITUDE"
            ) {

                aptitude++;
            }

            else if (
                category ===
                "LOGICAL"
            ) {

                logical++;
            }

            else if (
                category ===
                "TECHNICAL"
            ) {

                technical++;
            }

            else if (
                category ===
                "COMMUNICATION"
            ) {

                communication++;
            }
        }
    );


    setText(
        "totalQuestions",
        questions.length
    );


    setText(
        "aptitudeCount",
        aptitude
    );


    setText(
        "logicalCount",
        logical
    );


    setText(
        "technicalCount",
        technical
    );


    setText(
        "communicationCount",
        communication
    );
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


    if (element) {

        element.textContent =
            value;
    }
}


/* ============================================================
   ADD QUESTION BUTTON
============================================================ */

function setupAddQuestionButton() {

    const button =
        document.getElementById(
            "addQuestionBtn"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        function () {

            openAddQuestionModal();
        }
    );
}


/* ============================================================
   MODAL EVENTS
============================================================ */

function setupModalEvents() {

    const closeButton =
        document.getElementById(
            "closeQuestionModal"
        );


    const cancelButton =
        document.getElementById(
            "cancelQuestionModal"
        );


    const saveButton =
        document.getElementById(
            "saveQuestionBtn"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeQuestionModal
        );
    }


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            closeQuestionModal
        );
    }


    if (saveButton) {

        saveButton.addEventListener(
            "click",
            saveQuestion
        );
    }


    const overlay =
        document.getElementById(
            "questionModalOverlay"
        );


    if (overlay) {

        overlay.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    overlay
                ) {

                    closeQuestionModal();
                }
            }
        );
    }


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Escape"
            ) {

                closeQuestionModal();
            }
        }
    );
}


/* ============================================================
   OPEN ADD MODAL
============================================================ */

function openAddQuestionModal() {

    clearQuestionForm();


    const id =
        document.getElementById(
            "editQuestionId"
        );


    if (id) {

        id.value = "";
    }


    setText(
        "questionModalTitle",
        "Add Question"
    );


    setText(
        "questionModalSubtitle",
        "Create a new assessment question."
    );


    setText(
        "saveQuestionText",
        "Save Question"
    );


    const overlay =
        document.getElementById(
            "questionModalOverlay"
        );


    if (overlay) {

        overlay.classList.add(
            "show"
        );
    }
}


/* ============================================================
   OPEN EDIT MODAL
============================================================ */

function editQuestion(id) {

    console.log(
        "Edit question:",
        id
    );


    const token =
        getToken();


    if (!token) {
        return;
    }


    fetch(
        QUESTION_API +
        "/search/" +
        id,
        {
            method: "GET",

            headers: {
                "Authorization":
                    "Bearer " + token,

                "Content-Type":
                    "application/json",

                "Accept":
                    "application/json"
            }
        }
    )

    .then(function (response) {

        if (
            response.status ===
            401
        ) {

            throw new Error(
                "Unauthorized. Please login again."
            );
        }


        if (
            response.status ===
            403
        ) {

            throw new Error(
                "Access denied."
            );
        }


        if (!response.ok) {

            throw new Error(
                "Unable to get question. HTTP " +
                response.status
            );
        }


        return response.json();
    })

    .then(function (question) {

        console.log(
            "Question for edit:",
            question
        );


        fillQuestionForm(
            question
        );


        setText(
            "questionModalTitle",
            "Edit Question"
        );


        setText(
            "questionModalSubtitle",
            "Update the assessment question."
        );


        setText(
            "saveQuestionText",
            "Update Question"
        );


        const overlay =
            document.getElementById(
                "questionModalOverlay"
            );


        if (overlay) {

            overlay.classList.add(
                "show"
            );
        }
    })

    .catch(function (error) {

        console.error(
            "Edit error:",
            error
        );


        showError(
            error.message
        );
    });
}


/* ============================================================
   FILL EDIT FORM
============================================================ */

function fillQuestionForm(
    question
) {

    setValue(
        "editQuestionId",
        question.questionId
    );


    setValue(
        "modalQuestionText",
        question.questionText
    );


    setValue(
        "modalOptionA",
        question.optionA
    );


    setValue(
        "modalOptionB",
        question.optionB
    );


    setValue(
        "modalOptionC",
        question.optionC
    );


    setValue(
        "modalOptionD",
        question.optionD
    );


    setValue(
        "modalCorrectAnswer",
        question.correctAnswer
    );


    setValue(
        "modalCategory",
        question.category
    );


    setValue(
        "modalDifficulty",
        question.difficulty
    );


    setValue(
        "modalStatus",
        question.status
    );
}


/* ============================================================
   SET VALUE
============================================================ */

function setValue(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.value =
            value === null ||
            value === undefined
                ? ""
                : value;
    }
}


/* ============================================================
   CLEAR FORM
============================================================ */

function clearQuestionForm() {

    setValue(
        "editQuestionId",
        ""
    );


    setValue(
        "modalQuestionText",
        ""
    );


    setValue(
        "modalOptionA",
        ""
    );


    setValue(
        "modalOptionB",
        ""
    );


    setValue(
        "modalOptionC",
        ""
    );


    setValue(
        "modalOptionD",
        ""
    );


    setValue(
        "modalCorrectAnswer",
        ""
    );


    setValue(
        "modalCategory",
        ""
    );


    setValue(
        "modalDifficulty",
        ""
    );


    setValue(
        "modalStatus",
        "ACTIVE"
    );
}


/* ============================================================
   CLOSE MODAL
============================================================ */

function closeQuestionModal() {

    const overlay =
        document.getElementById(
            "questionModalOverlay"
        );


    if (overlay) {

        overlay.classList.remove(
            "show"
        );
    }
}


/* ============================================================
   SAVE / UPDATE QUESTION
============================================================ */

function saveQuestion() {

    const token =
        getToken();


    if (!token) {
        return;
    }


    const idElement =
        document.getElementById(
            "editQuestionId"
        );


    const questionId =
        idElement
            ? idElement.value
            : "";


    const questionText =
        document.getElementById(
            "modalQuestionText"
        ).value.trim();


    const optionA =
        document.getElementById(
            "modalOptionA"
        ).value.trim();


    const optionB =
        document.getElementById(
            "modalOptionB"
        ).value.trim();


    const optionC =
        document.getElementById(
            "modalOptionC"
        ).value.trim();


    const optionD =
        document.getElementById(
            "modalOptionD"
        ).value.trim();


    const correctAnswer =
        document.getElementById(
            "modalCorrectAnswer"
        ).value;


    const category =
        document.getElementById(
            "modalCategory"
        ).value;


    const difficulty =
        document.getElementById(
            "modalDifficulty"
        ).value;


    const status =
        document.getElementById(
            "modalStatus"
        ).value;


    /* ========================================================
       VALIDATION
    ======================================================== */

    if (!questionText) {

        showError(
            "Please enter question."
        );

        return;
    }


    if (!optionA) {

        showError(
            "Please enter Option A."
        );

        return;
    }


    if (!optionB) {

        showError(
            "Please enter Option B."
        );

        return;
    }


    if (!optionC) {

        showError(
            "Please enter Option C."
        );

        return;
    }


    if (!optionD) {

        showError(
            "Please enter Option D."
        );

        return;
    }


    if (!correctAnswer) {

        showError(
            "Please select correct answer."
        );

        return;
    }


    if (!category) {

        showError(
            "Please select category."
        );

        return;
    }


    if (!difficulty) {

        showError(
            "Please select difficulty."
        );

        return;
    }


    /* ========================================================
       REQUEST BODY
    ======================================================== */

    const requestData = {

        questionText:
            questionText,

        optionA:
            optionA,

        optionB:
            optionB,

        optionC:
            optionC,

        optionD:
            optionD,

        correctAnswer:
            correctAnswer,

        category:
            category,

        difficulty:
            difficulty,

        status:
            status
    };


    console.log(
        "Question request:",
        requestData
    );


    let url;

    let method;

    let successMessage;


    /* ========================================================
       ADD
    ======================================================== */

    if (!questionId) {

        url =
            QUESTION_API +
            "/add";

        method =
            "POST";

        successMessage =
            "Question added successfully.";
    }


    /* ========================================================
       UPDATE
    ======================================================== */

    else {

        url =
            QUESTION_API +
            "/update?id=" +
            encodeURIComponent(
                questionId
            );

        method =
            "PUT";

        successMessage =
            "Question updated successfully.";
    }


    /* ========================================================
       DISABLE BUTTON
    ======================================================== */

    const saveButton =
        document.getElementById(
            "saveQuestionBtn"
        );


    if (saveButton) {

        saveButton.disabled =
            true;

        saveButton.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Saving...
        `;
    }


    /* ========================================================
       API REQUEST
    ======================================================== */

    fetch(
        url,
        {
            method:
                method,

            headers: {

                "Authorization":
                    "Bearer " + token,

                "Content-Type":
                    "application/json",

                "Accept":
                    "application/json"
            },

            body:
                JSON.stringify(
                    requestData
                )
        }
    )

    .then(function (response) {

        console.log(
            "Save response:",
            response.status
        );


        if (
            response.status ===
            401
        ) {

            throw new Error(
                "Unauthorized. Please login again."
            );
        }


        if (
            response.status ===
            403
        ) {

            throw new Error(
                "Access denied. Admin permission required."
            );
        }


        if (!response.ok) {

            return response.text()
                .then(function (text) {

                    throw new Error(
                        text ||
                        "Request failed. HTTP " +
                        response.status
                    );
                });
        }


        return response.text();
    })

    .then(function () {

        closeQuestionModal();


        showSuccess(
            successMessage
        );


        currentPage = 1;


        loadQuestions();
    })

    .catch(function (error) {

        console.error(
            "Save question error:",
            error
        );


        showError(
            error.message
        );
    })

    .finally(function () {

        if (saveButton) {

            saveButton.disabled =
                false;

            saveButton.innerHTML = `
                <i class="fa-solid fa-check"></i>
                <span id="saveQuestionText">
                    ${questionId
                        ? "Update Question"
                        : "Save Question"}
                </span>
            `;
        }
    });
}


/* ============================================================
   DELETE QUESTION
============================================================ */

function deleteQuestion(id) {

    const token =
        getToken();


    if (!token) {
        return;
    }


    if (
        typeof Swal !==
        "undefined"
    ) {

        Swal.fire({

            title:
                "Delete Question?",

            text:
                "This question will be permanently deleted.",

            icon:
                "warning",

            showCancelButton:
                true,

            confirmButtonColor:
                "#dc2626",

            cancelButtonColor:
                "#6b7280",

            confirmButtonText:
                "Yes, Delete",

            cancelButtonText:
                "Cancel"

        })

        .then(function (result) {

            if (
                result.isConfirmed
            ) {

                performDelete(
                    id
                );
            }
        });
    }

    else {

        if (
            confirm(
                "Delete this question?"
            )
        ) {

            performDelete(
                id
            );
        }
    }
}


/* ============================================================
   PERFORM DELETE
============================================================ */

function performDelete(id) {

    const token =
        getToken();


    if (!token) {
        return;
    }


    fetch(
        QUESTION_API +
        "/delete/" +
        id,
        {
            method:
                "DELETE",

            headers: {

                "Authorization":
                    "Bearer " + token,

                "Accept":
                    "application/json"
            }
        }
    )

    .then(function (response) {

        if (
            response.status ===
            401
        ) {

            throw new Error(
                "Unauthorized."
            );
        }


        if (
            response.status ===
            403
        ) {

            throw new Error(
                "Access denied."
            );
        }


        if (!response.ok) {

            throw new Error(
                "Delete failed. HTTP " +
                response.status
            );
        }


        return response.text();
    })

    .then(function () {

        showSuccess(
            "Question deleted successfully."
        );


        currentPage = 1;


        loadQuestions();
    })

    .catch(function (error) {

        console.error(
            "Delete error:",
            error
        );


        showError(
            error.message
        );
    });
}


/* ============================================================
   TOGGLE QUESTION STATUS
============================================================ */

function toggleQuestionStatus(
    id,
    currentStatus
) {

    const token =
        getToken();


    if (!token) {
        return;
    }


    const newStatus =
        currentStatus.toUpperCase() ===
        "ACTIVE"
            ? "INACTIVE"
            : "ACTIVE";


    fetch(
        QUESTION_API +
        "/status/" +
        id +
        "/" +
        newStatus,
        {
            method:
                "PUT",

            headers: {

                "Authorization":
                    "Bearer " + token,

                "Accept":
                    "application/json"
            }
        }
    )

    .then(function (response) {

        if (
            response.status ===
            401
        ) {

            throw new Error(
                "Unauthorized."
            );
        }


        if (
            response.status ===
            403
        ) {

            throw new Error(
                "Access denied."
            );
        }


        if (!response.ok) {

            throw new Error(
                "Status update failed. HTTP " +
                response.status
            );
        }


        return response.text();
    })

    .then(function () {

        showSuccess(
            "Question status updated successfully."
        );


        loadQuestions();
    })

    .catch(function (error) {

        console.error(
            "Status update error:",
            error
        );


        showError(
            error.message
        );
    });
}


/* ============================================================
   HIDE LOADING
============================================================ */

function hideLoading() {

    const loadingRow =
        document.getElementById(
            "loadingRow"
        );


    if (loadingRow) {

        loadingRow.remove();
    }
}


/* ============================================================
   SUCCESS MESSAGE
============================================================ */

function showSuccess(
    message
) {

    if (
        typeof Swal !==
        "undefined"
    ) {

        Swal.fire({

            icon:
                "success",

            title:
                "Success",

            text:
                message,

            timer:
                1600,

            showConfirmButton:
                false
        });
    }

    else {

        alert(message);
    }
}


/* ============================================================
   ERROR MESSAGE
============================================================ */

function showError(
    message
) {

    if (
        typeof Swal !==
        "undefined"
    ) {

        Swal.fire({

            icon:
                "error",

            title:
                "Error",

            text:
                message
        });
    }

    else {

        alert(message);
    }
}