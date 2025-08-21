package com.lms.domain;

/**
 * Enum representing the different statuses an enrollment can have
 */
public enum EnrollmentStatus {
    ACTIVE,      // Student is actively enrolled and participating
    COMPLETED,   // Student has completed the course
    DROPPED,     // Student has dropped the course
    SUSPENDED    // Student's enrollment is temporarily suspended
}
