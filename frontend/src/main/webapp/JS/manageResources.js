/* ============================================================
   PATHFINDER - ADMIN MANAGE LEARNING RESOURCES
   Full CRUD Client Controller with Interactive Pagination
   ============================================================ */

console.log("======================================");
console.log("manageResources.js with Pagination LOADED");
console.log("======================================");

window.API_BASE_URL = window.API_BASE_URL || (typeof getApiBaseUrl === "function" ? getApiBaseUrl() : "http://localhost:8090/api");

const RESOURCE_ALL_API = window.API_BASE_URL + "/resource/all";
const RESOURCE_ADD_API = window.API_BASE_URL + "/resource/add";
const RESOURCE_UPDATE_API = window.API_BASE_URL + "/resource/update";
const RESOURCE_DELETE_API = window.API_BASE_URL + "/resource/delete/";
const CAREER_ALL_API = window.API_BASE_URL + "/career/all";

let adminToken = null;
let allResources = [];
let allCareers = [];
let deleteTargetId = null;

// Pagination state
let currentPage = 1;
let pageSize = 8;
let currentFilteredList = [];

document.addEventListener("DOMContentLoaded", function () {
    adminToken = localStorage.getItem("adminToken") || localStorage.getItem("token");

    if (!adminToken) {
        window.location.href = "adminLogin.jsp";
        return;
    }

    loadCareersList();
    loadAdminResources();
});

/* ============================================================
   LOAD CAREERS LIST
============================================================ */
function loadCareersList() {
    fetch(CAREER_ALL_API, {
        headers: { "Authorization": "Bearer " + adminToken }
    })
    .then(res => res.ok ? res.json() : [])
    .then(data => {
        allCareers = data;
        populateCareerDropdowns();
    })
    .catch(err => console.warn("Failed to load careers:", err));
}

function populateCareerDropdowns() {
    const filterSelect = document.getElementById("careerFilterSelect");
    const formSelect = document.getElementById("formCareerId");

    if (filterSelect) {
        filterSelect.innerHTML = '<option value="ALL">All Careers (' + allCareers.length + ')</option>';
        allCareers.forEach(c => {
            filterSelect.innerHTML += '<option value="' + c.careerId + '">' + escapeHtml(c.careerName) + '</option>';
        });
    }

    if (formSelect) {
        formSelect.innerHTML = '<option value="">Select Career...</option>';
        allCareers.forEach(c => {
            formSelect.innerHTML += '<option value="' + c.careerId + '">' + escapeHtml(c.careerName) + '</option>';
        });
    }
}

function getCareerNameById(careerId) {
    const found = allCareers.find(c => Number(c.careerId) === Number(careerId));
    return found ? found.careerName : "Career #" + careerId;
}

/* ============================================================
   LOAD ALL RESOURCES
============================================================ */
function loadAdminResources() {
    const tbody = document.getElementById("resourceTableBody");
    if (tbody) {
        tbody.innerHTML = '<tr><td colspan="8" class="table-loading-cell"><i class="fa-solid fa-spinner fa-spin"></i> Loading resources from database...</td></tr>';
    }

    fetch(RESOURCE_ALL_API, {
        headers: { "Authorization": "Bearer " + adminToken }
    })
    .then(res => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
    })
    .then(data => {
        allResources = Array.isArray(data) ? data : [];
        updateMetrics();
        currentFilteredList = allResources;
        currentPage = 1;
        renderResourcesTable(currentFilteredList);
    })
    .catch(err => {
        console.error("Error loading resources:", err);
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="8" class="table-error-cell"><i class="fa-solid fa-triangle-exclamation"></i> Failed to load resources: ' + escapeHtml(err.message) + '</td></tr>';
        }
    });
}

