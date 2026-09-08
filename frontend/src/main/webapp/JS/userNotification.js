/* =========================================================
   PATHFINDER USER NOTIFICATION
   Assessment Assignment Notification
========================================================= */

console.log("======================================");
console.log("USER NOTIFICATION JS LOADED");
console.log("======================================");


/* =========================================================
   API
========================================================= */

function getNotificationBaseApi() {
    if (typeof API_ENDPOINTS !== "undefined" && API_ENDPOINTS.ASSESSMENT && API_ENDPOINTS.ASSESSMENT.USER) {
        return API_ENDPOINTS.ASSESSMENT.USER.replace(/\/$/, "");
    }
    var base = (typeof getApiBaseUrl === "function") ? getApiBaseUrl() : (window.API_BASE_URL || "http://localhost:8090/api");
    return base + "/assessment/user";
}


/* =========================================================
   DOM
========================================================= */

var notificationBtn = null;
var notificationDropdown = null;
var notificationList = null;
var notificationCount = null;
var notificationHeaderCount = null;
var markNotificationsRead = null;


/* =========================================================
   USER
========================================================= */

var currentUserId = null;


/* =========================================================
   LOCAL STORAGE KEY
========================================================= */

/*
 * IMPORTANT:
 *
 * We are NOT changing assessment.status.
 *
 * Assessment remains:
 *
 * ASSIGNED
 *
 * We store only the notification read state
 * in browser localStorage.
 */

var NOTIFICATION_READ_KEY =
    "pathfinder_notification_read_";


/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log("Notification DOM loaded");


        /* =================================================
           GET DOM ELEMENTS
        ================================================= */

        notificationBtn =
            document.getElementById(
                "notificationBtn"
            );


        notificationDropdown =
            document.getElementById(
                "notificationDropdown"
            );


        notificationList =
            document.getElementById(
                "notificationList"
            );


        notificationCount =
            document.getElementById(
                "notificationCount"
            );


        notificationHeaderCount =
            document.getElementById(
                "notificationHeaderCount"
            );


        markNotificationsRead =
            document.getElementById(
                "markNotificationsRead"
            );


        /* =================================================
           GET USER ID
        ================================================= */

        currentUserId =
            getUserId();


        console.log(
            "CURRENT USER ID:",
            currentUserId
        );


        /* =================================================
           NOTIFICATION BUTTON
        ================================================= */

        if (notificationBtn) {

            notificationBtn.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();

                    toggleNotificationDropdown();

                }
            );

        }


        /* =================================================
           MARK ALL READ
        ================================================= */

        if (markNotificationsRead) {

            markNotificationsRead.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    markAllNotificationsRead();

                }
            );

        }


        /* =================================================
           CLOSE DROPDOWN OUTSIDE CLICK
        ================================================= */

        document.addEventListener(
            "click",
            function (event) {

                if (
                    notificationDropdown &&
                    notificationBtn &&
                    !notificationDropdown.contains(
                        event.target
                    ) &&
                    !notificationBtn.contains(
                        event.target
                    )
                ) {

                    closeNotificationDropdown();

                }

            }
        );


        /* =================================================
           LOAD NOTIFICATIONS
        ================================================= */

        if (currentUserId) {

            loadAssessmentNotification();

        }
        else {

            console.warn(
                "User ID not found"
            );

            showNoNotifications();

        }

    }
);


/* =========================================================
   GET USER ID
========================================================= */

function getUserId() {

    var userId =
        localStorage.getItem(
            "userId"
        );


    if (!userId) {

        userId =
            sessionStorage.getItem(
                "userId"
            );

    }


    /* -----------------------------------------------
       USER OBJECT
    ------------------------------------------------ */

    if (!userId) {

        var userData =
            localStorage.getItem(
                "user"
            );


        if (userData) {

            try {

                var user =
                    JSON.parse(
                        userData
                    );


                userId =
                    user.userId ||
                    user.id ||
                    user.user_id;

            }
            catch (error) {

                console.error(
                    "User data parse error:",
                    error
                );

            }

        }

    }


    return userId;

}


/* =========================================================
   AUTH HEADERS
========================================================= */

function getAuthHeaders() {

    var token =
        localStorage.getItem(
            "token"
        );


    if (!token) {

        token =
            sessionStorage.getItem(
                "token"
            );

    }


    var headers = {

        "Content-Type":
            "application/json"

    };


    if (token) {

        headers["Authorization"] =
            "Bearer " + token;

    }


    return headers;

}


/* =========================================================
   NOTIFICATION STORAGE KEY
========================================================= */

/*
 * Example:
 *
 * userId = 5
 * assessmentId = 12
 *
 * localStorage key:
 *
 * pathfinder_notification_read_5_12
 *
 */

function getNotificationReadKey(
    assessmentId
) {

    return (
        NOTIFICATION_READ_KEY +
        currentUserId +
        "_" +
        assessmentId
    );

}


