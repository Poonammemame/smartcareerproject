<%@ page language="java"
    contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>PathFinder | Manage Careers</title>


    <!-- =====================================================
         FONT AWESOME
    ====================================================== -->

    <link rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">


    <!-- =====================================================
         ADMIN DASHBOARD CSS
    ====================================================== -->

    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/CSS/adminDashboard.css">


    <!-- =====================================================
         MANAGE CAREER CSS
    ====================================================== -->

    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/CSS/manageCareer.css">

    <!-- =====================================================
         CONFIG JS
    ====================================================== -->
    <script src="${pageContext.request.contextPath}/JS/config.js"></script>

</head>


<body>


<!-- =====================================================
     ADMIN SIDEBAR
===================================================== -->

<jsp:include page="common/adminSidebar.jsp">

    <jsp:param name="activePage"
               value="career"/>

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

    <main class="career-management-content">


        <!-- =================================================
             PAGE HEADER
        ================================================== -->

        <section class="career-page-header">

            <div>

                <span class="page-label">
                    ADMIN PANEL
                </span>

                <h1>
                    Manage Careers
                </h1>

                <p>
                    Add, update, search and manage career categories.
                </p>

            </div>


            <div class="career-header-badge">

                <i class="fa-solid fa-briefcase"></i>

                <span>
                    Career Management
                </span>

            </div>

        </section>



        <!-- =================================================
             TWO STAT CARDS ONLY
        ================================================== -->

        <section class="career-stats">


            <!-- TOTAL CAREERS -->

            <div class="career-stat-card total-card">

                <div class="stat-icon">

                    <i class="fa-solid fa-briefcase"></i>

                </div>

                <div class="stat-content">

                    <span>
                        Total Careers
                    </span>

                    <strong id="statTotalCareers">
                        0
                    </strong>

                    <small>
                        Available career paths
                    </small>

                </div>

            </div>



            <!-- SKILL BASED -->

            <div class="career-stat-card skill-card">

                <div class="stat-icon">

                    <i class="fa-solid fa-code"></i>

                </div>

                <div class="stat-content">

                    <span>
                        Skill Based
                    </span>

                    <strong id="statSkillBased">
                        0
                    </strong>

                    <small>
                        Careers with required skills
                    </small>

                </div>

            </div>


        </section>



        <!-- =================================================
             ADD / EDIT CAREER
        ================================================== -->

        <section class="career-form-card">


            <!-- FORM HEADER -->

            <div class="career-card-header">

                <div>

                    <span class="card-label">
                        CAREER MANAGEMENT
                    </span>

                    <h2 id="careerFormTitle">
                        Add New Career
                    </h2>

                    <p id="careerFormSubtitle">
                        Create a new career category for users.
                    </p>

                </div>


                <div class="career-form-header-icon">

                    <i class="fa-solid fa-briefcase"></i>

                </div>

            </div>



            <!-- =================================================
                 CAREER FORM
            ================================================== -->

            <form id="careerForm">


                <!-- HIDDEN CAREER ID -->

                <input type="hidden"
                       id="careerId">



                <div class="career-form-grid">


                    <!-- CAREER NAME -->

                    <div class="form-group">

                        <label for="careerName">

                            Career Name

                            <span>*</span>

                        </label>

                        <div class="input-wrapper">

                            <i class="fa-solid fa-user-tie"></i>

                            <input
                                type="text"
                                id="careerName"
                                maxlength="100"
                                placeholder="Enter career name"
                                required>

                        </div>

                    </div>



                    <!-- REQUIRED SKILLS -->

                    <div class="form-group">

                        <label for="requiredSkills">

                            Required Skills

                            <span>*</span>

                        </label>

                        <div class="input-wrapper">

                            <i class="fa-solid fa-code"></i>

                            <input
                                type="text"
                                id="requiredSkills"
                                maxlength="500"
                                placeholder="Java, SQL, Spring Boot, HTML"
                                required>

                        </div>

                    </div>


                </div>



                <!-- DESCRIPTION -->

                <div class="form-group full-width">

                    <label for="careerDescription">

                        Career Description

                        <span>*</span>

                    </label>

                    <div class="textarea-wrapper">

                        <i class="fa-solid fa-align-left"></i>

                        <textarea
                            id="careerDescription"
                            rows="5"
                            maxlength="1000"
                            placeholder="Enter career description..."
                            required></textarea>

                    </div>

                </div>



                <!-- FORM ACTIONS -->

                <div class="career-form-actions">


                    <button
                        type="submit"
                        class="save-career-btn"
                        id="saveCareerBtn">

                        <i class="fa-solid fa-plus"></i>

                        <span id="saveCareerText">
                            Add Career
                        </span>

                    </button>



                    <button
                        type="button"
                        class="cancel-career-btn"
                        id="cancelCareerBtn"
                        style="display:none;">

                        <i class="fa-solid fa-xmark"></i>

                        Cancel

                    </button>


                </div>


            </form>

        </section>



        <!-- =================================================
             SEARCH / TOOLBAR
        ================================================== -->

        <section class="career-toolbar">


            <div class="career-search-box">

                <i class="fa-solid fa-magnifying-glass"></i>

                <input
                    type="text"
                    id="careerSearch"
                    placeholder="Search career by name...">

            </div>



            <button
                type="button"
                class="career-search-btn"
                id="searchCareerBtn">

                <i class="fa-solid fa-magnifying-glass"></i>

                Search

            </button>



            <button
                type="button"
                class="career-refresh-btn"
                id="refreshCareers">

                <i class="fa-solid fa-rotate"></i>

                Refresh

            </button>


        </section>



        <!-- =================================================
             CAREER TABLE
        ================================================== -->

        <section class="career-table-card">


            <!-- TABLE HEADER -->

            <div class="career-table-header">

                <div>

                    <span class="table-label">
                        CAREER DATABASE
                    </span>

                    <h2>
                        Career Records
                    </h2>

                    <p>
                        Manage all available career categories.
                    </p>

                </div>


                <div class="table-header-icon">

                    <i class="fa-solid fa-list-check"></i>

                </div>

            </div>



            <!-- TABLE -->

            <div class="career-table-wrapper">

                <table class="career-table">


                    <thead>

                        <tr>

                            <th>
                                #
                            </th>

                            <th>
                                Career
                            </th>

                            <th>
                                Description
                            </th>

                            <th>
                                Required Skills
                            </th>

                            <th>
                                Created At
                            </th>

                            <th>
                                Actions
                            </th>

                        </tr>

                    </thead>



                    <tbody id="careerTableBody">

                        <tr>

                            <td
                                colspan="6"
                                class="loading-row">

                                <i class="fa-solid fa-spinner fa-spin"></i>

                                Loading careers...

                            </td>

                        </tr>

                    </tbody>


                </table>

            </div>


        </section>


    </main>