/* ============================================================
   UPDATE METRICS
============================================================ */
function updateMetrics() {
    const totalEl = document.getElementById("statTotalResources");
    const videoEl = document.getElementById("statVideoCourses");
    const practiceEl = document.getElementById("statPractice");
    const careersEl = document.getElementById("statCareersCovered");
    const badgeEl = document.getElementById("resourceCountBadge");

    const total = allResources.length;
    const videoCount = allResources.filter(r => r.resourceType === "video").length;
    const practiceCount = allResources.filter(r => r.resourceType === "practice").length;
    const distinctCareers = new Set(allResources.map(r => r.careerId)).size;

    if (totalEl) totalEl.textContent = total;
    if (videoEl) videoEl.textContent = videoCount;
    if (practiceEl) practiceEl.textContent = practiceCount;
    if (careersEl) careersEl.textContent = distinctCareers;
    if (badgeEl) badgeEl.textContent = total;
}

/* ============================================================
   SEARCH & FILTER
============================================================ */
function handleSearchFilter() {
    const searchVal = (document.getElementById("resourceSearchInput").value || "").toLowerCase().trim();
    const careerVal = document.getElementById("careerFilterSelect").value;
    const typeVal = document.getElementById("typeFilterSelect").value;

    const filtered = allResources.filter(r => {
        const matchesCareer = careerVal === "ALL" || Number(r.careerId) === Number(careerVal);
        const matchesType = typeVal === "ALL" || r.resourceType === typeVal;

        const titleText = (r.title || "").toLowerCase();
        const descText = (r.description || "").toLowerCase();
        const categoryText = (r.category || "").toLowerCase();
        const stageTitleText = (r.stageTitle || "").toLowerCase();
        const cName = getCareerNameById(r.careerId).toLowerCase();

        const matchesSearch = !searchVal ||
            titleText.includes(searchVal) ||
            descText.includes(searchVal) ||
            categoryText.includes(searchVal) ||
            stageTitleText.includes(searchVal) ||
            cName.includes(searchVal);

        return matchesCareer && matchesType && matchesSearch;
    });

    const badgeEl = document.getElementById("resourceCountBadge");
    if (badgeEl) badgeEl.textContent = filtered.length;

    currentPage = 1;
    currentFilteredList = filtered;
    renderResourcesTable(currentFilteredList);
}

/* ============================================================
   PAGINATION CONTROLS
============================================================ */
function handlePageSizeChange() {
    const sel = document.getElementById("pageSizeSelect");
    if (sel) {
        pageSize = Number(sel.value) || 8;
        currentPage = 1;
        renderResourcesTable(currentFilteredList);
    }
}

function goToPage(page) {
    const totalPages = Math.ceil(currentFilteredList.length / pageSize) || 1;
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderResourcesTable(currentFilteredList);
}

function renderPaginationControls(total, totalPages, startIdx, endIdx) {
    const container = document.getElementById("paginationContainer");
    const infoText = document.getElementById("paginationInfoText");
    const nav = document.getElementById("paginationNav");

    if (!container || !nav) return;

    if (total === 0) {
        container.style.display = "none";
        return;
    }

    container.style.display = "flex";

    if (infoText) {
        infoText.textContent = "Showing " + (startIdx + 1) + " to " + endIdx + " of " + total + " resources";
    }

    let navHtml = "";

    // Previous Button (Prominent Text + Icon)
    navHtml += '<button type="button" class="page-btn page-text-btn" ' + (currentPage === 1 ? 'disabled' : '') + ' onclick="goToPage(' + (currentPage - 1) + ')" title="Previous Page">' +
        '<i class="fa-solid fa-arrow-left"></i> Previous' +
    '</button>';

    // Page Numbers with Ellipses
    let maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
        navHtml += '<button type="button" class="page-btn" onclick="goToPage(1)">1</button>';
        if (startPage > 2) {
            navHtml += '<span class="page-ellipsis">...</span>';
        }
    }

    for (let p = startPage; p <= endPage; p++) {
        navHtml += '<button type="button" class="page-btn ' + (p === currentPage ? 'active' : '') + '" onclick="goToPage(' + p + ')">' + p + '</button>';
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            navHtml += '<span class="page-ellipsis">...</span>';
        }
        navHtml += '<button type="button" class="page-btn" onclick="goToPage(' + totalPages + ')">' + totalPages + '</button>';
    }

    // Next Button (Prominent Text + Icon)
    navHtml += '<button type="button" class="page-btn page-text-btn" ' + (currentPage === totalPages ? 'disabled' : '') + ' onclick="goToPage(' + (currentPage + 1) + ')" title="Next Page">' +
        'Next <i class="fa-solid fa-arrow-right"></i>' +
    '</button>';

    nav.innerHTML = navHtml;

    // Update Top Quick-Pagination Controls
    const topPrevBtn = document.getElementById("topPrevBtn");
    const topNextBtn = document.getElementById("topNextBtn");
    const topPageInfo = document.getElementById("topPageInfo");
    const topWrap = document.getElementById("topPaginationWrap");

    if (topWrap) {
        topWrap.style.display = total > 0 ? "inline-flex" : "none";
    }
    if (topPageInfo) {
        topPageInfo.textContent = "Page " + currentPage + " of " + totalPages;
    }
    if (topPrevBtn) {
        topPrevBtn.disabled = (currentPage === 1);
    }
    if (topNextBtn) {
        topNextBtn.disabled = (currentPage === totalPages);
    }
}

