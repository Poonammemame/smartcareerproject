/* ============================================================
   PATHFINDER - FORGOT PASSWORD
   ============================================================ */

console.log("======================================");
console.log("forgotPassword.js LOADED");
console.log("======================================");


/* ============================================================
   API CONFIGURATION
============================================================ */

var API_BASE_URL = window.API_BASE_URL || (typeof getApiBaseUrl === "function" ? getApiBaseUrl() : "http://localhost:8090/api");

var FORGOT_PASSWORD_API =
    (typeof API_ENDPOINTS !== "undefined" && API_ENDPOINTS.AUTH)
        ? API_ENDPOINTS.AUTH.FORGOT_PASSWORD
        : API_BASE_URL + "/auth/forgot-password";

var VERIFY_OTP_API =
    (typeof API_ENDPOINTS !== "undefined" && API_ENDPOINTS.AUTH)
        ? API_ENDPOINTS.AUTH.VERIFY_OTP
        : API_BASE_URL + "/auth/verify-otp";

var RESET_PASSWORD_API =
    (typeof API_ENDPOINTS !== "undefined" && API_ENDPOINTS.AUTH)
        ? API_ENDPOINTS.AUTH.RESET_PASSWORD
        : API_BASE_URL + "/auth/reset-password";


/* ============================================================
   PAGE LOAD
============================================================ */

