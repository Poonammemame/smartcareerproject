<%@ page language="java"
    contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>PathFinder | Manage Results</title>


    <!-- FONT AWESOME -->
    <link rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">


    <!-- ADMIN DASHBOARD CSS -->
    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/CSS/adminDashboard.css">


    <!-- MANAGE ASSESSMENT CSS -->
    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/CSS/manageAssessment.css">

    <!-- CONFIG JS -->
    <script src="${pageContext.request.contextPath}/JS/config.js"></script>

</head>


<body>


<!-- =====================================================
     ADMIN SIDEBAR
===================================================== -->

<jsp:include page="common/adminSidebar.jsp">
    <jsp:param name="activePage"
               value="assessment"/>
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

    <main class="assessment-management-content">


        <!-- =================================================
             PAGE HEADER
        ================================================== -->

        <section class="assessment-page-header">

            <div>

                <span class="page-label">
                    ADMIN PANEL
                </span>

                <h1>
                    Manage Assessments
                </h1>

                <p>
                    View and monitor user assessment performance.
                </p>

            </div>


            <div class="assessment-count-box">

                <i class="fa-solid fa-file-circle-check"></i>

                <div>

                    <span>
                        Total Assessments
                    </span>

                    <strong id="totalAssessments">
                        0
                    </strong>

                </div>

            </div>

        </section>



        <!-- =================================================
             STAT CARDS
        ================================================== -->

        <section class="assessment-stats">


            <div class="assessment-stat-card">

                <div class="stat-icon">
                    <i class="fa-solid fa-users"></i>
                </div>

                <div>

                    <span>Total</span>

                    <strong id="statTotal">
                        0
                    </strong>

                </div>

            </div>



            <div class="assessment-stat-card">

                <div class="stat-icon">
                    <i class="fa-solid fa-circle-check"></i>
                </div>

                <div>

                    <span>Completed</span>

                    <strong id="statCompleted">
                        0
                    </strong>

                </div>

            </div>



            <div class="assessment-stat-card">

                <div class="stat-icon">
                    <i class="fa-solid fa-clock"></i>
                </div>

                <div>

                    <span>Pending</span>

                    <strong id="statPending">
                        0
                    </strong>

                </div>

            </div>



            <div class="assessment-stat-card">

                <div class="stat-icon">
                    <i class="fa-solid fa-chart-line"></i>
                </div>

                <div>

                    <span>Average Score</span>

                    <strong id="statAverage">
                        0%
                    </strong>

                </div>

            </div>


        </section>



        <!-- =================================================
             SEARCH / FILTER
        ================================================== -->

        <section class="assessment-toolbar">


            <div class="search-box">

                <i class="fa-solid fa-magnifying-glass"></i>

                <input
                    type="text"
                    id="assessmentSearch"
                    placeholder="Search by name or email...">

            </div>



            <div class="filter-box">

                <select id="statusFilter">

                    <option value="ALL">
                        All Status
                    </option>

                    <option value="COMPLETED">
                        Completed
                    </option>

                    <option value="PENDING">
                        Pending
                    </option>

                </select>

            </div>



            <button
                type="button"
                class="refresh-btn"
                id="refreshAssessments">

                <i class="fa-solid fa-rotate"></i>

                Refresh

            </button>


        </section>



        <!-- =================================================
             ASSESSMENT TABLE
        ================================================== -->

        <section class="assessment-card">


            <div class="assessment-card-header">

                <div>

                    <h2>
                        Assessment Records
                    </h2>

                    <p>
                        User assessment performance records
                    </p>

                </div>


                <i class="fa-solid fa-clipboard-list"></i>

            </div>



            <div class="table-wrapper">

                <table class="assessment-table">


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
                                Total
                            </th>

                            <th>
                                Correct
                            </th>

                            <th>
                                Score
                            </th>

                            <th>
                                Percentage
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                                Action
                            </th>

                        </tr>

                    </thead>



                    <tbody id="assessmentTableBody">

                        <tr>

                            <td
                                colspan="9"
                                class="loading-row">

                                <i class="fa-solid fa-spinner fa-spin"></i>

                                Loading assessments...

                            </td>

                        </tr>

                    </tbody>


                </table>

            </div>

        </section>


    </main>

</div>



<!-- =====================================================
     ASSESSMENT DETAILS MODAL
===================================================== -->

<div id="assessmentModal"
     class="assessment-modal">


    <div class="assessment-modal-content">


        <div class="modal-header">

            <div>

                <span>
                    ASSESSMENT RESULT
                </span>

                <h2 id="modalUserName">
                    User Assessment
                </h2>

            </div>


            <button
                type="button"
                id="closeAssessmentModal"
                class="close-modal">

                <i class="fa-solid fa-xmark"></i>

            </button>

        </div>



        <div class="modal-body">


            <div class="detail-grid">


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



                <div class="detail-item">

                    <i class="fa-solid fa-list-ol"></i>

                    <div>

                        <small>
                            Total Questions
                        </small>

                        <strong id="modalTotal">
                            -
                        </strong>

                    </div>

                </div>



                <div class="detail-item">

                    <i class="fa-solid fa-circle-check"></i>

                    <div>

                        <small>
                            Correct Answers
                        </small>

                        <strong id="modalCorrect">
                            -
                        </strong>

                    </div>

                </div>



                <div class="detail-item">

                    <i class="fa-solid fa-chart-simple"></i>

                    <div>

                        <small>
                            Score
                        </small>

                        <strong id="modalScore">
                            -
                        </strong>

                    </div>

                </div>



                <div class="detail-item">

                    <i class="fa-solid fa-percent"></i>

                    <div>

                        <small>
                            Percentage
                        </small>

                        <strong id="modalPercentage">
                            -
                        </strong>

                    </div>

                </div>



                <div class="detail-item">

                    <i class="fa-solid fa-circle-info"></i>

                    <div>

                        <small>
                            Status
                        </small>

                        <strong id="modalStatus">
                            -
                        </strong>

                    </div>

                </div>


            </div>

        </div>

    </div>

</div>



<!-- =====================================================
     JAVASCRIPT
===================================================== -->

<script src="${pageContext.request.contextPath}/JS/config.js"></script>
<script src="${pageContext.request.contextPath}/JS/manageAssessment.js"></script>


</body>

</html>