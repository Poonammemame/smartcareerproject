<%@ page language="java"
    contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>PathFinder | Manage Learning Resources</title>

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
         MANAGE RESOURCES CSS
    ====================================================== -->
    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/CSS/manageResources.css?v=20260827_3">

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
    <jsp:param name="activePage" value="resources"/>
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
    <main class="resource-management-content">

        <!-- =================================================
             PAGE HEADER
        ================================================== -->
        <section class="resource-page-header">
            <div>
                <span class="page-label">ADMIN PANEL</span>
                <h1>Manage Learning Resources</h1>
                <p>Curate, add, edit, and organize tutorials, video courses, and practice platforms for career roadmaps.</p>
            </div>

            <div class="header-action-group">
                <button type="button" class="btn-primary-add" onclick="openAddResourceModal()">
                    <i class="fa-solid fa-plus"></i> Add New Resource
                </button>
            </div>
        </section>

        <!-- =================================================
             METRIC STAT CARDS
        ================================================== -->
        <section class="metrics-grid">
            <div class="metric-card">
                <div class="metric-icon icon-blue"><i class="fa-solid fa-book-open"></i></div>
                <div>
                    <span class="metric-title">Total Resources</span>
                    <h3 id="statTotalResources">0</h3>
                </div>
            </div>
            <div class="metric-card">
                <div class="metric-icon icon-purple"><i class="fa-solid fa-video"></i></div>
                <div>
                    <span class="metric-title">Video Courses</span>
                    <h3 id="statVideoCourses">0</h3>
                </div>
            </div>
            <div class="metric-card">
                <div class="metric-icon icon-green"><i class="fa-solid fa-laptop-code"></i></div>
                <div>
                    <span class="metric-title">Coding Practice</span>
                    <h3 id="statPractice">0</h3>
                </div>
            </div>
            <div class="metric-card">
                <div class="metric-icon icon-amber"><i class="fa-solid fa-graduation-cap"></i></div>
                <div>
                    <span class="metric-title">Careers Covered</span>
                    <h3 id="statCareersCovered">0</h3>
                </div>
            </div>
        </section>

        <!-- =================================================
             SEARCH & FILTER BAR
        ================================================== -->
        <section class="filter-card">
            <div class="search-box">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input type="text" id="resourceSearchInput" placeholder="Search resources by title, description, or keyword..." oninput="handleSearchFilter()">
            </div>

            <div class="filter-controls">
                <div class="select-wrapper">
                    <select id="careerFilterSelect" onchange="handleSearchFilter()">
                        <option value="ALL">All Careers</option>
                    </select>
                </div>

                <div class="select-wrapper">
                    <select id="typeFilterSelect" onchange="handleSearchFilter()">
                        <option value="ALL">All Resource Types</option>
                        <option value="doc">📖 Documentation / Guides</option>
                        <option value="video">🎥 Video Courses</option>
                        <option value="practice">💻 Hands-on Practice</option>
                        <option value="cheatsheet">📑 Cheatsheets</option>
                    </select>
                </div>
            </div>
        </section>

        <!-- =================================================
             RESOURCES TABLE CARD
        ================================================== -->
        <section class="table-card">
            <div class="table-header-meta">
                <h2>Learning Resources Catalog (<span id="resourceCountBadge">0</span>)</h2>
                <div class="table-actions-right">
                    <div class="top-pagination-wrap" id="topPaginationWrap">
                        <button type="button" class="page-btn page-text-btn" id="topPrevBtn" onclick="goToPage(currentPage - 1)">
                            <i class="fa-solid fa-arrow-left"></i> Prev
                        </button>
                        <span id="topPageInfo" class="top-page-info">Page 1</span>
                        <button type="button" class="page-btn page-text-btn" id="topNextBtn" onclick="goToPage(currentPage + 1)">
                            Next <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>

                    <button type="button" class="btn-refresh" onclick="loadAdminResources()">
                        <i class="fa-solid fa-rotate"></i> Refresh
                    </button>
                </div>
            </div>

            <div class="table-responsive">
                <table class="custom-admin-table">
                    <thead>
                        <tr>
                            <th style="width: 50px;">#</th>
                            <th>Career Track</th>
                            <th style="width: 80px;">Stage</th>
                            <th>Category</th>
                            <th>Resource Title</th>
                            <th style="width: 100px;">Type</th>
                            <th>URL</th>
                            <th style="width: 120px; text-align: center;">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="resourceTableBody">
                        <tr>
                            <td colspan="8" class="table-loading-cell">
                                <i class="fa-solid fa-spinner fa-spin"></i> Loading resources from database...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- =================================================
                 BOTTOM PAGINATION FOOTER
            ================================================== -->
            <div class="pagination-container" id="paginationContainer">
                <div class="pagination-left">
                    <span id="paginationInfoText" class="pagination-info">Showing 1 to 8 of 42 resources</span>
                    <div class="page-size-selector">
                        <label for="pageSizeSelect">Per page:</label>
                        <select id="pageSizeSelect" onchange="handlePageSizeChange()">
                            <option value="5">5</option>
                            <option value="8" selected>8</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                </div>

                <div class="pagination-nav" id="paginationNav">
                    <!-- Page buttons rendered by JS -->
                </div>
            </div>
        </section>

    </main>
