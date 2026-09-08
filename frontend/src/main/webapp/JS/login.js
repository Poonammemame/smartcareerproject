console.log("LOGIN JS LOADED");

document.addEventListener("DOMContentLoaded", function () {
    initPasswordToggles();
});

window.onload = function () {
    initPasswordToggles();

    const form =
        document.getElementById("loginForm");


    if (form === null) {

        console.error("loginForm not found");

        return;
    }


    console.log("loginForm found");


    form.addEventListener("submit", function (event) {

        event.preventDefault();

        console.log("Login form submitted");


        // ==========================================
        // GET VALUES
        // ==========================================

        const email =
            document.getElementById("email")
                .value.trim();

        const password =
            document.getElementById("password")
                .value.trim();


        const message =
            document.getElementById("message");

        const loginBtn =
            document.getElementById("loginBtn");


        // ==========================================
        // VALIDATION
        // ==========================================

        if (email === "") {

            message.innerText =
                "Email is required.";

            message.style.color = "red";

            return;
        }


        if (password === "") {

            message.innerText =
                "Password is required.";

            message.style.color = "red";

            return;
        }


        // ==========================================
        // BUTTON
        // ==========================================

        loginBtn.disabled = true;

        loginBtn.innerText =
            "Logging in...";


        // ==========================================
        // LOGIN API
        // ==========================================

        const loginUrl =
            (typeof API_ENDPOINTS !== "undefined" && API_ENDPOINTS.AUTH)
                ? API_ENDPOINTS.AUTH.LOGIN
                : "http://localhost:8090/api/auth/login";

        fetch(loginUrl, {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json"

            },

            body: JSON.stringify({

                email: email,

                password: password

            })

        })


        // ==========================================
        // RESPONSE
        // ==========================================

        .then(function (response) {
            console.log("LOGIN STATUS:", response.status);
            return response.text().then(function (text) {
                var data = {};
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    if (response.status === 404) {
                        data = { message: "Backend API is not running or not found (HTTP 404: /api/auth/login)." };
                    } else if (response.status === 500) {
                        data = { message: "Internal server error (HTTP 500)." };
                    } else {
                        data = { message: "An unexpected error occurred (HTTP " + response.status + ")." };
                    }
                }
                return { ok: response.ok, status: response.status, data: data };
            });
        })

        // ==========================================
        // LOGIN RESULT
        // ==========================================
        .then(function (result) {
            var data = result.data;
            console.log("LOGIN RESPONSE:", data);

            // ==========================================
            // SUCCESS
            // ==========================================
            if (result.ok && data && data.token) {
                // ==========================================
                // SAVE USER DATA
                // ==========================================
                localStorage.setItem("userId", data.userId);
                localStorage.setItem("name", data.name);
                localStorage.setItem("email", data.email);
                localStorage.setItem("role", data.role);
                localStorage.setItem("status", data.status);
                localStorage.setItem("token", data.token);

                console.log("JWT TOKEN SAVED");
                console.log("USER ID:", data.userId);
                console.log("NAME:", data.name);
                console.log("EMAIL:", data.email);

                message.innerText = "Login successful.";
                message.style.color = "green";

                // ==========================================
                // REDIRECT
                // ==========================================
                setTimeout(function () {
                    window.location.href = "userDashboard.jsp";
                }, 800);
            }
            // ==========================================
            // LOGIN FAILED
            // ==========================================
            else {
                message.innerText = (data && data.message)
                    ? data.message
                    : "Invalid email or password.";
                message.style.color = "red";
            }
        })

        // ==========================================
        // CONNECTION ERROR
        // ==========================================
        .catch(function (error) {
            console.error("LOGIN FETCH ERROR:", error);
            message.innerText = "Unable to connect to backend server.";
            message.style.color = "red";
        })


        // ==========================================
        // FINALLY
        // ==========================================

        .finally(function () {

            loginBtn.disabled = false;

            loginBtn.innerText =
                "Login to PathFinder";

        });

    });

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