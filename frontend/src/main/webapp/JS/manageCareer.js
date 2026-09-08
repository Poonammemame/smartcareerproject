/* ============================================================
   PATHFINDER - MANAGE CAREER
   ============================================================ */

console.log("======================================");
console.log("manageCareer.js LOADED");
console.log("======================================");


/* ============================================================
   CONFIGURATION
   ============================================================ */

var API_BASE_URL = window.API_BASE_URL || (typeof getApiBaseUrl === "function" ? getApiBaseUrl() : "http://localhost:8090/api");
var CAREER_API =
    (typeof API_ENDPOINTS !== "undefined" && API_ENDPOINTS.CAREER)
        ? API_ENDPOINTS.CAREER.ALL.replace(/\/all$/, "")
        : API_BASE_URL + "/career";

var careers = [];


/* ============================================================
   DOM LOADED
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

    console.log("Manage Career DOM loaded");

    loadCareers();
    loadTotalCareers();

    setupForm();
    setupSearch();
    setupModal();

});


/* ============================================================
   GET JWT TOKEN
   ============================================================ */

function getToken() {

    var possibleKeys = [
        "token",
        "jwt",
        "jwtToken",
        "accessToken",
        "adminToken",
        "authToken"
    ];

    var token = null;

    for (var i = 0; i < possibleKeys.length; i++) {

        token = localStorage.getItem(possibleKeys[i]);

        if (!token) {
            token = sessionStorage.getItem(possibleKeys[i]);
        }

        if (token && String(token).trim() !== "") {
            break;
        }
    }

    if (token) {

        token = String(token).trim();

        if (token.toLowerCase().indexOf("bearer ") === 0) {
            token = token.substring(7).trim();
        }
    }

    console.log("JWT Token found:", !!token);

    return token;
}


/* ============================================================
   COMMON HEADERS
   ============================================================ */

function getHeaders(includeJson) {

    var headers = {};
    var token = getToken();

    if (token) {
        headers["Authorization"] = "Bearer " + token;
    }

    if (includeJson === true) {
        headers["Content-Type"] = "application/json";
    }

    headers["Accept"] = "application/json";

    return headers;
}


/* ============================================================
   LOAD ALL CAREERS
   ============================================================ */

function loadCareers() {

    var tableBody =
        document.getElementById("careerTableBody");

    if (!tableBody) {

        console.error(
            "careerTableBody not found"
        );

        return;
    }


    tableBody.innerHTML =
        '<tr>' +
        '<td colspan="6" class="loading-row">' +
        '<i class="fa-solid fa-spinner fa-spin"></i> ' +
        'Loading careers...' +
        '</td>' +
        '</tr>';


    fetch(
        CAREER_API + "/all",
        {
            method: "GET",
            headers: getHeaders(false)
        }
    )

    .then(function (response) {

        console.log(
            "Career API Status:",
            response.status
        );


        if (response.status === 401) {

            throw new Error(
                "Unauthorized. Please login again."
            );
        }


        if (response.status === 403) {

            throw new Error(
                "You are not authorized to view careers."
            );
        }


        if (response.status === 404) {

            throw new Error(
                "Career API endpoint not found."
            );
        }


        if (!response.ok) {

            throw new Error(
                "Failed to load careers. HTTP " +
                response.status
            );
        }


        return response.json();

    })

    .then(function (result) {

        console.log(
            "CAREER API RESPONSE:",
            result
        );


        if (Array.isArray(result)) {

            careers = result;

        }

        else if (
            result &&
            Array.isArray(result.data)
        ) {

            careers = result.data;

        }

        else if (
            result &&
            Array.isArray(result.careers)
        ) {

            careers = result.careers;

        }

        else if (
            result &&
            Array.isArray(result.content)
        ) {

            careers = result.content;

        }

        else {

            throw new Error(
                "Invalid career response received from server."
            );
        }


        console.log(
            "Total careers:",
            careers.length
        );


        renderCareers(careers);

        updateCareerStats(careers);

    })

    .catch(function (error) {

        console.error(
            "LOAD CAREERS ERROR:",
            error
        );


        tableBody.innerHTML =
            '<tr>' +
            '<td colspan="6" class="error-row">' +
            '<i class="fa-solid fa-triangle-exclamation"></i> ' +
            escapeHtml(
                error.message ||
                "Failed to load careers"
            ) +
            '</td>' +
            '</tr>';

    });

}