/* =========================================================
   CHECK WHETHER NOTIFICATION WAS READ
========================================================= */

function isNotificationRead(
    assessmentId
) {

    if (!currentUserId) {

        return false;

    }


    var key =
        getNotificationReadKey(
            assessmentId
        );


    return (
        localStorage.getItem(
            key
        ) === "true"
    );

}


/* =========================================================
   MARK NOTIFICATION AS READ
========================================================= */

function markNotificationAsRead(
    assessmentId
) {

    if (!currentUserId) {

        return;

    }


    var key =
        getNotificationReadKey(
            assessmentId
        );


    localStorage.setItem(
        key,
        "true"
    );


    console.log(
        "Notification marked as read:",
        key
    );

}


/* =========================================================
   LOAD ASSESSMENT NOTIFICATION
========================================================= */

function loadAssessmentNotification() {

    var url =
        getNotificationBaseApi() +
        "/" +
        encodeURIComponent(
            currentUserId
        );


    console.log(
        "NOTIFICATION URL:",
        url
    );


    fetch(
        url,
        {
            method: "GET",
            headers: getAuthHeaders()
        }
    )

    .then(
        function (response) {

            console.log(
                "NOTIFICATION STATUS:",
                response.status
            );


            if (!response.ok) {

                throw new Error(
                    "HTTP " +
                    response.status
                );

            }


            return response.json();

        }
    )

    .then(
        function (assignments) {

            console.log(
                "USER ASSIGNMENTS:",
                assignments
            );


            if (
                !Array.isArray(
                    assignments
                )
            ) {

                showNoNotifications();

                return;

            }


            processAssignments(
                assignments
            );

        }
    )

    .catch(
        function (error) {

            console.error(
                "NOTIFICATION ERROR:",
                error
            );


            showNoNotifications();

        }
    );

}


/* =========================================================
   PROCESS ASSIGNMENTS
========================================================= */

function processAssignments(
    assignments
) {

    var assignedAssessment =
        null;


    /*
     * Find an assigned assessment.
     *
     * We DO NOT change its status.
     */

    for (
        var i = 0;
        i < assignments.length;
        i++
    ) {

        var assignment =
            assignments[i];


        var status =
            String(
                assignment.status || ""
            )
            .trim()
            .toUpperCase();


        console.log(
            "ASSIGNMENT STATUS:",
            status
        );


        if (
            status === "ASSIGNED"
        ) {

            assignedAssessment =
                assignment;

            /*
             * If there are multiple assigned
             * assessments, use the first one.
             */

            break;

        }

    }


    /* =================================================
       NO ASSIGNED ASSESSMENT
    ================================================= */

    if (!assignedAssessment) {

        showNoNotifications();

        return;

    }


    /* =================================================
       SHOW ASSIGNED ASSESSMENT
    ================================================= */

    showAssessmentNotification(
        assignedAssessment
    );

}


/* =========================================================
   GET ASSESSMENT ID
========================================================= */

function getAssessmentId(assignment) {

    return (
        assignment.assignmentId ||
        assignment.assignment_id
    );

}

/* =========================================================
   SHOW ASSESSMENT NOTIFICATION
========================================================= */

function showAssessmentNotification(
    assignment
) {

    if (!notificationList) {

        return;

    }


    var assessmentId =
        getAssessmentId(
            assignment
        );


    console.log(
        "ASSESSMENT ID:",
        assessmentId
    );


    /*
     * If backend doesn't provide an ID,
     * create a stable fallback.
     */

    if (
        assessmentId === undefined ||
        assessmentId === null
    ) {

        assessmentId =
            "assigned";

    }


    var alreadyRead =
        isNotificationRead(
            assessmentId
        );


    console.log(
        "NOTIFICATION READ:",
        alreadyRead
    );


    /* =================================================
       NOTIFICATION HTML
    ================================================= */

    notificationList.innerHTML = `

        <div
            class="notification-item ${alreadyRead ? "" : "unread"}"
            id="assessmentNotificationItem"
            data-assessment-id="${assessmentId}">


            <div class="notification-item-icon">

                <i class="fa-solid fa-clipboard-check"></i>

            </div>


            <div class="notification-item-content">

                <strong>
                    Assessment Assigned
                </strong>


                <p>
                    Your online assessment is now available.
                </p>


                <span class="notification-time">

                    You can start your assessment now.

                </span>


                <button
                    type="button"
                    class="start-assessment-btn"
                    id="startAssessmentBtn">

                    <i class="fa-solid fa-play"></i>

                    Start Assessment

                </button>

            </div>


        </div>

    `;


    /* =================================================
       UPDATE COUNT
    ================================================= */

    if (alreadyRead) {

        updateNotificationCount(
            0
        );

    }
    else {

        updateNotificationCount(
            1
        );

    }


    /* =================================================
       START ASSESSMENT
    ================================================= */

    var startButton =
        document.getElementById(
            "startAssessmentBtn"
        );


    if (startButton) {

        startButton.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();


                /*
                 * Reading the notification
                 * does NOT change assessment status.
                 */

                markNotificationAsRead(
                    assessmentId
                );


                updateNotificationCount(
                    0
                );


                var item =
                    document.getElementById(
                        "assessmentNotificationItem"
                    );


                if (item) {

                    item.classList.remove(
                        "unread"
                    );

                }


                startAssessment();

            }
        );

    }


    /* =================================================
       CLICK NOTIFICATION ITEM
    ================================================= */

    var notificationItem =
        document.getElementById(
            "assessmentNotificationItem"
        );


    if (notificationItem) {

        notificationItem.addEventListener(
            "click",
            function (event) {

                /*
                 * Do not trigger twice when
                 * Start Assessment button clicked.
                 */

                if (
                    event.target.closest(
                        "#startAssessmentBtn"
                    )
                ) {

                    return;

                }


                markNotificationAsRead(
                    assessmentId
                );


                updateNotificationCount(
                    0
                );


                notificationItem.classList.remove(
                    "unread"
                );

            }
        );

    }

}


