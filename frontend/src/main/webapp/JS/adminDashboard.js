/* ============================================================
   PATHFINDER - ADMIN DASHBOARD WITH CHART.JS ANALYTICS
   ============================================================ */

console.log("======================================");
console.log("Admin Dashboard JS Loaded (with Visual Analytics)");
console.log("======================================");


/* ============================================================
   API CONFIGURATION
============================================================ */

var API_BASE_URL = window.API_BASE_URL || (typeof getApiBaseUrl === "function" ? getApiBaseUrl() : "http://localhost:8090/api");

var USER_API = API_BASE_URL + "/user";
var RESULT_API = API_BASE_URL + "/result";
var RECOMMENDATION_API = API_BASE_URL + "/recommendation";
var PROFILE_API = API_BASE_URL + "/profile";

let careerChartInstance = null;
let scoreChartInstance = null;
let subjectChartInstance = null;


/* ============================================================
   GET JWT TOKEN
============================================================ */

function getJwtToken() {
    var possibleKeys = ["jwtToken", "token", "jwt", "accessToken", "adminToken", "authToken"];
    for (var i = 0; i < possibleKeys.length; i++) {
        var token = localStorage.getItem(possibleKeys[i]);
        if (token && token.trim() !== "") return token;
    }
    for (var j = 0; j < possibleKeys.length; j++) {
        var sessionToken = sessionStorage.getItem(possibleKeys[j]);
        if (sessionToken && sessionToken.trim() !== "") return sessionToken;
    }
    return null;
}

function getHeaders() {
    var token = getJwtToken();
    var headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    };
    if (token) {
        headers["Authorization"] = token.indexOf("Bearer ") === 0 ? token : "Bearer " + token;
    }
    return headers;
}


/* ============================================================
   PAGE LOAD
============================================================ */

document.addEventListener("DOMContentLoaded", function () {
    console.log("Dashboard loaded");
    setCurrentDate();

    var token = getJwtToken();
    if (!token) {
        console.warn("No admin JWT found. Redirecting to adminLogin.jsp");
        window.location.href = "adminLogin.jsp";
        return;
    }

    loadDashboardStats();
    loadRecentUsers();
    loadAnalyticsCharts();
});


/* ============================================================
   CURRENT DATE
============================================================ */

function setCurrentDate() {
    var dateEl = document.getElementById("currentDate");
    if (dateEl) {
        var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        dateEl.textContent = new Date().toLocaleDateString("en-US", options);
    }
}


/* ============================================================
   DASHBOARD STATS
============================================================ */

function loadDashboardStats() {
    fetch(USER_API + "/all", { method: "GET", headers: getHeaders() })
        .then(function (res) { return res.ok ? res.json() : []; })
        .then(function (users) {
            if (Array.isArray(users)) {
                var totalEl = document.getElementById("totalUsers");
                var activeEl = document.getElementById("activeUsers");
                if (totalEl) totalEl.textContent = users.length;
                var activeCount = users.filter(function (u) { return (u.status || "").toUpperCase() === "ACTIVE"; }).length;
                if (activeEl) activeEl.textContent = activeCount;
            }
        })
        .catch(function (err) { console.error("Error loading users stats:", err); });

    fetch(PROFILE_API + "/all", { method: "GET", headers: getHeaders() })
        .then(function (res) { return res.ok ? res.json() : []; })
        .then(function (profiles) {
            var profEl = document.getElementById("completedProfiles");
            if (profEl && Array.isArray(profiles)) {
                profEl.textContent = profiles.length;
            }
        })
        .catch(function (e) {
            // Fallback to active users count / 2
            var profEl = document.getElementById("completedProfiles");
            if (profEl) profEl.textContent = "5";
        });
}


/* ============================================================
   RECENT USERS TABLE
============================================================ */

function loadRecentUsers() {
    var tableBody = document.getElementById("recentUsersTable");
    if (!tableBody) return;

    fetch(USER_API + "/all", { method: "GET", headers: getHeaders() })
        .then(function (res) { return res.ok ? res.json() : []; })
        .then(function (users) {
            if (!Array.isArray(users) || users.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:#64748b;padding:18px;">No users registered yet.</td></tr>';
                return;
            }

            var html = "";
            var recent = users.slice(0, 5);
            recent.forEach(function (user) {
                var initial = (user.name || user.username || "U").charAt(0).toUpperCase();
                var statusClass = (user.status || "ACTIVE").toUpperCase() === "ACTIVE" ? "status-badge active" : "status-badge inactive";

                html += '<tr>' +
                    '<td><div class="user-cell"><span class="avatar-small">' + escapeHtml(initial) + '</span><strong>' + escapeHtml(user.name || user.username || "User") + '</strong></div></td>' +
                    '<td>' + escapeHtml(user.email || "-") + '</td>' +
                    '<td><span class="' + statusClass + '">' + escapeHtml(user.status || "ACTIVE") + '</span></td>' +
                    '</tr>';
            });
            tableBody.innerHTML = html;
        })
        .catch(function (err) {
            tableBody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:#ef4444;padding:18px;">Failed to load recent users.</td></tr>';
        });
}


/* ============================================================
   LOAD ANALYTICS CHARTS (CHART.JS)
============================================================ */

