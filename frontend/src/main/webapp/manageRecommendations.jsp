<%@ page language="java"
    contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<%
    request.setAttribute("activePage", "recommendations");

    String adminName = (String) session.getAttribute("adminName");

    if (adminName == null || adminName.trim().isEmpty()) {
        adminName = "Administrator";
    }
%>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>PathFinder | View Recommendations</title>


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
         MANAGE RECOMMENDATIONS CSS
    ====================================================== -->

    <link
        rel="stylesheet"
        href="${pageContext.request.contextPath}/CSS/manageRecommendations.css?v=2.0">

    <!-- Config JS -->
    <script src="${pageContext.request.contextPath}/JS/config.js"></script>

</head>


<body>

<div class="admin-layout">


    <!-- =====================================================
         SIDEBAR
    ====================================================== -->

    <jsp:include page="common/adminSidebar.jsp">

        <jsp:param
            name="activePage"
            value="recommendations"/>

    </jsp:include>



    <!-- =====================================================
         MAIN
    ====================================================== -->

    <div class="admin-main">


        <!-- =================================================
             TOPBAR
        ================================================== -->

        <header class="admin-topbar">

            <jsp:include page="common/adminTopbar.jsp"/>

        </header>



        <!-- =================================================
             PAGE
        ================================================== -->

        <main class="manage-recommendations-page">


            <!-- =================================================
                 HEADER
            ================================================== -->

            <section class="recommendations-page-header">

                <div class="page-heading">

                    <span class="page-eyebrow">
                        CAREER INTELLIGENCE
                    </span>

                    <h1>
                       View Recommendations
                    </h1>

                    <p>
                        View and analyze career recommendations
                        generated for registered candidates.
                    </p>

                </div>


                <button
                    type="button"
                    id="refreshRecommendationsBtn"
                    class="refresh-btn">

                    <i class="fa-solid fa-rotate"></i>

                    <span>
                        Refresh Recommendations
                    </span>

                </button>

            </section>



            <!-- =================================================
                 STATISTICS
            ================================================== -->

            <section class="recommendation-statistics">


                <!-- TOTAL -->

                <div class="stat-card">

                    <div class="stat-icon blue">
                        <i class="fa-solid fa-lightbulb"></i>
                    </div>

                    <div class="stat-content">

                        <span>
                            Total Recommendations
                        </span>

                        <h3 id="totalRecommendations">
                            0
                        </h3>

                    </div>

                </div>



                <!-- EXCELLENT -->

                <div class="stat-card">

                    <div class="stat-icon green">
                        <i class="fa-solid fa-star"></i>
                    </div>

                    <div class="stat-content">

                        <span>
                            Excellent Matches
                        </span>

                        <h3 id="excellentRecommendations">
                            0
                        </h3>

                    </div>

                </div>



                <!-- GOOD -->

                <div class="stat-card">

                    <div class="stat-icon orange">
                        <i class="fa-solid fa-chart-line"></i>
                    </div>

                    <div class="stat-content">

                        <span>
                            Good Matches
                        </span>

                        <h3 id="goodRecommendations">
                            0
                        </h3>

                    </div>

                </div>



                <!-- NEEDS IMPROVEMENT -->

                <div class="stat-card">

                    <div class="stat-icon red">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                    </div>

                    <div class="stat-content">

                        <span>
                            Needs Improvement
                        </span>

                        <h3 id="needsImprovementRecommendations">
                            0
                        </h3>

                    </div>

                </div>

            </section>



            <!-- =================================================
                 FILTERS
            ================================================== -->

            <section class="filter-card">


                <!-- SEARCH -->

                <div class="search-box">

                    <i class="fa-solid fa-magnifying-glass"></i>

                    <input
                        type="text"
                        id="recommendationSearch"
                        autocomplete="off"
                        placeholder="Search candidate, email or career...">

                </div>



                <!-- MATCH -->

                <div class="filter-select">

                    <select id="matchFilter">

                        <option value="all">
                            All Recommendations
                        </option>

                        <option value="excellent">
                            Excellent Match
                        </option>

                        <option value="good">
                            Good Match
                        </option>

                        <option value="moderate">
                            Moderate Match
                        </option>

                        <option value="developing">
                            Developing Match
                        </option>

                    </select>

                </div>



                <!-- CAREER -->

                <div class="filter-select">

                    <select id="careerFilter">

                        <option value="all">
                            All Careers
                        </option>

                    </select>

                </div>



                <!-- CLEAR -->

                <button
                    type="button"
                    id="clearFiltersBtn"
                    class="clear-btn">

                    <i class="fa-solid fa-filter-circle-xmark"></i>

                    <span>
                        Clear
                    </span>

                </button>

            </section>



            <!-- =================================================
                 TABLE CARD
            ================================================== -->

            <section class="recommendations-table-card">


                <!-- TABLE HEADER -->

                <div class="table-header">

                    <div>

                        <span class="small-label">
                            CANDIDATE ANALYSIS
                        </span>

                        <h2>
                            Career Recommendations
                        </h2>

                    </div>


                    <span
                        id="recommendationCount"
                        class="recommendation-count">

                        0 Recommendations

                    </span>

                </div>



                <!-- =================================================
                     LOADING
                ================================================== -->

                <div
                    id="recommendationsLoading"
                    class="loading-state">

                    <div class="loading-spinner"></div>

                    <p>
                        Loading career recommendations...
                    </p>

                </div>



                <!-- =================================================
                     ERROR
                ================================================== -->

                <div
                    id="recommendationsError"
                    class="recommendation-error"
                    style="display:none;">

                    <div class="error-icon">

                        <i class="fa-solid fa-circle-exclamation"></i>

                    </div>

                    <h3>
                        Unable to Load Recommendations
                    </h3>

                    <p id="recommendationErrorMessage">
                        Something went wrong while loading
                        recommendations.
                    </p>

                    <button
                        type="button"
                        id="retryRecommendationsBtn"
                        class="retry-btn">

                        <i class="fa-solid fa-rotate"></i>

                        Try Again

                    </button>

                </div>



                <!-- =================================================
                     EMPTY
                ================================================== -->

                <div
                    id="recommendationsEmpty"
                    class="empty-state"
                    style="display:none;">

                    <div class="empty-icon">

                        <i class="fa-solid fa-lightbulb"></i>

                    </div>

                    <h3>
                        No Recommendations Found
                    </h3>

                    <p>
                        No career recommendations match
                        the selected filters.
                    </p>

                </div>



                <!-- =================================================
                     TABLE
                     ONLY 5 COLUMNS
                ================================================== -->

                <div
                    id="recommendationsTableWrapper"
                    class="table-wrapper"
                    style="display:none;">

                    <table class="recommendations-table">

                        <thead>

                            <tr>

                                <th class="candidate-column">
                                    CANDIDATE
                                </th>

                                <th class="career-column">
                                    RECOMMENDED CAREER
                                </th>

                                <th class="match-column">
                                    MATCH
                                </th>

                                <th class="score-column">
                                    ASSESSMENT SCORE
                                </th>

                                <th class="action-column">
                                    ACTION
                                </th>

                            </tr>

                        </thead>

                        <tbody
                            id="recommendationsTableBody">
                        </tbody>

                    </table>

                </div>

            </section>

        </main>

    </div>