/* ============================================================
   RENDER CAREERS
   ============================================================ */

function renderCareers(data) {

    var tableBody =
        document.getElementById(
            "careerTableBody"
        );

    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    if (!data || data.length === 0) {

        tableBody.innerHTML =
            '<tr>' +
            '<td colspan="6" class="empty-row">' +
            '<i class="fa-solid fa-briefcase"></i> ' +
            'No careers found' +
            '</td>' +
            '</tr>';

        return;
    }


    data.forEach(function (career, index) {

        var row =
            document.createElement("tr");


        var careerId =
            career.careerId ||
            career.career_id ||
            "";


        var careerName =
            career.careerName ||
            career.career_name ||
            "-";


        var description =
            career.description ||
            "-";


        var requiredSkills =
            career.requiredSkills ||
            career.required_skills ||
            "";


        var createdAt =
            career.createdAt ||
            career.created_at ||
            null;


        row.innerHTML =

            '<td class="career-number">' +
                (index + 1) +
            '</td>' +

            '<td>' +

                '<div class="career-name-cell">' +

                    '<div class="career-icon">' +
                        '<i class="fa-solid fa-briefcase"></i>' +
                    '</div>' +

                    '<div>' +
                        '<strong>' +
                            escapeHtml(careerName) +
                        '</strong>' +
                    '</div>' +

                '</div>' +

            '</td>' +


            '<td>' +

                '<div class="description-cell">' +
                    escapeHtml(description) +
                '</div>' +

            '</td>' +


            '<td>' +

                '<div class="skills-cell">' +
                    formatSkills(requiredSkills) +
                '</div>' +

            '</td>' +


            '<td>' +

                '<span class="created-date">' +
                    formatDate(createdAt) +
                '</span>' +

            '</td>' +


            '<td class="action-cell">' +

                '<div class="career-action-buttons">' +


                    '<button ' +
                        'type="button" ' +
                        'class="career-action-btn view-btn" ' +
                        'title="View Career" ' +
                        'onclick="viewCareer(' +
                            careerId +
                        ')">' +

                        '<i class="fa-solid fa-eye"></i>' +
                        '<span>View</span>' +

                    '</button>' +


                    '<button ' +
                        'type="button" ' +
                        'class="career-action-btn edit-btn" ' +
                        'title="Edit Career" ' +
                        'onclick="editCareer(' +
                            careerId +
                        ')">' +

                        '<i class="fa-solid fa-pen-to-square"></i>' +
                        '<span>Edit</span>' +

                    '</button>' +


                    '<button ' +
                        'type="button" ' +
                        'class="career-action-btn delete-btn" ' +
                        'title="Delete Career" ' +
                        'onclick="deleteCareer(' +
                            careerId +
                        ')">' +

                        '<i class="fa-solid fa-trash"></i>' +
                        '<span>Delete</span>' +

                    '</button>' +


                '</div>' +

            '</td>';


        tableBody.appendChild(row);

    });

}


/* ============================================================
   FORMAT SKILLS
   ============================================================ */

function formatSkills(skills) {

    if (!skills) {
        return "-";
    }


    var skillArray =
        String(skills)
            .split(",")
            .map(function (skill) {
                return skill.trim();
            })
            .filter(function (skill) {
                return skill.length > 0;
            });


    return skillArray
        .map(function (skill) {

            return (
                '<span class="skill-tag">' +
                escapeHtml(skill) +
                '</span>'
            );

        })
        .join("");

}


/* ============================================================
   UPDATE STATS
   ============================================================ */

function updateCareerStats(data) {

    if (!data) {
        data = [];
    }


    var total =
        data.length;


    var skillBased =
        data.filter(function (career) {

            var skills =
                career.requiredSkills ||
                career.required_skills;

            return (
                skills &&
                String(skills).trim() !== ""
            );

        }).length;


    var totalElement =
        document.getElementById(
            "statTotalCareers"
        );


    var skillElement =
        document.getElementById(
            "statSkillBased"
        );


    if (totalElement) {
        totalElement.textContent = total;
    }


    if (skillElement) {
        skillElement.textContent = skillBased;
    }

}


