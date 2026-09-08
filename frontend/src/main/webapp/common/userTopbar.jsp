<%@ page language="java"
    contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!-- =====================================================
     USER TOPBAR
===================================================== -->

<header class="topbar">

    <!-- LEFT SIDE -->
    <div class="topbar-left">

        <button
            type="button"
            class="sidebar-toggle"
            id="sidebarToggle"
            aria-label="Toggle sidebar">

            <i class="fa-solid fa-bars"></i>

        </button>


        <div class="topbar-page-info">

            <span class="topbar-small">
                PATHFINDER
            </span>

            <span
                class="topbar-title"
                id="topbarPageTitle">

                Student Portal

            </span>

        </div>

    </div>


    <!-- RIGHT SIDE -->
    <div class="topbar-right">


        <!-- =================================================
             NOTIFICATION
        ================================================== -->

        <div class="notification-wrapper">

            <button
                type="button"
                class="notification-btn"
                id="notificationBtn"
                title="Notifications"
                aria-label="Notifications">

                <i class="fa-regular fa-bell"></i>

                <span
                    class="notification-count"
                    id="notificationCount"
                    style="display:none;">

                    0

                </span>

            </button>


            <div
                class="notification-dropdown"
                id="notificationDropdown">

                <div class="notification-header">

                    <div>

                        <strong>
                            Notifications
                        </strong>

                        <span id="notificationHeaderCount">
                            0 new
                        </span>

                    </div>


                    <button
                        type="button"
                        id="markNotificationsRead">

                        Mark all read

                    </button>

                </div>


                <div
                    class="notification-list"
                    id="notificationList">

                    <div class="notification-empty">

                        <i class="fa-regular fa-bell-slash"></i>

                        <p>
                            No new notifications
                        </p>

                    </div>

                </div>

            </div>

        </div>


        <!-- DIVIDER -->

        <div class="topbar-divider"></div>


        <!-- =================================================
             USER MENU
        ================================================== -->

        <div class="user-menu">


            <button
                type="button"
                class="topbar-user"
                id="userMenuBtn"
                title="User Menu">

                <!-- AVATAR -->

                <div
                    class="topbar-avatar"
                    id="topbarAvatar">

                    U

                </div>


                <!-- USER INFORMATION -->

                <div class="topbar-user-info">

                    <strong id="topbarUserName">
                        User
                    </strong>

                    <span>
                        Student
                    </span>

                </div>


                <i class="fa-solid fa-chevron-down user-arrow"></i>

            </button>


            <!-- =================================================
                 USER DROPDOWN
            ================================================== -->

            <div
                class="user-dropdown"
                id="userDropdown">


                <a
                    href="${pageContext.request.contextPath}/profile.jsp">

                    <i class="fa-solid fa-user"></i>

                    <span>
                        My Profile
                    </span>

                </a>


                <a
                    href="${pageContext.request.contextPath}/userSettings.jsp">

                    <i class="fa-solid fa-gear"></i>

                    <span>
                        Settings
                    </span>

                </a>


                <div class="dropdown-divider"></div>


                <!-- ================= LOGOUT ================= -->

                <a
                    href="login.jsp"
                    class="logout-dropdown"
                    id="logoutBtn">

                    <i class="fa-solid fa-right-from-bracket"></i>

                    <span>
                        Logout
                    </span>

                </a>


            </div>

        </div>

    </div>

</header>


<!-- =====================================================
     NOTIFICATION JAVASCRIPT
===================================================== -->

<script src="${pageContext.request.contextPath}/JS/config.js"></script>
<script src="${pageContext.request.contextPath}/JS/userNotification.js?v=1"></script>


<!-- =====================================================
     USER TOPBAR JAVASCRIPT
===================================================== -->

<script>

document.addEventListener("DOMContentLoaded", function () {

    console.log("======================================");
    console.log("USER TOPBAR JS LOADED");
    console.log("======================================");


    /* =====================================================
       GET ELEMENTS
    ===================================================== */

    const userMenuBtn =
        document.getElementById("userMenuBtn");

    const userDropdown =
        document.getElementById("userDropdown");

    const logoutBtn =
        document.getElementById("logoutBtn");


    /* =====================================================
       LOAD USER NAME FROM LOCAL STORAGE & API SYNC
    ===================================================== */

    var userName = localStorage.getItem("name");
    const topbarUserName = document.getElementById("topbarUserName");
    const topbarAvatar = document.getElementById("topbarAvatar");
    const welcomeUserName = document.getElementById("welcomeUserName");

    function applyUserName(name) {
        if (!name || name.trim() === "") return;
        if (topbarUserName) topbarUserName.textContent = name.trim();
        if (topbarAvatar) topbarAvatar.textContent = name.trim().charAt(0).toUpperCase();
        if (welcomeUserName) welcomeUserName.textContent = name.trim();
    }

    if (userName && userName.trim() !== "") {
        applyUserName(userName);
    }

    // Auto-fetch fresh user info from backend /settings/my
    const token = localStorage.getItem("token");
    if (token) {
        var settingsMyUrl = (typeof API_ENDPOINTS !== "undefined" && API_ENDPOINTS.SETTINGS)
            ? API_ENDPOINTS.SETTINGS.MY
            : ((typeof getApiBaseUrl === "function" ? getApiBaseUrl() : "http://localhost:8090/api") + "/settings/my");

        fetch(settingsMyUrl, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
        })
        .then(function(res) {
            if (res.ok) return res.json();
        })
        .then(function(data) {
            if (data && data.name) {
                localStorage.setItem("name", data.name);
                if (data.email) localStorage.setItem("email", data.email);
                if (data.userId) localStorage.setItem("userId", data.userId);
                applyUserName(data.name);
            }
        })
        .catch(function(e) {
            console.warn("User info sync:", e);
        });
    }


    /* =====================================================
       USER DROPDOWN
    ===================================================== */

    if (userMenuBtn && userDropdown) {

        userMenuBtn.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                userDropdown.classList.toggle(
                    "show"
                );

            }
        );

    }


    /* =====================================================
       CLOSE DROPDOWN WHEN CLICK OUTSIDE
    ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            if (
                userDropdown &&
                userMenuBtn &&
                !userMenuBtn.contains(event.target) &&
                !userDropdown.contains(event.target)
            ) {

                userDropdown.classList.remove(
                    "show"
                );

            }

        }
    );


    /* =====================================================
       LOGOUT
    ===================================================== */

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                console.log("Logout clicked");


                /*
                 * REMOVE ALL LOGIN DATA
                 */

                localStorage.removeItem("token");

                localStorage.removeItem("userId");

                localStorage.removeItem("name");

                localStorage.removeItem("email");

                localStorage.removeItem("role");

                localStorage.removeItem("status");


                /*
                 * Optional:
                 * Clear any dashboard/session data
                 */

                localStorage.removeItem("assessment");

                localStorage.removeItem("assessmentResult");

                localStorage.removeItem("recommendation");


                console.log(
                    "LOCAL STORAGE CLEARED"
                );


                /*
                 * REDIRECT TO LOGIN
                 */

                window.location.href =
                    "${pageContext.request.contextPath}/login.jsp";

            }
        );

    } else {

        console.error(
            "logoutBtn not found"
        );

    }

});

</script>