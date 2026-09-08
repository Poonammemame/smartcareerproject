console.log("ADMIN LOGIN JS LOADED");

document.addEventListener("DOMContentLoaded", function () {

    initPasswordToggles();

    const form =
        document.getElementById("adminLoginForm");

    const email =
        document.getElementById("email");

    const password =
        document.getElementById("password");


    console.log("FORM:", form);
    console.log("EMAIL:", email);
    console.log("PASSWORD:", password);


    form.addEventListener("submit", function (event) {

        event.preventDefault();

        console.log("ADMIN LOGIN SUBMITTED");


        const emailValue =
            email.value.trim();

        const passwordValue =
            password.value;


        let adminLoginUrl =
            (typeof API_ENDPOINTS !== "undefined" && API_ENDPOINTS.ADMIN)
                ? API_ENDPOINTS.ADMIN.LOGIN
                : ((typeof getApiBaseUrl === "function") 
                    ? (getApiBaseUrl() + "/admin/login") 
                    : "http://localhost:8090/api/admin/login");

        if (typeof window !== "undefined" && window.location && window.location.hostname && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
            adminLoginUrl = adminLoginUrl.replace(/:\d+/, "");
        }

        fetch(
            adminLoginUrl,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    email: emailValue,
                    password: passwordValue
                })
            }
        )

        .then(function (response) {

            console.log(
                "LOGIN STATUS:",
                response.status
            );

            return response.json();
        })

        .then(function (data) {

            console.log(
                "ADMIN LOGIN RESPONSE:",
                data
            );


            if (!data.token) {

                alert(
                    data.message ||
                    "Login failed"
                );

                return;
            }


            // SAVE JWT
            localStorage.setItem(
                "token",
                data.token
            );


            localStorage.setItem(
                "adminId",
                data.adminId
            );


            localStorage.setItem(
                "name",
                data.name
            );


            localStorage.setItem(
                "email",
                data.email
            );


            localStorage.setItem(
                "role",
                data.role
            );


            localStorage.setItem(
                "status",
                data.status
            );


            localStorage.setItem(
                "admin",
                JSON.stringify(data)
            );


            console.log(
                "TOKEN SAVED:",
                localStorage.getItem("token")
            );


            console.log(
                "ROLE:",
                localStorage.getItem("role")
            );


            // REDIRECT
            window.location.href =
                "adminDashboard.jsp";

        })

        .catch(function (error) {

            console.error(
                "Admin login error:",
                error
            );

            alert(
                "Unable to connect to server."
            );
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