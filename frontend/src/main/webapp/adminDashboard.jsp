<%@ page language="java"
    contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>PathFinder | Admin Dashboard</title>


    <!-- =====================================================
         FONT AWESOME
    ====================================================== -->

    <link rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">


    <!-- =====================================================
         ADMIN DASHBOARD CSS
    ====================================================== -->

    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/CSS/adminDashboard.css">

    <!-- =====================================================
         CONFIG JS
    ====================================================== -->
    <script src="${pageContext.request.contextPath}/JS/config.js"></script>

</head>


<body>


<!-- =========================================================
     ADMIN SIDEBAR
========================================================= -->

<jsp:include page="common/adminSidebar.jsp">

    <jsp:param name="activePage"
               value="dashboard"/>

</jsp:include>



<!-- =========================================================
     MAIN WRAPPER
========================================================= -->

<div class="admin-main-wrapper">


    <!-- =====================================================
         ADMIN TOPBAR
    ====================================================== -->

    <jsp:include page="common/adminTopbar.jsp"/>



    <!-- =====================================================
         MAIN CONTENT
    ====================================================== -->

    <main class="admin-dashboard-content">


        <!-- =================================================
             PAGE HEADER
        ================================================== -->

        <section class="dashboard-header">

            <div>

                <span class="dashboard-label">
                    ADMIN PANEL
                </span>

                <h1>
                    Dashboard
                </h1>

                <p>
                    Monitor and manage the PathFinder
                    career assessment system.
                </p>

            </div>


            <!-- CURRENT DATE -->

            <div class="dashboard-date">

                <i class="fa-solid fa-calendar-days"></i>

                <span id="currentDate">
                    Loading...
                </span>

            </div>

        </section>



        <!-- =================================================
             STATISTICS CARDS
        ================================================== -->

        <section class="stats-grid">


            <!-- =================================================
                 TOTAL USERS
            ================================================== -->

            <div class="stat-card blue">

                <div class="stat-icon">

                    <i class="fa-solid fa-users"></i>

                </div>

                <div class="stat-info">

                    <span>
                        Total Users
                    </span>

                    <h2 id="totalUsers">
                        0
                    </h2>

                    <small>
                        Registered users
                    </small>

                </div>

            </div>



            <!-- =================================================
                 ACTIVE USERS
            ================================================== -->

            <div class="stat-card green">

                <div class="stat-icon">

                    <i class="fa-solid fa-user-check"></i>

                </div>

                <div class="stat-info">

                    <span>
                        Active Users
                    </span>

                    <h2 id="activeUsers">
                        0
                    </h2>

                    <small>
                        Currently active
                    </small>

                </div>

            </div>



            <!-- =================================================
                 COMPLETED PROFILES
            ================================================== -->

            <div class="stat-card purple">

                <div class="stat-icon">

                    <i class="fa-solid fa-id-card"></i>

                </div>

                <div class="stat-info">

                    <span>
                        Completed Profiles
                    </span>

                    <h2 id="completedProfiles">
                        0
                    </h2>

                    <small>
                        Submitted profiles
                    </small>

                </div>

            </div>






          


        </section>



        <!-- =================================================
             MIDDLE SECTION
        ================================================== -->

        <section class="dashboard-grid">


           


            <!-- =================================================
                 QUICK ACTIONS
            ================================================== -->

            <div class="dashboard-card quick-card">


                <div class="card-header">

                    <div>

                        <h2>
                            Quick Actions
                        </h2>

                        <p>
                            Frequently used admin actions
                        </p>

                    </div>


                    <div class="header-icon">

                        <i class="fa-solid fa-bolt"></i>

                    </div>

                </div>



                <!-- QUICK ACTIONS -->

                <div class="quick-actions">


                    <!-- MANAGE USERS -->

                    <a href="${pageContext.request.contextPath}/manageUsers.jsp"
                       class="quick-action">

                        <span class="quick-icon blue-icon">

                            <i class="fa-solid fa-users"></i>

                        </span>

                        <span>
                            Manage Users
                        </span>

                        <i class="fa-solid fa-chevron-right"></i>

                    </a>



                    <!-- MANAGE QUESTIONS -->

                    <a href="${pageContext.request.contextPath}/manageQuestions.jsp"
                       class="quick-action">

                        <span class="quick-icon purple-icon">

                            <i class="fa-solid fa-circle-question"></i>

                        </span>

                        <span>
                            Manage Questions
                        </span>

                        <i class="fa-solid fa-chevron-right"></i>

                    </a>



                   

                    <!-- VIEW RESULTS -->

                    <a href="${pageContext.request.contextPath}/manageResults.jsp"
                       class="quick-action">

                        <span class="quick-icon green-icon">

                            <i class="fa-solid fa-chart-column"></i>

                        </span>

                        <span>
                            View Results
                        </span>

                        <i class="fa-solid fa-chevron-right"></i>

                    </a>


                </div>

            </div>


        </section>



        <!-- =================================================
             RECENT USERS
        ================================================== -->

        <section class="dashboard-card recent-users-card">


            <!-- HEADER -->

            <div class="card-header">

                <div>

                    <h2>
                        Recent Users
                    </h2>

                    <p>
                        Recently registered users
                    </p>

                </div>


                <a href="${pageContext.request.contextPath}/manageUsers.jsp"
                   class="view-all">

                    View All

                    <i class="fa-solid fa-arrow-right"></i>

                </a>

            </div>



            <!-- TABLE -->

            <div class="table-wrapper">

                <table class="users-table">


                    <thead>

                        <tr>

                            <th>
                                User
                            </th>

                            <th>
                                Email
                            </th>

                            <th>
                                Account Status
                            </th>

                           
                        </tr>

                    </thead>



                    <tbody id="recentUsersTable">

                        <tr>

                            <td colspan="5"
                                class="loading-row">

                                <i class="fa-solid fa-spinner fa-spin"></i>

                                Loading users...

                            </td>

                        </tr>

                    </tbody>


                </table>

            </div>


        </section>



     


    </main>

</div>



<!-- =========================================================
     JAVASCRIPT
========================================================= -->

<script src="${pageContext.request.contextPath}/JS/config.js"></script>
<script src="${pageContext.request.contextPath}/JS/adminDashboard.js"></script>


</body>

</html>