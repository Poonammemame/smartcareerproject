// ============================================================
// manageUsers.js
// PathFinder - Admin Manage Users
// SweetAlert2 Version
// Actions: Activate/Deactivate + Delete
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    let allUsers = [];
    let currentFilter = "ALL";


    const tableBody =
        document.getElementById("usersTableBody");

    const searchInput =
        document.getElementById("searchUser");

    const emptyState =
        document.getElementById("emptyState");


    // ========================================================
    // LOAD USERS
    // ========================================================

    loadUsers();


    function loadUsers() {

        const token =
            (typeof getAuthToken === "function") ? getAuthToken() : localStorage.getItem("token");


        if (!token) {

            window.location.href =
                "adminLogin.jsp";

            return;
        }

        const userAllUrl =
            (typeof API_ENDPOINTS !== "undefined" && API_ENDPOINTS.USER)
                ? API_ENDPOINTS.USER.ALL
                : "http://localhost:8090/api/user/all";

        fetch(
            userAllUrl,
            {
                method: "GET",

                headers: {
                    "Authorization":
                        "Bearer " + token
                }
            }
        )

        .then(function (response) {

            console.log(
                "Users API Status:",
                response.status
            );


            if (response.status === 401) {

                localStorage.clear();

                Swal.fire({
                    icon: "warning",
                    title: "Session Expired",
                    text: "Please login again.",
                    confirmButtonColor: "#2563eb"
                })
                .then(function () {

                    window.location.href =
                        "adminLogin.jsp";
                });

                return null;
            }


            if (response.status === 403) {

                throw new Error(
                    "Access denied. Admin authorization required."
                );
            }


            if (!response.ok) {

                throw new Error(
                    "Failed to load users. HTTP Status: "
                    + response.status
                );
            }


            return response.json();
        })


        .then(function (data) {

            if (data === null) {
                return;
            }


            console.log(
                "Users API Response:",
                data
            );


            if (!Array.isArray(data)) {

                console.error(
                    "Invalid API response:",
                    data
                );

                throw new Error(
                    "API response is not an array."
                );
            }


            allUsers = data;


            updateStatistics();

            displayUsers();
        })


        .catch(function (error) {

            console.error(
                "Load users error:",
                error
            );


            if (tableBody) {

                tableBody.innerHTML = `
                    <tr>
                        <td colspan="7">
                            <div class="loading-state">
                                Unable to load users.
                            </div>
                        </td>
                    </tr>
                `;
            }


            if (error.message !==
                "Access denied. Admin authorization required.") {

                Swal.fire({
                    icon: "error",
                    title: "Unable to Load Users",
                    text:
                        error.message ||
                        "Something went wrong.",
                    confirmButtonColor: "#2563eb"
                });
            }
        });
    }


    // ========================================================
    // UPDATE STATISTICS
    // ========================================================

    function updateStatistics() {

        let total =
            allUsers.length;

        let active = 0;

        let inactive = 0;

        let admins = 0;


        allUsers.forEach(function (user) {

            const status =
                String(user.status || "")
                    .toUpperCase();


            const role =
                String(user.role || "")
                    .toUpperCase();


            if (status === "ACTIVE") {

                active++;
            }


            if (status === "INACTIVE") {

                inactive++;
            }


            if (role === "ADMIN") {

                admins++;
            }

        });


        const totalElement =
            document.getElementById(
                "totalUsers"
            );


        const activeElement =
            document.getElementById(
                "activeUsers"
            );


        const inactiveElement =
            document.getElementById(
                "inactiveUsers"
            );


        const adminElement =
            document.getElementById(
                "adminUsers"
            );


        if (totalElement) {

            totalElement.textContent =
                total;
        }


        if (activeElement) {

            activeElement.textContent =
                active;
        }


        if (inactiveElement) {

            inactiveElement.textContent =
                inactive;
        }


        if (adminElement) {

            adminElement.textContent =
                admins;
        }
    }


    // ========================================================
    // DISPLAY USERS
    // ========================================================

    function displayUsers() {

        if (!tableBody) {

            return;
        }


        let searchText = "";


        if (searchInput) {

            searchText =
                searchInput.value
                    .trim()
                    .toLowerCase();
        }


        const filteredUsers =
            allUsers.filter(function (user) {

                const status =
                    String(user.status || "")
                        .toUpperCase();


                const name =
                    String(user.name || "")
                        .toLowerCase();


                const email =
                    String(user.email || "")
                        .toLowerCase();


                const filterMatch =
                    currentFilter === "ALL" ||
                    status === currentFilter;


                const searchMatch =
                    name.includes(searchText) ||
                    email.includes(searchText);


                return (
                    filterMatch &&
                    searchMatch
                );
            });


        tableBody.innerHTML = "";


        if (filteredUsers.length === 0) {

            if (emptyState) {

                emptyState.style.display =
                    "block";
            }

            return;
        }


        if (emptyState) {

            emptyState.style.display =
                "none";
        }


        filteredUsers.forEach(
            function (user, index) {

                createUserRow(
                    user,
                    index
                );
            }
        );
    }


    // ========================================================
    // CREATE USER ROW
    // ========================================================

    function createUserRow(
        user,
        index
    ) {

        const row =
            document.createElement("tr");


        const status =
            String(user.status || "")
                .toUpperCase();


        const role =
            String(user.role || "")
                .toUpperCase();


        let registeredDate =
            "-";


        if (user.createdAt) {

            const date =
                new Date(
                    user.createdAt
                );


            if (!isNaN(
                date.getTime()
            )) {

                registeredDate =
                    date.toLocaleDateString(
                        "en-IN",
                        {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        }
                    );
            }
        }


        // ====================================================
        // NUMBER
        // ====================================================

        const numberCell =
            document.createElement("td");


        numberCell.textContent =
            index + 1;


        // ====================================================
        // USER
        // ====================================================

        const userCell =
            document.createElement("td");


        const userInfo =
            document.createElement("div");


        userInfo.className =
            "user-info";


        const avatar =
            document.createElement("div");


        avatar.className =
            "user-avatar";


        avatar.textContent =
            getInitials(
                user.name
            );


        const nameContainer =
            document.createElement("div");


        const nameElement =
            document.createElement(
                "strong"
            );


        nameElement.className =
            "user-name";


        nameElement.textContent =
            user.name || "";


        nameContainer.appendChild(
            nameElement
        );


        userInfo.appendChild(
            avatar
        );


        userInfo.appendChild(
            nameContainer
        );


        userCell.appendChild(
            userInfo
        );


        // ====================================================
        // EMAIL
        // ====================================================

        const emailCell =
            document.createElement("td");


        emailCell.textContent =
            user.email || "";


        // ====================================================
        // ROLE
        // ====================================================

        const roleCell =
            document.createElement("td");


        const roleBadge =
            document.createElement(
                "span"
            );


        roleBadge.className =
            "role-badge " +
            role.toLowerCase();


        roleBadge.textContent =
            role;


        roleCell.appendChild(
            roleBadge
        );


        // ====================================================
        // STATUS
        // ====================================================

        const statusCell =
            document.createElement("td");


        const statusBadge =
            document.createElement(
                "span"
            );


        statusBadge.className =
            "status-badge " +
            status.toLowerCase();


        const statusIcon =
            document.createElement("i");


        if (status === "ACTIVE") {

            statusIcon.className =
                "fa-solid fa-circle-check";

        } else {

            statusIcon.className =
                "fa-solid fa-circle-xmark";
        }


        statusBadge.appendChild(
            statusIcon
        );


        statusBadge.appendChild(
            document.createTextNode(
                " " + status
            )
        );


        statusCell.appendChild(
            statusBadge
        );


        // ====================================================
        // REGISTERED DATE
        // ====================================================

        const dateCell =
            document.createElement("td");


        dateCell.textContent =
            registeredDate;


        // ====================================================
        // ACTIONS
        // ====================================================

        const actionCell =
            document.createElement("td");


        const actions =
            document.createElement("div");


        actions.className =
            "user-actions";


        // ====================================================
        // ACTIVATE / DEACTIVATE
        // ====================================================

        const statusButton =
            document.createElement(
                "button"
            );


        statusButton.type =
            "button";


        statusButton.className =
            "action-btn status-btn";


        statusButton.title =
            status === "ACTIVE"
                ? "Deactivate User"
                : "Activate User";


        statusButton.dataset.id =
            user.userId;


        statusButton.dataset.status =
            status;


        const statusButtonIcon =
            document.createElement("i");


        if (status === "ACTIVE") {

            statusButtonIcon.className =
                "fa-solid fa-user-slash";

        } else {

            statusButtonIcon.className =
                "fa-solid fa-user-check";
        }


        statusButton.appendChild(
            statusButtonIcon
        );


        statusButton.addEventListener(
            "click",
            function () {

                changeStatus(
                    user.userId,
                    status
                );
            }
        );


        // ====================================================
        // DELETE
        // ====================================================

        const deleteButton =
            document.createElement(
                "button"
            );


        deleteButton.type =
            "button";


        deleteButton.className =
            "action-btn delete-btn";


        deleteButton.title =
            "Delete User";


        deleteButton.dataset.id =
            user.userId;


        const deleteIcon =
            document.createElement("i");


        deleteIcon.className =
            "fa-solid fa-trash";


        deleteButton.appendChild(
            deleteIcon
        );


        deleteButton.addEventListener(
            "click",
            function () {

                deleteUser(
                    user.userId
                );
            }
        );


        // ====================================================
        // ADD ONLY TWO ACTION BUTTONS
        // ====================================================

        actions.appendChild(
            statusButton
        );


        actions.appendChild(
            deleteButton
        );


        actionCell.appendChild(
            actions
        );


        // ====================================================
        // ADD CELLS
        // ====================================================

        row.appendChild(
            numberCell
        );


        row.appendChild(
            userCell
        );


        row.appendChild(
            emailCell
        );


        row.appendChild(
            roleCell
        );


        row.appendChild(
            statusCell
        );


        row.appendChild(
            dateCell
        );


        row.appendChild(
            actionCell
        );


        tableBody.appendChild(
            row
        );
    }


    // ========================================================
    // CHANGE USER STATUS
    // SWEET ALERT
    // ========================================================

    function changeStatus(
        userId,
        currentStatus
    ) {

        const newStatus =
            currentStatus === "ACTIVE"
                ? "INACTIVE"
                : "ACTIVE";


        const actionText =
            newStatus === "ACTIVE"
                ? "activate"
                : "deactivate";


        Swal.fire({

            title:
                "Change User Status?",

            text:
                "Do you want to "
                + actionText
                + " this user?",

            icon:
                "question",

            showCancelButton:
                true,

            confirmButtonText:
                "Yes, "
                + actionText,

            cancelButtonText:
                "Cancel",

            confirmButtonColor:
                newStatus === "ACTIVE"
                    ? "#16a34a"
                    : "#ea580c",

            cancelButtonColor:
                "#64748b",

            reverseButtons:
                true
        })


        .then(function (result) {

            if (!result.isConfirmed) {

                return;
            }


            const token =
                localStorage.getItem(
                    "token"
                );


            if (!token) {

                Swal.fire({

                    icon:
                        "warning",

                    title:
                        "Session Expired",

                    text:
                        "Please login again.",

                    confirmButtonColor:
                        "#2563eb"
                })
                .then(function () {

                    window.location.href =
                        "adminLogin.jsp";
                });


                return;
            }


            // =================================================
            // API CALL
            // =================================================

            const statusBaseUrl =
                (typeof API_ENDPOINTS !== "undefined" && API_ENDPOINTS.USER)
                    ? API_ENDPOINTS.USER.STATUS
                    : "http://localhost:8090/api/user/status/";

            fetch(
                statusBaseUrl
                + userId
                + "/"
                + newStatus,
                {
                    method: "PUT",

                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            )


            .then(function (response) {

                console.log(
                    "Status API:",
                    response.status
                );


                if (response.status === 401) {

                    localStorage.clear();

                    throw new Error(
                        "SESSION_EXPIRED"
                    );
                }


                if (response.status === 403) {

                    throw new Error(
                        "Access denied. Admin authorization required."
                    );
                }


                if (!response.ok) {

                    throw new Error(
                        "Status update failed. HTTP Status: "
                        + response.status
                    );
                }


                return response.text();
            })


            .then(function (message) {

                Swal.fire({

                    icon:
                        "success",

                    title:
                        newStatus === "ACTIVE"
                            ? "User Activated"
                            : "User Deactivated",

                    text:
                        message ||
                        "User status updated successfully.",

                    confirmButtonColor:
                        "#2563eb",

                    timer:
                        1800,

                    showConfirmButton:
                        false
                });


                loadUsers();
            })


            .catch(function (error) {

                console.error(
                    "Status update error:",
                    error
                );


                if (
                    error.message ===
                    "SESSION_EXPIRED"
                ) {

                    Swal.fire({

                        icon:
                            "warning",

                        title:
                            "Session Expired",

                        text:
                            "Please login again.",

                        confirmButtonColor:
                            "#2563eb"
                    })
                    .then(function () {

                        window.location.href =
                            "adminLogin.jsp";
                    });


                    return;
                }


                Swal.fire({

                    icon:
                        "error",

                    title:
                        "Update Failed",

                    text:
                        error.message ||
                        "Unable to update user status.",

                    confirmButtonColor:
                        "#2563eb"
                });
            });

        });
    }


    // ========================================================
    // DELETE USER
    // SWEET ALERT
    // ========================================================

    function deleteUser(userId) {

        Swal.fire({

            title:
                "Delete User?",

            text:
                "This user will be permanently deleted.",

            icon:
                "warning",

            showCancelButton:
                true,

            confirmButtonText:
                "Yes, Delete",

            cancelButtonText:
                "Cancel",

            confirmButtonColor:
                "#dc2626",

            cancelButtonColor:
                "#64748b",

            reverseButtons:
                true
        })


        .then(function (result) {

            if (!result.isConfirmed) {

                return;
            }


            const token =
                localStorage.getItem(
                    "token"
                );


            if (!token) {

                Swal.fire({

                    icon:
                        "warning",

                    title:
                        "Session Expired",

                    text:
                        "Please login again.",

                    confirmButtonColor:
                        "#2563eb"
                })
                .then(function () {

                    window.location.href =
                        "adminLogin.jsp";
                });


                return;
            }


            // =================================================
            // LOADING
            // =================================================

            Swal.fire({

                title:
                    "Deleting User...",

                text:
                    "Please wait.",

                allowOutsideClick:
                    false,

                allowEscapeKey:
                    false,

                showConfirmButton:
                    false,

                didOpen:
                    function () {

                        Swal.showLoading();
                    }
            });


            // =================================================
            // DELETE API
            // =================================================

            const deleteBaseUrl =
                (typeof API_ENDPOINTS !== "undefined" && API_ENDPOINTS.USER)
                    ? API_ENDPOINTS.USER.DELETE
                    : "http://localhost:8090/api/user/delete/";

            fetch(
                deleteBaseUrl
                + userId,
                {
                    method: "DELETE",

                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            )


            .then(function (response) {

                console.log(
                    "Delete API Status:",
                    response.status
                );


                if (response.status === 401) {

                    localStorage.clear();

                    throw new Error(
                        "SESSION_EXPIRED"
                    );
                }


                if (response.status === 403) {

                    throw new Error(
                        "Access denied. Admin authorization required."
                    );
                }


                if (!response.ok) {

                    throw new Error(
                        "Delete failed. HTTP Status: "
                        + response.status
                    );
                }


                return response.text();
            })


            .then(function (message) {

                Swal.fire({

                    icon:
                        "success",

                    title:
                        "User Deleted",

                    text:
                        message ||
                        "User deleted successfully.",

                    confirmButtonColor:
                        "#2563eb",

                    timer:
                        1800,

                    showConfirmButton:
                        false
                });


                loadUsers();
            })


            .catch(function (error) {

                console.error(
                    "Delete user error:",
                    error
                );


                if (
                    error.message ===
                    "SESSION_EXPIRED"
                ) {

                    Swal.fire({

                        icon:
                            "warning",

                        title:
                            "Session Expired",

                        text:
                            "Please login again.",

                        confirmButtonColor:
                            "#2563eb"
                    })
                    .then(function () {

                        window.location.href =
                            "adminLogin.jsp";
                    });


                    return;
                }


                Swal.fire({

                    icon:
                        "error",

                    title:
                        "Delete Failed",

                    text:
                        error.message ||
                        "Unable to delete user.",

                    confirmButtonColor:
                        "#2563eb"
                });
            });

        });
    }


    // ========================================================
    // SEARCH
    // ========================================================

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                displayUsers();
            }
        );
    }


    // ========================================================
    // FILTER BUTTONS
    // ========================================================

    const filterButtons =
        document.querySelectorAll(
            ".filter-btn"
        );


    filterButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    filterButtons.forEach(
                        function (btn) {

                            btn.classList.remove(
                                "active"
                            );
                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    currentFilter =
                        button.dataset.filter;


                    displayUsers();
                }
            );
        }
    );


    // ========================================================
    // GET INITIALS
    // ========================================================

    function getInitials(name) {

        if (!name) {

            return "U";
        }


        const parts =
            String(name)
                .trim()
                .split(/\s+/);


        if (parts.length === 1) {

            return parts[0]
                .substring(0, 2)
                .toUpperCase();
        }


        return (
            parts[0].charAt(0)
            +
            parts[
                parts.length - 1
            ].charAt(0)
        ).toUpperCase();
    }

});