/* ============================================================
   LOAD TOTAL CAREERS
   ============================================================ */

function loadTotalCareers() {

    fetch(
        CAREER_API + "/total",
        {
            method: "GET",
            headers: getHeaders(false)
        }
    )

    .then(function (response) {

        if (!response.ok) {
            throw new Error(
                "Failed to load total careers"
            );
        }

        return response.json();

    })

    .then(function (total) {

        var element =
            document.getElementById(
                "statTotalCareers"
            );


        if (!element) {
            return;
        }


        if (
            typeof total === "object" &&
            total !== null
        ) {

            if (total.total !== undefined) {

                element.textContent =
                    total.total;

            }

            else if (total.data !== undefined) {

                element.textContent =
                    total.data;

            }

        }

        else {

            element.textContent =
                total;

        }

    })

    .catch(function (error) {

        console.error(
            "TOTAL CAREER ERROR:",
            error
        );

    });

}


/* ============================================================
   ADD / UPDATE FORM
   ============================================================ */

function setupForm() {

    var form =
        document.getElementById(
            "careerForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            var careerIdElement =
                document.getElementById(
                    "careerId"
                );


            var careerNameElement =
                document.getElementById(
                    "careerName"
                );


            var skillsElement =
                document.getElementById(
                    "requiredSkills"
                );


            var descriptionElement =
                document.getElementById(
                    "careerDescription"
                );


            var careerId =
                careerIdElement
                    ? careerIdElement.value.trim()
                    : "";


            var careerName =
                careerNameElement
                    ? careerNameElement.value.trim()
                    : "";


            var requiredSkills =
                skillsElement
                    ? skillsElement.value.trim()
                    : "";


            var description =
                descriptionElement
                    ? descriptionElement.value.trim()
                    : "";


            if (
                !careerName ||
                !requiredSkills ||
                !description
            ) {

                alert(
                    "Please fill all required fields."
                );

                return;
            }


            var career = {

                careerId:
                    careerId
                        ? parseInt(
                            careerId,
                            10
                        )
                        : null,

                careerName:
                    careerName,

                description:
                    description,

                requiredSkills:
                    requiredSkills
            };


            var isEdit =
                careerId !== "";


            var url =
                isEdit
                    ? CAREER_API + "/update"
                    : CAREER_API + "/add";


            var method =
                isEdit
                    ? "PUT"
                    : "POST";


            fetch(
                url,
                {
                    method: method,
                    headers: getHeaders(true),
                    body: JSON.stringify(career)
                }
            )

            .then(function (response) {

                return response.text()
                    .then(function (message) {

                        if (!response.ok) {

                            throw new Error(
                                message ||
                                "Operation failed"
                            );
                        }


                        return message;

                    });

            })

            .then(function (message) {

                alert(
                    message ||
                    (
                        isEdit
                            ? "Career updated successfully."
                            : "Career added successfully."
                    )
                );


                resetCareerForm();

                loadCareers();

                loadTotalCareers();

            })

            .catch(function (error) {

                console.error(
                    "SAVE CAREER ERROR:",
                    error
                );


                alert(
                    error.message ||
                    "Failed to save career."
                );

            });

        }
    );


    var cancelButton =
        document.getElementById(
            "cancelCareerBtn"
        );


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            resetCareerForm
        );

    }

}


/* ============================================================
   EDIT CAREER
   ============================================================ */

