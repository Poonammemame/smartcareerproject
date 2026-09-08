<%@ page language="java"
    contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<%
    String userName = (String) session.getAttribute("userName");

    if (userName == null) {
        userName = "";
    }
%>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>PathFinder | My Results</title>

    <!-- Font Awesome -->
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">

    <!-- Dashboard CSS -->
    <link
        rel="stylesheet"
        href="${pageContext.request.contextPath}/CSS/userDashboard.css?v=20260907_6">

    <!-- Results CSS -->
    <link
        rel="stylesheet"
        href="${pageContext.request.contextPath}/CSS/userResults.css?v=20260907_12">

    <style>
        .results-state-card {
            width: 100% !important;
            max-width: 760px !important;
            min-height: 380px !important;
            margin: 30px auto 40px !important;
            padding: 50px 30px !important;
            background: #ffffff !important;
            border: 1px solid #e2e8f0 !important;
            border-radius: 20px !important;
            box-shadow: 0 10px 35px rgba(15, 23, 42, 0.06) !important;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            box-sizing: border-box !important;
        }

        .hidden-state,
        .results-state-card.hidden-state,
        #resultsContent.hidden-state {
            display: none !important;
        }

        .state-icon-circle {
            width: 80px !important;
            height: 80px !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 34px !important;
            margin: 0 auto 24px !important;
        }

        .blue-spinner {
            background: #eff6ff !important;
            color: #3157d5 !important;
        }

        .empty-circle {
            background: #eef2ff !important;
            color: #4f46e5 !important;
            border: 2px dashed #c7d2fe !important;
        }

        .error-circle {
            background: #fef2f2 !important;
            color: #ef4444 !important;
        }

        .results-state-card h2,
        .results-state-card h3 {
            margin: 0 0 12px !important;
            color: #1e293b !important;
            font-size: 26px !important;
            font-weight: 700 !important;
            line-height: 1.3 !important;
        }

        .results-state-card p {
            margin: 0 auto 30px !important;
            max-width: 560px !important;
            color: #64748b !important;
            font-size: 15px !important;
            line-height: 1.65 !important;
        }

        .state-actions {
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 16px !important;
            flex-wrap: wrap !important;
            margin: 0 auto !important;
        }

        .btn-primary-action {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 8px !important;
            padding: 13px 26px !important;
            background: #3157d5 !important;
            color: #ffffff !important;
            border: none !important;
            border-radius: 12px !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            text-decoration: none !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
            box-shadow: 0 4px 14px rgba(49, 87, 213, 0.25) !important;
        }

        .btn-primary-action:hover {
            background: #2546b8 !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 20px rgba(49, 87, 213, 0.35) !important;
        }

        .btn-secondary-action {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 8px !important;
            padding: 13px 26px !important;
            background: #f8fafc !important;
            color: #475569 !important;
            border: 1px solid #cbd5e1 !important;
            border-radius: 12px !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            text-decoration: none !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
        }

        .btn-secondary-action:hover {
            background: #f1f5f9 !important;
            color: #1e293b !important;
            border-color: #94a3b8 !important;
            transform: translateY(-1px) !important;
        }
    </style>

    <!-- Config JS -->
    <script src="${pageContext.request.contextPath}/JS/config.js?v=20260907_6"></script>

</head>

<body>

