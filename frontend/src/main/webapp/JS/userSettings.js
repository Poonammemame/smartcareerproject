/* ============================================================
   PATHFINDER - USER SETTINGS
   ============================================================ */

console.log("======================================");
console.log("userSettings.js LOADED");
console.log("======================================");


/* ============================================================
   API
   ============================================================ */

var API_BASE_URL = window.API_BASE_URL || (typeof getApiBaseUrl === "function" ? getApiBaseUrl() : "http://localhost:8090/api");

var SETTINGS_API =
    (typeof API_ENDPOINTS !== "undefined" && API_ENDPOINTS.SETTINGS)
        ? API_BASE_URL + "/settings"
        : API_BASE_URL + "/settings";


/* ============================================================
   PAGE LOAD
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

    console.log("Settings DOM loaded");

    initializeTabs();

    initializePasswordToggles();

    initializeProfileForm();

    initializePasswordForm();

    initializeNotificationSettings();

    initializeDarkMode();

    initializePerformanceSettings();

    loadUserSettings();

});


/* ============================================================
   GET JWT TOKEN
   ============================================================ */

function getAuthToken() {

    var token = localStorage.getItem("token");

    if (!token) {
        token = localStorage.getItem("jwtToken");
    }

    if (!token) {
        token = localStorage.getItem("accessToken");
    }

    if (!token) {
        token = sessionStorage.getItem("token");
    }

    return token;
}


/* ============================================================
   COMMON HEADERS
   ============================================================ */

function getHeaders() {

    var headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    };

    var token = getAuthToken();

    if (token) {

        headers["Authorization"] =
            "Bearer " + token;

    }

    return headers;
}


/* ============================================================
   SETTINGS TAB
   ============================================================ */

function initializeTabs() {

    var navButtons =
        document.querySelectorAll(".settings-nav");

    var sections =
        document.querySelectorAll(".settings-section");


    navButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            var sectionId =
                button.getAttribute("data-section");


            navButtons.forEach(function (btn) {

                btn.classList.remove("active");

            });


            sections.forEach(function (section) {

                section.classList.remove("active");

            });


            button.classList.add("active");


            var selectedSection =
                document.getElementById(sectionId);


            if (selectedSection) {

                selectedSection.classList.add("active");

            }

        });

    });

}


/* ============================================================
   PASSWORD SHOW / HIDE
   ============================================================ */

function initializePasswordToggles() {

    var buttons =
        document.querySelectorAll(".password-toggle");


    buttons.forEach(function (button) {

        button.addEventListener("click", function () {

            var targetId =
                button.getAttribute("data-target");

            var input =
                document.getElementById(targetId);

            if (!input) {
                return;
            }

            var icon =
                button.querySelector("i");


            if (input.type === "password") {

                input.type = "text";

                if (icon) {

                    icon.classList.remove(
                        "fa-eye"
                    );

                    icon.classList.add(
                        "fa-eye-slash"
                    );

                }

            } else {

                input.type = "password";

                if (icon) {

                    icon.classList.remove(
                        "fa-eye-slash"
                    );

                    icon.classList.add(
                        "fa-eye"
                    );

                }

            }

        });

    });

}


/* ============================================================
   LOAD USER SETTINGS
   ============================================================ */

function loadUserSettings() {

    console.log("Loading user settings...");


    var token =
        getAuthToken();


    if (!token) {

        console.error(
            "JWT token not found"
        );

        showSwal(
            "Login Required",
            "Your login session is missing. Please login again.",
            "warning"
        );

        return;

    }


    fetch(
        SETTINGS_API + "/my",
        {
            method: "GET",
            headers: getHeaders()
        }
    )

    .then(function (response) {

        console.log(
            "Settings API status:",
            response.status
        );


        return response.text().then(function (text) {

            var data = null;


            if (text) {

                try {

                    data = JSON.parse(text);

                } catch (error) {

                    data = text;

                }

            }


            return {
                status: response.status,
                data: data
            };

        });

    })

    .then(function (result) {

        if (result.status === 200) {

            console.log(
                "USER SETTINGS:",
                result.data
            );


            displayUserSettings(
                result.data
            );


            console.log(
                "Settings displayed successfully."
            );


            return;

        }


        if (result.status === 401) {

            showSwal(
                "Session Expired",
                "Please login again.",
                "warning"
            );

            return;

        }


        if (result.status === 403) {

            showSwal(
                "Access Denied",
                "You are not authorized to access user settings.",
                "error"
            );

            return;

        }


        var message =
            getErrorMessage(
                result.data
            );


        console.error(
            "LOAD SETTINGS ERROR:",
            message
        );


        showSwal(
            "Unable to Load",
            message,
            "error"
        );

    })

    .catch(function (error) {

        console.error(
            "SETTINGS NETWORK ERROR:",
            error
        );


        showSwal(
            "Connection Error",
            "Unable to connect to the server. Please check that Spring Boot is running.",
            "error"
        );

    });

}


