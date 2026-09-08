/* ============================================================
   PATHFINDER - ADMIN MANAGE RESULTS
============================================================ */

console.log("======================================");
console.log("manageResults.js LOADED");
console.log("======================================");


/* ============================================================
   CONFIGURATION
============================================================ */

var API_BASE_URL =
    window.API_BASE_URL || (typeof getApiBaseUrl === "function" ? getApiBaseUrl() : "http://localhost:8090/api");

var RESULTS_API =
    (typeof API_ENDPOINTS !== "undefined" && API_ENDPOINTS.RESULT)
        ? API_ENDPOINTS.RESULT.ALL
        : API_BASE_URL + "/result/all";


/* ============================================================
   GLOBAL VARIABLES
============================================================ */

let allResults = [];

let filteredResults = [];

let token = null;


/* ============================================================
   DOM READY
============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "Manage Results page loaded"
        );


        token =
            localStorage.getItem("token");


        if (!token) {

            console.error(
                "Authentication token not found"
            );

            showEmptyState();

            return;

        }


        setupEvents();

        loadResults();

    }
);


/* ============================================================
   SETUP EVENTS
============================================================ */

function setupEvents() {

    const searchInput =
        document.getElementById(
            "searchResult"
        );


    const scoreFilter =
        document.getElementById(
            "scoreFilter"
        );


    const clearBtn =
        document.getElementById(
            "clearFilterBtn"
        );


    const refreshBtn =
        document.getElementById(
            "refreshResultsBtn"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            applyFilters
        );

    }


    if (scoreFilter) {

        scoreFilter.addEventListener(
            "change",
            applyFilters
        );

    }


    if (clearBtn) {

        clearBtn.addEventListener(
            "click",
            function () {

                if (searchInput) {

                    searchInput.value = "";

                }


                if (scoreFilter) {

                    scoreFilter.value = "all";

                }


                applyFilters();

            }
        );

    }


    if (refreshBtn) {

        refreshBtn.addEventListener(
            "click",
            function () {

                loadResults();

            }
        );

    }

}


/* ============================================================
   LOAD RESULTS
============================================================ */

function loadResults() {

    console.log(
        "Loading assessment results..."
    );


    showLoadingState();


    fetch(
        RESULTS_API,
        {

            method: "GET",

            headers: {

                "Authorization":
                    "Bearer " + token,

                "Content-Type":
                    "application/json"

            }

        }
    )
    .then(
        function (response) {

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
                    "You do not have permission to view results."
                );

            }


            if (!response.ok) {

                throw new Error(
                    "Unable to load assessment results."
                );

            }


            return response.json();

        }
    )
    .then(
        function (data) {

            console.log(
                "RESULT API RESPONSE:",
                data
            );


            if (!Array.isArray(data)) {

                throw new Error(
                    "Invalid result data received from server."
                );

            }


            allResults = data;

            filteredResults = [...allResults];


            updateStatistics();

            renderResults();

        }
    )
    .catch(
        function (error) {

            console.error(
                "Result Loading Error:",
                error
            );


            allResults = [];

            filteredResults = [];


            updateStatistics();

            showEmptyState();

        }
    );

}


/* ============================================================
   UPDATE STATISTICS
============================================================ */

function updateStatistics() {

    const total =
        allResults.length;


    let strong = 0;

    let low = 0;

    let totalPercentage = 0;


    allResults.forEach(
        function (result) {

            const percentage =
                getPercentage(result);


            totalPercentage += percentage;


            if (percentage >= 80) {

                strong++;

            }


            if (percentage < 60) {

                low++;

            }

        }
    );


    const average =
        total > 0
            ? Math.round(
                totalPercentage / total
            )
            : 0;


    setText(
        "totalResults",
        total
    );


    setText(
        "passedResults",
        strong
    );


    setText(
        "averageScore",
        average + "%"
    );


    setText(
        "lowResults",
        low
    );

}


/* ============================================================
   APPLY FILTERS
============================================================ */