</div>



<!-- =====================================================
     CAREER DETAILS MODAL
===================================================== -->

<div id="careerModal"
     class="career-modal">


    <div class="career-modal-content">


        <!-- MODAL HEADER -->

        <div class="career-modal-header">

            <div>

                <span>
                    CAREER DETAILS
                </span>

                <h2 id="modalCareerName">
                    Career
                </h2>

            </div>


            <button
                type="button"
                class="close-career-modal"
                id="closeCareerModal">

                <i class="fa-solid fa-xmark"></i>

            </button>

        </div>



        <!-- MODAL BODY -->

        <div class="career-modal-body">


            <!-- ID -->

            <div class="career-detail-item">

                <div class="career-detail-icon">

                    <i class="fa-solid fa-hashtag"></i>

                </div>

                <div>

                    <small>
                        Career ID
                    </small>

                    <strong id="modalCareerId">
                        -
                    </strong>

                </div>

            </div>



            <!-- DESCRIPTION -->

            <div class="career-detail-item">

                <div class="career-detail-icon">

                    <i class="fa-solid fa-align-left"></i>

                </div>

                <div>

                    <small>
                        Description
                    </small>

                    <p id="modalCareerDescription">
                        -
                    </p>

                </div>

            </div>



            <!-- SKILLS -->

            <div class="career-detail-item">

                <div class="career-detail-icon">

                    <i class="fa-solid fa-code"></i>

                </div>

                <div>

                    <small>
                        Required Skills
                    </small>

                    <p id="modalCareerSkills">
                        -
                    </p>

                </div>

            </div>



            <!-- CREATED DATE -->

            <div class="career-detail-item">

                <div class="career-detail-icon">

                    <i class="fa-solid fa-calendar"></i>

                </div>

                <div>

                    <small>
                        Created At
                    </small>

                    <strong id="modalCareerCreatedAt">
                        -
                    </strong>

                </div>

            </div>


        </div>


    </div>

</div>



<!-- =====================================================
     JAVASCRIPT
===================================================== -->

<script
    src="${pageContext.request.contextPath}/JS/config.js">
</script>
<script
    src="${pageContext.request.contextPath}/JS/manageCareer.js">
</script>


</body>

</html>