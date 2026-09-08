<%@ page contentType="text/html; charset=UTF-8" %>

<%
    String activePage = request.getParameter("activePage");

    if (activePage == null) {
        activePage = "dashboard";
    }
%>

<aside class="admin-sidebar" id="adminSidebar">

    <!-- ==========================================
         LOGO
    =========================================== -->

    <div class="admin-logo">

        <div class="logo-icon">
            <i class="fa-solid fa-compass"></i>
        </div>

        <div class="logo-text">
            <h2>PathFinder</h2>
            <span>ADMIN PANEL</span>
        </div>

    </div>


    <!-- ==========================================
         NAVIGATION
    =========================================== -->

    <nav class="admin-nav">


        <!-- ==========================================
             MAIN
        =========================================== -->

        <div class="nav-section-title">
            MAIN
        </div>


        <!-- DASHBOARD -->

        <a href="adminDashboard.jsp"
           class="admin-nav-item <%= activePage.equals("dashboard") ? "active" : "" %>">

            <i class="fa-solid fa-house"></i>

            <span>
                Dashboard
            </span>

        </a>


        <!-- MANAGE USERS -->

        <a href="manageUsers.jsp"
           class="admin-nav-item <%= activePage.equals("users") ? "active" : "" %>">

            <i class="fa-solid fa-users"></i>

            <span>
                Manage Users
            </span>

        </a>


        <!-- ==========================================
             CAREER PROFILE
        =========================================== -->

        <div class="nav-section-title">
            CAREER
        </div>


        <!-- MANAGE CAREER PROFILES -->

        <a href="manageProfiles.jsp"
           class="admin-nav-item <%= activePage.equals("profiles") ? "active" : "" %>">

            <i class="fa-solid fa-user-tie"></i>

            <span>
              Manage  Career Profiles
            </span>

        </a>


        <!-- MANAGE CAREERS -->

        <a href="manageCareer.jsp"
           class="admin-nav-item <%= activePage.equals("career") ? "active" : "" %>">

            <i class="fa-solid fa-bullseye"></i>

            <span>
                Manage Careers
            </span>

        </a>


        <!-- MANAGE LEARNING RESOURCES -->

        <a href="manageResources.jsp"
           class="admin-nav-item <%= activePage.equals("resources") ? "active" : "" %>">

            <i class="fa-solid fa-book-bookmark"></i>

            <span>
                Manage Resources
            </span>

        </a>


        <!-- ==========================================
             ASSESSMENT
        =========================================== -->

        <div class="nav-section-title">
            ASSESSMENT
        </div>


        <!-- MANAGE QUESTIONS -->

        <a href="manageQuestions.jsp"
           class="admin-nav-item <%= activePage.equals("questions") ? "active" : "" %>">

            <i class="fa-solid fa-circle-question"></i>

            <span>
                Manage Questions
            </span>

        </a>


       

      


        <!-- ==========================================
             RESULTS
        =========================================== -->

        <div class="nav-section-title">
            RESULTS
        </div>


        <!-- MANAGE RESULTS -->

        <a href="manageResults.jsp"
           class="admin-nav-item <%= activePage.equals("results") ? "active" : "" %>">

            <i class="fa-solid fa-chart-column"></i>

            <span>
                View Results
            </span>

        </a>

<!-- MANAGE RECOMMENDATIONS -->

<a href="manageRecommendations.jsp"
   class="admin-nav-item <%= activePage.equals("recommendations") ? "active" : "" %>">

    <i class="fa-solid fa-lightbulb"></i>

    <span>
       View Recommendations
    </span>

</a>
       

        

    </nav>


    <!-- ==========================================
         SIDEBAR BOTTOM
    =========================================== -->

    <div class="sidebar-bottom">


        <!-- ADMIN PROFILE -->

        <div class="admin-profile-mini">

            <div class="mini-avatar">

                <i class="fa-solid fa-user-shield"></i>

            </div>


            <div class="mini-info">

                <strong>
                    Administrator
                </strong>

                <span>
                    System Admin
                </span>

            </div>

        </div>


        <!-- LOGOUT -->
        <button type="button"
                class="logout-btn"
                id="adminSidebarLogoutBtn"
                onclick="adminLogout('${pageContext.request.contextPath}/adminLogin.jsp')">

            <i class="fa-solid fa-right-from-bracket"></i>

            <span>
                Logout
            </span>

        </button>


    </div>

</aside>