<%@ page language="java"
    contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>PathFinder | Manage Questions</title>


    <!-- =====================================================
         FONT AWESOME
    ====================================================== -->

    <link rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">


    <!-- =====================================================
         ADMIN DASHBOARD CSS
    ====================================================== -->

    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/CSS/adminDashboard.css">


    <!-- =====================================================
         MANAGE QUESTIONS CSS
    ====================================================== -->

    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/CSS/manageQuestions.css">


    <!-- =====================================================
         EXTRA MODAL CSS
    ====================================================== -->

    <style>

        /* =====================================================
           ACTION BUTTONS
        ===================================================== */

        .question-actions {
            display: flex;
            align-items: center;
            gap: 7px;
            white-space: nowrap;
        }

        .question-actions button {
            border: 1px solid #d9dee8;
            background: #ffffff;
            border-radius: 6px;
            padding: 7px 10px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
            transition: all 0.2s ease;
        }

        .question-actions button:hover {
            transform: translateY(-1px);
        }

        .question-actions .btn-edit {
            color: #2563eb;
            border-color: #bfdbfe;
            background: #eff6ff;
        }

        .question-actions .btn-edit:hover {
            background: #dbeafe;
        }

        .question-actions .btn-status {
            color: #d97706;
            border-color: #fde68a;
            background: #fffbeb;
        }

        .question-actions .btn-status:hover {
            background: #fef3c7;
        }

        .question-actions .btn-delete {
            color: #dc2626;
            border-color: #fecaca;
            background: #fef2f2;
        }

        .question-actions .btn-delete:hover {
            background: #fee2e2;
        }


        /* =====================================================
           QUESTION MODAL
        ===================================================== */

        .question-modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(15, 23, 42, 0.60);

            display: none;

            align-items: center;
            justify-content: center;

            z-index: 9999;

            padding: 20px;
        }

        .question-modal-overlay.show {
            display: flex;
        }


        .question-modal {
            width: 100%;
            max-width: 720px;

            max-height: 90vh;

            background: #ffffff;

            border-radius: 14px;

            box-shadow:
                0 20px 60px rgba(0, 0, 0, 0.20);

            overflow: hidden;

            animation: questionModalOpen 0.2s ease;
        }


        @keyframes questionModalOpen {

            from {
                opacity: 0;
                transform: translateY(-15px) scale(0.98);
            }

            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }

        }


        /* =====================================================
           MODAL HEADER
        ===================================================== */

        .question-modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;

            padding: 18px 22px;

            border-bottom: 1px solid #e5e7eb;
        }


        .question-modal-title {
            display: flex;
            align-items: center;
            gap: 12px;
        }


        .question-modal-title-icon {
            width: 42px;
            height: 42px;

            border-radius: 10px;

            display: flex;
            align-items: center;
            justify-content: center;

            background: #eef2ff;
            color: #4f46e5;

            font-size: 18px;
        }


        .question-modal-title h2 {
            margin: 0;

            font-size: 19px;
            color: #111827;
        }


        .question-modal-title p {
            margin: 3px 0 0;

            font-size: 12px;
            color: #6b7280;
        }


        .question-modal-close {
            width: 34px;
            height: 34px;

            border: none;
            background: #f3f4f6;

            border-radius: 8px;

            cursor: pointer;

            color: #6b7280;

            font-size: 16px;
        }


        .question-modal-close:hover {
            background: #e5e7eb;
            color: #111827;
        }


        /* =====================================================
           MODAL BODY
        ===================================================== */

        .question-modal-body {
            padding: 22px;

            max-height: calc(90vh - 145px);

            overflow-y: auto;
        }


        .question-form-group {
            margin-bottom: 16px;
        }


        .question-form-row {
            display: grid;

            grid-template-columns: 1fr 1fr;

            gap: 15px;
        }


        .question-form-group label {
            display: block;

            margin-bottom: 7px;

            font-size: 13px;

            font-weight: 600;

            color: #374151;
        }


        .question-form-group label span {
            color: #dc2626;
        }


        .question-form-group input,
        .question-form-group textarea,
        .question-form-group select {

            width: 100%;

            box-sizing: border-box;

            border: 1px solid #d1d5db;

            border-radius: 8px;

            padding: 10px 12px;

            font-family: inherit;

            font-size: 13px;

            color: #111827;

            background: #ffffff;

            outline: none;

            transition: 0.2s;
        }


        .question-form-group textarea {

            min-height: 90px;

            resize: vertical;
        }


        .question-form-group input:focus,
        .question-form-group textarea:focus,
        .question-form-group select:focus {

            border-color: #6366f1;

            box-shadow:
                0 0 0 3px rgba(99, 102, 241, 0.10);
        }


        /* =====================================================
           MODAL FOOTER
        ===================================================== */

        .question-modal-footer {

            display: flex;

            justify-content: flex-end;

            gap: 10px;

            padding: 16px 22px;

            border-top: 1px solid #e5e7eb;

            background: #f9fafb;
        }


        .modal-btn {

            border: none;

            border-radius: 8px;

            padding: 10px 18px;

            font-size: 13px;

            font-weight: 600;

            cursor: pointer;

            display: inline-flex;

            align-items: center;

            justify-content: center;

            gap: 7px;
        }


        .modal-cancel-btn {

            background: #e5e7eb;

            color: #374151;
        }


        .modal-cancel-btn:hover {

            background: #d1d5db;
        }


        .modal-save-btn {

            background: #4f46e5;

            color: #ffffff;
        }


        .modal-save-btn:hover {

            background: #4338ca;
        }


        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 700px) {

            .question-form-row {
                grid-template-columns: 1fr;
            }

            .question-actions {
                flex-wrap: wrap;
            }

            .question-modal {
                max-height: 95vh;
            }

        }

    </style>

    <!-- Config JS -->
    <script src="${pageContext.request.contextPath}/JS/config.js"></script>

