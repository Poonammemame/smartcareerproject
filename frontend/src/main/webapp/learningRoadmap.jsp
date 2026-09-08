<%@ page language="java"
    contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<%
    request.setAttribute("activePage", "roadmap");

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

    <title>PathFinder | Learning Roadmap</title>


    <!-- =====================================================
         FONT AWESOME
    ====================================================== -->

    <link rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">


    <!-- =====================================================
         DASHBOARD CSS
    ====================================================== -->

    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/CSS/userDashboard.css">


    <!-- =====================================================
         ROADMAP CSS
    ====================================================== -->

    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/CSS/learningRoadmap.css?v=20260827_11">

    <!-- =====================================================
         CONFIG JS
    ====================================================== -->
    <script src="${pageContext.request.contextPath}/JS/config.js"></script>

</head>


<body>


<div class="app-layout">


    <!-- =====================================================
         SIDEBAR
    ====================================================== -->

    <jsp:include page="common/usersidebar.jsp">

        <jsp:param name="activePage"
                   value="roadmap"/>

    </jsp:include>


    <!-- =====================================================
         MAIN WRAPPER
    ====================================================== -->

    <div class="main-wrapper">


        <!-- =================================================
             TOPBAR
        ================================================== -->

        <jsp:include page="common/userTopbar.jsp"/>


        <!-- =================================================
             PAGE CONTENT
        ================================================== -->

        <main class="roadmap-page">


            <!-- =================================================
                 LOADING
            ================================================== -->

            <section id="roadmapLoading"
                     class="roadmap-loading">

                <div class="loading-spinner">
                    <i class="fa-solid fa-spinner fa-spin"></i>
                </div>

                <h3>
                    Building Your Learning Roadmap
                </h3>

                <p>
                    Analyzing your career recommendation...
                </p>

            </section>


            <!-- =================================================
                 ERROR
            ================================================== -->

            <section id="roadmapError"
                     class="roadmap-error"
                     style="display:none;">

                <div class="error-icon">

                    <i class="fa-solid fa-triangle-exclamation"></i>

                </div>

                <h3>
                    Unable to Load Roadmap
                </h3>

                <p id="roadmapErrorMessage">
                    Something went wrong.
                </p>

                <button id="retryRoadmapBtn"
                        class="complete-btn">

                    <i class="fa-solid fa-rotate"></i>

                    Try Again

                </button>

            </section>


            <!-- =================================================
                 ACTUAL ROADMAP CONTENT
            ================================================== -->

            <div id="roadmapContent"
                 style="display:none;">


                <!-- =================================================
                     PAGE HEADER
                ================================================== -->

                <section class="roadmap-header">

                    <div>

                        <span class="page-label">
                            PERSONALIZED LEARNING
                        </span>

                        <h1>
                            Your Learning Roadmap
                        </h1>

                        <p id="roadmapDescription">
                            Follow your personalized learning path
                            to build the skills required for your
                            recommended career.
                        </p>

                    </div>


                    <!-- CAREER BADGE -->

                    <div class="career-badge">

                        <i id="careerIcon"
                           class="fa-solid fa-bullseye"></i>

                        <div>

                            <span>
                                RECOMMENDED CAREER
                            </span>

                            <strong id="careerName">
                                Loading...
                            </strong>

                        </div>

                    </div>

                </section>



                <!-- =================================================
                     ROADMAP SUMMARY
                ================================================== -->

                <section class="roadmap-summary">


                    <!-- TOTAL STAGES -->

                    <div class="summary-card">

                        <div class="summary-icon blue">

                            <i class="fa-solid fa-road"></i>

                        </div>

                        <div>

                            <span>
                                Total Stages
                            </span>

                            <strong id="totalStages">
                                0
                            </strong>

                        </div>

                    </div>


                    <!-- SKILLS -->

                    <div class="summary-card">

                        <div class="summary-icon purple">

                            <i class="fa-solid fa-code"></i>

                        </div>

                        <div>

                            <span>
                                Skills to Learn
                            </span>

                            <strong id="totalSkills">
                                0
                            </strong>

                        </div>

                    </div>


                    <!-- COMPLETED -->

                    <div class="summary-card">

                        <div class="summary-icon green">

                            <i class="fa-solid fa-circle-check"></i>

                        </div>

                        <div>

                            <span>
                                Completed
                            </span>

                            <strong id="completedCount">
                                0
                            </strong>

                        </div>

                    </div>


                    <!-- PROGRESS -->

                    <div class="summary-card">

                        <div class="summary-icon orange">

                            <i class="fa-solid fa-chart-line"></i>

                        </div>

                        <div>

                            <span>
                                Progress
                            </span>

                            <strong id="overallProgress">
                                0%
                            </strong>

                        </div>

                    </div>


                </section>



                <!-- =================================================
                     OVERALL PROGRESS
                ================================================== -->

                <section class="progress-card">


                    <div class="progress-header">

                        <div>

                            <span class="small-label">
                                YOUR PROGRESS
                            </span>

                            <h2>
                                Career Preparation Progress
                            </h2>

                        </div>

                        <strong id="progressPercentage">
                            0%
                        </strong>

                    </div>


                    <div class="main-progress">

                        <div id="mainProgressBar"
                             class="main-progress-bar"
                             style="width:0%;">

                        </div>

                    </div>


                    <p id="progressMessage">
                        Complete each stage to move closer to your
                        career goal.
                    </p>

                </section>



                <!-- =================================================
                     ROADMAP
                ================================================== -->

                <section class="roadmap-card">


                    <div class="card-heading">

                        <div>

                            <span class="small-label">
                                LEARNING PATH
                            </span>

                            <h2>
                                Step-by-Step Roadmap
                            </h2>

                        </div>

                        <i class="fa-solid fa-map"></i>

                    </div>


                    <!--
                        IMPORTANT:

                        JavaScript will generate all roadmap
                        stages here according to the user's
                        recommendation.
                    -->

                    <div id="roadmapSteps">

                    </div>


                </section>



                <!-- =================================================
                     CAREER GOAL
                ================================================== -->

                <section class="career-goal-card">


                    <div class="goal-icon">

                        <i class="fa-solid fa-flag-checkered"></i>

                    </div>


                    <div class="goal-content">

                        <span>
                            YOUR CAREER GOAL
                        </span>

                        <h2 id="careerGoal">
                            Become Job Ready
                        </h2>

                        <p id="careerGoalDescription">
                            Continue following your personalized
                            roadmap and build practical skills.
                        </p>

                    </div>


                    <a href="${pageContext.request.contextPath}/careerRecommendation.jsp"
                       class="back-btn">

                        <i class="fa-solid fa-arrow-left"></i>

                        Back to Recommendation

                    </a>


                </section>


            </div>


        </main>


    </div>


