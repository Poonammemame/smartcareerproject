/* =========================================================
   PATHFINDER - MANAGE PROFILES
   Profile Management + Assessment Assignment
========================================================= */

console.log("======================================");
console.log("MANAGE PROFILES JS LOADED");
console.log("======================================");


/* =========================================================
   API
========================================================= */

var API_BASE_URL = window.API_BASE_URL || (typeof getApiBaseUrl === "function" ? getApiBaseUrl() : "http://localhost:8090/api");

var PROFILE_API =
    (typeof API_ENDPOINTS !== "undefined" && API_ENDPOINTS.PROFILE)
        ? API_ENDPOINTS.PROFILE.ALL
        : API_BASE_URL + "/profile/all";

var ASSIGN_API =
    (typeof API_ENDPOINTS !== "undefined" && API_ENDPOINTS.ASSESSMENT)
        ? API_ENDPOINTS.ASSESSMENT.ASSIGN.replace(/\/$/, "")
        : API_BASE_URL + "/assessment/assign";


/* =========================================================
   GLOBAL VARIABLES
========================================================= */

var allProfiles = [];

var filteredProfiles = [];

var selectedProfile = null;


/* =========================================================
   DOM VARIABLES
========================================================= */

var tableBody;
var totalProfiles;
var profileSearch;
var refreshProfiles;

var profileModal;
var closeProfileModal;

var modalUserName;
var modalEmail;
var modalEducation;
var modalSkills;
var modalExperience;
var modalCareerInterest;
var modalAssessmentStatus;

var assignAssessmentBtn;

var assignConfirmModal;
var closeAssignModal;
var cancelAssignBtn;
var confirmAssignBtn;

var assignUserName;
var assignUserEmail;

var profileMessage;


/* =========================================================
   DOCUMENT READY
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("Manage Profiles DOM loaded");


    /* =====================================================
       GET ELEMENTS
    ===================================================== */

    tableBody =
        document.getElementById("profilesTableBody");

    totalProfiles =
        document.getElementById("totalProfiles");

    profileSearch =
        document.getElementById("profileSearch");

    refreshProfiles =
        document.getElementById("refreshProfiles");

    profileModal =
        document.getElementById("profileModal");

    closeProfileModal =
        document.getElementById("closeProfileModal");

    modalUserName =
        document.getElementById("modalUserName");

    modalEmail =
        document.getElementById("modalEmail");

    modalEducation =
        document.getElementById("modalEducation");

    modalSkills =
        document.getElementById("modalSkills");

    modalExperience =
        document.getElementById("modalExperience");

    modalCareerInterest =
        document.getElementById("modalCareerInterest");

    modalAssessmentStatus =
        document.getElementById("modalAssessmentStatus");

    assignAssessmentBtn =
        document.getElementById("assignAssessmentBtn");

    assignConfirmModal =
        document.getElementById("assignConfirmModal");

    closeAssignModal =
        document.getElementById("closeAssignModal");

    cancelAssignBtn =
        document.getElementById("cancelAssignBtn");

    confirmAssignBtn =
        document.getElementById("confirmAssignBtn");

    assignUserName =
        document.getElementById("assignUserName");

    assignUserEmail =
        document.getElementById("assignUserEmail");

    profileMessage =
        document.getElementById("profileMessage");


    /* =====================================================
       TABLE CHECK
    ===================================================== */

    if (!tableBody) {

        console.error(
            "ERROR: profilesTableBody not found"
        );

        return;
    }


    /* =====================================================
       SEARCH
    ===================================================== */

    if (profileSearch) {

        profileSearch.addEventListener(
            "input",
            function () {

                searchProfiles(
                    profileSearch.value
                );

            }
        );

    }


    /* =====================================================
       REFRESH
    ===================================================== */

    if (refreshProfiles) {

        refreshProfiles.addEventListener(
            "click",
            function () {

                loadProfiles();

            }
        );

    }


    /* =====================================================
       PROFILE MODAL CLOSE
    ===================================================== */

    if (closeProfileModal) {

        closeProfileModal.addEventListener(
            "click",
            function () {

                closeModal(
                    profileModal
                );

            }
        );

    }


    /* =====================================================
       ASSIGN BUTTON
    ===================================================== */

    if (assignAssessmentBtn) {

        assignAssessmentBtn.addEventListener(
            "click",
            function () {

                openAssignConfirmation();

            }
        );

    }


    /* =====================================================
       ASSIGN MODAL CLOSE
    ===================================================== */

    if (closeAssignModal) {

        closeAssignModal.addEventListener(
            "click",
            function () {

                closeModal(
                    assignConfirmModal
                );

            }
        );

    }


    /* =====================================================
       CANCEL ASSIGN
    ===================================================== */

    if (cancelAssignBtn) {

        cancelAssignBtn.addEventListener(
            "click",
            function () {

                closeModal(
                    assignConfirmModal
                );

            }
        );

    }


    /* =====================================================
       CONFIRM ASSIGN
    ===================================================== */

    if (confirmAssignBtn) {

        confirmAssignBtn.addEventListener(
            "click",
            function () {

                assignAssessment();

            }
        );

    }


    /* =====================================================
       CLICK OUTSIDE PROFILE MODAL
    ===================================================== */

    if (profileModal) {

        profileModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    profileModal
                ) {

                    closeModal(
                        profileModal
                    );

                }

            }
        );

    }


    /* =====================================================
       CLICK OUTSIDE ASSIGN MODAL
    ===================================================== */

    if (assignConfirmModal) {

        assignConfirmModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    assignConfirmModal
                ) {

                    closeModal(
                        assignConfirmModal
                    );

                }

            }
        );

    }


    /* =====================================================
       LOAD DATA
    ===================================================== */

    loadProfiles();

});


