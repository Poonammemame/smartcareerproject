package org.techhub.exception;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import lombok.AllArgsConstructor;
import lombok.Data;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // ==========================================
    // CUSTOM EXCEPTION
    // ==========================================

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ErrorResponse> handleCustomException(
            CustomException ex) {

        ErrorResponse error =
                new ErrorResponse(
                        HttpStatus.BAD_REQUEST.value(),
                        ex.getMessage(),
                        LocalDateTime.now()
                );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(error);
    }

    // ==========================================
    // VALIDATION EXCEPTION
    // ==========================================

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            MethodArgumentNotValidException ex) {

        String message =
                ex.getBindingResult()
                  .getFieldErrors()
                  .stream()
                  .findFirst()
                  .map(error ->
                      error.getField()
                      + ": "
                      + error.getDefaultMessage())
                  .orElse("Invalid request");

        ErrorResponse error =
                new ErrorResponse(
                        HttpStatus.BAD_REQUEST.value(),
                        message,
                        LocalDateTime.now()
                );

        return ResponseEntity
                .badRequest()
                .body(error);
    }

    // ==========================================
    // GENERAL EXCEPTION
    // ==========================================

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(
            Exception ex) {

        ErrorResponse error =
                new ErrorResponse(
                        HttpStatus.INTERNAL_SERVER_ERROR.value(),
                        "Something went wrong",
                        LocalDateTime.now()
                );

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(error);
    }

    // ==========================================
    // ERROR RESPONSE
    // ==========================================

    @Data
    @AllArgsConstructor
    static class ErrorResponse {

        private int status;

        private String message;

        private LocalDateTime timestamp;
    }
}