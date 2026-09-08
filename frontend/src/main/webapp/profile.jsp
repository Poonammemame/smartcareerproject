<%@ page language="java"
    contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>PathFinder | Career Profile</title>

    <!-- Font Awesome -->
    <link rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">

    <!-- Dashboard CSS -->
    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/CSS/userDashboard.css">

    <!-- Profile CSS -->
    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/CSS/profile.css">

    <!-- Config JS -->
    <script src="${pageContext.request.contextPath}/JS/config.js"></script>

</head>


<body>


<!-- =====================================================
     SIDEBAR
====================================================== -->

<jsp:include page="common/usersidebar.jsp">
    <jsp:param name="activePage" value="profile"/>
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

    <main class="profile-content">


        <!-- =================================================
             PAGE HEADER
        ================================================== -->

        <div class="page-header">

            <div>

                <span class="page-label">
                    CAREER PROFILE
                </span>

                <h1>
                    Build Your Career Profile
                </h1>

                <p>
                    Tell PathFinder about your education, skills,
                    interests and career goals to get better
                    career recommendations.
                </p>

            </div>


            <div class="profile-status">

                <i class="fa-solid fa-compass"></i>

                <span>
                    Career Intelligence
                </span>

            </div>

        </div>


        <!-- =================================================
             EDUCATION INFORMATION
        ================================================== -->

        <section class="profile-card">


            <div class="card-header">

                <div class="card-icon blue">

                    <i class="fa-solid fa-graduation-cap"></i>

                </div>

                <div>

                    <h2>
                        Education
                    </h2>

                    <p>
                        Add your academic background.
                    </p>

                </div>

            </div>


            <div class="form-grid">


                <!-- EDUCATION -->

                <div class="form-group">

                    <label for="education">
                        Education
                    </label>

                    <div class="input-wrapper">

                        <i class="fa-solid fa-book"></i>

                        <input
                            type="text"
                            id="education"
                            placeholder="e.g. B.E. Computer Engineering">

                    </div>

                </div>


                <!-- COLLEGE -->

                <div class="form-group">

                    <label for="college">
                        College / University
                    </label>

                    <div class="input-wrapper">

                        <i class="fa-solid fa-building-columns"></i>

                        <input
                            type="text"
                            id="college"
                            placeholder="Enter college or university">

                    </div>

                </div>


                <!-- GRADUATION YEAR -->

                <div class="form-group">

                    <label for="graduationYear">
                        Graduation Year
                    </label>

                    <div class="input-wrapper">

                        <i class="fa-solid fa-calendar"></i>

                        <input
                            type="number"
                            id="graduationYear"
                            placeholder="e.g. 2025"
                            min="1990"
                            max="2100">

                    </div>

                </div>


                <!-- EXPERIENCE -->

                <div class="form-group">

                    <label for="experienceLevel">
                        Experience Level
                    </label>

                    <div class="input-wrapper">

                        <i class="fa-solid fa-briefcase"></i>

                        <select id="experienceLevel">

                            <option value="">
                                Select experience level
                            </option>

                            <option value="Fresher">
                                Fresher
                            </option>

                            <option value="Intern">
                                Intern
                            </option>

                            <option value="0-1 Years">
                                0 - 1 Years
                            </option>

                            <option value="1-3 Years">
                                1 - 3 Years
                            </option>

                            <option value="3-5 Years">
                                3 - 5 Years
                            </option>

                            <option value="5+ Years">
                                5+ Years
                            </option>

                        </select>

                    </div>

                </div>

            </div>

        </section>


        <!-- =================================================
             SKILLS & INTERESTS
        ================================================== -->

        <section class="profile-card">


            <div class="card-header">

                <div class="card-icon purple">

                    <i class="fa-solid fa-code"></i>

                </div>

                <div>

                    <h2>
                        Skills & Interests
                    </h2>

                    <p>
                        These details help PathFinder identify
                        suitable career paths.
                    </p>

                </div>

            </div>


            <div class="form-grid">


                <!-- TECHNICAL SKILLS -->

                <div class="form-group full-width">

                    <label for="technicalSkills">
                        Technical Skills
                    </label>

                    <div class="textarea-wrapper">

                        <i class="fa-solid fa-code"></i>

                        <textarea
                            id="technicalSkills"
                            rows="4"
                            placeholder="Example: Java, Spring Boot, SQL, HTML, CSS, JavaScript"></textarea>

                    </div>

                    <small>
                        Enter your important technical skills separated
                        by commas.
                    </small>

                </div>


                <!-- INTERESTS -->

                <div class="form-group full-width">

                    <label for="interests">
                        Areas of Interest
                    </label>

                    <div class="textarea-wrapper">

                        <i class="fa-solid fa-heart"></i>

                        <textarea
                            id="interests"
                            rows="4"
                            placeholder="Example: Web Development, Software Development, Data Science"></textarea>

                    </div>

                    <small>
                        Mention the technology or career areas
                        you are interested in.
                    </small>

                </div>


            </div>


            <!-- PROFILE MESSAGE -->

            <div id="profileMessage"
                 class="profile-message">
            </div>


            <!-- BUTTONS -->

            <div class="form-actions">


                <button
                    type="button"
                    class="btn btn-secondary"
                    id="resetProfileBtn">

                    <i class="fa-solid fa-rotate-left"></i>

                    Reset

                </button>


                <button
                    type="button"
                    class="btn btn-primary"
                    id="saveProfileBtn">

                    <i class="fa-solid fa-floppy-disk"></i>

                    Save Profile

                </button>


            </div>

        </section>




    </main>

</div>


<!-- =====================================================
     JAVASCRIPT
====================================================== -->
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="${pageContext.request.contextPath}/JS/config.js"></script>
<script src="${pageContext.request.contextPath}/JS/profile.js"></script>

</body>

</html>