/* ============================================================
   RENDER TABLE WITH PAGINATION
============================================================ */
function renderResourcesTable(list) {
    const tbody = document.getElementById("resourceTableBody");
    if (!tbody) return;

    currentFilteredList = list || [];
    const total = currentFilteredList.length;

    if (total === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="table-empty-cell"><i class="fa-regular fa-folder-open"></i> No learning resources match the current filter.</td></tr>';
        renderPaginationControls(0, 0, 0, 0);
        return;
    }

    const totalPages = Math.ceil(total / pageSize) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIdx = (currentPage - 1) * pageSize;
    const endIdx = Math.min(startIdx + pageSize, total);
    const paginatedItems = currentFilteredList.slice(startIdx, endIdx);

    let html = "";
    paginatedItems.forEach((item, index) => {
        const itemNumber = startIdx + index + 1;
        const cName = getCareerNameById(item.careerId);
        const rType = item.resourceType || "doc";
        let typeBadgeClass = "badge-doc";
        let typeIcon = "fa-book";

        if (rType === "video") {
            typeBadgeClass = "badge-video";
            typeIcon = "fa-play";
        } else if (rType === "practice") {
            typeBadgeClass = "badge-practice";
            typeIcon = "fa-laptop-code";
        } else if (rType === "cheatsheet") {
            typeBadgeClass = "badge-cheatsheet";
            typeIcon = "fa-file-lines";
        }

        html += '<tr>' +
            '<td class="td-id">' + itemNumber + '</td>' +
            '<td><span class="career-tag">' + escapeHtml(cName) + '</span></td>' +
            '<td><span class="stage-tag">Stage ' + String(item.stageNumber).padStart(2, "0") + '</span></td>' +
            '<td><span class="category-text">' + formatCategory(item.category) + '</span></td>' +
            '<td>' +
                '<div class="resource-title-cell">' +
                    '<strong>' + escapeHtml(item.title) + '</strong>' +
                    (item.description ? '<p>' + escapeHtml(item.description) + '</p>' : '') +
                '</div>' +
            '</td>' +
            '<td><span class="type-badge ' + typeBadgeClass + '"><i class="fa-solid ' + typeIcon + '"></i> ' + rType + '</span></td>' +
            '<td>' +
                '<a href="' + escapeHtml(item.url) + '" target="_blank" rel="noopener noreferrer" class="resource-link-preview">' +
                    '<i class="fa-solid fa-arrow-up-right-from-square"></i> Open Link' +
                '</a>' +
            '</td>' +
            '<td class="td-actions">' +
                '<button type="button" class="btn-action-edit" title="Edit Resource" onclick="openEditResourceModal(' + item.resourceId + ')">' +
                    '<i class="fa-solid fa-pen-to-square"></i>' +
                '</button>' +
                '<button type="button" class="btn-action-delete" title="Delete Resource" onclick="openDeleteModal(' + item.resourceId + ')">' +
                    '<i class="fa-solid fa-trash"></i>' +
                '</button>' +
            '</td>' +
        '</tr>';
    });

    tbody.innerHTML = html;
    renderPaginationControls(total, totalPages, startIdx, endIdx);
}

