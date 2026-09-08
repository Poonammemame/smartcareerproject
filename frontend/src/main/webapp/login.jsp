<%@ page language="java" 
    contentType="text/html; charset=UTF-8" 
    pageEncoding="UTF-8"%> 
 
<!DOCTYPE html> 
<html lang="en"> 
 
<head> 
 
    <meta charset="UTF-8"> 
 
    <meta name="viewport" 
          content="width=device-width, initial-scale=1.0"> 
 
    <title>PathFinder | Login</title> 
 
    <link rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">

    <link rel="stylesheet" 
          href="${pageContext.request.contextPath}/CSS/login.css?v=20260907_3"> 
 
</head> 
 
<body> 
 
    <div class="login-container"> 
 
 
        <!-- ================= LEFT SIDE ================= --> 
 
        <div class="login-info"> 
 
            <div class="brand"> 
 
                <div class="brand-icon"> 
                    P 
                </div> 
 
                <span>PathFinder</span> 
 
            </div> 
 
 
            <div class="info-content"> 
 
                <span class="small-title"> 
                    WELCOME BACK 
                </span> 
 
                <h1> 
                    Continue your 
                    <span>career journey.</span> 
                </h1> 
 
                <p> 
                    Login to access your assessment, 
                    performance results and personalized 
                    career recommendations. 
                </p> 
 
 
                <div class="info-points"> 
 
                    <div> 
                        <span>✓</span> 
                        Take your online assessment 
                    </div> 
 
                    <div> 
                        <span>✓</span> 
                        Track your performance 
                    </div> 
 
                    <div> 
                        <span>✓</span> 
                        Discover suitable career paths 
                    </div> 
 
                </div> 
 
            </div> 
 
        </div> 
 
 
        <!-- ================= RIGHT SIDE ================= --> 
 
        <div class="login-box"> 
 
 
            <div class="form-header"> 
 
                <h2> 
                    Welcome Back 
                </h2> 
 
                <p> 
                    Login to your PathFinder account 
                </p> 
 
            </div> 
 
 
            <!-- ================= LOGIN FORM ================= --> 
 
            <form id="loginForm"> 
 
 
                <!-- EMAIL --> 
 
                <div class="form-group"> 
 
                    <label for="email"> 
                        Email Address 
                    </label> 
 
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        placeholder="Enter your email" 
                        autocomplete="email" 
                        required> 
 
                </div> 
 
 
                <!-- PASSWORD --> 
 
                <div class="form-group"> 
 
                    <div class="password-header"> 
 
                        <label for="password"> 
                            Password 
                        </label> 
 
                       
 
                    </div> 
 
                    <div class="password-input-wrapper">
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            placeholder="Enter your password" 
                            autocomplete="current-password" 
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
  <a href="forgotPassword.jsp" 
                           class="forgot-password"> 
                            Forgot Password? 
                        </a> 
 
                <!-- MESSAGE --> 
 
                <div id="message" 
                     class="message"> 
                </div> 
 
 
                <!-- LOGIN BUTTON --> 
 
                <button 
                    type="submit" 
                    id="loginBtn"> 
 
                    Login to PathFinder 
 
                </button> 
 
 
            </form> 
 
 
            <!-- ================= REGISTER ================= --> 
 
            <div class="register-link"> 
 
                Don't have an account? 
 
                <a href="register.jsp"> 
                    Create Account 
                </a> 
 
            </div> 
 
 
            <!-- ================= HOME ================= --> 
 
            <div class="back-home"> 
 
                <a href="index.jsp"> 
                    ← Back to Home 
                </a> 
 
            </div> 
 
        </div> 
 
    </div> 
 
 
    <!-- ================= CONFIG & LOGIN JS ================= --> 
 
    <script src="${pageContext.request.contextPath}/JS/config.js?v=20260908_1"></script> 
    <script src="${pageContext.request.contextPath}/JS/login.js?v=20260908_1"></script> 
 
</body> 
 
</html>