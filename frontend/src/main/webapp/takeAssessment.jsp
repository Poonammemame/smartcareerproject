<%@ page language="java"
    contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<%
    request.setAttribute("activePage", "assessment");

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

    <title>PathFinder | Take Assessment</title>

    <!-- Bootstrap -->
    <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet">

    <!-- Font Awesome -->
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">

    <!-- Existing Dashboard CSS -->
    <link
        rel="stylesheet"
        href="${pageContext.request.contextPath}/CSS/userDashboard.css">

    <!-- Assessment CSS -->
    <link
        rel="stylesheet"
        href="${pageContext.request.contextPath}/CSS/takeAssessment.css">

    <!-- SweetAlert -->
    <script
        src="https://cdn.jsdelivr.net/npm/sweetalert2@11">
    </script>

    <!-- Config JS -->
    <script src="${pageContext.request.contextPath}/JS/config.js"></script>

</head>


<body>


<!-- =====================================================
     MAIN APPLICATION
====================================================== -->

<div class="pf-layout">


    <!-- =================================================
         SIDEBAR
    ================================================== -->

   <jsp:include page="common/usersidebar.jsp">
    <jsp:param name="activePage" value="assessment"/>
</jsp:include>


    <!-- =================================================
         RIGHT SIDE
    ================================================== -->

    <div class="pf-main">


        <!-- TOPBAR -->

        <header class="pf-topbar">

            <jsp:include page="common/userTopbar.jsp"/>

        </header>


        <!-- =================================================
             PAGE CONTENT
        ================================================== -->

        <main class="assessment-page">


            <!-- =================================================
                 PAGE HEADER
            ================================================== -->

            <section class="assessment-page-header">

                <div>

                    <span class="page-eyebrow">
                        CAREER ASSESSMENT
                    </span>

                    <h1>
                        Online Career Assessment
                    </h1>

                    <p>
                        Evaluate your aptitude, logical reasoning,
                        communication and technical skills to discover
                        suitable career opportunities.
                    </p>

                </div>


               <div id="assignmentBadge" class="assignment-badge">
    <i class="fa-solid fa-circle-check"></i>
    Checking Assessment...