/* ============================================================
   MODAL HANDLERS
============================================================ */
function openAddResourceModal() {
    document.getElementById("resourceForm").reset();
    document.getElementById("formResourceId").value = "";
    document.getElementById("formModalBadge").textContent = "ADD RESOURCE";
    document.getElementById("formModalTitle").textContent = "Add New Learning Resource";
    document.getElementById("btnSaveResource").innerHTML = '<i class="fa-solid fa-plus"></i> Create Resource';

    const modal = document.getElementById("resourceFormModal");
    if (modal) modal.style.display = "flex";
}

function openEditResourceModal(id) {
    const item = allResources.find(r => Number(r.resourceId) === Number(id));
    if (!item) return;

    document.getElementById("formResourceId").value = item.resourceId;
    document.getElementById("formCareerId").value = item.careerId;
    document.getElementById("formStageNumber").value = item.stageNumber;
    document.getElementById("formStageTitle").value = item.stageTitle || "";
    document.getElementById("formCategory").value = item.category || "📖 Official Docs & Guides";
    document.getElementById("formResourceType").value = item.resourceType || "doc";
    document.getElementById("formTitle").value = item.title || "";
    document.getElementById("formUrl").value = item.url || "";
    document.getElementById("formDescription").value = item.description || "";

    document.getElementById("formModalBadge").textContent = "EDIT RESOURCE #" + item.resourceId;
    document.getElementById("formModalTitle").textContent = "Edit Learning Resource";
    document.getElementById("btnSaveResource").innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Update Resource';

    const modal = document.getElementById("resourceFormModal");
    if (modal) modal.style.display = "flex";
}

function closeFormModal() {
    const modal = document.getElementById("resourceFormModal");
    if (modal) modal.style.display = "none";
}

function handleFormModalBackdrop(e) {
    if (e.target && e.target.id === "resourceFormModal") closeFormModal();
}

function handleStageNumberChange() {
    const stageNum = document.getElementById("formStageNumber").value;
    const titleInput = document.getElementById("formStageTitle");
    if (!titleInput.value) {
        if (stageNum === "1") titleInput.value = "Programming & Domain Fundamentals";
        else if (stageNum === "2") titleInput.value = "Core Skills & Problem Solving";
        else if (stageNum === "3") titleInput.value = "Intermediate Engineering & Tools";
        else if (stageNum === "4") titleInput.value = "Advanced Frameworks & Architecture";
        else if (stageNum === "5") titleInput.value = "Projects & Career Readiness";
    }
}