function applyFilters() {

    const searchInput =
        document.getElementById(
            "searchResult"
        );


    const scoreFilter =
        document.getElementById(
            "scoreFilter"
        );


    const search =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const filter =
        scoreFilter
            ? scoreFilter.value
            : "all";


    filteredResults =
        allResults.filter(
            function (result) {

                const userId =
                    String(
                        result.userId || ""
                    )
                    .toLowerCase();


                const name =
                    String(
                        result.userName ||
                        result.name ||
                        ""
                    )
                    .toLowerCase();


                const email =
                    String(
                        result.email ||
                        ""
                    )
                    .toLowerCase();


                const matchesSearch =
                    !search ||
                    userId.includes(search) ||
                    name.includes(search) ||
                    email.includes(search);


                const percentage =
                    getPercentage(result);


                let matchesScore = true;


                if (filter === "high") {

                    matchesScore =
                        percentage >= 80;

                }


                else if (filter === "medium") {

                    matchesScore =
                        percentage >= 60 &&
                        percentage < 80;

                }


                else if (filter === "low") {

                    matchesScore =
                        percentage < 60;

                }


                return (
                    matchesSearch &&
                    matchesScore
                );

            }
        );


    renderResults();

}


/* ============================================================
   RENDER RESULTS
============================================================ */

