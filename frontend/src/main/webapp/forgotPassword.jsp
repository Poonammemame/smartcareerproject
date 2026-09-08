<%@ page language="java"
    contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>PathFinder | Forgot Password</title>

    <link rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">

    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/CSS/forgotPassword.css?v=20260907_3">

</head>

<body>

    <div class="forgot-container">

        <!-- ================= LEFT SIDE ================= -->

        <div class="forgot-info">

            <div class="brand">

                <div class="brand-icon">
                    P
                </div>

                <span>PathFinder</span>

            </div>


            <div class="info-content">

                <span class="small-title">
                    ACCOUNT RECOVERY
                </span>

                <h1>
                    Reset your
                    <span>password.</span>
                </h1>

                <p>
                    Don't worry if you forgot your password.
                    Enter your registered email address and
                    we'll help you securely recover your account.
                </p>


                <div class="info-points">

                    <div>
                        <span>✓</span>
                        Verify your email
                    </div>

                    <div>
                        <span>✓</span>
                        Verify your OTP
                    </div>

                    <div>
                        <span>✓</span>
                        Create a new password
                    </div>

                </div>

            </div>

        </div>


        <!-- ================= RIGHT SIDE ================= -->

        <div class="forgot-box">


            <div class="form-header">

                <h2>
                    Forgot Password?
                </h2>

                <p>
                    Enter your registered email address
                </p>

            </div>


            <!-- ================= STEP 1 ================= -->

            <div id="emailStep">

                <div class="form-group">

                    <label for="email">
                        Email Address
                    </label>

                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your registered email"
                        autocomplete="email"
                        required>

                </div>


                <div id="message"
                     class="message">
                </div>


                <button
                    type="button"
                    id="sendOtpBtn">

                    Send OTP

                </button>

            </div>


            <!-- ================= STEP 2 ================= -->

            <div id="otpStep"
                 class="hidden">

                <div class="form-group">

                    <label for="otp">
                        Enter OTP
                    </label>

                    <input
                        type="text"
                        id="otp"
                        maxlength="6"
                        placeholder="Enter 6-digit OTP">

                </div>


                <div id="otpMessage"
                     class="message">
                </div>


                <button
                    type="button"
                    id="verifyOtpBtn">

                    Verify OTP

                </button>

            </div>


            <!-- ================= STEP 3 ================= -->

            <div id="passwordStep"
                 class="hidden">

                <div class="form-group">

                    <label for="newPassword">
                        New Password
                    </label>

                    <div class="password-input-wrapper">
                        <input
                            type="password"
                            id="newPassword"
                            placeholder="Enter new password">
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


                <div class="form-group">

                    <label for="confirmPassword">
                        Confirm Password
                    </label>

                    <div class="password-input-wrapper">
                        <input
                            type="password"
                            id="confirmPassword"
                            placeholder="Confirm new password">
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


                <div id="passwordMessage"
                     class="message">
                </div>


                <button
                    type="button"
                    id="resetPasswordBtn">

                    Reset Password

                </button>

            </div>


            <!-- ================= BACK TO LOGIN ================= -->

            <div class="back-login">

                <a href="login.jsp">
                    ← Back to Login
                </a>

            </div>

        </div>

    </div>


    <script src="${pageContext.request.contextPath}/JS/config.js?v=20260908_2"></script>
    <script src="${pageContext.request.contextPath}/JS/forgotPassword.js?v=20260908_2"></script>

</body>

</html>