</div>

<!-- =====================================================
     ADD / EDIT RESOURCE MODAL
====================================================== -->
<div id="resourceFormModal" class="admin-modal-overlay" style="display:none;" onclick="handleFormModalBackdrop(event)">
    <div class="admin-modal-dialog" onclick="event.stopPropagation()">
        <div class="admin-modal-header">
            <div>
                <span class="modal-badge-label" id="formModalBadge">ADD RESOURCE</span>
                <h3 id="formModalTitle">Add New Learning Resource</h3>
            </div>
            <button type="button" class="btn-modal-close" onclick="closeFormModal()">&times;</button>
        </div>

        <form id="resourceForm" onsubmit="handleResourceFormSubmit(event)">
            <input type="hidden" id="formResourceId" value="">

            <div class="admin-modal-body">
                <div class="form-row-2">
                    <div class="form-group">
                        <label for="formCareerId">Career Track <span class="req">*</span></label>
                        <select id="formCareerId" required>
                            <option value="">Select Career...</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="formStageNumber">Stage Number <span class="req">*</span></label>
                        <select id="formStageNumber" required onchange="handleStageNumberChange()">
                            <option value="1">Stage 01 - Fundamentals</option>
                            <option value="2">Stage 02 - Core Skills</option>
                            <option value="3">Stage 03 - Intermediate</option>
                            <option value="4">Stage 04 - Advanced</option>
                            <option value="5">Stage 05 - Projects & Readiness</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label for="formStageTitle">Stage Title <span class="req">*</span></label>
                    <input type="text" id="formStageTitle" placeholder="e.g. Core Java & OOP Fundamentals" required>
                </div>

                <div class="form-row-2">
                    <div class="form-group">
                        <label for="formCategory">Category Header <span class="req">*</span></label>
                        <select id="formCategory" required>
                            <option value="📖 Official Docs & Guides">📖 Official Docs & Guides</option>
                            <option value="🎥 Video Courses">🎥 Video Courses</option>
                            <option value="💻 Hands-on Practice">💻 Hands-on Practice</option>
                            <option value="📑 Cheatsheets & Reference">📑 Cheatsheets & Reference</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="formResourceType">Resource Type <span class="req">*</span></label>
                        <select id="formResourceType" required>
                            <option value="doc">Documentation (doc)</option>
                            <option value="video">Video Course (video)</option>
                            <option value="practice">Hands-on Practice (practice)</option>
                            <option value="cheatsheet">Cheatsheet (cheatsheet)</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label for="formTitle">Resource Title <span class="req">*</span></label>
                    <input type="text" id="formTitle" placeholder="e.g. Harvard CS50: Introduction to Computer Science" required>
                </div>

                <div class="form-group">
                    <label for="formUrl">Resource URL / Link <span class="req">*</span></label>
                    <input type="url" id="formUrl" placeholder="https://..." required>
                </div>

                <div class="form-group">
                    <label for="formDescription">Description / Key Highlights</label>
                    <textarea id="formDescription" rows="3" placeholder="Brief summary of what the student will learn from this resource..."></textarea>
                </div>
            </div>

            <div class="admin-modal-footer">
                <button type="button" class="btn-cancel" onclick="closeFormModal()">Cancel</button>
                <button type="submit" class="btn-save" id="btnSaveResource">
                    <i class="fa-solid fa-floppy-disk"></i> Save Resource
                </button>
            </div>
        </form>
    </div>
</div>

<!-- =====================================================
     DELETE CONFIRMATION MODAL
====================================================== -->
<div id="deleteModal" class="admin-modal-overlay" style="display:none;" onclick="handleDeleteModalBackdrop(event)">
    <div class="admin-modal-dialog modal-sm" onclick="event.stopPropagation()">
        <div class="delete-icon-box">
            <i class="fa-solid fa-triangle-exclamation"></i>
        </div>
        <h3>Delete Learning Resource?</h3>
        <p>Are you sure you want to delete <strong id="deleteResourceTitle">this resource</strong>? This action cannot be undone.</p>
        <div class="delete-actions">
            <button type="button" class="btn-cancel" onclick="closeDeleteModal()">Cancel</button>
            <button type="button" class="btn-confirm-delete" id="btnConfirmDelete" onclick="executeDeleteResource()">
                <i class="fa-solid fa-trash"></i> Delete
            </button>
        </div>
    </div>
</div>

<!-- =====================================================
     SCRIPTS
====================================================== -->
<script src="${pageContext.request.contextPath}/JS/manageResources.js?v=20260827_3"></script>

</body>
</html>