/* =========================================================
   AUTH HEADERS
========================================================= */

function getAuthHeaders() {

    var token =
        localStorage.getItem("token");


    if (!token) {

        token =
            sessionStorage.getItem("token");

    }


    var headers = {

        "Content-Type":
            "application/json"

    };


    if (token) {

        headers["Authorization"] =
            "Bearer " + token;

    }


    return headers;
}


/* =========================================================
   LOAD ALL PROFILES
========================================================= */

function loadProfiles() {

    console.log("--------------------------------------");
    console.log("LOADING PROFILES");
    console.log("URL:", PROFILE_API);
    console.log("--------------------------------------");


    showLoading();


    fetch(
        PROFILE_API,
        {
            method: "GET",
            headers: getAuthHeaders()
        }
    )

    .then(function (response) {

        console.log(
            "PROFILE STATUS:",
            response.status
        );


        if (!response.ok) {

            return response.text()
                .then(function (errorText) {

                    console.error(
                        "PROFILE ERROR:",
                        errorText
                    );


                    throw new Error(
                        "HTTP " +
                        response.status
                    );

                });

        }


        return response.json();

    })

    .then(function (data) {

        console.log(
            "PROFILE API RESPONSE:",
            data
        );


        if (!Array.isArray(data)) {

            throw new Error(
                "Invalid profile response from server"
            );

        }


        allProfiles = data;

        filteredProfiles = data;


        updateTotalProfiles(
            data.length
        );


        renderProfiles(
            data
        );

    })

    .catch(function (error) {

        console.error(
            "PROFILE LOAD ERROR:",
            error
        );


        showError(
            getErrorMessage(error)
        );

    });

}


/* =========================================================
   RENDER PROFILES
========================================================= */

