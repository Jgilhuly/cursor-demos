package com.lms.repository;

import com.lms.domain.Assignment;
import com.lms.domain.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Assignment entity operations
 */
@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    
    /**
     * Find assignments by course
     */
    List<Assignment> findByCourse(Course course);
    
    /**
     * Find published assignments by course
     */
    List<Assignment> findByCourseAndIsPublishedTrue(Course course);
    
    /**
     * Find assignments by course ordered by due date
     */
    List<Assignment> findByCourseOrderByDueDateAsc(Course course);
}
