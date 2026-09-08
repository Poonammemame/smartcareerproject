<%@ page language="java"
    contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>PathFinder | Manage Profiles</title>


    <!-- FONT AWESOME -->
    <link rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">


    <!-- ADMIN DASHBOARD CSS -->
    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/CSS/adminDashboard.css">


    <!-- MANAGE PROFILE CSS -->
    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/CSS/manageProfiles.css">

    <!-- CONFIG JS -->
    <script src="${pageContext.request.contextPath}/JS/config.js"></script>

</head>


<body>


<!-- =====================================================
     ADMIN SIDEBAR
===================================================== -->

<jsp:include page="common/adminSidebar.jsp">

    <jsp:param name="activePage"
               value="profiles"/>

</jsp:include>



<!-- =====================================================
     MAIN WRAPPER
===================================================== -->

<div class="admin-main-wrapper">


    <!-- =================================================
         ADMIN TOPBAR
    ================================================== -->

    <jsp:include page="common/adminTopbar.jsp"/>



    <!-- =================================================
         MAIN CONTENT
    ================================================== -->

    <main class="profile-management-content">


        <!-- =================================================
             PAGE HEADER
        ================================================== -->

        <section class="profile-page-header">

            <div>

                <span class="page-label">
                    ADMIN PANEL
                </span>

                <h1>
                    Manage Career Profiles
                </h1>

                <p>
                    View career profiles and assign assessments to eligible users.
                </p>

            </div>


            <div class="profile-count-box">

                <i class="fa-solid fa-id-card"></i>

                <div>

                    <span>
                        Total Profiles
                    </span>

                    <strong id="totalProfiles">
                        0
                    </strong>

                </div>

            </div>

        </section>



        <!-- =================================================
             SEARCH / FILTER
        ================================================== -->

        <section class="profile-toolbar">


            <div class="search-box">

                <i class="fa-solid fa-magnifying-glass"></i>

                <input
                    type="text"
                    id="profileSearch"
                    placeholder="Search by name or email...">

            </div>


            <button
                type="button"
                class="refresh-btn"
                id="refreshProfiles">

                <i class="fa-solid fa-rotate"></i>

                Refresh

            </button>

        </section>



        <!-- =================================================
             PROFILE TABLE
        ================================================== -->

        <section class="profile-card">


            <div class="profile-card-header">

                <div>

                    <h2>
                        Career Profiles
                    </h2>

                    <p>
                        Users who have created career profiles
                    </p>

                </div>

                <i class="fa-solid fa-users-viewfinder"></i>

            </div>



            <div class="table-wrapper">

                <table class="profiles-table">

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
                                Education
                            </th>

                            <th>
                                Skills
                            </th>

                            <th>
                                Experience
                            </th>

                            <th>
                                Career Interest
                            </th>

                            <th>
                                Assessment
                            </th>

                            <th>
                                Action
                            </th>

                        </tr>

                    </thead>


                    <tbody id="profilesTableBody">

                        <tr>

                            <td colspan="9"
                                class="loading-row">

                                <i class="fa-solid fa-spinner fa-spin"></i>

                                Loading profiles...

                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

        </section>



    </main>

</div>



<!-- =====================================================
     PROFILE DETAILS MODAL
===================================================== -->

<div id="profileModal"
     class="profile-modal">


    <div class="profile-modal-content">


        <div class="modal-header">

            <div>

                <span>
                    CAREER PROFILE
                </span>

                <h2 id="modalUserName">
                    User Profile
                </h2>

            </div>


            <button
                type="button"
                id="closeProfileModal"
                class="close-modal">

                <i class="fa-solid fa-xmark"></i>

            </button>

        </div>



        <div class="modal-body">


            <!-- EMAIL -->

            <div class="detail-item">

                <i class="fa-solid fa-envelope"></i>

                <div>

                    <small>
                        Email
                    </small>

                    <strong id="modalEmail">
                        -
                    </strong>

                </div>

            </div>



            <!-- EDUCATION -->

            <div class="detail-item">

                <i class="fa-solid fa-graduation-cap"></i>

                <div>

                    <small>
                        Education
                    </small>

                    <strong id="modalEducation">
                        -
                    </strong>

                </div>

            </div>



            <!-- SKILLS -->

            <div class="detail-item">

                <i class="fa-solid fa-code"></i>

                <div>

                    <small>
                        Skills
                    </small>

                    <strong id="modalSkills">
                        -
                    </strong>

                </div>

            </div>



            <!-- EXPERIENCE -->

            <div class="detail-item">

                <i class="fa-solid fa-briefcase"></i>

                <div>

                    <small>
                        Experience
                    </small>

                    <strong id="modalExperience">
                        -
                    </strong>

                </div>

            </div>



            <!-- CAREER INTEREST -->

            <div class="detail-item">

                <i class="fa-solid fa-compass"></i>

                <div>

                    <small>
                        Career Interest
                    </small>

                    <strong id="modalCareerInterest">
                        -
                    </strong>

                </div>

            </div>



            <!-- ASSESSMENT STATUS -->

            <div class="detail-item">

                <i class="fa-solid fa-clipboard-check"></i>

                <div>

                    <small>
                        Assessment Status
                    </small>

                    <strong id="modalAssessmentStatus">
                        NOT ASSIGNED
                    </strong>

                </div>

            </div>



            <!-- ASSIGN BUTTON -->

            <div class="modal-action">

                <button
                    type="button"
                    id="assignAssessmentBtn"
                    class="assign-assessment-btn">

                    <i class="fa-solid fa-paper-plane"></i>

                    Assign Assessment

                </button>

            </div>


        </div>

    </div>

</div>



<!-- =====================================================
     ASSIGN CONFIRMATION MODAL
===================================================== -->

<div id="assignConfirmModal"
     class="profile-modal">


    <div class="profile-modal-content assign-confirm-content">


        <div class="modal-header">

            <div>

                <span>
                    ASSESSMENT ASSIGNMENT
                </span>

                <h2>
                    Assign Assessment?
                </h2>

            </div>


            <button
                type="button"
                id="closeAssignModal"
                class="close-modal">

                <i class="fa-solid fa-xmark"></i>

            </button>

        </div>



        <div class="modal-body">


            <div class="assign-warning">

                <i class="fa-solid fa-circle-info"></i>

                <p>
                    You are about to assign the online assessment to:
                </p>

            </div>


            <div class="assign-user-info">

                <strong id="assignUserName">
                    -
                </strong>

                <span id="assignUserEmail">
                    -
                </span>

            </div>


            <p class="assign-message">

                The user will receive a notification that their
                assessment is now available.

            </p>


            <div class="confirm-actions">

                <button
                    type="button"
                    id="cancelAssignBtn"
                    class="cancel-btn">

                    Cancel

                </button>


                <button
                    type="button"
                    id="confirmAssignBtn"
                    class="confirm-assign-btn">

                    <i class="fa-solid fa-paper-plane"></i>

                    Assign Assessment

                </button>

            </div>


        </div>

    </div>

</div>



<!-- =====================================================
     SUCCESS / ERROR MESSAGE
===================================================== -->

<div id="profileMessage"
     class="profile-message">

</div>



<!-- =====================================================
     JAVASCRIPT
===================================================== -->

<script src="${pageContext.request.contextPath}/JS/config.js"></script>
<script src="${pageContext.request.contextPath}/JS/manageProfiles.js"></script>


</body>

</html>