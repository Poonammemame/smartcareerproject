<%@ page language="java"
    contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>PathFinder | Manage Users</title>


    <!-- Font Awesome -->

    <link rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">


    <!-- Admin Dashboard CSS -->

    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/CSS/adminDashboard.css">


    <!-- Manage Users CSS -->

    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/CSS/manageUsers.css">

    <!-- Config JS -->
    <script src="${pageContext.request.contextPath}/JS/config.js"></script>

</head>


<body>


    <!-- =====================================================
         SIDEBAR
    ====================================================== -->

    <jsp:include page="common/adminSidebar.jsp">

        <jsp:param name="activePage"
                   value="users"/>

    </jsp:include>



    <!-- =====================================================
         MAIN WRAPPER
    ====================================================== -->

    <div class="admin-main-wrapper">


        <!-- =================================================
             TOPBAR
        ================================================== -->

        <jsp:include page="common/adminTopbar.jsp"/>



        <!-- =================================================
             MAIN CONTENT
        ================================================== -->

        <main class="manage-users-content">


            <!-- =================================================
                 PAGE HEADER
            ================================================== -->

            <div class="page-header">

                <div>

                    <span class="page-label">
                        USER MANAGEMENT
                    </span>

                    <h1>
                        Manage Users
                    </h1>

                    <p>
                        View and manage registered PathFinder users.
                    </p>

                </div>


                <div class="header-icon">

                    <i class="fa-solid fa-users"></i>

                </div>

            </div>



            <!-- =================================================
                 STATISTICS
            ================================================== -->

            <div class="user-stats">


                <!-- TOTAL -->

                <div class="stat-card">

                    <div class="stat-icon blue">

                        <i class="fa-solid fa-users"></i>

                    </div>

                    <div class="stat-info">

                        <span>
                            Total Users
                        </span>

                        <h2 id="totalUsers">
                            0
                        </h2>

                    </div>

                </div>



                <!-- ACTIVE -->

                <div class="stat-card">

                    <div class="stat-icon green">

                        <i class="fa-solid fa-user-check"></i>

                    </div>

                    <div class="stat-info">

                        <span>
                            Active Users
                        </span>

                        <h2 id="activeUsers">
                            0
                        </h2>

                    </div>

                </div>



                <!-- INACTIVE -->

                <div class="stat-card">

                    <div class="stat-icon orange">

                        <i class="fa-solid fa-user-clock"></i>

                    </div>

                    <div class="stat-info">

                        <span>
                            Inactive Users
                        </span>

                        <h2 id="inactiveUsers">
                            0
                        </h2>

                    </div>

                </div>



      

            </div>



            <!-- =================================================
                 USERS CARD
            ================================================== -->

            <section class="users-card">


                <!-- CARD HEADER -->

                <div class="users-card-header">

                    <div>

                        <h2>
                            Registered Users
                        </h2>

                        <p>
                            Manage user accounts and account status.
                        </p>

                    </div>


                    <!-- SEARCH -->

                    <div class="user-search">

                        <i class="fa-solid fa-magnifying-glass"></i>

                        <input
                            type="text"
                            id="searchUser"
                            placeholder="Search name or email...">

                    </div>

                </div>



                <!-- =================================================
                     FILTER
                ================================================== -->

                <div class="user-filters">

                    <button
                        type="button"
                        class="filter-btn active"
                        data-filter="ALL">

                        All Users

                    </button>


                    <button
                        type="button"
                        class="filter-btn"
                        data-filter="ACTIVE">

                        Active

                    </button>


                    <button
                        type="button"
                        class="filter-btn"
                        data-filter="INACTIVE">

                        Inactive

                    </button>

                </div>



                <!-- =================================================
                     TABLE
                ================================================== -->

                <div class="table-container">

                    <table class="users-table">

                        <thead>

                            <tr>

                                <th>
                                    #
                                </th>

                                <th>
                                    User
                                </th>

                                <th>
                                    Email
                                </th>

                                <th>
                                    Role
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Registered
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody id="usersTableBody">

                            <tr id="loadingRow">

                                <td colspan="7">

                                    <div class="loading-state">

                                        <i class="fa-solid fa-spinner fa-spin"></i>

                                        Loading users...

                                    </div>

                                </td>

                            </tr>

                        </tbody>

                    </table>

                </div>



                <!-- =================================================
                     EMPTY
                ================================================== -->

                <div id="emptyState"
                     class="empty-state"
                     style="display:none;">

                    <div class="empty-icon">

                        <i class="fa-solid fa-users-slash"></i>

                    </div>

                    <h3>
                        No Users Found
                    </h3>

                    <p>
                        No users match your search criteria.
                    </p>

                </div>


            </section>


        </main>

    </div>



    <!-- =====================================================
         SWEET ALERT
    ====================================================== -->

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>



    <!-- =====================================================
         MANAGE USERS JS
    ====================================================== -->

    <script src="${pageContext.request.contextPath}/JS/config.js"></script>
    <script src="${pageContext.request.contextPath}/JS/manageUsers.js"></script>


</body>

</html>