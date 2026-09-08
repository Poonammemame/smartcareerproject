<%@ page language="java"
    contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>PathFinder | Dashboard</title>


    <!-- ================= FONT AWESOME ================= -->

    <link rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">


    <!-- ================= DASHBOARD CSS ================= -->

    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/CSS/userDashboard.css">

    <!-- ================= CONFIG JS ================= -->
    <script src="${pageContext.request.contextPath}/JS/config.js"></script>

</head>


<body>


<!-- =====================================================
     SIDEBAR
===================================================== -->

<jsp:include page="common/usersidebar.jsp">

    <jsp:param name="activePage"
               value="dashboard"/>

</jsp:include>



<!-- =====================================================
     MAIN WRAPPER
===================================================== -->

<div class="main-wrapper">


    <!-- =================================================
         TOPBAR
    ================================================== -->

    <jsp:include page="common/userTopbar.jsp"/>



    <!-- =================================================
         DASHBOARD CONTENT
    ================================================== -->

    <main class="dashboard-content">


        <!-- =================================================
             WELCOME SECTION
        ================================================== -->

        <section class="welcome-section">

            <div class="welcome-text">

                <span class="page-label">
                    STUDENT DASHBOARD
                </span>

                <h1>
                    Good Morning,
                    <span id="welcomeUserName">
                        User
                    </span>
                    
                </h1>

                <p>
                    Discover your strengths and find the right career path.
                </p>

            </div>


            <div class="assessment-status"
                 id="dashboardStatus">

                <i class="fa-solid fa-circle-check"></i>

                <span>
                    Profile Active
                </span>

            </div>

        </section>



        <!-- =================================================
             STAT CARDS
        ================================================== -->

        <section class="stats-grid">


            <!-- PROFILE -->

            <div class="stat-card">

                <div class="stat-icon blue">

                    <i class="fa-solid fa-user"></i>

                </div>

                <div class="stat-info">

                    <span>
                        Profile
                    </span>

                    <strong id="profileCompletion">
                        85%
                    </strong>

                    <small>
                        Complete
                    </small>

                </div>

            </div>



            <!-- ASSESSMENT -->

            <div class="stat-card">

                <div class="stat-icon purple">

                    <i class="fa-solid fa-clipboard-check"></i>

                </div>

                <div class="stat-info">

                    <span>
                        Assessment
                    </span>

                    <strong id="assessmentStatus">
                        Pending
                    </strong>

                    <small>
                        40 Questions
                    </small>

                </div>

            </div>



            <!-- RESULT -->

            <div class="stat-card">

                <div class="stat-icon green">

                    <i class="fa-solid fa-chart-column"></i>

                </div>

                <div class="stat-info">

                    <span>
                        My Result
                    </span>

                    <strong id="resultScore">
                        --
                    </strong>

                    <small>
                        Assessment Score
                    </small>

                </div>

            </div>



            <!-- CAREER -->

            <div class="stat-card">

                <div class="stat-icon orange">

                    <i class="fa-solid fa-compass"></i>

                </div>

                <div class="stat-info">

                    <span>
                        Career Match
                    </span>

                    <strong id="careerMatch">
                        --
                    </strong>

                    <small>
                        Recommended Career
                    </small>

                </div>

            </div>


        </section>



        <!-- =================================================
             MAIN GRID
        ================================================== -->

        <section class="dashboard-grid">


            <!-- =================================================
                 ASSESSMENT CARD
            ================================================== -->

            <div class="dashboard-card assessment-card">


                <div class="card-header">

                    <div>

                        <span class="card-label">
                            ONLINE ASSESSMENT
                        </span>

                        <h2>
                            Assessment Progress
                        </h2>

                    </div>

                    <span class="question-count"
                          id="questionCount">

                        0 / 40

                    </span>

                </div>



                <div class="assessment-content">


                    <!-- PROGRESS CIRCLE -->

                    <div class="progress-circle"
                         id="progressCircle">

                        <div class="progress-inner">

                            <strong id="progressPercent">
                                0%
                            </strong>

                            <span>
                                Completed
                            </span>

                        </div>

                    </div>



                    <!-- DETAILS -->

                    <div class="assessment-details">

                        <h3 id="assessmentTitle">
                            Assessment not attempted
                        </h3>

                        <p id="assessmentDescription">

                            Complete your online assessment to evaluate
                            your aptitude, logical reasoning, technical
                            skills and communication.

                        </p>


                        <div class="assessment-meta">

                            <div>

                                <i class="fa-regular fa-clock"></i>

                                <span>
                                    40 Minutes
                                </span>

                            </div>


                            <div>

                                <i class="fa-solid fa-list-check"></i>

                                <span>
                                    40 Questions
                                </span>

                            </div>

                        </div>


                        <a href="${pageContext.request.contextPath}/takeAssessment.jsp"
                           class="primary-btn"
                           id="startAssessmentBtn">

                            <i class="fa-solid fa-play" id="startAssessmentIcon"></i>

                            <span id="startAssessmentBtnText">Start Assessment</span>

                        </a>

                    </div>


                </div>

            </div>



            <!-- =================================================
                 CAREER INTELLIGENCE CARD
            ================================================== -->

            <div class="career-intelligence-card">


                <div class="career-card-top">

                    <div class="career-ai-icon">

                        <i class="fa-solid fa-wand-magic-sparkles"></i>

                    </div>

                    <span>
                        CAREER INTELLIGENCE
                    </span>

                </div>


                <h2>
                    Find Your Best
                    <br>
                    Career Path
                </h2>


                <p>

                    PathFinder analyzes your assessment performance,
                    skills and interests to suggest suitable career
                    opportunities.

                </p>


                <div class="career-features">

                    <div>

                        <i class="fa-solid fa-check"></i>

                        Skill Analysis

                    </div>

                    <div>

                        <i class="fa-solid fa-check"></i>

                        Career Matching

                    </div>

                    <div>

                        <i class="fa-solid fa-check"></i>

                        Personalized Insights

                    </div>

                </div>


                <a href="${pageContext.request.contextPath}/careerRecommendation.jsp"
                   class="career-btn">

                    Explore Career

                    <i class="fa-solid fa-arrow-right"></i>

                </a>


            </div>


        </section>



        <!-- =================================================
             CAREER INSIGHT
        ================================================== -->

        <section class="career-result-card">


            <div class="career-result-header">

                <div>

                    <span class="card-label">
                        YOUR CAREER INSIGHT
                    </span>

                    <h2>
                        Personalized Career Recommendation
                    </h2>

                </div>


                <div class="career-result-icon">

                    <i class="fa-solid fa-bullseye"></i>

                </div>

            </div>



            <div class="career-result-body">


                <div class="career-result-text">

                    <h3 id="recommendationTitle">
                        Complete Your Assessment
                    </h3>

                    <p id="recommendationText">

                        Your personalized career recommendation
                        will appear here after completing the
                        online assessment.

                    </p>


                    <a href="${pageContext.request.contextPath}/careerRecommendation.jsp"
                       class="outline-btn">

                        View Career Recommendation

                        <i class="fa-solid fa-arrow-right"></i>

                    </a>

                </div>


                <div class="career-match-box">

                    <span>
                        CAREER MATCH
                    </span>

                    <strong id="matchPercentage">
                        --
                    </strong>

                    <small>
                        Match Confidence
                    </small>

                </div>


            </div>


        </section>



        <!-- =================================================
             QUICK ACTIONS
        ================================================== -->

        <section class="quick-section">


            <div class="section-heading">

                <div>

                    <span class="card-label">
                        QUICK ACTIONS
                    </span>

                    <h2>
                        Continue Your Career Journey
                    </h2>

                </div>

            </div>



            <div class="quick-actions">


                <!-- PROFILE -->

                <a href="${pageContext.request.contextPath}/profile.jsp"
                   class="quick-action">

                    <div class="quick-icon blue">

                        <i class="fa-solid fa-user"></i>

                    </div>

                    <div>

                        <strong>
                            Complete Profile
                        </strong>

                        <span>
                            Update your career information
                        </span>

                    </div>

                    <i class="fa-solid fa-arrow-right arrow"></i>

                </a>



                <!-- FILL CAREER PROFILE -->

                <a href="${pageContext.request.contextPath}/profile.jsp"
                   class="quick-action">

                    <div class="quick-icon purple">

                        <i class="fa-solid fa-file-pen"></i>

                    </div>

                    <div>

                        <strong>
                           Fill Career Profile 
                        </strong>

                        <span>
                            Tell us about your career goals
                        </span>

                    </div>

                    <i class="fa-solid fa-arrow-right arrow"></i>

                </a>



                <!-- ASSESSMENT -->

                <a href="${pageContext.request.contextPath}/takeAssessment.jsp"
                   class="quick-action"
                   id="quickTakeAssessmentBtn">

                    <div class="quick-icon green">

                        <i class="fa-solid fa-clipboard-check"></i>

                    </div>

                    <div>

                        <strong>
                            Take Assessment
                        </strong>

                        <span>
                            Evaluate your skills
                        </span>

                    </div>

                    <i class="fa-solid fa-arrow-right arrow"></i>

                </a>



                <!-- RESULTS -->

                <a href="${pageContext.request.contextPath}/userResults.jsp"
                   class="quick-action">

                    <div class="quick-icon orange">

                        <i class="fa-solid fa-chart-line"></i>

                    </div>

                    <div>

                        <strong>
                            View Results
                        </strong>

                        <span>
                            Check your performance
                        </span>

                    </div>

                    <i class="fa-solid fa-arrow-right arrow"></i>

                </a>


            </div>

        </section>


    </main>

</div>



<!-- =====================================================
     JAVASCRIPT
===================================================== -->

<script src="${pageContext.request.contextPath}/JS/config.js?v=20260827_3"></script>
<script src="${pageContext.request.contextPath}/JS/userDashboard.js?v=20260827_3"></script>


</body>

</html>