</head>


<body>


    <!-- =====================================================
         ADMIN SIDEBAR
    ====================================================== -->

    <jsp:include page="common/adminSidebar.jsp">

        <jsp:param name="activePage"
                   value="questions"/>

    </jsp:include>



    <!-- =====================================================
         MAIN WRAPPER
    ====================================================== -->

    <div class="admin-main-wrapper">


        <!-- =================================================
             ADMIN TOPBAR
        ================================================== -->

        <jsp:include page="common/adminTopbar.jsp"/>



        <!-- =================================================
             MAIN CONTENT
        ================================================== -->

        <main class="manage-questions-content">


            <!-- =================================================
                 PAGE HEADER
            ================================================== -->

            <div class="page-header">

                <div>

                    <span class="page-label">
                        QUESTION MANAGEMENT
                    </span>

                    <h1>
                        Manage Questions
                    </h1>

                    <p>
                        Create, update and manage assessment questions.
                    </p>

                </div>


                <div class="header-actions">

                    <div class="header-icon">

                        <i class="fa-solid fa-circle-question"></i>

                    </div>


                    <button
                        type="button"
                        class="add-question-btn"
                        id="addQuestionBtn">

                        <i class="fa-solid fa-plus"></i>

                        Add Question

                    </button>

                </div>

            </div>



            <!-- =================================================
                 QUESTION STATISTICS
            ================================================== -->

            <div class="question-stats">


                <!-- TOTAL -->

                <div class="question-stat-card">

                    <div class="question-stat-icon blue">

                        <i class="fa-solid fa-list-check"></i>

                    </div>

                    <div class="question-stat-info">

                        <span>
                            Total Questions
                        </span>

                        <h2 id="totalQuestions">
                            0
                        </h2>

                    </div>

                </div>


                <!-- APTITUDE -->

                <div class="question-stat-card">

                    <div class="question-stat-icon green">

                        <i class="fa-solid fa-calculator"></i>

                    </div>

                    <div class="question-stat-info">

                        <span>
                            Aptitude
                        </span>

                        <h2 id="aptitudeCount">
                            0
                        </h2>

                    </div>

                </div>


                <!-- LOGICAL -->

                <div class="question-stat-card">

                    <div class="question-stat-icon purple">

                        <i class="fa-solid fa-brain"></i>

                    </div>

                    <div class="question-stat-info">

                        <span>
                            Logical Reasoning
                        </span>

                        <h2 id="logicalCount">
                            0
                        </h2>

                    </div>

                </div>


                <!-- TECHNICAL -->

                <div class="question-stat-card">

                    <div class="question-stat-icon orange">

                        <i class="fa-solid fa-code"></i>

                    </div>

                    <div class="question-stat-info">

                        <span>
                            Technical
                        </span>

                        <h2 id="technicalCount">
                            0
                        </h2>

                    </div>

                </div>


                <!-- COMMUNICATION -->

                <div class="question-stat-card">

                    <div class="question-stat-icon pink">

                        <i class="fa-solid fa-comments"></i>

                    </div>

                    <div class="question-stat-info">

                        <span>
                            Communication
                        </span>

                        <h2 id="communicationCount">
                            0
                        </h2>

                    </div>

                </div>

            </div>



            <!-- =================================================
                 QUESTIONS CARD
            ================================================== -->

            <section class="questions-card">


                <!-- CARD HEADER -->

                <div class="questions-card-header">

                    <div>

                        <h2>
                            Assessment Questions
                        </h2>

                        <p>
                            View and manage all questions used in
                            career assessments.
                        </p>

                    </div>


                    <!-- SEARCH -->

                    <div class="question-search">

                        <i class="fa-solid fa-magnifying-glass"></i>

                        <input
                            type="text"
                            id="searchQuestion"
                            placeholder="Search questions...">

                    </div>

                </div>



                <!-- =================================================
                     FILTERS
                ================================================== -->

                <div class="question-filters">


                    <select
                        id="categoryFilter"
                        class="question-filter">

                        <option value="">
                            All Categories
                        </option>

                        <option value="COMMUNICATION">
                            Communication
                        </option>

                        <option value="TECHNICAL">
                            Technical Skills
                        </option>

                        <option value="LOGICAL">
                            Logical Reasoning
                        </option>

                        <option value="APTITUDE">
                            Aptitude
                        </option>

                    </select>



                    <select
                        id="difficultyFilter"
                        class="question-filter">

                        <option value="">
                            All Difficulty
                        </option>

                        <option value="EASY">
                            Easy
                        </option>

                        <option value="MEDIUM">
                            Medium
                        </option>

                        <option value="HARD">
                            Hard
                        </option>

                    </select>



                    <select
                        id="statusFilter"
                        class="question-filter">

                        <option value="">
                            All Status
                        </option>

                        <option value="ACTIVE">
                            Active
                        </option>

                        <option value="INACTIVE">
                            Inactive
                        </option>

                    </select>

                </div>



                <!-- =================================================
                     TABLE
                ================================================== -->

                <div class="questions-table-container">

                    <table class="questions-table">

                        <thead>

                            <tr>

                                <th>#</th>

                                <th>QUESTION</th>

                                <th>CATEGORY</th>

                                <th>DIFFICULTY</th>

                                <th>CORRECT ANSWER</th>

                                <th>STATUS</th>

                                <th>ACTIONS</th>

                            </tr>

                        </thead>


                        <tbody id="questionsTableBody">

                            <tr id="loadingRow">

                                <td colspan="7">

                                    <div class="question-loading">

                                        <i class="fa-solid fa-spinner fa-spin"></i>

                                        Loading questions...

                                    </div>

                                </td>

                            </tr>

                        </tbody>

                    </table>

                </div>



                <!-- =================================================
                     EMPTY STATE
                ================================================== -->

                <div id="emptyState"
                     class="question-empty-state"
                     style="display:none;">

                    <div class="question-empty-icon">

                        <i class="fa-solid fa-circle-question"></i>

                    </div>

                    <h3>
                        No Questions Found
                    </h3>

                    <p>
                        No assessment questions match your
                        search or filter.
                    </p>

                </div>
