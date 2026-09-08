console.log("REGISTER JS LOADED");

document.addEventListener("DOMContentLoaded", function () {

    console.log("DOM LOADED");

    initPasswordToggles();

    var form = document.getElementById("registerForm");

    if (!form) {
        console.error("FORM NOT FOUND");
        return;
    }

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        console.log("REGISTER FORM SUBMITTED");

        var name =
            document.getElementById("name").value.trim();

        var email =
            document.getElementById("email").value.trim();

        var password =
            document.getElementById("password").value;

        var confirmPassword =
            document.getElementById("confirmPassword").value;

        var message =
            document.getElementById("message");

        var button =
            document.getElementById("registerBtn");


        // Password validation

        var passwordPattern =
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@#$%^&+=!]).{8,}$/;

        if (!passwordPattern.test(password)) {

            message.textContent =
                "Password must contain 8 characters, uppercase, lowercase, number and special character.";

            message.className =
                "message error";

            return;
        }


        // Confirm password

        if (password !== confirmPassword) {

            message.textContent =
                "Passwords do not match.";

            message.className =
                "message error";

            return;
        }


        var userData = {
            name: name,
            email: email,
            password: password
        };

        console.log("USER DATA:", userData);


        button.disabled = true;

        button.textContent =
            "Creating Account...";


        const registerUrl =
            (typeof API_ENDPOINTS !== "undefined" && API_ENDPOINTS.AUTH)
                ? API_ENDPOINTS.AUTH.REGISTER
                : "http://localhost:8090/api/auth/register";

        fetch(
            registerUrl,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(userData)
            }
        )

        .then(function (response) {

            console.log(
                "HTTP STATUS:",
                response.status
            );

            return response.text();

        })

        .then(function (data) {

            console.log(
                "SERVER RESPONSE:",
                data
            );

            if (data.toLowerCase().includes("success")) {

                message.textContent =
                    "Registration successful!";

                message.className =
                    "message success";

                document.getElementById(
                    "registerForm"
                ).reset();

                setTimeout(function () {

                    window.location.href =
                        "login.jsp";

                }, 1000);

            } else {

                message.textContent = data;

                message.className =
                    "message error";
            }

        })

        .catch(function (error) {

            console.error(
                "ERROR:",
                error
            );

            message.textContent =
                "Unable to connect to server.";

            message.className =
                "message error";

        })

        .finally(function () {

            button.disabled = false;

            button.textContent =
                "Create Account";

        });

    });

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