/* ============================================================
   DISPLAY USER SETTINGS
   ============================================================ */

function displayUserSettings(data) {

    if (!data) {

        showSwal(
            "Error",
            "No user settings were returned by the server.",
            "error"
        );

        return;

    }


    var nameInput =
        document.getElementById("userName");

    var emailInput =
        document.getElementById("userEmail");

    var displayName =
        document.getElementById(
            "profileDisplayName"
        );

    var profileInitial =
        document.getElementById(
            "profileInitial"
        );


    /* =========================
       NAME
       ========================= */

    if (nameInput) {

        nameInput.value =
            data.name || "";

    }


    if (displayName) {

        displayName.textContent =
            data.name || "PathFinder User";

    }


    if (profileInitial) {

        if (data.name) {

            profileInitial.textContent =
                data.name
                    .charAt(0)
                    .toUpperCase();

        } else {

            profileInitial.textContent = "U";

        }

    }


    /* =========================
       EMAIL
       ========================= */

    if (emailInput) {

        emailInput.value =
            data.email || "";

        emailInput.setAttribute(
            "data-current-email",
            data.email || ""
        );

    }


    /* =========================
       NOTIFICATIONS
       ========================= */

    var emailNotification =
        document.getElementById(
            "emailNotification"
        );

    var assessmentNotification =
        document.getElementById(
            "assessmentNotification"
        );

    var careerNotification =
        document.getElementById(
            "careerNotification"
        );


    if (emailNotification) {

        emailNotification.checked =
            data.emailNotifications === true;

    }


    if (assessmentNotification) {

        assessmentNotification.checked =
            data.assessmentNotifications === true;

    }


    if (careerNotification) {

        careerNotification.checked =
            data.careerNotifications === true;

    }


    /* =========================
       THEME
       ========================= */

    var darkMode =
        document.getElementById(
            "darkMode"
        );


    if (darkMode) {

        darkMode.checked =
            data.theme === "dark";

    }


    console.log(
        "Settings displayed successfully."
    );

}


/* ============================================================
   PROFILE FORM
   ============================================================ */

function initializeProfileForm() {

    var profileForm =
        document.getElementById(
            "profileForm"
        );


    if (!profileForm) {
        return;
    }


    profileForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            var nameInput =
                document.getElementById(
                    "userName"
                );

            var emailInput =
                document.getElementById(
                    "userEmail"
                );


            var name =
                nameInput
                    ? nameInput.value.trim()
                    : "";


            var email =
                emailInput
                    ? emailInput.value.trim()
                    : "";


            if (name === "") {

                showSwal(
                    "Validation Error",
                    "Please enter your full name.",
                    "warning"
                );

                return;

            }


            if (email === "") {

                showSwal(
                    "Validation Error",
                    "Please enter your email address.",
                    "warning"
                );

                return;

            }


            /*
             * IMPORTANT:
             *
             * Your current backend does NOT have
             * an API for updating NAME.
             *
             * /settings/email only updates EMAIL.
             *
             * Therefore do not pretend that name
             * was saved to database.
             */


            updateEmailFromProfile(
                email
            );

        }
    );

}


/* ============================================================
   UPDATE EMAIL FROM PROFILE
   ============================================================ */

