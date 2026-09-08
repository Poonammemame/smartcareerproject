/* ============================================================
   PATHFINDER - CENTRALIZED FRONTEND CONFIGURATION
   ============================================================ */

var MANUAL_API_BASE_URL = "";

function getApiBaseUrl() {
    if (MANUAL_API_BASE_URL && MANUAL_API_BASE_URL.trim() !== "") {
        return MANUAL_API_BASE_URL.replace(/\/+$/, "");
    }
    if (typeof window !== "undefined" && window.API_BASE_URL_OVERRIDE) {
        return window.API_BASE_URL_OVERRIDE.replace(/\/+$/, "");
    }
    if (typeof window !== "undefined" && window.location) {
        var port = window.location.port;
        var hostname = window.location.hostname || "localhost";
        var protocol = window.location.protocol || "http:";

        // 1. Production deployment (e.g. smartcareerpath.co.in or any live domain)
        var isLocal = (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1");
        if (!isLocal) {
            var portSuffix = (port && port !== "80" && port !== "443") ? (":" + port) : "";
            return protocol + "//" + hostname + portSuffix + "/api";
        }

        // 2. Local external Tomcat deployment with api.war (port 8090)
        if (port === "8090") {
            return protocol + "//" + hostname + ":8090/api";
        }

        // 3. Standalone Spring Boot or port 8080
        if (port === "8080") {
            return protocol + "//" + hostname + ":8080";
        }

        // 4. Fallback for other local ports (e.g. 5500 Live Server)
        return protocol + "//" + hostname + ":8090/api";
    }
    return "http://localhost:8090/api";
}

function buildApiEndpoints(baseUrl) {
    return {
        AUTH: {
            REGISTER: baseUrl + "/auth/register",
            LOGIN: baseUrl + "/auth/login",
            FORGOT_PASSWORD: baseUrl + "/auth/forgot-password",
            VERIFY_OTP: baseUrl + "/auth/verify-otp",
            RESET_PASSWORD: baseUrl + "/auth/reset-password"
        },
        ADMIN: {
            LOGIN: baseUrl + "/admin/login"
        },
        USER: {
            ALL: baseUrl + "/user/all",
            SEARCH: baseUrl + "/user/search/",
            STATUS: baseUrl + "/user/status/",
            DELETE: baseUrl + "/user/delete/",
            TOTAL: baseUrl + "/user/total"
        },
        PROFILE: {
            BASE: baseUrl + "/profile",
            SAVE: baseUrl + "/profile/save",
            UPDATE: baseUrl + "/profile/update",
            DELETE: baseUrl + "/profile/delete",
            ALL: baseUrl + "/profile/all"
        },
        ASSESSMENT: {
            STATUS: baseUrl + "/assessment/status/",
            USER: baseUrl + "/assessment/user/",
            ASSIGN: baseUrl + "/assessment/assign/",
            ALL: baseUrl + "/assessment/all",
            COMPLETE: baseUrl + "/assessment/complete/"
        },
        QUESTION: {
            ALL: baseUrl + "/question/all",
            ADD: baseUrl + "/question/add",
            UPDATE: baseUrl + "/question/update",
            DELETE: baseUrl + "/question/delete/",
            STATUS: baseUrl + "/question/status/",
            SEARCH: baseUrl + "/question/search/",
            TOTAL: baseUrl + "/question/total",
            CATEGORY: baseUrl + "/question/category/",
            COUNT: {
                APTITUDE: baseUrl + "/question/count/aptitude",
                LOGICAL: baseUrl + "/question/count/logical",
                TECHNICAL: baseUrl + "/question/count/technical",
                COMMUNICATION: baseUrl + "/question/count/communication"
            },
            DIFFICULTY: {
                EASY: baseUrl + "/question/easy",
                MEDIUM: baseUrl + "/question/medium",
                HARD: baseUrl + "/question/hard"
            }
        },
        RESULT: {
            SAVE: baseUrl + "/result/save",
            MY: baseUrl + "/result/my",
            ALL: baseUrl + "/result/all",
            BY_ID: baseUrl + "/result/",
            SUBJECT: baseUrl + "/result/subject/"
        },
        CAREER: {
            ALL: baseUrl + "/career/all",
            ADD: baseUrl + "/career/add",
            UPDATE: baseUrl + "/career/update",
            DELETE: baseUrl + "/career/delete/",
            SEARCH: baseUrl + "/career/search/",
            TOTAL: baseUrl + "/career/total"
        },
        RECOMMENDATION: {
            MY: baseUrl + "/recommendation/my",
            ALL: baseUrl + "/recommendation/all",
            SAVE: baseUrl + "/recommendation/save",
            GENERATE: baseUrl + "/recommendation/generate"
        },
        SETTINGS: {
            MY: baseUrl + "/settings/my",
            UPDATE: baseUrl + "/settings/update",
            EMAIL: baseUrl + "/settings/email",
            PASSWORD: baseUrl + "/settings/password"
        }
    };
}

var API_BASE_URL = getApiBaseUrl();
var API_ENDPOINTS = buildApiEndpoints(API_BASE_URL);

window.API_BASE_URL = API_BASE_URL;
window.API_ENDPOINTS = API_ENDPOINTS;
window.getApiBaseUrl = getApiBaseUrl;
window.buildApiEndpoints = buildApiEndpoints;


/* ============================================================
   SHARED AUTHENTICATION & STORAGE UTILITIES
   ============================================================ */

/**
 * Retrieve active JWT token from localStorage or sessionStorage
 * Checks multiple common fallback keys for high resilience
 */
function getAuthToken() {
    var keys = [
        "token",
        "jwtToken",
        "jwt",
        "accessToken",
        "adminToken",
        "authToken",
        "access_token",
        "admin_token"
    ];

    var token = null;

    // Check localStorage
    for (var i = 0; i < keys.length; i++) {
        try {
            token = localStorage.getItem(keys[i]);
            if (token && token.trim() !== "") {
                return normalizeAuthToken(token);
            }
        } catch (e) {
            console.warn("Error reading localStorage:", e);
        }
    }

    // Check sessionStorage
    for (var j = 0; j < keys.length; j++) {
        try {
            token = sessionStorage.getItem(keys[j]);
            if (token && token.trim() !== "") {
                return normalizeAuthToken(token);
            }
        } catch (e) {
            console.warn("Error reading sessionStorage:", e);
        }
    }

    return null;
}

/**
 * Normalize token by removing duplicate 'Bearer ' prefixes
 */
function normalizeAuthToken(token) {
    if (!token) return null;
    token = String(token).trim();
    if (token.toLowerCase().indexOf("bearer ") === 0) {
        token = token.substring(7).trim();
    }
    return token;
}

/**
 * Generate standard HTTP Authorization Headers
 */
function getAuthHeaders(includeJson) {
    var headers = {
        "Accept": "application/json"
    };

    if (includeJson !== false) {
        headers["Content-Type"] = "application/json";
    }

    var token = getAuthToken();
    if (token) {
        headers["Authorization"] = "Bearer " + token;
    }

    return headers;
}

/**
 * Retrieve logged in user ID
 */
function getLoggedInUserId() {
    var userId = localStorage.getItem("userId") || sessionStorage.getItem("userId");
    if (userId) return parseInt(userId, 10);

    try {
        var userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
        if (userStr) {
            var user = JSON.parse(userStr);
            if (user && (user.userId || user.id || user.user_id)) {
                return parseInt(user.userId || user.id || user.user_id, 10);
            }
        }
    } catch (e) {
        console.warn("Error parsing user object:", e);
    }
    return null;
}

/**
 * Retrieve logged in user display name
 */
function getLoggedInUserName() {
    var name = localStorage.getItem("userName") || localStorage.getItem("name") || sessionStorage.getItem("userName");
    if (name) return name;

    try {
        var userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
        if (userStr) {
            var user = JSON.parse(userStr);
            if (user && (user.name || user.userName || user.user_name)) {
                return user.name || user.userName || user.user_name;
            }
        }
    } catch (e) {
        console.warn("Error parsing user name:", e);
    }
    return "User";
}

/**
 * Clear all authentication session items
 */
function clearAuthSession() {
    try {
        localStorage.clear();
        sessionStorage.clear();
    } catch (e) {
        console.warn("Error clearing session storage:", e);
    }
}

/**
 * Global User Logout
 */
function logoutUser(redirectPath) {
    clearAuthSession();
    var redirect = redirectPath || "login.jsp";
    window.location.href = redirect;
}

/**
 * Global Admin Logout
 */
function adminLogout(redirectPath) {
    clearAuthSession();
    var redirect = redirectPath || "adminLogin.jsp";
    window.location.href = redirect;
}