</div>
            </section>


            <!-- =================================================
                 CANDIDATE INFORMATION
            ================================================== -->

            <section class="assessment-card candidate-card">

                <div class="section-heading">

                    <div class="heading-icon blue">

                        <i class="fa-solid fa-user-graduate"></i>

                    </div>

                    <div>

                        <h2>
                            Candidate Information
                        </h2>

                        <p>
                            Confirm your information before starting.
                        </p>

                    </div>

                </div>


                <div class="candidate-grid">


                    <div class="field-box">

                        <label>
                            Candidate Name
                        </label>

                        <div class="input-box">

                            <i class="fa-solid fa-user"></i>

                            <input
                                type="text"
                                id="candidateName"
                                value="<%= userName %>"
                                readonly>

                        </div>

                    </div>


                    <div class="field-box">

                        <label>
                            Assessment Type
                        </label>

                        <div class="input-box">

                            <i class="fa-solid fa-file-circle-check"></i>

                            <input
                                type="text"
                                value="Career Skill Assessment"
                                readonly>

                        </div>

                    </div>


                </div>

            </section>



            <!-- =================================================
                 SUMMARY CARDS
            ================================================== -->

            <section class="summary-grid">


                <div class="summary-card">

                    <div class="summary-icon blue">

                        <i class="fa-solid fa-clock"></i>

                    </div>

                    <div>

                        <strong>40</strong>

                        <span>Minutes</span>

                    </div>

                </div>



                <div class="summary-card">

                    <div class="summary-icon green">

                        <i class="fa-solid fa-list-check"></i>

                    </div>

                    <div>

                        <strong>40</strong>

                        <span>Total Questions</span>

                    </div>

                </div>



                <div class="summary-card">

                    <div class="summary-icon orange">

                        <i class="fa-solid fa-star"></i>

                    </div>

                    <div>

                        <strong>40</strong>

                        <span>Total Marks</span>

                    </div>

                </div>



                <div class="summary-card">

                    <div class="summary-icon purple">

                        <i class="fa-solid fa-layer-group"></i>

                    </div>

                    <div>

                        <strong>4</strong>

                        <span>Sections</span>

                    </div>

                </div>


            </section>



            <!-- =================================================
                 INSTRUCTIONS
            ================================================== -->

            <section
                id="instructionSection"
                class="assessment-card instruction-card">


                <div class="section-heading">

                    <div class="heading-icon purple">

                        <i class="fa-solid fa-circle-info"></i>

                    </div>

                    <div>

                        <h2>
                            Assessment Instructions
                        </h2>

                        <p>
                            Please read the instructions carefully
                            before starting the assessment.
                        </p>

                    </div>

                </div>



                <div class="instruction-grid">


                    <!-- SECTIONS -->

                    <div class="instruction-box">

                        <h3>

                            <i class="fa-solid fa-layer-group"></i>

                            Assessment Sections

                        </h3>


                        <div class="section-list">


                            <div class="assessment-section">

                                <div class="section-small-icon blue">

                                    <i class="fa-solid fa-calculator"></i>

                                </div>

                                <div>

                                    <strong>Aptitude</strong>

                                    <span>10 Questions</span>

                                </div>

                            </div>



                            <div class="assessment-section">

                                <div class="section-small-icon purple">

                                    <i class="fa-solid fa-brain"></i>

                                </div>

                                <div>

                                    <strong>Logical Reasoning</strong>

                                    <span>10 Questions</span>

                                </div>

                            </div>



                            <div class="assessment-section">

                                <div class="section-small-icon orange">

                                    <i class="fa-solid fa-comments"></i>

                                </div>

                                <div>

                                    <strong>Communication</strong>

                                    <span>10 Questions</span>

                                </div>

                            </div>



                            <div class="assessment-section">

                                <div class="section-small-icon green">

                                    <i class="fa-solid fa-code"></i>

                                </div>

                                <div>

                                    <strong>Technical Skills</strong>

                                    <span>10 Questions</span>

                                </div>

                            </div>


                        </div>

                    </div>



                    <!-- RULES -->

                    <div class="instruction-box rules-box">

                        <h3>

                            <i class="fa-solid fa-shield-halved"></i>

                            Important Rules

                        </h3>


                        <ul>


                            <li>

                                <i class="fa-solid fa-check"></i>

                                Assessment duration:
                                <strong>40 minutes</strong>

                            </li>


                            <li>

                                <i class="fa-solid fa-check"></i>

                                Total questions:
                                <strong>40</strong>

                            </li>


                            <li>

                                <i class="fa-solid fa-check"></i>

                                Each question carries
                                <strong>1 mark</strong>

                            </li>


                            <li>

                                <i class="fa-solid fa-check"></i>

                                There is
                                <strong>no negative marking</strong>

                            </li>


                            <li>

                                <i class="fa-solid fa-check"></i>

                                Timer starts after clicking
                                <strong>Start Assessment</strong>

                            </li>


                            <li>

                                <i class="fa-solid fa-check"></i>

                                You can move between questions
                                using Previous and Next

                            </li>


                            <li>

                                <i class="fa-solid fa-check"></i>

                                Assessment automatically submits
                                when time expires

                            </li>


                            <li>

                                <i class="fa-solid fa-check"></i>

                                Do not refresh or close the browser
                                during the assessment

                            </li>


                        </ul>

                    </div>


                </div>



                <!-- AGREEMENT -->

                <div class="agreement">

                    <input
                        type="checkbox"
                        id="agreeCheck">

                    <label for="agreeCheck">

                        I have read and agree to all assessment
                        instructions.

                    </label>

                </div>



                <!-- START -->

                <div class="start-area">

                    <button
                        type="button"
                        id="startBtn"
                        class="start-btn"
                        disabled>

                        <i class="fa-solid fa-play"></i>

                        Start Assessment

                    </button>

                    <p>
                        Make sure you are ready before starting.
                    </p>

                </div>


            </section>



            <!-- =================================================
                 QUESTION SECTION
            ================================================== -->

            <section
                id="assessmentSection"
                class="assessment-card question-card"
                style="display:none;">


                <!-- TOP BAR -->

                <div class="question-topbar">


                    <div class="question-info">

                        <span>
                            QUESTION
                        </span>

                        <h3>

                            <span id="currentQuestion">
                                1
                            </span>

                            /

                            <span id="totalQuestion">
                                40
                            </span>

                        </h3>

                       

                    </div>



                    <div class="progress-area">

                        <div class="progress">

                            <div
                                id="questionProgress"
                                class="progress-bar"
                                style="width:0%;">
                            </div>

                        </div>

                        <span id="progressText">
                            0% Completed
                        </span>

                    </div>



                    <div class="timer-area">

                        <span>
                            TIME LEFT
                        </span>

                        <div class="timer-box">

                            <i class="fa-solid fa-clock"></i>

                            <strong id="timer">
                                40:00
                            </strong>

                        </div>

                    </div>


                </div>



                <!-- QUESTION -->

                <form id="assessmentForm">


                    <div id="questionContainer">

                    </div>



                    <!-- NAVIGATION -->

                    <div class="question-navigation">

                        <button
                            type="button"
                            id="prevBtn"
                            class="navigation-btn previous-btn">

                            <i class="fa-solid fa-arrow-left"></i>

                            Previous

                        </button>


                        <button
                            type="button"
                            id="nextBtn"
                            class="navigation-btn next-btn">

                            Next

                            <i class="fa-solid fa-arrow-right"></i>

                        </button>

                    </div>



                    <!-- SUBMIT -->

                    <div
                        id="submitContainer"
                        class="submit-area"
                        style="display:none;">

                        <button
                            type="submit"
                            id="submitBtn"
                            class="submit-btn">

                            <i class="fa-solid fa-paper-plane"></i>

                            Submit Assessment

                        </button>

                    </div>


                </form>


            </section>


        </main>

    </div>

</div>



<!-- =====================================================
     JAVASCRIPT
====================================================== -->

<script src="${pageContext.request.contextPath}/JS/config.js?v=20260907_10"></script>
<script src="${pageContext.request.contextPath}/JS/takeAssessment.js?v=20260907_10"></script>


<script>

document.addEventListener("DOMContentLoaded", function () {

    const candidateName =
        document.getElementById("candidateName");

    const storedName =
        localStorage.getItem("name");

    if (storedName && candidateName) {

        candidateName.value = storedName;

    }

});

</script>


</body>

</html>