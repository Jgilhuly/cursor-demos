package com.lms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Main application class for the Learning Management System
 * 
 * This Spring Boot application provides a comprehensive LMS with:
 * - User management and authentication
 * - Course creation and management
 * - Student enrollment and progress tracking
 * - Assignment submission and grading
 * - Content delivery and assessment
 */
@SpringBootApplication
@EnableJpaAuditing
public class LmsApplication {

    public static void main(String[] args) {
        SpringApplication.run(LmsApplication.class, args);
    }
}