function renderProfiles(data) {

    if (!tableBody) {

        return;
    }


    if (
        !Array.isArray(data) ||
        data.length === 0
    ) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="9"
                    class="loading-row">

                    <i class="fa-solid fa-user-slash"></i>

                    No career profiles found.

                </td>

            </tr>

        `;

        return;
    }


    tableBody.innerHTML = "";


    data.forEach(
        function (profile, index) {


            console.log(
                "PROFILE OBJECT:",
                profile
            );


            console.log(
                "FULL NAME:",
                profile.fullName
            );


            console.log(
                "EMAIL:",
                profile.email
            );


            console.log(
                "ASSESSMENT STATUS:",
                profile.assessmentStatus
            );


            /* =============================================
               USER NAME
            ============================================= */

            var fullName =
                profile.fullName;


            if (
                fullName === null ||
                fullName === undefined ||
                String(fullName).trim() === ""
            ) {

                fullName =
                    "Unknown User";

            }


            /* =============================================
               EMAIL
            ============================================= */

            var email =
                profile.email;


            if (
                email === null ||
                email === undefined ||
                String(email).trim() === ""
            ) {

                email = "-";

            }


            /* =============================================
               EDUCATION
            ============================================= */

            var education =
                profile.education;


            if (
                education === null ||
                education === undefined ||
                String(education).trim() === ""
            ) {

                education = "-";

            }


            /* =============================================
               TECHNICAL SKILLS
            ============================================= */

            var skills =
                profile.technicalSkills;


            if (
                skills === null ||
                skills === undefined ||
                String(skills).trim() === ""
            ) {

                skills = "-";

            }


            /* =============================================
               EXPERIENCE
            ============================================= */

            var experience =
                profile.experienceLevel;


            if (
                experience === null ||
                experience === undefined ||
                String(experience).trim() === ""
            ) {

                experience = "-";

            }


            /* =============================================
               CAREER INTEREST
            ============================================= */

            var careerInterest =
                profile.careerGoal;


            if (
                careerInterest === null ||
                careerInterest === undefined ||
                String(careerInterest).trim() === ""
            ) {

                careerInterest =
                    profile.interests;

            }


            if (
                careerInterest === null ||
                careerInterest === undefined ||
                String(careerInterest).trim() === ""
            ) {

                careerInterest = "-";

            }


            /* =============================================
               ASSESSMENT STATUS

               IMPORTANT:
               API FIELD = assessmentStatus
            ============================================= */

            var assessmentStatus =
                profile.assessmentStatus;


            if (
                assessmentStatus === null ||
                assessmentStatus === undefined ||
                String(assessmentStatus).trim() === ""
            ) {

                assessmentStatus =
                    "NOT ASSIGNED";

            }


            console.log(
                "FINAL STATUS:",
                assessmentStatus
            );


            /* =============================================
               CREATE ROW
            ============================================= */

            var row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>


                <td>

                    <div class="profile-user">

                        <strong>
                            ${escapeHtml(fullName)}
                        </strong>

                    </div>

                </td>


                <td>
                    ${escapeHtml(email)}
                </td>


                <td>
                    ${escapeHtml(education)}
                </td>


                <td>
                    ${escapeHtml(skills)}
                </td>


                <td>
                    ${escapeHtml(experience)}
                </td>


                <td>
                    ${escapeHtml(careerInterest)}
                </td>


                <td>

                    ${getAssessmentStatusHtml(
                        assessmentStatus
                    )}

                </td>


                <td>

                    <button
                        type="button"
                        class="view-profile-btn">

                        <i class="fa-solid fa-eye"></i>

                        View

                    </button>

                </td>

            `;


            tableBody.appendChild(
                row
            );


            /* =============================================
               VIEW BUTTON
            ============================================= */

            var viewButton =
                row.querySelector(
                    ".view-profile-btn"
                );


            if (viewButton) {

                viewButton.addEventListener(
                    "click",
                    function () {

                        openProfileModal(
                            profile
                        );

                    }
                );

            }

        }
    );

}


/* =========================================================
   ASSESSMENT STATUS HTML
========================================================= */

