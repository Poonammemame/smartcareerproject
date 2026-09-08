
<%@ page language="java"
    contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>PathFinder | Create Account</title>

    <link rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">

    <link rel="stylesheet"
          href="CSS/register.css?v=20260907_3">

</head>

<body>

<div class="register-container">


    <!-- ================= LEFT SIDE ================= -->

    <div class="register-info">

        <div class="brand">

            <div class="brand-icon">
                P
            </div>

            <span>PathFinder</span>

        </div>


        <div class="info-content">

            <span class="small-title">
                START YOUR JOURNEY
            </span>

            <h1>
                Build your
                <span>career path.</span>
            </h1>

            <p>
                Create your account and take the first
                step toward discovering a career that
                matches your skills and potential.
            </p>


            <div class="info-points">

                <div>
                    <span>✓</span>
                    Create your personal profile
                </div>

                <div>
                    <span>✓</span>
                    Take our online assessment
                </div>

                <div>
                    <span>✓</span>
                    Get personalized career recommendations
                </div>

            </div>

        </div>

    </div>


    <!-- ================= RIGHT SIDE ================= -->

    <div class="register-box">


        <div class="form-header">

            <h2>
                Create Account
            </h2>

            <p>
                Join PathFinder and discover your career
            </p>

        </div>


        <form id="registerForm">


            <!-- NAME -->

            <div class="form-group">

                <label for="name">
                    Full Name
                </label>

                <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    required>

            </div>


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
                    required>

            </div>


            <!-- PASSWORD -->

            <!-- PASSWORD -->
 
            <div class="form-group"> 
 
                <label for="password"> 
                    Password 
                </label> 
 
                <div class="password-input-wrapper">
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        placeholder="Create password" 
                        autocomplete="new-password" 
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
 
                <small class="password-hint"> 
                    Password must be 8+ characters with uppercase, lowercase, number & special character. 
                </small> 
 
            </div> 
 
 
            <div class="form-group"> 
 
                <label for="confirmPassword"> 
                    Confirm Password 
                </label> 
 
                <div class="password-input-wrapper">
                    <input 
                        type="password" 
                        id="confirmPassword" 
                        name="confirmPassword" 
                        placeholder="Confirm password" 
                        autocomplete="new-password" 
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
 
 
            <!-- MESSAGE --> 
 
            <div id="message" 
                 class="message"> 
            </div> 
 
 
            <!-- REGISTER BUTTON --> 
 
            <button 
                type="submit" 
                id="registerBtn"> 
 
                Create Account 
 
            </button> 
 
 
        </form> 
 
 
        <div class="login-link"> 
 
            Already have an account? 
 
            <a href="login.jsp"> 
                Login 
            </a> 
 
        </div> 
 
 
            <div class="back-home"> 
 
        <a href="index.jsp"> 
            ← Back to Home 
        </a> 
 
    </div> 
 
</div> 
 
<script src="${pageContext.request.contextPath}/JS/config.js?v=20260908_2"></script> 
<script src="${pageContext.request.contextPath}/JS/register.js?v=20260908_2"></script>

</body>
</html>