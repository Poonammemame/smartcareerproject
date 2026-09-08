<%@ page language="java"
    contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<%
    request.setAttribute("activePage", "results");
%>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>PathFinder | View Results</title>

    <!-- =====================================================
         BOOTSTRAP
    ====================================================== -->
    <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet">


    <!-- =====================================================
         FONT AWESOME
    ====================================================== -->
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">


    <!-- =====================================================
         ADMIN DASHBOARD CSS
    ====================================================== -->
    <link
        rel="stylesheet"
        href="${pageContext.request.contextPath}/CSS/adminDashboard.css">


    <!-- =====================================================
         MANAGE RESULTS CSS
    ====================================================== -->
    <link
        rel="stylesheet"
        href="${pageContext.request.contextPath}/CSS/manageResults.css">

    <!-- =====================================================
         CONFIG JS
    ====================================================== -->
    <script src="${pageContext.request.contextPath}/JS/config.js"></script>

</head>


<body>


<!-- =========================================================
     ADMIN APPLICATION LAYOUT
========================================================= -->

<div class="admin-layout">


    <!-- =====================================================
         ADMIN SIDEBAR
    ====================================================== -->

    <jsp:include page="common/adminSidebar.jsp">

        <jsp:param
            name="activePage"
            value="results"/>

    </jsp:include>



    <!-- =====================================================
         MAIN CONTENT AREA
    ====================================================== -->

    <div class="admin-main">


        <!-- =================================================
             TOPBAR
        ================================================== -->

        <header class="admin-topbar">

            <jsp:include page="common/adminTopbar.jsp"/>

        </header>



        <!-- =================================================
             PAGE CONTENT
        ================================================== -->

        <main class="manage-results-page">


            <!-- =================================================
                 PAGE HEADER
            ================================================== -->

            <section class="results-page-header">

                <div>

                    <span class="page-eyebrow">
                        ADMINISTRATION
                    </span>

                    <h1>
                       View Assessment Results
                    </h1>

                    <p>
                        View, monitor and analyze assessment
                        performance of registered candidates.
                    </p>

                </div>


                <div class="header-action">

                    <button
                        type="button"
                        id="refreshResultsBtn"
                        class="refresh-btn">

                        <i class="fa-solid fa-rotate"></i>

                        Refresh Results

                    </button>

                </div>

            </section>



            <!-- =================================================
                 STATISTICS
            ================================================== -->

            <section class="result-statistics">


                <!-- TOTAL RESULTS -->

                <div class="stat-card">

                    <div class="stat-icon blue">

                        <i class="fa-solid fa-file-circle-check"></i>

                    </div>

                    <div>

                        <span>
                            Total Results
                        </span>

                        <h3 id="totalResults">
                            0
                        </h3>

                    </div>

                </div>



                <!-- PASSED -->

                <div class="stat-card">

                    <div class="stat-icon green">

                        <i class="fa-solid fa-circle-check"></i>

                    </div>

                    <div>

                        <span>
                            Strong Performance
                        </span>

                        <h3 id="passedResults">
                            0
                        </h3>

                    </div>

                </div>



                <!-- AVERAGE -->

                <div class="stat-card">

                    <div class="stat-icon orange">

                        <i class="fa-solid fa-chart-line"></i>

                    </div>

                    <div>

                        <span>
                            Average Score
                        </span>

                        <h3 id="averageScore">
                            0%
                        </h3>

                    </div>

                </div>



                <!-- LOW SCORE -->

                <div class="stat-card">

                    <div class="stat-icon red">

                        <i class="fa-solid fa-triangle-exclamation"></i>

                    </div>

                    <div>

                        <span>
                            Needs Improvement
                        </span>

                        <h3 id="lowResults">
                            0
                        </h3>

                    </div>

                </div>


            </section>



            <!-- =================================================
                 FILTER / SEARCH
            ================================================== -->

            <section class="filter-card">


                <div class="search-box">

                    <i class="fa-solid fa-magnifying-glass"></i>

                    <input
                        type="text"
                        id="searchResult"
                        placeholder="Search by user ID, name or email...">

                </div>


                <div class="filter-select">

                    <select id="scoreFilter">

                        <option value="all">
                            All Results
                        </option>

                        <option value="high">
                            80% - 100%
                        </option>

                        <option value="medium">
                            60% - 79%
                        </option>

                        <option value="low">
                            Below 60%
                        </option>

                    </select>

                </div>


                <button
                    type="button"
                    id="clearFilterBtn"
                    class="clear-btn">

                    <i class="fa-solid fa-filter-circle-xmark"></i>

                    Clear

                </button>


            </section>



            <!-- =================================================
                 RESULTS TABLE
            ================================================== -->

            <section class="results-table-card">


                <div class="table-header">

                    <div>

                        <span class="small-label">
                            ASSESSMENT RECORDS
                        </span>

                        <h2>
                            Candidate Results
                        </h2>

                    </div>


                    <span
                        id="resultCount"
                        class="result-count">

                        0 Results

                    </span>

                </div>



                <!-- LOADING -->

                <div
                    id="loadingState"
                    class="loading-state">

                    <div class="spinner-border"
                         role="status">

                    </div>

                    <p>
                        Loading assessment results...
                    </p>

                </div>



                <!-- EMPTY -->

                <div
                    id="emptyState"
                    class="empty-state"
                    style="display:none;">

                    <i class="fa-solid fa-folder-open"></i>

                    <h3>
                        No Results Found
                    </h3>

                    <p>
                        No assessment results match your search.
                    </p>

                </div>



                <!-- TABLE -->

                <div
                    id="tableWrapper"
                    class="table-responsive"
                    style="display:none;">

                    <table class="results-table">

                        <thead>

                            <tr>

                                <th>
                                    #
                                </th>

                                <th>
                                    Candidate
                                </th>

                                <th>
                                    Total Questions
                                </th>

                                <th>
                                    Correct
                                </th>

                                <th>
                                    Wrong
                                </th>

                                <th>
                                    Unanswered
                                </th>

                                <th>
                                    Score
                                </th>

                                <th>
                                    Performance
                                </th>

                                <th>
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody id="resultsTableBody">

                        </tbody>

                    </table>

                </div>


            </section>


        </main>


    </div>

</div>



<!-- =========================================================
     RESULT DETAILS MODAL
========================================================= -->

<div
    class="modal fade"
    id="resultDetailsModal"
    tabindex="-1"
    aria-hidden="true">

    <div class="modal-dialog modal-dialog-centered">

        <div class="modal-content result-modal">

            <div class="modal-header">

                <div>

                    <span class="modal-label">
                        RESULT DETAILS
                    </span>

                    <h5 class="modal-title">
                        Candidate Performance
                    </h5>

                </div>

                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal">
                </button>

            </div>


            <div class="modal-body">

                <div
                    id="resultDetailsContent">
                </div>

            </div>

        </div>

    </div>

</div>



<!-- =========================================================
     BOOTSTRAP JS
========================================================= -->

<script
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js">
</script>



<!-- =========================================================
     MANAGE RESULTS JS
========================================================= -->

<script
    src="${pageContext.request.contextPath}/JS/config.js">
</script>
<script
    src="${pageContext.request.contextPath}/JS/manageResults.js">
</script>


</body>

</html>