/* ============================================================
   SAVE / UPDATE RESOURCE
============================================================ */
function handleResourceFormSubmit(e) {
    e.preventDefault();

    const id = document.getElementById("formResourceId").value;
    const isEdit = Boolean(id);

    const payload = {
        careerId: Number(document.getElementById("formCareerId").value),
        stageNumber: Number(document.getElementById("formStageNumber").value),
        stageTitle: document.getElementById("formStageTitle").value.trim(),
        category: document.getElementById("formCategory").value.trim(),
        resourceType: document.getElementById("formResourceType").value.trim(),
        title: document.getElementById("formTitle").value.trim(),
        url: document.getElementById("formUrl").value.trim(),
        description: document.getElementById("formDescription").value.trim()
    };

    if (isEdit) {
        payload.resourceId = Number(id);
    }

    const apiUrl = isEdit ? RESOURCE_UPDATE_API : RESOURCE_ADD_API;
    const method = isEdit ? "PUT" : "POST";

    const saveBtn = document.getElementById("btnSaveResource");
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
    saveBtn.disabled = true;

    fetch(apiUrl, {
        method: method,
        headers: {
            "Authorization": "Bearer " + adminToken,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then(res => {
        if (!res.ok) throw new Error("Failed to save resource (HTTP " + res.status + ")");
        return res.text();
    })
    .then(msg => {
        closeFormModal();
        loadAdminResources();
    })
    .catch(err => {
        alert("Error saving resource: " + err.message);
    })
    .finally(() => {
        saveBtn.innerHTML = originalText;
        saveBtn.disabled = false;
    });
}

/* ============================================================
   DELETE RESOURCE
============================================================ */
function openDeleteModal(id) {
    const item = allResources.find(r => Number(r.resourceId) === Number(id));
    if (!item) return;

    deleteTargetId = id;
    const titleEl = document.getElementById("deleteResourceTitle");
    if (titleEl) titleEl.textContent = '"' + item.title + '"';

    const modal = document.getElementById("deleteModal");
    if (modal) modal.style.display = "flex";
}

function closeDeleteModal() {
    deleteTargetId = null;
    const modal = document.getElementById("deleteModal");
    if (modal) modal.style.display = "none";
}

function handleDeleteModalBackdrop(e) {
    if (e.target && e.target.id === "deleteModal") closeDeleteModal();
}

function executeDeleteResource() {
    if (!deleteTargetId) return;

    const delBtn = document.getElementById("btnConfirmDelete");
    delBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Deleting...';
    delBtn.disabled = true;

    fetch(RESOURCE_DELETE_API + deleteTargetId, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + adminToken }
    })
    .then(res => {
        if (!res.ok) throw new Error("Failed to delete (HTTP " + res.status + ")");
        return res.text();
    })
    .then(msg => {
        closeDeleteModal();
        loadAdminResources();
    })
    .catch(err => {
        alert("Error deleting resource: " + err.message);
    })
    .finally(() => {
        delBtn.innerHTML = '<i class="fa-solid fa-trash"></i> Delete';
        delBtn.disabled = false;
    });
}

function formatCategory(cat) {
    if (!cat) return "Learning Resource";
    let clean = cat.replace(/^[\?\#\*\s]+/, "").trim();
    if (clean.toLowerCase().includes("doc") || clean.toLowerCase().includes("guide")) {
        return '<i class="fa-solid fa-book" style="color:#0284c7;margin-right:6px;"></i> ' + escapeHtml(clean);
    } else if (clean.toLowerCase().includes("video") || clean.toLowerCase().includes("course")) {
        return '<i class="fa-solid fa-video" style="color:#dc2626;margin-right:6px;"></i> ' + escapeHtml(clean);
    } else if (clean.toLowerCase().includes("practice") || clean.toLowerCase().includes("hands")) {
        return '<i class="fa-solid fa-laptop-code" style="color:#16a34a;margin-right:6px;"></i> ' + escapeHtml(clean);
    } else {
        return '<i class="fa-solid fa-bookmark" style="color:#6366f1;margin-right:6px;"></i> ' + escapeHtml(clean);
    }
}

function escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = String(text);
    return div.innerHTML;
}

// Global exports
window.loadAdminResources = loadAdminResources;
window.handleSearchFilter = handleSearchFilter;
window.handlePageSizeChange = handlePageSizeChange;
window.goToPage = goToPage;
window.openAddResourceModal = openAddResourceModal;
window.openEditResourceModal = openEditResourceModal;
window.closeFormModal = closeFormModal;
window.handleFormModalBackdrop = handleFormModalBackdrop;
window.handleStageNumberChange = handleStageNumberChange;
window.handleResourceFormSubmit = handleResourceFormSubmit;
window.openDeleteModal = openDeleteModal;
window.closeDeleteModal = closeDeleteModal;
window.handleDeleteModalBackdrop = handleDeleteModalBackdrop;
window.executeDeleteResource = executeDeleteResource;