/* =========================================================
   NO NOTIFICATIONS
========================================================= */

function showNoNotifications() {

    if (!notificationList) {

        return;

    }


    notificationList.innerHTML = `

        <div class="notification-empty">

            <i class="fa-regular fa-bell-slash"></i>

            <p>
                No new notifications
            </p>

        </div>

    `;


    updateNotificationCount(
        0
    );

}


/* =========================================================
   UPDATE NOTIFICATION COUNT
========================================================= */

function updateNotificationCount(
    count
) {

    /* =================================================
       BELL COUNT
    ================================================= */

    if (notificationCount) {

        notificationCount.textContent =
            count;


        if (count > 0) {

            notificationCount.classList.add(
                "show"
            );

            notificationCount.style.display =
                "flex";

        }
        else {

            notificationCount.classList.remove(
                "show"
            );

            notificationCount.style.display =
                "none";

        }

    }


    /* =================================================
       HEADER COUNT
    ================================================= */

    if (notificationHeaderCount) {

        if (count > 0) {

            notificationHeaderCount.textContent =
                count +
                (
                    count === 1
                        ? " new"
                        : " new"
                );

        }
        else {

            notificationHeaderCount.textContent =
                "0 new";

        }

    }

}


/* =========================================================
   MARK ALL NOTIFICATIONS READ
========================================================= */

function markAllNotificationsRead() {

    console.log(
        "Marking all notifications as read..."
    );


    var item =
        document.getElementById(
            "assessmentNotificationItem"
        );


    if (item) {

        var assessmentId =
            item.getAttribute(
                "data-assessment-id"
            );


        if (assessmentId) {

            markNotificationAsRead(
                assessmentId
            );

        }


        item.classList.remove(
            "unread"
        );

    }


    /*
     * IMPORTANT:
     *
     * We ONLY mark the notification
     * as read.
     *
     * We DO NOT call backend to change
     * assessment status.
     */

    updateNotificationCount(
        0
    );


    /*
     * Update header text.
     */

    if (notificationHeaderCount) {

        notificationHeaderCount.textContent =
            "0 new";

    }

}


/* =========================================================
   OPEN / CLOSE DROPDOWN
========================================================= */

function toggleNotificationDropdown() {

    if (!notificationDropdown) {

        return;

    }


    notificationDropdown.classList.toggle(
        "show"
    );

}


function closeNotificationDropdown() {

    if (!notificationDropdown) {

        return;

    }


    notificationDropdown.classList.remove(
        "show"
    );

}


/* =========================================================
   START ASSESSMENT
========================================================= */

function startAssessment() {

    console.log(
        "Starting assessment..."
    );


    /*
     * Assessment status remains ASSIGNED.
     *
     * User is simply opening the assessment.
     */

    window.location.href =
        "takeAssessment.jsp";

}


/* =========================================================
   OPTIONAL:
   CLEAR READ STATE
========================================================= */

/*
 * Use this only when testing.
 *
 * Example from browser console:
 *
 * resetNotificationReadState();
 *
 */

function resetNotificationReadState() {

    if (!currentUserId) {

        return;

    }


    var prefix =
        NOTIFICATION_READ_KEY +
        currentUserId +
        "_";


    var keysToDelete = [];


    for (
        var i = 0;
        i < localStorage.length;
        i++
    ) {

        var key =
            localStorage.key(i);


        if (
            key &&
            key.indexOf(prefix) === 0
        ) {

            keysToDelete.push(
                key
            );

        }

    }


    for (
        var j = 0;
        j < keysToDelete.length;
        j++
    ) {

        localStorage.removeItem(
            keysToDelete[j]
        );

    }


    console.log(
        "Notification read state cleared."
    );


    loadAssessmentNotification();

}