<%@ page language="java"
    contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<%
    request.setAttribute("activePage", "settings");

    String userName = (String) session.getAttribute("userName");

    if (userName == null) {
        userName = "";
    }

    String userEmail = (String) session.getAttribute("userEmail");

    if (userEmail == null) {
        userEmail = "";
    }
%>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>PathFinder | Settings</title>


    <!-- FONT AWESOME -->

    <link rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">


    <!-- DASHBOARD CSS -->

    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/CSS/userDashboard.css">


    <!-- SETTINGS CSS -->

    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/CSS/userSettings.css">

    <!-- CONFIG JS -->
    <script src="${pageContext.request.contextPath}/JS/config.js"></script>

</head>


<body>


<div class="app-layout">


    <!-- =====================================================
         SIDEBAR
    ====================================================== -->

    <jsp:include page="common/usersidebar.jsp">
        <jsp:param name="activePage" value="settings"/>
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
             SETTINGS PAGE
        ================================================== -->

        <main class="settings-page">


            <!-- PAGE HEADER -->

            <section class="settings-page-header">

                <div>

                    <span class="settings-label">
                        ACCOUNT SETTINGS
                    </span>

                    <h1>
                        Settings
                    </h1>

                    <p>
                        Manage your profile, security and
                        preferences.
                    </p>

                </div>

            </section>



            <!-- =================================================
                 SETTINGS CONTAINER
            ================================================== -->

            <div class="settings-container">


                <!-- =================================================
                     SETTINGS NAVIGATION
                ================================================== -->

                <aside class="settings-sidebar">


                    <button
                        type="button"
                        class="settings-nav active"
                        data-section="profile">

                        <span class="settings-nav-icon">
                            <i class="fa-solid fa-user"></i>
                        </span>

                        <span>
                            Profile
                        </span>

                    </button>


                    <button
                        type="button"
                        class="settings-nav"
                        data-section="security">

                        <span class="settings-nav-icon">
                            <i class="fa-solid fa-shield-halved"></i>
                        </span>

                        <span>
                            Security
                        </span>

                    </button>


                    <button
                        type="button"
                        class="settings-nav"
                        data-section="notifications">

                        <span class="settings-nav-icon">
                            <i class="fa-solid fa-bell"></i>
                        </span>

                        <span>
                            Notifications
                        </span>

                    </button>


                    <button
                        type="button"
                        class="settings-nav"
                        data-section="preferences">

                        <span class="settings-nav-icon">
                            <i class="fa-solid fa-sliders"></i>
                        </span>

                        <span>
                            Preferences
                        </span>

                    </button>


                    <button
                        type="button"
                        class="settings-nav"
                        data-section="account">

                        <span class="settings-nav-icon">
                            <i class="fa-solid fa-circle-info"></i>
                        </span>

                        <span>
                            Account
                        </span>

                    </button>


                </aside>



                <!-- =================================================
                     SETTINGS CONTENT
                ================================================== -->

                <div class="settings-content">


                    <!-- =================================================
                         PROFILE
                    ================================================== -->

                    <section
                        id="profile"
                        class="settings-section active">


                        <div class="settings-section-header">

                            <div>

                                <span class="section-label">
                                    PERSONAL INFORMATION
                                </span>

                                <h2>
                                    Profile Information
                                </h2>

                                <p>
                                    Update your personal information.
                                </p>

                            </div>

                            <div class="section-header-icon blue">

                                <i class="fa-solid fa-user"></i>

                            </div>

                        </div>



                        <!-- PROFILE AVATAR -->

                        <div class="profile-box">

                            <div class="profile-avatar">

                                <span id="profileInitial">
                                    <%= userName.isEmpty()
                                        ? "U"
                                        : userName.substring(0,1).toUpperCase() %>
                                </span>

                            </div>

                            <div>

                                <h3 id="profileDisplayName">
                                    <%= userName %>
                                </h3>

                                <p>
                                    PathFinder User
                                </p>

                            </div>

                        </div>



                        <!-- FORM -->

                        <form id="profileForm">


                            <div class="form-grid">


                                <div class="form-group">

                                    <label for="userName">
                                        Full Name
                                    </label>

                                    <div class="input-wrapper">

                                        <i class="fa-solid fa-user"></i>

                                        <input
                                            type="text"
                                            id="userName"
                                            name="userName"
                                            value="<%= userName %>"
                                            placeholder="Enter your name">

                                    </div>

                                </div>



                                <div class="form-group">

                                    <label for="userEmail">
                                        Email Address
                                    </label>

                                    <div class="input-wrapper">

                                        <i class="fa-solid fa-envelope"></i>

                                        <input
                                            type="email"
                                            id="userEmail"
                                            name="userEmail"
                                            value="<%= userEmail %>"
                                            placeholder="Enter your email">

                                    </div>

                                </div>



                                
                            </div>



                            <div class="form-actions">

                                <button
                                    type="button"
                                    class="cancel-btn"
                                    id="profileCancelBtn">

                                    Cancel

                                </button>

                                <button
                                    type="submit"
                                    class="save-btn">

                                    <i class="fa-solid fa-check"></i>

                                    Save Changes

                                </button>

                            </div>


                        </form>


                    </section>



                    <!-- =================================================
                         SECURITY
                    ================================================== -->

                    <section
                        id="security"
                        class="settings-section">


                        <div class="settings-section-header">

                            <div>

                                <span class="section-label">
                                    ACCOUNT SECURITY
                                </span>

                                <h2>
                                    Change Password
                                </h2>

                                <p>
                                    Keep your account secure by using
                                    a strong password.
                                </p>

                            </div>

                            <div class="section-header-icon purple">

                                <i class="fa-solid fa-lock"></i>

                            </div>

                        </div>



                        <form id="passwordForm">


                            <div class="password-form">


                                <div class="form-group">

                                    <label>
                                        Current Password
                                    </label>

                                    <div class="password-wrapper">

                                        <input
                                            type="password"
                                            id="currentPassword"
                                            placeholder="Enter current password">

                                        <button
                                            type="button"
                                            class="password-toggle"
                                            data-target="currentPassword">

                                            <i class="fa-solid fa-eye"></i>

                                        </button>

                                    </div>

                                </div>



                                <div class="form-group">

                                    <label>
                                        New Password
                                    </label>

                                    <div class="password-wrapper">

                                        <input
                                            type="password"
                                            id="newPassword"
                                            placeholder="Enter new password">

                                        <button
                                            type="button"
                                            class="password-toggle"
                                            data-target="newPassword">

                                            <i class="fa-solid fa-eye"></i>

                                        </button>

                                    </div>

                                </div>



                                <div class="form-group">

                                    <label>
                                        Confirm New Password
                                    </label>

                                    <div class="password-wrapper">

                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            placeholder="Confirm new password">

                                        <button
                                            type="button"
                                            class="password-toggle"
                                            data-target="confirmPassword">

                                            <i class="fa-solid fa-eye"></i>

                                        </button>

                                    </div>

                                </div>


                            </div>



                            <div class="password-hint">

                                <i class="fa-solid fa-circle-info"></i>

                                Password should contain at least
                                8 characters.

                            </div>



                            <div class="form-actions">

                                <button
                                    type="submit"
                                    class="save-btn">

                                    <i class="fa-solid fa-key"></i>

                                    Update Password

                                </button>

                            </div>


                        </form>


                    </section>



                    <!-- =================================================
                         NOTIFICATIONS
                    ================================================== -->

                    <section
                        id="notifications"
                        class="settings-section">


                        <div class="settings-section-header">

                            <div>

                                <span class="section-label">
                                    NOTIFICATION SETTINGS
                                </span>

                                <h2>
                                    Notifications
                                </h2>

                                <p>
                                    Choose what notifications you want
                                    to receive.
                                </p>

                            </div>

                            <div class="section-header-icon orange">

                                <i class="fa-solid fa-bell"></i>

                            </div>

                        </div>



                        <div class="preference-list">


                            <div class="preference-item">

                                <div class="preference-icon blue">

                                    <i class="fa-solid fa-route"></i>

                                </div>

                                <div class="preference-info">

                                    <h3>
                                        Career Recommendations
                                    </h3>

                                    <p>
                                        Receive updates about your
                                        career recommendations.
                                    </p>

                                </div>

                                <label class="switch">

                                    <input
                                        type="checkbox"
                                        id="careerNotification"
                                        checked>

                                    <span class="slider"></span>

                                </label>

                            </div>



                            <div class="preference-item">

                                <div class="preference-icon purple">

                                    <i class="fa-solid fa-book-open"></i>

                                </div>

                                <div class="preference-info">

                                    <h3>
                                        Learning Roadmap
                                    </h3>

                                    <p>
                                        Get reminders about your
                                        learning progress.
                                    </p>

                                </div>

                                <label class="switch">

                                    <input
                                        type="checkbox"
                                        id="roadmapNotification"
                                        checked>

                                    <span class="slider"></span>

                                </label>

                            </div>



                            <div class="preference-item">

                                <div class="preference-icon green">

                                    <i class="fa-solid fa-clipboard-check"></i>

                                </div>

                                <div class="preference-info">

                                    <h3>
                                        Assessment Updates
                                    </h3>

                                    <p>
                                        Receive assessment and result
                                        notifications.
                                    </p>

                                </div>

                                <label class="switch">

                                    <input
                                        type="checkbox"
                                        id="assessmentNotification"
                                        checked>

                                    <span class="slider"></span>

                                </label>

                            </div>



                            <div class="preference-item">

                                <div class="preference-icon orange">

                                    <i class="fa-solid fa-envelope"></i>

                                </div>

                                <div class="preference-info">

                                    <h3>
                                        Email Notifications
                                    </h3>

                                    <p>
                                        Receive important updates
                                        through email.
                                    </p>

                                </div>

                                <label class="switch">

                                    <input
                                        type="checkbox"
                                        id="emailNotification">

                                    <span class="slider"></span>

                                </label>

                            </div>


                        </div>


                        <div class="form-actions">

                            <button
                                type="button"
                                class="save-btn"
                                id="saveNotifications">

                                <i class="fa-solid fa-check"></i>

                                Save Preferences

                            </button>

                        </div>


                    </section>



                    <!-- =================================================
                         PREFERENCES
                    ================================================== -->

                    <section
                        id="preferences"
                        class="settings-section">


                        <div class="settings-section-header">

                            <div>

                                <span class="section-label">
                                    APP PREFERENCES
                                </span>

                                <h2>
                                    Preferences
                                </h2>

                                <p>
                                    Customize your PathFinder experience.
                                </p>

                            </div>

                            <div class="section-header-icon green">

                                <i class="fa-solid fa-sliders"></i>

                            </div>

                        </div>



                        <div class="preference-list">


                            <div class="preference-item">

                                <div class="preference-icon blue">

                                    <i class="fa-solid fa-moon"></i>

                                </div>

                                <div class="preference-info">

                                    <h3>
                                        Dark Mode
                                    </h3>

                                    <p>
                                        Use a darker appearance for
                                        the application.
                                    </p>

                                </div>

                                <label class="switch">

                                    <input
                                        type="checkbox"
                                        id="darkMode">

                                    <span class="slider"></span>

                                </label>

                            </div>



                            <div class="preference-item">

                                <div class="preference-icon purple">

                                    <i class="fa-solid fa-chart-line"></i>

                                </div>

                                <div class="preference-info">

                                    <h3>
                                        Performance Insights
                                    </h3>

                                    <p>
                                        Show detailed performance
                                        insights on your dashboard.
                                    </p>

                                </div>

                                <label class="switch">

                                    <input
                                        type="checkbox"
                                        id="performanceInsights"
                                        checked>

                                    <span class="slider"></span>

                                </label>

                            </div>


                        </div>


                    </section>



                    <!-- =================================================
                         ACCOUNT
                    ================================================== -->

                    <section
                        id="account"
                        class="settings-section">


                        <div class="settings-section-header">

                            <div>

                                <span class="section-label">
                                    ACCOUNT INFORMATION
                                </span>

                                <h2>
                                    Account
                                </h2>

                                <p>
                                    Information about your PathFinder
                                    account.
                                </p>

                            </div>

                            <div class="section-header-icon blue">

                                <i class="fa-solid fa-circle-info"></i>

                            </div>

                        </div>



                        <div class="account-info-list">


                            <div class="account-info-row">

                                <span>
                                    <i class="fa-solid fa-user"></i>
                                    Account Name
                                </span>

                                <strong>
                                    <%= userName %>
                                </strong>

                            </div>



                            <div class="account-info-row">

                                <span>
                                    <i class="fa-solid fa-envelope"></i>
                                    Email
                                </span>

                                <strong>
                                    <%= userEmail %>
                                </strong>

                            </div>



                            <div class="account-info-row">

                                <span>
                                    <i class="fa-solid fa-shield-halved"></i>
                                    Account Status
                                </span>

                                <strong class="status-active">
                                    Active
                                </strong>

                            </div>



                            <div class="account-info-row">

                                <span>
                                    <i class="fa-solid fa-calendar"></i>
                                    Platform
                                </span>

                                <strong>
                                    PathFinder
                                </strong>

                            </div>


                        </div>


                    </section>


                </div>

            </div>


        </main>

    </div>

</div>



<!-- =====================================================
     JAVASCRIPT
====================================================== -->

<script src="${pageContext.request.contextPath}/JS/config.js"></script>
<script src="${pageContext.request.contextPath}/JS/userSettings.js?v=1"></script>


</body>

</html>