function getAssessmentStatusHtml(status) {

    console.log(
        "STATUS FUNCTION RECEIVED:",
        status
    );


    if (
        status === null ||
        status === undefined ||
        String(status).trim() === ""
    ) {

        status =
            "NOT ASSIGNED";

    }


    var value =
        String(status)
            .trim()
            .toUpperCase();


    /* =====================================================
       ASSIGNED
    ===================================================== */

    if (
        value === "ASSIGNED"
    ) {

        return `

            <span
                class="assessment-status assigned">

                <i
                    class="fa-solid fa-circle-check">
                </i>

                ASSIGNED

            </span>

        `;

    }


    /* =====================================================
       COMPLETED
    ===================================================== */

    if (
        value === "COMPLETED"
    ) {

        return `

            <span
                class="assessment-status completed">

                <i
                    class="fa-solid fa-check-double">
                </i>

                COMPLETED

            </span>

        `;

    }


    /* =====================================================
       PENDING
    ===================================================== */

    if (
        value === "PENDING"
    ) {

        return `

            <span
                class="assessment-status pending">

                <i
                    class="fa-solid fa-clock">
                </i>

                PENDING

            </span>

        `;

    }


    /* =====================================================
       NOT ASSIGNED
    ===================================================== */

    return `

        <span
            class="assessment-status not-assigned">

            <i
                class="fa-solid fa-circle-minus">
            </i>

            NOT ASSIGNED

        </span>

    `;

}


/* =========================================================
   OPEN PROFILE MODAL
========================================================= */

function openProfileModal(profile) {

    selectedProfile =
        profile;


    console.log(
        "OPENING PROFILE:",
        profile
    );


    /* =====================================================
       FULL NAME
    ===================================================== */

    var fullName =
        profile.fullName;


    if (
        fullName === null ||
        fullName === undefined ||
        String(fullName).trim() === ""
    ) {

        fullName =
            "Unknown User";

    }


    /* =====================================================
       EMAIL
    ===================================================== */

    var email =
        profile.email;


    if (
        email === null ||
        email === undefined ||
        String(email).trim() === ""
    ) {

        email = "-";

    }


    /* =====================================================
       EDUCATION
    ===================================================== */

    var education =
        profile.education || "-";


    /* =====================================================
       SKILLS
    ===================================================== */

    var skills =
        profile.technicalSkills || "-";


    /* =====================================================
       EXPERIENCE
    ===================================================== */

    var experience =
        profile.experienceLevel || "-";


    /* =====================================================
       CAREER
    ===================================================== */

    var careerInterest =
        profile.careerGoal ||
        profile.interests ||
        "-";


    /* =====================================================
       ASSESSMENT STATUS
    ===================================================== */

    var assessmentStatus =
        profile.assessmentStatus;


    if (
        assessmentStatus === null ||
        assessmentStatus === undefined ||
        String(assessmentStatus).trim() === ""
    ) {

        assessmentStatus =
            "NOT ASSIGNED";

    }


    /* =====================================================
       SET MODAL VALUES
    ===================================================== */

    if (modalUserName) {

        modalUserName.textContent =
            fullName;

    }


    if (modalEmail) {

        modalEmail.textContent =
            email;

    }


    if (modalEducation) {

        modalEducation.textContent =
            education;

    }


    if (modalSkills) {

        modalSkills.textContent =
            skills;

    }


    if (modalExperience) {

        modalExperience.textContent =
            experience;

    }


    if (modalCareerInterest) {

        modalCareerInterest.textContent =
            careerInterest;

    }


    if (modalAssessmentStatus) {

        modalAssessmentStatus.textContent =
            assessmentStatus;

    }


    /* =====================================================
       ASSIGN BUTTON
    ===================================================== */

    if (assignAssessmentBtn) {


        if (
            String(assessmentStatus)
                .toUpperCase()
                .trim() ===
            "ASSIGNED"
        ) {

            assignAssessmentBtn.disabled =
                true;


            assignAssessmentBtn.innerHTML = `

                <i class="fa-solid fa-circle-check"></i>

                Assessment Already Assigned

            `;

        }


        else if (
            String(assessmentStatus)
                .toUpperCase()
                .trim() ===
            "COMPLETED"
        ) {

            assignAssessmentBtn.disabled =
                true;


            assignAssessmentBtn.innerHTML = `

                <i class="fa-solid fa-check-double"></i>

                Assessment Completed

            `;

        }


        else {

            assignAssessmentBtn.disabled =
                false;


            assignAssessmentBtn.innerHTML = `

                <i class="fa-solid fa-paper-plane"></i>

                Assign Assessment

            `;

        }

    }


    /* =====================================================
       OPEN MODAL
    ===================================================== */

    openModal(
        profileModal
    );

}