<div class="app-layout">

    <!-- =====================================================
         SIDEBAR
         RESULTS = ACTIVE PAGE
         ===================================================== -->

    <jsp:include page="common/usersidebar.jsp">
        <jsp:param name="activePage" value="results"/>
    </jsp:include>


    <!-- =====================================================
         MAIN WRAPPER
         ===================================================== -->

    <div class="main-wrapper">

        <!-- TOPBAR -->

        <jsp:include page="common/userTopbar.jsp"/>


        <!-- =================================================
             PAGE CONTENT
             ================================================= -->

        <main class="results-page">

            <!-- YOUR EXISTING RESULTS CONTENT STARTS HERE -->



            <!-- =================================================
                 PAGE HEADER
            ================================================== -->

            <div class="page-header">


                <div>

                    <span class="page-label">
                        ASSESSMENT RESULTS
                    </span>

                    <h1>
                        My Assessment Results
                    </h1>

                    <p>
                        Review your assessment performance and
                        understand your strengths.
                    </p>

                </div>


                <div class="result-status" id="headerStatusBadge" style="display: none;">

                    <i class="fa-solid fa-circle-check"></i>

                    <span>
                        Assessment Completed
                    </span>

                </div>

            </div>



            <!-- =================================================
                 1. LOADING STATE
            ================================================== -->

            <div id="resultsLoading" class="results-state-card results-loading">

                <div class="state-icon-circle blue-spinner">
                    <i class="fa-solid fa-spinner fa-spin"></i>
                </div>

                <h3>Loading Assessment Results</h3>

                <p>
                    Please wait while we retrieve your assessment performance and analysis report...
                </p>

            </div>



            <!-- =================================================
                 2. EMPTY STATE (NO ASSESSMENT COMPLETED YET)
            ================================================== -->

            <div id="noResultsContainer" class="results-state-card no-results-card hidden-state" style="display: none !important;">

                <div class="state-icon-circle empty-circle">
                    <i class="fa-solid fa-clipboard-list"></i>
                </div>

                <h2>No Assessment Results Found</h2>

                <p>
                    You have not completed an assessment yet. Once you complete your assigned assessment,
                    your detailed score, section-wise analysis, and personalized career recommendations will appear here.
                </p>

                <div class="state-actions">

                    <a href="${pageContext.request.contextPath}/takeAssessment.jsp" class="btn-primary-action">
                        <i class="fa-solid fa-play"></i> Take Assessment
                    </a>

                    <a href="${pageContext.request.contextPath}/userDashboard.jsp" class="btn-secondary-action">
                        <i class="fa-solid fa-house"></i> Back to Dashboard
                    </a>

                </div>

            </div>



            <!-- =================================================
                 3. ERROR STATE
            ================================================== -->

            <div id="resultsError" class="results-state-card results-error hidden-state" style="display: none !important;">

                <div class="state-icon-circle error-circle">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                </div>

                <h3 id="resultsErrorTitle">Unable to Load Results</h3>

                <p id="resultsErrorMessage">
                    Something went wrong while retrieving your assessment data.
                </p>

                <div class="state-actions">

                    <button type="button" class="btn-primary-action" onclick="loadUserResult()">
                        <i class="fa-solid fa-rotate-right"></i> Try Again
                    </button>

                    <a href="${pageContext.request.contextPath}/userDashboard.jsp" class="btn-secondary-action">
                        <i class="fa-solid fa-house"></i> Back to Dashboard
                    </a>

                </div>

            </div>



            <!-- =================================================
                 4. RESULTS CONTENT (SHOWN ONLY WHEN DATA EXISTS)
            ================================================== -->

            <div id="resultsContent" class="hidden-state" style="display: none !important;">



            <!-- =================================================
                 RESULT SUMMARY
            ================================================== -->

            <section class="result-summary-card">


                <!-- LEFT -->

                <div class="result-main">


                    <div class="result-icon">

                        <i class="fa-solid fa-chart-line"></i>

                    </div>


                    <div>

                        <span class="result-label">
                            OVERALL PERFORMANCE
                        </span>

                        <h2 id="overallScore">
                            -- / --
                        </h2>

                        <p id="performanceText">
                            Calculating...
                        </p>

                    </div>

                </div>



                <!-- RIGHT -->

                <div class="percentage-box">

                    <span>
                        SCORE
                    </span>

                    <strong id="percentage">
                        --%
                    </strong>

                </div>


            </section>



            <!-- =================================================
                 PERFORMANCE CARDS
            ================================================== -->

            <div class="performance-grid">


                <!-- CORRECT -->

                <div class="performance-card">

                    <div class="performance-icon green">

                        <i class="fa-solid fa-circle-check"></i>

                    </div>

                    <div>

                        <span>
                            Correct Answers
                        </span>

                        <h3 id="correctAnswers">
                            --
                        </h3>

                    </div>

                </div>



                <!-- WRONG -->

                <div class="performance-card">

                    <div class="performance-icon red">

                        <i class="fa-solid fa-circle-xmark"></i>

                    </div>

                    <div>

                        <span>
                            Wrong Answers
                        </span>

                        <h3 id="wrongAnswers">
                            --
                        </h3>

                    </div>

                </div>



                <!-- UNANSWERED -->

                <div class="performance-card">

                    <div class="performance-icon orange">

                        <i class="fa-solid fa-circle-minus"></i>

                    </div>

                    <div>

                        <span>
                            Unanswered
                        </span>

                        <h3 id="unanswered">
                            --
                        </h3>

                    </div>

                </div>



                <!-- TOTAL -->

                <div class="performance-card">

                    <div class="performance-icon purple">

                        <i class="fa-solid fa-list-check"></i>

                    </div>

                    <div>

                        <span>
                            Total Questions
                        </span>

                        <h3 id="totalQuestions">
                            --
                        </h3>

                    </div>

                </div>


            </div>



            <!-- =================================================
                 SUBJECT PERFORMANCE
            ================================================== -->

            <section class="results-card">


                <div class="results-card-header">

                    <div>

                        <span class="small-label">
                            PERFORMANCE ANALYSIS
                        </span>

                        <h2>
                            Section-wise Performance
                        </h2>

                    </div>


                    <i class="fa-solid fa-chart-column"></i>

                </div>



                <div class="subject-list">


                    <!-- APTITUDE -->

                    <div class="subject-item">

                        <div class="subject-info">

                            <div class="subject-icon blue">

                                <i class="fa-solid fa-calculator"></i>

                            </div>

                            <div>

                                <h4>
                                    Aptitude
                                </h4>

                                <span>
                                    10 Questions
                                </span>

                            </div>

                        </div>


                        <div class="subject-score">

                            <div class="subject-progress">

                                <div
                                    class="subject-progress-bar blue-bar"
                                    style="width: 80%;">
                                </div>

                            </div>

                            <strong>
                                80%
                            </strong>

                        </div>

                    </div>



                    <!-- LOGICAL -->

                    <div class="subject-item">

                        <div class="subject-info">

                            <div class="subject-icon purple">

                                <i class="fa-solid fa-brain"></i>

                            </div>

                            <div>

                                <h4>
                                    Logical Reasoning
                                </h4>

                                <span>
                                    10 Questions
                                </span>

                            </div>

                        </div>


                        <div class="subject-score">

                            <div class="subject-progress">

                                <div
                                    class="subject-progress-bar purple-bar"
                                    style="width: 70%;">
                                </div>

                            </div>

                            <strong>
                                70%
                            </strong>

                        </div>

                    </div>



                    <!-- COMMUNICATION -->

                    <div class="subject-item">

                        <div class="subject-info">

                            <div class="subject-icon orange">

                                <i class="fa-solid fa-comments"></i>

                            </div>

                            <div>

                                <h4>
                                    Communication
                                </h4>

                                <span>
                                    10 Questions
                                </span>

                            </div>

                        </div>


                        <div class="subject-score">

                            <div class="subject-progress">

                                <div
                                    class="subject-progress-bar orange-bar"
                                    style="width: 90%;">
                                </div>

                            </div>

                            <strong>
                                90%
                            </strong>

                        </div>

                    </div>



                    <!-- TECHNICAL -->

                    <div class="subject-item">

                        <div class="subject-info">

                            <div class="subject-icon green">

                                <i class="fa-solid fa-code"></i>

                            </div>

                            <div>

                                <h4>
                                    Technical Skills
                                </h4>

                                <span>
                                    10 Questions
                                </span>

                            </div>

                        </div>


                        <div class="subject-score">

                            <div class="subject-progress">

                                <div
                                    class="subject-progress-bar green-bar"
                                    style="width: 80%;">
                                </div>

                            </div>

                            <strong>
                                80%
                            </strong>

                        </div>

                    </div>


                </div>

            </section>



            <!-- =================================================
                 PERFORMANCE LEVEL
            ================================================== -->

            <section class="results-card">


                <div class="results-card-header">

                    <div>

                        <span class="small-label">
                            ASSESSMENT INSIGHT
                        </span>

                        <h2>
                            Your Performance Level
                        </h2>

                    </div>

                    <i class="fa-solid fa-gauge-high"></i>

                </div>



                <div class="performance-level">


                    <div class="level-icon">

                        <i class="fa-solid fa-star"></i>

                    </div>


                    <div class="level-content">

                        <h3 id="performanceLevel">
                            Strong Candidate
                        </h3>

                        <p id="performanceDescription">

                            Your assessment score indicates good
                            overall performance across the evaluated
                            skill areas.

                        </p>

                    </div>


                    <div class="level-badge">
                        80%
                    </div>


                </div>


            </section>



            <!-- =================================================
                 CAREER RECOMMENDATION
            ================================================== -->

            <section class="recommendation-card">


                <div class="recommendation-icon">

                    <i class="fa-solid fa-wand-magic-sparkles"></i>

                </div>


                <div class="recommendation-content">

                    <span>
                        NEXT STEP
                    </span>

                    <h2>
                        Discover Your Career Recommendation
                    </h2>

                    <p>

                        Based on your assessment performance,
                        PathFinder can analyze your skills and
                        recommend suitable career roles.

                    </p>

                </div>


                <a
                    href="${pageContext.request.contextPath}/careerRecommendation.jsp"
                    class="recommendation-btn">

                    View Recommendation

                    <i class="fa-solid fa-arrow-right"></i>

                </a>


            </section>

            </div> <!-- END resultsContent -->

        </main>

    </div>

</div>



<!-- =====================================================
     JAVASCRIPT
====================================================== -->

<script src="${pageContext.request.contextPath}/JS/config.js?v=20260907_12"></script>
<script src="${pageContext.request.contextPath}/JS/userResults.js?v=20260907_12"></script>


</body>

</html>