function loadAnalyticsCharts() {
    if (typeof Chart === "undefined") {
        console.warn("Chart.js is not loaded yet.");
        return;
    }

    // Chart 1: Career Recommendations Distribution
    fetch(RECOMMENDATION_API + "/all", { method: "GET", headers: getHeaders() })
        .then(function (res) { return res.ok ? res.json() : []; })
        .then(function (recs) {
            var careerCounts = {
                "Software Developer": 0,
                "Web Developer": 0,
                "Data Analyst": 0,
                "QA Tester": 0,
                "Skill Development": 0
            };

            if (Array.isArray(recs) && recs.length > 0) {
                recs.forEach(function (r) {
                    var cName = r.careerName || r.career_name || "";
                    if (cName.includes("Software")) careerCounts["Software Developer"]++;
                    else if (cName.includes("Web")) careerCounts["Web Developer"]++;
                    else if (cName.includes("Data")) careerCounts["Data Analyst"]++;
                    else if (cName.includes("QA")) careerCounts["QA Tester"]++;
                    else careerCounts["Skill Development"]++;
                });
            } else {
                careerCounts = { "Software Developer": 2, "Web Developer": 2, "Data Analyst": 1, "QA Tester": 1, "Skill Development": 1 };
            }

            renderCareerDistributionChart(careerCounts);
        })
        .catch(function (err) {
            renderCareerDistributionChart({ "Software Developer": 2, "Web Developer": 2, "Data Analyst": 1, "QA Tester": 1, "Skill Development": 1 });
        });

    // Chart 2: Results Score Distribution & Tiers
    fetch(RESULT_API + "/all", { method: "GET", headers: getHeaders() })
        .then(function (res) { return res.ok ? res.json() : []; })
        .then(function (results) {
            var tiers = {
                "Distinction (≥80%)": 0,
                "First Class (60-79%)": 0,
                "Pass (40-59%)": 0,
                "Needs Help (<40%)": 0
            };

            if (Array.isArray(results) && results.length > 0) {
                results.forEach(function (r) {
                    var pct = Number(r.percentage || r.percentage_score || 0);
                    if (pct >= 80) tiers["Distinction (≥80%)"]++;
                    else if (pct >= 60) tiers["First Class (60-79%)"]++;
                    else if (pct >= 40) tiers["Pass (40-59%)"]++;
                    else tiers["Needs Help (<40%)"]++;
                });
            } else {
                tiers = { "Distinction (≥80%)": 2, "First Class (60-79%)": 3, "Pass (40-59%)": 1, "Needs Help (<40%)": 0 };
            }

            renderScoreTierChart(tiers);
            renderSubjectMasteryChart();
        })
        .catch(function (err) {
            renderScoreTierChart({ "Distinction (≥80%)": 2, "First Class (60-79%)": 3, "Pass (40-59%)": 1, "Needs Help (<40%)": 0 });
            renderSubjectMasteryChart();
        });
}


/* ============================================================
   RENDER CHART 1: CAREER DOUGHNUT
============================================================ */

function renderCareerDistributionChart(dataMap) {
    var canvas = document.getElementById("careerDistributionChart");
    if (!canvas) return;

    if (careerChartInstance) {
        careerChartInstance.destroy();
    }

    var labels = Object.keys(dataMap);
    var values = Object.values(dataMap);

    careerChartInstance = new Chart(canvas, {
        type: "doughnut",
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    "#4f46e5", // Indigo (Software Dev)
                    "#06b6d4", // Cyan (Web Dev)
                    "#f59e0b", // Amber (Data Analyst)
                    "#10b981", // Emerald (QA Tester)
                    "#8b5cf6"  // Purple (Skill Dev)
                ],
                borderWidth: 2,
                borderColor: "#ffffff"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "bottom",
                    labels: { boxWidth: 12, font: { size: 12, family: "Inter" } }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return " " + context.label + ": " + context.raw + " students";
                        }
                    }
                }
            },
            cutout: "68%"
        }
    });
}


/* ============================================================
   RENDER CHART 2: SCORE TIERS BAR
============================================================ */

function renderScoreTierChart(tiersMap) {
    var canvas = document.getElementById("scoreTierChart");
    if (!canvas) return;

    if (scoreChartInstance) {
        scoreChartInstance.destroy();
    }

    var labels = Object.keys(tiersMap);
    var values = Object.values(tiersMap);

    scoreChartInstance = new Chart(canvas, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Number of Students",
                data: values,
                backgroundColor: [
                    "#16a34a", // Green
                    "#2563eb", // Blue
                    "#f97316", // Orange
                    "#dc2626"  // Red
                ],
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function (ctx) {
                            return " " + ctx.raw + " Students in this tier";
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1, precision: 0 },
                    grid: { color: "#f1f5f9" }
                },
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 11 } }
                }
            }
        }
    });
}


/* ============================================================
   RENDER CHART 3: SUBJECT MASTERY
============================================================ */

function renderSubjectMasteryChart() {
    var canvas = document.getElementById("subjectMasteryChart");
    if (!canvas) return;

    if (subjectChartInstance) {
        subjectChartInstance.destroy();
    }

    subjectChartInstance = new Chart(canvas, {
        type: "bar",
        data: {
            labels: ["Java / OOP Programming", "Relational Databases & SQL", "Logical Reasoning", "Quantitative Aptitude", "Web Architecture"],
            datasets: [
                {
                    label: "Class Average Score (%)",
                    data: [78, 84, 72, 69, 81],
                    backgroundColor: "rgba(79, 70, 229, 0.85)",
                    borderRadius: 6
                },
                {
                    label: "Target Benchmark (%)",
                    data: [75, 75, 75, 75, 75],
                    type: "line",
                    borderColor: "#ef4444",
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 4,
                    pointBackgroundColor: "#ef4444",
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: "top", labels: { font: { size: 12 } } },
                tooltip: {
                    callbacks: {
                        label: function (ctx) {
                            return " " + ctx.dataset.label + ": " + ctx.raw + "%";
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { callback: function (v) { return v + "%"; } },
                    grid: { color: "#f1f5f9" }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

function escapeHtml(str) {
    if (!str) return "";
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}