function renderResults() {

    const tbody =
        document.getElementById(
            "resultsTableBody"
        );


    const tableWrapper =
        document.getElementById(
            "tableWrapper"
        );


    const loading =
        document.getElementById(
            "loadingState"
        );


    const empty =
        document.getElementById(
            "emptyState"
        );


    const resultCount =
        document.getElementById(
            "resultCount"
        );


    if (loading) {

        loading.style.display =
            "none";

    }


    if (!tbody) {

        return;

    }


    tbody.innerHTML = "";


    if (
        !filteredResults ||
        filteredResults.length === 0
    ) {

        if (tableWrapper) {

            tableWrapper.style.display =
                "none";

        }


        if (empty) {

            empty.style.display =
                "block";

        }


        if (resultCount) {

            resultCount.textContent =
                "0 Results";

        }


        return;

    }


    if (empty) {

        empty.style.display =
            "none";

    }


    if (tableWrapper) {

        tableWrapper.style.display =
            "block";

    }


    if (resultCount) {

        resultCount.textContent =
            filteredResults.length +
            (
                filteredResults.length === 1
                    ? " Result"
                    : " Results"
            );

    }


    filteredResults.forEach(
        function (result, index) {

            const percentage =
                getPercentage(result);


            const performance =
                getPerformance(
                    percentage
                );


            const name =
                result.userName ||
                result.name ||
                "Candidate #" +
                result.userId;


            const email =
                result.email ||
                "";


            const initial =
                getInitial(
                    name
                );


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>


                <td>

                    <div class="candidate-cell">

                        <div class="candidate-avatar">
                            ${escapeHtml(initial)}
                        </div>

                        <div class="candidate-info">

                            <strong>
                                ${escapeHtml(name)}
                            </strong>

                            <span>
                                ${escapeHtml(email)}
                            </span>

                        </div>

                    </div>

                </td>


                <td>
                    ${result.totalQuestions || 0}
                </td>


                <td>
                    <strong style="color:#16a34a;">
                        ${result.correctAnswers || 0}
                    </strong>
                </td>


                <td>
                    <strong style="color:#dc2626;">
                        ${result.wrongAnswers || 0}
                    </strong>
                </td>


                <td>
                    ${result.unanswered || 0}
                </td>


                <td>

                    <span class="score-value">

                        ${
                            result.correctAnswers || 0
                        }

                        /

                        ${
                            result.totalQuestions || 0
                        }

                    </span>

                    <br>

                    <small>
                        ${percentage}%
                    </small>

                </td>


                <td>

                    <span class="
                        performance-badge
                        ${performance.className}
                    ">

                        <i class="
                            fa-solid
                            ${performance.icon}
                        "></i>

                        ${performance.label}

                    </span>

                </td>


                <td>

                    <button
                        type="button"
                        class="view-result-btn"
                        onclick="viewResult(${index})">

                        <i class="fa-solid fa-eye"></i>

                        View

                    </button>

                </td>

            `;


            tbody.appendChild(row);

        }
    );

}


/* ============================================================
   VIEW RESULT
============================================================ */

function viewResult(index) {

    const result =
        filteredResults[index];


    if (!result) {

        return;

    }


    const percentage =
        getPercentage(result);


    const performance =
        getPerformance(
            percentage
        );


    const content =
        document.getElementById(
            "resultDetailsContent"
        );


    if (!content) {

        return;

    }


    content.innerHTML = `

        <div class="candidate-cell"
             style="margin-bottom:20px;">

            <div class="candidate-avatar">

                ${escapeHtml(
                    getInitial(
                        result.userName ||
                        result.name ||
                        "C"
                    )
                )}

            </div>

            <div class="candidate-info">

                <strong>

                    ${escapeHtml(
                        result.userName ||
                        result.name ||
                        "Candidate"
                    )}

                </strong>

                <span>

                    User ID:
                    ${escapeHtml(
                        String(
                            result.userId || "-"
                        )
                    )}

                </span>

            </div>

        </div>


        <div class="detail-grid">

            <div class="detail-box">

                <span>
                    Total Questions
                </span>

                <strong>
                    ${result.totalQuestions || 0}
                </strong>

            </div>


            <div class="detail-box">

                <span>
                    Score
                </span>

                <strong>
                    ${percentage}%
                </strong>

            </div>


            <div class="detail-box">

                <span>
                    Correct Answers
                </span>

                <strong style="color:#16a34a;">
                    ${result.correctAnswers || 0}
                </strong>

            </div>


            <div class="detail-box">

                <span>
                    Wrong Answers
                </span>

                <strong style="color:#dc2626;">
                    ${result.wrongAnswers || 0}
                </strong>

            </div>


            <div class="detail-box">

                <span>
                    Unanswered
                </span>

                <strong>
                    ${result.unanswered || 0}
                </strong>

            </div>


            <div class="detail-box">

                <span>
                    Performance
                </span>

                <strong>
                    ${performance.label}
                </strong>

            </div>

        </div>

    `;


    const modalElement =
        document.getElementById(
            "resultDetailsModal"
        );


    if (modalElement) {

        const modal =
            new bootstrap.Modal(
                modalElement
            );


        modal.show();

    }

}


/* ============================================================
   GET PERCENTAGE
============================================================ */

function getPercentage(result) {

    if (
        result.percentage !== null &&
        result.percentage !== undefined
    ) {

        return Number(
            result.percentage
        );

    }


    const total =
        Number(
            result.totalQuestions || 0
        );


    const correct =
        Number(
            result.correctAnswers || 0
        );


    if (total === 0) {

        return 0;

    }


    return Math.round(
        (correct / total) * 100
    );

}


/* ============================================================
   PERFORMANCE
============================================================ */

function getPerformance(
    percentage
) {

    if (percentage >= 80) {

        return {

            label:
                "Strong",

            className:
                "strong",

            icon:
                "fa-circle-check"

        };

    }


    if (percentage >= 60) {

        return {

            label:
                "Good",

            className:
                "good",

            icon:
                "fa-thumbs-up"

        };

    }


    if (percentage >= 40) {

        return {

            label:
                "Average",

            className:
                "average",

            icon:
                "fa-minus"

        };

    }


    return {

        label:
            "Needs Improvement",

        className:
            "low",

        icon:
            "fa-triangle-exclamation"

    };

}


/* ============================================================
   INITIAL
============================================================ */

function getInitial(name) {

    if (!name) {

        return "?";

    }


    return String(name)
        .trim()
        .charAt(0)
        .toUpperCase();

}


/* ============================================================
   SET TEXT
============================================================ */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }

}


/* ============================================================
   SHOW LOADING
============================================================ */

function showLoadingState() {

    const loading =
        document.getElementById(
            "loadingState"
        );


    const empty =
        document.getElementById(
            "emptyState"
        );


    const table =
        document.getElementById(
            "tableWrapper"
        );


    if (loading) {

        loading.style.display =
            "block";

    }


    if (empty) {

        empty.style.display =
            "none";

    }


    if (table) {

        table.style.display =
            "none";

    }

}


/* ============================================================
   SHOW EMPTY
============================================================ */

function showEmptyState() {

    const loading =
        document.getElementById(
            "loadingState"
        );


    const empty =
        document.getElementById(
            "emptyState"
        );


    const table =
        document.getElementById(
            "tableWrapper"
        );


    if (loading) {

        loading.style.display =
            "none";

    }


    if (table) {

        table.style.display =
            "none";

    }


    if (empty) {

        empty.style.display =
            "block";

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
   END
============================================================ */

console.log(
    "manageResults.js ready"
);