function editCareer(id) {

    var career =
        careers.find(function (item) {

            return Number(
                item.careerId ||
                item.career_id
            ) === Number(id);

        });


    if (!career) {

        alert(
            "Career not found."
        );

        return;
    }


    document.getElementById(
        "careerId"
    ).value =
        career.careerId ||
        career.career_id ||
        "";


    document.getElementById(
        "careerName"
    ).value =
        career.careerName ||
        career.career_name ||
        "";


    document.getElementById(
        "requiredSkills"
    ).value =
        career.requiredSkills ||
        career.required_skills ||
        "";


    document.getElementById(
        "careerDescription"
    ).value =
        career.description ||
        "";


    var title =
        document.getElementById(
            "careerFormTitle"
        );


    if (title) {

        title.textContent =
            "Edit Career";

    }


    var subtitle =
        document.getElementById(
            "careerFormSubtitle"
        );


    if (subtitle) {

        subtitle.textContent =
            "Update the selected career information.";

    }


    var saveText =
        document.getElementById(
            "saveCareerText"
        );


    if (saveText) {

        saveText.textContent =
            "Update Career";

    }


    var saveButton =
        document.getElementById(
            "saveCareerBtn"
        );


    if (saveButton) {

        var icon =
            saveButton.querySelector("i");


        if (icon) {

            icon.className =
                "fa-solid fa-floppy-disk";

        }

    }


    var cancelButton =
        document.getElementById(
            "cancelCareerBtn"
        );


    if (cancelButton) {

        cancelButton.style.display =
            "inline-flex";

    }


    var formCard =
        document.querySelector(
            ".career-form-card"
        );


    if (formCard) {

        formCard.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


/* ============================================================
   RESET FORM
   ============================================================ */

function resetCareerForm() {

    var form =
        document.getElementById(
            "careerForm"
        );


    if (form) {
        form.reset();
    }


    var careerId =
        document.getElementById(
            "careerId"
        );


    if (careerId) {

        careerId.value =
            "";

    }


    var title =
        document.getElementById(
            "careerFormTitle"
        );


    if (title) {

        title.textContent =
            "Add New Career";

    }


    var subtitle =
        document.getElementById(
            "careerFormSubtitle"
        );


    if (subtitle) {

        subtitle.textContent =
            "Create a new career category for users.";

    }


    var saveText =
        document.getElementById(
            "saveCareerText"
        );


    if (saveText) {

        saveText.textContent =
            "Add Career";

    }


    var saveButton =
        document.getElementById(
            "saveCareerBtn"
        );


    if (saveButton) {

        var icon =
            saveButton.querySelector("i");


        if (icon) {

            icon.className =
                "fa-solid fa-plus";

        }

    }


    var cancelButton =
        document.getElementById(
            "cancelCareerBtn"
        );


    if (cancelButton) {

        cancelButton.style.display =
            "none";

    }

}


/* ============================================================
   DELETE CAREER
   ============================================================ */

function deleteCareer(id) {

    var career =
        careers.find(function (item) {

            return Number(
                item.careerId ||
                item.career_id
            ) === Number(id);

        });


    if (!career) {

        alert(
            "Career not found."
        );

        return;
    }


    var careerName =
        career.careerName ||
        career.career_name ||
        "this career";


    var confirmed =
        confirm(
            'Are you sure you want to delete "' +
            careerName +
            '"?'
        );


    if (!confirmed) {
        return;
    }


    fetch(
        CAREER_API +
        "/delete/" +
        id,
        {
            method: "DELETE",
            headers: getHeaders(false)
        }
    )

    .then(function (response) {

        return response.text()
            .then(function (message) {

                if (!response.ok) {

                    throw new Error(
                        message ||
                        "Delete failed"
                    );
                }


                return message;

            });

    })

    .then(function (message) {

        alert(
            message ||
            "Career deleted successfully."
        );


        loadCareers();

        loadTotalCareers();

    })

    .catch(function (error) {

        console.error(
            "DELETE CAREER ERROR:",
            error
        );


        alert(
            error.message ||
            "Failed to delete career."
        );

    });

}


/* ============================================================
   VIEW CAREER
   ============================================================ */

function viewCareer(id) {

    var career =
        careers.find(function (item) {

            return Number(
                item.careerId ||
                item.career_id
            ) === Number(id);

        });


    if (!career) {

        alert(
            "Career not found."
        );

        return;
    }


    var careerName =
        career.careerName ||
        career.career_name ||
        "-";


    var description =
        career.description ||
        "-";


    var skills =
        career.requiredSkills ||
        career.required_skills ||
        "-";


    var createdAt =
        career.createdAt ||
        career.created_at ||
        null;


    var modalCareerName =
        document.getElementById(
            "modalCareerName"
        );


    if (modalCareerName) {

        modalCareerName.textContent =
            careerName;

    }


    var modalCareerId =
        document.getElementById(
            "modalCareerId"
        );


    if (modalCareerId) {

        modalCareerId.textContent =
            career.careerId ||
            career.career_id ||
            "-";

    }


    var modalDescription =
        document.getElementById(
            "modalCareerDescription"
        );


    if (modalDescription) {

        modalDescription.textContent =
            description;

    }


    var modalSkills =
        document.getElementById(
            "modalCareerSkills"
        );


    if (modalSkills) {

        modalSkills.textContent =
            skills;

    }


    var modalCreated =
        document.getElementById(
            "modalCareerCreatedAt"
        );


    if (modalCreated) {

        modalCreated.textContent =
            formatDate(createdAt);

    }


    var modal =
        document.getElementById(
            "careerModal"
        );


    if (modal) {

        modal.classList.add(
            "show"
        );

    }

}


/* ============================================================
   MODAL
   ============================================================ */

function setupModal() {

    var modal =
        document.getElementById(
            "careerModal"
        );


    var closeButton =
        document.getElementById(
            "closeCareerModal"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            function () {

                if (modal) {

                    modal.classList.remove(
                        "show"
                    );

                }

            }
        );

    }


    if (modal) {

        modal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === modal
                ) {

                    modal.classList.remove(
                        "show"
                    );

                }

            }
        );

    }

}