function updateEmailFromProfile(newEmail) {

    var emailInput =
        document.getElementById(
            "userEmail"
        );


    var currentEmail = "";


    if (emailInput) {

        currentEmail =
            emailInput.getAttribute(
                "data-current-email"
            ) || "";

    }


    if (currentEmail === "") {

        currentEmail =
            emailInput
                ? emailInput.value.trim()
                : "";

    }


    if (newEmail === currentEmail) {

        showSwal(
            "No Changes",
            "There is no email change to save.",
            "info"
        );

        return;

    }


    var requestData = {

        newEmail: newEmail

    };


    console.log(
        "Updating email:",
        newEmail
    );


    fetch(
        SETTINGS_API + "/email",
        {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(requestData)
        }
    )

    .then(function (response) {

        console.log(
            "Update email status:",
            response.status
        );


        return response.text().then(
            function (text) {

                var data = null;


                if (text) {

                    try {

                        data =
                            JSON.parse(text);

                    } catch (error) {

                        data = text;

                    }

                }


                return {

                    status:
                        response.status,

                    data:
                        data

                };

            }
        );

    })

    .then(function (result) {

        if (result.status === 200) {

            console.log(
                "EMAIL UPDATE:",
                result.data
            );


            showSwal(
                "Email Updated",
                "Your email was updated successfully. Please login again with your new email.",
                "success"
            );


            return;

        }


        var message =
            getErrorMessage(
                result.data
            );


        console.error(
            "UPDATE EMAIL ERROR:",
            message
        );


        showSwal(
            "Unable to Update Email",
            message,
            "error"
        );

    })

    .catch(function (error) {

        console.error(
            "EMAIL UPDATE NETWORK ERROR:",
            error
        );


        showSwal(
            "Connection Error",
            "Unable to connect to the server.",
            "error"
        );

    });

}


/* ============================================================
   CHANGE PASSWORD
   ============================================================ */

function initializePasswordForm() {

    var passwordForm =
        document.getElementById(
            "passwordForm"
        );


    if (!passwordForm) {
        return;
    }


    passwordForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            var currentPassword =
                document.getElementById(
                    "currentPassword"
                );

            var newPassword =
                document.getElementById(
                    "newPassword"
                );

            var confirmPassword =
                document.getElementById(
                    "confirmPassword"
                );


            var current =
                currentPassword
                    ? currentPassword.value
                    : "";


            var newPass =
                newPassword
                    ? newPassword.value
                    : "";


            var confirm =
                confirmPassword
                    ? confirmPassword.value
                    : "";


            if (current === "") {

                showSwal(
                    "Validation Error",
                    "Please enter your current password.",
                    "warning"
                );

                return;

            }


            if (newPass === "") {

                showSwal(
                    "Validation Error",
                    "Please enter your new password.",
                    "warning"
                );

                return;

            }


            if (newPass.length < 6) {

                showSwal(
                    "Validation Error",
                    "Password must contain at least 6 characters.",
                    "warning"
                );

                return;

            }


            if (newPass !== confirm) {

                showSwal(
                    "Password Error",
                    "New password and confirm password do not match.",
                    "warning"
                );

                return;

            }


            var requestData = {

                currentPassword:
                    current,

                newPassword:
                    newPass,

                confirmPassword:
                    confirm

            };


            fetch(
                SETTINGS_API + "/password",
                {
                    method: "PUT",
                    headers: getHeaders(),
                    body: JSON.stringify(
                        requestData
                    )
                }
            )

            .then(function (response) {

                console.log(
                    "Password API status:",
                    response.status
                );


                return response.text().then(
                    function (text) {

                        var data = null;


                        if (text) {

                            try {

                                data =
                                    JSON.parse(text);

                            } catch (error) {

                                data = text;

                            }

                        }


                        return {

                            status:
                                response.status,

                            data:
                                data

                        };

                    }
                );

            })

            .then(function (result) {

                if (result.status === 200) {

                    showSwal(
                        "Password Changed",
                        "Password changed successfully. Please login again.",
                        "success"
                    );


                    passwordForm.reset();

                    return;

                }


                var message =
                    getErrorMessage(
                        result.data
                    );


                showSwal(
                    "Password Update Failed",
                    message,
                    "error"
                );

            })

            .catch(function (error) {

                console.error(
                    "PASSWORD NETWORK ERROR:",
                    error
                );


                showSwal(
                    "Connection Error",
                    "Unable to connect to the server.",
                    "error"
                );

            });

        }
    );

}


