<%@ page language="java"
    contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!-- ================= USER SIDEBAR ================= -->

<aside class="sidebar" id="sidebar">

    <!-- LOGO -->
    <div class="sidebar-logo">

        <div class="sidebar-logo-icon">
            P
        </div>

        <div class="sidebar-logo-text">
            <span class="logo-name">
                PathFinder
            </span>

            <span class="logo-subtitle">
                Career Intelligence
            </span>
        </div>

    </div>


    <!-- MAIN MENU -->

    <div class="menu-title">
        MAIN MENU
    </div>

    <nav class="sidebar-menu">

        <!-- DASHBOARD -->
        <a href="${pageContext.request.contextPath}/userDashboard.jsp"
           class="sidebar-link ${param.activePage == 'dashboard' ? 'active' : ''}">

            <span class="menu-icon">
                <i class="fa-solid fa-house"></i>
            </span>

            <span>Dashboard</span>

        </a>


        <!-- CAREER PROFILE -->
        <a href="${pageContext.request.contextPath}/profile.jsp"
           class="sidebar-link ${param.activePage == 'profile' ? 'active' : ''}">

            <span class="menu-icon">
                <i class="fa-solid fa-user"></i>
            </span>

            <span>Career Profile</span>

        </a>


        

        <!-- ASSESSMENT -->
        <a href="${pageContext.request.contextPath}/takeAssessment.jsp"
           class="sidebar-link ${param.activePage == 'assessment' ? 'active' : ''}">

            <span class="menu-icon">
                <i class="fa-solid fa-clipboard-check"></i>
            </span>

            <span>Take Assessment</span>

        </a>


        <!-- RESULTS -->
        <a href="${pageContext.request.contextPath}/userResults.jsp"
           class="sidebar-link ${param.activePage == 'results' ? 'active' : ''}">

            <span class="menu-icon">
                <i class="fa-solid fa-chart-column"></i>
            </span>

            <span>My Result</span>

        </a>

<!-- CAREER RECOMMENDATION -->
        <a href="${pageContext.request.contextPath}/careerRecommendation.jsp"
           class="sidebar-link ${param.activePage == 'career' ? 'active' : ''}">

            <span class="menu-icon">
                <i class="fa-solid fa-compass"></i>
            </span>

            <span>My Career Recommendation</span>

        </a>


 <!-- LEARNING ROADMAP -->
        <a href="${pageContext.request.contextPath}/learningRoadmap.jsp"
           class="sidebar-link ${param.activePage == 'roadmap' ? 'active' : ''}">

            <span class="menu-icon">
                <i class="fa-solid fa-route"></i>
            </span>

            <span>Learning Roadmap</span>

        </a>

    </nav>


    <!-- ACCOUNT -->

    <div class="menu-title account-title">
        ACCOUNT
    </div>

    <nav class="sidebar-menu">

        <!-- SETTINGS -->
        <a href="${pageContext.request.contextPath}/userSettings.jsp"
           class="sidebar-link ${param.activePage == 'settings' ? 'active' : ''}">

            <span class="menu-icon">
                <i class="fa-solid fa-gear"></i>
            </span>

            <span>Settings</span>

        </a>


        <!-- LOGOUT -->
        <a href="javascript:void(0)"
           class="sidebar-link logout-link"
           onclick="logoutUser('${pageContext.request.contextPath}/login.jsp')">

            <span class="menu-icon">
                <i class="fa-solid fa-right-from-bracket"></i>
            </span>

            <span>Logout</span>

        </a>

    </nav>


    <!-- HELP -->

    <div class="sidebar-bottom">

        <div class="help-box">

            <div class="help-icon">
                ?
            </div>

            <div class="help-text">

                <strong>Need Help?</strong>

                <span>Contact support</span>

            </div>

        </div>

    </div>

</aside>