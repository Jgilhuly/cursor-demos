package com.lms.domain;

/**
 * Enum representing the different statuses an assignment submission can have
 */
public enum SubmissionStatus {
    SUBMITTED,   // Assignment has been submitted by student
    GRADED,      // Assignment has been graded by instructor
    RETURNED,    // Assignment has been returned to student for revision
    LATE         // Assignment was submitted after the due date
}
