package org.techhub.service;

import java.security.SecureRandom;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.techhub.dto.request.ForgotPasswordRequest;
import org.techhub.dto.request.ResetPasswordRequest;
import org.techhub.dto.request.VerifyOtpRequest;
import org.techhub.repository.ForgotPasswordRepository;

@Service
public class ForgotPasswordService {

    // ============================================================
    // OTP STORAGE
    // ============================================================

    private final Map<String, OtpData> otpStorage =
            new ConcurrentHashMap<>();


    // ============================================================
    // DEPENDENCIES
    // ============================================================

    private final ForgotPasswordRepository forgotPasswordRepository;

    private final PasswordEncoder passwordEncoder;

    private final EmailService emailService;


    // ============================================================
    // OTP EXPIRATION
    // 10 MINUTES
    // ============================================================

    private static final long OTP_EXPIRATION_TIME =
            10 * 60 * 1000;


    // ============================================================
    // CONSTRUCTOR
    // ============================================================

    public ForgotPasswordService(
            ForgotPasswordRepository forgotPasswordRepository,
            PasswordEncoder passwordEncoder,
            EmailService emailService) {

        this.forgotPasswordRepository =
                forgotPasswordRepository;

        this.passwordEncoder =
                passwordEncoder;

        this.emailService =
                emailService;
    }


    // ============================================================
    // FORGOT PASSWORD - SEND REAL EMAIL OTP
    // ============================================================

    public String sendOtp(
            ForgotPasswordRequest request) {

        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();


        // ========================================================
        // CHECK EMAIL
        // ========================================================

        boolean emailExists =
                forgotPasswordRepository
                        .isEmailExists(email);


        if (!emailExists) {

            return "Email address not found in system.";
        }


        // ========================================================
        // GENERATE OTP
        // ========================================================

        String otp =
                generateOtp();


        // ========================================================
        // STORE OTP
        // ========================================================

        otpStorage.put(
                email,
                new OtpData(
                        otp,
                        System.currentTimeMillis()
                )
        );


        // ========================================================
        // SEND EMAIL VIA GMAIL SMTP
        // ========================================================

        boolean emailSent = false;
        try {
            emailSent = emailService.sendOtpEmail(email, otp);
        } catch (Exception e) {
            System.err.println("⚠️ [EMAIL SERVICE] SMTP dispatch error: " + e.getMessage());
        }

        System.out.println("========================================");
        System.out.println("PASSWORD RESET OTP GENERATED");
        System.out.println("Email      : " + email);
        System.out.println("OTP        : " + otp);
        System.out.println("Email Sent : " + emailSent);
        System.out.println("========================================");

        if (emailSent) {
            return "OTP has been sent successfully to " + email;
        } else {
            return "OTP generated successfully. (Check email or console for code: " + otp + ")";
        }
    }


    // ============================================================
    // GENERATE 6 DIGIT OTP
    // ============================================================

    private String generateOtp() {

        SecureRandom random =
                new SecureRandom();


        int otp =
                100000 +
                random.nextInt(900000);


        return String.valueOf(otp);
    }


    // ============================================================
    // VERIFY OTP
    // ============================================================

    public String verifyOtp(
            VerifyOtpRequest request) {

        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();


        String enteredOtp =
                request.getOtp()
                        .trim();


        // ========================================================
        // GET STORED OTP
        // ========================================================

        OtpData otpData =
                otpStorage.get(email);


        if (otpData == null) {

            return "OTP not found. Please request a new OTP.";
        }


        // ========================================================
        // CHECK OTP EXPIRATION
        // ========================================================

        long currentTime =
                System.currentTimeMillis();


        long otpAge =
                currentTime -
                otpData.createdAt;


        if (otpAge > OTP_EXPIRATION_TIME) {

            otpStorage.remove(email);

            return "OTP has expired. Please request a new OTP.";
        }


        // ========================================================
        // CHECK OTP
        // ========================================================

        if (!otpData.otp.equals(enteredOtp)) {

            return "Invalid OTP.";
        }


        // ========================================================
        // OTP VERIFIED
        // ========================================================

        otpData.verified = true;


        return "OTP verified successfully.";
    }


    // ============================================================
    // RESET PASSWORD
    // ============================================================

    public String resetPassword(
            ResetPasswordRequest request) {

        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();


        // ========================================================
        // CHECK OTP VERIFICATION
        // ========================================================

        OtpData otpData =
                otpStorage.get(email);


        if (otpData == null) {

            return "Please verify OTP first.";
        }


        if (!otpData.verified) {

            return "Please verify OTP first.";
        }


        // ========================================================
        // CHECK OTP EXPIRATION AGAIN
        // ========================================================

        long currentTime =
                System.currentTimeMillis();


        long otpAge =
                currentTime -
                otpData.createdAt;


        if (otpAge > OTP_EXPIRATION_TIME) {

            otpStorage.remove(email);

            return "OTP has expired. Please request a new OTP.";
        }


        // ========================================================
        // ENCRYPT NEW PASSWORD
        // ========================================================

        String encryptedPassword =
                passwordEncoder.encode(
                        request.getNewPassword()
                );


        // ========================================================
        // UPDATE PASSWORD
        // ========================================================

        int updatedRows =
                forgotPasswordRepository.updatePassword(
                        email,
                        encryptedPassword
                );


        // ========================================================
        // CHECK UPDATE
        // ========================================================

        if (updatedRows <= 0) {

            return "Unable to update password.";
        }


        // ========================================================
        // REMOVE USED OTP
        // ========================================================

        otpStorage.remove(email);


        return "Password reset successfully.";
    }


    // ============================================================
    // OTP DATA CLASS
    // ============================================================

    private static class OtpData {

        private final String otp;

        private final long createdAt;

        private boolean verified;


        private OtpData(
                String otp,
                long createdAt) {

            this.otp = otp;

            this.createdAt = createdAt;

            this.verified = false;
        }
    }
}