/* ============================================================
   SEARCH
   ============================================================ */

function setupSearch() {

    var searchInput =
        document.getElementById(
            "careerSearch"
        );


    var searchButton =
        document.getElementById(
            "searchCareerBtn"
        );


    if (searchButton) {

        searchButton.addEventListener(
            "click",
            performSearch
        );

    }


    if (searchInput) {

        searchInput.addEventListener(
            "keyup",
            function (event) {

                if (
                    event.key === "Enter"
                ) {

                    performSearch();

                }

            }
        );

    }


    var refreshButton =
        document.getElementById(
            "refreshCareers"
        );


    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            function () {

                if (searchInput) {

                    searchInput.value =
                        "";

                }

                loadCareers();

            }
        );

    }

}


/* ============================================================
   PERFORM SEARCH
   ============================================================ */

function performSearch() {

    var input =
        document.getElementById(
            "careerSearch"
        );


    if (!input) {
        return;
    }


    var keyword =
        input.value.trim();


    if (!keyword) {

        renderCareers(
            careers
        );

        return;
    }


    fetch(
        CAREER_API +
        "/search/" +
        encodeURIComponent(keyword),
        {
            method: "GET",
            headers: getHeaders(false)
        }
    )

    .then(function (response) {

        if (!response.ok) {

            throw new Error(
                "Search failed. HTTP " +
                response.status
            );
        }


        return response.json();

    })

    .then(function (result) {

        if (Array.isArray(result)) {

            renderCareers(result);

        }

        else if (
            result &&
            Array.isArray(result.data)
        ) {

            renderCareers(
                result.data
            );

        }

        else {

            renderCareers([]);

        }

    })

    .catch(function (error) {

        console.error(
            "SEARCH CAREER ERROR:",
            error
        );


        alert(
            error.message ||
            "Failed to search careers."
        );

    });

}


/* ============================================================
   DATE FORMAT
   ============================================================ */

function formatDate(dateValue) {

    if (!dateValue) {
        return "-";
    }


    try {

        var date =
            new Date(dateValue);


        if (
            isNaN(
                date.getTime()
            )
        ) {

            return String(
                dateValue
            );

        }


        return date.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    }

    catch (error) {

        return String(
            dateValue
        );

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
   GLOBAL FUNCTIONS
   ============================================================ */

window.editCareer =
    editCareer;


window.deleteCareer =
    deleteCareer;


window.viewCareer =
    viewCareer;


console.log(
    "manageCareer.js initialized successfully."
);