// ============================================================
// MANAGE ASSESSMENT JS
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("MANAGE ASSESSMENT JS LOADED");

    loadAssessment();

});


// ============================================================
// GLOBAL DATA
// ============================================================

var assessmentData = [];


// ============================================================
// LOAD ASSESSMENT
// ============================================================

function loadAssessment() {

    var token =
        (typeof getAuthToken === "function") ? getAuthToken() : (
            localStorage.getItem("adminToken") || localStorage.getItem("token")
        );

    console.log("ADMIN TOKEN:", token ? "FOUND" : "NOT FOUND");


    if (!token) {

        console.error("ADMIN TOKEN NOT FOUND");

        showMessage(
            "Please login as admin."
        );

        return;
    }


    console.log("ADMIN TOKEN FOUND");

    var resultAllUrl =
        (typeof API_ENDPOINTS !== "undefined" && API_ENDPOINTS.RESULT)
            ? API_ENDPOINTS.RESULT.ALL
            : "http://localhost:8090/api/result/all";

    var xhr =
        new XMLHttpRequest();


    xhr.open(
        "GET",
        resultAllUrl,
        true
    );


    xhr.setRequestHeader(
        "Authorization",
        "Bearer " + token
    );


    xhr.setRequestHeader(
        "Content-Type",
        "application/json"
    );


    xhr.onreadystatechange = function () {

        if (xhr.readyState !== 4) {
            return;
        }


        console.log(
            "HTTP STATUS:",
            xhr.status
        );


        // ====================================================
        // SUCCESS
        // ====================================================

        if (xhr.status === 200) {

            try {

                var data =
                    JSON.parse(
                        xhr.responseText
                    );


                console.log(
                    "ASSESSMENT DATA:",
                    data
                );


                assessmentData = data;


                displayAssessment(data);


                updateStatistics(data);


            } catch (error) {

                console.error(
                    "JSON PARSE ERROR:",
                    error
                );

                showMessage(
                    "Invalid response from server."
                );
            }

            return;
        }


        // ====================================================
        // UNAUTHORIZED
        // ====================================================

        if (xhr.status === 401) {

            showMessage(
                "Admin session expired. Please login again."
            );

            return;
        }


        // ====================================================
        // FORBIDDEN
        // ====================================================

        if (xhr.status === 403) {

            showMessage(
                "Access denied. Admin permission required."
            );

            return;
        }


        // ====================================================
        // OTHER ERROR
        // ====================================================

        console.error(
            "API ERROR:",
            xhr.responseText
        );


        showMessage(
            "Failed to load assessment results."
        );

    };


    xhr.onerror = function () {

        console.error(
            "SERVER CONNECTION ERROR"
        );


        showMessage(
            "Unable to connect to server."
        );

    };


    xhr.send();

}


// ============================================================
// DISPLAY ASSESSMENT TABLE
// ============================================================

function displayAssessment(data) {

    var tableBody =
        document.getElementById(
            "assessmentTableBody"
        );


    if (!tableBody) {

        console.error(
            "assessmentTableBody not found"
        );

        return;
    }


    tableBody.innerHTML = "";


    // ========================================================
    // NO DATA
    // ========================================================

    if (
        !data ||
        data.length === 0
    ) {

        tableBody.innerHTML =
            "<tr>" +
                "<td colspan='9' class='loading-row'>" +
                    "No assessment records found." +
                "</td>" +
            "</tr>";

        return;
    }


    // ========================================================
    // LOOP RESULTS
    // ========================================================

    for (
        var i = 0;
        i < data.length;
        i++
    ) {

        var result =
            data[i];


        console.log(
            "RESULT " + i + ":",
            result
        );


        console.log(
            "USERNAME:",
            result.userName
        );


        console.log(
            "EMAIL:",
            result.email
        );


        var percentage =
            Number(
                result.percentage || 0
            );


        var totalQuestions =
            Number(
                result.totalQuestions || 0
            );


        var correctAnswers =
            Number(
                result.correctAnswers || 0
            );


        // ====================================================
        // ROW
        // ====================================================

        var row =
            document.createElement("tr");


        row.innerHTML =

            "<td>" +
                (i + 1) +
            "</td>" +


            // USER NAME
            "<td>" +

                "<div class='user-info'>" +

                    "<strong>" +
                        escapeHtml(
                            result.userName ||
                            "Unknown User"
                        ) +
                    "</strong>" +

                "</div>" +

            "</td>" +


            // EMAIL
            "<td>" +

                escapeHtml(
                    result.email ||
                    "-"
                ) +

            "</td>" +


            // TOTAL
            "<td>" +
                totalQuestions +
            "</td>" +


            // CORRECT
            "<td>" +
                correctAnswers +
            "</td>" +


            // SCORE
            "<td>" +

                correctAnswers +
                " / " +
                totalQuestions +

            "</td>" +


            // PERCENTAGE
            "<td>" +

                "<strong>" +
                    percentage.toFixed(2) +
                    "%" +
                "</strong>" +

            "</td>" +


            // STATUS
            "<td>" +

                "<span class='status-badge completed'>" +
                    "Completed" +
                "</span>" +

            "</td>" +


            // ACTION
            "<td>" +

                "<button " +
                    "type='button' " +
                    "class='view-btn' " +
                    "onclick='viewAssessment(" +
                        i +
                    ")'>" +

                    "<i class='fa-solid fa-eye'></i>" +
                    " View" +

                "</button>" +

            "</td>";


        tableBody.appendChild(row);

    }

}


