<%@ page language="java"
    contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<header class="admin-topbar">

    <!-- LEFT SIDE -->
    <div class="topbar-left">

        <button
            type="button"
            class="sidebar-toggle"
            id="sidebarToggle"
            aria-label="Toggle sidebar">

            <i class="fa-solid fa-bars"></i>

        </button>

        <div class="breadcrumb">

            <span>PathFinder</span>

            <i class="fa-solid fa-chevron-right"></i>

            <strong>Admin Dashboard</strong>

        </div>

    </div>


    <!-- RIGHT SIDE -->
    <div class="topbar-right">

        <!-- NOTIFICATION -->
        <button
            type="button"
            class="topbar-icon"
            id="notificationBtn"
            title="Notifications"
            aria-label="Notifications">

            <i class="fa-regular fa-bell"></i>

            <span
                class="notification-badge"
                id="notificationBadge">
                0
            </span>

        </button>


        <!-- DIVIDER -->
        <div class="topbar-divider"></div>


        <!-- ADMIN MENU -->
        <div class="admin-user-menu">

            <!-- ADMIN BUTTON -->
            <button
                type="button"
                class="topbar-admin-profile"
                id="adminMenuBtn"
                aria-expanded="false"
                aria-haspopup="true">

                <!-- AVATAR -->
                <div class="topbar-avatar">

                    <i class="fa-solid fa-user-shield"></i>

                </div>


                <!-- ADMIN INFORMATION -->
                <div class="topbar-admin-info">

                    <strong id="adminName">
                        Administrator
                    </strong>

                    <span>
                        Admin
                    </span>

                </div>


                <!-- ARROW -->
                <i class="fa-solid fa-chevron-down profile-arrow"></i>

            </button>


            <!-- ADMIN DROPDOWN -->
            <div
                class="admin-user-dropdown"
                id="adminUserDropdown">

                

                

                <!-- DIVIDER -->
                <div class="dropdown-divider"></div>


                <!-- LOGOUT -->
                <a
                    href="javascript:void(0)"
                    class="admin-logout-dropdown"
                    id="adminLogoutBtn"
                    onclick="adminLogout('${pageContext.request.contextPath}/adminLogin.jsp')">

                    <i class="fa-solid fa-right-from-bracket"></i>

                    <span>
                        Logout
                    </span>

                </a>

            </div>

        </div>

    </div>

</header>