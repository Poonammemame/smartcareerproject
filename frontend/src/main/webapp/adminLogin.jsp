
<%@ page language="java"
    contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>PathFinder | Admin Login</title>

    <link rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">

   <link rel="stylesheet"
      href="${pageContext.request.contextPath}/CSS/adminLogin.css?v=20260907_3">
</head>

<body>

<div class="admin-container">


    <!-- ================= LEFT PANEL ================= -->

    <div class="admin-info">

        <div class="brand">

            <div class="brand-icon">
                P
            </div>

            <span>
                PathFinder
            </span>

        </div>


        <div class="admin-content">

            <div class="admin-symbol">
                ⚙
            </div>

            <span class="admin-label">
                ADMINISTRATION
            </span>

            <h1>
                Manage your
                <span>career platform.</span>
            </h1>

            <p>
                Access the PathFinder administration
                panel to manage users, questions,
                assessments and career recommendations.
            </p>

        </div>

    </div>


    <!-- ================= LOGIN PANEL ================= -->

    <div class="admin-login-box">


        <div class="form-header">

            <div class="lock-icon">
                🔐
            </div>

            <h2>
                Admin Login
            </h2>

            <p>
                Sign in to access the administration panel
            </p>

        </div>


        <form id="adminLoginForm">


            <!-- EMAIL -->

            <div class="form-group">

                <label for="email">
                    Admin Email
                </label>

                <input
                    type="email"
                    id="email"
                    placeholder="Enter admin email"
                    required>

            </div>


            <!-- PASSWORD -->

            <div class="form-group">

                <label for="password">
                    Password
                </label>

                <div class="password-input-wrapper">
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter admin password"
                        required>
                    <button
                        type="button"
                        class="password-toggle-btn"
                        aria-label="Show password"
                        title="Show password"
                        tabindex="-1">
                        <i class="fa-solid fa-eye-slash"></i>
                    </button>
                </div>

            </div>


            <div id="message"
                 class="message">
            </div>


            <button
                type="submit"
                id="adminLoginBtn">

                Login as Administrator

            </button>


        </form>


        <div class="back-link">

            <a href="index.jsp">
                ← Back to PathFinder
            </a>

        </div>


        <div class="security-note">

            🔒 Authorized administrators only

        </div>

    </div>

</div>


<script src="${pageContext.request.contextPath}/JS/config.js?v=20260908_2"></script>
<script src="${pageContext.request.contextPath}/JS/adminLogin.js?v=20260908_2"></script>

</body>

</html>