</div>



<!-- =====================================================
     LEARNING RESOURCES MODAL
====================================================== -->
<div id="resourceModal" class="resource-modal-overlay" style="display:none;" onclick="handleModalBackdropClick(event)">
    <div class="resource-modal-card" onclick="event.stopPropagation()">
        <div class="resource-modal-header">
            <div>
                <span id="resourceModalStageBadge" class="modal-stage-badge">Stage 01</span>
                <h2 id="resourceModalTitle">Programming Fundamentals</h2>
            </div>
            <button type="button" class="close-modal-btn" onclick="closeResourceModal()">&times;</button>
        </div>
        <div class="resource-modal-body">
            <p id="resourceModalDesc" class="resource-modal-desc"></p>
            <div id="resourceModalSections"></div>
        </div>
        <div class="resource-modal-footer">
            <button type="button" class="modal-close-action" onclick="closeResourceModal()">Close</button>
        </div>
    </div>
</div>

<!-- =====================================================
     MILESTONE QUIZ MODAL
====================================================== -->
<div id="quizModal" class="resource-modal-overlay" style="display:none;" onclick="handleQuizBackdropClick(event)">
    <div class="resource-modal-card quiz-modal-card" onclick="event.stopPropagation()">
        <div class="resource-modal-header" style="background: linear-gradient(135deg, #7c3aed, #6366f1); color: #ffffff;">
            <div>
                <span id="quizModalStageBadge" class="modal-stage-badge" style="background: rgba(255,255,255,0.25); color: #ffffff;">Stage 01 Milestone Check</span>
                <h2 id="quizModalTitle" style="color: #ffffff;">Milestone Knowledge Quiz</h2>
            </div>
            <button type="button" class="close-modal-btn" style="color: #ffffff;" onclick="closeQuizModal()">&times;</button>
        </div>
        <div id="quizModalBody" class="resource-modal-body" style="padding: 24px;">
            <!-- Rendered by JS -->
        </div>
    </div>
</div>

<!-- =====================================================
     JAVASCRIPT
====================================================== -->

<script src="${pageContext.request.contextPath}/JS/config.js?v=20260827_11"></script>
<script src="${pageContext.request.contextPath}/JS/learningRoadmap.js?v=20260827_11"></script>


</body>

</html>