/* ============================================================
   NOTIFICATION SETTINGS
   ============================================================ */

function initializeNotificationSettings() {

    var saveButton =
        document.getElementById(
            "saveNotifications"
        );


    if (!saveButton) {
        return;
    }


    saveButton.addEventListener(
        "click",
        function () {

            var email =
                document.getElementById(
                    "emailNotification"
                );

            var assessment =
                document.getElementById(
                    "assessmentNotification"
                );

            var career =
                document.getElementById(
                    "careerNotification"
                );


            var requestData = {

                emailNotifications:
                    email
                        ? email.checked
                        : true,

                assessmentNotifications:
                    assessment
                        ? assessment.checked
                        : true,

                careerNotifications:
                    career
                        ? career.checked
                        : true,

                theme:
                    getSelectedTheme()

            };


            console.log(
                "Saving settings:",
                requestData
            );


            fetch(
                SETTINGS_API + "/update",
                {
                    method: "PUT",
                    headers: getHeaders(),
                    body: JSON.stringify(
                        requestData
                    )
                }
            )

            .then(function (response) {

                return response.text().then(
                    function (text) {

                        var data = text;


                        try {

                            data =
                                JSON.parse(text);

                        } catch (error) {

                            // keep text

                        }


                        return {

                            status:
                                response.status,

                            data:
                                data

                        };

                    }
                );

            })

            .then(function (result) {

                if (result.status === 200) {

                    showSwal(
                        "Settings Saved",
                        "Notification preferences updated successfully.",
                        "success"
                    );

                    return;

                }


                showSwal(
                    "Update Failed",
                    getErrorMessage(
                        result.data
                    ),
                    "error"
                );

            })

            .catch(function (error) {

                console.error(
                    "SETTINGS UPDATE ERROR:",
                    error
                );


                showSwal(
                    "Connection Error",
                    "Unable to connect to the server.",
                    "error"
                );

            });

        }
    );

}


/* ============================================================
   GET SELECTED THEME
   ============================================================ */

function getSelectedTheme() {

    var darkMode =
        document.getElementById(
            "darkMode"
        );


    if (darkMode &&
        darkMode.checked) {

        return "dark";

    }


    return "light";

}


/* ============================================================
   DARK MODE
   ============================================================ */

function initializeDarkMode() {

    var darkMode =
        document.getElementById(
            "darkMode"
        );


    if (!darkMode) {
        return;
    }


    darkMode.addEventListener(
        "change",
        function () {

            if (darkMode.checked) {

                document.body.classList.add(
                    "settings-dark-mode"
                );

            } else {

                document.body.classList.remove(
                    "settings-dark-mode"
                );

            }

        }
    );

}


/* ============================================================
   PERFORMANCE SETTINGS
   ============================================================ */

function initializePerformanceSettings() {

    var performance =
        document.getElementById(
            "performanceInsights"
        );


    if (!performance) {
        return;
    }


    var saved =
        localStorage.getItem(
            "pathfinderPerformanceInsights"
        );


    if (saved !== null) {

        performance.checked =
            saved === "true";

    }


    performance.addEventListener(
        "change",
        function () {

            localStorage.setItem(
                "pathfinderPerformanceInsights",
                performance.checked
            );


            showSwal(
                "Updated",
                "Performance insights preference updated.",
                "success"
            );

        }
    );

}


/* ============================================================
   ERROR MESSAGE
   ============================================================ */

function getErrorMessage(data) {

    if (!data) {

        return "Unable to process your request.";

    }


    if (typeof data === "string") {

        return data;

    }


    if (data.message) {

        return data.message;

    }


    if (data.error) {

        return data.error;

    }


    return "Unable to process your request.";

}


/* ============================================================
   SWEETALERT
   ============================================================ */

function showSwal(
    title,
    text,
    icon
) {

    if (typeof Swal !== "undefined") {

        Swal.fire({

            title: title,

            text: text,

            icon: icon,

            confirmButtonText: "OK",

            confirmButtonColor: "#5146e5"

        });

        return;

    }


    alert(
        title + "\n\n" + text
    );

}