/* =========================================================
   OPEN ASSIGN CONFIRMATION
========================================================= */

function openAssignConfirmation() {

    if (!selectedProfile) {

        showMessage(
            "Please select a profile first.",
            "error"
        );

        return;
    }


    var status =
        selectedProfile.assessmentStatus;


    if (
        status === null ||
        status === undefined
    ) {

        status =
            "NOT ASSIGNED";

    }


    status =
        String(status)
            .trim()
            .toUpperCase();


    /* =====================================================
       ALREADY ASSIGNED
    ===================================================== */

    if (
        status === "ASSIGNED"
    ) {

        showMessage(
            "Assessment is already assigned to this user.",
            "error"
        );

        return;
    }


    /* =====================================================
       ALREADY COMPLETED
    ===================================================== */

    if (
        status === "COMPLETED"
    ) {

        showMessage(
            "Assessment has already been completed.",
            "error"
        );

        return;
    }


    /* =====================================================
       USER INFORMATION
    ===================================================== */

    if (assignUserName) {

        assignUserName.textContent =
            selectedProfile.fullName ||
            "Unknown User";

    }


    if (assignUserEmail) {

        assignUserEmail.textContent =
            selectedProfile.email ||
            "-";

    }


    openModal(
        assignConfirmModal
    );

}


/* =========================================================
   ASSIGN ASSESSMENT
========================================================= */

function assignAssessment() {

    if (!selectedProfile) {

        showMessage(
            "No profile selected.",
            "error"
        );

        return;
    }


    var userId =
        selectedProfile.userId;


    if (
        userId === null ||
        userId === undefined
    ) {

        showMessage(
            "User ID is missing.",
            "error"
        );

        return;
    }


    console.log(
        "ASSIGNING ASSESSMENT"
    );


    console.log(
        "USER ID:",
        userId
    );


    var url =
        ASSIGN_API +
        "/" +
        encodeURIComponent(
            userId
        );


    console.log(
        "ASSIGN URL:",
        url
    );


    if (confirmAssignBtn) {

        confirmAssignBtn.disabled =
            true;


        confirmAssignBtn.innerHTML = `

            <i class="fa-solid fa-spinner fa-spin"></i>

            Assigning...

        `;

    }


    fetch(
        url,
        {
            method: "PUT",
            headers: getAuthHeaders()
        }
    )

    .then(function (response) {

        console.log(
            "ASSIGN RESPONSE STATUS:",
            response.status
        );


        return response.text()
            .then(function (text) {

                if (!response.ok) {

                    throw new Error(
                        text ||
                        "Assessment assignment failed"
                    );

                }


                return text;

            });

    })

    .then(function (message) {

        console.log(
            "ASSIGN SUCCESS:",
            message
        );


        showMessage(
            message ||
            "Assessment assigned successfully.",
            "success"
        );


        closeModal(
            assignConfirmModal
        );


        closeModal(
            profileModal
        );


        /* =================================================
           RELOAD PROFILES

           API will now return:
           assessmentStatus = ASSIGNED
        ================================================= */

        loadProfiles();

    })

    .catch(function (error) {

        console.error(
            "ASSIGN ERROR:",
            error
        );


        showMessage(
            error.message ||
            "Unable to assign assessment.",
            "error"
        );

    })

    .finally(function () {

        if (confirmAssignBtn) {

            confirmAssignBtn.disabled =
                false;


            confirmAssignBtn.innerHTML = `

                <i class="fa-solid fa-paper-plane"></i>

                Assign Assessment

            `;

        }

    });

}


/* =========================================================
   SEARCH
========================================================= */

