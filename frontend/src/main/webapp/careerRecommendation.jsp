<%@ page language="java"
    contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<%
    request.setAttribute("activePage", "careerRecommendation");

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

    <title>PathFinder | Career Recommendation</title>

    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">

    <link
        rel="stylesheet"
        href="${pageContext.request.contextPath}/CSS/userDashboard.css?v=20260907_7">

    <link
        rel="stylesheet"
        href="${pageContext.request.contextPath}/CSS/careerRecommendation.css?v=20260907_12">

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
        #careerContent.hidden-state {
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
    <script src="${pageContext.request.contextPath}/JS/config.js?v=20260907_7"></script>

</head>


<body>


<div class="app-layout">


    <!-- =====================================================
         SIDEBAR
    ====================================================== -->

    <jsp:include page="common/usersidebar.jsp">
        <jsp:param name="activePage" value="career"/>
    </jsp:include>


    <!-- =====================================================
         MAIN WRAPPER
    ====================================================== -->

    <div class="main-wrapper">


        <!-- TOPBAR -->

        <jsp:include page="common/userTopbar.jsp"/>


        <!-- =================================================
             PAGE
        ================================================== -->

        <main class="career-page">

            <!-- =================================================
                 PAGE HEADER
            ================================================== -->

            <section class="career-page-header">

                <div>

                    <span class="page-label">
                        CAREER INTELLIGENCE
                    </span>

                    <h1>
                        Your Career Recommendation
                    </h1>

                    <p>
                        Based on your career profile and assessment
                        performance, PathFinder identifies career
                        opportunities that match your strengths.
                    </p>

                </div>


                <div
                    id="recommendationStatus"
                    class="recommendation-status"
                    style="display: none;">

                    <i class="fa-solid fa-circle-check"></i>

                    Analysis Completed

                </div>

            </section>


            <!-- =================================================
                 1. LOADING STATE
            ================================================== -->

            <div id="careerLoading" class="results-state-card results-loading">

                <div class="state-icon-circle blue-spinner">
                    <i class="fa-solid fa-spinner fa-spin"></i>
                </div>

                <h3>Analysing Your Career Profile</h3>

                <p>
                    Please wait while PathFinder analyses your
                    assessment performance, technical skills, and strengths...
                </p>

            </div>


            <!-- =================================================
                 2. EMPTY STATE (NO ASSESSMENT COMPLETED YET)
            ================================================== -->

            <div id="careerNoResults" class="results-state-card no-results-card hidden-state" style="display: none !important;">

                <div class="state-icon-circle empty-circle">
                    <i class="fa-solid fa-compass"></i>
                </div>

                <h2>Complete Assessment to Unlock Recommendations</h2>

                <p>
                    Personalized career recommendations are generated based on your assessment performance.
                    Once you complete your assigned assessment, our intelligence system will analyze your strengths
                    and recommend ideal career roles tailored to your profile.
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

            <div id="careerError" class="results-state-card results-error hidden-state" style="display: none !important;">

                <div class="state-icon-circle error-circle">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                </div>

                <h3 id="careerErrorTitle">Unable to Load Recommendations</h3>

                <p id="careerErrorMessage">
                    Something went wrong while retrieving your career recommendations.
                </p>

                <div class="state-actions">

                    <button type="button" id="retryRecommendationBtn" class="btn-primary-action">
                        <i class="fa-solid fa-rotate-right"></i> Try Again
                    </button>

                    <a href="${pageContext.request.contextPath}/userDashboard.jsp" class="btn-secondary-action">
                        <i class="fa-solid fa-house"></i> Back to Dashboard
                    </a>

                </div>

            </div>


            <!-- =================================================
                 4. ACTUAL CONTENT (SHOWN ONLY WHEN DATA EXISTS)
            ================================================== -->

            <div id="careerContent" class="hidden-state" style="display: none !important;">



                <!-- =================================================
                     TOP CAREER MATCH
                ================================================== -->

                <section class="top-career-card">


                    <div class="career-main-content">


                        <div
                            id="careerMainIcon"
                            class="career-main-icon">

                            <i class="fa-solid fa-code"></i>

                        </div>


                        <div class="career-main-info">

                            <span class="recommendation-label">
                                TOP CAREER MATCH
                            </span>


                            <h2 id="recommendedCareer">
                                Career Compatibility
                            </h2>


                            <p id="careerDescription">
                                Your assessment performance is being
                                analysed to identify suitable career
                                opportunities.
                            </p>


                            <div class="career-tags">


                                <span id="careerCategoryTag">

                                    <i class="fa-solid fa-laptop-code"></i>

                                    Career Opportunity

                                </span>


                                <span id="careerEducationTag">

                                    <i class="fa-solid fa-graduation-cap"></i>

                                    Skill Based Match

                                </span>


                            </div>

                        </div>

                    </div>



                    <!-- MATCH SCORE -->

                    <div class="match-score">


                        <div
                            id="scoreCircle"
                            class="score-circle">

                            <div>

                                <strong id="matchPercentage">
                                    0%
                                </strong>

                                <span>
                                    Match
                                </span>

                            </div>

                        </div>


                        <small id="matchLevel">
                            Calculating Match
                        </small>

                    </div>


                </section>



                <!-- =================================================
                     WHY CAREER MATCH
                ================================================== -->

                <section class="career-card">


                    <div class="career-card-header">

                        <div>

                            <span class="small-label">
                                RECOMMENDATION INSIGHT
                            </span>

                            <h2>
                                Why this career matches you
                            </h2>

                        </div>


                        <div class="header-icon blue">

                            <i class="fa-solid fa-wand-magic-sparkles"></i>

                        </div>

                    </div>



                    <div class="match-reasons">


                        <!-- TECHNICAL -->

                        <div class="reason-item">

                            <div class="reason-icon green">

                                <i class="fa-solid fa-code"></i>

                            </div>


                            <div>

                                <h3>
                                    Strong Technical Skills
                                </h3>

                                <p id="technicalReason">
                                    Your technical assessment performance
                                    is being analysed.
                                </p>

                            </div>


                            <strong
                                id="technicalScore"
                                class="reason-score">
                                0%
                            </strong>

                        </div>



                        <!-- LOGICAL -->

                        <div class="reason-item">

                            <div class="reason-icon purple">

                                <i class="fa-solid fa-brain"></i>

                            </div>


                            <div>

                                <h3>
                                    Logical Reasoning
                                </h3>

                                <p id="logicalReason">
                                    Your logical reasoning performance
                                    is being analysed.
                                </p>

                            </div>


                            <strong
                                id="logicalScore"
                                class="reason-score">
                                0%
                            </strong>

                        </div>



                        <!-- APTITUDE -->

                        <div class="reason-item">

                            <div class="reason-icon blue">

                                <i class="fa-solid fa-graduation-cap"></i>

                            </div>


                            <div>

                                <h3>
                                    Aptitude Performance
                                </h3>

                                <p id="aptitudeReason">
                                    Your aptitude performance
                                    is being analysed.
                                </p>

                            </div>


                            <strong
                                id="aptitudeScore"
                                class="reason-score">
                                0%
                            </strong>

                        </div>



                        <!-- COMMUNICATION -->

                        <div class="reason-item">

                            <div class="reason-icon orange">

                                <i class="fa-solid fa-comments"></i>

                            </div>


                            <div>

                                <h3>
                                    Communication Skills
                                </h3>

                                <p id="communicationReason">
                                    Your communication performance
                                    is being analysed.
                                </p>

                            </div>


                            <strong
                                id="communicationScore"
                                class="reason-score">
                                0%
                            </strong>

                        </div>


                    </div>

                </section>



                <!-- =================================================
                     PERFORMANCE + STRENGTHS
                ================================================== -->

                <div class="career-two-column">


                    <!-- PERFORMANCE -->

                    <section class="career-card">


                        <div class="career-card-header">

                            <div>

                                <span class="small-label">
                                    PERFORMANCE
                                </span>

                                <h2>
                                    Your Skill Profile
                                </h2>

                            </div>


                            <div class="header-icon purple">

                                <i class="fa-solid fa-chart-column"></i>

                            </div>

                        </div>



                        <div class="skill-list">


                            <!-- APTITUDE -->

                            <div class="skill-row">

                                <div class="skill-title">

                                    <span>
                                        Aptitude
                                    </span>

                                    <strong id="aptitudePercentage">
                                        0%
                                    </strong>

                                </div>


                                <div class="skill-progress">

                                    <div
                                        id="aptitudeProgress"
                                        class="skill-progress-bar blue"
                                        style="width:0%;">
                                    </div>

                                </div>

                            </div>



                            <!-- LOGICAL -->

                            <div class="skill-row">

                                <div class="skill-title">

                                    <span>
                                        Logical Reasoning
                                    </span>

                                    <strong id="logicalPercentage">
                                        0%
                                    </strong>

                                </div>


                                <div class="skill-progress">

                                    <div
                                        id="logicalProgress"
                                        class="skill-progress-bar purple"
                                        style="width:0%;">
                                    </div>

                                </div>

                            </div>



                            <!-- TECHNICAL -->

                            <div class="skill-row">

                                <div class="skill-title">

                                    <span>
                                        Technical Skills
                                    </span>

                                    <strong id="technicalPercentage">
                                        0%
                                    </strong>

                                </div>


                                <div class="skill-progress">

                                    <div
                                        id="technicalProgress"
                                        class="skill-progress-bar green"
                                        style="width:0%;">
                                    </div>

                                </div>

                            </div>



                            <!-- COMMUNICATION -->

                            <div class="skill-row">

                                <div class="skill-title">

                                    <span>
                                        Communication
                                    </span>

                                    <strong id="communicationPercentage">
                                        0%
                                    </strong>

                                </div>


                                <div class="skill-progress">

                                    <div
                                        id="communicationProgress"
                                        class="skill-progress-bar orange"
                                        style="width:0%;">
                                    </div>

                                </div>

                            </div>


                        </div>

                    </section>



                    <!-- STRENGTHS -->

                    <section class="career-card">


                        <div class="career-card-header">

                            <div>

                                <span class="small-label">
                                    AI STRENGTH ANALYSIS
                                </span>

                                <h2>
                                    Your Strengths
                                </h2>

                            </div>


                            <div class="header-icon green">

                                <i class="fa-solid fa-bolt"></i>

                            </div>

                        </div>


                        <div
                            id="strengthList"
                            class="strength-list">

                        </div>


                    </section>


                </div>



                <!-- =================================================
                     SKILL GAP
                ================================================== -->

                <section class="career-card skill-gap-card">


                    <div class="career-card-header">

                        <div>

                            <span class="small-label">
                                CAREER READINESS
                            </span>

                            <h2>
                                Skill Gap Analysis
                            </h2>

                            <p>
                                Skills that can improve your readiness
                                for your recommended career.
                            </p>

                        </div>


                        <div class="header-icon orange">

                            <i class="fa-solid fa-bullseye"></i>

                        </div>

                    </div>



                    <div class="skill-gap-grid">


                        <!-- CURRENT -->

                        <div class="gap-box current-skills">

                            <h3>

                                <i class="fa-solid fa-circle-check"></i>

                                Your Current Skills

                            </h3>


                            <div
                                id="currentSkills"
                                class="skill-tags">

                            </div>

                        </div>



                        <!-- IMPROVE -->

                        <div class="gap-box improve-skills">

                            <h3>

                                <i class="fa-solid fa-arrow-trend-up"></i>

                                Skills to Improve

                            </h3>


                            <div
                                id="improveSkills"
                                class="skill-tags">

                            </div>

                        </div>


                    </div>


                </section>



                <!-- =================================================
                     ALTERNATIVE CAREERS
                ================================================== -->

                <section class="career-card">


                    <div class="career-card-header">

                        <div>

                            <span class="small-label">
                                OTHER OPPORTUNITIES
                            </span>

                            <h2>
                                Alternative Career Matches
                            </h2>

                        </div>


                        <div class="header-icon blue">

                            <i class="fa-solid fa-layer-group"></i>

                        </div>

                    </div>



                    <div
                        id="alternativeCareers"
                        class="alternative-careers">

                    </div>


                </section>



                <!-- =================================================
                     ACTION
                ================================================== -->

                <section class="career-action-card">


                    <div class="action-icon">

                        <i class="fa-solid fa-route"></i>

                    </div>


                    <div class="action-content">

                        <span>
                            NEXT STEP
                        </span>

                        <h2>
                            Build Your Career Roadmap
                        </h2>

                        <p>
                            Follow a personalized learning path to
                            develop the skills required for your
                            recommended career.
                        </p>

                    </div>


                    <div class="action-buttons">


                        <a
                            href="${pageContext.request.contextPath}/userResults.jsp"
                            class="secondary-action">

                            <i class="fa-solid fa-arrow-left"></i>

                            View Results

                        </a>


                        <a
                            href="${pageContext.request.contextPath}/learningRoadmap.jsp"
                            class="primary-action">

                            View Learning Roadmap

                            <i class="fa-solid fa-arrow-right"></i>

                        </a>


                    </div>


                </section>


            </div>

        </main>

    </div>

</div>


<script src="${pageContext.request.contextPath}/JS/config.js?v=20260907_12"></script>
<script src="${pageContext.request.contextPath}/JS/careerRecommendation.js?v=20260907_12"></script>

</body>

</html>