<!-- =================================================
     PAGINATION
================================================== -->

<div id="questionPagination"
     class="question-pagination"
     style="display:none;">

    <!-- LEFT SIDE -->
    <div class="pagination-info">

        Showing
        <strong id="paginationStart">0</strong>
        -
        <strong id="paginationEnd">0</strong>
        of
        <strong id="paginationTotal">0</strong>

    </div>


    <!-- RIGHT SIDE -->
    <div class="pagination-controls">

        <button
            type="button"
            id="prevPageBtn"
            class="pagination-btn pagination-prev">

            <i class="fa-solid fa-chevron-left"></i>

            <span>Previous</span>

        </button>


        <div
            id="paginationNumbers"
            class="pagination-numbers">
        </div>


        <button
            type="button"
            id="nextPageBtn"
            class="pagination-btn pagination-next">

            <span>Next</span>

            <i class="fa-solid fa-chevron-right"></i>

        </button>

    </div>

</div>

            </section>


        </main>


    </div>



    <!-- =====================================================
         ADD / EDIT QUESTION MODAL
    ====================================================== -->

    <div
        id="questionModalOverlay"
        class="question-modal-overlay">


        <div
            class="question-modal"
            role="dialog"
            aria-modal="true">


            <!-- =================================================
                 MODAL HEADER
            ================================================== -->

            <div class="question-modal-header">

                <div class="question-modal-title">

                    <div class="question-modal-title-icon">

                        <i class="fa-solid fa-circle-question"></i>

                    </div>

                    <div>

                        <h2 id="questionModalTitle">
                            Add Question
                        </h2>

                        <p id="questionModalSubtitle">
                            Create a new assessment question.
                        </p>

                    </div>

                </div>


                <button
                    type="button"
                    class="question-modal-close"
                    id="closeQuestionModal">

                    <i class="fa-solid fa-xmark"></i>

                </button>

            </div>



            <!-- =================================================
                 MODAL BODY
            ================================================== -->

            <div class="question-modal-body">


                <!-- Hidden ID -->

                <input
                    type="hidden"
                    id="editQuestionId">



                <!-- QUESTION -->

                <div class="question-form-group">

                    <label for="modalQuestionText">

                        Question
                        <span>*</span>

                    </label>

                    <textarea
                        id="modalQuestionText"
                        placeholder="Enter question..."
                        required></textarea>

                </div>



                <!-- OPTIONS A/B -->

                <div class="question-form-row">


                    <div class="question-form-group">

                        <label for="modalOptionA">

                            Option A
                            <span>*</span>

                        </label>

                        <input
                            type="text"
                            id="modalOptionA"
                            placeholder="Enter option A"
                            required>

                    </div>


                    <div class="question-form-group">

                        <label for="modalOptionB">

                            Option B
                            <span>*</span>

                        </label>

                        <input
                            type="text"
                            id="modalOptionB"
                            placeholder="Enter option B"
                            required>

                    </div>

                </div>



                <!-- OPTIONS C/D -->

                <div class="question-form-row">


                    <div class="question-form-group">

                        <label for="modalOptionC">

                            Option C
                            <span>*</span>

                        </label>

                        <input
                            type="text"
                            id="modalOptionC"
                            placeholder="Enter option C"
                            required>

                    </div>


                    <div class="question-form-group">

                        <label for="modalOptionD">

                            Option D
                            <span>*</span>

                        </label>

                        <input
                            type="text"
                            id="modalOptionD"
                            placeholder="Enter option D"
                            required>

                    </div>

                </div>



                <!-- CORRECT ANSWER -->

                <div class="question-form-group">

                    <label for="modalCorrectAnswer">

                        Correct Answer
                        <span>*</span>

                    </label>

                    <select
                        id="modalCorrectAnswer"
                        required>

                        <option value="">
                            Select Correct Answer
                        </option>

                        <option value="A">
                            A
                        </option>

                        <option value="B">
                            B
                        </option>

                        <option value="C">
                            C
                        </option>

                        <option value="D">
                            D
                        </option>

                    </select>

                </div>



                <!-- CATEGORY / DIFFICULTY -->

                <div class="question-form-row">


                    <div class="question-form-group">

                        <label for="modalCategory">

                            Category
                            <span>*</span>

                        </label>

                        <select
                            id="modalCategory"
                            required>

                            <option value="">
                                Select Category
                            </option>

                            <option value="COMMUNICATION">
                                Communication
                            </option>

                            <option value="TECHNICAL">
                                Technical Skills
                            </option>

                            <option value="LOGICAL">
                                Logical Reasoning
                            </option>

                            <option value="APTITUDE">
                                Aptitude
                            </option>

                        </select>

                    </div>


                    <div class="question-form-group">

                        <label for="modalDifficulty">

                            Difficulty
                            <span>*</span>

                        </label>

                        <select
                            id="modalDifficulty"
                            required>

                            <option value="">
                                Select Difficulty
                            </option>

                            <option value="EASY">
                                Easy
                            </option>

                            <option value="MEDIUM">
                                Medium
                            </option>

                            <option value="HARD">
                                Hard
                            </option>

                        </select>

                    </div>

                </div>



                <!-- STATUS -->

                <div class="question-form-group">

                    <label for="modalStatus">

                        Status
                        <span>*</span>

                    </label>

                    <select
                        id="modalStatus"
                        required>

                        <option value="ACTIVE">
                            Active
                        </option>

                        <option value="INACTIVE">
                            Inactive
                        </option>

                    </select>

                </div>


            </div>



            <!-- =================================================
                 MODAL FOOTER
            ================================================== -->

            <div class="question-modal-footer">


                <button
                    type="button"
                    class="modal-btn modal-cancel-btn"
                    id="cancelQuestionModal">

                    <i class="fa-solid fa-xmark"></i>

                    Cancel

                </button>


                <button
                    type="button"
                    class="modal-btn modal-save-btn"
                    id="saveQuestionBtn">

                    <i class="fa-solid fa-check"></i>

                    <span id="saveQuestionText">
                        Save Question
                    </span>

                </button>

            </div>


        </div>

    </div>



    <!-- =====================================================
         SWEET ALERT
    ====================================================== -->

    <script
        src="https://cdn.jsdelivr.net/npm/sweetalert2@11">
    </script>



    <!-- =====================================================
         MANAGE QUESTIONS JS
    ====================================================== -->

    <script
        src="${pageContext.request.contextPath}/JS/config.js">
    </script>
    <script
        src="${pageContext.request.contextPath}/JS/manageQuestions.js">
    </script>


</body>

</html>