document.addEventListener("DOMContentLoaded", function () {

    console.log("Forgot Password page loaded");

    initPasswordToggles();


    // ============================================================
    // GET ELEMENTS
    // ============================================================

    const emailStep =
        document.getElementById("emailStep");

    const otpStep =
        document.getElementById("otpStep");

    const passwordStep =
        document.getElementById("passwordStep");


    const email =
        document.getElementById("email");

    const otp =
        document.getElementById("otp");

    const newPassword =
        document.getElementById("newPassword");

    const confirmPassword =
        document.getElementById("confirmPassword");


    const sendOtpBtn =
        document.getElementById("sendOtpBtn");

    const verifyOtpBtn =
        document.getElementById("verifyOtpBtn");

    const resetPasswordBtn =
        document.getElementById("resetPasswordBtn");


    const message =
        document.getElementById("message");

    const otpMessage =
        document.getElementById("otpMessage");

    const passwordMessage =
        document.getElementById("passwordMessage");


    // ============================================================
    // CHECK ELEMENTS
    // ============================================================

    if (!emailStep ||
        !otpStep ||
        !passwordStep ||
        !email ||
        !otp ||
        !newPassword ||
        !confirmPassword ||
        !sendOtpBtn ||
        !verifyOtpBtn ||
        !resetPasswordBtn) {

        console.error(
            "Forgot Password elements not found."
        );

        return;
    }


    console.log(
        "Forgot Password elements found successfully"
    );


    /* ============================================================
       STEP 1 - SEND OTP
    ============================================================ */

    sendOtpBtn.addEventListener(
        "click",
        function () {

            console.log(
                "Send OTP button clicked"
            );


            // ====================================================
            // CLEAR MESSAGE
            // ====================================================

            message.innerText = "";
            message.style.color = "";


            // ====================================================
            // GET EMAIL
            // ====================================================

            const emailValue =
                email.value.trim();


            // ====================================================
            // VALIDATE EMAIL
            // ====================================================

            if (emailValue === "") {

                showMessage(
                    message,
                    "Email address is required.",
                    "red"
                );

                email.focus();

                return;
            }


            // ====================================================
            // EMAIL FORMAT
            // ====================================================

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailPattern.test(emailValue)) {

                showMessage(
                    message,
                    "Please enter a valid email address.",
                    "red"
                );

                email.focus();

                return;
            }


            // ====================================================
            // BUTTON
            // ====================================================

            sendOtpBtn.disabled = true;

            sendOtpBtn.innerText =
                "Sending OTP...";


            // ====================================================
            // API REQUEST
            // ====================================================

            fetch(
                FORGOT_PASSWORD_API,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        email: emailValue
                    })

                }
            )


            // ====================================================
            // RESPONSE
            // ====================================================

            .then(function (response) {

                console.log(
                    "FORGOT PASSWORD STATUS:",
                    response.status
                );


                return response.text()
                    .then(function (text) {

                        return {
                            status: response.status,
                            ok: response.ok,
                            text: text
                        };

                    });

            })


            // ====================================================
            // RESULT
            // ====================================================

            .then(function (result) {

                console.log(
                    "FORGOT PASSWORD RESPONSE:",
                    result.text
                );


                if (result.ok) {

                    showMessage(
                        message,
                        result.text ||
                        "OTP sent successfully.",
                        "green"
                    );


                    // ==================================================
                    // SHOW OTP STEP
                    // ==================================================

                    emailStep.classList.add(
                        "hidden"
                    );

                    otpStep.classList.remove(
                        "hidden"
                    );


                    otp.focus();


                    console.log(
                        "OTP STEP DISPLAYED"
                    );

                } else {

                    showMessage(
                        message,
                        result.text ||
                        "Unable to send OTP.",
                        "red"
                    );

                }

            })


            // ====================================================
            // ERROR
            // ====================================================

            .catch(function (error) {

                console.error(
                    "FORGOT PASSWORD ERROR:",
                    error
                );


                showMessage(
                    message,
                    "Unable to connect to backend.",
                    "red"
                );

            })


            // ====================================================
            // FINALLY
            // ====================================================

            .finally(function () {

                sendOtpBtn.disabled = false;

                sendOtpBtn.innerText =
                    "Send OTP";

            });

        }
    );


    /* ============================================================
       STEP 2 - VERIFY OTP
    ============================================================ */

    verifyOtpBtn.addEventListener(
        "click",
        function () {

            console.log(
                "Verify OTP button clicked"
            );


            // ====================================================
            // CLEAR MESSAGE
            // ====================================================

            otpMessage.innerText = "";
            otpMessage.style.color = "";


            // ====================================================
            // GET VALUES
            // ====================================================

            const emailValue =
                email.value.trim();

            const otpValue =
                otp.value.trim();


            // ====================================================
            // VALIDATE OTP
            // ====================================================

            if (otpValue === "") {

                showMessage(
                    otpMessage,
                    "OTP is required.",
                    "red"
                );

                otp.focus();

                return;
            }


            if (!/^\d{6}$/.test(otpValue)) {

                showMessage(
                    otpMessage,
                    "OTP must be exactly 6 digits.",
                    "red"
                );

                otp.focus();

                return;
            }


            // ====================================================
            // BUTTON
            // ====================================================

            verifyOtpBtn.disabled = true;

            verifyOtpBtn.innerText =
                "Verifying...";


            // ====================================================
            // API REQUEST
            // ====================================================

            fetch(
                VERIFY_OTP_API,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        email: emailValue,

                        otp: otpValue

                    })

                }
            )


            // ====================================================
            // RESPONSE
            // ====================================================

            .then(function (response) {

                console.log(
                    "VERIFY OTP STATUS:",
                    response.status
                );


                return response.text()
                    .then(function (text) {

                        return {
                            status: response.status,
                            ok: response.ok,
                            text: text
                        };

                    });

            })


            // ====================================================
            // RESULT
            // ====================================================

            .then(function (result) {

                console.log(
                    "VERIFY OTP RESPONSE:",
                    result.text
                );


                if (result.ok) {

                    showMessage(
                        otpMessage,
                        result.text ||
                        "OTP verified successfully.",
                        "green"
                    );


                    // ==================================================
                    // SHOW PASSWORD STEP
                    // ==================================================

                    otpStep.classList.add(
                        "hidden"
                    );

                    passwordStep.classList.remove(
                        "hidden"
                    );


                    newPassword.focus();


                    console.log(
                        "PASSWORD STEP DISPLAYED"
                    );

                } else {

                    showMessage(
                        otpMessage,
                        result.text ||
                        "Invalid OTP.",
                        "red"
                    );

                }

            })


            // ====================================================
            // ERROR
            // ====================================================

            .catch(function (error) {

                console.error(
                    "VERIFY OTP ERROR:",
                    error
                );


                showMessage(
                    otpMessage,
                    "Unable to connect to backend.",
                    "red"
                );

            })


            // ====================================================
            // FINALLY
            // ====================================================

            .finally(function () {

                verifyOtpBtn.disabled = false;

                verifyOtpBtn.innerText =
                    "Verify OTP";

            });

        }
    );


    /* ============================================================
       STEP 3 - RESET PASSWORD
    ============================================================ */

    resetPasswordBtn.addEventListener(
        "click",
        function () {

            console.log(
                "Reset Password button clicked"
            );


            // ====================================================
            // CLEAR MESSAGE
            // ====================================================

            passwordMessage.innerText = "";
            passwordMessage.style.color = "";


            // ====================================================
            // GET VALUES
            // ====================================================

            const emailValue =
                email.value.trim();

            const passwordValue =
                newPassword.value;

            const confirmValue =
                confirmPassword.value;


            // ====================================================
            // VALIDATE PASSWORD
            // ====================================================

            if (passwordValue === "") {

                showMessage(
                    passwordMessage,
                    "New password is required.",
                    "red"
                );

                newPassword.focus();

                return;
            }


            // ====================================================
            // PASSWORD LENGTH
            // ====================================================

            if (passwordValue.length < 6) {

                showMessage(
                    passwordMessage,
                    "Password must be at least 6 characters.",
                    "red"
                );

                newPassword.focus();

                return;
            }


            // ====================================================
            // CONFIRM PASSWORD
            // ====================================================

            if (confirmValue === "") {

                showMessage(
                    passwordMessage,
                    "Please confirm your password.",
                    "red"
                );

                confirmPassword.focus();

                return;
            }


            // ====================================================
            // PASSWORD MATCH
            // ====================================================

            if (passwordValue !== confirmValue) {

                showMessage(
                    passwordMessage,
                    "Passwords do not match.",
                    "red"
                );

                confirmPassword.focus();

                return;
            }


            // ====================================================
            // BUTTON
            // ====================================================

            resetPasswordBtn.disabled = true;

            resetPasswordBtn.innerText =
                "Resetting Password...";


            // ====================================================
            // API REQUEST
            // ====================================================

            fetch(
                RESET_PASSWORD_API,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        email: emailValue,

                        newPassword:
                            passwordValue

                    })

                }
            )


            // ====================================================
            // RESPONSE
            // ====================================================

            .then(function (response) {

                console.log(
                    "RESET PASSWORD STATUS:",
                    response.status
                );


                return response.text()
                    .then(function (text) {

                        return {
                            status: response.status,
                            ok: response.ok,
                            text: text
                        };

                    });

            })


            // ====================================================
            // RESULT
            // ====================================================

            .then(function (result) {

                console.log(
                    "RESET PASSWORD RESPONSE:",
                    result.text
                );


                if (result.ok) {

                    showMessage(
                        passwordMessage,
                        result.text ||
                        "Password reset successfully.",
                        "green"
                    );


                    // ==================================================
                    // CLEAR PASSWORD FIELDS
                    // ==================================================

                    newPassword.value = "";

                    confirmPassword.value = "";


                    // ==================================================
                    // REDIRECT TO LOGIN
                    // ==================================================

                    setTimeout(
                        function () {

                            window.location.href =
                                "login.jsp";

                        },
                        1500
                    );

                } else {

                    showMessage(
                        passwordMessage,
                        result.text ||
                        "Unable to reset password.",
                        "red"
                    );

                }

            })


            // ====================================================
            // ERROR
            // ====================================================

            .catch(function (error) {

                console.error(
                    "RESET PASSWORD ERROR:",
                    error
                );


                showMessage(
                    passwordMessage,
                    "Unable to connect to backend.",
                    "red"
                );

            })


            // ====================================================
            // FINALLY
            // ====================================================

            .finally(function () {

                resetPasswordBtn.disabled = false;

                resetPasswordBtn.innerText =
                    "Reset Password";

            });

        }
    );


    /* ============================================================
       OTP INPUT - ONLY NUMBERS
    ============================================================ */

    otp.addEventListener(
        "input",
        function () {

            this.value =
                this.value.replace(
                    /[^0-9]/g,
                    ""
                );

        }
    );


    /* ============================================================
       HELPER FUNCTION
    ============================================================ */

    function showMessage(
        element,
        text,
        color) {

        element.innerText = text;

        element.style.color = color;
    }

});

window.onload = function () {
    initPasswordToggles();
};

/* ==========================================
   PASSWORD VISIBILITY TOGGLE HELPER
   ========================================== */

function initPasswordToggles() {
    var toggleButtons = document.querySelectorAll(".password-toggle-btn");
    toggleButtons.forEach(function (btn) {
        if (btn.dataset.toggleInitialized) return;
        btn.dataset.toggleInitialized = "true";

        btn.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();

            var wrapper = btn.closest(".password-input-wrapper");
            if (!wrapper) return;

            var input = wrapper.querySelector("input");
            var icon = btn.querySelector("i");
            if (!input) return;

            if (input.type === "password") {
                input.type = "text";
                if (icon) {
                    icon.classList.remove("fa-eye-slash");
                    icon.classList.add("fa-eye");
                }
                btn.setAttribute("aria-label", "Hide password");
                btn.title = "Hide password";
            } else {
                input.type = "password";
                if (icon) {
                    icon.classList.remove("fa-eye");
                    icon.classList.add("fa-eye-slash");
                }
                btn.setAttribute("aria-label", "Show password");
                btn.title = "Show password";
            }
        });
    });
}