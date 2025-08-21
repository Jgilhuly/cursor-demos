package com.lms.domain;

/**
 * Enum representing the different roles a user can have in the LMS system
 * 
 * STUDENT: Can enroll in courses, submit assignments, view grades
 * INSTRUCTOR: Can create courses, manage assignments, grade submissions
 * ADMIN: Full system access, user management, system configuration
 */
public enum UserRole {
    STUDENT,
    INSTRUCTOR,
    ADMIN
}