</div>



<!-- =========================================================
     RECOMMENDATION DETAILS MODAL
========================================================= -->

<div
    class="modal fade"
    id="recommendationDetailsModal"
    tabindex="-1"
    aria-hidden="true">

    <div
        class="modal-dialog modal-lg modal-dialog-centered">

        <div class="modal-content recommendation-modal">


            <!-- HEADER -->

            <div class="modal-header">

                <div>

                    <span class="modal-label">
                        CAREER RECOMMENDATION
                    </span>

                    <h5
                        class="modal-title"
                        id="modalCandidateName">
                        Candidate Recommendation
                    </h5>

                </div>

                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close">
                </button>

            </div>



            <!-- BODY -->

            <div class="modal-body">


                <!-- CAREER -->

                <div class="career-modal-hero">

                    <div class="career-modal-icon">

                        <i
                            id="modalCareerIcon"
                            class="fa-solid fa-laptop-code">
                        </i>

                    </div>

                    <div class="career-modal-info">

                        <span>
                            RECOMMENDED CAREER
                        </span>

                        <h2 id="modalCareerName">
                            -
                        </h2>

                        <p id="modalCareerDescription">
                            Career recommendation based on
                            candidate assessment.
                        </p>

                    </div>

                </div>



                <!-- DETAILS -->

                <div class="detail-grid">


                    <!-- MATCH -->

                    <div class="detail-box">

                        <span>
                            MATCH PERCENTAGE
                        </span>

                        <strong id="modalMatchPercentage">
                            0%
                        </strong>

                    </div>



                    <!-- LEVEL -->

                    <div class="detail-box">

                        <span>
                            MATCH LEVEL
                        </span>

                        <strong id="modalMatchLevel">
                            -
                        </strong>

                    </div>



                    <!-- SCORE -->

                    <div class="detail-box">

                        <span>
                            ASSESSMENT SCORE
                        </span>

                        <strong id="modalAssessmentScore">
                            -
                        </strong>

                    </div>

                </div>

            </div>



            <!-- FOOTER -->

            <div class="modal-footer">

                <button
                    type="button"
                    class="modal-close-btn"
                    data-bs-dismiss="modal">

                    Close

                </button>

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
     MANAGE RECOMMENDATIONS JS
========================================================= -->

<script
    src="${pageContext.request.contextPath}/JS/config.js">
</script>
<script
    src="${pageContext.request.contextPath}/JS/manageRecommendations.js?v=2.0">
</script>


</body>

</html>