function searchProfiles(searchText) {

    var search =
        String(searchText || "")
            .toLowerCase()
            .trim();


    /* =====================================================
       SHOW ALL
    ===================================================== */

    if (!search) {

        filteredProfiles =
            allProfiles;


        renderProfiles(
            filteredProfiles
        );


        updateTotalProfiles(
            filteredProfiles.length
        );


        return;
    }


    /* =====================================================
       FILTER
    ===================================================== */

    filteredProfiles =
        allProfiles.filter(
            function (profile) {


                var fullName =
                    String(
                        profile.fullName || ""
                    )
                    .toLowerCase();


                var email =
                    String(
                        profile.email || ""
                    )
                    .toLowerCase();


                var education =
                    String(
                        profile.education || ""
                    )
                    .toLowerCase();


                var skills =
                    String(
                        profile.technicalSkills || ""
                    )
                    .toLowerCase();


                var career =
                    String(
                        profile.careerGoal || ""
                    )
                    .toLowerCase();


                return (

                    fullName.includes(
                        search
                    ) ||

                    email.includes(
                        search
                    ) ||

                    education.includes(
                        search
                    ) ||

                    skills.includes(
                        search
                    ) ||

                    career.includes(
                        search
                    )

                );

            }
        );


    renderProfiles(
        filteredProfiles
    );


    updateTotalProfiles(
        filteredProfiles.length
    );

}


/* =========================================================
   LOADING
========================================================= */

function showLoading() {

    if (!tableBody) {

        return;
    }


    tableBody.innerHTML = `

        <tr>

            <td
                colspan="9"
                class="loading-row">

                <i
                    class="fa-solid fa-spinner fa-spin">
                </i>

                Loading profiles...

            </td>

        </tr>

    `;

}


/* =========================================================
   ERROR
========================================================= */

function showError(message) {

    if (!tableBody) {

        return;
    }


    tableBody.innerHTML = `

        <tr>

            <td
                colspan="9"
                class="loading-row">

                <i
                    class="fa-solid fa-triangle-exclamation">
                </i>

                ${escapeHtml(message)}

            </td>

        </tr>

    `;

}


/* =========================================================
   UPDATE TOTAL
========================================================= */

function updateTotalProfiles(count) {

    if (totalProfiles) {

        totalProfiles.textContent =
            count;

    }

}


/* =========================================================
   MESSAGE
========================================================= */

function showMessage(
    message,
    type
) {

    if (!profileMessage) {

        alert(message);

        return;
    }


    profileMessage.textContent =
        message;


    profileMessage.className =
        "profile-message " +
        (type || "success");


    profileMessage.classList.add(
        "show"
    );


    setTimeout(
        function () {

            profileMessage.classList.remove(
                "show"
            );

        },
        3500
    );

}


/* =========================================================
   OPEN MODAL
========================================================= */

function openModal(modal) {

    if (!modal) {

        return;
    }


    modal.classList.add(
        "show"
    );

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeModal(modal) {

    if (!modal) {

        return;
    }


    modal.classList.remove(
        "show"
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

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


/* =========================================================
   ERROR MESSAGE
========================================================= */

function getErrorMessage(error) {

    if (!error) {

        return "Unable to load profiles.";

    }


    var message =
        error.message || "";


    if (
        message.indexOf(
            "Failed to fetch"
        ) !== -1
    ) {

        return (
            "Unable to connect to Spring Boot server. " +
            "Check server and CORS configuration."
        );

    }


    if (
        message.indexOf(
            "404"
        ) !== -1
    ) {

        return (
            "Profile API not found. " +
            "Check /profile/all endpoint."
        );

    }


    if (
        message.indexOf(
            "401"
        ) !== -1
    ) {

        return (
            "Session expired. Please login again."
        );

    }


    if (
        message.indexOf(
            "403"
        ) !== -1
    ) {

        return (
            "Access denied. Admin permission required."
        );

    }


    return (
        message ||
        "Unable to load profiles."
    );

}