package org.techhub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @org.springframework.beans.factory.annotation.Value("${spring.mail.username:sahulalima2002@gmail.com}")
    private String fromEmail;

    public boolean sendOtpEmail(String toEmail, String otp) {
        System.out.println("========================================");
        System.out.println("🚀 [EMAIL SERVICE] PASSWORD RESET OTP");
        System.out.println("From     : " + fromEmail);
        System.out.println("To Email : " + toEmail);
        System.out.println("OTP Code : " + otp);
        System.out.println("Validity : 10 Minutes");
        System.out.println("========================================");

        if (mailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail);
                message.setTo(toEmail);
                message.setSubject("PathFinder - Password Reset OTP");
                message.setText("Hello,\n\nYour OTP for resetting your PathFinder account password is: " 
                        + otp + "\n\nThis OTP is valid for 10 minutes.\nIf you did not request this, please ignore this email.\n\nBest regards,\nPathFinder Team");
                mailSender.send(message);
                System.out.println("✅ [EMAIL SERVICE] Email successfully dispatched to " + toEmail);
                return true;
            } catch (Exception e) {
                System.err.println("⚠️ [EMAIL SERVICE] Could not send email via SMTP: " + e.getMessage());
                e.printStackTrace();
                return false;
            }
        } else {
            System.err.println("⚠️ [EMAIL SERVICE] JavaMailSender is null (Mail configuration missing)");
            return false;
        }
    }
}