// ============================================================
// UPDATE STATISTICS
// ============================================================

function updateStatistics(data) {

    var total =
        data.length;


    var completed =
        data.length;


    var pending =
        0;


    var totalPercentage =
        0;


    for (
        var i = 0;
        i < data.length;
        i++
    ) {

        totalPercentage +=
            Number(
                data[i].percentage || 0
            );

    }


    var average =
        total > 0
            ? totalPercentage / total
            : 0;


    // TOTAL ASSESSMENTS

    var totalAssessments =
        document.getElementById(
            "totalAssessments"
        );


    if (totalAssessments) {

        totalAssessments.textContent =
            total;

    }


    // TOTAL

    var statTotal =
        document.getElementById(
            "statTotal"
        );


    if (statTotal) {

        statTotal.textContent =
            total;

    }


    // COMPLETED

    var statCompleted =
        document.getElementById(
            "statCompleted"
        );


    if (statCompleted) {

        statCompleted.textContent =
            completed;

    }


    // PENDING

    var statPending =
        document.getElementById(
            "statPending"
        );


    if (statPending) {

        statPending.textContent =
            pending;

    }


    // AVERAGE

    var statAverage =
        document.getElementById(
            "statAverage"
        );


    if (statAverage) {

        statAverage.textContent =
            average.toFixed(2) + "%";

    }

}


// ============================================================
// VIEW ASSESSMENT
// ============================================================

function viewAssessment(index) {

    var result =
        assessmentData[index];


    if (!result) {

        console.error(
            "Assessment not found"
        );

        return;
    }


    // USER NAME

    var modalUserName =
        document.getElementById(
            "modalUserName"
        );


    if (modalUserName) {

        modalUserName.textContent =
            result.userName ||
            "Unknown User";

    }


    // EMAIL

    var modalEmail =
        document.getElementById(
            "modalEmail"
        );


    if (modalEmail) {

        modalEmail.textContent =
            result.email ||
            "-";

    }


    // TOTAL

    var modalTotal =
        document.getElementById(
            "modalTotal"
        );


    if (modalTotal) {

        modalTotal.textContent =
            result.totalQuestions ||
            0;

    }


    // CORRECT

    var modalCorrect =
        document.getElementById(
            "modalCorrect"
        );


    if (modalCorrect) {

        modalCorrect.textContent =
            result.correctAnswers ||
            0;

    }


    // SCORE

    var modalScore =
        document.getElementById(
            "modalScore"
        );


    if (modalScore) {

        modalScore.textContent =
            (result.correctAnswers || 0) +
            " / " +
            (result.totalQuestions || 0);

    }


    // PERCENTAGE

    var modalPercentage =
        document.getElementById(
            "modalPercentage"
        );


    if (modalPercentage) {

        modalPercentage.textContent =
            Number(
                result.percentage || 0
            ).toFixed(2) +
            "%";

    }


    // STATUS

    var modalStatus =
        document.getElementById(
            "modalStatus"
        );


    if (modalStatus) {

        modalStatus.textContent =
            "Completed";

    }


    // SHOW MODAL

    var modal =
        document.getElementById(
            "assessmentModal"
        );


    if (modal) {

        modal.classList.add("show");

    }

}


// ============================================================
// CLOSE MODAL
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        var closeButton =
            document.getElementById(
                "closeAssessmentModal"
            );


        var modal =
            document.getElementById(
                "assessmentModal"
            );


        if (
            closeButton &&
            modal
        ) {

            closeButton.addEventListener(
                "click",
                function () {

                    modal.classList.remove(
                        "show"
                    );

                }
            );

        }

    }
);


// ============================================================
// SEARCH
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        var search =
            document.getElementById(
                "assessmentSearch"
            );


        if (!search) {
            return;
        }


        search.addEventListener(
            "input",
            function () {

                var value =
                    search.value
                        .toLowerCase()
                        .trim();


                var filtered = [];


                for (
                    var i = 0;
                    i < assessmentData.length;
                    i++
                ) {

                    var result =
                        assessmentData[i];


                    var name =
                        (
                            result.userName ||
                            ""
                        ).toLowerCase();


                    var email =
                        (
                            result.email ||
                            ""
                        ).toLowerCase();


                    if (
                        name.includes(value) ||
                        email.includes(value)
                    ) {

                        filtered.push(result);

                    }

                }


                displayAssessment(
                    filtered
                );

            }
        );

    }
);


// ============================================================
// REFRESH
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        var refreshButton =
            document.getElementById(
                "refreshAssessments"
            );


        if (!refreshButton) {
            return;
        }


        refreshButton.addEventListener(
            "click",
            function () {

                loadAssessment();

            }
        );

    }
);


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ============================================================
// MESSAGE
// ============================================================

function showMessage(message) {

    var tableBody =
        document.getElementById(
            "assessmentTableBody"
        );


    if (!tableBody) {

        console.error(
            message
        );

        return;

    }


    tableBody.innerHTML =
        "<tr>" +

            "<td colspan='9' class='loading-row'>" +

                message +

            "</td>" +

        "</tr>";

}